import { CityExplore } from "./components/CityExplore";
import { StadiumExplore } from "./components/StadiumExplore";

export const HomePage = () => {
  return (
    <div
      className="container-fluid"
      style={{
        maxWidth: "1000px",
        width: "100%",
      }}
    >
      <StadiumExplore />
      <CityExplore />
    </div>
  );
};
