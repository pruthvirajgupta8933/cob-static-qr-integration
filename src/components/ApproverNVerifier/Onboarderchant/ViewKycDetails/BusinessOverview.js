import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { verifyKycEachTab, GetKycTabsStatus } from '../../../../slices/kycSlice';
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';


const BusinessOverview = (props) => {
  const { businessTypeResponse, businessCategoryResponse, merchantKycId, KycTabStatus } = props;
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);

  const [isVerified, setIsVerified] = useState(KycTabStatus?.business_info_status === "Verified" ? true : false);
  const [isRejected, setIsRejected] = useState(KycTabStatus?.business_info_status === "Verified" ? true : false);

  let commentsStatus = KycTabStatus.business_info_reject_comments;


  const { user } = auth;
  const { loginId } = user;

  


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


  const handleRejectClick = (business_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      business_info_rejected_by: loginId,
      business_info_reject_comments: business_info_reject_comments
    };
    if (window.confirm("Reject Business Overview?")) {
      dispatch(rejectKycOperation(rejectDetails))
        .then((resp) => {
          resp?.payload?.merchant_info_status &&
            toast.success(resp?.payload?.business_info_status);
          resp?.payload && toast.error(resp?.payload);
          dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId })) // used to remove kyc button beacuse updated in redux store
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }

  }



 return (
    <div className="row mb-4 border">
      <div className="col-lg-12">
        <h3 className="font-weight-bold">Business Overview</h3>
      </div>

      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Business Type<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          disabled="true"
          value={businessTypeResponse}
        />
      </div>

      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="p-2 mt-0">
          Business Category<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          disabled="true"
          value={businessCategoryResponse}
        />
      </div>


      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="col-form-label p-2 mt-0">
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

      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="col-form-label p-2 mt-0">
          {merchantKycId?.is_website_url === true ?
            <p className="font-weight-bold"> Merchant wish to accept payments on (Web/App URL) {merchantKycId?.website_app_url}</p> :
            `Merchant has accepted payments without any web/app `}
        </label>
      </div>


      {/* <div className="col-sm-4 col-md-4 col-lg-4">
        <label className="col-form-label p-2 mt-0">
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
      </div> */}

      <div className="col-sm-4 col-md-4 col-lg-4">
        <label
          className="col-form-label p-0"
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

      <div className="col-sm-4 col-md-4 col-lg-4">
        <label className="col-form-label p-2 mt-0">
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

      <div className="col-lg-6 font-weight-bold mt-2 ">
        <p>Status : <span>{KycTabStatus?.business_info_status}</span></p>
        <p>Comments : <span>{KycTabStatus?.business_info_reject_comments}</span></p>
      </div>


      <div className="col-lg-6 mt-3">
        <VerifyRejectBtn
          KycTabStatus={KycTabStatus?.business_info_status}
          ContactComments={commentsStatus}
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
