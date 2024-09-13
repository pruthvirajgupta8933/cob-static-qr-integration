import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomModal from "../../../_components/custom_modal";
import TimerComponent from "../../../utilities/TimerComponent";
import toastConfig from "../../../utilities/toastTypes";
import { kycValidatorAuth } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";
import { ErrorMessage, Field } from "formik";


const AadhaarVerficationModal = ({ formikFields, isOpen, toggle, resendOtp }) => {
  const { values, setFieldValue, errors } = formikFields
  const [isLoading, setIsLoading] = useState(false);
  const { aadharOtpResponse } = useSelector((state) => state.kycValidatorReducer)


  const aadharOtpVerification = async () => {
    setIsLoading(true)
    try {
      const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, { referenceId: aadharOtpResponse?.referenceId, otp: values.aadhaarOtpDigit })
      if (resp.data?.valid && resp.data?.status) {
        setFieldValue("oldAadharNumber", values.aadhar_number)
        setFieldValue("isIdProofVerified", 1)
      }
      toastConfig.successToast(resp?.data?.message)
      modalCloseHandler()
      setIsLoading(false)
    } catch (error) {
      toastConfig.errorToast(error?.response?.data?.message ?? "Something went wrong, Please try again")
      setIsLoading(false)
    }
  }

  const modalCloseHandler = () => {
    toggle(false)
  }

  const resendOtpHandler = () => {
    resendOtp(values.aadhar_number, setFieldValue)
  }



  // aadhar verification
  const aadharModalBody = () => {
    return (
      <React.Fragment>
        <div class="mx-auto text-center"><h6 >Please enter the verification code sent to your phone number !</h6></div>
        <div className=" justify-content-center d-flex-inline d-flex" >
          <Field
            type="text" className="form-control otp-input-kyc"
            name="aadhaarOtpDigit"
            maxLength={6}
            placeholder="Enter OTP"
            required={true}
            disabled={isLoading}
          />

        </div>
        <ErrorMessage name="aadhaarOtpDigit">
          {(msg) => (
            <p className="text-danger text-center m-1">
              {msg}
            </p>
          )}
        </ErrorMessage>
        <div className="row m-4 text-center">
          <div className="col-lg-6">
            <TimerComponent resend={resendOtpHandler} />
          </div>
          <div className="col-lg-6">
            <button className="btn btn cob-btn-primary btn-sm" type="button"
              disabled={isLoading || errors.hasOwnProperty("aadhaarOtpDigit")}
              onClick={aadharOtpVerification}
            >
              {isLoading ?
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
                :
                "Verify OTP"
              }
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }


  return (isOpen ? <CustomModal headerTitle={"Aadhaar Verification"} modalBody={aadharModalBody} modalToggle={isOpen} fnSetModalToggle={() => modalCloseHandler()} modalSize="modal-md" /> : <></>)
}

export default AadhaarVerficationModal