import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../_components/formik/Yup"
import FormikController from "../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  otpForContactInfo,
  updateContactInfo,
  kycUserList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import {
  Regex,
  RegexMsg,
} from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { KYC_STATUS_VERIFIED } from "../../utilities/enums";
import "./kyc-style.css";


function ContactInfo(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const dispatch = useDispatch();

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;
  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);




  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    oldEmailId: KycList?.emailId,
    oldContactNumber: KycList?.contactNumber,
    aadhar_number: KycList?.aadharNumber,
    isContactNumberVerified: KycList?.isContactNumberVerified ?? null
  };



  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .matches(Regex.acceptAlphaNumericDot, RegexMsg.acceptAlphaNumericDot)
      .required("Required")
      .wordLength("Word character length exceeded")
      .max(100, "Maximum 100 characters are allowed")
      .nullable()
      .allowOneSpace(),
    contact_number: Yup.string()
      .trim()
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
    email_id: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Required")
      .nullable(),
    oldEmailId: Yup.string()
      .trim()
      .oneOf([Yup.ref("email_id"), null], "You need to verify Your Email Id")
      .required("You need to verify Your Email Id")
      .nullable(),
    aadhar_number: Yup.string()
      .trim()
      .max(18, "Exceeds the limit")
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(Regex.aadhaarRegex, RegexMsg.aadhaarRegex)
      .required("Required")
      .nullable(),
    isContactNumberVerified: Yup.string().required("Please verify the contact number").nullable()
  });


  const handleSubmitContact = (values) => {
    setIsDisable(true);
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
      console.log(res)
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
      console.log("error", error)
      toast.error("Something went wrong");
    })


  };


  //-----------------Functionality To Send OTP Via Button---------------------

  const handleToSendOTPForVerificationPhone = (values) => {

    dispatch(
      otpForContactInfo({
        mobile_number: values,
        otp_type: "phone",
        otp_for: "kyc",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        toast.success("OTP Sent to the Registered Mobile Number ");
        setShowOtpVerifyModalPhone(true);
        setIsLoading(false);


      } else {

        toast.error(res.payload.message);
        setShowOtpVerifyModalPhone(false);
        setIsLoading(false);


      }
    });
  };

  const checkInputIsValid = (err, val, setErr, key) => {
    setIsLoading(true);

    const hasErr = err.hasOwnProperty(key);
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }

    if (!hasErr && val[key] !== "" && key === "contact_number") {
      handleToSendOTPForVerificationPhone(val[key]);
    }
  };


  const handlerModal = (val, key) => {
    if (key === "phone") {
      setShowOtpVerifyModalPhone(val);
    }
  };



  const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
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

                <FormikController
                  control="input"
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6" >
                <label className="col-form-label mt-0 p-2 " >
                  Aadhaar Number<span className="text-danger"> *</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="aadhar_number"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  className="form-control maskedInput"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
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
                    KycList?.isContactNumberVerified === 1 &&
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
                          // Check if the input is valid before triggering the loader
                          if (!errors.contact_number) {
                            checkInputIsValid(
                              errors,
                              values,
                              setFieldError,
                              "contact_number"
                            );
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
                    <span className="text-danger">
                      {msg}
                    </span>
                  )}
                </ErrorMessage>
                <ErrorMessage name="isContactNumberVerified">
                  {(msg) => (
                    <span className="text-danger">
                      {msg}
                    </span>
                  )}
                </ErrorMessage>
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 ">
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

                {<ErrorMessage name="email_id">
                  {(msg) => (
                    <span className="text-danger">
                      {msg}
                    </span>
                  )}
                </ErrorMessage>
                }
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
                    className="btn btn-sm float-lg-right cob-btn-primary text-white mr-4"
                  >
                    {disable &&
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    }
                    {"Save and Next"}
                  </button>
                )}
              </div>
            </div>



            {/*  Modal Popup for Otp Verification */}
            <PhoneVerficationModal
              show={showOtpVerifyModalPhone}
              setShow={handlerModal}
              setFieldValue={setFieldValue}
            />
            {/*  Modal Popup for Otp Verification Mobile */}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfo;
