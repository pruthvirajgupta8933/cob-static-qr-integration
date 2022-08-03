import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  otpForContactInfo,
  otpVerificationForContact,
} from "../../slices/kycOtp";
import OtpInput from "react-otp-input";

function ContactInfo() {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  // console.log(user, "<<<<<=========")
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const [showOtpVerifyModalEmail, setShowOtpVerifyModalEmail] = useState(false);
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [otp, setOtp] = useState({ otp: "" });
  const [otpForPhone, setOtpForPhone] = useState({otp: ""})
  const [targetPhone, setTargetPhone] = useState({phone: ""})
  const [targetEmail, setTargetEmail] = useState({email: ""})


  const KycVerificationToken = useSelector(
    (state) =>
      state.KycOtpSlice.OtpResponse.verification_token
  );

  // console.log("======>",KycVerificationToken)
  

  const handleChangeForOtp = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtp({ otp });
    }
  };

  const handleChangeForOtpPhone = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtpForPhone({ otp });
    }
  };

  
  const initialValues = {
    name: "",
    contact_number: "",
    email_id: "",
    contact_designation: "",
    // isMobileVerified: "",
  };

  const initialValuesForMobile = {
    mobile_number: "",
    otp_type: "phone",
    otp_for: "kyc1"
  }

  const initialValuesForEmail = {
     email: "",
     otp_type: "email",
     otp_for: "kyc1"   
  }


  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    contact_number: Yup.string().required("Required"),
    email_id: Yup.string().required("Required"),
    contact_designation: Yup.string().required("Required"),
    // isMobileVerified: Yup.string().required("You need to verify Your Phone"),
  });



  const handleSubmitContact = async (values) => {



    console.log("err", values)
    try {
      const resp = await axios.put(API_URL.Save_General_Info, {
        login_id: loginId,
        modified_by:"270",
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        contact_designation: values.contact_designation,
      });
      console.log("Hello ===>", resp.data);
      toast.success(resp.data.message);
    } catch (error) {
      console.log(error, "Error Detected!!");
    }
  };



  //-----------------Functionality To Send OTP Via Email Through Button and Verify It.---------------------
  const handleToSendOTPForVerificationEmail = () => {
 
    setShowOtpVerifyModalEmail(true)  
    dispatch(
      otpForContactInfo({
        email: "harris.fazal@sabpaisa.in",
        otp_type: "email",
        otp_for: "kyc"
      })
    ).then((res) => {
  
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        console.log("This is the response", res);
        toast.success("OTP Sent to the Registered Mobile Number ");
         setShowOtpVerifyModalEmail(true)   
      } else {
       toast.error("Something went wrong! Please try again for some time.");
       setShowOtpVerifyModalEmail(false)
       //  toastConfig.infoToast(res.payload.msg);
       
      }
    });

  }

  const handleVerificationOfEmail = () => {

    dispatch(
      otpVerificationForContact({
        verification_token: KycVerificationToken,
        otp:parseInt(otp.otp, 10),
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (res.meta.requestStatus === "fulfilled") {
        console.log("This is the response", res);
        toast.success("Your Email is Verified");
        
         setShowOtpVerifyModalEmail(false)   
      } else {
       toast.error("Something went wrong! Please write the correct OTP.");
       setShowOtpVerifyModalEmail(true)
       //  toastConfig.infoToast(res.payload.msg);
       
      }
    });
    
  }

//----------------------------------------------------------------------------------------



  //-----------------Functionality To Send OTP Via Phone Through Button and Verify It.---------------------


  const handleToSendOTPForVerificationPhone = () => {

    setShowOtpVerifyModalPhone(true)   
    dispatch(
      otpForContactInfo({
        mobile_number: "9717506705",
        otp_type: "phone",
        otp_for: "kyc"
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        toast.success("OTP Sent to the Registered Mobile Number ");
         setShowOtpVerifyModalPhone(true)   
      } else {
       toast.error(res.payload.message);
      
       setShowOtpVerifyModalPhone(false)
       //  toastConfig.infoToast(res.payload.msg);
       
      }
    });

  }

  const handleVerificationOfPhone = () => {
  

    dispatch(
      otpVerificationForContact({
        verification_token: KycVerificationToken,
        otp:parseInt(otpForPhone.otp, 10),
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Your Phone is Verified");
        console.log("=====>",res)
         setShowOtpVerifyModalPhone(false)   
      } else {
       toast.error("Something went wrong! Please write the correct OTP.");
       console.log(res)
       setShowOtpVerifyModalPhone(true)
       //  toastConfig.infoToast(res.payload.msg);
       
      }
    });

  }

//-------------------------------------------------------------------------------------------------------







  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
      >
        {(formik) => (
          <Form>
            {/* {console.log(formik.errors?.isMobileVerified)} */}
            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Contact Email *"
                  name="email_id"
                  placeholder="Enter Contact Email"
                  className="form-control"
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  class="btn btn-primary btn-sm"
                  data-toggle="modal"
                  data-target="#forEmail"
                  onClick={handleToSendOTPForVerificationEmail}
                >
                  Send OTP To Verify
                </button>
                {/*  Modal Popup for Otp Verification Email*/}
                <div
                className="modal fade show"
                  id="forEmail"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  style={{display: showOtpVerifyModalEmail ? "block" : "none"}}
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
                                    align:"centre",
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

             
              {/*  Modal Popup for Otp Verification Email*/}

              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Contact Number *"
                  name="contact_number"
                  placeholder="Contact Number"
                  className="form-control"
                />

                <button
                  className="btn btn-primary"
                  type="submit"
                  class="btn btn-primary btn-sm"
                  data-toggle="modal"
                  data-target="#forPhone"
                  onClick= {handleToSendOTPForVerificationPhone}
                >
                  Send OTP To Verify
                </button>

  {/*  Modal Popup for Otp Verification */}

 
                  <div
                  className="modal fade show"
                  id="forPhone"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                  style={{display: showOtpVerifyModalPhone ? "block" : "none"}}
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
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div class="mx-auto  py-3">
                            <h1>
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
                                    align:"centre",
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
                                  onClick={handleVerificationOfPhone}
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
              </div>

              {/*  Modal Popup for Otp Verification Mobile */}
  
            

            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Contact Name *"
                  name="name"
                  placeholder="Contact Name"
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Contact Designation *"
                  name="contact_designation"
                  placeholder="Contact Designation"
                  className="form-control"
                />
              </div>
            </div>
            <div class="col-md-9 text-center">
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfo;
