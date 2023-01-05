import React, { useState, useEffect } from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';
import CommentModalForReject from './CommentModalForReject';


function MerchantContactInfo(props) {
  
  const { merchantKycId, KycTabStatus } = props
  const [buttonText, setButtonText] = useState("Save and Next");

  const [isVerified, setIsVerified] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);
  const [isRejected, setIsRejected] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);


let commentsStatus=KycTabStatus.general_info_reject_comments;

  const dispatch = useDispatch();
  const { role, kycid } = props;

  const { auth, kyc } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;

  useEffect(() => {
    if (role.approver) {
      // setReadOnly(true);
      setButtonText("Approve");
    } else if (role.verifier) {
      // setReadOnly(true);
      setButtonText("Verify");
    }
  }, [role]);

  const handleVerifyClick = () => {

    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      general_info_verified_by: loginId,
    };

    dispatch(verifyKycEachTab(veriferDetails))
      .then((resp) => {
        resp?.payload?.general_info_status &&
          toast.success(resp?.payload?.general_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  }

  const handleRejectClick = (general_info_reject_comments="") => {
   
    
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      general_info_rejected_by: loginId,
      general_info_reject_comments:general_info_reject_comments


    };
    if (window.confirm("Reject Merchant Contact Info?")) {
    dispatch(rejectKycOperation(rejectDetails))
      .then((resp) => {
        resp?.payload?.merchant_info_status &&
          toast.success(resp?.payload?.general_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);
        dispatch(GetKycTabsStatus({login_id: merchantKycId?.loginMasterId})) // used to remove kyc button beacuse updated in redux store
      })
    
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
    }

  }

 


const callBackFn = (id) =>{
  console.log("id",id);
}

  return (
    <div className="row mb-4 border">
      <div className="col-lg-12">
        <h3 className="font-weight-bold">Merchant Contact Info</h3>
      </div>
      

      <div className="col-sm-6 col-md-6 col-lg-6 ">
        <label className="col-form-label mt-0 p-2">
          Contact Name<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.name}
        />
      </div>

      <div className="col-sm-6 col-md-6 col-lg-6 ">
        <label className="col-form-label mt-0 p-2">
          Aadhaar Number <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.aadharNumber}
        />
      </div>


      <div className="col-sm-6 col-md-6 col-lg-6 ">
        <label className="col-form-label mt-0 p-2">
          Contact Number<span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.contactNumber}
        />

        <span>
          {merchantKycId?.isContactNumberVerified === 1 ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>
      </div>
      <div className="col-sm-6 col-md-6 col-lg-6 ">
        <label className="col-form-label mt-0 p-2">
          Email Id<span style={{ color: "red" }}>*</span>
        </label>

        <input
          type="text"
          className="form-control"
          id="inputPassword3"
          disabled="true"
          value={merchantKycId?.emailId}
        />
        <span>
          {merchantKycId?.isEmailVerified === 1 ? (
            <p className="text-success">Verified</p>
          ) : (
            <p className="text-danger"> Not Verified</p>
          )}
        </span>

      </div>

      <div className="col-lg-6 font-weight-bold">
        Status : <span>{KycTabStatus?.general_info_status}</span>
      </div>
      <div className="col-lg-7 font-weight-bold mt-1">
        Comments : <span>{KycTabStatus?.general_info_reject_comments}</span>
      </div>
      <div className="col-lg-6">
        <VerifyRejectBtn
         KycTabStatus={KycTabStatus?.general_info_status}
          KycVerifyStatus={{ handleVerifyClick, isVerified }}
          ContactComments={commentsStatus}
          check={callBackFn}
          KycRejectStatus={{ handleRejectClick, isRejected }}
          btnText={{ verify: "Verify", Reject: "Reject" }}
        />
      </div>
    </div>

  )
}

export default MerchantContactInfo