import React, { useEffect, useMemo, useState } from 'react'
import { verifyKycEachTab, GetKycTabsStatus } from "../../../../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from '../../../../slices/kycOperationSlice';
import VerifyRejectBtn from './VerifyRejectBtn';
import { fetchBankList } from '../../../../services/approver-dashboard/merchantReferralOnboard.service';

const BankDetails = (props) => {
  const dispatch = useDispatch();
  const [bankName, setBankName] = useState("")
  const { KycTabStatus, selectedUserData } = props;
  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;

  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: selectedUserData.loginMasterId,
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
      login_id: selectedUserData.loginMasterId,
      settlement_info_rejected_by: loginId,
      settlement_info_reject_comments: settlement_info_reject_comments,
    };
    if (window.confirm("Reject Bank Details?")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));
        if (resp?.payload?.merchant_info_status) {
          toast.success(resp.payload.settlement_info_status);
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }
        dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })); // Used to remove kyc button because it's updated in the redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };


  const bankid = useMemo(() => {
    return selectedUserData?.merchant_account_details?.bankId
  }, [selectedUserData])


  useEffect(() => {
    // console.log("usef Caallll")
    // fetchBankList().then(resp => {
    //   const bankData = resp.data?.filter((item) => item.bankId === bankid)
    //   setBankName(bankData[0].bankName)
    // }).catch(err => console.log("err", err))


  }, [bankid])


  const inputFields = [
    {
      label: "IFSC Code",
      value: selectedUserData?.merchant_account_details?.ifsc_code,
      verificationMessage: selectedUserData?.merchant_account_details?.ifsc_code === null || selectedUserData?.merchant_account_details?.ifsc_code === "" ? "Not Verified" : "Verified"
    },
    {
      label: "Business Account Number",
      value: selectedUserData?.merchant_account_details?.account_number,
      verificationMessage: selectedUserData?.merchant_account_details?.account_number === null || selectedUserData?.merchant_account_details?.account_number === "" ? "Not Verified" : "Verified"
    },
    {
      label: "Account Holder Name",
      value: selectedUserData?.merchant_account_details?.account_holder_name,
      verificationMessage: ""
    },
    {
      label: "Account Type",
      value: selectedUserData?.merchant_account_details?.accountType,
      verificationMessage: ""
    },
    {
      label: "Bank Name",
      value: selectedUserData?.bankName,
      verificationMessage: ""
    },
    {
      label: "Branch",
      value: selectedUserData?.merchant_account_details?.branch,
      verificationMessage: ""
    }
  ];


  return (
    <div className="row mb-4 border p-1">
      <h5 className="">Bank Details</h5>

      <div className="form-row g-3">
        {inputFields.map((field, index) => (
          <div key={index} className="col-sm-12 col-md-12 col-lg-6">
            <label>{field.label}</label>
            {field.value !== undefined ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  disabled="true"
                  value={field.value}
                />
                {field.verificationMessage && (
                  <span>
                    {field.verificationMessage === "Not Verified" ? (
                      <p className="text-danger">{field.verificationMessage}</p>
                    ) : (
                      <p className="text-success">{field.verificationMessage}</p>
                    )}
                  </span>
                  
                )}
                {index < inputFields.length - 1 && <div className='mb-3'></div>}
              </>
            ) : (
              <p className='font-weight-bold'>Loading...</p>
            )}
          </div>
        ))}


        {/* <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
            Business Account Number

          </label>

          <input
            type="text"
            className="form-control"
            disabled="true"
            value={selectedUserData?.merchant_account_details?.account_number}
          />
          <span>
            {selectedUserData?.merchant_account_details?.account_number === null || selectedUserData?.merchant_account_details?.account_number === "" ? (
              <p className="text-danger"> Not Verified</p>

            ) : (
              <p className="text-success">Verified</p>
            )}
          </span>



        </div> */}

      </div>
      {/* <div className="form-row g-3">

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
            Account Holder Name
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={
              selectedUserData?.merchant_account_details
                ?.account_holder_name
            }
          />
        </div>

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
            Account Type
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={
              selectedUserData?.merchant_account_details
                ?.accountType
            }
          />
        </div>
      </div> */}
      {/* <div className="form-row g-3">

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
            Bank Name
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={selectedUserData?.bankName}
          />
        </div>

        <div className="col-sm-12 col-md-12 col-lg-6">
          <label className="">
            Branch
          </label>
          <input
            type="text"
            className="form-control"
            disabled="true"
            value={selectedUserData?.merchant_account_details?.branch}
          />

        </div>
      </div> */}


      <div className="form-row g-3">

        <div className="col-lg-6 font-weight-bold">
          <p className='m-0'>Status : <span>{KycTabStatus?.settlement_info_status}</span></p>
          <p className='m-0'>Comments : <span>{KycTabStatus?.settlement_info_reject_comments}</span></p>
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
