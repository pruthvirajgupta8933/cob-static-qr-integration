import React from "react";
import { useSelector } from "react-redux";

const PersonalDetails = () => {

const { createMandate } = useSelector((state) => state);
   const { firstForm, secondForm, thirdForm } = createMandate.createMandate.formData;
        const mergedForm = {
          ...firstForm,
          ...secondForm,
          ...thirdForm
        };

  // console.log(mergedForm,"Updated Data")
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <p className="text-strong">Name</p>
            <span>
              <p className="text-secondary">{mergedForm?.payerName}</p>
            </span>
          </div>
          <div className="col-sm">
            <p className="text-strong">Email</p>
            <p className="text-secondary">{mergedForm?.payerEmail}</p>
          </div>
          <div className="col-sm">
            <p className="text-strong">Moblie Number</p>
            <p className="text-secondary">{mergedForm?.payerMobile}</p>
          </div>
        </div>
        <div className="row">
        {mergedForm?.telePhone === "" ? <></> :
          <div className="col-lg-4">
            <p className="text-strong">Telephone Number</p>
            <span>
              <p className="text-secondary">{`91-011-${mergedForm?.telePhone}`}</p>
            </span>
          </div>
            }
             {mergedForm?.panNo === "" ? <></> :
                <div className="col-lg-4">
            <p className="text-strong">PAN Number</p>
            <span>
              <p className="text-secondary">{`91-${mergedForm?.panNo}`}</p>
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
