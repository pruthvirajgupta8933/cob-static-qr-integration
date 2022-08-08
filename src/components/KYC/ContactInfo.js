import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isPhoneVerified, otpForContactInfo } from "../../slices/kycOtp";
import MailVerificationModal from "./OtpVerificationKYC/MailVerificationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import { values } from "lodash";
import { updateContactInfo } from "../../slices/contactInfo"
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

function ContactInfo() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  
  const { loginId } = user;

  const [showOtpVerifyModalEmail, setShowOtpVerifyModalEmail] = useState(false);
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);

let KycVerifyStatusForPhone = useSelector(
    (state) =>
      state.KycOtpSlice.OtpVerificationResponseForPhone.status
  );

  const KycVerifyStatusForEmail = useSelector(
    (state) =>
      state.KycOtpSlice.OtpVerificationResponseForEmail.status
  );

  const initialValues = {
    name: "",
    contact_number: "",
    email_id: "",
    contact_designation: "",
    // isPhoneVerified: "",
    // isEmailVerified: ""
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

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    contact_number: Yup.string().required("Required").matches(phoneRegExp, 'Phone number is not valid')
    .min(10, "Phone number in not valid")
    .max(10, "too long"),
    email_id: Yup.string().email("Invalid email").required("Required"),
    contact_designation: Yup.string().required("Required"),
    // isPhoneVerified: Yup.string().required("You need to verify Your Phone"),
    // isEmailVerified: Yup.string().required("You need to verify Your Email"),
  });

  const handleSubmitContact =  (values) => {
    // console.log("err", values)

      // console.log("err", values)
      dispatch(
        updateContactInfo({
          login_id: loginId,
          name: values.name,
          contact_number: values.contact_number,
          email_id: values.email_id,
          contact_designation: values.contact_designation,
          modified_by:loginId
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // console.log("This is the response", res);
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload.message);
          setShowOtpVerifyModalEmail(false)
        }
      });
   
  };

useEffect(() => {
  if(initialValues.contact_number === "") {
// console.log("input change")
   dispatch(isPhoneVerified(false))
    // console.log(KycVerifyStatusForPhone,"Changed Status ==>")
  }

},[KycVerifyStatusForPhone])




// console.log(formik?.values.contact_number, "==>")
   
    




  //-----------------Functionality To Send OTP Via Email Through Button ----------------------
  const handleToSendOTPForVerificationEmail = (values) => {
    // console.log(values)
    dispatch(
      otpForContactInfo({
        email: values,
        otp_type: "email",
        otp_for: "kyc"
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        // console.log("This is the response", res);
        toast.success("OTP Sent to the Registered Email ");
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
        mobile_number: values,
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

  // const changeWhenVerifiedEmail = (isChecked) => {
  //   targetEmail(!setTargetEmail)
  //   setIsChecked(isChecked)
  // }

  // const changeWhenVerifiedPhone = () => {
  //   targetPhone(!setTargetPhone, isCheck)

  // }

  //---------------------------------------

  const checkInputIsValid = (err, val, setErr, key) => {
    const hasErr = err.hasOwnProperty(key)
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true)
      }
    }
    if (!hasErr && val[key] !== "" && key === "email_id") {
      handleToSendOTPForVerificationEmail(val[key])
    }
    
    if (!hasErr && val[key] !== "" && key === "contact_number") {
      handleToSendOTPForVerificationPhone(val[key])
    }
  }

  const handlerModal=(val,key)=>{
    console.log(val)
    if(key==="phone"){
      setShowOtpVerifyModalPhone(val)
    }
    if(key==="email"){
      setShowOtpVerifyModalEmail(val)
    }

  }


  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
      >
        {formik => (
          <Form>
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
                  onClick={() => { checkInputIsValid(formik.errors, formik.values, formik.setFieldError, "email_id") }}
                >
                  Send OTP
                </button>
              </div>



              {/*  Modal Popup for Otp Verification Email*/}
              <MailVerificationModal show={showOtpVerifyModalEmail} setShow={handlerModal} />
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


              { KycVerifyStatusForPhone === false ? 
                <button
                  className="btn btn-primary"
                  type="submit"
                  class="btn btn-primary btn-sm"
                  onClick={() => { checkInputIsValid(formik.errors, formik.values, formik.setFieldError, "contact_number") }}
                >
                  Send OTP
                </button>
                  : 
                  <span><p class="text-success">Verified <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                  </svg></p></span> 
                }  
              </div>
            </div>

            {/*  Modal Popup for Otp Verification */}
            <PhoneVerficationModal show={showOtpVerifyModalPhone} setShow={handlerModal} />
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
            <div class="col-md-9 p-0">
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
