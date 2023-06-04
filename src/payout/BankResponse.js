import React from "react";

const BankResponse = (props) => {
  console.log(props);
  return (
    <div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Bank Response Details</h5>
            <p class="card-text">
              <div class="row">
                <div class="col-md-4">Order Id</div>
                <div class="col-md-4 col-md-offset-4">{props.data.orderId}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Amount</div>
                <div class="col-md-4 col-md-offset-4">₹ {props.data.amount}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Status</div>
                <div class="col-md-4 col-md-offset-4">{props.data.status}</div>
              </div>
              <div class="row">
                <div class="col-md-4">Request Date Time</div>
                <div class="col-md-4 col-md-offset-4">{props.data.requestedDatetime}</div>
              </div>
              {/* <div class="row">
                <div class="col-md-4">Message</div>
                <div class="col-md-4 col-md-offset-4">Payout Done</div>
              </div> */}
            </p>
            <button onClick={()=>props.showMakePayment(true)} class="btn  cob-btn-primary ">
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BankResponse;
