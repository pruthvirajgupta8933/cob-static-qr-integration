import React, { useState, useEffect } from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';


function MerchantContactInfo(props) {

  const { merchantKycId, KycTabStatus } = props
  const [buttonText, setButtonText] = useState("Save and Next");

  const [isVerified, setIsVerified] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);
  const [isRejected, setIsRejected] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);


  let commentsStatus = KycTabStatus.general_info_reject_comments;

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

  const handleRejectClick = (general_info_reject_comments = "") => {


    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      general_info_rejected_by: loginId,
      general_info_reject_comments: general_info_reject_comments


    };
    if (window.confirm("Reject Merchant Contact Info?")) {
      dispatch(rejectKycOperation(rejectDetails))
        .then((resp) => {
          // console.log(resp)



          resp?.payload?.merchant_info_status &&
            toast.success(resp?.payload?.general_info_status);
          resp?.payload && toast.error(resp?.payload);

          dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId })) // used to remove kyc button beacuse updated in redux store
        })

        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }

  }


  return (
    <div className="row mb-4 p-1 border">
      <h5 className="">Merchant Contact Info</h5>
      <div className="form-row g-3">
        <div className="col-sm-6 col-md-6 col-lg-6">
          <label className="">
            Contact Name<span className="text-danger">*</span>
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
          <label className="">
            Aadhaar Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputPassword3"
            disabled="true"
            value={merchantKycId?.aadharNumber}
          />
        </div>


      </div>
      <div className="form-row g-3">
        <div className="col-sm-6 col-md-6 col-lg-6 ">
          <label className="">
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
          <label className="">
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
      </div>
      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p>Status : <span>{KycTabStatus?.general_info_status}</span></p>
          <p>Comments : <span>{KycTabStatus?.general_info_reject_comments}</span></p>
        </div>
        <div className="col-lg-6">
          <VerifyRejectBtn
            KycTabStatus={KycTabStatus?.general_info_status}
            KycVerifyStatus={{ handleVerifyClick, isVerified }}
            ContactComments={commentsStatus}
            KycRejectStatus={{ handleRejectClick, isRejected }}
            btnText={{ verify: "Verify", Reject: "Reject" }}
          />
        </div>
        {/* <div className="col-lg-6 font-weight-bold mt-1 mb-2">
        
      </div> */}
      </div>
    </div>

  )
}

export default MerchantContactInfo