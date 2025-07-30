import React, { useState, useEffect, useMemo, useRef } from "react";
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
  kycUserListForMerchant
} from "../../slices/kycSlice";

import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { KYC_STATUS_VERIFIED } from "../../utilities/enums";
import "./kyc-style.css";
import toastConfig from "../../utilities/toastTypes";
// import AadhaarVerficationModal from "./OtpVerificationKYC/AadhaarVerficationModal";
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import {
  aadhaarCreateUrlSlice,
  aadhaarGetAadhaarSlice,
  // aadhaarNumberVerification,
  dlValidation,
  voterCardValidation,
} from "../../slices/kycValidatorSlice";
import { useLocation, useHistory } from "react-router-dom";

import keyConfig from "../../key.config";
import { Decrypt, Encrypt } from "../../utilities/aes";

const newEcrypt = (value) => {
  const resp = Encrypt(value, keyConfig.LOGIN_AUTH_KEY, keyConfig.LOGIN_AUTH_IV)
  return resp
}

const newDecrypt = (value) => {
  if (!value) return value
  const resp = Decrypt(value, keyConfig.LOGIN_AUTH_KEY, keyConfig.LOGIN_AUTH_IV)
  return resp
}


function ContactInfoKyc(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const merchantloginMasterId = props.merchantloginMasterId;

  const dispatch = useDispatch();
  const location = useLocation();
  const redirectReposnseParams = new URLSearchParams(location.search);
  const aadhaar_resp_id = redirectReposnseParams.get("id");

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;

  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [selectedIdProofName, setSelectedIdProofName] = useState("");
  // const [aadhaarProofState, setAadhaarProofState] = useState({})

  // const [aadhaarNumberVerifyToggle, setAadhaarNumberVerifyToggle] =
  // useState(false);
  const [aadhaarVerificationLoader, setAadhaarVerificationLoader] =
    useState(false);
  const [idProofInputToggle, setIdProofInputToggle] = useState(true);
  const [dlDobToggle, setDlDobToggle] = useState(false);
  const [idType, setIdType] = useState();
  const proofIdList = useSelector((state) => state.kyc.kycIdList);
  const hasFetchedRef = useRef({});
  const updateIdProofVerifyStatus = useRef("");

  const history = useHistory()





  let id_number = newDecrypt(sessionStorage.getItem("id_number"))
  let proof_id = newDecrypt(sessionStorage.getItem("proof_id"))
  let proof_text = newDecrypt(sessionStorage.getItem("proof_text"))



  const initialValues = {
    name: KycList?.name || "",
    email_id: KycList?.emailId || "",

    // ID proof verification
    id_proof_type: updateIdProofVerifyStatus.current === 1 ? proof_id : (KycList?.id_proof_type || 1),
    id_number: updateIdProofVerifyStatus.current === 1 ? id_number : (KycList?.aadharNumber || ""),
    oldIdNumber: updateIdProofVerifyStatus.current === 1 ? id_number : (KycList?.aadharNumber || ""),
    // id_proof_type: KycList?.id_proof_type || 1,
    // id_number: KycList?.aadharNumber || "",
    // oldIdNumber: KycList?.aadharNumber || "",
    aadhaarOtpDigit: "",
    proofOtpDigit: "",
    isProofOtpSend: false,
    // isIdProofVerified: updateIdProofVerifyStatus.current || (KycList?.aadharNumber ? 1 : ""),
    isIdProofVerified: updateIdProofVerifyStatus.current === 1 ? 1 : KycList?.aadharNumber ? 1 : "",

    // contact OTP initial values
    isContactNumberVerified: KycList?.isContactNumberVerified || "",
    isEmailVerified: KycList?.isEmailVerified || "",
    contact_number: KycList?.contactNumber || "",
    oldContactNumber: KycList?.contactNumber || "",
    contactOtpDigit: "",
    isContactOtpSend: false,
    developer_name: KycList?.developer_name || "",
    developer_contact: KycList?.developer_contact || "",
  };




  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace() // Only one instance is needed
      .matches(Regex.acceptAlphaNumericDot_Masked, RegexMsg.acceptAlphaNumericDot)
      .wordLength("Word character length exceeded")
      .max(100, "Maximum 100 characters are allowed")
      .required("Required")
      .nullable(),

    email_id: Yup.string()
      .email("Invalid email / Please verify email")
      .required("Required")
      .nullable(),

    isEmailVerified: Yup.string().required("Please verify email").nullable(),

    contact_number: Yup.string()
      .allowOneSpace()
      .matches(Regex.phoneNumber_Masked, RegexMsg.phoneNumber)
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed")
      .required("Required")
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
      is: 1, // Case: id_proof_type = 1
      then: Yup.string()
        .max(12, "Maximum 12 digits are required")
        .required("Required")
        .nullable(),
      otherwise: Yup.string().when("id_proof_type", {
        is: 4, // Case: id_proof_type = 4 
        then: Yup.string()
          // .min(10, "Minimum 10 digits are required")
          .required("Required")
          .nullable(),
        otherwise: Yup.string().when("id_proof_type", {
          is: 3, // Case: id_proof_type = 3 (e.g., Voter ID)
          then: Yup.string().length(10, "Invalid Voter ID"),
          otherwise: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(), // Default case if none of the conditions match
        }),
      }),
    }),

    oldIdNumber: Yup.string().trim().nullable(),

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
    developer_name: Yup.string()
      .matches(Regex.acceptAlphaNumericDot_Masked, RegexMsg.acceptAlphaNumericDot)
      .max(100, "Maximum 50 characters are allowed")
      .nullable(),
    developer_contact: Yup.string()
      .allowOneSpace()
      .matches(Regex.phoneNumber_Masked, RegexMsg.phoneNumber)
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed")
      .nullable(),
  });


  useEffect(() => {

    if (!proofIdList?.data?.length > 0) {
      dispatch(getKycIDList());
    }


    return () => {
      sessionStorage.removeItem("id_number")
      sessionStorage.removeItem("proof_id")
      sessionStorage.removeItem("proof_text")
    }
  }, []);


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
        developer_contact: values.developer_contact,
        developer_name: values.developer_name
      })
    )
      .then((res) => {
        if (
          res?.meta?.requestStatus === "fulfilled" &&
          res.payload?.status === true
        ) {
          // clear the session
          sessionStorage.removeItem("id_number")
          sessionStorage.removeItem("proof_id")
          sessionStorage.removeItem("proof_text")

          // navigate('/new-path', { replace: true });
          setTab(2);
          setTitle("BUSINESS OVERVIEW");
          setIsDisable(false);
          toast.success(res.payload?.detail || res.payload?.message);

          if (props?.role?.merchant) {
            dispatch(kycUserListForMerchant());
          } else {
            dispatch(kycUserList({ login_id: merchantloginMasterId, masking: 1 }));
          }

          dispatch(GetKycTabsStatus({ login_id: merchantloginMasterId }));
        } else {

          toastConfig.errorToast(res.payload);
          // toast.error(res.payload?.detail || res.payload?.message);
          // toast.error();
          setIsDisable(false);
        }
      })
      .catch((error) => {
        toastConfig.errorToast("Something went wrong");
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

  const memoParamId = useMemo(() => aadhaar_resp_id, [aadhaar_resp_id])


  useEffect(() => {
    // Only proceed if:
    // 1. memoParamId has a value
    // 2. We have NOT already fetched for this specific memoParamId

    if (memoParamId && !hasFetchedRef.current[memoParamId]) {
      // Mark this memoParamId as "currently fetching" or "fetched"
      // This prevents duplicate calls if memoParamId doesn't change but the component re-renders
      hasFetchedRef.current[memoParamId] = true;
      // setSelectedIdProofName(proof_text);
      dispatch(aadhaarGetAadhaarSlice({ aadhaar_id: memoParamId }))
        .then((resp) => {
          // console.log(resp.payload);
          if (
            resp.meta.requestStatus === "fulfilled" &&
            resp.payload.status === true
          ) {
            updateIdProofVerifyStatus.current = 1
            toastConfig.successToast(resp.payload.message);
            history.replace(location.pathname)



          } else {
            // setAadhaarVerificationLoader(false);
            updateIdProofVerifyStatus.current = ""
            toastConfig.errorToast(
              resp.payload ?? "Something went wrong, Please try again"
            );
            history.replace(location.pathname)
            // If the API call failed, reset the flag for this ID
            // This allows a retry if the component re-renders or memoParamId changes again
            hasFetchedRef.current[memoParamId] = false;
          }
        })
        .catch(error => {
          // Handle network errors or other unexpected errors during dispatch
          // console.error('API dispatch error:', error);
          setAadhaarVerificationLoader(false);
          toastConfig.errorToast('An unexpected error occurred. Please try again.');
          // Reset the flag on error to allow retries
          hasFetchedRef.current[memoParamId] = false;
        });
    }



  }, [memoParamId, dispatch, setAadhaarVerificationLoader]); // Add all external dependencies


  // aadhar verification
  const aadhaarVerificationHandler = async (aadhar_number, setFieldVal) => {
    setAadhaarVerificationLoader(true);
    // window.location.href = `https://api.digitallocker.gov.in/public/oauth2/1/authorize?client_id=7E5773C4&code_challenge=jcm7ODH9eH9uMTw4PRKvLxkXh0g2yTlpO8Ax1U9_X68&code_challenge_method=S256&consent_valid_till=1829141682&dl_flow=signup&pla&purpose=kyc&redirect_uri=https%3A%2F%2Fdigilocker-preproduction.signzy.tech%2Fdigilocker-auth-complete&req_doctype=PANCR%2CADHAR%2CDRVLC&response_type=code&state=68809430c9db0108d4bb2e14`;


    dispatch(aadhaarCreateUrlSlice({ aadhar_number })).then(
      (resp) => {
        if (
          resp.meta.requestStatus === "fulfilled" &&
          resp.payload.status === true
        ) {
          const confirmation = window.confirm("You will redirect to the verification page.");
          if (!confirmation) {
            setAadhaarVerificationLoader(false);
            return false
          }
          setAadhaarVerificationLoader(false);
          window.location.href = resp.payload.url;
        } else {
          setAadhaarVerificationLoader(false);
          toastConfig.errorToast(
            resp.payload ?? "Something went wrong, Please try again"
          );
        }
      }
    )
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

  const voterVerificationHandler = async (voterId, setFieldVal) => {
    setOtpLoader(true);
    let res;
    try {
      res = await dispatch(voterCardValidation({ voter: voterId }));
      setOtpLoader(false);
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        setOtpLoader(false);
        setFieldVal("oldIdNumber", voterId);
        setFieldVal("isIdProofVerified", 1);
      }
    } catch (error) {
      toast.error(res?.payload?.message);
      setOtpLoader(false);
    }
  };
  const idProofhandler = (value) => {
    // if (value === "1" || value === "4") {
    setIdProofInputToggle(!idProofInputToggle);
    setIdType(value);
    // } else {
    //   setIdProofInputToggle(true);
    // }
  };



  const handleInputFieldVal = (e, setFieldValue) => {
    setFieldValue("id_number", e.target.value);
    setFieldValue("oldIdNumber", "");
    setFieldValue("isIdProofVerified", "");

    const enc_id_number = newEcrypt(e.target.value)
    sessionStorage.setItem("id_number", enc_id_number)
  }


  const renderInputField = ({ values, errors, setFieldValue }) => {

    return (
      <>
        <Field
          type="text"
          name="id_number"
          autoComplete="off"
          className="form-control"
          placeholder="Enter ID Proof Number"
          onChange={(e) => {
            handleInputFieldVal(e, setFieldValue)
          }}
          disabled={VerifyKycStatus === "Verified" ? true : false}
        />

        {values.oldIdNumber &&
          values.id_number &&
          values.isIdProofVerified &&
          values.oldIdNumber === values.id_number &&
          !errors.hasOwnProperty("id_number") &&
          !errors.hasOwnProperty("oldIdNumber") ? (
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
              <button
                // href={() => false}
                type='button'
                className={`btn cob-btn-primary btn-sm ${values.id_number?.length < 12 ||
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
              </button>
            )}
            {idType === "3" && (
              <button
                // href={() => false}
                type='button'
                className={`btn cob-btn-primary btn-sm ${values.id_number?.length < 10 ? "disabled" : ""
                  }`}
                onClick={() => {
                  voterVerificationHandler(values.id_number, setFieldValue);
                }}
              // disabled={errors.hasOwnProperty("aadhar_number") ? true : false}
              >
                {otpLoader ? (
                  <span className="spinner-border spinner-border-sm">
                    <span className="sr-only">Loading...</span>
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            )}
            {idType === "4" && (
              <button
                // href={() => false}
                type='button'
                className={`btn cob-btn-primary btn-sm ${errors?.id_number
                  ? "disabled"
                  : ""
                  }`}
                onClick={() => {
                  setDlDobToggle(true);
                }}
              >
                Verify
              </button>
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
      setFieldValue("isIdProofVerified", "1");
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
    let IdProofName = ""
    if (KycList?.id_proof_type === null || KycList?.id_proof_type === undefined) {
      // If id_proof_type is null or undefined
      setIdProofInputToggle(true);
    } else {

      setIdProofInputToggle(false);
      setIdType(proof_id || KycList?.id_proof_type);
      IdProofName = proofIdList.data?.find(
        (item) => item?.id === KycList?.id_proof_type ?? 1
      );
    }

    if (IdProofName?.id_type) {
      setSelectedIdProofName(proof_text || IdProofName?.id_type);
    }


  }, [KycList?.id_proof_type, proofIdList, proof_text, proof_id]);



  const idProofChangeHandler = (e, setFieldValue) => {
    idProofhandler(e.target.value);
    setFieldValue("id_number", "");
    setFieldValue("id_proof_type", e.target.value);
    setSelectedIdProofName(e.target[e.target.selectedIndex].text);
    sessionStorage.removeItem("id_number")

    const enc_curr_value = newEcrypt(e.target.value)
    const enc_curr_value_text = newEcrypt(e.target[e.target.selectedIndex].text)

    sessionStorage.setItem("proof_id", enc_curr_value)
    sessionStorage.setItem("proof_text", enc_curr_value_text)
  }

  // console.log("proof_text", selectedIdProofName)
  return (
    <div className="col-lg-12 p-0">
      {KycList?.isEmailVerified !== 1 && (
        <div className="alert alert-warning text-center text-danger" role="alert">
          Email verification is required to complete the Know Your Customer (KYC) process. We have sent a verification email to your registered email address. Please check your inbox or spam folder.
        </div>
      )}
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
                  Contact Person Name<span className="text-danger">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1 ? true : false}

                />
                <ErrorMessage name="name">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="d-flex justify-content-between col-form-label mt-0 p-2">
                  <span>
                    {selectedIdProofName && (<>ID Proof ({selectedIdProofName})
                      <span className="text-danger"> *</span></>)}
                  </span>
                  <span
                    className="text-decoration-underline text-primary cursor_pointer small"
                    onClick={() => setIdProofInputToggle((prev) => !prev)}
                  >
                    Select ID Proof
                  </span>
                </label>

                <div className="input-group">
                  {idProofInputToggle ? (
                    <select
                      className="form-select"
                      onChange={(e) => idProofChangeHandler(e, setFieldValue)}
                      disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1 ? true : false}
                    >
                      <option value="">Select ID Proof</option>
                      {proofIdList.data?.map((item) => {
                        if (item.is_active)
                          return (
                            <option value={item.id} datarel={item.id_type} selected={item.id === proof_id}>
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
                    disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1 ? true : false}

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
                      <button
                        // href={() => false}
                        type='button'
                        className={`btn cob-btn-primary btn-sm text-white ${isLoading || KycList?.isEmailVerified !== 1 ? "disabled" : ""
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
                      // disabled={KycList?.isEmailVerified !== 1}
                      >
                        {isLoading ? (
                          <span className="spinner-border spinner-border-sm">
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
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
                  // readOnly={true}
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

                <ErrorMessage name="isEmailVerified">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label
                  className="col-form-label mt-0 p-2"
                  data-tip={tooltipData.contact_person_name}
                >
                  Developer Name
                </label>
                <Field
                  type="text"
                  name="developer_name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1 ? true : false}

                />
                <ErrorMessage name="developer_name">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <label
                  className="col-form-label mt-0 p-2"
                  data-tip={tooltipData.contact_person_name}
                >
                  Developer Contact Number
                </label>
                <Field
                  type="text"
                  name="developer_contact"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1 ? true : false}

                />
                <ErrorMessage name="developer_contact">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

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
