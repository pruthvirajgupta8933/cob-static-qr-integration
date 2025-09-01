import React from "react";

const BankResponse = (props) => {
  // console.log(props);
  return (
    <div>
      <div className="col-sm-6">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Bank Response Details</h5>
            <p className="card-text">
              <div className="row">
                <div className="col-md-4">Order Id</div>
                <div className="col-md-4 col-md-offset-4">{props.data.orderId}</div>
              </div>
              <div className="row">
                <div className="col-md-4">Amount</div>
                <div className="col-md-4 col-md-offset-4">₹ {props.data.amount}</div>
              </div>
              <div className="row">
                <div className="col-md-4">Status</div>
                <div className="col-md-4 col-md-offset-4">{props.data.status}</div>
              </div>
              <div className="row">
                <div className="col-md-4">Request Date Time</div>
                <div className="col-md-4 col-md-offset-4">{props.data.requestedDatetime}</div>
              </div>
              {/* <div className="row">
                <div className="col-md-4">Message</div>
                <div className="col-md-4 col-md-offset-4">Payout Done</div>
              </div> */}
            </p>
            <button onClick={()=>props.showMakePayment(true)} className="btn  cob-btn-primary ">
              Make Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BankResponse;
