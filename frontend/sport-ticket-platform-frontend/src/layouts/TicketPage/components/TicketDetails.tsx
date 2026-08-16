import { useState } from "react";
import { useLocation } from "react-router";
import type { TicketResponseModel } from "../../../models/TicketResponseModel";
import { useToast } from "../../Notifications/ToastContext";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { teamIcons } from "../../Utils/TeamIcons";
import "./../css/TicketDetails.css";

const sportImages: Record<string, string> = {
  Football:
    "https://pikfree.ir/wp-content/uploads/edd/2021/05/stage-lighting-background-3d-Top.jpg",
  Volleyball:
    "https://tiktarh.com/storage/images/product_image/68c91f4812bbcd63610bf9d3/1758011357-Shsprt1004247(www.tiktarh.com).jpg",
  Basketball:
    "https://tiktarh.com/storage/images/product_image/68d7cd4890e14d032f0ff5fb/1758974032-Shsprt1004605(www.tiktarh.com).jpg",
};

export const TicketDetails = () => {
  const showToast = useToast();

  const location = useLocation();
  const ticket = location.state?.ticket as TicketResponseModel;
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState(false);

  if (!ticket) {
    return (
      <div className="ticket-card-details">
        <p>Ticket information not found.</p>
      </div>
    );
  }

  const unitPrice = ticket.price ?? 0;
  const remainingCapacity = ticket.remainingCapacity ?? 0;
  const isLowCapacity = remainingCapacity > 0 && remainingCapacity <= 10;
  const isSoldOut = remainingCapacity <= 0;

  const matchDateObj = ticket.matchDate ? new Date(ticket.matchDate) : null;
  const formattedDate = matchDateObj
    ? matchDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";
  const formattedTime = matchDateObj
    ? matchDateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "N/A";
  const shortDate = matchDateObj
    ? matchDateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const backgroundImage = ticket.sportName
    ? sportImages[ticket.sportName]
    : undefined;

  const isVip = ticket.ticketCategoryName?.toLowerCase() === "vip";

  const handleReserve = async () => {
    try {
      if (isSoldOut) return;
      const url = `http://localhost:8082/reservations/new?ticketId=${ticket.ticketId}`;
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        showToast("Failed to reserve ticket.", "error");
        return;
      }

      showToast("Ticket reserved successfully!", "success");
    } catch (err) {
      showToast("Failed to reserve ticket.", "error");
      setHttpError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>Error loading reservations.</p>
      </div>
    );
  }

  return (
    <div className="ticket-card-details">
      <div className="ticket-visual">
        {backgroundImage && (
          <img
            className="visual-bg"
            src={backgroundImage}
            alt={ticket.sportName ?? ""}
          />
        )}
        <div className="visual-gradient"></div>

        <div className="date-tag date-tag-large">{shortDate}</div>

        <div className="visual-center">
          <div className="teams-row ">
            <div className="team-ticket text-white fw-bold home">
              <img
                src={teamIcons[ticket.homeTeamName]}
                className="team-icon1"
                width={50}
                height={50}
              />{" "}
              <span>{ticket.homeTeamName}</span>
            </div>
            <div className="vs">VS</div>
            <div className="team-ticket text-white fw-bold away">
              <img
                src={teamIcons[ticket.awayTeamName]}
                className="team-icon1"
                width={50}
                height={50}
              />{" "}
              <span>{ticket.awayTeamName}</span>
            </div>
          </div>

          <div className="venue-line text-white fw-bold">
            {ticket.stadiumName}
            {ticket.cityName ? `, ${ticket.cityName}` : ""}
          </div>
        </div>
      </div>

      <div className="perforation">
        <span className="notch left"></span>
        <div className="dash-line"></div>
        <span className="notch right"></span>
      </div>

      <div className="ticket-body">
        <div className="row-2">
          <div className="info-chip">
            <span className="label">Match Date</span>
            <span className="value">{formattedDate}</span>
          </div>

          <div className="info-chip">
            <span className="label">Kickoff Time</span>
            <span className="value">{formattedTime}</span>
          </div>
        </div>

        <div>
          <span className="section-label">Ticket Tier</span>
          <div className="tier-pills">
            <button
              className={`tier-pill active ${isVip ? "vip" : ""}`}
              disabled
              style={{ cursor: "default" }}
            >
              {ticket.ticketCategoryName ?? "Standard"}
            </button>
          </div>
        </div>

        <div>
          <span className="section-label">Seat Details</span>
          <div className="seat-info" style={{ marginTop: "8px" }}>
            <span className="seat-chip">Section {ticket.sectionNumber}</span>
          </div>
        </div>

        {isVip && (
          <div className="vip-amenities">
            <div className="amenity-title">VIP Perks</div>
            <div className="amenity">✨ VIP lounge access</div>
            <div className="amenity">🥂 Complimentary buffet</div>
            <div className="amenity">🅿️ Dedicated parking</div>
          </div>
        )}

        <div className="row-2">
          <div className="info-chip">
            <span className="label">Seats Left</span>
            <span
              className={`value ${isLowCapacity || isSoldOut ? "low-capacity" : ""}`}
            >
              {isSoldOut ? "Sold out" : `${remainingCapacity} seats`}
            </span>
          </div>

          <div className="info-chip">
            <span className="label">Unit Price</span>
            <span className="value">${unitPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="reserve-row">
          <button
            className="reserve-btn"
            onClick={handleReserve}
            disabled={isSoldOut}
          >
            <span>{isSoldOut ? "Sold Out" : "Reserve"}</span>
            {!isSoldOut && <span className="amt">${unitPrice.toFixed(2)}</span>}
          </button>
        </div>
      </div>
    </div>
  );
};
