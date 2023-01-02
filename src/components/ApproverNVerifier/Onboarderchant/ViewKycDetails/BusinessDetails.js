import React from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
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

  const handleRejectClick = () => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      merchant_info_rejected_by: loginId,
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
      <div className="col-lg-6 ">
      Status : <span>{KycTabStatus?.merchant_info_status}</span>
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
