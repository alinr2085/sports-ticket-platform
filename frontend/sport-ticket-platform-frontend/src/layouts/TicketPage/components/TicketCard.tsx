import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teamIcons } from "../../Utils/TeamIcons";
import type { TicketResponseModel } from "./../../../models/TicketResponseModel";
import "./../css/Ticket.css";

export const TicketCard = ({ ticket }: { ticket: TicketResponseModel }) => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const sport = ticket.sportName.toLowerCase();
  const isAvailable = ticket.status.toLowerCase() === "available";
  const ticketType =
    ticket.ticketCategoryName.toLowerCase() === "vip" ? "VIP" : "STANDARD";

  const handleCardClick = () => {
    navigate("/ticket", { state: { ticket } });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      className={`ticket-card sport-${sport}`}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      role="button"
      tabIndex={0}
    >
      {isHovering && (
        <div
          className="tap-hint"
          style={{ left: mousePos.x + 16, top: mousePos.y + 16 }}
        >
          Tap to see details
        </div>
      )}

      <div className="ticket-card-inner text-white">
        <div className="ticket-left">
          <div className="ticket-teams">
            <div className="team">
              <div className="team-crest">
                <img
                  src={teamIcons[ticket.homeTeamName]}
                  alt={ticket.homeTeamName}
                  width={30}
                  height={30}
                />
              </div>
              <span className="team-name">{ticket.homeTeamName}</span>
            </div>

            <span>VS</span>

            <div className="team">
              <div className="team-crest">
                <img
                  src={teamIcons[ticket.awayTeamName]}
                  alt={ticket.awayTeamName}
                  width={30}
                  height={30}
                />
              </div>
              <span className="team-name">{ticket.awayTeamName}</span>
            </div>
          </div>

          <div className="match-date">
            {new Date(ticket.matchDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="ticket-center">
          <div className="stadium-name">{ticket.stadiumName}</div>
          <div className="section-number">SECTION {ticket.sectionNumber}</div>
          <div className={`ticket-type ${ticketType.toLowerCase()}`}>
            ✦ {ticketType} TICKET ✦
          </div>
        </div>

        <div className="ticket-right">
          <div
            className={`availability ${isAvailable ? "available" : "unavailable"}`}
          >
            <span className="availability-dot"></span>
            {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
          </div>
        </div>
      </div>
    </div>
  );
};
