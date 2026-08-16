import { Elements } from "@stripe/react-stripe-js";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./auth/context/AuthContext";
import "./index.css";
import "./layouts/Notifications/css/Toast.css";
import { ToastProvider } from "./layouts/Notifications/ToastContext";
import { stripePromise } from "./lib/StripePromise";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>,
);
