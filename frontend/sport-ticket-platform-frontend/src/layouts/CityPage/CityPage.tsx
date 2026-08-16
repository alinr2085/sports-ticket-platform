import { useEffect, useState } from "react";
import type { CityModel } from "../../models/CityModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CityCard } from "./CityCard";

export const CityPage = () => {
  const [cities, setCities] = useState<CityModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(false);
  const [totalCities, setTotalCities] = useState(0);

  useEffect(() => {
    const fetchCities = async () => {
      const url: string = "http://localhost:8082/cities";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("error in data loading");
      }

      const responseJson = await response.json();
      const responseData = responseJson.content;
      setTotalCities(responseJson.totalElements);

      const cityList: CityModel[] = [];
      for (const key in responseData) {
        cityList.push({
          cityId: responseData[key].cityId,
          cityName: responseData[key].cityName,
        });
      }
      setCities(cityList);

      setIsLoading(false);
    };

    fetchCities().catch((err) => {
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
    <div className="city-page-container">
      {totalCities > 0 ? (
        <>
          <div className="row d-flex justify-content-center">
            {cities.map((city) => (
              <CityCard city={city} key={city.cityId} />
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

      <br />
    </div>
  );
};
