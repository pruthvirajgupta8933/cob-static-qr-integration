import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForEmail } from "../../../slices/kycOtp";
import OtpInput from "react-otp-input";

const MailVerificationModal = ({ show, setShow }) => {

  const dispatch = useDispatch();

  const KycVerificationToken = useSelector(
    (state) =>
      state.KycOtpSlice.OtpResponse.verification_token
  );

  const [otp, setOtp] = useState({ otp: "" });



  // console.log(show,"<=====")
  // console.log(mailValidate,"<=====")

  const [checked, setChecked] = useState(false);

  // const onChangeHandler = () => {
  //   // mailValidate(!check, checked)
  //   setFieldValue("isMobileVerified", checked)
  // }

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
        otp: parseInt(otp.otp, 10),
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message)
          // check(true)
          setShow(false,"email")
        } else if (res.payload.status === false) {
          toast.error(res.payload.message)
        }
      } else {

      }
    });

  }





  return (
    <div>
      <div
        className="modal fade show"
        id="forEmail"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: show ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">


            <>
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">
                  OTP Verification
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() =>setShow(false,"email")}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="mx-auto  py-3">
                <h1>
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
                <div class="col-md-11 text-center">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    class="btn btn-primary btn-sm"
                    onClick={handleVerificationOfEmail}
                  >
                    Verify
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