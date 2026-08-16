import { Link } from "react-router-dom";

export const CityExplore = () => {
  return (
    <div className="explore cityExplore px-3 px-md-5 py-4 py-md-5">
      <div className="explore-content py-3 py-md-4 text-white text-center">
        <h2 className="fw-bold explore-title">
          Browse cities, select the one you want, and view the stadiums and
          matches associated with it.
        </h2>

        <Link className="explore-btn mt-3 mt-md-4" to="/cities">
          Explore Cities
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};
