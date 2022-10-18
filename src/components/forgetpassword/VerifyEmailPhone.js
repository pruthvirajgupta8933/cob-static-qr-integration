import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import API_URL from "../../config";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
import validation from "../validation";

// import { verifyOtpOnForgotPwdSlice } from "../../slices/auth";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify'
import axios from "axios";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";


const VerifyEmailPhone = (props) => {
  const { handleFormSubmit } = props;
  // const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  console.log(auth.forgotPassword.sendUserName)
  let history = useHistory();


  const [emailotp, setEmailotp] = useState("");
  const [smsotp, setSmsotp] = useState("");
  const [errors, setErrors] = useState({});
  const [verify, setverify] = useState(null)
  //const [username, setUserName] = useState(auth.forgotPassword.sendUserName.username)
  const username = auth.forgotPassword.sendUserName.username;
  const verification_token = auth.forgotPassword.otpResponse.verification_token;
  // console.log(verification_token,"here is my verification token")

  // const {handleFormSubmit} = props;
  const Email = (e) => {
    setEmailotp(e.target.value)
  }

  const Sms = (e) => {
    setSmsotp(e.target.value)
  }

  //Email OTP

  const emailverify = async (e) => {
    setErrors(validation({ emailotp }))
    // e.preventDefault();

    errors?.emailotp === false ? setverify(true) : setverify(false)
    // alert(verify);
    // props.props('a3');

    //dispatch(verifyOtpOnForgotPwdSlice())
    // if(verify){
    const sendOtp = JSON.stringify({
      verification_token: verification_token,
      otp: emailotp
    });

    await axiosInstanceAuth.post(API_URL.AUTH_VERIFY_OTP_ON_FWD, sendOtp, { headers: { "Content-Type": "application/json" } })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
          toast.success(response.data.message);
          props.props('a3')
        }
        else {
          toast.error(response.data.message);
        }
      }).catch((error) => {
        toast.error(error?.response?.data["message"])
      });



    // dispatch(verifyOtpOnForgotPwdSlice(sendOtp))
    // }

  }

  //SMS OTP 
  const smsverify = (e) => {
    // setErrors(validation({ smsotp}))
    setErrors(false)
    e.preventDefault();
    // props.props('a3')

  }



  const handleSubmit = (e) => {
    e.preventDefault();

  }

  return (
    <React.Fragment>
      <div className="container-fluid toppad ">
        <div className="row">
          <div className="col-sm-6 mx-auto">
            <div className="card ">
              <div className="card-header text-center">
                Forget Password
              </div>
              <div className="card-body">
                <h5 className="card-title">We have sent the OTP on your registered Email Address and on Phone Number.  </h5>
                <form className="form-inline" onSubmit={handleSubmit} >
                  <div className="form-inline" >

                    <div className="form-group mx-sm-3 mb-2 float-center">
                      <label htmlFor="inputEmailOTP" className="sr-only">emailOTP</label>
                      <input type="text" className="form-control" id="inputEmailOTP" value={emailotp} onChange={Email} placeholder="Email OTP" />
                      <br />
                      <br />
                      <br />
                      {errors.emailotp && <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999", top: '157px' }} >{errors.emailotp}</p>}
                    </div>
                    <button type="button" name="emailverify" className="btn btn-primary mb-2" value="firstone" onClick={() => emailverify()} >Verify</button>
                    {/* onClick={()=>props.props('a3')} */}
                  </div>

                  <div className="form-inline" style={{ display: "none" }}>
                    <div className="form-group mb-2">
                      <label htmlFor="staticPhone2" className="sr-only">SMS OPT</label>
                      <input type="text" readOnly className="form-control-plaintext" id="staticPhone2" />
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                      <label htmlFor="inputSmsOtp2" className="sr-only">SMS OTP</label>
                      <input type="text" pattern="\d{6}" className="form-control" value={smsotp} onChange={Sms} id="inputSmsOtp2" placeholder="SMS OTP" />
                      <br />
                      {errors.smsotp && <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999", top: '214px' }} >{errors.smsotp}</p>}
                    </div>
                    <button type="submit" name="otpverify" value="secondone" className="btn btn-primary mb-2" onClick={() => smsverify()} >Verify</button>
                    {/* onClick={()=>props.props('a3')}  */}
                  </div>
                </form>
                <p className="card-text" style={{ display: "none" }}>With supporting text below as a natural lead-in to additional content.</p>
              </div>
              <div className="card-footer text-muted text-center">
                Sabpaisa.in
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default VerifyEmailPhone