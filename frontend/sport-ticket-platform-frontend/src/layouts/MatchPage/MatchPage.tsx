import { useEffect, useState } from "react";
import type { MatchResponseModel } from "../../models/MatchResponseModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { MatchCard } from "./components/MatchCard";

export const MatchPage = () => {
  const [matches, setMatches] = useState<MatchResponseModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStadiums = async () => {
      const url: string = `http://localhost:8082/matches?page=${currentPage}&size=5`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("error in data loading");
      }

      const responseJson = await response.json();
      const responseData = responseJson.content;
      setTotalMatches(responseJson.totalElements);
      setTotalPages(responseJson.totalPages);

      console.log(matches.length);

      const matchList: MatchResponseModel[] = [];
      for (const key in responseData) {
        matchList.push({
          homeTeamName: responseData[key].homeTeamName,
          awayTeamName: responseData[key].awayTeamName,
          leagueOrTournamentName: responseData[key].leagueOrTournamentName,
          matchDate: responseData[key].matchDate,
          matchId: responseData[key].matchId,
          sportName: responseData[key].sportName,
          stadiumName: responseData[key].stadiumName,
          status: responseData[key].status,
        });
      }
      setMatches(matchList);
      setIsLoading(false);
    };

    fetchStadiums().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [currentPage]);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="col">
      {totalMatches > 0 ? (
        <>
          <div className="row p-2 g-2">
            {matches.map((match) => (
              <MatchCard match={match} key={match.matchId} />
            ))}
          </div>
        </>
      ) : (
        <div className="m-5">
          <h4>Can't find what you are looking for?</h4>
          <a className="btn btn-primary fw-bold btn-md" type="button" href="#">
            SPT Services
          </a>
        </div>
      )}
      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPage={totalPages}
          paginate={paginate}
        />
      ) : (
        <br />
      )}

      <br />
    </div>
  );
};
