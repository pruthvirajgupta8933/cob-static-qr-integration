import React, { useEffect, useState } from "react";
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
  otpVerificationForContactForPhone,
} from "../../slices/kycSlice";

import {
  Regex,
  RegexMsg,
} from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { KYC_STATUS_VERIFIED } from "../../utilities/enums";
import "./kyc-style.css";
import OtpInput from "react-otp-input";
import classes from "./kycForm.module.css"
import CustomModal from "../../_components/custom_modal";
import { kycValidatorAuth } from "../../utilities/axiosInstance";
import toastConfig from "../../utilities/toastTypes";
import API_URL from "../../config";
// import Timer from "../../utilities/TimerComponent";
import TimerComponent from "../../utilities/TimerComponent";


function ContactInfo(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const merchantloginMasterId = props.merchantloginMasterId;

  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const KycVerificationToken = useSelector((state) => state.kyc.OtpResponse.verification_token);


  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;

  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpBtnDisable, setOtpBtnDisable] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpForPhone, setOtpForPhone] = useState({ otp: "" })

  // Aadhaar Number verification
  const [aadharNuber, setAadharNumber] = useState("")
  const [aadharNumberVerifyModalToggle, setAadharNumberVerifyToggle] = useState(false);
  const [aadharOtpResp, setAadharOtpResp] = useState({});
  const [aadhaarOTP, setAadharOtp] = useState("");
  const [isAadharNumberVerified, setIsAadharNumberVerified] = useState(false);
  const [aadharVerificationLoader, setAadharVerificationLoader] = useState(false)


  useEffect(() => {
    setAadharNumber(KycList?.aadharNumber)
    if (KycList?.aadharNumber?.length === 12) {
      setIsAadharNumberVerified(true)
    }


  }, [KycList])


  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    oldEmailId: KycList?.emailId,
    oldContactNumber: KycList?.contactNumber,
    aadhar_number: KycList?.aadharNumber,
    isContactNumberVerified: KycList?.isContactNumberVerified ?? null
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
    email_id: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .required("Required")
      .nullable(),
    oldEmailId: Yup.string()
      .trim()
      .oneOf([Yup.ref("email_id"), null], "You need to verify Your Email Id")
      .required("You need to verify Your Email Id")
      .nullable(),
    aadhar_number: Yup.string()
      .allowOneSpace()
      .max(18, "Exceeds the limit")
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(Regex.aadhaarRegex, RegexMsg.aadhaarRegex)
      .required("Required")
      .nullable(),
    isContactNumberVerified: Yup.string().required("Please verify the contact number").nullable()
  });



  useEffect(() => {
    setOtpForPhone({ otp: "" })
  }, [showOtpVerifyModalPhone])

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


  const checkInputIsValid = async (err, val, setErr, key) => {


    const hasErr = err.hasOwnProperty(key);
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }

    if (!hasErr && val[key] !== "" && key === "contact_number") {
      setIsLoading(true);
      handleToSendOTPForVerificationPhone(val[key]);
    }


    if (!hasErr && val[key] !== "" && key === "aadhar_number") {
      await addharVerficationHandler(val[key]);
    }

  };



  const handleChangeForOtpPhone = (otp) => {
    const regex = /^[0-9]*$/;
    if (!otp || regex.test(otp.toString())) {
      setOtpForPhone({ otp });
    }
  };


  //-----------------Functionality To Verify The OTP ----------------------
  const handleVerificationOfPhone = (setFieldValue, values) => {
    setOtpBtnDisable(true)
    // setOtpLoading(true)

    dispatch(
      otpVerificationForContactForPhone({
        verification_token: KycVerificationToken,
        otp: otpForPhone.otp
      })
    ).then((res) => {
      setOtpBtnDisable(false)
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message)
          setFieldValue("isContactNumberVerified", 1)
          setFieldValue("oldContactNumber", values.contact_number)
          setShowOtpVerifyModalPhone(false)
        } else if (res?.payload?.status === false) {
          toast.error(res.payload.message)
          setFieldValue("isContactNumberVerified", null)
        } else if (res?.payload?.status_code === 500) {
          toast.error(res.payload.message)
          setFieldValue("isContactNumberVerified", null)
        }

      }
    }).catch(err => {
      setOtpBtnDisable(false)
      toast.error(err)
    })

  }


  const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
  }





  // aadhar verification

  const aadharModalBody = () => {
    return (
      <div className="modal-body justify-content-center d-flex-inline">

        <div className=" justify-content-center d-flex-inline d-flex" >
          <input type="text" className="form-control otp-input-kyc"
            maxLength={6}
            placeholder="Enter OTP"
            onChange={(e) => setAadharOtp(e.target.value)}
            value={aadhaarOTP}
            required={true}
            disabled={aadharVerificationLoader}
          />
        </div>
        <div className="row m-4 text-center">
          <div className="col-lg-6">
            <TimerComponent resend={addharVerficationHandler} />
          </div>
          <div className="col-lg-6">
            <button className="btn btn cob-btn-primary btn-sm" type="button"
              disabled={aadharVerificationLoader}
              onClick={() => aadharOtpVerification()}
            >
              {aadharVerificationLoader ?
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
                :
                "Verify OTP"
              }
            </button>
          </div>
        </div>

      </div>
    )
  }

  const addharVerficationHandler = async () => {
    setAadharVerificationLoader(true)
    try {


      const resp = await kycValidatorAuth.post(API_URL.Aadhar_number, { "aadhar_number": aadharNuber })
      if (resp.data.status) {
        setAadharOtpResp(resp.data)
        setAadharNumberVerifyToggle(true)
        setAadharOtp("")
        setTimer(60)
      }
      setAadharVerificationLoader(false)
      toastConfig.successToast(resp.data.message)
      // console.log(1)
    } catch (error) {
      setAadharVerificationLoader(false)
      toastConfig.errorToast(error?.response?.data?.message ?? "Something went wrong, Please try again")
      // console.log(2)
    }
  }

  const aadharOtpVerification = async () => {
    setAadharVerificationLoader(true)
    try {
      const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, { "referenceId": aadharOtpResp?.referenceId, "otp": aadhaarOTP })
      // console.log(resp)
      setAadharOtp("")
      if (resp.data?.valid && resp.data?.status) {
        setIsAadharNumberVerified(true)
      }
      toastConfig.successToast(resp?.data?.message)
      setAadharVerificationLoader(false)
      setAadharNumberVerifyToggle(false)
    } catch (error) {
      toastConfig.errorToast(error?.response?.data?.message ?? "Something went wrong, Please try again")
      setAadharVerificationLoader(false)
      setAadharNumberVerifyToggle(false)
    }
  }




  // contact number verification
  const contactVerifyModalBody = () => {
    return (
      <div className="modal-body justify-content-center d-flex-inline">

        <div className=" justify-content-center d-flex-inline d-flex" >
          <input type="text" className="form-control otp-input-kyc"
            maxLength={6}
            placeholder="Enter OTP"
            onChange={(e) => setAadharOtp(e.target.value)}
            value={aadhaarOTP}
            required={true}
            disabled={aadharVerificationLoader}
          />
        </div>
        <div className="row m-4 text-center">
          <div className="col-lg-6">
            <TimerComponent resend={addharVerficationHandler} />
          </div>
          <div className="col-lg-6">
            <button className="btn btn cob-btn-primary btn-sm" type="button"
              disabled={aadharVerificationLoader}
              onClick={() => aadharOtpVerification()}
            >
              {aadharVerificationLoader ?
                <span className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </span>
                :
                "Verify OTP"
              }
            </button>
          </div>
        </div>

      </div>
    )
  }



  return (
    <div className="col-lg-12 p-0">
      {aadharNumberVerifyModalToggle &&
        <CustomModal headerTitle={"Aadhar Verifcation"} modalBody={aadharModalBody} modalToggle={aadharNumberVerifyModalToggle} fnSetModalToggle={() => setAadharNumberVerifyToggle()} modalSize="modal-md" />
      }
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

              {/* Aadhaar Number verification */}
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Aadhaar Number<span className="text-danger"> *</span>
                </label>
                <div className="input-group">
                  <Field
                    type="password"
                    name="aadhar_number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("aadhar_number", e.target.value)
                      setAadharNumber(e.target.value)
                      setIsAadharNumberVerified(false)
                    }}
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                  />

                  {isAadharNumberVerified ? (
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
                          // Check if the input is valid before triggering the loader
                          if (!errors.aadhar_number) {
                            checkInputIsValid(
                              errors,
                              values,
                              setFieldError,
                              "aadhar_number"
                            );

                          }
                          setTimer(60)
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
                    </div>}
                </div>


                <ErrorMessage name="aadhar_number">
                  {(msg) => (
                    <span className="text-danger">
                      {msg}
                    </span>
                  )}
                </ErrorMessage>
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
                          setTimer(60)
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


            {/* Phone Number Verification modal */}
            <div className="modal fade show mt-5" ariaHidden="true"
              style={{ display: showOtpVerifyModalPhone ? "block" : "none", backgroundColor: "#000000a8" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">

                  <div className="modal-header">
                    <h6 className="modal-title paymentHeader" id="phoneModal">
                      OTP Verification
                    </h6>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal1"
                      aria-label="Close"
                      onClick={() => { setShowOtpVerifyModalPhone(false) }}
                    >
                      <span ariaHidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="mx-auto p-3">
                    <h5 className="">
                      Please enter the verification code sent to your phone number !
                    </h5>
                  </div>
                  <div className="modal-body justify-content-center d-flex-inline">

                    <div className=" justify-content-center d-flex-inline" >
                      <OtpInput
                        separator={
                          <span>
                            <strong>-</strong>
                          </span>
                        }
                        containerStyle="d-flex justify-content-center"
                        isInputNum={true}
                        value={otpForPhone.otp}
                        onChange={handleChangeForOtpPhone}
                        inputStyle={{
                          align: "centre",
                          width: "3rem",
                          height: "3rem",
                          fontSize: "2rem",
                          borderRadius: 4,
                          border: "1px solid rgba(0,0,0,0.3)",
                        }}
                        numInputs={6}

                      />
                    </div>
                    <div className="row m-4 text-center">

                      <div className="col-lg-6">
                        {timer > 0 ? (
                          <button className={`${classes.resendOtp_border} btn btn-light btn-sm`} disabled>
                            Resend OTP {timer}s
                          </button>
                        ) : (
                          <button className={`${classes.resendOtp_border} btn btn-light btn-sm`}
                            onClick={() => {
                              if (!errors.contact_number) {
                                checkInputIsValid(
                                  errors,
                                  values,
                                  setFieldError,
                                  "contact_number"
                                )
                                setResendDisabled(true);
                                setTimer(40);
                              }
                            }}
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>
                      <div className="col-lg-6">
                        <button className="btn btn cob-btn-primary btn-sm" type="button"
                          onClick={() => handleVerificationOfPhone(setFieldValue, values)}
                          disabled={otpBtnDisable}
                        >
                          {otpBtnDisable ?
                            <span className="spinner-border spinner-border-sm" role="status">
                              <span className="sr-only">Loading...</span>
                            </span>
                            :
                            "Verify OTP"
                          }
                        </button>
                      </div>
                    </div>

                  </div>


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
