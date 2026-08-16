import { useEffect, useRef, useState } from "react";
import { resendOtp, verifyOtp } from "../../api/AuthService";
import { useToast } from "../../layouts/Notifications/ToastContext";
import { SpinnerLoading } from "../../layouts/Utils/SpinnerLoading";

interface OtpStepProps {
  email: string;
  operation: string;
  initialRemainingSeconds?: number;
  backToStep1: () => void;
  onSuccess: (token: string, firstName: string, lastName: string) => void;
  showStepDots?: boolean;
  submitLabel?: string;
}

const OTP_VALID_SECONDS = 120;

export const OtpCard = ({
  email,
  operation,
  initialRemainingSeconds,
  backToStep1,
  onSuccess,
  showStepDots = false,
  submitLabel = "Verify",
}: OtpStepProps) => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    initialRemainingSeconds ?? OTP_VALID_SECONDS,
  );
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const showToast = useToast();

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("fill 6 digit code");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const authResponse = await verifyOtp(email, code, operation);
      onSuccess(
        authResponse.token,
        authResponse.firstName,
        authResponse.lastName,
      );
    } catch (err) {
      let message = "unknown error";
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          message = errorData.message || "unknown error";
        } catch {
          message = err.message;
        }
      }
      setError(message);
      showToast("Verification failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    try {
      const response = await resendOtp(email, operation);

      if (!response.otpSent) {
        setSecondsLeft(response.remainingSeconds);
        setError("کد قبلی هنوز معتبره، لطفاً صبر کنید.");
        return;
      }

      setSecondsLeft(response.remainingSeconds || OTP_VALID_SECONDS);
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      showToast("A new code has been sent.", "success");
    } catch (err) {
      setError("unknown error");
      showToast("Failed to resend code.", "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="step active" id="signup-step-2">
      {showStepDots && (
        <div className="step-dots">
          <span className="done"></span>
          <span className="done"></span>
        </div>
      )}

      <button className="back-link" onClick={() => backToStep1()}>
        &larr; Back
      </button>
      <div>
        <div className="head-line">Verify your contact</div>
        <div className="otp-target">Sent to {email}</div>
      </div>
      {error && <div className="error-msg show">{error}</div>}
      <div className="otp-row">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            maxLength={1}
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
          />
        ))}
      </div>

      <div className="otp-timer">
        {secondsLeft > 0 ? (
          <span>Code expires in {formatTime(secondsLeft)}</span>
        ) : (
          <button
            className="link-btn"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={() => handleVerify()}
        disabled={isLoading}
      >
        {isLoading ? <SpinnerLoading /> : submitLabel}
      </button>
    </div>
  );
};
