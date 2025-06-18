import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../../_components/formik/FormikController";
import "./kyc-style.css";
import { updateContactInfoEditDetails } from "../../../slices/editKycSlice";
import { kycUserList } from "../../../slices/kycSlice";
import { toast } from "react-toastify";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";
import Yup from "../../../_components/formik/Yup";
// import { gotVerified } from "../../../assets/images/verified.png";
import gotVerified from "../../../assets/images/verified.png";
import {
  aadhaarNumberVerification, dlValidation,
  voterCardValidation,
} from "../../../slices/kycValidatorSlice";
import toastConfig from "../../../utilities/toastTypes";
import AadhaarVerficationModal from "../../KYC/OtpVerificationKYC/AadhaarVerficationModal";
import CustomModal from "../../../_components/custom_modal";
import { ErrorMessage } from "formik";
import { getKycIDList } from "../../../slices/kycSlice";




function ContactInfoEdtkyc(props) {
  const setTitle = props.title
  const setTab = props.tab
  const [selectedIdProofName, setSelectedIdProofName] = useState("");
  const [idProofInputToggle, setIdProofInputToggle] = useState(true);
  const [idType, setIdType] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [dlDobToggle, setDlDobToggle] = useState(false);
  // const [proofIdList, setIdProofList] = useState([])
  const [aadhaarNumberVerifyToggle, setAadhaarNumberVerifyToggle] =
    useState(false);

  const selectedId = props.selectedId
  const { auth, kyc } = useSelector((state) => state);
  // console.log("kyc", kyc);
  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;
  const VerifyKycStatus = kyc?.KycTabStatusStore?.general_info_status;
  const isContactNumberVerified = KycList?.isContactNumberVerified
  const isEmailVerified = KycList?.isEmailVerified
  const dispatch = useDispatch()
  const [disable, setIsDisable] = useState(false)
  const proofIdList = useSelector((state) => state.kyc.kycIdList);

  const [aadhaarVerificationLoader, setAadhaarVerificationLoader] =
    useState(false);

  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    developer_name: KycList?.developer_name || "",
    developer_contact: KycList?.developer_contact || "",
    id_proof_type: KycList?.id_proof_type || 1,
    id_number: KycList?.aadharNumber || "",
    oldIdNumber: KycList?.aadharNumber || "",
    aadhaarOtpDigit: "",
    proofOtpDigit: "",
    isProofOtpSend: false,
    isIdProofVerified: KycList?.aadharNumber ? 1 : "",


  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumericDot, RegexMsg.acceptAlphaNumericDot)

      .nullable()
      .allowOneSpace(),
    contact_number: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed ")
      .nullable(),

    email_id: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .nullable(),


    oldIdNumber: Yup.string().trim().nullable(),

    aadhaarOtpDigit: Yup.string().when("isProofOtpSend", {
      is: true,
      then: Yup.string()
        .matches(Regex.digit, RegexMsg.digit)
        .min(6, "Minimum 6 digits are required")
        .max(6, "Maximum 6 digits are allowed")

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

    dispatch(getKycIDList())
  }, [])


  useEffect(() => {

    let IdProofName = ""
    if (KycList?.id_proof_type === null) {
      setIdProofInputToggle(false);
      IdProofName = proofIdList.data?.find(
        (item) => item?.id === 1
      );
      setIdType(1);

    } else {
      setIdProofInputToggle(false);
      setIdType(KycList?.id_proof_type);
      IdProofName = proofIdList.data?.find(
        (item) => item?.id === KycList?.id_proof_type ?? 1
      );
    }

    if (IdProofName?.id_type) {
      setSelectedIdProofName(IdProofName?.id_type);
    }

  }, [KycList?.id_proof_type, proofIdList]);

  const idProofhandler = (value) => {
    // if (value === "1" || value === "4") {
    setIdProofInputToggle(!idProofInputToggle);
    setIdType(value);
    // } else {
    //   setIdProofInputToggle(true);
    // }
  };


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
            setFieldValue("id_number", e.target.value);
            setFieldValue("isIdProofVerified", "");
          }}
          disabled={VerifyKycStatus === "Verified" ? true : false}
        />

        {values.oldIdNumber &&
          values.id_number &&
          values.isIdProofVerified &&
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
                className={`btn cob-btn-primary btn-sm ${values.id_number?.length < 14 || errors?.id_number
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

        setFieldVal("oldIdNumber", voterId);
        setFieldVal("isIdProofVerified", 1);
      } else {
        toast.error(res?.payload);
      }
    } catch (error) {
      toast.error(res?.payload?.message);
      setOtpLoader(false);
    }
  };

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

  const handleSubmitContact = (values) => {

    const isEmptyValue = Object.keys(values).filter(item => values[item] === "");
    if (isEmptyValue.length > 0) {
      const confirmSubmit = window.confirm(
        `Some fields are empty. These values will not be saved. Do you still want to proceed with submitting the form? 
        ${isEmptyValue.map(item => `\n ${item}`).join(", ")} will not be saved.`
      );
      if (!confirmSubmit) {
        return; // Exit the function if the user cancels
      }
    }

    setIsDisable(true);

    dispatch(
      updateContactInfoEditDetails({
        login_id: selectedId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        modified_by: loginId,
        aadhar_number: values.id_number,
        is_email_verified: isEmailVerified === 1,
        is_contact_number_verified: isContactNumberVerified === 1,
        id_proof_type: idType,
        developer_contact: values.developer_contact,
        developer_name: values.developer_name,
        contact_designation: ''
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
        dispatch(kycUserList({ login_id: selectedId, masking: 1 }));
      } else {
        toast.error(res.payload?.message || "Something went wrong");
        toast.error(res.payload?.detail);
        setIsDisable(false);
      }
    });
  };



  const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
  }

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

                />
              </div>



              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="d-flex justify-content-between col-form-label mt-0 p-2">
                  <span>
                    ID Proof ({selectedIdProofName})
                    <span className="text-danger"> *</span>
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
                      onChange={(e) => {
                        idProofhandler(e.target.value);
                        setFieldValue("id_number", "");
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
                            <option value={item.id} datarel={item.id_type}>
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
                      // setFieldValue("isContactNumberVerified", 0)
                    }}

                  />


                </div>
                <span className="mb-1">

                  <p className={isContactNumberVerified === 1 ? "text-success" : "text-danger"}>
                    {isContactNumberVerified === 1 ? "Verified" : "Not Verified"}
                  </p>

                </span>




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


                  />

                </div>
                <span className="mb-1">

                  <p className={isEmailVerified === 1 ? "text-success" : "text-danger"}>
                    {isEmailVerified === 1 ? "Verified" : "Not Verified"}
                  </p>

                </span>


              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
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


                />
                <ErrorMessage name="developer_name">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

              </div>

              <div className="col-lg-6 col-sm-6 col-md-6">
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


                />
                <ErrorMessage name="developer_contact">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>

              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">

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

              </div>
            </div>



          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfoEdtkyc;

