import React, {  useState } from "react";
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { otpForContactInfo } from "../../slices/kycOtp";

import { values } from "lodash";

function SingleDocument() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  // console.log(user, "<<<<<=========")
  // var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
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


  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    contact_number: Yup.string().required("Required"),
    email_id: Yup.string().email("Invalid email").required("Required"),
    contact_designation: Yup.string().required("Required"),
    // isPhoneVerified: Yup.string().required("You need to verify Your Phone"),
    // isEmailVerified: Yup.string().required("You need to verify Your Email"),
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
        modified_by:loginId
      });
      // console.log("Hello ===>", resp.data);
      toast.success(resp.data.message);
    } catch (error) {
      toast.error(error.data.message)
    }
  };



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
    
    </div>
  );
}

export default SingleDocument;
