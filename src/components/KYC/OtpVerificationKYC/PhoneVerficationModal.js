import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForPhone } from "../../../slices/kycSlice";
import OtpInput from "react-otp-input";
import { useEffect } from "react";
import TimerComponent from "../../../utilities/TimerComponent";
import CustomModal from "../../../_components/custom_modal";
import { ErrorMessage, Field } from "formik";



const PhoneVerficationModal = ({ formikFields, isOpen, toggle, resendOtp }) => {
  const { values, setFieldValue } = formikFields


  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const KycVerificationToken = useSelector(
    (state) => state.kyc.OtpResponse.verification_token
  );

  const otpVerifyHandler = () => {
    setIsLoading(true)

    dispatch(
      otpVerificationForContactForPhone({
        verification_token: KycVerificationToken,
        otp: values.contactOtpDigit,
      })
    ).then((res) => {
      // console.log(res?.payload?.status_code)
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          setIsLoading(false)
          // setIsDisable(false)
          toast.success(res.payload.message)
          setFieldValue("isContactNumberVerified", 1)
          setFieldValue("oldContactNumber", values.contact_number)
          modalCloseHandler()
          // setShow(false, "phone")
        } else if (res?.payload?.status === false) {
          toast.error(res.payload.message)
          setIsLoading(false)
          // setIsDisable(false)
          setFieldValue("isContactNumberVerified", null)
        } else if (res?.payload?.status_code === 500) {
          // setIsDisable(false)
          setIsLoading(true)
          toast.error(res.payload.message)
          setFieldValue("isContactNumberVerified", null)
        }
      }
    }).catch(err => {
      modalCloseHandler()
      setIsLoading(true)
      toast.error(err)
    })

  }



  const modalCloseHandler = () => {
    toggle(false)
  }


  const resendOtpHandler = () => {
    resendOtp(values.contact_number, setFieldValue)
  }



  const modalBody = () => {
    return (
      <React.Fragment>
        <div class="mx-auto text-center"><h6 >Please enter the verification code sent to your phone number !</h6></div>
        <div className=" justify-content-center d-flex-inline d-flex" >
          <Field
            type="text" className="form-control otp-input-kyc"
            name="contactOtpDigit"
            maxLength={6}
            placeholder="Enter OTP"
            required={true}
            disabled={isLoading}
          />

        </div>
        <ErrorMessage name="contactOtpDigit">
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
              disabled={isLoading}
              onClick={otpVerifyHandler}
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


  return (isOpen ? <CustomModal headerTitle={"OTP Verification"} modalBody={modalBody} modalToggle={isOpen} fnSetModalToggle={() => modalCloseHandler()} modalSize="modal-md" /> : <></>)
}

export default PhoneVerficationModal