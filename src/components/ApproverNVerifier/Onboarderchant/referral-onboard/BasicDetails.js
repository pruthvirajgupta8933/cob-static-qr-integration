import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Yup from "../../../../_components/formik/Yup";
import CustomModal from "../../../../_components/custom_modal";
import FormikController from "../../../../_components/formik/FormikController";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";
import AadhaarVerficationModal from "../../../KYC/OtpVerificationKYC/AadhaarVerficationModal";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";
import API_URL from "../../../../config";
import { kycUserList, getKycIDList } from "../../../../slices/kycSlice";
import {
  saveBasicDetails,
  referralOnboardSlice,
} from "../../../../slices/approver-dashboard/referral-onboard-slice";
import {
  advancePanValidation,
  authPanValidation,
  dlValidation,
  voterCardValidation,
} from "../../../../slices/kycValidatorSlice";
import toastConfig from "../../../../utilities/toastTypes";
import verifiedIcon from "../../../../assets/images/verified.png";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { stringEnc } from "../../../../utilities/encodeDecode";

const BasicDetails = ({ setCurrentTab, type, zoneCode, edit, disableForm }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [panLoader, setPanLoader] = useState(false);
  const [idProofLoader, setIdProofLoader] = useState(false);
  const [selectedIdProofName, setSelectedIdProofName] = useState("");

  const [aadhaarNumberVerifyToggle, setAadhaarNumberVerifyToggle] =
    useState(false);
  const [dlDobToggle, setDlDobToggle] = useState(false);
  const [dlLoader, setDlLoader] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const proofIdList = useSelector((state) => state.kyc.kycIdList);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const createdBy = useSelector((state) => state.auth.user?.loginId);
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const [idType, setIdType] = useState(kycData?.id_proof_type);
  const [idProofInputToggle, setIdProofInputToggle] = useState(
    !Boolean(kycData?.id_proof_type)
  );

  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    name: kycData?.name ?? basicDetailsResponse?.data?.name ?? "",
    contactNumber:
      kycData?.contactNumber ?? basicDetailsResponse?.data?.mobileNumber ?? "",
    email: kycData?.emailId ?? basicDetailsResponse?.data?.email ?? "",
    password: edit ? "**********" : "",
    pan:
      kycData?.signatoryPAN ??
      kycData?.panCard ??
      basicDetailsResponse?.data?.pan_card ??
      "",
    id_number:
      kycData?.aadharNumber ?? basicDetailsResponse?.data?.aadhar_number ?? "",
    isIdProofVerified:
      kycData?.aadharNumber || basicDetailsResponse?.data?.aadhar_number
        ? 1
        : "",
    isPanVerified:
      kycData?.signatoryPAN ||
        kycData?.panCard ||
        basicDetailsResponse?.data?.pan_number
        ? 1
        : "",
    panName: kycData?.nameOnPanCard ?? "",
  };

  useEffect(() => {
    if (proofIdList.data && kycData)
      setSelectedIdProofName(
        proofIdList.data?.find((type) => type.id === kycData.id_proof_type)
          ?.id_type
      );
    setIdProofInputToggle(!Boolean(kycData?.id_proof_type));
  }, [kycData, proofIdList?.data]);
  useEffect(() => {
    dispatch(getKycIDList());
  }, []);
  useEffect(() => {
    if (basicDetailsResponse?.loading) setSubmitLoader(true);
    else if (basicDetailsResponse?.data) {
      if (!kycData?.isEmailVerified)
        toastConfig.successToast(
          "Data saved successfully. Please verify the email sent"
        );
      else if (edit) toastConfig.successToast("Data saved successfully");
      setSubmitLoader(false);
    } else if (basicDetailsResponse?.error) {
      toastConfig.errorToast(
        basicDetailsResponse?.message ?? "Error saving data! Please try again"
      );
      setSubmitLoader(false);
    }
    if (basicDetailsResponse?.data && !kycData?.merchant_address_details)
      dispatch(
        kycUserList({
          login_id: basicDetailsResponse?.data.loginMasterId,
          masking: 1
        })
      );
  }, [basicDetailsResponse]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .max(100, "Maximum 100 characters are allowed")
      .matches(Regex.acceptAlphaNumericDot_Masked, RegexMsg.acceptAlphaNumericDot)
      .required("Required")
      .nullable(),
    contactNumber: Yup.string()
      .allowOneSpace()
      .matches(Regex.phoneNumber_Masked, RegexMsg.phoneNumber)
      .required("Required")
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed ")
      .nullable(),
    email: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .required("Required")
      .nullable(),
    password: edit
      ? Yup.string()
        .matches(
          /(?:\*+|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$/,
          RegexMsg.password
        )
        .required("Required")
      : Yup.string()
        .matches(Regex.password, RegexMsg.password)
        .required("Required"),
    id_number: Yup.string().required("Required"),
    isIdProofVerified: Yup.boolean().required("Please verify id proof"),
    pan:
      type === "individual"
        ? Yup.string()
          .matches(Regex.panRegex, RegexMsg.panRegex)
          .length(10, "Only 10 digits are allowed")
          .required("Required")
        : null,
    isPanVerified:
      type === "individual"
        ? Yup.boolean().required("Please verify PAN")
        : null,
  });

  const idProofhandler = (value) => {
    setIdProofInputToggle(!idProofInputToggle);
    setIdType(value);
  };

  const verifyPan = async (pan, setFieldValue) => {
    if (pan?.length !== 10) return;
    setPanLoader(true);
    try {
      const res = await dispatch(advancePanValidation({ pan_number: pan }));
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setFieldValue("isPanVerified", res.payload.status);
        setFieldValue(
          "panName",
          `${res.payload.first_name} ${res.payload.last_name}`
        );
        setFieldValue("pan_dob_or_doi", res?.payload?.dob);
        setPanLoader(false);
      } else {
        toast.error(
          res?.payload ?? res?.payload?.message ?? res?.payload?.data?.message
        );
        setPanLoader(false);
      }
    } catch (error) {
      setFieldValue("isPanVerified", false);
      setPanLoader(false);
      toast.error(error);
    }
  };

  const sendAadharOtp = async ({ values, setFieldValue }) => {
    setIdProofLoader(true);
    try {
      const resp = await axiosInstanceJWT.post(API_URL.Aadhar_number, {
        aadhar_number: values.id_number,
      });
      if (resp.data.status) {
        setIdProofLoader(false);
        setAadhaarNumberVerifyToggle(true);
        setFieldValue("otp_ref_id", resp.data.referenceId);
      } else {
        setIdProofLoader(false);
      }
    } catch (error) {
      toastConfig.errorToast(
        error?.response?.data?.message ??
        error?.response?.data?.detail ??
        "Something went wrong, Please try again"
      );
      setIdProofLoader(false);
    }
  };

  const voterVerificationHandler = async (voterId, setFieldVal) => {
    setIdProofLoader(true);
    let res;
    try {
      res = await dispatch(voterCardValidation({ voter: voterId }));
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true
      ) {
        setIdProofLoader(false);
        setFieldVal("isIdProofVerified", 1);
      } else {
        toast.error(res?.payload?.message ?? res.payload?.detail);
        setIdProofLoader(false);
      }
    } catch (error) {
      toast.error(res?.payload?.message);
      setIdProofLoader(false);
    }
  };

  const handleSubmit = async (values) => {
    const postData = {
      name: values.name,
      email: values.email,
      mobileNumber: values.contactNumber,
      created_by: createdBy,
      zone_code: zoneCode,
      pan_card: values.pan,
      name_on_pan_card: values.panName,
      pan_dob_or_doi: values.pan_dob_or_doi,
      aadhar_number: values.id_number,
      onboard_type:
        type === "individual" ? "Referrer (Individual)" : "Referrer (Company)",
      id_proof_type: idType,
    };
    if (edit) {
      postData.login_id = kycData?.loginMasterId;
      if (values.password !== initialValues.password)
        postData.password = values.password;
      else postData.password = kycData.secret_key;
    } else postData.password = values.password;

    dispatch(saveBasicDetails(postData)).then(() => {
      if (basicDetailsResponse?.data)
        dispatch(
          kycUserList({
            login_id: kycData?.loginMasterId,
            password_required: true,
            masking: 1
          })
        );
    });
  };

  const handleDlVerification = async ({ values, setFieldValue }) => {
    setDlLoader(true);

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
        res?.payload?.message ||
        res?.payload?.detail ||
        "Something went wrong. Please try again"
      );
    } else if (res.payload?.status && res.payload?.valid) {
      setFieldValue("isIdProofVerified", 1);
      setDlDobToggle(false);
    }
    setDlLoader(false);
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
            disabled={dlLoader}
          />
          <button
            className="btn btn cob-btn-primary btn-sm"
            type="button"
            onClick={() => handleDlVerification({ values, setFieldValue })}
          >
            {dlLoader ? (
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

  const renderInputField = ({ values, errors, setFieldValue }) => {
    let disableClass = false;
    if (!edit) {
      if (idType === "1") {
        //{"name":"NEHA SINHA","loginMasterId":11522,"business_cat_code":"13","status":"Pending","isOnboardStart":true}
        if (values.id_number?.length < 12 || idProofLoader || errors?.id_number)
          disableClass = true;
      } else if (idType === "3") {
        if (values.id_number?.length < 10) disableClass = true;
      } else if (idType === "4") {
        if (values.id_number?.length < 14 || errors?.id_number)
          disableClass = true;
      }
    }
    return (
      <>
        <Field
          type="text"
          name="id_number"
          autoComplete="off"
          className="form-control"
          placeholder={
            idType ? "Enter ID Proof Number" : "Please select ID type"
          }
          onChange={(e) => {
            setFieldValue("id_number", e.target.value);
            setFieldValue("isIdProofVerified", "");
          }}
          disabled={
            disableForm ||
            (edit ? disableForm : !idType || kycData?.id_proof_type)
          }
        />

        {values.id_number && values.isIdProofVerified ? (
          <span className="success input-group-append">
            <img
              src={verifiedIcon}
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
              className={`btn cob-btn-primary btn-sm ${disableClass || disableForm ? "disabled" : ""
                }`}
              onClick={() =>
                idType === "1"
                  ? sendAadharOtp({ values, setFieldValue })
                  : idType === "3"
                    ? voterVerificationHandler(values.id_number, setFieldValue)
                    : idType === "4"
                      ? setDlDobToggle(true)
                      : {}
              }
            // disabled={errors.hasOwnProperty("aadhar_number") ? true : false}
            >
              {idProofLoader ? (
                <span className="spinner-border spinner-border-sm">
                  <span className="sr-only">Loading...</span>
                </span>
              ) : (
                "Verify"
              )}
            </a>
          </div>
        )}
        {aadhaarNumberVerifyToggle && (
          <AadhaarVerficationModal
            formikFields={{
              values,
              errors,
              setFieldValue,
            }}
            isOpen={aadhaarNumberVerifyToggle}
            toggle={setAadhaarNumberVerifyToggle}
            resendOtp={(values, setFieldValue) =>
              sendAadharOtp({ values, setFieldValue })
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
      </>
    );
  };
  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-link1"
      role="tabpanel"
      aria-labelledby="v-pills-link1-tab"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, errors, setFieldValue, isValid }) => (
          <Form autoComplete="off">
            <div className="row g-3">
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  label="Full Name"
                  required
                  autoComplete="off"
                  disabled={disableForm}
                />
              </div>

              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="contactNumber"
                  placeholder="Enter Mobile Number"
                  className="form-control"
                  label="Contact Number"
                  autoComplete="nope"
                  required
                  disabled={disableForm}
                />
              </div>
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email Id"
                  label="Email ID"
                  autoComplete="nope"
                  required
                  disabled={disableForm}
                />
              </div>
              <div className="col-md-6">
                <label className="d-flex justify-content-between col-form-label">
                  Create Password
                </label>
                <div className="input-group">
                  <Field
                    control="input"
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={basicDetailsResponse?.data || disableForm}
                  />
                  <span
                    className="input-group-text"
                    onClick={() => setShowPassword(!showPassword)}
                    id="basic-addon2"
                  >
                    {showPassword ? (
                      <i className="fa fa-eye" ariaHidden="true"></i>
                    ) : (
                      <i className="fa fa-eye-slash" ariaHidden="true"></i>
                    )}
                  </span>
                </div>
                <ErrorMessage name="password">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </div>
              <div className="col-md-6">
                <label className="d-flex justify-content-between col-form-label">
                  <span>
                    ID Proof ({selectedIdProofName})
                    <span className="text-danger"> *</span>
                  </span>
                  <span
                    className="text-decoration-underline text-primary cursor_pointer"
                    onClick={() =>
                      // !kycData?.id_proof_type &&
                      setIdProofInputToggle((prev) => !prev)
                    }
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

                        if (
                          kycData?.aadharNumber &&
                          e.target.value == kycData?.id_proof_type
                        ) {
                          setFieldValue("id_number", kycData.aadharNumber);
                        } else setFieldValue("id_number", "");
                        setFieldValue("id_proof_type", e.target.value);
                        setSelectedIdProofName(
                          e.target[e.target.selectedIndex].text
                        );
                      }}
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
                    renderInputField({ values, errors, setFieldValue })
                  )}
                </div>
              </div>
              {type === "individual" && (
                <div className="col-md-6">
                  <label className="col-form-label d-flex">
                    PAN<span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <Field
                      type="text"
                      name="pan"
                      className="form-control"
                      onChange={(e) => {
                        setFieldValue("isPanVerified", "");
                        const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                        setFieldValue("pan", uppercaseValue); // Set the uppercase value to form state
                      }}
                      disabled={disableForm}
                    />
                    {values?.pan !== null &&
                      values?.pan !== "" &&
                      values?.pan !== undefined &&
                      // !errors.hasOwnProperty("pan_card") &&
                      // !errors.hasOwnProperty("is_pan_verified") &&

                      values?.isPanVerified !== "" ? (
                      <span className="success input-group-append">
                        <img
                          src={verifiedIcon}
                          alt=""
                          title=""
                          width={"20px"}
                          height={"20px"}
                          className="btn-outline-secondary"
                        />
                      </span>
                    ) : (
                      <span className="input-group-append">
                        {panLoader ? (
                          <div className="bg-primary text-white w-100 p-2">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              ariaHidden="true"
                            />
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          <a
                            href={() => false}
                            className={`btn cob-btn-primary text-white btn btn-sm ${values.pan?.length !== 10 || disableForm
                              ? "disabled"
                              : "pe-auto"
                              }`}
                            onClick={() => verifyPan(values.pan, setFieldValue)}
                          >
                            Verify
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                  <span>{values.panName}</span>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
                  disabled={
                    !isValid && basicDetailsResponse?.data?.loginMasterId
                  }
                >
                  {submitLoader ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        ariaHidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>

                {(basicDetailsResponse.data || edit) && !submitLoader && (
                  <a
                    className="btn active-secondary btn-sm m-2"
                    onClick={() =>
                      type === "individual"
                        ? setCurrentTab("address")
                        : history.push(
                          `kyc?kycid=${stringEnc(
                            kycData?.loginMasterId ??
                            basicDetailsResponse.data?.loginMasterId
                          )}`
                        )
                    }
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicDetails;
