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
import { values } from "lodash";

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
     email_id: "",
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
  const handleToSendOTPForVerificationEmail = (values) => {
    // console.log(values,"===>")
 
    dispatch(
      otpForContactInfo({
        email: values.email,
        otp_type: "email",
        otp_for: "kyc"
      })
    ).then((res) => {
  
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        // console.log("This is the response", res);
        toast.success("OTP Sent to the Registered Mobile Number ");
         setShowOtpVerifyModalEmail(true)   
      } else {
       toast.error(res.payload.message);
       setShowOtpVerifyModalEmail(false)

      
       
      }
    });

  }
//----------------------------------------------------------------------------------------



  //-----------------Functionality To Send OTP Via Button---------------------


  const handleToSendOTPForVerificationPhone = (values) => {
 
    dispatch(
      otpForContactInfo({
        mobile_number: values.mobile_number,
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

const changeWhenVerifiedEmail = (isChecked) =>{
  targetEmail(!setTargetEmail)
  setIsChecked(isChecked)
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
         {({ formik, setFieldValue}) => (
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
                

                {/* --------------Send OTP Body Email------------------- */}
                <button
                  className="btn btn-primary"
                  type="submit"
                  class="btn btn-primary btn-sm"
                  data-toggle="modal"
                  data-target="#forEmail"
                  onChange={()=> {formik.setFieldValue("isEmailVerified",targetEmail)}}
                  onClick={handleToSendOTPForVerificationEmail}
                >
                  Send OTP To Verify
                </button>


          {/* --------------Send OTP Body Email ------------------- */}
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
                                    </div>



              {/*  Modal Popup for Otp Verification Email*/}
                  <MailVerificationModal show={showOtpVerifyModalEmail} setFieldValue={setFieldValue} mailValidate={changeWhenVerifiedEmail}/>   
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

                                    </div>
                                    </div>

              {/*  Modal Popup for Otp Verification */}
               <PhoneVerficationModal show={showOtpVerifyModalPhone} check={isCheck}/>
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
