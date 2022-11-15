import React, { useState ,useEffect} from "react";
import "./stepProgressBar.css";

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress/dist/index.css";



function StepComplete() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#ED7D31" />
    </svg>
  );
}

// function StepCurrent() {
//   return (
//     <svg
//       style={{ marginLeft: 15 }}
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="12" cy="12" r="9" stroke="#ED7D31" stroke-width="6" />
//     </svg>
//   );
// }

// function StepNext() {
//   return (
//     <svg
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <circle cx="12" cy="12" r="12" fill="#D8D8D8" />
//     </svg>
//   );
// }

function StepProgressBar(props) {

  const [kycStatusData,setKycStatusData] = useState([]);
  const [percentage,setPercentage] = useState(0);

  let status = props?.status;   
  console.log("status",status)
  status = status?.toLowerCase();

  useEffect(() => {
    let data = [
      {
        steps: [
          { id: 1, status: "completed", title: "Pending" },
          { id: 2, status: "current", title: "In Process" },
          { id: 3, status: "next", title: "Verify" },
          { id: 4, status: "next", title: "Approve" },
        //   { id: 5, status: "next", title: "Complete" },
        ],
        title: "KYC Status",
      },
    ];

    setKycStatusData(data);

    let percent = 0;
    if (status === "pending" || status === "not-filled") {
      percent = 1
    } else if (status === "processing") {
      percent = 33.3;
    } else if (status === "verified") {
      percent = 66.6;
    } else if (status === "approved") {
      percent = 100;
    }

    setPercentage(percent);

    return () => {
      setPercentage(0);
    }

  }, [status]);



  const steps = kycStatusData[0]?.steps?.map((s) => {
    return (
      <Step transition="scale">
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
              <StepComplete />
            </div>
            <div
              className="steps-text"
              style={{ width: 60, marginTop: 60, marginLeft: 0 }}
            >
              {s.title}
            </div>
          </div>
        )}
      </Step>
    );
  });

  //   console.log(steps)

  return (
    <div className="App">
      <div>
        <div style={{ textAlign: "center" }}>
          <div>
            <h1 className="Satoshi-Medium text-bold">KYC Status</h1>
          </div>
        </div>
        <hr />
      
        <div style={{ width: "80%", margin: "0 auto" }}>
          <ProgressBar
            percent={percentage}
            filledBackground="linear-gradient(to right, #ED7D31, #ED7D31)"
          >
            {steps}
          </ProgressBar>
        </div>
        <hr />
        <hr />
        {/* <div className="Placeholder" style={{ color: "#191919" }}>
            Predesign done on 12/17/2020
        </div> */}
        <hr />
        {/* <div className="Placeholder2">
            Pre-design ready. In case you need, you can request a new redesign
        </div>
        <div className="PlaceholderRemember" style={{ marginTop: 50 }}>
            <AlertCircle />
            &nbsp; &nbsp; Remember that it takes at least 48 hours to be done
        </div> */}
        {/* <div className="button">Request New Predesign</div> */}
      </div>
    </div>
  );
}

export default StepProgressBar;
