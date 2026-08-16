import { useEffect, useState } from "react";
import type { StadiumModel } from "../../models/StadiumModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StadiumCard } from "./StadiumCard";

export const StadiumPage = () => {
  const [stadiums, setStadiums] = useState<StadiumModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);
  const [totalStadiums, setTotalStadiums] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStadiums = async () => {
      const url: string = `http://localhost:8082/stadiums?page=${currentPage}&size=6`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("error in data loading");
      }

      const responseJson = await response.json();
      const responseData = responseJson.content;
      setTotalStadiums(responseJson.totalElements);
      setTotalPages(responseJson.totalPages);

      console.log(stadiums.length);

      const stadiumList: StadiumModel[] = [];
      for (const key in responseData) {
        stadiumList.push({
          stadiumId: responseData[key].stadiumId,
          stadiumName: responseData[key].stadiumName,
          cityId: responseData[key].cityId,
          capacity: responseData[key].capacity,
        });
      }
      setStadiums(stadiumList);
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
    <div className="city-page-container stadium-page-container">
      {totalStadiums > 0 ? (
        <>
          <div className="row d-flex justify-content-center">
            {stadiums.map((stadium) => (
              <StadiumCard stadium={stadium} key={stadium.stadiumId} />
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
