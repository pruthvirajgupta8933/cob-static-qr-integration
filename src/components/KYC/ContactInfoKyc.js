import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../_components/formik/Yup";
import CustomModal from "../../_components/custom_modal";
import { toast } from "react-toastify";
import {
  otpForContactInfo,
  updateContactInfo,
  kycUserList,
  GetKycTabsStatus,
  getKycIDList,
  // otpVerificationForContactForPhone,
} from "../../slices/kycSlice";

import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
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
import AadhaarVerficationModal from "./OtpVerificationKYC/AadhaarVerficationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import {
  aadhaarNumberVerification,
  dlValidation,
} from "../../slices/kycValidatorSlice";
// import { error } from "jquery";

function ContactInfoKyc(props) {
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
  const [otpLoader, setOtpLoader] = useState(false);
  const [selectedIdProofName, setSelectedIdProofName] = useState("");

  const [aadhaarNumberVerifyToggle, setAadhaarNumberVerifyToggle] =
    useState(false);
  const [aadhaarVerificationLoader, setAadhaarVerificationLoader] =
    useState(false);
  const [idProofInputToggle, setIdProofInputToggle] = useState(true);
  const [dlDobToggle, setDlDobToggle] = useState(false);
  const [idType, setIdType] = useState();
  const proofIdList = useSelector((state) => state.kyc.kycIdList);
  useEffect(() => {
    dispatch(getKycIDList());
  }, []);

  const initialValues = {
    name: KycList?.name,
    email_id: KycList?.emailId,

    // ID proof verification
    id_proof_type: KycList?.id_proof_type,
    id_number: KycList?.aadharNumber,
    oldIdNumber: KycList?.aadharNumber,
    aadhaarOtpDigit: "",
    proofOtpDigit: "",
    isProofOtpSend: false,
    isIdProofVerified: KycList?.aadharNumber ? 1 : "",

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
    isContactNumberVerified: Yup.string()
      .required("Please verify the contact number")
      .nullable(),
    contactOtpDigit: Yup.string().when("isContactOtpSend", {
      is: true,
      then: Yup.string()
        .matches(Regex.digit, RegexMsg.digit)
        .min(6, "Minimum 6 digits are required")
        .max(6, "Maximum 6 digits are allowed")
        .required("Required")
        .nullable(),
      otherwise: Yup.string(),
    }),

    id_number: Yup.string().when("id_proof_type", {
      is: (value) => value === 1, // For id_proof_type = 1
      then: Yup.string()
        // .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
        .max(12, "Maximum 12 digits are required")
        .required("Required")
        .nullable(),
      otherwise: Yup.string().when("id_proof_type", {
        is: (value) => value === 4, // For id_proof_type = 4
        then: Yup.string()
          .min(14, "Minimum 14 digits are required")
          .max(14, "Maximum 14 digits are required")
          .required("Required")
          .nullable(),
        otherwise: Yup.string().allowOneSpace().required("Required").nullable(), // Default case if none of the above conditions match
      }),
    }),
    oldIdNumber: Yup.string()
      .trim()
      // .oneOf(
      //   [Yup.ref("aadhar_number"), null],
      //   "You need to verify Your Aadhaar Number"
      // )
      // .required("You need to verify Your Aadhaar Number")
      .nullable(),

    aadhaarOtpDigit: Yup.string().when("isProofOtpSend", {
      is: true,
      then: Yup.string()
        .matches(Regex.digit, RegexMsg.digit)
        .min(6, "Minimum 6 digits are required")
        .max(6, "Maximum 6 digits are allowed")
        .required("Required")
        .nullable(),
      otherwise: Yup.string(),
    }),
    isIdProofVerified: Yup.string()
      .required("Please verify the ID Proof")
      .nullable(),
  });

  const handleSubmitContact = (values) => {
    setIsDisable(true);
    dispatch(
      updateContactInfo({
        login_id: merchantloginMasterId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        modified_by: loginId,
        aadhar_number: values.id_number,
        id_proof_type: idType,
      })
    )
      .then((res) => {
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
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
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
      await aadhaarVerificationHandler(val[key], setFieldVal);
    }
  };

  const tooltipData = {
    contact_person_name:
      "The name of an individual who serves as a point of contact for a particular organization or business.",
    contact_phone:
      "We will reach out to this phone for any account related issues.",
  };

  // aadhar verification
  const aadhaarVerificationHandler = async (aadhar_number, setFieldVal) => {
    setAadhaarVerificationLoader(true);

    dispatch(aadhaarNumberVerification({ aadhar_number: aadhar_number }))
      .then((resp) => {
        if (resp.type === "kycValidator/aadhaarNumberVerification/fulfilled") {
          setAadhaarNumberVerifyToggle(true);
          setAadhaarVerificationLoader(false);
          setFieldVal("isProofOtpSend", true);
          setFieldVal("aadhaarOtpDigit", "");
          toastConfig.successToast(resp.payload.message);
        } else {
          setAadhaarVerificationLoader(false);
          toastConfig.errorToast(
            resp.payload ?? "Something went wrong, Please try again"
          );
        }
      })
      .catch((err) => {
        setAadhaarVerificationLoader(false);
        toastConfig.errorToast(
          err?.response?.data?.message ??
            "Something went wrong, Please try again"
        );
      });
  };

  // contact number verification
  const contactVerificationHandler = async (values, setFieldVal) => {
    setIsLoading(true);
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
        setFieldVal("isContactOtpSend", true);
        setFieldVal("contactOtpDigit", "");
      } else {
        toast.error(res.payload.message);
        setShowOtpVerifyModalPhone(false);
        setIsLoading(false);
      }
    });
  };

  const idProofhandler = (value) => {
    if (value === "1" || value === "4") {
      setIdProofInputToggle(false);
      setIdType(value);
    } else {
      setIdProofInputToggle(true);
    }
  };

  const renderInputField = ({ values, errors, setFieldValue }) => {
    return (
      <>
        <Field
          type="text"
          name="id_number"
          autoComplete="off"
          className="form-control maskedInput"
          placeholder="Enter ID Proof Number"
          onChange={(e) => {
            setFieldValue("id_number", e.target.value);
            setFieldValue("isIdProofVerified", "");
          }}
          disabled={VerifyKycStatus === "Verified" ? true : false}
        />

        {values.oldIdNumber &&
        values.id_number &&
        values.oldIdNumber === values.id_number ? (
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
        ) : (
          <div className="input-group-append">
            {idType === "1" && (
              <a
                href={() => false}
                className={`btn cob-btn-primary btn-sm ${
                  values.id_number?.length < 12 ||
                  aadhaarVerificationLoader ||
                  errors?.id_number
                    ? "disabled"
                    : ""
                }`}
                onClick={() => {
                  aadhaarVerificationHandler(values.id_number, setFieldValue);
                }}
                // disabled={errors.hasOwnProperty("aadhar_number") ? true : false}
              >
                {aadhaarVerificationLoader ? (
                  <span className="spinner-border spinner-border-sm">
                    <span className="sr-only">Loading...</span>
                  </span>
                ) : (
                  "Verify"
                )}
              </a>
            )}
            {idType === "4" && (
              <a
                href={() => false}
                className={`btn cob-btn-primary btn-sm ${
                  values.id_number?.length < 14 || errors?.id_number
                    ? "disabled"
                    : ""
                }`}
                onClick={() => {
                  setDlDobToggle(true);
                }}
              >
                Verify
              </a>
            )}
          </div>
        )}
      </>
    );
  };

  const handleDlVerification = async ({ values, setFieldValue }) => {
    setOtpLoader(true);

    const res = await dispatch(
      dlValidation({
        dl_number: values.id_number,
        date_of_birth: values.dob.split("-").reverse().join("-"), //format required for sending to call
      })
    );
    if (
      res.meta?.requestStatus === "fulfilled" &&
      !res.payload?.status &&
      !res.payload?.valid
    ) {
      toastConfig.errorToast(
        res?.payload?.message || "Something went wrong. Please try again"
      );
    } else if (res.payload?.status && res.payload?.valid) {
      setFieldValue("isDlVerified", 1);
      setFieldValue("isIdProofVerified", 1);
      setFieldValue("oldIdNumber", values.id_number);
    }
    setOtpLoader(false);
    setDlDobToggle(false);
  };

  const renderDobModal = ({ values, setFieldValue }) => {
    return (
      <>
        <label className="col-form-label mx-auto w-100 p-2 text-center">
          Please enter your Date Of Birth
        </label>
        <div className="input-group mb-3 text-center mx-auto w-50">
          <Field
            type="date"
            className="form-control dob-input-kyc w-50"
            name="dob"
            onChange={(e) => setFieldValue("dob", e.target.value)}
            placeholder="Enter DOB"
            required={true}
            disabled={otpLoader}
          />
          <button
            className="btn btn cob-btn-primary btn-sm"
            type="button"
            onClick={() => handleDlVerification({ values, setFieldValue })}
          >
            {otpLoader ? (
              <span className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </>
    );
  };

  // handle input toggle if id proof type is null then show dropdown else show input field

  useEffect(() => {
    if (KycList?.id_proof_type === null) {
      setIdProofInputToggle(true);
    } else {
      setIdProofInputToggle(false);
      setIdType(KycList?.id_proof_type);
    }

    const IdProofName = proofIdList.data?.find(
      (item) => item?.id === KycList?.id_proof_type
    );
    if (IdProofName?.id_type) {
      setSelectedIdProofName(IdProofName?.id_type);
    }
  }, [KycList?.id_proof_type, proofIdList]);

  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({ values, errors, isValid, setFieldError, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label
                  className="col-form-label mt-0 p-2"
                  data-tip={tooltipData.contact_person_name}
                >
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
                <label className="d-flex justify-content-between col-form-label mt-0 p-2">
                  <span>
                    ID Proof ({selectedIdProofName})
                    <span className="text-danger"> *</span>
                  </span>
                  <span
                    className="text-decoration-underline text-primary cursor_pointer"
                    onClick={() => setIdProofInputToggle((prev) => !prev)}
                  >
                    Select ID Proof
                  </span>
                </label>

                <div className="input-group">
                  {idProofInputToggle ? (
                    <select
                      className="form-select"
                      onChange={(e) => {
                        idProofhandler(e.target.value);
                        setFieldValue("id_number", "");
                        setFieldValue("id_proof_type", e.target.value);
                        setSelectedIdProofName(
                          e.target[e.target.selectedIndex].text
                        );
                      }}
                      disabled={VerifyKycStatus === "Verified" ? true : false}
                    >
                      <option value="">Select ID Proof</option>
                      {proofIdList.data?.map((item) => {
                        if (item.is_active)
                          return (
                            <option value={item.id} dataRel={item.id_type}>
                              {item.id_type}
                            </option>
                          );
                        return <></>;
                      })}
                    </select>
                  ) : (
                    <React.Fragment>
                      {renderInputField({ values, errors, setFieldValue })}
                    </React.Fragment>
                  )}
                </div>
                {errors?.id_number && (
                  <p className="text-danger m-0">{errors?.id_number}</p>
                )}
                {errors?.isIdProofVerified && (
                  <p className="text-danger m-0">{errors?.isIdProofVerified}</p>
                )}
                {errors?.oldIdNumber && (
                  <p className="text-danger m-0">{errors?.oldIdNumber}</p>
                )}
              </div>

              {aadhaarNumberVerifyToggle && (
                <AadhaarVerficationModal
                  formikFields={{
                    values,
                    errors,
                    setFieldError,
                    setFieldValue,
                  }}
                  isOpen={aadhaarNumberVerifyToggle}
                  toggle={setAadhaarNumberVerifyToggle}
                  resendOtp={(values, setFieldValue) =>
                    aadhaarVerificationHandler(values, setFieldValue)
                  }
                />
              )}
              {dlDobToggle && (
                <CustomModal
                  modalToggle={dlDobToggle}
                  headerTitle={"Driving License Verification"}
                  modalBody={() => renderDobModal({ values, setFieldValue })}
                  modalSize="modal-md"
                  fnSetModalToggle={() => setDlDobToggle(false)}
                />
              )}
            </div>

            <div className="row">
              {/* start contact verify field */}
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label
                  className="col-form-label mt-0 p-2"
                  data-tip={tooltipData.contact_phone}
                >
                  Contact Number<span className="text-danger"> *</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="contact_number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("contact_number", e.target.value);
                      setFieldValue("isContactNumberVerified", 0);
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
                  ) : (
                    <div className="input-group-append">
                      <a
                        href={() => false}
                        className={`btn cob-btn-primary btn-sm text-white ${
                          isLoading ? "disabled" : ""
                        }`}
                        onClick={() => {
                          if (!errors.contact_number) {
                            inputFieldValidation(
                              errors,
                              values,
                              setFieldError,
                              setFieldValue,
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
                    </div>
                  )}
                </div>
                <ErrorMessage name="contact_number">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

                <ErrorMessage name="oldContactNumber">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

                <ErrorMessage name="isContactNumberVerified">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>

              {showOtpVerifyModalPhone && (
                <PhoneVerficationModal
                  formikFields={{
                    values,
                    errors,
                    setFieldError,
                    setFieldValue,
                  }}
                  isOpen={showOtpVerifyModalPhone}
                  toggle={setShowOtpVerifyModalPhone}
                  resendOtp={(values, setFieldValue) =>
                    contactVerificationHandler(values, setFieldValue)
                  }
                />
              )}
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
                    readOnly={true}
                  />
                  {KycList?.emailId !== null &&
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
                    disabled={!isValid}
                    type="submit"
                    className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                  >
                    {disable && (
                      <span className="mr-2">
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          ariaHidden="true"
                        />
                        <span className="sr-only">Loading...</span>
                      </span>
                    )}
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
