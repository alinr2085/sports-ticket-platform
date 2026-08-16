package com.example.sportTicket.service;

import com.example.sportTicket.dao.UserDao;
import com.example.sportTicket.dto.request.LoginRequest;
import com.example.sportTicket.dto.request.SignUpRequest;
import com.example.sportTicket.dto.response.AuthResponse;
import com.example.sportTicket.dto.response.OtpRequiredResponse;
import com.example.sportTicket.dto.response.UserProfile;
import com.example.sportTicket.entity.City;
import com.example.sportTicket.entity.User;
import com.example.sportTicket.exception.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
    private final OTPService otpService;
    private final CityService cityService;
    private final UserCacheService userCacheService;

    public UserService(UserDao userDao, PasswordEncoder passwordEncoder, JWTService jwtService,
                       OTPService otpService, CityService cityService, UserCacheService userCacheService) {
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.cityService = cityService;
        this.userCacheService = userCacheService;
    }

    public OtpRequiredResponse signUp(SignUpRequest signUpRequest) {
        String email = signUpRequest.getEmail(), password = signUpRequest.getPassword();
        Optional<User> userOptional = userDao.findByEmail(email);
        if (userOptional.isPresent()) {
            if (userOptional.get().getAccountStatus().equals("ACTIVE"))
                throw new DuplicatedEmailException(email);
            else
                userDao.deleteByEmail(email);
        }
        String pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!_\\-.,?*()\\[\\]{}]).{8,}$";
        if (!password.matches(pattern)) {
            throw new WeakPasswordException();
        }

        User user = new User();
        user.setEmail(email);
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        String cityName = signUpRequest.getCityName();
        if (cityName != null && !cityName.isBlank()) {
            user.setCityId(cityService.findOrCreateCity(cityName));
        } else {
            user.setCityId(null);
        }
        user.setRole("USER");
        user.setAccountStatus("PENDING");
        user.setDateOfBirth(signUpRequest.getDateOfBirth());
        user.setRegistrationDate(LocalDate.now());
        user.setHashedPassword(passwordEncoder.encode(password));
        userDao.save(user);

        boolean sent = otpService.generateAndSendOTP(user.getEmail());
        long remaining = otpService.getRemainingSeconds(user.getEmail());

        OtpRequiredResponse otpRequiredResponse = new OtpRequiredResponse();
        otpRequiredResponse.setEmail(email);
        otpRequiredResponse.setOperation("register");
        otpRequiredResponse.setOtpSent(sent);
        otpRequiredResponse.setRemainingSeconds(remaining);
        return otpRequiredResponse;
    }


    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> user = userDao.findByEmail(loginRequest.getEmail());
        if (user.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), user.get().getHashedPassword())) {
            throw new InvalidLoginDataException();
        }

        return generateAuthResponse(user.get());
    }

    public OtpRequiredResponse loginWithOtp(String email) {
        Optional<User> user = userDao.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException();
        }

        boolean sent = otpService.generateAndSendOTP(email);
        long remaining = otpService.getRemainingSeconds(email);

        OtpRequiredResponse otpRequiredResponse = new OtpRequiredResponse();
        otpRequiredResponse.setEmail(email);
        otpRequiredResponse.setOperation("login");
        otpRequiredResponse.setOtpSent(sent);
        otpRequiredResponse.setRemainingSeconds(remaining);
        return otpRequiredResponse;
    }

    private AuthResponse generateAuthResponse(User user) {
        AuthResponse authResponse = new AuthResponse();
        authResponse.setToken(jwtService.generateToken(user.getEmail(), user.getRole()));
        authResponse.setFirstName(user.getFirstName());
        authResponse.setLastName(user.getLastName());
        authResponse.setRole(user.getRole());
        return authResponse;
    }

    public AuthResponse verifyOtp(OtpRequiredResponse otpRequiredResponse) {
        if (otpService.verifyOTP(otpRequiredResponse.getEmail(), otpRequiredResponse.getCode())) {
            User user = userDao.findByEmail(otpRequiredResponse.getEmail()).orElseThrow(UserNotFoundException::new);
            if (otpRequiredResponse.getOperation().equals("register") && user.getAccountStatus().equals("PENDING")) {
                userDao.updateStatus(user.getUserId(), "ACTIVE");
                user.setAccountStatus("ACTIVE");
            }
            return generateAuthResponse(user);
        }
        throw new InvalidOtpException();
    }

    public Long getUserIdByEmail(String email) {
        return userDao.findByEmail(email).orElseThrow(UserNotFoundException::new).getUserId();
    }

    public UserProfile getUserProfile(String email) throws Exception {
        UserProfile cached = userCacheService.getCachedProfile(email);
        if (cached != null) {
            return cached;
        }

        Optional<User> user = userDao.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException();
        }
        UserProfile userProfile = new UserProfile();
        userProfile.setEmail(user.get().getEmail());
        userProfile.setFirstName(user.get().getFirstName());
        userProfile.setLastName(user.get().getLastName());
        userProfile.setPhoneNumber(user.get().getPhoneNumber());
        userProfile.setDateOfBirth(user.get().getDateOfBirth());
        Long cityId = user.get().getCityId();
        if (cityId != null) {
            try {
                userProfile.setCity(cityService.findCityById(cityId));
            } catch (Exception e) {
                userProfile.setCity(null);
            }
        } else {
            userProfile.setCity(null);
        }
        userCacheService.cacheProfile(email, userProfile);
        return userProfile;
    }

    public void updateUserProfile(String email, UserProfile userProfile, String newPassword, String oldPassword) {
        Optional<User> user = userDao.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException();
        }
        if (!email.equals(userProfile.getEmail())
                && userDao.findByEmail(userProfile.getEmail()).isPresent()) {
            throw new DuplicatedEmailException(userProfile.getEmail());
        }
        if (newPassword != null) {
            if (!passwordEncoder.matches(oldPassword, user.get().getHashedPassword())) {
                throw new InvalidLoginDataException();
            }
            user.get().setHashedPassword(passwordEncoder.encode(newPassword));
        }

        user.get().setEmail(userProfile.getEmail());
        user.get().setFirstName(userProfile.getFirstName());
        user.get().setLastName(userProfile.getLastName());
        user.get().setPhoneNumber(userProfile.getPhoneNumber());
        user.get().setDateOfBirth(userProfile.getDateOfBirth());
        if (userProfile.getCity() != null)
            user.get().setCityId(userProfile.getCity().getCityId());
        userDao.update(user.get());
        userCacheService.evictProfile(email);
        userCacheService.evictProfile(userProfile.getEmail());
    }

}
