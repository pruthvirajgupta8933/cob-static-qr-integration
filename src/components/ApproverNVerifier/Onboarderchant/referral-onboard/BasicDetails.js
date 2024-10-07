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
import {
  axiosInstanceJWT,
  axiosInstanceAuth,
} from "../../../../utilities/axiosInstance";
import { generateWord } from "../../../../utilities/generateClientCode";
import API_URL from "../../../../config";
import authService from "../../../../services/auth.service";
import { saveBasicDetails } from "../../../../slices/approver-dashboard/referral-onboard-slice";
import { authPanValidation } from "../../../../slices/kycValidatorSlice";
import { kycValidatorAuth } from "../../../../utilities/axiosInstance";
import toastConfig from "../../../../utilities/toastTypes";
import verifiedIcon from "../../../../assets/images/verified.png";

const BasicDetails = ({ setCurrentTab, type, zoneCode }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [otpBox, showOtpBox] = useState(false);
  const [panLoader, setPanLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [aadhaarLoader, setAadhaarLoader] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    pan: "",
    aadhaar: "",
  };
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse
  );
  const createdBy = useSelector((state) => state.auth.user?.loginId);
  useEffect(() => {
    const createClientCode = async () => {
      const clientFullName = basicDetailsResponse?.data?.name;
      const clientMobileNo = basicDetailsResponse?.data?.mobileNumber;
      const arrayOfClientCode = generateWord(clientFullName, clientMobileNo);

      // check client code is existing
      let newClientCode;
      const checkClientCode = await authService.checkClintCode({
        client_code: arrayOfClientCode,
      });
      if (
        checkClientCode?.data?.clientCode !== "" &&
        checkClientCode?.data?.status === true
      ) {
        newClientCode = checkClientCode?.data?.clientCode;
      } else {
        newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
      }

      const data = {
        loginId: basicDetailsResponse.data?.loginMasterId,
        clientName: clientFullName,
        clientCode: newClientCode,
      };

      try {
        const clientCreated = await axiosInstanceJWT.post(
          API_URL.AUTH_CLIENT_CREATE,
          data
        );
        clientCreated.status === 200 && setSubmitLoader(false);
      } catch (error) {
        // console.log("console is here")
        setSubmitLoader(false);
        toast.error(
          "An error occurred while creating the Client Code. Please try again."
        );
        return;
      }
    };
    // const data = {
    //   loginId: 11477,
    //   clientName: "test ri",
    //   clientCode:
    //     Math.random().toString(36).slice(-6).toUpperCase() || "TEST98",
    // };
    // await axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, data);
    // try {
    //   (async () =>
    //     await axiosInstanceJWT.post(API_URL.AUTH_CLIENT_CREATE, data))();
    // } catch (error) {
    //   // console.log("console is here")
    //   setSubmitLoader(false);
    //   // toast.error('An error occurred while creating the Client Code. Please try again.');
    //   return;
    // }

    if (basicDetailsResponse?.loading) setSubmitLoader(true);
    else if (basicDetailsResponse?.data) {
      axiosInstanceAuth
        .put(
          `${API_URL.EMAIL_VERIFY}${basicDetailsResponse.data?.loginMasterId}`
        )
        .then((response) => {
          response.data && createClientCode();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [basicDetailsResponse]);
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .max(100, "Maximum 100 characters are allowed")
      .required("Required")
      .nullable(),
    contactNumber: Yup.string()
      .allowOneSpace()
      .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
      .required("Required")
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed ")
      .nullable(),
    email: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .required("Required")
      .nullable(),
    password: Yup.string()
      .matches(Regex.password, RegexMsg.password)
      .required("Required"),
    aadhaar: Yup.string()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .length(12, "Only 12 digits are allowed")
      .required("Required"),
    isAadhaarVerified: Yup.boolean().required(),
    pan:
      type === "individual"
        ? Yup.string()
          .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
          .length(10, "Only 10 digits are allowed")
          .required("Required")
        : null,
    isPanVerified: type === "individual" ? Yup.boolean().required() : null,
  });

  const verifyPan = async (pan, setFieldValue) => {
    if (pan?.length !== 10) return;
    setPanLoader(true);
    try {
      const res = await dispatch(authPanValidation({ pan_number: pan }));
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
        setPanLoader(false);
      } else {
        toast.error(res?.payload?.message);
        setPanLoader(false);
      }
    } catch (error) {
      setFieldValue("isPanVerified", false);
      setPanLoader(false);
    }
  };
  const sendAadharOtp = async ({ values, setFieldValue }) => {
    if (values.aadhaar?.length !== 12) return;
    setOtpLoader(true);
    const resp = await kycValidatorAuth.post(API_URL.Aadhar_number, {
      aadhar_number: values.aadhaar,
    });
    if (resp.data.status) {
      showOtpBox(true);
      setOtpLoader(false);
      setFieldValue("otp_ref_id", resp.data.referenceId);
    } else {
      setOtpLoader(true);
    }
  };
  const verifyAadhar = async ({ values, setFieldValue }) => {
    setAadhaarLoader(true);
    try {
      const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, {
        referenceId: values?.otp_ref_id,
        otp: values.aadhar_otp,
      });
      if (resp.data?.valid && resp.data?.status) {
        setFieldValue("isAadhaarVerified", 1);
      }
      toastConfig.successToast(resp?.data?.message);
      showOtpBox(false);
      setAadhaarLoader(false);
    } catch (error) {
      toastConfig.errorToast(
        error?.response?.data?.message ??
        "Something went wrong, Please try again"
      );
      setAadhaarLoader(true);
    }
  };
  const handleSubmit = async (values) => {
    const postData = {
      name: values.name,
      email: values.email,
      mobileNumber: values.contactNumber,
      created_by: createdBy,
      zone_code: zoneCode,
      password: values.password,
      pan_card: values.pan,
      name_on_pan_card: values.panName,
      aadhar_number: values.aadhaar,
      onboard_type:
        type === "individual" ? "Referrer (Individual)" : "Referrer (Company)",
    };
    dispatch(saveBasicDetails(postData));
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
        {({ values, setFieldValue, isValid }) => (
          <Form>
            <div className="row g-3">
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  label="Full Name"
                  autoComplete="off"
                />
              </div>

              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="contactNumber"
                  placeholder="Enter Mobile Number"
                  className="form-control"
                  label="Contact Number"
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email Id"
                  label="Email ID"
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  label="Create Password"
                  autoComplete="off"
                  type="password"
                />
              </div>
              <div className="col-md-6">
                <label className="col-form-label mb-2 lh-sm">Aadhaar</label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="aadhaar"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isAadhaarVerified", "");
                      setFieldValue("aadhaar", e.target.value); // Set the uppercase value to form state
                    }}
                  />
                  {values?.aadhaar !== null &&
                    values?.aadhaar !== "" &&
                    values?.aadhaar !== undefined &&
                    // !errors.hasOwnProperty("pan_card") &&
                    // !errors.hasOwnProperty("is_pan_verified") &&

                    values?.isAadhaarVerified !== "" ? (
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
                      {otpLoader ? (
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
                          className={`btn cob-btn-primary text-white btn btn-sm ${values.aadhaar?.length !== 12
                              ? "disabled"
                              : "pe-auto"
                            }`}
                          onClick={() =>
                            sendAadharOtp({ values, setFieldValue })
                          }
                        >
                          Send OTP
                        </a>
                      )}
                    </span>
                  )}
                </div>
                {otpBox && (
                  <CustomModal
                    modalBody={() => (
                      <>
                        <label>
                          Please Enter OTP sent to your phone number
                        </label>
                        <div className="input-group w-40">
                          <Field
                            type="text"
                            name="aadhar-otp"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("isAadhaarVerified", "");
                              setFieldValue("aadhar_otp", e.target.value); // Set the uppercase value to form state
                            }}
                          />
                          <span className="input-group-append">
                            {aadhaarLoader ? (
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
                                className="btn cob-btn-primary text-white btn btn-sm"
                                onClick={() =>
                                  verifyAadhar({ values, setFieldValue })
                                }
                              >
                                Verify
                              </a>
                            )}
                          </span>
                        </div>
                      </>
                    )}
                    modalSize={"md"}
                    modalToggle={otpBox}
                    headerTitle={"Aadhaar Verification"}
                    fnSetModalToggle={() => showOtpBox(false)}
                  />
                )}
              </div>
              {type === "individual" && (
                <div className="col-md-6">
                  <label className="col-form-label mb-2 lh-sm">PAN</label>
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
                            className={`btn cob-btn-primary text-white btn btn-sm ${values.pan?.length !== 10 ? "disabled" : "pe-auto"
                              }`}
                            onClick={() => verifyPan(values.pan, setFieldValue)}
                          >
                            Verify
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
                  disabled={!isValid}
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

                {basicDetailsResponse.data && !submitLoader && (
                  <a
                    className="btn active-secondary btn-sm m-2"
                    onClick={() =>
                      type === "individual"
                        ? setCurrentTab("address")
                        : setCurrentTab("biz_overview")
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
