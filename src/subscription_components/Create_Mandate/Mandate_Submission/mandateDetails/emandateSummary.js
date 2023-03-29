import React from "react";

const EmandateSummary = ({updatedData}) => {

  return (
    <div>
      <div class="container">
        <div class="row">
          <div class="col-sm"><h4>Mandate Variant</h4><span><p className="text-secondary">Mandate</p></span></div>
          <div class="col-sm"><h4>Name</h4><p className="text-secondary">{updatedData?.requestType}</p></div>
          <div class="col-sm"><h4>Bank Name</h4><p className="text-secondary"></p></div>
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default EmandateSummary;
