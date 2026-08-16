import { useEffect, useState } from "react";
import type { ReservationResponseModel } from "../../models/ReservationResponseModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { ReservationCard } from "./components/ReservationCard";


export const ReservationPage = () => {
  const [reservation, setReservation] = useState<ReservationResponseModel[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);

  const [totalreservation, setTotalreservation] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setIsLoading(true);
        setHttpError(false);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You are not authenticated");
        }

        const url = `http://localhost:8082/reservations?page=${currentPage}&size=5`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error in data loading");
        }

        const responseJson = await response.json();

        setTotalreservation(responseJson.totalElements);
        setTotalPages(responseJson.totalPages);

        const reserveationList: ReservationResponseModel[] =
          responseJson.content.map((item: any) => ({
            reservationId: item.reservationId,
            status: item.status,
            reservationDate: item.reservationDate,
            expiresAt: item.expiresAt,
            ticketId: item.ticketId,
            sportName: item.sportName,
            homeTeamName: item.homeTeamName,
            awayTeamName: item.awayTeamName,
            stadiumName: item.stadiumName,
            matchDate: item.matchDate,
            ticketCategoryName: item.ticketCategoryName,
            ticketPrice: item.ticketPrice,
            sectionNumber: item.sectionNumber,
            userId: item.userId,
            userEmail: item.userEmail,
            paymentId: item.paymentId,
            paymentStatus: item.paymentStatus,
            paymentAmount: item.paymentAmount,
          }));

        setReservation(reserveationList);
      } catch (err) {
        setHttpError(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservation();

    window.scrollTo(0, 0);
  }, [currentPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
    <div className="col">
      {totalreservation > 0 ? (
        <div className="row p-2 g-2">
          {reservation.map((reservation) => (
            <div key={reservation.reservationId} className="col-12">
              <ReservationCard
                reservation={reservation}
                onUpdated={() => setCurrentPage((p) => p)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="m-5">
          <h4>Can't find what you are looking for?</h4>

          <a className="btn btn-primary fw-bold btn-md" href="#">
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
    </div>
  );
};
