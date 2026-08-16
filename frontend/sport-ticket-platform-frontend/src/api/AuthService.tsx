const BASE_URL = "http://localhost:8082/user/auth";

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string | null;
  cityName: string | null;
}

export interface OtpRequiredResponse {
  email: string;
  operation: string;
  code?: string;
  otpSent: boolean;
  remainingSeconds: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  firstName: string;
  lastName: string;
  role: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "خطایی رخ داد");
  }
  return response.json();
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<AuthResponse>(response);
};

export const verifyOtp = async (
  email: string,
  code: string,
  operation: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, operation }),
  });
  return handleResponse<AuthResponse>(response);
};

export const signUp = async (
  data: SignUpRequest,
): Promise<OtpRequiredResponse> => {
  const requestData = {
    ...data,
    dateOfBirth: data.dateOfBirth || null,
    cityName: data.cityName || null,
  };
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  return handleResponse<OtpRequiredResponse>(response);
};

export const loginWithForgetPassword = async (
  email: string,
): Promise<OtpRequiredResponse> => {
  const response = await fetch(
    `${BASE_URL}/login/forget-password/${encodeURIComponent(email)}`,
    { method: "POST" },
  );
  return handleResponse<OtpRequiredResponse>(response);
};

export const resendOtp = async (
  email: string,
  operation: string,
): Promise<OtpRequiredResponse> => {
  const response = await fetch(
    `${BASE_URL}/resend-otp?email=${encodeURIComponent(email)}&operation=${encodeURIComponent(operation)}`,
    { method: "POST" },
  );
  return handleResponse<OtpRequiredResponse>(response);
};
