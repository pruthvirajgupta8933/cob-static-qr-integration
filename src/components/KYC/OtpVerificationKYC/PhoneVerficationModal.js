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
      // console.log(res?.payload?.status_code)
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message)
          setShow(false,"phone")
        } else if (res?.payload?.status === false) {
          toast.error(res.payload.message)
        } else if (res?.payload?.status_code === 500) {

          toast.error(res.payload.message)
        }
      } 
    }).catch(err=>{
      console.log(err)
      toast.error(err)
    })

  }


  //---------------------------------------------------------


  return (
      <div
        className="modal fade show mt-5"
        id="forPhone"
        role="dialog"
        aria-labelledby="phoneModal"
        aria-hidden="true"
        
        style={{ display: show ? "block" : "none" , backgroundColor:"#000000a8"} }
       
      >
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
                  onClick={()=>{setShow(false,"phone")}}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="mx-auto p-3">
                <h5 className="">
                  Please enter the verification code sent to your
                  Phone !
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
                      // margin: "0px 1rem",
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
                  >
                       Verify
                  </button>
                </div>

              </div>

          </div>
        </div>
      </div>
  )
}

export default PhoneVerficationModal