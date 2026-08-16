import { Link } from "react-router-dom";

export const StadiumExplore = () => {
  return (
    <div className="explore stadiumExplore px-3 px-md-5 py-4 py-md-5">
      <div className="explore-content py-3 py-md-4 text-white text-center">
        <h2 className="fw-bold explore-title">
          Browse stadiums and get your tickets for the match you want to attend
        </h2>

        <Link className="explore-btn mt-3 mt-md-4" to="/stadiums">
          Explore Stadiums
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};
