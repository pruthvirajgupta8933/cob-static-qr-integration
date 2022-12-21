import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
// import {verifyKycEachTab} from "../../slices/kycSlice";
import { verifyKycEachTab } from '../../../../slices/kycSlice';
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';

const BusinessOverview = (props) => {
  const { businessTypeResponse, businessCategoryResponse, merchantKycId, KycTabStatus } = props;

console.log("businessCategoryResponse",businessCategoryResponse)
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  
  const [isVerified, setIsVerified] = useState(KycTabStatus?.business_info_status === "Verified" ? true : false);
  const [isRejected, setIsRejected] = useState(KycTabStatus?.business_info_status === "Verified" ? true : false);

  


  const { user } = auth;
  const { loginId } = user;

  const general_info_status = KycTabStatus?.business_info_status;



  const handleVerifyClick = () => {
    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      business_info_verified_by: loginId,
    };
    dispatch(verifyKycEachTab(veriferDetails))
      .then((resp) => {
        resp?.payload?.business_info_status &&
          toast.success(resp?.payload?.business_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });


  }


  const handleRejectClick = () => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      business_info_rejected_by: loginId,
    };
    dispatch(rejectKycOperation(rejectDetails))
      .then((resp) => {
        resp?.payload?.merchant_info_status &&
          toast.success(resp?.payload?.merchant_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });

  }




  return (
    <div className="row mb-4 border">
      <div class="col-lg-12">
        <h3 className="font-weight-bold">Business Overview</h3>
      </div>
      <div class="col-sm-6 col-md-6 col-lg-6">
        <label class="col-form-label mt-0 p-2">
          Business Type<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          disabled="true"
          value={businessTypeResponse}
        />
      </div>

      <div class="col-sm-6 col-md-6 col-lg-6">
        <label class="p-2 mt-0">
          Business Category<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          disabled="true"
          value={businessCategoryResponse}
        />
      </div>


      <div class="col-sm-6 col-md-6 col-lg-6">
        <label class="col-form-label p-2 mt-0">
          Business Label <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.billingLabel
          }
        />
      </div>

      <div class="col-sm-6 col-md-6 col-lg-6">
        <label class="col-form-label p-2 mt-0">
          {merchantKycId?.is_website_url === true ?
            <p className="font-weight-bold"> Merchant wish to accept payments on (Web/App URL) {merchantKycId?.website_app_url}</p> :
            `Merchant has accepted payments without any web/app `}
        </label>
      </div>


      <div class="col-sm-4 col-md-4 col-lg-4">
        <label class="col-form-label p-2 mt-0">
          Company Website<span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.companyWebsite
          }
        />
      </div>

      <div class="col-sm-4 col-md-4 col-lg-4">
        <label
          class="col-form-label p-0"
          style={{ marginTop: "15px" }}
        >
          Expected Transactions/Year{" "}
          <span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.expectedTransactions
          }
        />
      </div>

      <div class="col-sm-4 col-md-4 col-lg-4">
        <label class="col-form-label p-2 mt-0">
          Avg Ticket Amount<span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.avg_ticket_size
          }
        />

      </div>

      <div className="col-lg-6 ">
        Status : <span>{KycTabStatus?.business_info_status}</span>
      </div>

      <div className="col-lg-6 mt-3">
        <VerifyRejectBtn
         KycTabStatus={KycTabStatus?.business_info_status}
          KycVerifyStatus={{ handleVerifyClick, isVerified }}
          KycRejectStatus={{ handleRejectClick, isRejected }}
          btnText={{ verify: "Verify", Reject: "Reject" }}
        />

      </div>
      <div>

      </div>

    </div>

  )
}

export default BusinessOverview
