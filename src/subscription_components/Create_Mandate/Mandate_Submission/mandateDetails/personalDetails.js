import React from "react";

const PersonalDetails = ({ updatedData }) => {
  return (
    <div>
      <div class="container">
        <div class="row">
          <div class="col-sm">
            <h4>Name</h4>
            <span>
              <p className="text-secondary">{updatedData?.payerName}</p>
            </span>
          </div>
          <div class="col-sm">
            <h4>Email</h4>
            <p className="text-secondary">{updatedData?.payerEmail}</p>
          </div>
          <div class="col-sm">
            <h4>Moblie Number</h4>
            <p className="text-secondary">{updatedData?.payerMobile}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            <h4>Telephone Number</h4>
            <span>
              <p className="text-secondary">{updatedData?.telePhone}</p>
            </span>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
