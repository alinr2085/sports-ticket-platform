import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerLoading } from "../../layouts/Utils/SpinnerLoading";
import { useAuth } from "../context/AuthContext";
import { signUp } from "./../../api/AuthService";
import { OtpCard } from "./OtpCard";

export const SignupCard = () => {
  const [step, setStep] = useState(1);
  const [otpTarget, setOtpTarget] = useState({
    email: "",
    operation: "",
    remainingSeconds: 120,
  });
  const { login: loginToContext, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    cityName: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, []);

  const update =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");

    if (!formData.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const otpResponse = await signUp(formData);
      setOtpTarget({
        email: otpResponse.email,
        operation: otpResponse.operation,
        remainingSeconds: otpResponse.remainingSeconds,
      });
      setStep(2);
    } catch (err) {
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          setError(errorData.message || "خطای ناشناخته");
          console.log(errorData.message);
        } catch {
          setError(err.message);
        }
      } else {
        setError("خطای ناشناخته");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error-msg show">{error}</div>}
      <div className="view active" id="view-signup">
        {step === 1 && (
          <div className="step active" id="signup-step-1">
            <div className="step-dots">
              <span className="done"></span>
              <span></span>
            </div>
            <div>
              <div className="head-line">Create your account</div>
              <div className="head-sub">
                We'll verify your contact with a code next
              </div>
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="suFirst">First name</label>
                <input
                  type="text"
                  id="suFirst"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={update("firstName")}
                />
              </div>
              <div className="field">
                <label htmlFor="suLast">Last name</label>
                <input
                  type="text"
                  id="suLast"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={update("lastName")}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="suEmail">Email</label>
              <input
                type="email"
                id="suEmail"
                placeholder="you@example.com"
                value={formData.email}
                onChange={update("email")}
              />
            </div>

            <div className="field">
              <label htmlFor="suPhone">Phone number</label>
              <input
                type="tel"
                id="suPhone"
                placeholder="+98912xxxxxxx"
                value={formData.phoneNumber}
                onChange={update("phoneNumber")}
              />
            </div>

            <div className="row2">
              <div className="field">
                <label htmlFor="suPass">Password</label>
                <input
                  type="password"
                  id="suPass"
                  value={formData.password}
                  onChange={update("password")}
                />
              </div>
              <div className="field">
                <label htmlFor="suPass2">Confirm password</label>
                <input
                  type="password"
                  id="suPass2"
                  value={formData.confirmPassword}
                  onChange={update("confirmPassword")}
                />
              </div>
              <div className="field">
                <label htmlFor="suDob">Date of birth</label>
                <input
                  type="date"
                  id="suDob"
                  value={formData.dateOfBirth}
                  onChange={update("dateOfBirth")}
                />
              </div>

              <div className="field">
                <label htmlFor="suCity">City</label>
                <input
                  type="text"
                  id="suCity"
                  placeholder="Tehran"
                  value={formData.cityName}
                  onChange={update("cityName")}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => handleSubmit()}
              disabled={isLoading}
            >
              {isLoading ? <SpinnerLoading /> : "Continue to verification"}
            </button>
            <div className="foot-note">
              By signing up, you agree to the Terms and Privacy Policy.
            </div>
          </div>
        )}

        {step === 2 && (
          <OtpCard
            email={otpTarget.email}
            operation={otpTarget.operation}
            initialRemainingSeconds={otpTarget.remainingSeconds}
            backToStep1={() => setStep(1)}
            onSuccess={(token, firstName, lastName) => {
              loginToContext(token, { firstName, lastName, role: "USER" });
              navigate("/");
            }}
            showStepDots
            submitLabel="Verify and create account"
          />
        )}
      </div>
    </div>
  );
};
