import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const KycModal = () => {
  const { kyc } = useSelector((state) => state);
  const [closeModal, setCloseModal] = useState(kyc.kycModalClose);
  useEffect(() => {
    setCloseModal(kyc.kycModalClose);
  }, [kyc]);

  return (
    <div>
      <div
        className="modal fade show"
        id="exampleModal"
        role="dialog"
        aria-labelledby="exampleModalLabel"
       ariaHidden="true"
        style={{
          display: closeModal ? "block" : "none",
          opacity: "1",
          background: "rgba(0,0,0,0.8)",
        }}
      >
        <div className="modal-dialog mw-100 w-50" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="exampleModalLabel">
                Welcome to SabPaisa!
              </h2>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setCloseModal(!closeModal)}
              >
                <span ariaHidden="true">×</span>
              </button>
            </div>
            <div className="modal-body  max-height-signup">
              <div className="term-condintion ">
                <p>Activate your account to start receiving payments</p>
                <p>
                  <strong>Do you want to complete KYC?</strong>
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                type="button"
                className="btn btn-success text-white"
                //  onClick={()=>enableKycButton("yes")}
              >
                Yes
              </Link>

              <Link
                type="button"
                className="btn  cob-btn-primary"
                // onClick={()=>enableKycButton("later")}
              >
                Later
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
