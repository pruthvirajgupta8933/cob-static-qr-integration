import React from "react";
import "./index.css";

const ProgressBar = () => {
  return (
    <div>
      <div class="progress" style={{ height: "3px" }}>
        <div
          class="progress-bar"
          role="progressbar"
          style={{ width: "50%" }}
          aria-valuenow="10"
          aria-valuemax="10"
          aria-valuemin="0"
        ></div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="dot bg-primary text-white">1</div>
        <div className="dot bg-light text-dark">2</div>
        <div className="dot bg-light text-dark">3</div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="mr-4 pr-2 dot-text">Mandate</div>
        <div>Personal</div>
        <div className=" dot-text-last">Bank</div>
      </div>
    </div>
  );
};
export default ProgressBar;
