import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { verifyKycEachTab, GetKycTabsStatus } from '../../../../slices/kycSlice';
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
import { useEffect } from 'react';


const BusinessOverview = (props) => {
  const { businessTypeResponse, businessCategoryResponse, merchantKycId, KycTabStatus, platform} = props;
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);


  let isVerified = KycTabStatus?.business_info_status === "Verified" ? true : false;
  let isRejected = KycTabStatus?.business_info_status === "Verified" ? true : false;

  let commentsStatus = KycTabStatus.business_info_reject_comments;


  const { user } = auth;
  const { loginId } = user;
  

useEffect(() => {

}, [])


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
    <div className="row p-1 mb-4 border">
      
        <h5 className="">Business Overview</h5>
      
        <div className="form-row g-3">
      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="">
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
        <label className="">
          Business Category<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          disabled="true"
          value={businessCategoryResponse}
        />
      </div>
      </div>

      <div className="form-row g-3">
      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="">
          Business Description <span style={{ color: "red" }}>*</span>
        </label>

        <textarea
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.billingLabel
          }
        >
        </textarea>
      </div>


      <div className="col-sm-6 col-md-6 col-lg-6">
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
      </div>

      <div className="form-row g-3">
      <div className="col-sm-3 col-md-3 col-lg-3">
        <label className="">
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
      
      <div className="col-sm-3 col-md-3 col-lg-3">
        <label className="">
          Platform Type
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={platform}
        />
      </div>

      <div className="col-sm-6 col-md-6 col-lg-6">
        <label className="">
          {merchantKycId?.is_website_url === true ?
            <>
            Merchant wish to accept payments on :
              <textarea
                type="text"
                className="form-control"
                id="inputPassword3"
                disabled="true"
                cols={4}
                rows={3}
                value={
                  merchantKycId?.website_app_url
                }
              ></textarea>
            </>
            :
            <p className="font-weight-bold text-danger">Merchant has accepted payments without any web/app</p>
          }
        </label>

      </div>
      </div>
      
      <div className="form-row g-3">
      <div className="col-lg-6 font-weight-bold ">
        <p>Status : <span>{KycTabStatus?.business_info_status}</span></p>
        <p>Comments : <span>{KycTabStatus?.business_info_reject_comments}</span></p>
      </div>

      <div className="col-lg-6">
        <VerifyRejectBtn
          KycTabStatus={KycTabStatus?.business_info_status}
          ContactComments={commentsStatus}
          KycVerifyStatus={{ handleVerifyClick, isVerified }}
          KycRejectStatus={{ handleRejectClick, isRejected }}
          btnText={{ verify: "Verify", Reject: "Reject" }}
        />
      </div>
      </div>

    </div>

  )
}

export default BusinessOverview
