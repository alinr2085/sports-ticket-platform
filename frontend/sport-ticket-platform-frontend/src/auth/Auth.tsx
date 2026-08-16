import { useState } from "react";
import { SignupCard } from "./../auth/components/SignupCard";

import "./Auth.css";
import { LoginCard } from "./components/LoginCard";
export const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="auth-page">
      <div className="backdrop"></div>

      <div className="card">
        <div className="brand">
          <span className="brand-mark"></span>
          <span className="brand-name">Sports Ticket Reservation</span>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            id="tabLogin"
            onClick={() => setActiveTab("login")}
          >
            Sign in
          </button>
          <button
            className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
            id="tabSignup"
            onClick={() => setActiveTab("signup")}
          >
            Sign up
          </button>
        </div>
        <div className={`view ${activeTab === "login" ? "active" : ""}`}>
          {activeTab === "login" && <LoginCard />}
        </div>

        <div className={`view ${activeTab === "signup" ? "active" : ""}`}>
          {activeTab === "signup" && <SignupCard />}
        </div>
      </div>
    </div>
  );
};
