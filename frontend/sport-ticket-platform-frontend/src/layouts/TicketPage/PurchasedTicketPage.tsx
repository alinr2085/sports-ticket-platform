import { useEffect, useState } from "react";
import type { TicketResponseModel } from "../../models/TicketResponseModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { UserTicketCard } from "./components/UserTicketCard";
import "./css/TicketPage.css";

export const PurchasedTicketPage = () => {
  const [tickets, setTickets] = useState<TicketResponseModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        setHttpError(false);

        const baseUrl = `http://localhost:8082/tickets/user`;

        const response = await fetch(baseUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error in data loading");
        }

        const responseData: TicketResponseModel[] = await response.json();

        const ticketList: TicketResponseModel[] = responseData.map((item) => ({
          ticketId: item.ticketId,
          userId: item.userId,
          sectionNumber: item.sectionNumber,
          sportName: item.sportName,
          homeTeamName: item.homeTeamName,
          awayTeamName: item.awayTeamName,
          stadiumName: item.stadiumName,
          cityName: item.cityName,
          matchDate: item.matchDate,
          status: item.status,
          ticketCategoryName: item.ticketCategoryName,
          price: item.price,
          remainingCapacity: item.remainingCapacity,
        }));

        setTickets(ticketList);
      } catch (err) {
        setHttpError(true);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();

    window.scrollTo(0, 0);
  }, []);

  const handleCancelled = (ticketId: number) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
  };

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>Error loading tickets.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="col">
        {tickets.length > 0 ? (
          <div className="row p-2 g-2">
            {tickets.map((ticket) => (
              <UserTicketCard
                ticket={ticket}
                key={ticket.ticketId}
                onCancelled={handleCancelled}
              />
            ))}
          </div>
        ) : (
          <div className="m-5">
            <h4>Can't find what you are looking for?</h4>
            <a
              href=""
              className="btn btn-secondary fw-bold btn-md"
              type="button"
            >
              STP Services
            </a>
          </div>
        )}
        <br />
      </div>
    </div>
  );
};
