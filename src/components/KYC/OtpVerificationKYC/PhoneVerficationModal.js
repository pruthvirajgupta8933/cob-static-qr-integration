import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpVerificationForContactForPhone } from "../../../slices/kycSlice";
import OtpInput from "react-otp-input";


const PhoneVerficationModal = ({ show, setShow }) => {

  const KycVerificationToken = useSelector(
    (state) =>
      state.kyc.OtpResponse.verification_token
  );

  const [otpForPhone, setOtpForPhone] = useState({ otp: "" })



  const dispatch = useDispatch();

  const handleChangeForOtpPhone = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtpForPhone({ otp });
    }
  };


  //-----------------Functionality To Verify The OTP ----------------------
  const handleVerificationOfPhone = () => {

    dispatch(
      otpVerificationForContactForPhone({
        verification_token: KycVerificationToken,
        otp: otpForPhone.otp,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message)
          setShow(false,"phone")
        } else if (res.payload.status === false) {
          toast.error(res.payload.message)
        }
      } 
    });

  }


  //---------------------------------------------------------


  return (
    <div>
      <div
        className="modal fade show"
        id="forPhone"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="phoneModal"
        aria-hidden="true"
        style={{ display: show ? "block" : "none" ,marginLeft:"233px",marginTop:"107px"}}
       
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <>
              <div className="modal-header">
                <h3 className="modal-title paymentHeader" id="phoneModal">
                  OTP Verification
                </h3>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal1"
                  aria-label="Close"
                  onClick={()=>{setShow(false,"phone")}}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="mx-auto py-3">
                <h1 className="subHeaderForModal">
                  Please enter the verification code sent to your
                  Phone !
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
                    value={otpForPhone.otp}
                    onChange={handleChangeForOtpPhone}
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
                <button className="btn" type="button" style={{backgroundColor:"#0156B3"}}
                    onClick={handleVerificationOfPhone}
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

export default PhoneVerficationModal