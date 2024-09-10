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
import {
  ifscValidation,
  bankAccountVerification,
  getBankId,
} from "../../../../slices/kycSlice";
import verifiedIcon from "../../../../assets/images/verified.png";

const BankDetails = ({ setCurrentTab }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const dispatch = useDispatch();
  const initialValues = {
    acHolderName: "",
    acNumber: "",
    acType: "",
    ifsc: "",
    bankName: "",
    branch: "",
  };
  const selectedType = [
    { key: "", value: "Select" },
    { key: "1", value: "Current" },
    { key: "2", value: "Saving" },
  ];

  const validationSchema = Yup.object().shape({
    acHolderName: Yup.string().allowOneSpace().required("Required").nullable(),
    ifsc: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(Regex.ifscRegex, RegexMsg.ifscRegex)
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required")
      .nullable(),
    acNumber: Yup.string()
      .trim()
      .matches(Regex.accountNoRgex, RegexMsg.accountNoRgex)
      .required("Required")
      .nullable(),
    acType: Yup.string().required("Required").nullable(),
    branch: Yup.string().allowOneSpace().required("Required").nullable(),
    bankName: Yup.string().required("Required").nullable(),
  });

  const handleSubmit = () => {};

  const verifyBank = (ifsc, setFieldValue) => {
    dispatch(
      ifscValidation({
        ifsc_number: ifsc,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setFieldValue("branch", res?.payload?.branch);
        setFieldValue("isIfscVerified", true);
        setFieldValue("bankName", res?.payload?.bank);
        // toast.success(res?.payload?.message);
      } else {
        // setLoading(false)
        toast.error(res?.payload?.message);
      }
    });
  };

  const verifyAccount = (ifsc, acNumber, setFieldValue) => {
    dispatch(
      bankAccountVerification({
        account_number: acNumber,
        ifsc,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        const bankFirstName = res?.payload?.first_name?.trim();
        const bankLastName = res?.payload?.last_name?.trim();
        let fullName = `${bankFirstName} ${bankLastName}`;

        setFieldValue("acHolderName", fullName.trim());
        setFieldValue("isAccountNumberVerified", 1);
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
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
        {({
          values,
          errors,
          setFieldError,
          setFieldValue,
          setFieldTouched,
          handleChange,
        }) => (
          <Form>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 ">
                <label className="col-form-label mt-0 p-2">
                  IFSC Code<span className="text-danger"></span>
                </label>
                <div className="input-group">
                  <Field
                    text="text"
                    name="ifsc"
                    className="form-control"
                    // disabled={isEditableInput}
                    onChange={(e) => {
                      setFieldValue("ifsc", e.target.value);
                      setFieldValue("isIfscVerified", "");
                      console.log(e.target.value);
                      if (e.target.value.length === 11)
                        verifyBank(e.target.value, setFieldValue);
                    }}
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Account Number
                  <span className="text-danger"></span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="account_number"
                    className="form-control"
                    // disabled={isEditableInput}
                    onChange={(e) => {
                      setFieldValue("acNumber", e.target.value);
                      setFieldValue("isAccountNumberVerified", "");
                    }}
                  />
                  {values?.acNumber !== null &&
                  values?.acNumber !== "" &&
                  values?.acNumber !== undefined &&
                  values?.isAccountNumberVerified !== "" ? (
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
                          verifyAccount(
                            values.ifsc,
                            values.acNumber,
                            setFieldValue
                          );
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
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Account Holder Name<span></span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="acHolderName"
                  className="form-control"
                />
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Account Type<span></span>
                </label>

                <FormikController
                  control="select"
                  name="account_type"
                  options={selectedType}
                  className="form-select"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Bank Name<span className=""></span>
                </label>
                <FormikController
                  control="input"
                  name="bankName"
                  className="form-control"
                />
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Branch<span className=""></span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="branch"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mt-2">
                <button
                  className="cob-btn-primary btn text-white btn-sm"
                  type="submit"
                >
                  {/* // disabled={disable} > */}
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
                {/* } */}

                {/* {bankDetails?.resp?.status === true && */}
                <a
                  className="btn active-secondary btn-sm m-2"
                  onClick={() => setCurrentTab("upload_doc")}
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
export default BankDetails;
