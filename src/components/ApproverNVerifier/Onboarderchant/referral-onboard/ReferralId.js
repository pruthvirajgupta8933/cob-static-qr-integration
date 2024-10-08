import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Yup from "../../../../_components/formik/Yup";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";

import { toast } from "react-toastify";
import { kycValidatorAuth } from "../../../../utilities/axiosInstance";
import API_URL from "../../../../config";
import toastConfig from "../../../../utilities/toastTypes";
import { businessOverviewState } from "../../../../slices/kycSlice";
import {
  saveAddressDetails,
  saveReferralIds,
} from "../../../../slices/approver-dashboard/referral-onboard-slice";
import { authPanValidation } from "../../../../slices/kycValidatorSlice";
import verifiedIcon from "../../../../assets/images/verified.png";

const ReferralId = ({ setCurrentTab }) => {
  const [stateData, setStateData] = useState([]);
  const [otpBox, showOtpBox] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const initialValues = {
    aadhaar: "",
    pan: "",
  };
  const validationSchema = Yup.object().shape({
    aadhaar: Yup.string().required("Required").nullable(),
    pan: Yup.string().required("Required").nullable(),
  });
  const dispatch = useDispatch();

  const sendAadharOtp = async ({ values, setFieldValue }) => {
    const resp = await kycValidatorAuth.post(API_URL.Aadhar_number, {
      aadhar_number: values.aadhaar,
    });
    if (resp.data.status) {
      showOtpBox(true);
      setFieldValue("otp_ref_id", resp.data.referenceId);
    }
  };
  const verifyAadhar = async ({ values, setFieldValue }) => {
    try {
      const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, {
        referenceId: values?.otp_ref_id,
        otp: values.aadhar_otp,
      });
      if (resp.data?.valid && resp.data?.status) {
        setFieldValue("isAadharVerified", 1);
      }
      toastConfig.successToast(resp?.data?.message);
      showOtpBox(false);
      // setIsLoading(false)
    } catch (error) {
      toastConfig.errorToast(
        error?.response?.data?.message ??
          "Something went wrong, Please try again"
      );
      // setIsLoading(false)
    }
  };
  const verifyPan = async (pan, setFieldValue) => {
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
      } else {
        toast.error(res?.payload?.message);
      }
    } catch (error) {
      setFieldValue("isPanVerified", false);
    }
  };
  ////Get Api for Buisness overview///////////
  useEffect(() => {
    dispatch(businessOverviewState())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "stateId",
          "stateName",
          resp.payload
        );
        setStateData(data);
      })
      .catch((err) => console.log(err));
  }, []);
  const onSubmit = async (values) => {
    setSubmitLoader(true);
    const postData = {
      login_id: basicDetailsResponse?.login_master_id || 11477,
      aadhar_number: values.aadhaar,
      pan_card: values.pan,
      name_on_pan_card: values.panName,
    };
    try {
      const res = await dispatch(saveReferralIds(postData));
      res?.payload?.status && toastConfig.successToast("Data Saved");
      setSubmitLoader(false);
    } catch (e) {
      setSubmitLoader(false);
      toastConfig.errorToast(e?.response?.data?.detail);
    }
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
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label px-2 py-0 mb-2 lh-sm">
                  Aadhaar
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="aadhaar"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isAadharVerified", "");
                      setFieldValue("aadhaar", e.target.value); // Set the uppercase value to form state
                    }}
                  />
                  {values?.aadhaar !== null &&
                  values?.aadhaar !== "" &&
                  values?.aadhaar !== undefined &&
                  // !errors.hasOwnProperty("pan_card") &&
                  // !errors.hasOwnProperty("is_pan_verified") &&

                  values?.isAadharVerified !== "" ? (
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
                      <a
                        href={() => false}
                        className="btn cob-btn-primary text-white btn btn-sm"
                        onClick={() => sendAadharOtp({ values, setFieldValue })}
                      >
                        Send OTP
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                {otpBox && (
                  <>
                    <label className="col-form-label px-2 py-0 mb-2 lh-sm">
                      Enter OTP
                    </label>
                    <div className="input-group w-40">
                      <Field
                        type="text"
                        name="aadhar-otp"
                        className="form-control"
                        placeholder="Please Enter OTP sent to your phone number"
                        onChange={(e) => {
                          setFieldValue("isAadharVerified", "");
                          setFieldValue("aadhar_otp", e.target.value); // Set the uppercase value to form state
                        }}
                      />
                      <span className="input-group-append">
                        <a
                          href={() => false}
                          className="btn cob-btn-primary text-white btn btn-sm"
                          onClick={() =>
                            verifyAadhar({ values, setFieldValue })
                          }
                        >
                          Verify
                        </a>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label px-2 py-0 mb-2 lh-sm">
                  PAN
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
                      <a
                        href={() => false}
                        className="btn cob-btn-primary text-white btn btn-sm"
                        onClick={() => {
                          verifyPan(values.pan, setFieldValue);
                        }}
                      >
                        Verify
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <label className="col-form-label px-2 py-0 mb-2 lh-sm">
                  Name on PAN
                </label>
                <div className="input-group">
                  <Field type="label" name="panName" className="form-control" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
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

                <a
                  className="btn active-secondary btn-sm m-2"
                  onClick={() => setCurrentTab("bank")}
                >
                  Next
                </a>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReferralId;
