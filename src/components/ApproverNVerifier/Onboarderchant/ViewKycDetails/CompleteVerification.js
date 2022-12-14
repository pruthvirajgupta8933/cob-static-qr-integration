import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {completeVerification,completeVerificationRejectKyc} from "../../../../slices/kycOperationSlice"


const CompleteVerification = (props) => {
  const{merchantKycId}=props;
  const dispatch=useDispatch()
  const { auth } = useSelector((state) => state);
 
  const { user } = auth;
  const { loginId } = user;

  const handleVerifyClick= () =>{
    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      verified_by: loginId,
    };
    dispatch(completeVerification(veriferDetails))
      .then((resp) => {
        resp?.payload?.general_info_status &&
          toast.success(resp?.payload?.general_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });

}

const handleRejectClick = ()=>{
  const rejectDetails = {
    login_id: merchantKycId.loginMasterId,
    rejected_by: loginId,
  };
  dispatch(completeVerificationRejectKyc(rejectDetails))
    .then((resp) => {
      resp?.payload?.message &&
        toast.success(resp?.payload?.message);
      resp?.payload?.detail && toast.error(resp?.payload?.detail);
    })
    .catch((e) => {
      toast.error("Try Again Network Error");
    });

}
  return (
    <div class="row">
       
        <div class="col-lg-6">
          <button type="button" onClick={()=>handleVerifyClick()}  class="btn btn-primary">Complete Verification</button>
          <button type="button"  onClick={()=>handleRejectClick()} class="btn btn-primary">Reject</button>
      
        </div>
    </div>
  )
}

export default CompleteVerification
