import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import home from "../../assets/home.svg";
import match from "../../assets/match.svg";
import ticket from "../../assets/ticket.svg";
import { useAuth } from "../../auth/context/AuthContext";
import userIcon from "./../../assets/user.svg";

export const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [openAccount, setOpenAccount] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const supportDropdownRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const isSupport = user?.role === "support";

  console.log(isLoggedIn);

  const handleLogout = () => {
    setOpenAccount(false);
    logout();
    navigate("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(target)
      ) {
        setOpenAccount(false);
      }

      if (
        supportDropdownRef.current &&
        !supportDropdownRef.current.contains(target)
      ) {
        setOpenSupport(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-dark stp-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <div className="container">
        <Link
          className={`navbar-brand fw-bold stp-brand ${
            scrolled ? "brand-hidden" : ""
          }`}
          to="/"
        >
          STP
        </Link>

        <button
          className="navbar-toggler nav-btn"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item nav-btn">
              <Link className="nav-link d-flex gap-1 text-white " to="/">
                <img src={home} alt="Home" width={25} height={25} />
                Home
              </Link>
            </li>

            <li className="nav-item nav-btn">
              <Link className="nav-link d-flex gap-1 text-white " to="/tickets">
                <img src={ticket} alt="Home" width={25} height={25} />
                Tickets
              </Link>
            </li>

            <li className="nav-item nav-btn">
              <Link className="nav-link d-flex gap-1 text-white" to="/matches">
                <img src={match} alt="Home" width={25} height={25} />
                Matches
              </Link>
            </li>

            {isSupport && (
              <li className="nav-item nav-btn">
                <div
                  className="nav-link d-flex text-white position-relative support-dropdown-wrapper"
                  ref={supportDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setOpenSupport((prev) => !prev);
                      setOpenAccount(false);
                    }}
                    className="support-button "
                  >
                    <img src={userIcon} alt="User" width={25} height={25} />
                    <span>Support</span>
                    <span
                      className={`account-arrow ${openSupport ? "open" : ""}`}
                    >
                      ⌄
                    </span>
                  </button>
                  <div className={`account-menu ${openSupport ? "show" : ""}`}>
                    <button
                      type="button"
                      className="account-item"
                      onClick={() => {
                        setOpenSupport(false);
                        navigate("/reservations");
                      }}
                    >
                      Reservations
                    </button>

                    <Link
                      type="button"
                      className="account-item"
                      onClick={() => setOpenSupport(false)}
                      to={""}
                    >
                      Tickets
                    </Link>
                  </div>
                </div>
              </li>
            )}
          </ul>

          <div className="position-relative" ref={accountDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setOpenAccount((prev) => !prev);
                setOpenSupport(false);
              }}
              className="account-button"
            >
              <img src={userIcon} alt="User" width={22} height={22} />

              <span>{isLoggedIn ? user?.firstName : "Account"}</span>

              <span className={`account-arrow ${openAccount ? "open" : ""}`}>
                ⌄
              </span>
            </button>

            <div className={`account-menu ${openAccount ? "show" : ""}`}>
              <button
                type="button"
                className="account-item"
                onClick={() => {
                  setOpenAccount(false);
                  navigate("/profile");
                }}
              >
                Profile
              </button>

              {isLoggedIn && !isSupport && (
                <button
                  type="button"
                  className="account-item"
                  onClick={() => {
                    setOpenAccount(false);
                    navigate("/reservations");
                  }}
                >
                  My Reservations
                </button>
              )}

              {isLoggedIn && !isSupport && (
                <button
                  type="button"
                  className="account-item"
                  onClick={() => {
                    setOpenAccount(false);
                    navigate("/purchased-tickets");
                  }}
                >
                  My Tickets
                </button>
              )}

              {isLoggedIn ? (
                <button
                  type="button"
                  className="account-item logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="account-item login"
                  onClick={() => setOpenAccount(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
