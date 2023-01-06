import React from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';
const BusinessDetails = (props) => {
  const { merchantKycId,KycTabStatus } = props;
  const dispatch = useDispatch();


  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;


  const handleVerifyClick = () => {
  
    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_verified_by: loginId,
    };
    dispatch(verifyKycEachTab(veriferDetails))
      .then((resp) => {
        resp?.payload?.merchant_info_status &&
          toast.success(resp?.payload?.merchant_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });

  }

  const handleRejectClick = (merchant_info_reject_comments="") => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_rejected_by: loginId,
      merchant_info_reject_comments:merchant_info_reject_comments


    };
    if (window.confirm("Reject Business Details")) {
    dispatch(rejectKycOperation(rejectDetails))
      .then((resp) => {
        resp?.payload?.merchant_info_status &&
          toast.success(resp?.payload?.merchant_info_status);
        resp?.payload && toast.error(resp?.payload);
        dispatch(GetKycTabsStatus({login_id: merchantKycId?.loginMasterId})) // used to remove kyc button beacuse updated in redux store
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
    }

  }

  return (
    <div className="row mb-4 border">
      <div className="col-lg-12">
        <h3 className="font-weight-bold">Business Details</h3>
      </div>

      <div className="col-sm-12 col-md-12 col-lg-12 marg-b">
        <label className="col-form-label mt-0 p-2">
          GSTIN<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.gstNumber
          }
        />
        <span>
          {merchantKycId?.gstNumber && merchantKycId?.gstNumber !== null || merchantKycId?.gstNumber !== "" ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Business PAN<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.panCard}
        />
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Authorized Signatory PAN{" "}
          <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.signatoryPAN
          }
        />
         <span>
          {merchantKycId?.signatoryPAN && merchantKycId?.signatoryPAN !== null || merchantKycId?.signatoryPAN !== "" ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Business Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.companyName ? merchantKycId?.companyName : ""
          }
        />
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          PAN Owner's Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.nameOnPanCard
          }
        />
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Address<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.operationalAddress
          }
        />
      </div>
      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          City<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.cityId}
        />
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          State<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={
            merchantKycId?.state_name
          }
        />
      </div>

      <div className="col-sm-12 col-md-6 col-lg-6">
        <label className="col-form-label mt-0 p-2">
          Pincode<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.pinCode}
        />


      </div>
      <div className="col-lg-6 font-weight-bold mt-1 ">
        <p>Status : <span>{KycTabStatus?.merchant_info_status}</span></p>
        <p>Comments : <span>{KycTabStatus?.merchant_info_reject_comments}</span></p>
      </div>
      
      <div className="col-lg-6 mt-3">
        <VerifyRejectBtn 
        KycTabStatus={KycTabStatus?.merchant_info_status}
        KycVerifyStatus={{ handleVerifyClick }}
          KycRejectStatus={{ handleRejectClick }}
           btnText={{verify:"Verify",Reject:"Reject"}}
        />
      </div>



    </div>
  )
}

export default BusinessDetails
