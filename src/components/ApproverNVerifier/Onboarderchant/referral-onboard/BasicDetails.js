import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Yup from "../../../../_components/formik/Yup";
import FormikController from "../../../../_components/formik/FormikController";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";
import { authPanValidation } from "../../../../slices/kycSlice";
import verifiedIcon from "../../../../assets/images/verified.png";

const BasicDetails = ({ setCurrentTab, type }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    name: "",
    contactNumber: "",
    email: "",
    pan: "",
    aadhar: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .wordLength("Word character length exceeded", 100)
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
    aadhar: Yup.string()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .length(12, "Only 12 digits are allowed")
      .nullable(),
    pan: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .length(10, "Only 10 digits are allowed")
      .nullable(),
  });
  const handleSubmit = () => {};

  const verifyAadhar = (aadhar) => {
    console.log(aadhar);
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
      } else {
        toast.error(res?.payload?.message);
      }
    } catch (error) {
      setFieldValue("isPanVerified", false);
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
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue }) => (
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
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  className="form-control"
                  label="Contact Number"
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <FormikController
                  control="input"
                  name="email_id"
                  className="form-control"
                  placeholder="Enter Email Id"
                  label="Email ID"
                  autoComplete="off"
                />
              </div>
              <div className="col-md-6">
                <label className="col-form-label px-2 py-0 mb-2 lh-sm">
                  Aadhar
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="aadhar"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isAadharVerified", "");
                      setFieldValue("aadhar", e.target.value); // Set the uppercase value to form state
                    }}
                  />
                  {values?.aadhar !== null &&
                  values?.aadhar !== "" &&
                  values?.aadhar !== undefined &&
                  // !errors.hasOwnProperty("pan_card") &&
                  // !errors.hasOwnProperty("is_pan_verified") &&

                  values?.isAadharVerified !== "" ? (
                    <span className="success input-group-append">
                      <img
                        // src={verifiedIcon}
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
                        onClick={() => verifyAadhar(values.aadhar)}
                      >
                        Verify
                      </a>
                    </span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <label className="col-form-label p-2">PAN</label>
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
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
                >
                  {submitLoader && (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        ariaHidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </>
                  )}
                  Save
                </button>

                {/* {merchantKycData?.isContactNumberVerified === 1 && */}
                <a
                  className="btn active-secondary btn-sm m-2"
                  onClick={() =>
                    type === "individual"
                      ? setCurrentTab("bank")
                      : setCurrentTab("biz_overview")
                  }
                >
                  Next
                </a>
                {/* } */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicDetails;
