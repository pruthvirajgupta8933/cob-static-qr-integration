import React from 'react'
import {verifyKycEachTab} from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';

const BankDetails = (props) => {
  const dispatch=useDispatch();
    const {merchantKycId,KycTabStatus}=props;
    const { auth } = useSelector((state) => state);
   
    const { user } = auth;
    const { loginId } = user;

    const handleVerifyClick=()=>{
      const veriferDetails = {
        login_id: merchantKycId.loginMasterId,
        settlement_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.settlement_info_status &&
            toast.success(resp?.payload?.settlement_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }

    const handleRejectClick =(settlement_info_reject_comments="")=>{
      const rejectDetails = {
        login_id: merchantKycId.loginMasterId,
        settlement_info_rejected_by: loginId,
        settlement_info_reject_comments:settlement_info_reject_comments

      };
      if (window.confirm("Reject Bank Details?")) {
      dispatch(rejectKycOperation(rejectDetails))
        .then((resp) => {
          resp?.payload?.merchant_info_status &&
            toast.success(resp?.payload?.merchant_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
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
      <h3 className="font-weight-bold">Bank Details</h3>
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6 ">
      <label className="col-form-label mt-0 p-2">
        IFSC Code<span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.ifscCode}
      />
       <span>
          {merchantKycId?.ifscCode && merchantKycId?.ifscCode !== null || merchantKycId?.ifscCode !== "" ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6">
      <label className="col-form-label mt-0 p-2">
        Business Account Number
        <span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountNumber
        }
      />
       <span>
          {merchantKycId?.accountNumber && merchantKycId?.accountNumber !== null || merchantKycId?.accountNumber !== "" ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
      
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6">
      <label className="col-form-label mt-0 p-2">
        Account Holder Name<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountHolderName
        }
      />
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6">
      <label className="col-form-label mt-0 p-2">
        Account Type<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={
          merchantKycId?.accountType
        }
      />
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6">
      <label className="col-form-label mt-0 p-2">
        Bank Name<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.bankName}
      />
    </div>

    <div className="col-sm-12 col-md-12 col-lg-6">
      <label className="col-form-label mt-0 p-2">
        Branch<span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.branch}
      />
      
    </div>
    <div className="col-lg-6 font-weight-bold mt-1 ">
    Status : <span>{KycTabStatus?.settlement_info_status}</span>
    </div>
    <div className="col-lg-7 font-weight-bold mt-1 ">
     Comments : <span>{KycTabStatus?.settlement_info_reject_comments}</span>
      </div>
        <div className="col-lg-6 mt-3">
        <VerifyRejectBtn 
        KycTabStatus={KycTabStatus?.settlement_info_status}
        KycVerifyStatus={{ handleVerifyClick }}
          KycRejectStatus={{ handleRejectClick }}
        btnText={{verify:"Verify",Reject:"Reject"}}
         />
        </div>
    
  </div>
     )
}

export default BankDetails
