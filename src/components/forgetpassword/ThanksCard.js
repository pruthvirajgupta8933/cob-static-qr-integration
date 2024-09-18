import React from "react";
import { Link } from "react-router-dom";

function ThanksCard(props) {
  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-lg-12 mx-auto">
          <div className="card ">
            <div className="card-body NunitoSans-Regular">
              <h5 className="card-title">Password Changed Successfully</h5>
              <Link to="/" className="btn  cob-btn-primary btn-sm mt-3 ">Back to login</Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ThanksCard;
