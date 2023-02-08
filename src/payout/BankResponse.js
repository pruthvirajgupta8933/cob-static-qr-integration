import React from "react";

const BankResponse = () => {
  return (
    <div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Bank Response Details</h5>
            <p class="card-text">
              <div class="row">
                <div class="col-md-4">Order Id</div>
                <div class="col-md-4 col-md-offset-4">123456</div>
              </div>
              <div class="row">
                <div class="col-md-4">Amount</div>
                <div class="col-md-4 col-md-offset-4">Rs 100</div>
              </div>
              <div class="row">
                <div class="col-md-4">Status</div>
                <div class="col-md-4 col-md-offset-4">Processing</div>
              </div>
              <div class="row">
                <div class="col-md-4">Request Date Time</div>
                <div class="col-md-4 col-md-offset-4">2023-10-10</div>
              </div>
              <div class="row">
                <div class="col-md-4">Message</div>
                <div class="col-md-4 col-md-offset-4">Payout Done</div>
              </div>
            </p>
            <a href="#" class="btn btn-primary">
              Go somewhere
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BankResponse;
