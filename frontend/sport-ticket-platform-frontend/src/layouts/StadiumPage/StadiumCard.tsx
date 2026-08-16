import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MatchResponseModel } from "../../models/MatchResponseModel";
import type { StadiumModel } from "../../models/StadiumModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import matchIcon from "./../../assets/match.svg";
import { teamIcons } from "./../Utils/TeamIcons";

export const StadiumCard = ({ stadium }: { stadium: StadiumModel }) => {
  const [futureMatches, setFutureMatches] = useState<MatchResponseModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      const url = `http://localhost:8082/matches?stadiumId=${stadium.stadiumId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("faild fetch matches");

      const responseJson = await response.json();

      console.log("IS ARRAY:", responseJson);
      const responseData: MatchResponseModel[] = responseJson.content;

      setFutureMatches(
        responseData.filter(
          (match: MatchResponseModel) =>
            match.status === "scheduled" || match.status === "live",
        ),
      );

      setIsLoading(false);
      console.log(futureMatches.length);
    };
    fetchMatches().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="col-12 col-lg-6 mt-4">
      <div className="city-card stadium-card p-2 text-center text-white mt-2">
        <div className="mt-3 mb-4">
          <h4>{stadium.stadiumName}</h4>
          <h6>capacity: {stadium.capacity} </h6>
        </div>

        <div className="feture-matches p-2">
          <h5 className="box-header fw-bold mt-1 mb-2">Future Matches</h5>
          {futureMatches.map((match) => (
            <div
              className="d-flex justify-content-center mb-1"
              key={match.matchId}
            >
              <button
                className="text-white matches-link btn btn-outline"
                onClick={() =>
                  navigate("/match", {
                    state: { match },
                  })
                }
              >
                <img
                  src={teamIcons[match.homeTeamName]}
                  className="team-icon1"
                  width={25}
                  height={25}
                />
                <span className="team-name1">{match.homeTeamName}</span>
                <img
                  src={matchIcon}
                  className="match-icon"
                  width={25}
                  height={25}
                />
                <span className="team-name2">{match.awayTeamName}</span>
                <img
                  src={teamIcons[match.awayTeamName]}
                  className="team-icon2"
                  width={25}
                  height={25}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
