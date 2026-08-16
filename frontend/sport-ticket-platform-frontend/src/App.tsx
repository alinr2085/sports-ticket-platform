import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Auth } from "./auth/Auth";
import { CityPage } from "./layouts/CityPage/CityPage";
import { HomePage } from "./layouts/HomePage/HomePage";
import { MatchDetails } from "./layouts/MatchPage/components/MatchDetails";
import { MatchPage } from "./layouts/MatchPage/MatchPage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { PaymentPage } from "./layouts/Payment/PaymentPage";
import { ProfilePage } from "./layouts/ProfilePage/ProfilePage";
import { ReservationPage } from "./layouts/ReservationPage/ReservationPage";
import { StadiumPage } from "./layouts/StadiumPage/StadiumPage";
import { TicketDetails } from "./layouts/TicketPage/components/TicketDetails";
import { PurchasedTicketPage } from "./layouts/TicketPage/PurchasedTicketPage";
import { TicketPage } from "./layouts/TicketPage/TicketPage";
export const App = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/cities" element={<CityPage />} />
            <Route path="/stadiums" element={<StadiumPage />} />
            <Route path="/match" element={<MatchDetails />} />
            <Route path="/matches" element={<MatchPage />} />
            <Route path="/tickets" element={<TicketPage />} />
            <Route path="/ticket" element={<TicketDetails />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route path="/payment/:reservationId" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/purchased-tickets"
              element={<PurchasedTicketPage />}
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
};
