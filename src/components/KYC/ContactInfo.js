import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isPhoneVerified, otpForContactInfo, verifyKycEachTab } from "../../slices/kycSlice";
import MailVerificationModal from "./OtpVerificationKYC/MailVerificationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import { values } from "lodash";
import { updateContactInfo } from "../../slices/contactInfo";
// import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
// import verifyKycTab from "../../slices/veriferApproverSlice"

function ContactInfo(props) {



  const dispatch = useDispatch();

  const { role, kycid } = props;
  const { auth, kyc } = useSelector((state) => state);

  const { user } = auth
  const { loginId } = user;
  const KycList = kyc.kycUserList

  const VerifyKycStatus = kyc.kycVerificationForAllTabs.general_info_status;

  const [showOtpVerifyModalEmail, setShowOtpVerifyModalEmail] = useState(false);
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const KycVerifyStatusForPhone = kyc.OtpVerificationResponseForPhone.status
  const KycVerifyStatusForEmail = kyc.OtpVerificationResponseForEmail.status

  const initialValueskyc = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    contact_designation: KycList?.contactDesignation,
    isPhoneVerified: KycList?.isContactNumberVerified === 1 ? "1" : "",
    isEmailVerified: KycList?.isEmailVerified === 1 ? "1" : "",
  };



  const [initialValues, setInitialValues] = useState(initialValueskyc);


  useEffect(() => {
    setInitialValues({
      name: KycList?.name,
      contact_number: KycList?.contactNumber,
      email_id: KycList?.emailId,
      contact_designation: KycList?.contactDesignation,
      isPhoneVerified: KycList?.isContactNumberVerified === 1 ? "1" : "",
      isEmailVerified: KycList?.isEmailVerified === 1 ? "1" : "",
    })
  }, [KycList])
  

  const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Required")
      .nullable(),
    contact_number: Yup.string()
      .required("Required")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Phone number in not valid")
      .max(10, "too long").nullable(),
    email_id: Yup.string()
      .email("Invalid email")
      .required("Required").nullable(),
    contact_designation: Yup.string().required("Required").nullable(),
    isPhoneVerified: Yup.string().required("You need to verify Your Phone"),
    isEmailVerified: Yup.string().required("You need to verify Your Email"),
  });

  const handleSubmitContact = (values) => {

    if (role.merchant) {
      dispatch(
        updateContactInfo({
          login_id: loginId,
          name: values.name,
          contact_number: values.contact_number,
          email_id: values.email_id,
          contact_designation: values.contact_designation,
          modified_by: loginId,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          // console.log("This is the response", res);
          toast.success(res.payload.message);
        } else {
          toast.error(res.payload.message);
          setShowOtpVerifyModalEmail(false);
        }
      });
    } else if (role.verifier) {
      const veriferDetails = {
        "login_id": kycid,
        "general_info_verified_by": loginId
      }
      dispatch(verifyKycEachTab(veriferDetails)).then(resp => {
        resp?.payload?.general_info_status && toast.success(resp?.payload?.general_info_status);
        resp?.payload?.detail && toast.error(resp?.payload?.detail);

      }).catch((e) => { toast.error("Try Again Network Error") });

    }


  };

  useEffect(() => {
    if (initialValues.contact_number === "") {
      // console.log("input change")
      dispatch(isPhoneVerified(false));
      // console.log(KycVerifyStatusForPhone,"Changed Status ==>")
    }
  }, [KycVerifyStatusForPhone]);

  // console.log(formik?.values.contact_number, "==>")

  //-----------------Functionality To Send OTP Via Email Through Button ----------------------
  const handleToSendOTPForVerificationEmail = (values) => {
    // console.log(values)
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
        // console.log("This is the response", res);
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
    console.log(val);
    if (key === "phone") {
      setShowOtpVerifyModalPhone(val);
    }
    if (key === "email") {
      setShowOtpVerifyModalEmail(val);
    }
  };


  // meke input field readonly 

  // let buttonText = "Save and Next"

  // if (role.approver || role.verifier) {

  //   readOnly = true;
  //   buttonText = "Verify and Next"
  // }

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true)
      setButtonText("Approve and Next")
    } else if (role.verifier) {
      setReadOnly(true)
      setButtonText("Verify and Next")
    }
  }, [role])





  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmitContact}
        
      >
        {formik => (
          <Form>
          {console.log(formik)}
            <div className="form-row">
              <div className="col-lg-10">
                <label><h4 class="font-weight-bold">Contact Name<span style={{ color: "red" }}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>



              <div className="col-lg-10">
                <label><h4 class="font-weight-bold">Contact Designation<span style={{ color: "red" }}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="contact_designation"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>

              {/*  Modal Popup for Otp Verification Email*/}
              <MailVerificationModal show={showOtpVerifyModalEmail} setShow={handlerModal} />
              {/*  Modal Popup for Otp Verification Email*/}

              <div className="col-lg-10">
                <label><h4 class="font-weight-bold">Contact Number<span style={{ color: "red" }}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="contact_number"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />


                {KycList?.isContactNumberVerified === 1 ?
                  <span>
                    <p className="text-success">
                      Verified{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                      </svg>
                    </p>
                  </span> :
                  (
                    role.merchant ?
                      <div class="position-sticky col-5 col-sm-4 optbtn">
                        <a
                          href={() => false}
                          className="btn btnbackground text-white font-weight-bold"
                          onClick={() => {
                            checkInputIsValid(
                              formik.errors,
                              formik.values,
                              formik.setFieldError,
                              "contact_number"
                            );
                          }}
                        >
                          Send OTP
                        </a> </div> : <></>
                  )
                }



                {formik?.errors?.isPhoneVerified && <span className="text-danger">{formik?.errors?.isPhoneVerified}</span>}


              </div>
            </div>
            {/*  Modal Popup for Otp Verification */}
            <PhoneVerficationModal show={showOtpVerifyModalPhone} setShow={handlerModal} />
            {/*  Modal Popup for Otp Verification Mobile */}

            <div className="form-row">
              <div className="form-group col-lg-10">
                <label><h4 class="font-weight-bold">Email Id<span style={{ color: "red" }}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="email_id"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}

                />

                {KycList?.isEmailVerified === 1 ?
                  <span>
                    <p className="text-success">
                      Verified
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check"
                        viewBox="0 0 16 16"
                      >
                        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                      </svg>
                    </p>
                  </span>
                  : (
                    role.merchant ?
                      <div class="position-sticky col-5 col-sm-4 optbtn">
                        <a
                          href={() => false}
                          className="btn btnbackground text-white font-weight-bold"
                          onClick={() => {
                            checkInputIsValid(
                              formik.errors,
                              formik.values,
                              formik.setFieldError,
                              "email_id"
                            );
                          }}
                        >
                          Send OTP
                        </a> </div> : <></>
                  )
                }
                {formik?.errors?.isEmailVerified && <span className="text-danger">{formik?.errors?.isEmailVerified}</span>}
              </div>

            </div>


            <div class="mt-lg-2">

              {VerifyKycStatus === "Verified" ? null : (
                <button className="btn float-lg-right" type="submit" style={{ backgroundColor: "#0156B3" }}>
                  <h4 className="text-white font-weight-bold">{buttonText}</h4>
                </button>
              )}


            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfo;