import { useEffect, useState } from "react";
import type { CityModel } from "../../models/CityModel";
import type { StadiumModel } from "../../models/StadiumModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const CityCard = ({ city }: { city: CityModel }) => {
  const [stadiums, setStadiums] = useState<StadiumModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);

  useEffect(() => {
    const fetchStadiums = async () => {
      const url = `http://localhost:8082/stadiums?cityId=${city.cityId}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) throw new Error("faild fetch stadiums");

      const responseJson = await response.json();
      const responseData = responseJson.content;
      console.log(responseData);

      setStadiums(responseData);
      setIsLoading(false);
    };
    fetchStadiums().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) {
    return (
      <div className="container mt-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="col-12 col-md-6 col-lg-4 mt-4">
      <div className="city-card p-2 text-center text-white mt-2">
        <div className="mt-3 mb-4">
          <h5 className="display-6 fw-bold">{city.cityName}</h5>
        </div>

        <div className="stadium-box p-2">
          <h5 className="box-header fw-bold mt-1 mb-3">Top Stadiums</h5>
          {stadiums.map((stadium) => (
            <div
              className="d-flex justify-content-center mb-1"
              key={stadium.stadiumId}
            >
              <a href="#" className="text-white stadium-link">
                {stadium.stadiumName}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
