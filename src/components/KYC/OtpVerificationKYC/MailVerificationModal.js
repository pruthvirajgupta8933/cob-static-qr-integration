import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForEmail } from "../../../slices/kycSlice";
import OtpInput from "react-otp-input";

const MailVerificationModal = ({ show, setShow }) => {

  const dispatch = useDispatch();

  const KycVerificationToken = useSelector(
    (state) =>
      state.kyc.OtpResponse.verification_token
  );

  const [otp, setOtp] = useState({ otp: "" });


  const handleChangeForOtp = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtp({ otp });
    }
  };

  //-----------------Functionality To Verify The OTP ----------------------
  const handleVerificationOfEmail = () => {

    dispatch(
      otpVerificationForContactForEmail({
        verification_token: KycVerificationToken,
        otp: otp.otp,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message)
          setShow(false,"email")
        } else if (res.payload.status === false) {
          toast.error(res.payload.message)
        }
      }
    });

  }





  return (
    <div>
      <div
        className="modal fade show"
        id="forEmail"
        role="dialog"
        aria-labelledby="exampleModalLabel"
       ariaHidden="true"
        style={{ display: show ? "block" : "none",marginLeft:"233px",marginTop:"42px" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">


            <>
              <div className="modal-header">
                <h3 className="modal-title paymentHeader" id="exampleModalLabel">
                  OTP Verification
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal1"
                  aria-label="Close"
                  onClick={() =>setShow(false,"email")}
                >
                  <span ariaHidden="true">&times;</span>
                </button>
              </div>
              <div className="mx-auto py-3">
                <h1 className="subHeaderForModal">
                  Please enter the verification code sent to your
                  email !
                </h1>
              </div>
              <div className="modal-body">

                <div className="form-group mx-auto py-3" style={{ width: "506px" }}>
                  <OtpInput
                    separator={
                      <span>
                        <strong>.</strong>
                      </span>
                    }
                    isInputNum={true}
                    value={otp.otp}
                    onChange={handleChangeForOtp}
                    inputStyle={{
                      align: "centre",
                      width: "3rem",
                      height: "3rem",
                      margin: "0px 1rem",
                      fontSize: "2rem",
                      borderRadius: 4,
                      border: "1px solid rgba(0,0,0,0.3)",
                    }}
                    numInputs={6}
                  />
                </div>
                <div className="col-md-11 text-center">
                <button className="btn" type="button" style={{backgroundColor:"#0156B3"}}
                    onClick={handleVerificationOfEmail}
                  >
                    <h4 className="text-white text-kyc-sumit">Verify</h4>  
                  </button>
                </div>

              </div>
            </>

          </div>
        </div>
      </div>
    </div>
  )
}

export default MailVerificationModal