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
          <p className="text-strong">Mandate Variant</p>
          <span>
            <p className="text-secondary">ONLINE</p>
          </span>
        </div>
        <div className="col-sm">
          <p className="text-strong">Name</p>
          <p className="text-secondary">{mergedForm?.payerName}</p>
        </div>
        <div className="col-sm">
          <p className="text-strong">Bank Name</p>
          <p className="text-secondary">{mergedForm?.payerBank}</p>
        </div>
      </div>

      <div>
        
        <div className="row">
          <div className="col-sm">
            <p className="text-strong">ECS Amount</p>
            <span>
              <p className="text-secondary">{mergedForm?.emiamount}</p>
            </span>
          </div>
          <div className="col-sm">
            <p className="text-strong">Frequency</p>
            <p className="text-secondary">{mergedForm?.frequency}</p>
          </div>
          <div className="col-sm">
            <p className="text-strong">Fixed/Maximum Amount</p>
            <p className="text-secondary">{mergedForm?.mandateMaxAmount}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <p className="text-strong">Consumer Reference Number</p>
            <span>
              <p className="text-secondary">{mergedForm?.consumerReferenceNumber}</p>
            </span>
          </div>
          <div className="col-sm">
            <p className="text-strong">Scheme Reference Number</p>
            <p className="text-secondary">{mergedForm?.schemeReferenceNumber}</p>
          </div>
          <div className="col-sm">
            <p className="text-strong">Start date</p>
            <p className="text-secondary">{formattedStartDate}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <p className="text-strong">End date</p>
            <span>
              <p className="text-secondary">{formattedEndDate}</p>
            </span>
          </div>
          <div className="col-sm">
            <p className="text-strong">Until Cancelled</p>
            <p className="text-secondary">{mergedForm?.untilCancelled.toString()}</p>
          </div>
          <div className="col-sm">
            <p className="text-strong">Request Type</p>
            <p className="text-secondary">{mergedForm?.requestType}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <p className="text-strong">Requested By</p>
            <span>
              <p className="text-secondary">Merchant</p>
            </span>
          </div>
          <div className="col-md-4">
            <p className="text-strong">Mandate Purpose</p>
            <p className="text-secondary">{mergedForm?.mandatePurpose}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MandateSummary;
