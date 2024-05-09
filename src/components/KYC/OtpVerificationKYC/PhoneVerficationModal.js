import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForPhone } from "../../../slices/kycSlice";
import OtpInput from "react-otp-input";
import { useEffect } from "react";


const PhoneVerficationModal = ({ show, setShow, setFieldValue }) => {


  const dispatch = useDispatch();

  const [otpForPhone, setOtpForPhone] = useState({ otp: "" })
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const KycVerificationToken = useSelector(
    (state) =>
      state.kyc.OtpResponse.verification_token
  );


  const handleChangeForOtpPhone = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtpForPhone({ otp });
    }
  };


  //-----------------Functionality To Verify The OTP ----------------------
  const handleVerificationOfPhone = () => {
    setIsLoading(true)
    setIsDisable(true)

    dispatch(
      otpVerificationForContactForPhone({
        verification_token: KycVerificationToken,
        otp: otpForPhone.otp,
      })
    ).then((res) => {
      // console.log(res?.payload?.status_code)
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          setIsLoading(false)
          setIsDisable(false)
          toast.success(res.payload.message)
          setFieldValue("isContactNumberVerified", 1)
          setShow(false, "phone")
        } else if (res?.payload?.status === false) {
          toast.error(res.payload.message)
          setIsLoading(false)
          setIsDisable(false)
          setFieldValue("isContactNumberVerified", null)
        } else if (res?.payload?.status_code === 500) {
          setIsDisable(false)
          toast.error(res.payload.message)
          setFieldValue("isContactNumberVerified", null)
        }
      }
    }).catch(err => {
      // console.log(err)
      toast.error(err)
    })

  }


  useEffect(() => {
    setOtpForPhone({ otp: "" })
  }, [show])


  //---------------------------------------------------------


  return (
    <div className="modal fade show mt-5"
      // id="forPhone"
      // role="dialog"
      aria-labelledby="phoneModal"
     ariaHidden="true"
      style={{ display: show ? "block" : "none", backgroundColor: "#000000a8" }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title paymentHeader" id="phoneModal">
              OTP Verification
            </h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal1"
              aria-label="Close"
              onClick={() => { setShow(false, "phone") }}
            >
              <span ariaHidden="true">&times;</span>
            </button>
          </div>
          <div className="mx-auto p-3">
            <h5 className="">
              Please enter the verification code sent to your phone number !
            </h5>
          </div>
          <div className="modal-body justify-content-center d-flex-inline">

            <div className=" justify-content-center d-flex-inline" >
              <OtpInput
                separator={
                  <span>
                    <strong>-</strong>
                  </span>
                }
                containerStyle="d-flex justify-content-center"
                isInputNum={true}
                value={otpForPhone.otp}
                onChange={handleChangeForOtpPhone}
                inputStyle={{
                  align: "centre",
                  width: "3rem",
                  height: "3rem",
                  fontSize: "2rem",
                  borderRadius: 4,
                  border: "1px solid rgba(0,0,0,0.3)",
                }}
                numInputs={6}

              />
            </div>
            <div className="m-4 text-center">
              <button className="btn btn cob-btn-primary" type="button"
                onClick={handleVerificationOfPhone}
                disabled={disable}

              >
                {isLoading ?
                  <span className="spinner-border spinner-border-sm" role="status">
                    <span className="sr-only">Loading...</span>
                  </span>
                  :
                  "Verify"
                }
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default PhoneVerficationModal