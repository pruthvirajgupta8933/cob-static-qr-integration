import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {otpForContactInfo} from "../../slices/kycOtp";
import MailVerificationModal from "./OtpVerificationKYC/MailVerificationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";

function ContactInfo() {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  // console.log(user, "<<<<<=========")
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const [showOtpVerifyModalEmail, setShowOtpVerifyModalEmail] = useState(false);
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [isCheck, setIsChecked] = useState(false)
  const [targetPhone, setTargetPhone] = useState("")
  const [targetEmail, setTargetEmail] = useState("")



  const KycVerifyStatus = useSelector(
    (state) =>
      state.KycOtpSlice.OtpVerificationResponse.status
  );

  
  const initialValues = {
    name: "",
    contact_number: "",
    email_id: "",
    contact_designation: "",
    isPhoneVerified: "",
    isEmailVerified:""
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
    isPhoneVerified: Yup.string().required("You need to verify Your Phone"),
    isEmailVerified: Yup.string().required("You need to verify Your Email"),
  });

  const handleSubmitContact = async (values) => {
    // console.log("err", values)
    try {
      const resp = await axios.put(API_URL.Save_General_Info, {
        login_id: loginId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        contact_designation: values.contact_designation,
      });
      // console.log("Hello ===>", resp.data);
      toast.success(resp.data.message);
    } catch (error) {
      toast.error(error.data.message)
    }
  };



  //-----------------Functionality To Send OTP Via Email Through Button ----------------------
  const handleToSendOTPForVerificationEmail = (isMobileVerified) => {
    // console.log(isMobileVerified,"=====>")
 
    dispatch(
      otpForContactInfo({
        email: "harrisfazal@ymail.com",
        otp_type: "email",
        otp_for: "kyc"
      })
    ).then((res) => {
  
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        // console.log("This is the response", res);
        toast.success("OTP Sent to the Registered Mobile Number ");
         setShowOtpVerifyModalEmail(true)   
      } else {
       toast.error("Something went wrong! Please try again for some time.");
       setShowOtpVerifyModalEmail(false)

      
       
      }
    });

  }
//----------------------------------------------------------------------------------------



  //-----------------Functionality To Send OTP Via Button---------------------


  const handleToSendOTPForVerificationPhone = () => {
 
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


//-------------------------------------------------------------------------------------------------------


//After Whole Verification Process//

const changeWhenVerifiedEmail = () =>{
  targetEmail(!setTargetEmail,isCheck)

}

const changeWhenVerifiedPhone = () =>{
  targetPhone(!setTargetPhone,isCheck)

}

//---------------------------------------



  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
      >
         {({ formik, values}) => (
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
                  onChange={()=> {
                    changeWhenVerifiedEmail()
                    formik.setFieldValue("isEmailVerified",targetEmail)
                  }}
                >
                  Send OTP To Verify
                </button>
                <ErrorMessage name="isEmailVerified">
                                      {(msg) => (
                                        <p
                                          className="abhitest"
                                          style={{
                                            color: "red",
                                            float: "bottom",
                                          }}
                                        >
                                          {msg}
                                        </p>
                                      )}
                                    </ErrorMessage>




                {/*  Modal Popup for Otp Verification Email*/}
                <div
                  className="modal fade"
                  id="forEmail"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                
                  <MailVerificationModal show={showOtpVerifyModalEmail} check={isCheck} />
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
                  onChange={()=> {formik.setFieldValue("isPhoneVerified",targetPhone)
                  changeWhenVerifiedPhone()
                }}
                >
                  Send OTP To Verify
                </button>

                <ErrorMessage name="isPhoneVerified">
                                      {(msg) => (
                                        <p
                                          className="abhitest"
                                          style={{
                                            color: "red",
                                            float: "bottom",
                                          }}
                                        >
                                          {msg}
                                        </p>
                                      )}
                                    </ErrorMessage>

                     {/*  Modal Popup for Otp Verification */}



                  <div
                  className="modal fade"
                  id="forPhone"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
           <PhoneVerficationModal show={showOtpVerifyModalPhone} check={isCheck}/>
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
