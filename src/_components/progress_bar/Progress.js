import React from "react";
import "./index.css";

const ProgressBar = ({ progressWidth }) => {
  return (
    <div>
      <div class="progress" style={{ height: "10px" }}>
        <div
          class="progress-bar progress-bar-striped bg-info progress-bar-animated"
          role="progressbar"
          style={{ width: `${progressWidth}` }}
          aria-valuenow="10"
          aria-valuemax="10"
          aria-valuemin="0"
        ></div>
      </div>
      <div className="d-flex justify-content-between mt-2">
        <div className="dot bg-primary text-white">1</div>
        <div
          className={
            progressWidth === "0%"
              ? "dot bg-light text-dark"
              : "dot bg-primary text-white"
          }
        >
          2
        </div>
        <div
          className={
            progressWidth === "50%" || progressWidth === "0%"
              ? "dot bg-light text-dark"
              : "dot bg-primary text-white"
          }
        >
          3
        </div>
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
