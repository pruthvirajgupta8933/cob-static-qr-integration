import React, { useState, useEffect } from "react";
import "./stepProgressBar.css";

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress/dist/index.css";
import { KYC_STATUS_APPROVED, KYC_STATUS_NOT_FILLED, KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_REJECTED, KYC_STATUS_VERIFIED } from "../../../utilities/enums";
import { v4 as uuidv4 } from 'uuid';


function StepComplete(props) {

  const { data, progressPercentage } = props
  let colorValue = "#ffffff";

  if (data.id === 1 && (progressPercentage >= 1 && progressPercentage <= 100)) {
    colorValue = "#286ECD"
  } else if (data.id === 2 && (progressPercentage > 33)) {
    colorValue = "#286ECD"
  } else if (data.id === 3 && (progressPercentage > 33.4 && progressPercentage <= 100)) {
    colorValue = "#286ECD"
  } else if (data.id === 4 && (progressPercentage > 67 && progressPercentage <= 100)) {
    colorValue = "#286ECD"
  } else {
    colorValue = "#ffffff";
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#286ECD"
      strokeWidth="4px"
      style={{ borderRadius: 12 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill={colorValue} />
    </svg>
  );
}

function StepProgressBar(props) {

  const [kycStatusData, setKycStatusData] = useState([]);
  const [percentage, setPercentage] = useState(0);

  // let status = props?.status?.toLocaleLowerCase();

  let { status } = props
  const getProgressByStatus = (status) => {

    let percent = 0;
    if (status) {
      if (status?.toLocaleLowerCase() === KYC_STATUS_PENDING.toLocaleLowerCase() || status?.toLocaleLowerCase() === KYC_STATUS_NOT_FILLED.toLocaleLowerCase() || status?.toLocaleLowerCase() === KYC_STATUS_REJECTED.toLocaleLowerCase()) {
        percent = 1
      } else if (status?.toLocaleLowerCase() === KYC_STATUS_PROCESSING.toLocaleLowerCase()) {
        percent = 33.3;
      } else if (status?.toLocaleLowerCase() === KYC_STATUS_VERIFIED.toLocaleLowerCase()) {
        percent = 66.6;
      } else if (status?.toLocaleLowerCase() === KYC_STATUS_APPROVED.toLocaleLowerCase()) {
        percent = 100;
      }
    }

    return percent;
  }



  useEffect(() => {
    let data = [
      {
        steps: [
          { id: 1, status: "completed", title: "Pending" },
          { id: 2, status: "current", title: "In Process" },
          { id: 3, status: "next", title: "Verified" },
          { id: 4, status: "next", title: "Approved" },
          //   { id: 5, status: "next", title: "Complete" },
        ],
        title: "KYC Status",
        // percentage:33.3
      },
    ];

    setKycStatusData(data);
    setPercentage(getProgressByStatus(status));

    return () => {
      setPercentage(0);
    }

  }, [status]);


  const steps = kycStatusData[0]?.steps?.map((s, index) => {
    return (
      <Step transition="scale" key={uuidv4()}>
        {({ accomplished }) => (
          <div
            style={{
              display: "flex",
              height: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ marginTop: 0, position: "absolute" }}>
              <StepComplete data={s} progressPercentage={percentage} />
            </div>

            <div className="steps-text" style={{ width: 70, marginBottom: 60, marginLeft: 0, fontSize: "14px" }} >
              {s.title}
            </div>
          </div>
        )}
      </Step>
    );
  });


  return (
    <div className="mb-5">
      <div>
        <div className="text-center">
          <div>
            <h3 className="mb-4">KYC Status</h3>
          </div>
        </div>
        <br />

        <div style={{ width: "80%", margin: "0 auto" }}>
          <ProgressBar
            percent={percentage}
            height={4}
          // filledBackground="green"
          // unfilledBackground="#286ECD"
          >
            {steps}

          </ProgressBar>
          {/* <ProgressBar
            filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
            percent={75}
          >
            <Step transition="scale">
              {({ accomplished, index }) => (
                <div
                  className={`transitionStep ${accomplished ? "accomplished" : null}`}
                >
                  🌑
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }) => (
                <div
                  className={`transitionStep ${accomplished ? "accomplished" : null}`}
                >
                  🌒
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }) => (
                <div
                  className={`transitionStep ${accomplished ? "accomplished" : null}`}
                >
                  🌓
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }) => (
                <div
                  className={`transitionStep ${accomplished ? "accomplished" : null}`}
                >
                  🌔
                </div>
              )}
            </Step>
            <Step transition="scale">
              {({ accomplished, index }) => (
                <div
                  className={`transitionStep ${accomplished ? "accomplished" : null}`}
                >
                  🌕
                </div>
              )}
            </Step>
          </ProgressBar> */}
        </div>

      </div>
    </div>
  );
}

export default StepProgressBar;
