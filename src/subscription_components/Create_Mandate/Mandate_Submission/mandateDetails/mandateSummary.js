import React from "react";
import { useSelector } from "react-redux";

const MandateSummary = () => {

  // console.log(mergedForm,"New Updated Data")
  const { createMandate } = useSelector((state) => state);
   const { firstForm, secondForm, thirdForm } = createMandate.createMandate.formData;
        const mergedForm = {
          ...firstForm,
          ...secondForm,
          ...thirdForm
        };



const startDate = mergedForm?.mandateStartDate;
const selectedStartdate = new Date(startDate);
const endDate = mergedForm?.untilCancelled === true ? "" : mergedForm?.mandateEndDate;
const selectedEndDate = new Date(endDate);
const options = { weekday: 'short', month: 'short', day: 'numeric' };


const formattedStartDate = selectedStartdate.toLocaleDateString('en-US', options);
const formattedEndDate = mergedForm?.untilCancelled === true ? "Until Cancelled"  : selectedEndDate.toLocaleDateString('en-US', options);


  return (
    <div>
      <div className="row">
        <div className="col-sm">
          <h4>Mandate Variant</h4>
          <span>
            <p className="text-secondary">ONLINE</p>
          </span>
        </div>
        <div className="col-sm">
          <h4>Name</h4>
          <p className="text-secondary">{mergedForm?.payerName}</p>
        </div>
        <div className="col-sm">
          <h4>Bank Name</h4>
          <p className="text-secondary">{mergedForm?.payerBank}</p>
        </div>
      </div>

      <div>
        
        <div className="row">
          <div className="col-sm">
            <h4>ECS Amount</h4>
            <span>
              <p className="text-secondary">{mergedForm?.emiamount}</p>
            </span>
          </div>
          <div className="col-sm">
            <h4>Frequency</h4>
            <p className="text-secondary">{mergedForm?.frequency}</p>
          </div>
          <div className="col-sm">
            <h4>Fixed/Maximum Amount</h4>
            <p className="text-secondary">{mergedForm?.mandateMaxAmount}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <h4>Consumer Reference Number</h4>
            <span>
              <p className="text-secondary">{mergedForm?.consumerReferenceNumber}</p>
            </span>
          </div>
          <div className="col-sm">
            <h4>Scheme Reference Number</h4>
            <p className="text-secondary">{mergedForm?.schemeReferenceNumber}</p>
          </div>
          <div className="col-sm">
            <h4>Start date</h4>
            <p className="text-secondary">{formattedStartDate}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <h4>End date</h4>
            <span>
              <p className="text-secondary">{formattedEndDate}</p>
            </span>
          </div>
          <div className="col-sm">
            <h4>Until Cancelled</h4>
            {/* <p className="text-secondary">{mergedForm?.untilCancelled.toString()}</p> */}
          </div>
          <div className="col-sm">
            <h4>Request Type</h4>
            <p className="text-secondary">{mergedForm?.requestType}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <h4>Requested By</h4>
            <span>
              <p className="text-secondary">Merchant</p>
            </span>
          </div>
          <div className="col-sm">
            <h4>Mandate Purpose</h4>
            <p className="text-secondary">{mergedForm?.mandatePurpose}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateSummary;
