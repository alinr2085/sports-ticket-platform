import { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../../../layouts/Notifications/ToastContext";
import type { ReservationResponseModel } from "../../../models/ReservationResponseModel";
import "./../css/Reservation.css";

const sportEmojis: Record<string, string> = {
  football: "⚽",
  volleyball: "🏐",
  basketball: "🏀",
};

interface ReservationCardProps {
  reservation: ReservationResponseModel;
  onUpdated?: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const formatDate = (dt?: string) => {
  if (!dt) return "—";
  return String(dt).replace("T", " ").slice(0, 16);
};

const StatusPill = ({ status }: { status: string | null | undefined }) => {
  if (!status) {
    return <span className="rc-status-pill rc-pending">—</span>;
  }
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`rc-status-pill rc-${status}`}>{label}</span>;
};

const getRoleFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? null;
  } catch {
    return null;
  }
};

export const ReservationCard = ({
  reservation,
  onUpdated,
}: ReservationCardProps) => {
  const showToast = useToast();

  const navigate = useNavigate();
  const role = getRoleFromToken();
  const [minuts, setMinuts] = useState(0);
  const isSupport =
    role?.toLowerCase() === "support" || role?.toLowerCase() === "admin";
  const sport = (reservation.sportName || "football").toLowerCase();

  const [loadingAction, setLoadingAction] = useState<
    "cancel" | "confirm" | "extend" | null
  >(null);
  const [actionError, setActionError] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handlePayNow = () => {
    if (reservation.status?.toLowerCase() !== "reserved") return;
    navigate(`/payment/${reservation.reservationId}`, {
      state: { reservation },
    });
  };

  const handleCancel = async () => {
    setLoadingAction("cancel");
    setActionError("");
    try {
      const response = await fetch(
        `http://localhost:8082/reservations/${reservation.reservationId}/cancel`,
        { method: "POST", headers: authHeaders },
      );
      if (!response.ok) throw new Error("Cancel failed");
      showToast("your reservation has been canceled");
      onUpdated?.();
    } catch (err) {
      showToast("error in reservation cancellation");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExtend = async () => {
    if (!isSupport) return;
    setLoadingAction("extend");
    setActionError("");
    try {
      const response = await fetch(
        `http://localhost:8082/reservations/${reservation.reservationId}/extend?minutes=${minuts}`,
        { method: "POST", headers: authHeaders },
      );
      if (!response.ok) throw new Error("Extend failed");
      onUpdated?.();
    } catch (err) {
      showToast("error on expiration");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirm = async () => {
    if (!isSupport) return;
    setLoadingAction("confirm");
    setActionError("");
    try {
      const response = await fetch(
        `http://localhost:8082/reservations/${reservation.reservationId}/confirm`,
        { method: "POST", headers: authHeaders },
      );
      if (!response.ok) throw new Error("Confirm failed");
      showToast("reservation has been confirmed");
      onUpdated?.();
    } catch (err) {
      showToast("error in reservation confirm");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className={`rc-card rc-sport-${sport}`}>
      <div className="rc-card-inner">
        <div className="rc-card-top">
          <span className="rc-sport-badge">
            {sportEmojis[sport] || "🏅"} {reservation.sportName}
          </span>
          <div className="rc-top-right">
            <span className="rc-res-id">#RES-{reservation.reservationId}</span>
            <StatusPill status={reservation.status} />
          </div>
        </div>

        <div className="rc-match-row">
          <div className="rc-team-block rc-home">
            <div className="rc-team-crest">
              {initials(reservation.homeTeamName)}
            </div>
            <div className="rc-team-info">
              <div className="rc-team-name">{reservation.homeTeamName}</div>
              <div className="rc-team-sub">Home</div>
            </div>
          </div>
          <div className="rc-sport-center">{sportEmojis[sport] || "🏅"}</div>
          <div className="rc-team-block rc-away">
            <div className="rc-team-crest">
              {initials(reservation.awayTeamName)}
            </div>
            <div className="rc-team-info">
              <div className="rc-team-name">{reservation.awayTeamName}</div>
              <div className="rc-team-sub">Away</div>
            </div>
          </div>
        </div>

        <div className="rc-meta-grid">
          <div className="rc-meta-item">
            <span className="rc-meta-label">Stadium</span>
            <span className="rc-meta-value">{reservation.stadiumName}</span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Match Date</span>
            <span className="rc-meta-value rc-mono">
              {formatDate(reservation.matchDate)}
            </span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Category</span>
            <span className="rc-meta-value">
              {reservation.ticketCategoryName}
            </span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Section</span>
            <span className="rc-meta-value rc-mono">
              {reservation.sectionNumber}
            </span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Price</span>
            <span className="rc-meta-value rc-mono">
              ${Number(reservation.ticketPrice).toFixed(2)}
            </span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Reserved At</span>
            <span className="rc-meta-value rc-mono">
              {formatDate(reservation.reservationDate)}
            </span>
          </div>
          <div className="rc-meta-item">
            <span className="rc-meta-label">Expires At</span>
            <span className="rc-meta-value rc-mono">
              {formatDate(reservation.expiresAt)}
            </span>
          </div>
        </div>

        {isSupport && (
          <div className="rc-support-section rc-visible">
            <span className="rc-support-label">Support Info</span>
            <div className="rc-support-grid">
              <div className="rc-meta-item">
                <span className="rc-meta-label">User ID</span>
                <span className="rc-meta-value rc-mono">
                  {reservation.userId}
                </span>
              </div>
              <div className="rc-meta-item">
                <span className="rc-meta-label">User Email</span>
                <span className="rc-meta-value">{reservation.userEmail}</span>
              </div>
              <div className="rc-meta-item">
                <span className="rc-meta-label">Payment ID</span>
                <span className="rc-meta-value rc-mono">
                  #PAY-{reservation.paymentId}
                </span>
              </div>
              <div className="rc-meta-item">
                <span className="rc-meta-label">Payment Status</span>
                <StatusPill status={reservation.paymentStatus} />
              </div>
              <div className="rc-meta-item">
                <span className="rc-meta-label">Payment Amount</span>
                <span className="rc-meta-value rc-mono">
                  {Number(reservation.paymentAmount).toLocaleString()} T
                </span>
              </div>
            </div>
          </div>
        )}

        {actionError && <div className="rc-action-error">{actionError}</div>}

        <div className="rc-divider"></div>

        <div className="rc-card-actions">
          {isSupport ? (
            <>
              <input
                className="rc-btn rc-btn-amber"
                type="number"
                placeholder="Extended minuts"
                onChange={(e) => setMinuts(parseInt(e.target.value, 10))}
              ></input>
              <button
                className="rc-btn rc-btn-amber"
                onClick={handleExtend}
                disabled={loadingAction === "extend"}
              >
                {loadingAction === "extend" ? "Extending..." : "Extend Expiry"}
              </button>
              <button
                className="rc-btn rc-btn-green"
                onClick={handleConfirm}
                disabled={loadingAction === "confirm"}
              >
                {loadingAction === "confirm" ? "Confirming..." : "Confirm"}
              </button>
              <button
                className="rc-btn rc-btn-danger"
                onClick={handleCancel}
                disabled={loadingAction === "cancel"}
              >
                {loadingAction === "cancel" ? "Cancelling..." : "Cancel"}
              </button>
            </>
          ) : (
            <>
              <button
                className="rc-btn rc-btn-outline"
                onClick={handleCancel}
                disabled={loadingAction === "cancel"}
              >
                {loadingAction === "cancel" ? "Cancelling..." : "Cancel"}
              </button>
              <button
                className="rc-btn rc-btn-primary"
                onClick={handlePayNow}
                disabled={reservation.status?.toLowerCase() !== "reserved"}
              >
                Pay Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
