import { useEffect, useRef, useState } from "react";
import {
  emptyTicketFilter,
  type TicketFilterRequestModel,
} from "../../models/TicketFilterRequestModel";
import type { TicketResponseModel } from "../../models/TicketResponseModel";
import { Pagination } from "../Utils/Pagination";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { TicketCard } from "./components/TicketCard";
import "./css/TicketPage.css";

export const TicketPage = () => {
  const [tickets, setTickets] = useState<TicketResponseModel[]>([]);
  const [filter, setFilter] =
    useState<TicketFilterRequestModel>(emptyTicketFilter);

  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchType, setSearchType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchUrl, setSearchUrl] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const searchOptions = [
    { value: "Teams", icon: "⚽" },
    { value: "Cities", icon: "📍" },
    { value: "Stadiums", icon: "🏟️" },
  ];

  const updateFilter = (
    field: keyof TicketFilterRequestModel,
    value: string,
  ) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      const baseUrl: string = "http://localhost:8082/tickets";
      const usedUrl: string = `${baseUrl}${searchUrl}${searchUrl === "" ? "?" : "&"}page=${currentPage}&size=5`;
      const response = await fetch(usedUrl);

      if (!response.ok) {
        throw new Error("error in data loading");
      }

      const responseJson = await response.json();
      const responseData = responseJson.content;
      setTotalTickets(responseJson.totalElements);
      setTotalPages(responseJson.totalPages);

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
      setIsLoading(false);
    };

    fetchTickets().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [searchUrl, currentPage]);

  const searchChange = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    let newUrl = "";
    if (searchValue !== "") {
      newUrl = `/search/${searchType}?value=${searchValue}`;
    }
    setSearchUrl(newUrl);
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const url = `http://localhost:8082/tickets/filter?page=${currentPage}&size=5`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      });

      if (!response.ok) {
        throw new Error("error applying filter");
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
      setTotalPages(responseJson.totalPages);
      setTotalTickets(responseJson.totalElements);
      setIsFilterOpen(false);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

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
    <div>
      <div className="row mt-3 justify-content-between align-items-start">
        <div className="col-auto ms-0">
          <div
            ref={searchRef}
            className={`search-wrapper ${searchType ? "search-active" : ""}`}
          >
            <form className="search-box" onSubmit={searchChange}>
              {searchType && (
                <button
                  type="button"
                  className="search-back"
                  onClick={() => {
                    setSearchType(null);
                    setSearchValue("");
                    setSearchUrl("");
                    setIsSearchOpen(false);
                  }}
                >
                  ←
                </button>
              )}

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={
                  searchType ? `Search by ${searchType}` : "Search by ..."
                }
              />

              <button
                type="submit"
                className="search-submit"
                disabled={!searchType}
              >
                🔍
              </button>
            </form>

            {isSearchOpen && !searchType && (
              <div className="search-options">
                <div className="search-options-title">Search tickets by</div>
                <div className="search-options-list">
                  {searchOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="search-option"
                      onClick={() => setSearchType(option.value)}
                    >
                      <span className="search-option-icon">{option.icon}</span>
                      <span>{option.value}</span>
                      <span className="search-option-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-auto">
          <div
            ref={filterRef}
            className={`ticket-filter ${isFilterOpen ? "filter-open" : ""}`}
          >
            <button
              type="button"
              className="filter-toggle"
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <span className="filter-icon">☷</span>
              <span>Filter</span>
            </button>

            {isFilterOpen && (
              <div className="filter-panel">
                <button
                  type="button"
                  className="filter-apply"
                  onClick={applyFilters}
                >
                  Apply
                </button>

                {/* Ticket Type */}
                <div className="filter-item">
                  <span className="filter-label">Type</span>
                  <div className="filter-segment">
                    <button
                      type="button"
                      className={
                        filter.ticketType === "STANDARD"
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        updateFilter(
                          "ticketType",
                          filter.ticketType === "STANDARD" ? "" : "STANDARD",
                        )
                      }
                    >
                      Standard
                    </button>

                    <button
                      type="button"
                      className={
                        filter.ticketType === "VIP"
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        updateFilter(
                          "ticketType",
                          filter.ticketType === "VIP" ? "" : "VIP",
                        )
                      }
                    >
                      VIP
                    </button>
                  </div>
                </div>

                {/* Sport */}
                <div className="filter-item">
                  <span className="filter-label">Sport</span>
                  <div className="filter-segment sport-filter">
                    <button
                      type="button"
                      className={
                        filter.sportType === "Football"
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        updateFilter(
                          "sportType",
                          filter.sportType === "Football" ? "" : "Football",
                        )
                      }
                    >
                      ⚽
                    </button>

                    <button
                      type="button"
                      className={
                        filter.sportType === "Basketball"
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        updateFilter(
                          "sportType",
                          filter.sportType === "Basketball" ? "" : "Basketball",
                        )
                      }
                    >
                      🏀
                    </button>

                    <button
                      type="button"
                      className={
                        filter.sportType === "Volleyball"
                          ? "filter-option active"
                          : "filter-option"
                      }
                      onClick={() =>
                        updateFilter(
                          "sportType",
                          filter.sportType === "Volleyball" ? "" : "Volleyball",
                        )
                      }
                    >
                      🏐
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="filter-item">
                  <span className="filter-label">Price</span>
                  <div className="filter-range">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filter.minPrice ?? ""}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filter.maxPrice ?? ""}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="filter-item">
                  <span className="filter-label">Date</span>
                  <div className="filter-range date-range">
                    <input
                      type="date"
                      value={filter.startDate ?? ""}
                      onChange={(e) =>
                        updateFilter("startDate", e.target.value)
                      }
                    />
                    <span>→</span>
                    <input
                      type="date"
                      value={filter.endDate ?? ""}
                      onChange={(e) => updateFilter("endDate", e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="filter-close"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="col">
        {totalTickets > 0 ? (
          <div className="row p-2 g-2">
            {tickets.map((ticket) => (
              <TicketCard ticket={ticket} key={ticket.ticketId} />
            ))}
          </div>
        ) : (
          <div className="m-5">
            <h4>Can't find what you are looking for?</h4>
            <a
              className="btn btn-secondary fw-bold btn-md"
              type="button"
              href="#"
            >
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
    </div>
  );
};
