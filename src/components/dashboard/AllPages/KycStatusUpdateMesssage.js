import React from "react"
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { useDispatch, useSelector } from "react-redux";
const KycStatusUpdateMessage = ()=>{
    const roles = roleBasedAccess();
    const {kyc} = useSelector((state) => state);
    return (
        <>
          <div className="row kyc-link mt-2">
              {roles?.merchant === true &&
                kyc?.kycUserList?.status !== "Approved" && (

                  <div className="col-lg-12 col-md-12">
                    <div className="card col-lg-12- cardkyc pull-left">
                      <div className="">
                        <span className="">
                          You can accept payments upto ₹10,000 for now. To extend
                          the limit complete your KYC and get it approved.
                        </span>

                      </div>
                    </div>
                  </div>
                )}
              {roles?.merchant === true &&
                kyc?.kycUserList?.status === "Approved" && (

                  <div className="col-lg-12 col-md-12">
                    <div className="card col-lg-12- cardkyc pull-left">
                      <div className="font-weight-bold card-body ">
                        <span>
                          Congratulations! Your KYC documents have been approved.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

            </div>
        </>
    )
}

export default KycStatusUpdateMessage;