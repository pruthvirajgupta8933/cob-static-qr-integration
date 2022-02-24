import React from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";



function VerifyEmailPhone(props) {
    
    const {handleFormSubmit} = props;
    
    function handleSubmit(e) {
        e.preventDefault();
        // handleFormSubmit("a2");
        console.log('You clicked submit.');
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
                        <input type="text" readOnly className="form-control-plaintext" id="staticEmail2" defaultValue="Enter Email OTP" />
                        </div>
                            <div className="form-group mx-sm-3 mb-2">
                                <label htmlFor="inputEmailOTP" className="sr-only">emailOTP</label>
                                <input type="text" className="form-control" id="inputEmailOTP" placeholder="Email OTP" />
                            </div>
                        <button type="submit" className="btn btn-primary mb-2">Verify</button>
                        {/* onClick={()=>props.props('a3')} */}
                    </div>

                    <div className="form-inline">
                        <div className="form-group mb-2">
                        <label htmlFor="staticPhone2" className="sr-only">SMS OPT</label>
                        <input type="text" readOnly className="form-control-plaintext" id="staticPhone2" defaultValue="SMS OTP" />
                        </div>
                        <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="inputSmsOtp2" className="sr-only">SMS OPT</label>
                        <input type="text" className="form-control" id="inputSmsOtp2" placeholder="SMS OTP" />
                        </div>
                        <button type="submit" className="btn btn-primary mb-2">Verify</button>
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