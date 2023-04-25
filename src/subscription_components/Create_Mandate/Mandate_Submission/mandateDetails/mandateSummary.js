import React from "react";

const MandateSummary = ({updatedData}) => {

  console.log(updatedData,"New Updated Data")
  return (
    <div>
      <div class="row">
        <div class="col-sm">
          <h4>Mandate Variant</h4>
          <span>
            <p className="text-secondary"></p>
          </span>
        </div>
        <div class="col-sm">
          <h4>Name</h4>
          <p className="text-secondary">{updatedData?.payerName}</p>
        </div>
        <div class="col-sm">
          <h4>Bank Name</h4>
          <p className="text-secondary">{updatedData?.payerBank}</p>
        </div>
      </div>

      <div>
        
        <div class="row">
          <div class="col-sm">
            <h4>ECS Amount</h4>
            <span>
              <p className="text-secondary">{updatedData?.emiamount}</p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Frequency</h4>
            <p className="text-secondary">{updatedData?.frequency}</p>
          </div>
          <div class="col-sm">
            <h4>Fixed/Maximum Amount</h4>
            <p className="text-secondary">{updatedData?.mandateMaxAmount}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <h4>Consumer Reference Number</h4>
            <span>
              <p className="text-secondary">{updatedData?.consumerReferenceNumber}</p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Scheme Reference Number</h4>
            <p className="text-secondary">{updatedData?.schemeReferenceNumber}</p>
          </div>
          <div class="col-sm">
            <h4>Start date</h4>
            <p className="text-secondary">{updatedData?.mandateStartDate}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <h4>End date</h4>
            <span>
              <p className="text-secondary">{updatedData?.mandateEndDate}</p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Until Cancelled</h4>
            <p className="text-secondary"></p>
          </div>
          <div class="col-sm">
            <h4>Request Type</h4>
            <p className="text-secondary">{updatedData?.requestType}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <h4>Requested By</h4>
            <span>
              <p className="text-secondary"></p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Mandate Purpose</h4>
            <p className="text-secondary">{updatedData?.mandatePurpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateSummary;
