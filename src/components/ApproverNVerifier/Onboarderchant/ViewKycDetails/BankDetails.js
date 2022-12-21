import React from 'react'
import {verifyKycEachTab} from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';

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

    const handleRejectClick =()=>{
      const rejectDetails = {
        login_id: merchantKycId.loginMasterId,
        settlement_info_rejected_by: loginId,
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
      <h3 className="font-weight-bold">Bank Details</h3>
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6 ">
      <label class="col-form-label mt-0 p-2">
        IFSC Code<span style={{ color: "red" }}>*</span>
      </label>

      <input
        type="text"
        className="form-control"
        id="inputPassword3"
        disabled="true"
        value={merchantKycId?.ifscCode}
      />
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
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
    </div>

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
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

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
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

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
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

    <div class="col-sm-12 col-md-12 col-lg-6">
      <label class="col-form-label mt-0 p-2">
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
    <div class="col-lg-6 ">
    Status : <span>{KycTabStatus?.settlement_info_status}</span>
    </div>
        <div class="col-lg-6 mt-3">
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
