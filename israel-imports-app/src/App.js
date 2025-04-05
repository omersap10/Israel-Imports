import React from "react";
import Header from "./components/Header/Header";
import SimpleTable from "./components/SimpleTable/SimpleTable";

const App = () => {
  return (
    <>
      <Header />
      <SimpleTable />
      <div className="floating-buttons">
        <button
          className="circle-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ⬆️
        </button>
        <button
          className="circle-btn"
          onClick={() => {
            const el = document.getElementById("insights-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        >
          🔍
        </button>
      </div>

      <div className="background-waves-fixed">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#f4e6ce"
            d="M0,288L40,272C80,256,160,224,240,202.7C320,181,400,171,480,154.7C560,139,640,117,720,112C800,107,880,117,960,122.7C1040,128,1120,128,1200,112C1280,96,1360,64,1400,48L1440,32L1440,320L0,320Z"
          />
          <path
            fill="#e9d9bb"
            d="M0,256L40,245.3C80,235,160,213,240,213.3C320,213,400,235,480,229.3C560,224,640,192,720,160C800,128,880,96,960,112C1040,128,1120,192,1200,197.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L0,320Z"
          />
        </svg>
      </div>
    </>
  );
};

export default App;
