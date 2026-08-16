import { useState } from "react";
import type { TicketResponseModel } from "../../../models/TicketResponseModel";
import { useToast } from "../../Notifications/ToastContext";
import "./../css/UserTickets.css";

const sportEmojis: Record<string, string> = {
  football: "⚽",
  volleyball: "🏐",
  basketball: "🏀",
};

const CANCELLATION_PENALTY_PERCENT = 20;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (dt: string) => {
  if (!dt) return "—";
  return dt.replace("T", " ").slice(0, 16);
};

interface UserTicketCardProps {
  ticket: TicketResponseModel;
  onCancelled?: (ticketId: number) => void;
}

export const UserTicketCard = ({
  ticket,
  onCancelled,
}: UserTicketCardProps) => {
  const showToast = useToast();
  const token = localStorage.getItem("token");

  const sport = (ticket.sportName || "football").toLowerCase();
  const status = (ticket.status || "").toLowerCase();

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [showFeePopup, setShowFeePopup] = useState(false);

  const price = Number(ticket.price) || 0;
  const penaltyAmount = price * (CANCELLATION_PENALTY_PERCENT / 100);
  const refundAmount = price - penaltyAmount;

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this ticket?\nCancellation fee will apply.",
    );

    if (!confirmed) return;

    if (!token) {
      setCancelError("You are not authenticated.");
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      const response = await fetch(
        `http://localhost:8082/reservations/by-ticket/${ticket.ticketId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to cancel ticket");
      }

      const data = await response.json();

      if (data.result === "pending_review") {
        showToast(
          "Your cancellation request has been submitted for review.",
          "info",
        );
      } else {
        showToast("Ticket cancelled successfully.", "success");
      }

      onCancelled?.(ticket.ticketId);
    } catch (err) {
      setCancelError(
        err instanceof Error ? err.message : "Failed to cancel ticket",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = status === "sold" || status === "confirmed";

  return (
    <div className={`utc-card utc-sport-${sport}`}>
      <div className="utc-card-inner">
        {/* TOP */}
        <div className="utc-card-top">
          <span className="utc-sport-badge">
            {sportEmojis[sport] || "🏅"} {ticket.sportName}
          </span>

          <div className="utc-top-right">
            <span className="utc-ticket-code">#TKT-{ticket.ticketId}</span>

            <span className={`utc-status-pill utc-status-${status}`}>
              {ticket.status}
            </span>
          </div>
        </div>

        {/* MATCH */}
        <div className="utc-match-row">
          <div className="utc-team-block utc-home">
            <div className="utc-team-crest">
              {initials(ticket.homeTeamName)}
            </div>
            <div className="utc-team-info">
              <div className="utc-team-name">{ticket.homeTeamName}</div>
              <div className="utc-team-sub">Home</div>
            </div>
          </div>

          <div className="utc-sport-center">{sportEmojis[sport] || "🏅"}</div>

          <div className="utc-team-block utc-away">
            <div className="utc-team-crest">
              {initials(ticket.awayTeamName)}
            </div>
            <div className="utc-team-info">
              <div className="utc-team-name">{ticket.awayTeamName}</div>
              <div className="utc-team-sub">Away</div>
            </div>
          </div>
        </div>

        {/* META */}
        <div className="utc-meta-grid">
          <div className="utc-meta-item">
            <span className="utc-meta-label">Stadium</span>
            <span className="utc-meta-value">{ticket.stadiumName}</span>
          </div>

          <div className="utc-meta-item">
            <span className="utc-meta-label">City</span>
            <span className="utc-meta-value">{ticket.cityName}</span>
          </div>

          <div className="utc-meta-item">
            <span className="utc-meta-label">Match Date</span>
            <span className="utc-meta-value utc-mono">
              {formatDate(ticket.matchDate)}
            </span>
          </div>

          <div className="utc-meta-item">
            <span className="utc-meta-label">Category</span>
            {ticket.ticketCategoryName?.toLowerCase() === "vip" ? (
              <span className="utc-category-vip">★ VIP</span>
            ) : (
              <span className="utc-category-standard">Standard</span>
            )}
          </div>

          <div className="utc-meta-item">
            <span className="utc-meta-label">Section</span>
            <span className="utc-meta-value utc-mono">
              Section {ticket.sectionNumber}
            </span>
          </div>

          <div className="utc-meta-item">
            <span className="utc-meta-label">Price</span>
            <span className="utc-meta-value utc-mono">${price.toFixed(2)}</span>
          </div>
        </div>

        <div className="utc-divider"></div>

        {cancelError && <div className="utc-error-msg">{cancelError}</div>}

        {/* ACTIONS */}
        {canCancel && (
          <div className="utc-card-actions">
            <div className="utc-actions-left">
              <span className="utc-ticket-capacity">
                Section {ticket.sectionNumber}
              </span>
            </div>

            <div className="utc-actions-right">
              <div
                className="utc-fee-anchor"
                onMouseEnter={() => setShowFeePopup(true)}
                onMouseLeave={() => setShowFeePopup(false)}
              >
                {showFeePopup && (
                  <div className="utc-fee-popup">
                    <div className="utc-fee-popup-title">Cancellation Fee</div>
                    <div className="utc-fee-row">
                      <span className="utc-fee-key">Original price</span>
                      <span className="utc-fee-val">${price.toFixed(2)}</span>
                    </div>
                    <div className="utc-fee-row">
                      <span className="utc-fee-key">
                        Penalty ({CANCELLATION_PENALTY_PERCENT}%)
                      </span>
                      <span className="utc-fee-val utc-red">
                        -${penaltyAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="utc-fee-row">
                      <span className="utc-fee-key">You get back</span>
                      <span className="utc-fee-val utc-green">
                        ${refundAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  className="utc-btn utc-btn-danger"
                  onClick={handleCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Ticket"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
