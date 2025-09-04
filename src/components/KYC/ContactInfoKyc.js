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
import PhoneVerficationModal from "./OtpVerificationKYC/PhoneVerficationModal";
import {
  aadhaarCreateUrlSlice,
  aadhaarGetAadhaarSlice,
  dlValidation,
  voterCardValidation,
} from "../../slices/kycValidatorSlice";
import { useLocation, useHistory } from "react-router-dom";

// import keyConfig from "../../key.config";
// import { Decrypt, Encrypt } from "../../utilities/aes";

// const newEcrypt = (value) =>
//   Encrypt(value, keyConfig.LOGIN_AUTH_KEY, keyConfig.LOGIN_AUTH_IV);

// const newDecrypt = (value) => {
//   if (!value) return value;
//   return Decrypt(value, keyConfig.LOGIN_AUTH_KEY, keyConfig.LOGIN_AUTH_IV);
// };

// Keys to persist ONLY Aadhaar result across refresh/reinit
const AADHAAR_MASKED_KEY = "aadhaar_masked_number";
const AADHAAR_TYPE_KEY = "aadhaar_type_verified"; // "1" when Aadhaar verified
const PROOF_ID_KEY = "proof_id";
const PROOF_TEXT_KEY = "proof_text";

function ContactInfoKyc(props) {
  const { tab: setTab, title: setTitle, merchantloginMasterId, role } = props;

  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  // Parse redirect param (DigiLocker id)
  const redirectReposnseParams = new URLSearchParams(location.search);
  const aadhaar_resp_id = redirectReposnseParams.get("id");
  const memoParamId = useMemo(() => aadhaar_resp_id, [aadhaar_resp_id]);

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;
  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const proofIdList = useSelector((state) => state.kyc.kycIdList);

  // UI states
  const [showOtpVerifyModalPhone, setShowOtpVerifyModalPhone] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [aadhaarVerificationLoader, setAadhaarVerificationLoader] = useState(false);
  const [idProofInputToggle, setIdProofInputToggle] = useState(true);
  const [dlDobToggle, setDlDobToggle] = useState(false);
  const [idType, setIdType] = useState();
  const [selectedIdProofName, setSelectedIdProofName] = useState("");

  // Guards/refs
  const formikRef = useRef(null);
  const hasFetchedRef = useRef({});

  // Session (persisted) bits we use to *override* Aadhaar on reinit
  const sessionMaskedAadhaar = sessionStorage.getItem(AADHAAR_MASKED_KEY) || "";
  const sessionAadhaarType = sessionStorage.getItem(AADHAAR_TYPE_KEY) || ""; // "1" means verified Aadhaar
  const proof_id_ss = parseInt(sessionStorage.getItem(PROOF_ID_KEY));
  const proof_text_ss = sessionStorage.getItem(PROOF_TEXT_KEY);

  // ---------- Validation ----------
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
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
      .oneOf([Yup.ref("contact_number"), null], "You need to verify Your Contact Number")
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
      is: 1,
      then: Yup.string().required("Required").nullable(),
      otherwise: Yup.string().when("id_proof_type", {
        is: 4,
        then: Yup.string().required("Required").nullable(),
        otherwise: Yup.string().when("id_proof_type", {
          is: 3,
          then: Yup.string().nullable(),
          otherwise: Yup.string().allowOneSpace().required("Required").nullable(),
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

  // ---------- initialValues builder ----------
  // Everything reinitializes from Redux, EXCEPT Aadhaar fields prefer verified session values.
  const initialValues = useMemo(() => {
    const base = {
      name: KycList?.name || "",
      email_id: KycList?.emailId || "",

      // non-Aadhaar verification bits reinit from KycList:
      isContactNumberVerified: KycList?.isContactNumberVerified || "",
      isEmailVerified: KycList?.isEmailVerified || "",
      contact_number: KycList?.contactNumber || "",
      oldContactNumber: KycList?.contactNumber || "",
      contactOtpDigit: "",
      isContactOtpSend: false,

      developer_name: KycList?.developer_name || "",
      developer_contact: KycList?.developer_contact || "",

      aadhaarOtpDigit: "",
      proofOtpDigit: "",
      isProofOtpSend: false,
    };

    // --- Aadhaar/ID fields ---
    // If we *already* verified Aadhaar in this session (post-redirect), keep those
    const isAadhaarVerifiedInSession = sessionAadhaarType === "1";
    if (isAadhaarVerifiedInSession && sessionMaskedAadhaar) {
      return {
        ...base,
        id_proof_type: 1, // Aadhaar
        id_number: sessionMaskedAadhaar,
        oldIdNumber: sessionMaskedAadhaar,
        isIdProofVerified: 1,
      };
    }

    // else: fall back to Redux
    return {
      ...base,
      id_proof_type: KycList?.id_proof_type ?? 1,
      id_number: KycList?.aadharNumber || "",
      oldIdNumber: KycList?.aadharNumber || "",
      isIdProofVerified: KycList?.aadharNumber ? 1 : "",
    };
  }, [KycList, sessionAadhaarType, sessionMaskedAadhaar]);

  // ---------- Bootstrap ----------
  useEffect(() => {
    if (!(proofIdList?.data?.length > 0)) {
      dispatch(getKycIDList());
    }
  }, [dispatch, proofIdList?.data?.length]);

  // If this page is responsible to fetch KycList
  useEffect(() => {
    const hasKyc = KycList && Object.keys(KycList).length > 0;
    if (!hasKyc) {
      if (role?.merchant) {
        dispatch(kycUserListForMerchant());
      } else {
        dispatch(kycUserList({ login_id: merchantloginMasterId, masking: 1 }));
      }
    }
  }, [dispatch, KycList, merchantloginMasterId, role?.merchant]);

  // ---------- Aadhaar redirect consume: update ONLY Aadhaar fields ----------
  useEffect(() => {
    setSelectedIdProofName(proof_text_ss || selectedIdProofName);

    if (memoParamId && !hasFetchedRef.current[memoParamId]) {
      hasFetchedRef.current[memoParamId] = true;

      dispatch(aadhaarGetAadhaarSlice({ aadhaar_id: memoParamId }))
        .then((resp) => {
          if (resp.meta.requestStatus === "fulfilled" && resp.payload.status === true) {
            toastConfig.successToast(resp.payload.message);
            setIdProofInputToggle(false);

            const masked = resp.payload.masked_aadhar_number;

            // Persist Aadhaar-only result so future reinitializations preserve it
            try {
              sessionStorage.setItem(AADHAAR_MASKED_KEY, masked);
              sessionStorage.setItem(AADHAAR_TYPE_KEY, "1"); // Aadhaar verified
            } catch { }

            // Patch only Aadhaar fields now
            const f = formikRef.current;
            if (f) {
              f.setValues(
                {
                  ...f.values,
                  id_proof_type: 1,
                  id_number: masked,
                  oldIdNumber: masked,
                  isIdProofVerified: 1,
                },
                false
              );
              setIdType(1);
            }

            // Clean URL
            const url = new URL(window.location.href);
            ["requestId", "status", "scope"].forEach((key) => url.searchParams.delete(key));
            window.history.replaceState(null, "", url.toString());
          } else {
            toastConfig.errorToast(resp.payload ?? "Something went wrong, Please try again");
            hasFetchedRef.current[memoParamId] = false;
          }

        })
        .catch(() => {
          setAadhaarVerificationLoader(false);
          toastConfig.errorToast("An unexpected error occurred. Please try again.");
          hasFetchedRef.current[memoParamId] = false;
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoParamId, dispatch]);

  // ---------- Start Aadhaar verification flow ----------
  const aadhaarVerificationHandler = async (aadhar_number, setFieldVal) => {
    setAadhaarVerificationLoader(true);
    const redirect_url = window.location.href;
    // const redirect_url = "https://misportal.sabpaisa.in/";

    dispatch(aadhaarCreateUrlSlice({ aadhar_number, redirect_url })).then((resp) => {
      if (resp.meta.requestStatus === "fulfilled" && resp.payload.status === true) {
        const confirmation = window.confirm("You will redirect to the verification page.");
        if (!confirmation) {
          setAadhaarVerificationLoader(false);
          return;
        }
        setAadhaarVerificationLoader(false);
        window.location.href = resp.payload.url;
      } else {
        setAadhaarVerificationLoader(false);
        toastConfig.errorToast(resp.payload ?? "Something went wrong, Please try again");
      }
    });
  };

  // ---------- Contact OTP ----------
  const contactVerificationHandler = async (mobile, setFieldVal) => {
    setIsLoading(true);
    dispatch(
      otpForContactInfo({
        mobile_number: mobile,
        otp_type: "phone",
        otp_for: "kyc",
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
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

  // ---------- Voter / DL ----------
  const voterVerificationHandler = async (voterId, setFieldVal) => {
    setOtpLoader(true);
    let res;
    try {
      res = await dispatch(voterCardValidation({ voter: voterId }));
      setOtpLoader(false);
      if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
        setFieldVal("oldIdNumber", voterId);
        setFieldVal("isIdProofVerified", 1);
      } else {
        toastConfig.errorToast(res?.payload || "Something went wrong. Please try again");
      }
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred. Please try again.");
      setOtpLoader(false);
    }
  };

  const handleDlVerification = async ({ values, setFieldValue }) => {
    setOtpLoader(true);
    const res = await dispatch(
      dlValidation({
        dl_number: values.id_number,
        date_of_birth: values.dob.split("-").reverse().join("-"),
      })
    );

    if (res.meta?.requestStatus === "fulfilled" && !res.payload?.status && !res.payload?.valid) {
      toastConfig.errorToast(res?.payload?.message || "Something went wrong. Please try again");
    } else if (res.payload?.status && res.payload?.valid) {
      setFieldValue("isDlVerified", 1);
      setFieldValue("isIdProofVerified", 1);
      setFieldValue("oldIdNumber", values.id_number);
    }
    setOtpLoader(false);
    setDlDobToggle(false);
  };

  // ---------- ID proof helpers ----------
  const idProofhandler = (value) => {
    setIdProofInputToggle(!idProofInputToggle);
    setIdType(value);
  };

  const handleInputFieldVal = (e, setFieldValue) => {
    setFieldValue("id_number", e.target.value);
    setFieldValue("oldIdNumber", "");
    setFieldValue("isIdProofVerified", "");
  };

  const idProofChangeHandler = (e, setFieldValue) => {
    const val = e.target.value;
    const txt = e.target[e.target.selectedIndex].text;
    idProofhandler(val);
    setFieldValue("id_number", "");
    setFieldValue("id_proof_type", val);
    setFieldValue("oldIdNumber", "");
    setFieldValue("isIdProofVerified", "");
    setSelectedIdProofName(txt);

    sessionStorage.removeItem(AADHAAR_MASKED_KEY);
    sessionStorage.removeItem(AADHAAR_TYPE_KEY);
    sessionStorage.setItem(PROOF_ID_KEY, val);
    sessionStorage.setItem(PROOF_TEXT_KEY, txt);
  };

  const renderInputField = ({ values, errors, setFieldValue }) => (
    <>
      <Field
        type="text"
        name="id_number"
        autoComplete="off"
        className="form-control"
        placeholder="Enter ID Proof Number"
        onChange={(e) => handleInputFieldVal(e, setFieldValue)}
        disabled={VerifyKycStatus === "Verified"}
      />

      {values.oldIdNumber &&
        values.id_number &&
        values.isIdProofVerified &&
        values.oldIdNumber === values.id_number &&
        !errors.hasOwnProperty("id_number") &&
        !errors.hasOwnProperty("oldIdNumber") ? (
        <span className="success input-group-append">
          <img src={gotVerified} alt="" title="" width={"20px"} height={"20px"} className="btn-outline-secondary" />
        </span>
      ) : (
        <div className="input-group-append">
          {idType == "1" && (
            <button
              type="button"
              className={`btn cob-btn-primary btn-sm ${values.id_number?.length < 12 || aadhaarVerificationLoader || errors?.id_number ? "disabled" : ""
                }`}
              onClick={() => aadhaarVerificationHandler(values.id_number, setFieldValue)}
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

          {idType == "3" && (
            <button
              type="button"
              className={`btn cob-btn-primary btn-sm ${values.id_number?.length < 10 ? "disabled" : ""}`}
              onClick={() => voterVerificationHandler(values.id_number, setFieldValue)}
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

          {idType == "4" && (
            <button
              type="button"
              className={`btn cob-btn-primary btn-sm ${errors?.id_number ? "disabled" : ""}`}
              onClick={() => setDlDobToggle(true)}
            >
              Verify
            </button>
          )}
        </div>
      )}
    </>
  );

  // Decide initial input/dropdown mode and label (UI only)
  useEffect(() => {
    let IdProofName = "";
    if ((KycList?.id_proof_type === null || KycList?.id_proof_type === undefined) && !proof_id_ss) {
      setIdProofInputToggle(true);
    } else {
      setIdProofInputToggle(false);
      const effectiveType = (sessionAadhaarType === "1" ? 1 : (proof_id_ss || KycList?.id_proof_type));
      setIdType(effectiveType);
      IdProofName = proofIdList.data?.find(
        (item) => item?.id === (effectiveType ?? 1)
      );
    }
    if (IdProofName?.id_type) {
      setSelectedIdProofName(proof_text_ss || IdProofName?.id_type);
    }
  }, [KycList?.id_proof_type, proofIdList, proof_text_ss, proof_id_ss, sessionAadhaarType]);

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
        id_proof_type: idType ?? values.id_proof_type,
        developer_contact: values.developer_contact,
        developer_name: values.developer_name
      })
    )
      .then((res) => {
        if (res?.meta?.requestStatus === "fulfilled" && res.payload?.status === true) {
          // keep Aadhaar session values; clearing only proof selection
          sessionStorage.removeItem(PROOF_ID_KEY);
          sessionStorage.removeItem(PROOF_TEXT_KEY);
          sessionStorage.removeItem(AADHAAR_MASKED_KEY);
          sessionStorage.removeItem(AADHAAR_TYPE_KEY);

          setTab(2);
          setTitle("BUSINESS OVERVIEW");
          setIsDisable(false);
          toast.success(res.payload?.detail || res.payload?.message);

          if (role?.merchant) {
            dispatch(kycUserListForMerchant());
          } else {
            dispatch(kycUserList({ login_id: merchantloginMasterId, masking: 1 }));
          }
          dispatch(GetKycTabsStatus({ login_id: merchantloginMasterId }));
        } else {
          toastConfig.errorToast(res.payload);
          setIsDisable(false);
        }
      })
      .catch(() => {
        toastConfig.errorToast("Something went wrong");
        setIsDisable(false);
      });
  };

  const inputFieldValidation = async (err, val, setErr, setFieldVal, key) => {
    const hasErr = err.hasOwnProperty(key);
    if (hasErr && val[key] === "") setErr(key, true);

    if (!hasErr && val[key] !== "" && key === "contact_number") {
      setIsLoading(true);
      await contactVerificationHandler(val[key], setFieldVal);
    }
  };

  const tooltipData = {
    contact_person_name:
      "The name of an individual who serves as a point of contact for a particular organization or business.",
    contact_phone: "We will reach out to this phone for any account related issues.",
  };

  return (
    <div className="col-lg-12 p-0">
      {KycList?.isEmailVerified !== 1 && (
        <div className="alert alert-warning text-center text-danger" role="alert">
          Email verification is required to complete the Know Your Customer (KYC) process.
          We have sent a verification email to your registered email address.
          Please check your inbox or spam folder.
        </div>
      )}

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({ values, errors, isValid, setFieldError, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Contact Person Name<span className="text-danger">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1}
                />
                <ErrorMessage name="name">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="d-flex justify-content-between col-form-label mt-0 p-2">
                  <span>
                    {selectedIdProofName && (
                      <>
                        ID Proof ({selectedIdProofName})
                        <span className="text-danger"> *</span>
                      </>
                    )}
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
                      value={values.id_proof_type ?? ""}
                      onChange={(e) => idProofChangeHandler(e, setFieldValue)}
                      disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1}
                    >
                      <option value="">Select ID Proof</option>
                      {proofIdList.data?.map((item) =>
                        item.is_active ? (
                          <option key={item.id} value={item.id} datarel={item.id_type}>
                            {item.id_type}
                          </option>
                        ) : null
                      )}
                    </select>
                  ) : (
                    <React.Fragment>
                      {renderInputField({ values, errors, setFieldValue })}
                    </React.Fragment>
                  )}
                </div>
                {errors?.id_number && <p className="text-danger m-0">{errors?.id_number}</p>}
                {errors?.isIdProofVerified && <p className="text-danger m-0">{errors?.isIdProofVerified}</p>}
                {errors?.oldIdNumber && <p className="text-danger m-0">{errors?.oldIdNumber}</p>}
              </div>

              {dlDobToggle && (
                <CustomModal
                  modalToggle={dlDobToggle}
                  headerTitle={"Driving License Verification"}
                  modalBody={() => (
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
                          required
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
                  )}
                  modalSize="modal-md"
                  fnSetModalToggle={() => setDlDobToggle(false)}
                />
              )}
            </div>

            <div className="row">
              {/* Contact verify field */}
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
                      setFieldValue("contact_number", e.target.value);
                      setFieldValue("isContactNumberVerified", 0);
                    }}
                    disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1}
                  />
                  {KycList?.contactNumber !== null &&
                    values?.isContactNumberVerified === 1 &&
                    !errors.hasOwnProperty("contact_number") &&
                    !errors.hasOwnProperty("oldContactNumber") ? (
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={"20px"} height={"20px"} className="btn-outline-secondary" />
                    </span>
                  ) : (
                    <div className="input-group-append">
                      <button
                        type="button"
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
                  formikFields={{ values, errors, setFieldError, setFieldValue }}
                  isOpen={showOtpVerifyModalPhone}
                  toggle={setShowOtpVerifyModalPhone}
                  resendOtp={(values, setFieldValue) =>
                    contactVerificationHandler(values, setFieldValue)
                  }
                />
              )}

              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2">
                  Email Id<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="email_id"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified"}
                  />
                  {KycList?.emailId !== null && KycList?.isEmailVerified === 1 && (
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={"20px"} height={"20px"} className="btn-outline-secondary" />
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
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Developer Name
                </label>
                <Field
                  type="text"
                  name="developer_name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1}
                />
                <ErrorMessage name="developer_name">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>

              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Developer Contact Number
                </label>
                <Field
                  type="text"
                  name="developer_contact"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" || KycList?.isEmailVerified !== 1}
                />
                <ErrorMessage name="developer_contact">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {VerifyKycStatus === KYC_STATUS_VERIFIED ? null : (
                  <button
                    disabled={!isValid}
                    type="submit"
                    className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                  >
                    {disable && (
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    )}
                    Save and Next
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
