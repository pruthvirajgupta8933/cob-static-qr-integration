import React from 'react'
import { verifyKycEachTab } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
import { GetKycTabsStatus } from '../../../../slices/kycSlice';

const BankDetails = (props) => {
  const dispatch = useDispatch();
  const { merchantKycId, KycTabStatus } = props;
  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;

  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: merchantKycId.loginMasterId,
        settlement_info_verified_by: loginId,
      };
  
      const resp = await dispatch(verifyKycEachTab(verifierDetails));
  
      if (resp?.payload?.settlement_info_status) {
        toast.success(resp.payload.settlement_info_status);
      } else if (resp?.payload?.detail) {
        toast.error(resp.payload.detail);
      }
    } catch (error) {
      toast.error("Try Again Network Error");
    }
  };
  

  const handleRejectClick = async (settlement_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      settlement_info_rejected_by: loginId,
      settlement_info_reject_comments: settlement_info_reject_comments,
    };
  if (window.confirm("Reject Bank Details?")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));
      if (resp?.payload?.merchant_info_status) {
          toast.success(resp.payload.merchant_info_status);
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }
        dispatch(GetKycTabsStatus({ login_id: merchantKycId?.loginMasterId })); // Used to remove kyc button because it's updated in the redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };
  
return (
    <div className="row mb-4 border p-1">
      <h5 className="">Bank Details</h5>

      <div className="form-row g-3">

        <div className="col-sm-12 col-md-12 col-lg-6 ">
          <label className="">
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
            {merchantKycId?.ifscCode === null || merchantKycId?.ifscCode === "" ? (
              <p className="text-danger"> Not Verified</p>
            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
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
            {merchantKycId?.accountNumber === null || merchantKycId?.accountNumber === "" ? (
              <p className="text-danger"> Not Verified</p>

            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>



        </div>
      </div>
      <div className="form-row g-3">

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
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
          <label className="">
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
      </div>
      <div className="form-row g-3">

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
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
          <label className="">
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
      </div>
      <div className="form-row g-3">

        <div className="col-lg-6 font-weight-bold">
          <p>Status : <span>{KycTabStatus?.settlement_info_status}</span></p>
          <p>Comments : <span>{KycTabStatus?.settlement_info_reject_comments}</span></p>
        </div>
        <div className="col-lg-6 mt-3">
          <VerifyRejectBtn
            KycTabStatus={KycTabStatus?.settlement_info_status}
            KycVerifyStatus={{ handleVerifyClick }}
            KycRejectStatus={{ handleRejectClick }}
            btnText={{ verify: "Verify", Reject: "Reject" }}
          />
        </div>
      </div>
    </div>
  )
}

export default BankDetails
