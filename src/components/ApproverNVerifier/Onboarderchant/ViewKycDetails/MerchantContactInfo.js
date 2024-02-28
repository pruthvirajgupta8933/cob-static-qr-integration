import React, { useState, useEffect } from 'react'
import { kycUserList, verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice"
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';
import moment from 'moment';
// import { uniqueId } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

function MerchantContactInfo(props) {

  const { merchantKycId, KycTabStatus, selectedUserData } = props
  const [buttonText, setButtonText] = useState("Save and Next");

  const [isVerified, setIsVerified] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);
  const [isRejected, setIsRejected] = useState(KycTabStatus?.general_info_status === "Verified" ? true : false);

  let commentsStatus = KycTabStatus.general_info_reject_comments;

  const dispatch = useDispatch();
  const { role, kycid } = props;

  const { auth } = useSelector((state) => state);


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

  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: selectedUserData.loginMasterId,
        general_info_verified_by: loginId,
      };

      const resp = await dispatch(verifyKycEachTab(verifierDetails));

      if (resp?.payload?.general_info_status) {
        toast.success("Kyc Status has been updated");
        dispatch(kycUserList({ login_id: selectedUserData.loginMasterId }))
      } else if (resp?.payload?.detail) {
        toast.error(resp.payload.detail);
      }
    } catch (error) {
      toast.error("Try Again Network Error");
    }
  };


  const handleRejectClick = async (general_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: selectedUserData.loginMasterId,
      general_info_rejected_by: loginId,
      general_info_reject_comments: general_info_reject_comments,
    };

    if (window.confirm("Reject Merchant Contact Info?")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));
        // console.log(resp)
        if (resp?.payload?.general_info_status) {
          toast.success("Kyc Status has been updated");
          dispatch(kycUserList({ login_id: selectedUserData.loginMasterId }))
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }

        dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })); // Used to remove kyc button because updated in redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };
  const inputFields = [
    { label: 'Contact Person Name', value: selectedUserData?.name },
    { label: 'Aadhaar Number', value: selectedUserData?.aadharNumber },
    { label: 'Contact Number', value: selectedUserData?.contactNumber, verified: selectedUserData?.isContactNumberVerified },
    { label: 'Email Id', value: selectedUserData?.emailId, verified: selectedUserData?.isEmailVerified }
  ];



  return (
    <div className="row mb-4 p-1 border">
      <h5 className="">Merchant Contact Info</h5>
      <div className="form-row g-3">
        {inputFields?.map((field) => (
          <div className="col-sm-6 col-md-6 col-lg-6 mb-3" key={uuidv4()}>
            <label className="">{field.label}</label>
            {field.value !== undefined ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  disabled={true}
                  value={field.value}
                />
                <span>
                  {field.verified !== undefined && (
                    <p className={field.verified === 1 ? "text-success" : "text-danger"}>
                      {field.verified === 1 ? "Verified" : "Not Verified"}
                    </p>
                  )}
                </span>
                {/* {index < inputFields.length - 1 && <div className='mb-3'></div>} */}
              </>
            ) : (
              <p className='font-weight-bold'>Loading...</p>

            )}
          </div>
        ))}
      </div>
      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p className='m-0'>Status : <span>{KycTabStatus?.general_info_status}</span></p>
          <p className='m-0'>Comment : <span>{KycTabStatus?.general_info_reject_comments}</span></p>
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

      </div>
    </div>

  )
}

export default MerchantContactInfo