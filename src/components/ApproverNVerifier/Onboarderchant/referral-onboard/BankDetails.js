import { useEffect, useState } from "react";
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
import { getBankId, kycUserList } from "../../../../slices/kycSlice";
import {
  ifscValidation,
  bankAccountVerification,
} from "../../../../slices/kycValidatorSlice";
import { saveBankDetails } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import verifiedIcon from "../../../../assets/images/verified.png";

const BankDetails = ({ setCurrentTab, disableForm, setInfoModal }) => {
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [accountLoader, setAccountLoader] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const selectedType = [
    { key: "", value: "Select" },
    { key: "1", value: "Current" },
    { key: "2", value: "Saving" },
  ];
  const initialValues = {
    acHolderName: kycData?.merchant_account_details?.account_holder_name ?? "",
    acNumber: kycData?.merchant_account_details?.account_number ?? "",
    acType:
      selectedType.find(
        (type) => type.value == kycData?.merchant_account_details?.accountType
      )?.key ?? "",
    ifsc: kycData?.merchant_account_details?.ifsc_code ?? "",
    bankName: kycData?.merchant_account_details?.bankName ?? "",
    branch: kycData?.merchant_account_details?.branch ?? "",
    bank_id: kycData?.merchant_account_details?.bankId ?? "",
    isAccountNumberVerified: kycData?.merchant_account_details?.account_number
      ? 1
      : "",
  };
  useEffect(() => {
    if (basicDetailsResponse)
      dispatch(kycUserList({ login_id: basicDetailsResponse?.loginMasterId }));
  }, []);

  useEffect(() => {
    if (basicDetailsResponse && !kycData?.isEmailVerified) setInfoModal(true);
  }, []);

  const validationSchema = Yup.object().shape({
    acHolderName: Yup.string().allowOneSpace().required("Required").nullable(),
    ifsc: Yup.string()
      // .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
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
    isAccountNumberVerified: Yup.boolean().required(
      "Please verify the account number"
    ),
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
        login_id: kycData?.loginMasterId ?? basicDetailsResponse?.loginMasterId,
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
          dispatch(
            kycUserList({
              login_id:
                kycData?.loginMasterId ?? basicDetailsResponse?.loginMasterId,
              password_required: true,
            })
          );
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
        toast.error(bankRes?.payload?.message ?? bankRes.payload?.detail);
      }
    } catch (err) {
      toast.error(err?.payload?.bankName ?? "Error while fetching bank name");
    }
    dispatch(getBankId({ bank_name: bankRes?.payload?.bank }))
      .then((resp) => {
        if (resp?.payload?.length > 0) {
          setFieldValue("bank_id", resp?.payload[0]?.bankId);
        } else if (resp?.payload?.message)
          toastConfig.errorToast(resp.payload.detail);
      })
      .catch((err) => {
        toast.error(err?.payload?.detail ?? "Error while fetching bank");
      });
  };

  const verifyAccount = (ifsc, acNumber, setFieldValue) => {
    setAccountLoader(true);
    dispatch(
      bankAccountVerification({
        account_number: acNumber,
        ifsc,
      })
    )
      .then((res) => {
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
          toast.error(res?.payload?.message ?? res.payload);
          setAccountLoader(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setSubmitLoader(false);
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
        {({ values, errors, setFieldError, setFieldValue, isValid }) => {
          // console.log(values);
          return (
            <Form>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6 ">
                  <label className="col-form-label mt-0 p-2">
                    IFSC Code
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <Field
                      text="text"
                      name="ifsc"
                      className="form-control"
                      disabled={disableForm}
                      onChange={(e) => {
                        setFieldValue("ifsc", e.target.value.toUpperCase());
                        setFieldValue("isIfscVerified", "");
                        setFieldValue("bank_id", "");
                      }}
                    />
                  </div>
                  <ErrorMessage name={"ifsc"}>
                    {(msg) => <p className="text-danger">{msg}</p>}
                  </ErrorMessage>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label className="col-form-label mt-0 p-2">
                    Account Number
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <Field
                      type="number"
                      name="acNumber"
                      className="form-control"
                      disabled={disableForm}
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
                            onClick={() => {
                              verifyAccount(
                                values.ifsc,
                                values.acNumber,
                                setFieldValue
                              );
                              verifyBank(values.ifsc, setFieldValue);
                            }}
                          >
                            Verify
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                  <ErrorMessage name={"acNumber"}>
                    {(msg) => <p className="text-danger">{msg}</p>}
                  </ErrorMessage>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label className="col-form-label mt-0 p-2">
                    Account Holder Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <FormikController
                    control="input"
                    type="text"
                    name="acHolderName"
                    className="form-control"
                    disabled={disableForm}
                  />
                </div>

                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label className="col-form-label mt-0 p-2">
                    Account Type
                    <span style={{ color: "red" }}>*</span>
                  </label>

                  <FormikController
                    control="select"
                    name="acType"
                    options={selectedType}
                    disabled={disableForm}
                    // onChange={(e) => console.log(e.target.value)}
                    className="form-select"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label className="col-form-label mt-0 p-2">
                    Bank Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="input-group">
                    <FormikController
                      control="input"
                      name="bankName"
                      className="form-control"
                      disabled={disableForm}
                    />
                    {values?.bank_id !== "" && (
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
                    )}
                  </div>
                </div>

                <div className="col-sm-12 col-md-12 col-lg-6">
                  <label className="col-form-label mt-0 p-2">
                    Branch
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <FormikController
                    control="input"
                    type="text"
                    name="branch"
                    className="form-control"
                    disabled={disableForm}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 mt-2">
                  <button
                    className="cob-btn-primary btn text-white btn-sm"
                    type="submit"
                    disabled={!isValid || disableForm}
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
          );
        }}
      </Formik>
    </div>
  );
};
export default BankDetails;
