import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForPhone } from "../../../slices/kycSlice";
import OtpInput from "react-otp-input";
import { useEffect } from "react";
import CustomModal from "../../../_components/custom_modal";
import TimerComponent from "../../../utilities/TimerComponent";
import toastConfig from "../../../utilities/toastTypes";
import { kycValidatorAuth } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";


const AadharVerficationModal = ({ show, setShow, setFieldValue, formikFields, isOpen, toggle }) => {
  const { values } = formikFields
  const [aadharNumberVerifyModalToggle, setAadharNumberVerifyToggle] = useState(false);
  const [aadharVerificationLoader, setAadharVerificationLoader] = useState(false);

  console.log("vlaues", values)

  const aadharOtpVerification = async () => {
    setAadharVerificationLoader(true)
    try {
      const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, { "referenceId": "aadharOtpResp?.referenceId", "otp": "aadharOtp" })
      // console.log(resp)

      if (resp.data?.valid && resp.data?.status) {
        // setIsAadharNumberVerified(true)
      }
      toastConfig.successToast(resp?.data?.message)
      setAadharVerificationLoader(false)
      // setAadharNumberVerifyToggle(false)
    } catch (error) {
      toastConfig.errorToast(error?.response?.data?.message ?? "Something went wrong, Please try again")
      setAadharVerificationLoader(false)
      // setAadharNumberVerifyToggle(false)
    }
  }




  // aadhar verification
  const aadharModalBody = () => {
    return (
      <div className="modal-body justify-content-center d-flex-inline">
        <div className=" justify-content-center d-flex-inline d-flex" >
          <input type="text" className="form-control otp-input-kyc"
            maxLength={6}
            placeholder="Enter OTP"
            // onChange={(e) => setAadharOtp(e.target.value)}
            // value={aadharOtp}
            required={true}
            disabled={aadharVerificationLoader}
          />
        </div>
        <div className="row m-4 text-center">
          <div className="col-lg-6">
            <TimerComponent resend={() => { }} />
          </div>
          <div className="col-lg-6">
            <button className="btn btn cob-btn-primary btn-sm" type="button"
              disabled={aadharVerificationLoader}
              onClick={() => aadharOtpVerification()}
            >
              {false ?
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
                :
                "Verify OTP"
              }
            </button>
          </div>
        </div>
      </div>
    )
  }






  console.log("open", isOpen)

  return (isOpen ? <CustomModal headerTitle={"Aadhar Verifcation"} modalBody={aadharModalBody} modalToggle={isOpen} fnSetModalToggle={() => toggle()} modalSize="modal-md" /> : <></>)
}

export default AadharVerficationModal