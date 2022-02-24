import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import validation from "../validation";



const VerifyEmailPhone = (props)  => {
const [emailotp , setEmailotp] = useState("");
const [smsotp , setSmsotp] = useState("");
const [errors, setErrors] =useState({});
const [verify, setverify] = useState(false)

    
    const {handleFormSubmit} = props;


    const Email = (e) => {
      setEmailotp(e.target.value)
    }

    const Sms = (e) => {
      setSmsotp(e.target.value)
    }

    //Email OTP
    
    const emailverify = (e) => {
      setErrors(validation({ emailotp}))
      e.preventDefault();
    }

    //SMS OTP 
    const smsverify = (e) => {
      setErrors(validation({ smsotp}))
      e.preventDefault();
      props.props('a3')

    }

    
    
    const handleSubmit = (e) => {
        e.preventDefault();
       
      }
    
  return (
    <React.Fragment>
    <div className="container-fluid bg-info">
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
                        <div className="form-group mb-2">
                        <label htmlFor="staticEmail2" className="sr-only">Email OTP</label>
                        <input type="text" readOnly className="form-control-plaintext" id="staticEmail2" />
                        </div>
                            <div className="form-group mx-sm-3 mb-2">
                                <label htmlFor="inputEmailOTP" className="sr-only">emailOTP</label>
                                <input type="text"  className="form-control" id="inputEmailOTP" value={emailotp} onChange={Email} placeholder="Email OTP"/>
                                <br />
                                <br />
                                <br />
                                {errors.emailotp && <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" , top: '157px'}} >{errors.emailotp}</p>}
                            </div>
                        <button type="submit" name = "emailverify" className="btn btn-primary mb-2" value = "firstone" onClick={emailverify} >Verify</button>
                        {/* onClick={()=>props.props('a3')} */}
                    </div>

                    <div className="form-inline">
                        <div className="form-group mb-2">
                        <label htmlFor="staticPhone2" className="sr-only">SMS OPT</label>
                        <input type="text" readOnly className="form-control-plaintext" id="staticPhone2"/>
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="inputSmsOtp2" className="sr-only">SMS OTP</label>
                        <input type="text" pattern="\d{6}" className="form-control" value={smsotp} onChange={Sms} id="inputSmsOtp2" placeholder="SMS OTP" />
                        <br />
                        {errors.smsotp && <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" , top: '214px'}} >{errors.smsotp}</p>}
                        </div>
                        <button type="submit" name = "otpverify" value = "secondone" className="btn btn-primary mb-2" onClick={smsverify} >Verify</button>
                        {/* onClick={()=>props.props('a3')}  */}
                    </div>
                </form>
            <p className="card-text" style={{display: "none"}}>With supporting text below as a natural lead-in to additional content.</p>
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