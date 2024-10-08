import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Yup from "../../../../_components/formik/Yup";
import FormikController from "../../../../_components/formik/FormikController";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";
import toastConfig from "../../../../utilities/toastTypes";
import { getBankId } from "../../../../slices/kycSlice";
import {
  ifscValidation,
  bankAccountVerification,
} from "../../../../slices/kycValidatorSlice";
import { saveBankDetails } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import verifiedIcon from "../../../../assets/images/verified.png";

const BankDetails = ({ setCurrentTab }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [accountLoader, setAccountLoader] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
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
      .min(6, "IFSC must be at least 6 characters")
      .max(20, "IFSC must not exceed 20 characters")
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
    bank_id: Yup.number().required("Bank ID required"),
  });

  const handleSubmit = (values) => {
    setSubmitLoader(true);
    dispatch(
      saveBankDetails({
        account_holder_name: values.acHolderName,
        account_number: values.acNumber,
        ifsc_code: values.ifsc,
        bank_id: values.bank_id,
        account_type: selectedType.find((type) => type.key == values.acType)
          ?.value,
        branch: values.branch,
        login_id: basicDetailsResponse?.loginMasterId || 11477,
        modified_by: user?.loginId,
      })
    )
      .then((resp) => {
        setSubmitLoader(false);
        if (resp?.payload?.detail) {
          toastConfig.errorToast(resp?.payload?.detail);
        }

        if (resp?.payload?.status === true) {
          toastConfig.successToast(resp?.payload?.message);
          setShowNext(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitLoader(false);
      });
  };

  const verifyBank = async (ifsc, setFieldValue) => {
    const bankRes = await dispatch(
      ifscValidation({
        ifsc_number: ifsc,
      })
    );
    try {
      if (
        bankRes.meta.requestStatus === "fulfilled" &&
        bankRes.payload.status === true &&
        bankRes.payload.valid === true
      ) {
        setFieldValue("branch", bankRes?.payload?.branch);
        setFieldValue("isIfscVerified", true);
        setFieldValue("bankName", bankRes?.payload?.bank);
      } else {
        toast.error(bankRes?.payload?.message);
      }
    } catch (err) {
      toast.error(err?.payload?.bankName ?? "Error while fetching bank name");
    }
    dispatch(getBankId({ bank_name: bankRes?.payload?.bank }))
      .then((resp) => {
        if (resp?.payload?.length > 0) {
          setFieldValue("bank_id", resp?.payload[0]?.bankId);
        }
      })
      .catch((err) => {
        toast.error(err?.payload?.bankName ?? "Error while fetching bank");
      });
  };

  const verifyAccount = (ifsc, acNumber, setFieldValue) => {
    setAccountLoader(true);
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
        setAccountLoader(false);
      } else {
        toast.error(res?.payload?.message);
        setAccountLoader(false);
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
        {({ values, errors, setFieldError, setFieldValue, isValid }) => (
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
                      setFieldValue("ifsc", e.target.value.toUpperCase());
                      setFieldValue("isIfscVerified", "");
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
                    name="acNumber"
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
                      {accountLoader ? (
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
                            verifyAccount(
                              values.ifsc,
                              values.acNumber,
                              setFieldValue
                            )
                          }
                        >
                          Verify
                        </a>
                      )}
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
                  name="acType"
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
                  disabled={!isValid}
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

                {showNext && (
                  <a
                    className="btn active-secondary btn-sm m-2"
                    onClick={() => setCurrentTab("upload_doc")}
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
export default BankDetails;
