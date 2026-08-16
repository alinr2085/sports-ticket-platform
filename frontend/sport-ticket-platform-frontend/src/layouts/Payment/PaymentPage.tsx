import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useToast } from "../../layouts/Notifications/ToastContext";
import type { ReservationResponseModel } from "../../models/ReservationResponseModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import "./css/PaymentPage.css";

const sportEmojis: Record<string, string> = {
  football: "⚽",
  volleyball: "🏐",
  basketball: "🏀",
};

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      fontFamily: "Inter, sans-serif",
      color: "#F2F3F5",
      "::placeholder": {
        color: "#666D78",
      },
      iconColor: "#A2A8B2",
    },
    invalid: {
      color: "#FF6B6B",
      iconColor: "#FF6B6B",
    },
  },
};

export const PaymentPage = () => {
  const showToast = useToast();

  const location = useLocation();
  const { reservationId } = useParams();

  const [reservation, setReservation] =
    useState<ReservationResponseModel | null>(
      (location.state?.reservation as ReservationResponseModel) ?? null,
    );
  const [isLoading, setIsLoading] = useState(!location.state?.reservation);
  const [loadError, setLoadError] = useState(false);

  const [submitDisabled, setDisabled] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (reservation || !reservationId) return;

    const fetchReservation = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/reservations/${reservationId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!response.ok) throw new Error("Failed to load reservation");
        setReservation(await response.json());
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId, reservation, token]);

  async function handlePayment() {
    if (!stripe || !elements || !reservation) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setDisabled(true);

    try {
      const intentResponse = await fetch(
        `http://localhost:8082/payment/create-intent/${reservation.reservationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!intentResponse.ok)
        throw new Error("Failed to create payment intent");

      const { client_secret } = await intentResponse.json();

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        showToast(
          result.error.message ||
            "Payment failed. Please check your card details.",
          "error",
        );
        return;
      }

      const completeResponse = await fetch(
        `http://localhost:8082/payment/complete/${reservation.reservationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
          }),
        },
      );

      if (!completeResponse.ok) throw new Error("Failed to finalize payment");

      showToast("Payment successful! Your ticket has been issued.", "success");
    } catch {
      showToast("Payment failed. Please check your card details.", "error");
    } finally {
      setDisabled(false);
    }
  }

  if (isLoading) return <SpinnerLoading />;

  if (loadError || !reservation) {
    return (
      <div className="pp2-wrap">
        <p className="pp2-msg">Reservation not found.</p>
      </div>
    );
  }

  if (reservation.status?.toLowerCase() !== "reserved") {
    return (
      <div className="pp2-wrap">
        <p className="pp2-msg">
          This reservation is no longer available for payment (status:{" "}
          {reservation.status}).
        </p>
      </div>
    );
  }

  const sport = (reservation.sportName || "football").toLowerCase();

  return (
    <div className="pp2-wrap">
      <div className="pp2-layout">
        <div className="pp2-summary">
          <span className="pp2-sport-badge">
            {sportEmojis[sport] || "🏅"} {reservation.sportName}
          </span>

          <div className="pp2-match">
            <div className="pp2-team">{reservation.homeTeamName}</div>
            <div className="pp2-vs">VS</div>
            <div className="pp2-team">{reservation.awayTeamName}</div>
          </div>

          <div className="pp2-summary-divider" />

          <div className="pp2-summary-row">
            <span>Stadium</span>
            <b>{reservation.stadiumName}</b>
          </div>
          <div className="pp2-summary-row">
            <span>Category</span>
            <b>{reservation.ticketCategoryName}</b>
          </div>
          <div className="pp2-summary-row">
            <span>Section</span>
            <b>{reservation.sectionNumber}</b>
          </div>

          <div className="pp2-summary-divider" />

          <div className="pp2-summary-row pp2-total">
            <span>Total</span>
            <b>${Number(reservation.ticketPrice).toFixed(2)}</b>
          </div>
        </div>

        {/* ===== PAYMENT FORM ===== */}
        <div className="pp2-form">
          <div className="pp2-form-head">
            <div className="pp2-form-title">Payment details</div>
            <div className="pp2-form-sub">Secured by Stripe</div>
          </div>

          <div className="pp2-field">
            <label>Card information</label>
            <div className="pp2-card-element">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <button
            disabled={submitDisabled || !stripe}
            className="pp2-pay-btn"
            onClick={handlePayment}
          >
            {submitDisabled
              ? "Processing..."
              : `Pay $${Number(reservation.ticketPrice).toFixed(2)}`}
          </button>

          <div className="pp2-secure-note">
            🔒 Your payment is encrypted and secure
          </div>

          {submitDisabled && <SpinnerLoading />}
        </div>
      </div>
    </div>
  );
};
