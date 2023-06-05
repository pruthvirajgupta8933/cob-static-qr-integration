import React from "react";
import { Link } from "react-router-dom";

function ThanksCard(props) {
  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Password Changed</div>
            <div className="card-body NunitoSans-Regular">
              <h5 className="card-title">Password Changed Successfully </h5>

              {/* <p className="card-text" style={{ display: "block" }}>
                With supporting text below as a natural lead-in to additional
                content.
              </p> */}
              <Link to="/" className="btn  cob-btn-primary btn-sm ">Back to login</Link>
            </div>
            <div className="card-footer text-muted text-center mt-4">
              Sabpaisa.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThanksCard;
