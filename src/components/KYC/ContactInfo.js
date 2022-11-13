import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  isPhoneVerified,
  otpForContactInfo,
  verifyKycEachTab,
  updateContactInfo,
  kycUserList,
} from "../../slices/kycSlice";
import MailVerificationModal from "./OtpVerificationKYC/MailVerificationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import { values } from "lodash";
import gotVerified from "../../assets/images/verified.png";
// import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
// import verifyKycTab from "../../slices/veriferApproverSlice"

function ContactInfo(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const dispatch = useDispatch();

  const { role, kycid } = props;
  const { auth, kyc } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;

  // console.log("KycList",KycList);

  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;

  const [showOtpVerifyModalEmail, setShowOtpVerifyModalEmail] = useState(false);
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const KycVerifyStatusForPhone = kyc.OtpVerificationResponseForPhone.status;
  const KycVerifyStatusForEmail = kyc.OtpVerificationResponseForEmail.status;

  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    oldEmailId: KycList?.emailId,
    oldContactNumber: KycList?.contactNumber,
    aadhar_number: KycList?.aadharNumber
  };

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const aadhaarRegex = /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    contact_number: Yup.string()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .required("Required")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Phone number is not valid")
      .max(10, "too long")
      .nullable(),
    oldContactNumber: Yup.string()
      .oneOf(
        [Yup.ref("contact_number"), null],
        "You need to verify Your Contact Number"
      )
      .required("You need to verify Your Contact Number")
      .nullable(),
    email_id: Yup.string()
      .email("Invalid email")
      .required("Required")
      .nullable(),
    oldEmailId: Yup.string()
      .oneOf([Yup.ref("email_id"), null], "You need to verify Your Email Id")
      .required("You need to verify Your Email Id")
      .nullable(),
    aadhar_number: Yup.string()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(aadhaarRegex, "Aadhaar Number is Invalid")
      .required("Required")
      .nullable()
  });

  const handleSubmitContact = (values) => {
    if (role.merchant) {
      dispatch(
        updateContactInfo({
          login_id: loginId,
          name: values.name,
          contact_number: values.contact_number,
          email_id: values.email_id,
          modified_by: loginId,
          aadhar_number: values.aadhar_number,
        })
      ).then((res) => {
        // console.log(res);
        if (
          res?.meta?.requestStatus === "fulfilled" &&
          res.payload?.status === true
        ) {

          setTab(2);
          setTitle("BUSINESS OVERVIEW");
          toast.success(res.payload?.message);
          dispatch(kycUserList({ login_id: loginId }))
        } else {
          // console.log("chec1")
          toast.error(res.payload?.message);
          toast.error(res.payload?.detail);
          setShowOtpVerifyModalEmail(false);
        }
      });
    } else if (role.verifier) {
      const veriferDetails = {
        login_id: kycid,
        general_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.general_info_status &&
            toast.success(resp?.payload?.general_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  // useEffect(() => {
  //   if (initialValues.contact_number === "") {
  //     dispatch(isPhoneVerified(false));
  //   }
  // }, [KycVerifyStatusForPhone]);

  //-----------------Functionality To Send OTP Via Email Through Button ----------------------
  const handleToSendOTPForVerificationEmail = (values) => {
    dispatch(
      otpForContactInfo({
        email: values,
        otp_type: "email",
        otp_for: "kyc",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        toast.success("OTP Sent to the Registered Email ");
        setShowOtpVerifyModalEmail(true);
      } else {
        toast.error(res.payload.message);
        setShowOtpVerifyModalEmail(false);
      }
    });
  };
  //----------------------------------------------------------------------------------------

  //-----------------Functionality To Send OTP Via Button---------------------

  const handleToSendOTPForVerificationPhone = (values) => {
    dispatch(
      otpForContactInfo({
        mobile_number: values,
        otp_type: "phone",
        otp_for: "kyc",
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        toast.success("OTP Sent to the Registered Mobile Number ");
        setShowOtpVerifyModalPhone(true);
      } else {
        toast.error(res.payload.message);
        setShowOtpVerifyModalPhone(false);
        //  toastConfig.infoToast(res.payload.msg);
      }
    });
  };

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
    const hasErr = err.hasOwnProperty(key);
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }
    if (!hasErr && val[key] !== "" && key === "email_id") {
      handleToSendOTPForVerificationEmail(val[key]);
    }

    if (!hasErr && val[key] !== "" && key === "contact_number") {
      handleToSendOTPForVerificationPhone(val[key]);
    }
  };

  const handlerModal = (val, key) => {
    // console.log(val);
    if (key === "phone") {
      setShowOtpVerifyModalPhone(val);
    }
    if (key === "email") {
      setShowOtpVerifyModalEmail(val);
    }
  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
      setButtonText("Approve and Next");
    } else if (role.verifier) {
      setReadOnly(true);
      setButtonText("Verify and Next");
    }
  }, [role]);

  return (
    <div className="col-md-12 col-md-offset-4" style={{ width: "100%" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({
          values,
          setFieldValue,
          initialValues,
          errors,
          setFieldError,
          setFieldTouched,
          handleChange,
        }) => (
          <Form>
            {/* {console.log(formik)} */}
            
              <div class="col-sm-6 col-md-6 col-lg-6 ">
              <label class="col-form-label mt-0 p-2">
                
                  Contact Name<span style={{ color: "red" }}>*</span>
                
              </label>
              {/* <div class="col-sm-7 col-md-7 col-lg-7"> */}
                <FormikController
                  control="input"
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              {/* </div> */}
              
            </div>

            
            <div class="col-sm-6 col-md-6 col-lg-6 ">
              <label class="col-form-label mt-0 p-2">
                
                  Aadhaar No.<span style={{ color: "red" }}>*</span>
                
              </label>
              
                <FormikController
                  control="input"
                  type="text"
                  name="aadhar_number"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
           

            {/*  Modal Popup for Otp Verification Email*/}
            <MailVerificationModal
              show={showOtpVerifyModalEmail}
              setShow={handlerModal}
            />
            {/*  Modal Popup for Otp Verification Email*/}

            <div class="col-sm-6 col-md-6 col-lg-6 ">
              <label class="col-form-label mt-0 p-2">
                
                  Contact Number<span style={{ color: "red" }}>*</span>
                
              </label>

              
                <FormikController
                  control="input"
                  type="text"
                  name="contact_number"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}

                />

                {KycList?.contactNumber !== null &&
                  KycList?.isContactNumberVerified === 1 &&
                  !errors.hasOwnProperty("contact_number") &&
                  !errors.hasOwnProperty("oldContactNumber") ? (
                  <span>
                    <img src={gotVerified} alt="" title="" width="26" />
                  </span>
                ) : role.merchant ? (
                  <div class="position-sticky pull-right- otpbtn">
                    <a
                      href={() => false}
                      className="btn btnbackground text-white btn-sm optbtn-"
                      onClick={() => {
                        checkInputIsValid(
                          errors,
                          values,
                          setFieldError,
                          "contact_number"
                        );
                      }}
                    >
                      Send Otp
                    </a>
                  </div>
                ) : (
                  <></>
                )}

                {errors?.oldContactNumber && (
                  <span className="text-danger">
                    {errors?.oldContactNumber}
                  </span>
                )}
              
            </div>

            {/*  Modal Popup for Otp Verification */}
            <PhoneVerficationModal
              show={showOtpVerifyModalPhone}
              setShow={handlerModal}
            />
            {/*  Modal Popup for Otp Verification Mobile */}

            <div class="col-sm-6 col-md-6 col-lg-6 ">
              <label class="col-form-label mt-0 p-2">
                
                  Email Id<span style={{ color: "red" }}>*</span>
                
              </label>

              
                <FormikController
                  control="input"
                  type="text"
                  name="email_id"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />

                {KycList?.emailId !== null &&
                  KycList?.isEmailVerified === 1 &&
                  !errors.hasOwnProperty("email_id") &&
                  !errors.hasOwnProperty("oldEmailId") ? (
                  <span>
                    <img src={gotVerified} alt="" title="" width="26" />
                  </span>
                ) : role.merchant ? (
                  <div class="position-sticky pull-right- otpbtn">
                    {/* optbtn */}
                    <a
                      href={() => false}
                      className="btn btnbackground text-white btn-sm optbtn-"
                      onClick={() => {
                        checkInputIsValid(
                          errors,
                          values,
                          setFieldError,
                          "email_id"
                        );
                      }}
                    >
                      Send Otp
                    </a>{" "}
                  </div>
                ) : (
                  <></>
                )}
                {errors?.oldEmailId && (
                  <span className="text-danger">{errors?.oldEmailId}</span>
                )}
              </div>
                 

            {/*         
          <div class="float-right ml-5">
            
            {VerifyKycStatus === "Verified" ? null : (
                  <button className="btn" type="submit" style={{backgroundColor:"#0156B3"}}>
                <h4 className="text-white">{buttonText}</h4>
                </button>
                    )}
          
          </div> */}

            <div class="my-5- p-2- w-100 pull-left">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-form-label">
                  {VerifyKycStatus === "Verified" ? null : (
                    <button
                      type="submit"
                      className="btn float-lg-right"
                      style={{ backgroundColor: "#0156B3" }}
                    >
                      <h4 className="text-white text-kyc-sumit">
                        {" "}
                        {buttonText}
                      </h4>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfo;
