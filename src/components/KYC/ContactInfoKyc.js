import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../_components/formik/Yup"
// import FormikController from "../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  otpForContactInfo,
  updateContactInfo,
  kycUserList,
  GetKycTabsStatus,
  // otpVerificationForContactForPhone,
} from "../../slices/kycSlice";

import {
  Regex,
  RegexMsg,
} from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { KYC_STATUS_VERIFIED } from "../../utilities/enums";
import "./kyc-style.css";
// import OtpInput from "react-otp-input";
// import classes from "./kycForm.module.css"
// import CustomModal from "../../_components/custom_modal";
// import { kycValidatorAuth } from "../../utilities/axiosInstance";
import toastConfig from "../../utilities/toastTypes";
// import API_URL from "../../config";
// import Timer from "../../utilities/TimerComponent";
// import TimerComponent from "../../utilities/TimerComponent";
import AadharVerficationModal from "./OtpVerificationKYC/AadharVerficationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import { aadharNumberVerification } from "../../slices/kycValidatorSlice";


function ContactInfoKyc(props) {
  // console.log({ props })
  const setTab = props.tab;
  const setTitle = props.title;
  const merchantloginMasterId = props.merchantloginMasterId;

  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  // const KycVerificationToken = useSelector((state) => state.kyc.OtpResponse.verification_token);


  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;

  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [otpBtnDisable, setOtpBtnDisable] = useState(false);
  // const [resendDisabled, setResendDisabled] = useState(false);
  // const [timer, setTimer] = useState(60);
  // const [otpForPhone, setOtpForPhone] = useState({ otp: "" })

  // aadhar number verification
  // const [aadharNuber, setAadharNumber] = useState("")
  const [aadharNumberVerifyToggle, setAadharNumberVerifyToggle] = useState(false);
  // const [contactVerifyToggle, setContactVerifyToggle] = useState(false);
  // const [aadharOtpResp, setAadharOtpResp] = useState({});
  // const [aadharOtp, setAadharOtp] = useState("");
  // const [isAadharNumberVerified, setIsAadharNumberVerified] = useState(false);
  const [aadharVerificationLoader, setAadharVerificationLoader] = useState(false)
  const [idProofInputToggle, setIdProofInputToggle] = useState(false)



  // useEffect(() => {
  //   if (KycList?.aadharNumber?.length === 12) {
  //     setIsAadharNumberVerified(true)
  //   }
  // }, [KycList])


  const initialValues = {
    name: KycList?.name,
    email_id: KycList?.emailId,

    // ID proof verification
    aadhar_number: KycList?.aadharNumber,
    oldAadharNumber: KycList?.aadharNumber,
    aadharOtpDigit: "",
    proofOtpDigit: "",
    isProofOtpSend: false,



    // contact OTP initial values
    isContactNumberVerified: KycList?.isContactNumberVerified ?? null,
    contact_number: KycList?.contactNumber,
    oldContactNumber: KycList?.contactNumber,
    contactOtpDigit: "",
    isContactOtpSend: false,
  };



  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumericDot, RegexMsg.acceptAlphaNumericDot)
      .required("Required")
      .wordLength("Word character length exceeded")
      .max(100, "Maximum 100 characters are allowed")
      .nullable()
      .allowOneSpace(),
    email_id: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .required("Required")
      .nullable(),



    contact_number: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .required("Required")
      .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed ")
      .nullable(),
    oldContactNumber: Yup.string()
      .trim()
      .oneOf(
        [Yup.ref("contact_number"), null],
        "You need to verify Your Contact Number"
      )
      .required("You need to verify Your Contact Number")
      .nullable(),
    isContactNumberVerified: Yup.string().required("Please verify the contact number").nullable(),
    contactOtpDigit: Yup.string().when("isContactOtpSend", {
      is: true,
      then: Yup.string()
        .matches(Regex.digit, RegexMsg.digit)
        .min(6, "Minimum 6 digits are required")
        .max(6, "Maximum 6 digits are allowed")
        .required("Required")
        .nullable(),
      otherwise: Yup.string()
    }),


    aadhar_number: Yup.string()
      .allowOneSpace()
      .max(18, "Exceeds the limit")
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(Regex.aadhaarRegex, RegexMsg.aadhaarRegex)
      .required("Required")
      .nullable(),
    oldAadharNumber: Yup.string()
      .trim()
      .oneOf(
        [Yup.ref("aadhar_number"), null],
        "You need to verify Your Contact Number"
      )
      .required("You need to verify Your Contact Number")
      .nullable(),
    aadharOtpDigit: Yup.string().when("isProofOtpSend", {
      is: true,
      then: Yup.string()
        .matches(Regex.digit, RegexMsg.digit)
        .min(6, "Minimum 6 digits are required")
        .max(6, "Maximum 6 digits are allowed")
        .required("Required")
        .nullable(),
      otherwise: Yup.string()
    })
  });



  // useEffect(() => {
  //   setOtpForPhone({ otp: "" })
  // }, [showOtpVerifyModalPhone])


  const handleSubmitContact = (values) => {
    setIsDisable(true);
    dispatch(
      updateContactInfo({
        login_id: merchantloginMasterId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        modified_by: loginId,
        aadhar_number: values.aadhar_number,
      })
    ).then((res) => {

      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res.payload?.status === true
      ) {
        setTab(2);
        setTitle("BUSINESS OVERVIEW");
        setIsDisable(false);
        toast.success(res.payload?.message);
        dispatch(kycUserList({ login_id: loginId }));
        dispatch(GetKycTabsStatus({ login_id: loginId }));
      } else {
        toast.error(res.payload);
        toast.error(res.payload?.message);
        toast.error(res.payload?.detail);
        setIsDisable(false);
      }
    }).catch((error) => {

      toast.error("Something went wrong");
    })


  };



  const inputFieldValidation = async (err, val, setErr, setFieldVal, key) => {
    const hasErr = err.hasOwnProperty(key);
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }

    if (!hasErr && val[key] !== "" && key === "contact_number") {
      setIsLoading(true);
      await contactVerificationHandler(val[key], setFieldVal);
    }


    if (!hasErr && val[key] !== "" && key === "aadhar_number") {
      await addharVerificationHandler(val[key], setFieldVal);
    }

  };





  const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
  }





  // aadhar verification
  const addharVerificationHandler = async (values, setFieldVal) => {
    // console.log("values", values.aadhar_number)
    setAadharVerificationLoader(true)
    try {
      const resp = await dispatch(aadharNumberVerification({ "aadhar_number": values.aadhar_number }))
      // console.log("resp", resp)
      setAadharNumberVerifyToggle(true)
      setAadharVerificationLoader(false)
      setFieldVal("isProofOtpSend", true);
      setFieldVal("aadharOtpDigit", "");
      toastConfig.successToast(resp.payload.message)
    } catch (error) {
      // console.log("error", error)
      setAadharVerificationLoader(false)
      toastConfig.errorToast(error?.response?.data?.message ?? "Something went wrong, Please try again")
    }
  }




  // contact number verification
  const contactVerificationHandler = async (values, setFieldVal) => {
    setIsLoading(true);
    dispatch(otpForContactInfo({
      mobile_number: values,
      otp_type: "phone",
      otp_for: "kyc",
    })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        toast.success("OTP Sent to the Registered Mobile Number ");
        setShowOtpVerifyModalPhone(true);
        setIsLoading(false);
        setFieldVal("isContactOtpSend", true);
        setFieldVal("contactOtpDigit", "");

      } else {
        toast.error(res.payload.message);
        setShowOtpVerifyModalPhone(false);
        setIsLoading(false);
      }
    });
  }


  const idProofhandler = (value) => {
    if (value === "1") { setIdProofInputToggle(false) } else { setIdProofInputToggle(true) }
  }


  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          setFieldError,
          setFieldValue
        }) => (
          <Form>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Contact Person Name<span className="text-danger"> *</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <div className="col-form-label mt-0 p-2">
                  <lable className="d-flex justify-content-between">
                    <span>ID Proof<span className="text-danger"> *</span></span>
                    <span className="text-decoration-underline text-primary cursor_pointer" onClick={() => setIdProofInputToggle(prev => !prev)}>Select ID Proof</span></lable>
                </div>
                <div className="input-group">
                  {idProofInputToggle ?
                    <select className="form-select" onChange={(e) => idProofhandler(e.target.value)}>
                      <option value="">Select ID Proof</option>
                      <option value="1">Aadhar Number</option>
                    </select> :
                    <React.Fragment>
                      <Field
                        type="text"
                        name="aadhar_number"
                        autoComplete="off"
                        className="form-control maskedInput"
                        placeholder="Enter ID Proof Number"
                        onChange={(e) => {
                          setFieldValue("aadhar_number", e.target.value)
                        }}
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                      />

                      {values.oldAadharNumber && values.aadhar_number && (values.oldAadharNumber === values.aadhar_number) ? (
                        <span className="success input-group-append">
                          <img
                            src={gotVerified}
                            alt=""
                            title=""
                            width={"20px"}
                            height={"20px"}
                            className="btn-outline-secondary"
                          />
                        </span>
                      ) :
                        <div className="input-group-append">
                          <a
                            href={() => false}
                            className={`btn cob-btn-primary btn-sm ${aadharVerificationLoader ? 'disabled' : ''}`}
                            onClick={() => {
                              addharVerificationHandler(values, setFieldValue)
                            }}
                          >
                            {aadharVerificationLoader ? (
                              <span className="spinner-border spinner-border-sm">
                                <span className="sr-only">Loading...</span>
                              </span>
                            ) : (
                              "Send OTP"
                            )}
                          </a>
                        </div>
                      }
                    </React.Fragment>
                  }



                </div>
                <ErrorMessage name="aadhar_number">
                  {(msg) => (
                    <span className="text-danger">
                      {msg}
                    </span>
                  )}
                </ErrorMessage>
              </div>


              {aadharNumberVerifyToggle &&
                <AadharVerficationModal formikFields={{
                  values,
                  errors,
                  setFieldError,
                  setFieldValue
                }}
                  isOpen={aadharNumberVerifyToggle}
                  toggle={setAadharNumberVerifyToggle}
                  resendOtp={(values, setFieldValue) => addharVerificationHandler(values, setFieldValue)}

                // isOpen={showOtpVerifyModalPhone}
                // toggle={setShowOtpVerifyModalPhone}
                // resendOtp={(values, setFieldValue) => contactVerificationHandler(values, setFieldValue)}

                />
              }
            </div>


            <div className="row">
              {/* start contact verify field */}
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_phone}>
                  Contact Number<span className="text-danger"> *</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="contact_number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("contact_number", e.target.value)
                      setFieldValue("isContactNumberVerified", 0)
                    }}
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                  />
                  {KycList?.contactNumber !== null &&
                    values?.isContactNumberVerified === 1 &&
                    !errors.hasOwnProperty("contact_number") &&
                    !errors.hasOwnProperty("oldContactNumber") ? (
                    <span className="success input-group-append">
                      <img
                        src={gotVerified}
                        alt=""
                        title=""
                        width={"20px"}
                        height={"20px"}
                        className="btn-outline-secondary"
                      />
                    </span>
                  ) :
                    <div className="input-group-append">
                      <a
                        href={() => false}
                        className={`btn cob-btn-primary btn-sm text-white ${isLoading ? 'disabled' : ''}`}
                        onClick={() => {
                          if (!errors.contact_number) {
                            inputFieldValidation(
                              errors,
                              values,
                              setFieldError,
                              setFieldValue,
                              "contact_number"
                            )
                          }
                        }}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm">
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </a>
                    </div>}
                </div>
                <ErrorMessage name="contact_number">
                  {(msg) => (
                    <p className="text-danger m-0">
                      {msg}
                    </p>
                  )}
                </ErrorMessage>

                <ErrorMessage name="oldContactNumber">
                  {(msg) => (
                    <p className="text-danger m-0">
                      {msg}
                    </p>
                  )}
                </ErrorMessage>

                <ErrorMessage name="isContactNumberVerified">
                  {(msg) => (
                    <p className="text-danger m-0">
                      {msg}
                    </p>
                  )}
                </ErrorMessage>
              </div>

              {showOtpVerifyModalPhone &&
                <PhoneVerficationModal formikFields={{
                  values,
                  errors,
                  setFieldError,
                  setFieldValue
                }}
                  isOpen={showOtpVerifyModalPhone}
                  toggle={setShowOtpVerifyModalPhone}
                  resendOtp={(values, setFieldValue) => contactVerificationHandler(values, setFieldValue)}
                />
              }
              {/* end contact verify field */}


              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2">
                  Email Id<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="email_id"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={true} />
                  {
                    KycList?.emailId !== null &&
                    KycList?.isEmailVerified === 1 && (
                      <span className="success input-group-append">
                        <img
                          src={gotVerified}
                          alt=""
                          title=""
                          width={"20px"}
                          height={"20px"}
                          className="btn-outline-secondary"
                        />
                      </span>
                    )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {VerifyKycStatus === KYC_STATUS_VERIFIED ? (
                  <></>
                ) : (
                  <button
                    disabled={disable}
                    type="submit"
                    className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                  >
                    {disable &&
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    }
                    {"Save and Next"}
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfoKyc;
