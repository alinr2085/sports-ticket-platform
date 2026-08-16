package com.example.sportTicket.service;

import com.example.sportTicket.dao.PaymentDao;
import com.example.sportTicket.dao.ReservationDao;
import com.example.sportTicket.entity.Payment;
import com.example.sportTicket.entity.Reservation;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final ReservationDao reservationDao;
    private final PaymentDao paymentDao;
    private final ReservationService reservationService;

    public PaymentService(ReservationDao reservationDao, PaymentDao paymentDao,
                          ReservationService reservationService) {
        this.reservationDao = reservationDao;
        this.paymentDao = paymentDao;
        this.reservationService = reservationService;
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public String createPaymentIntent(Long reservationId, Long userId) throws StripeException {
        Reservation reservation = reservationDao.findById(reservationId);
        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only pay for your own reservation.");
        }
        if (!"reserved".equalsIgnoreCase(reservation.getStatus())) {
            throw new IllegalStateException("This reservation cannot be paid for (status: " + reservation.getStatus() + ").");
        }

        long amountInCents = reservationDao.getTicketPriceInCents(reservationId);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency("usd")
                .putMetadata("reservationId", String.valueOf(reservationId))
                .putMetadata("userId", String.valueOf(userId))
                .build();

        PaymentIntent intent = PaymentIntent.create(params);

        Payment payment = new Payment();
        payment.setReservationId(reservationId);
        payment.setUserId(userId);
        payment.setAmount(amountInCents / 100.0);
        payment.setCurrency("USD");
        payment.setMethod("card");
        payment.setStatus("pending");
        payment.setTransactionId(intent.getId());
        paymentDao.insert(payment);

        return intent.getClientSecret();
    }

    @Transactional
    public boolean completePayment(Long reservationId, Long userId, String paymentIntentId) throws Exception {
        Reservation reservation = reservationDao.findById(reservationId);
        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only pay for your own reservation.");
        }
        Optional<Payment> payment = paymentDao.findByTransactionId(paymentIntentId);
        if (payment.isEmpty()) {
            throw new NoSuchElementException("Payment record not found for this transaction.");
        }
        if (!payment.get().getReservationId().equals(reservationId)) {
            throw new IllegalStateException("Payment does not match this reservation.");
        }
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(intent.getStatus())) {
            throw new IllegalStateException("Payment was not successful.");
        }
        paymentDao.updateStatusByTransactionId(paymentIntentId, "succeeded");
        reservationService.confirmReservationWithoutPayment(reservationId);

        return true;
    }
}