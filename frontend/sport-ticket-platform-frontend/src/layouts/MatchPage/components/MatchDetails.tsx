import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { MatchResponseModel } from "../../../models/MatchResponseModel";
import type { TicketResponseModel } from "../../../models/TicketResponseModel";
import { TicketCard } from "../../TicketPage/components/TicketCard";
import { leagueTournamentIcons } from "../../Utils/League-TournamentIcons";
import { sportIcons } from "../../Utils/SportIcons";
import { teamIcons } from "../../Utils/TeamIcons";
import "./../css/Match.css";

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const MatchDetails = () => {
  const location = useLocation();
  const match = location.state?.match as MatchResponseModel;

  const [isTicketsOpen, setIsTicketsOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketResponseModel[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [ticketsError, setTicketsError] = useState(false);

  if (!match) {
    return (
      <div className="match-box">
        <div className="match-box-inner">
          <p>Match information not found.</p>
        </div>
      </div>
    );
  }

  const sport = match.sportName?.toLowerCase();
  const leagueIcon = leagueTournamentIcons[match.leagueOrTournamentName];
  const homeIcon = teamIcons[match.homeTeamName];
  const awayIcon = teamIcons[match.awayTeamName];
  const sportEmoji = sportIcons[match.sportName] ? undefined : "🏆";

  const handleSeeTickets = async () => {
    if (isTicketsOpen) {
      setIsTicketsOpen(false);
      return;
    }

    setIsTicketsOpen(true);

    if (tickets.length > 0) return;

    setIsLoadingTickets(true);
    setTicketsError(false);

    try {
      const url = `http://localhost:8082/tickets?matchId=${match.matchId}&page=0&size=10`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("error loading tickets");
      }

      const responseJson = await response.json();
      const responseData = responseJson.content;

      const ticketList: TicketResponseModel[] = [];
      for (const key in responseData) {
        ticketList.push({
          ticketId: responseData[key].ticketId,
          userId: responseData[key].userId,
          sectionNumber: responseData[key].sectionNumber,
          sportName: responseData[key].sportName,
          homeTeamName: responseData[key].homeTeamName,
          awayTeamName: responseData[key].awayTeamName,
          stadiumName: responseData[key].stadiumName,
          cityName: responseData[key].cityName,
          matchDate: responseData[key].matchDate,
          status: responseData[key].status,
          ticketCategoryName: responseData[key].ticketCategoryName,
          price: responseData[key].price,
          remainingCapacity: responseData[key].remainingCapacity,
        });
      }

      setTickets(ticketList);
    } catch (err) {
      console.error(err);
      setTicketsError(true);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  return (
    <div className={`match-box sport-${sport}`}>
      <div className="match-box-inner">
        <div className="match-top">
          <span className="league-pill">
            {leagueIcon ? (
              <img src={leagueIcon} alt="" />
            ) : (
              <span className="league-icon-fallback">
                {initials(match.leagueOrTournamentName ?? "")}
              </span>
            )}
            {match.leagueOrTournamentName}
          </span>

          <span className="stadium-row">
            <span className="stadium-dot"></span>
            {match.stadiumName}
          </span>
        </div>

        <div className="match-teams-row">
          <div className="team-block home">
            {homeIcon ? (
              <div className="team-icon">
                <img src={homeIcon} alt={match.homeTeamName} />
              </div>
            ) : (
              <div className="team-icon">{initials(match.homeTeamName)}</div>
            )}
            <div className="team-label">
              <div className="team-name">{match.homeTeamName}</div>
              <div className="team-sub">Home</div>
            </div>
          </div>

          <div className="sport-icon-center">
            {sportIcons[match.sportName] ? (
              <img
                src={sportIcons[match.sportName]}
                alt={match.sportName}
                width={28}
                height={28}
              />
            ) : (
              sportEmoji
            )}
          </div>

          <div className="team-block away">
            {awayIcon ? (
              <div className="team-icon">
                <img src={awayIcon} alt={match.awayTeamName} />
              </div>
            ) : (
              <div className="team-icon">{initials(match.awayTeamName)}</div>
            )}
            <div className="team-label">
              <div className="team-name">{match.awayTeamName}</div>
              <div className="team-sub">Away</div>
            </div>
          </div>
        </div>

        <div className="match-bottom">
          {match.status === "live" ? (
            <span className="status-live">LIVE</span>
          ) : match.status === "finished" ? (
            <span className="status-finished">Finished</span>
          ) : (
            <span className="match-datetime">
              {match.matchDate?.replace("T", " ")}
            </span>
          )}

          <button className="btn-see-tickets" onClick={handleSeeTickets}>
            {isTicketsOpen ? "Hide Tickets" : "See Tickets"}
          </button>
        </div>

        <div className={`tickets-panel ${isTicketsOpen ? "open" : ""}`}>
          <div className="tickets-panel-inner">
            {isLoadingTickets && (
              <div className="tickets-status">Loading tickets...</div>
            )}

            {ticketsError && (
              <div className="tickets-status error">
                Failed to load tickets.
              </div>
            )}

            {!isLoadingTickets && !ticketsError && tickets.length === 0 && (
              <div className="tickets-status">
                No tickets available for this match.
              </div>
            )}

            {!isLoadingTickets && tickets.length > 0 && (
              <div className="tickets-scroll-list">
                {tickets.map((ticket) => (
                  <TicketCard ticket={ticket} key={ticket.ticketId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
