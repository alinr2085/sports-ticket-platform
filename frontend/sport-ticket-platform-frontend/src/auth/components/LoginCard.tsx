import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithForgetPassword } from "../../api/AuthService";
import { useToast } from "../../layouts/Notifications/ToastContext";
import { useAuth } from "../context/AuthContext";
import { OtpCard } from "./OtpCard";

export const LoginCard = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [method, setMethod] = useState("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpOperation, setOtpOperation] = useState("login");
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(120);

  const { login: loginToContext, logout } = useAuth();
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    logout();
  }, []);

  const handlePassword = async () => {
    setError("");
    setIsLoading(true);
    try {
      const authResponse = await login({ email, password });
      loginToContext(authResponse.token, {
        firstName: authResponse.firstName,
        lastName: authResponse.lastName,
        role: authResponse.role,
      });
      setRole(authResponse.role);
      showToast(`Welcome back, ${authResponse.firstName}!`, "success");
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطای ناشناخته";
      setError(message);
      showToast("Login failed. Please check your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setIsLoading(true);
    try {
      const authResponse = await loginWithForgetPassword(email);
      setOtpOperation(authResponse.operation);
      setOtpRemainingSeconds(authResponse.remainingSeconds);
      setStep(2);
      showToast("Verification code sent to your email.", "info");
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      setError(message);
      showToast("Failed to send verification code.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-msg">{error}</div>}
      {step === 1 && (
        <div className="step active" id="login-step-1">
          <div>
            <div className="head-line">Welcome back</div>
            <div className="head-sub">
              Sign in, then confirm with a one-time code
            </div>
          </div>

          <div className="method-switch">
            <button
              type="button"
              className={`method-pill ${method === "password" ? "active" : ""}`}
              onClick={() => setMethod("password")}
            >
              Password
            </button>
            <button
              type="button"
              className={`method-pill ${method === "otp" ? "active" : ""}`}
              onClick={() => setMethod("otp")}
            >
              Forgot Password
            </button>
          </div>

          {method === "password" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="field">
                <label htmlFor="loginId">Email</label>
                <input
                  type="text"
                  id="loginId"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="loginPass">Password</label>
                <input
                  type="password"
                  id="loginPass"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                onClick={handlePassword}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Continue"}
              </button>
            </div>
          )}

          {method === "otp" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="field">
                <label htmlFor="otpId">Email</label>
                <input
                  type="text"
                  id="otpId"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                className="btn-primary"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? "..." : "Send code"}
              </button>
            </div>
          )}
        </div>
      )}
      {step === 2 && (
        <OtpCard
          email={email}
          operation={otpOperation}
          initialRemainingSeconds={otpRemainingSeconds}
          backToStep1={() => setStep(1)}
          onSuccess={(token, firstName, lastName) => {
            loginToContext(token, {
              firstName,
              lastName,
              role: role,
            });

            showToast("Signed in successfully!", "success");
            navigate("/");
          }}
          submitLabel="Verify and sign in"
        />
      )}
    </div>
  );
};
