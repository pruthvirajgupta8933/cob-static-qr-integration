import React from "react";

const PersonalDetails = ({ updatedData }) => {


  // console.log(updatedData,"Updated Data")
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <h4>Name</h4>
            <span>
              <p className="text-secondary">{updatedData?.payerName}</p>
            </span>
          </div>
          <div className="col-sm">
            <h4>Email</h4>
            <p className="text-secondary">{updatedData?.payerEmail}</p>
          </div>
          <div className="col-sm">
            <h4>Moblie Number</h4>
            <p className="text-secondary">{updatedData?.payerMobile}</p>
          </div>
        </div>
        <div className="row">
        {updatedData?.telePhone === "" ? <></> :
          <div className="col-lg-4">
            <h4>Telephone Number</h4>
            <span>
              <p className="text-secondary">{`91-011-${updatedData?.telePhone}`}</p>
            </span>
          </div>
            }
             {updatedData?.panNo === "" ? <></> :
                <div className="col-lg-4">
            <h4>PAN Number</h4>
            <span>
              <p className="text-secondary">{`91-${updatedData?.panNo}`}</p>
            </span>
          </div>
          }
        </div>
     
        <div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
