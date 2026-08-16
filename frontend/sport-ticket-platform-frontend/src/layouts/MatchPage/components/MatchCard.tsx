import { useNavigate } from "react-router-dom";
import { teamIcons } from "../../Utils/TeamIcons";
import matchIcon from "./../../../assets/match.svg";
import type { MatchResponseModel } from "./../../../models/MatchResponseModel";
import "./../css/Match.css";

const sportBadges: Record<string, string> = {
  football: "⚽ Football",
  volleyball: "🏐 Volleyball",
  basketball: "🏀 Basketball",
};

export const MatchCard = ({ match }: { match: MatchResponseModel }) => {
  const navigate = useNavigate();

  const sport = match.sportName.toLowerCase();

  const sportBadge = sportBadges[sport] ?? match.sportName;

  const handleCardClick = () => {
    navigate("/match", {
      state: {
        match: match,
      },
    });
  };

  return (
    <div
      className={`match-card sport-${sport} text-white`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="match-card-inner">
        <div className="match-left">
          <span className="sport-badge">{sportBadge}</span>

          <div className="match-teams">
            <div className="team">
              <div className="team-crest">
                <img
                  src={teamIcons[match.homeTeamName]}
                  alt={match.homeTeamName}
                  width={25}
                  height={25}
                />
              </div>

              <div className="team-name">{match.homeTeamName}</div>
            </div>

            <img
              src={matchIcon}
              className="match-icon"
              width={25}
              height={25}
              alt="Match"
            />

            <div className="team">
              <div className="team-crest">
                <img
                  src={teamIcons[match.awayTeamName]}
                  alt={match.awayTeamName}
                  width={25}
                  height={25}
                />
              </div>

              <div className="team-name">{match.awayTeamName}</div>
            </div>
          </div>
        </div>

        <div className="match-meta">
          <div className="meta-row">
            <span className="dot"></span>
            {match.stadiumName}
          </div>

          <div className="meta-row">
            <span className="dot"></span>
            {match.matchDate?.replace("T", " ")}
          </div>
        </div>

        <button
          className="btn-reserve"
          onClick={() =>
            navigate("/tickets", {
              state: { match },
            })
          }
        >
          See Tickets
        </button>
      </div>
    </div>
  );
};
