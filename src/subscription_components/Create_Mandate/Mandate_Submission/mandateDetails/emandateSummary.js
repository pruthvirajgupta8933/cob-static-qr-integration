import React from "react";

const EmandateSummary = ({ updatedData }) => {
  // console.log("EEEEEEEEmandate Summary Object", updatedData);

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm"><h4>Mandate Variant</h4><span><p className="text-secondary"></p></span></div>
          <div className="col-sm"><h4>Name</h4><p className="text-secondary">{updatedData?.payerName}</p></div>
          <div className="col-sm"><h4>Bank Name</h4><p className="text-secondary"></p>{updatedData?.payerBank}</div>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default EmandateSummary;
