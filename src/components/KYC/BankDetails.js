import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  kycBankNames,
  saveMerchantBankDetais,
  verifyKycEachTab,
  ifscValidation,
  bankAccountVerification,
  getBankId,
  kycUserList,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";

function BankDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const { role, kycid } = props;
  const dispatch = useDispatch();

  const { kyc, auth } = useSelector((state) => state);

  const { KycTabStatusStore, GetBankid, allTabsValidate } = kyc;
  const KycList = kyc?.kycUserList;
  const VerifyKycStatus = KycTabStatusStore?.settlement_info_status;
  const bankDetailsById = GetBankid;

  const { user } = auth;
  const AccfirstName =
    allTabsValidate?.BankDetails?.accountValidation?.first_name;
  const AcclastName =
    allTabsValidate?.BankDetails?.accountValidation?.last_name;
  const branch = allTabsValidate?.BankDetails?.IfscValidation?.branch;

  let accHolderName = `${AccfirstName} ${AcclastName}`;

  const [readOnly, setReadOnly] = useState(false);

  const [ifscVerifed, isIfscVerifed] = useState("");
  const [selectedvalue, setSelectedvalue] = useState("");
  const [disable, setIsDisable] = useState(false);

  const [buttonText, setButtonText] = useState("Save and Next");

  const [data, setData] = useState([]);
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;

  const { loginId } = user;

  const selectedType = [
    { key: "", value: "Select"},
    { key: "1", value: "Current" },
    { key: "2", value: "Saving" },
  ];

  let selectedChoice = selectedvalue === "1" ? "Current" : selectedvalue === "2" ? "Saving" : "";

  const initialValues = {
    account_holder_name:
      accHolderName.length > 2
        ? accHolderName
        : KycList?.accountHolderName
        ? KycList?.accountHolderName
        : "",
    account_number: KycList?.accountNumber,
    oldAccountNumber: KycList?.accountNumber,
    ifsc_code: KycList?.ifscCode,
    oldIfscCode: KycList?.ifscCode,
    bank_id:
      bankDetailsById?.length > 0
        ? bankDetailsById[0]?.bankId
        : KycList?.merchant_account_details?.bankId, // change stste
    account_type: KycList?.merchant_account_details?.accountType,
    branch: branch?.length > 2 ? branch : KycList?.merchant_account_details?.branch,

    isAccountNumberVerified: KycList?.accountNumber !== null ? "1" : "",
  };


  const validationSchema = Yup.object({
    account_holder_name: Yup.string()
      .trim()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    ifsc_code: Yup.string()
      .trim()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(IFSCRegex, "Your IFSC Number is Invalid")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required")

      .nullable(),
    account_number: Yup.string()
      .trim()
      .matches(AccountNoRgex, "Your Account Number is Invalid")
      .required("Required")
      .nullable(),

    account_type: Yup.string()
      .required("Required")
      .nullable(),
    branch: Yup.string()
      .trim()
      .required("Required")
      .matches(Regex.addressForSpecific, "Branch Name is not in valid format")
      .nullable(),
    bank_id: Yup.string()
      .required("Required")
      .nullable(),
    isAccountNumberVerified: Yup.string().required(
      "You need to verify Your Account Number"
    ),
    oldIfscCode: Yup.string()
      .oneOf([Yup.ref("ifsc_code"), null], "You need to verify Your IFSC Code")
      .required("You need to verify Your IFSC Code")
      .nullable(),
    oldAccountNumber: Yup.string()
      .oneOf(
        [Yup.ref("account_number"), null],
        "You need to verify Your Account Number"
      )
      .required("You need to verify Your Account Number")
      .nullable(),
  });

  const ifscValidationNo = (values) => {
    if (values?.length !== 0 || typeof values?.length !== "undefined") {
      dispatch(
        ifscValidation({
          ifsc_number: values,
        })
      ).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true &&
          res.payload.valid === true
        ) {
          const postData = { bank_name: res?.payload?.bank };
          dispatch(getBankId(postData));
          toast.success(res?.payload?.message);
        } else {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const bankAccountValidate = (values, ifsc) => {
    dispatch(
      bankAccountVerification({
        account_number: values,
        ifsc: ifsc,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  //---------------GET ALL BANK NAMES DROPDOWN--------------------

  useEffect(() => {
    dispatch(kycBankNames())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "bankId",
          "bankName",
          resp.payload
        );
        setData(data);
      })

      .catch((err) => console.log(err));

    KycList?.ifscCode ? isIfscVerifed("1") : isIfscVerifed("");
  }, []);

  // ------------------------------------------

  const onSubmit = (values) => {
    if (role.merchant) {
      setIsDisable(true);
      dispatch(
        saveMerchantBankDetais({
          account_holder_name: values.account_holder_name,
          account_number: values.account_number,
          ifsc_code: values.ifsc_code,
          bank_id: values.bank_id,
          account_type: selectedChoice,
          branch: values.branch,
          login_id: loginId,
          modified_by: loginId,
        })
      ).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          toast.success(res?.payload?.message);
          setTab(5);
          setIsDisable(false);
          setTitle("DOCUMENTS UPLOAD");
          dispatch(kycUserList({ login_id: loginId }));
        } else {
          toast.error(res?.payload?.message);
          setIsDisable(false);
        }
      });
    }
    // else if (role.verifier) {
    //   const veriferDetails = {
    //     login_id: kycid,
    //     settlement_info_verified_by: loginId,
    //   };
    //   dispatch(verifyKycEachTab(veriferDetails))
    //     .then((resp) => {
    //       resp?.payload?.settlement_info_status &&
    //         toast.success(resp?.payload?.settlement_info_status);
    //       resp?.payload?.detail && toast.error(resp?.payload?.detail);
    //     })
    //     .catch((e) => {
    //       toast.error("Try Again Network Error");
    //     });
    // }
  };

  // useEffect(() => {
  //   if (role.approver) {
  //     setReadOnly(true);
  //     setButtonText("Approve and Next");
  //   } else if (role.verifier) {
  //     setReadOnly(true);
  //     setButtonText("Verify and Next");
  //   }
  // }, [role]);

  const checkInputIsValid = (err, val, setErr, setFieldTouched, key) => {
    const hasErr = err.hasOwnProperty(key);

    const fieldVal = val[key];
    let isValidVal = true;
    if (fieldVal === null || fieldVal === undefined) {
      isValidVal = false;
      setFieldTouched(key, true);
    }

    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }

    if (!hasErr && isValidVal && val[key] !== "" && key === "ifsc_code") {
      ifscValidationNo(val[key]);
    }

    if (!hasErr && isValidVal && val[key] !== "" && key === "account_number") {
      const ifscCodeVal = val?.ifsc_code;
      bankAccountValidate(val[key], ifscCodeVal);
    }
  };

  return (
    <div className="col-md-12 col-md-offset-4" style={{ width: "100%" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          setFieldValue,
          initialValues,
          errors,
          setFieldError,
          setFieldTouched,
          handleChange,
        }) => (
          <Form>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 ">
                <label className="col-form-label mt-0 p-2">
                  IFSC Code<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="ifsc_code"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />

                  {KycList?.ifscCode !== null &&
                  !errors.hasOwnProperty("ifsc_code") &&
                  !errors.hasOwnProperty("oldIfscCode") ? (
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
                    <div className="position-sticky pull-right- otpbtn input-group-append">
                      <a
                        href={() => false}
                        className="btn btnbackground text-white btn-sm optbtn- btn-outline-secondary"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "ifsc_code"
                          );
                        }}
                      >
                        Verify
                      </a>
                    </div>
                  )}
                </div>
                {
                  <ErrorMessage name="ifsc_code">
                    {(msg) => (
                      <span className="abhitest- errortxt- text-danger">
                        {msg}
                      </span>
                    )}
                  </ErrorMessage>
                }

                {errors?.oldIfscCode && (
                  <span className="notVerifiedtext- text-danger imp_css">
                    {errors?.oldIfscCode}
                  </span>
                )}
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Business Account Number{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="account_number"
                    className="form-control"
                    readOnly={readOnly}
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                  />

                  {KycList?.accountNumber !== null &&
                  values?.account_number === KycList?.accountNumber &&
                  !errors.hasOwnProperty("account_number") &&
                  !errors.hasOwnProperty("oldAccountNumber") ? (
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
                  ) : !errors.hasOwnProperty("oldIfscCode") &&
                    !errors.hasOwnProperty("ifsc_code") ? (
                    <span className="position-sticky pull-right- otpbtn input-group-append">
                      <a
                        href={() => false}
                        className="btn btnbackground text-white btn-sm optbtn- btn-outline-secondary"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "account_number"
                          );
                        }}
                      >
                        Verify
                      </a>
                    </span>
                  ) : (
                    <> </>
                  )}
                </div>
                {
                  <ErrorMessage name="account_number">
                    {(msg) => (
                      <span className="abhitest- errortxt- text-danger">
                        {msg}
                      </span>
                    )}
                  </ErrorMessage>
                }
                <br />
                {errors?.oldAccountNumber && (
                  <span className="notVerifiedtext- text-danger">
                    {errors?.oldAccountNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Account Holder Name<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="account_holder_name"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Account Type<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="select"
                  name="account_type"
                  options={selectedType}
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
                {handleChange(
                  "account_type",
                  setSelectedvalue(values?.account_type)
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Bank Name<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="select"
                  name="bank_id"
                  className="form-control"
                  options={data}
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>

              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Branch<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="branch"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
              </div>
            </div>

            <div className="my-5- p-2 w-100 pull-left">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                  {VerifyKycStatus === "Verified" ? null : (
                    <button
                      disabled={disable}
                      className="btn float-lg-right btnbackground text-white"
                      type="submit"
                    >
                      {" "}
                      {buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
export default BankDetails;
