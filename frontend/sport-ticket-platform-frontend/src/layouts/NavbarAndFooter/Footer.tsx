import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="stp-footer">
      <div className="container">
        <div className="row g-4 py-3">
          <div className="col-lg-4 col-md-6">
            <h4 className="stp-footer-title">STP</h4>

            <p className="stp-footer-text">
              STP is a sports ticket platform where you can discover football
              matches, stadiums and upcoming sporting events.
            </p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="stp-footer-heading">Quick Links</h6>

            <div className="stp-footer-links">
              <Link to="/">Home</Link>
              <Link to="/matches">Matches</Link>
              <Link to="/stadiums">Stadiums</Link>
            </div>
          </div>

          {/* Football */}
          <div className="col-lg-3 col-md-6">
            <h6 className="stp-footer-heading">Football</h6>

            <div className="stp-footer-links">
              <a
                href="https://www.fifa.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                FIFA
              </a>

              <a
                href="https://www.uefa.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                UEFA
              </a>

              <a
                href="https://www.premierleague.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Premier League
              </a>

              <a
                href="https://www.espn.com/soccer/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ESPN Football
              </a>
            </div>
          </div>

          {/* Statistics */}
          <div className="col-lg-3 col-md-6">
            <h6 className="stp-footer-heading">Stats & Results</h6>

            <div className="stp-footer-links">
              <a
                href="https://www.transfermarkt.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Transfermarkt
              </a>

              <a
                href="https://www.sofascore.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sofascore
              </a>

              <a
                href="https://www.flashscore.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Flashscore
              </a>

              <a
                href="https://fbref.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                FBref
              </a>
            </div>
          </div>
        </div>

        <div className="stp-footer-bottom">
          <span>© 2026 STP. All rights reserved.</span>

          <span>Football • Matches • Stadiums</span>
        </div>
      </div>
    </footer>
  );
};
