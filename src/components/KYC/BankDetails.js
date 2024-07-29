import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Yup from "../../_components/formik/Yup";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  kycBankNames,
  saveMerchantBankDetais,
  ifscValidation,
  bankAccountVerification,
  getBankId,
  kycUserList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";


function BankDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const merchantloginMasterId = props.merchantloginMasterId;

  // const { role } = props;
  const dispatch = useDispatch();

  const { kyc, auth } = useSelector((state) => state);

  const { KycTabStatusStore } = kyc;
  const KycList = kyc?.kycUserList;
  const VerifyKycStatus = KycTabStatusStore?.settlement_info_status;
  const { user } = auth;

  const [disable, setIsDisable] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonText = "Save and Next";
  const [data, setData] = useState([]);
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;

  const { loginId } = user;

  const selectedType = [
    { key: "", value: "Select" },
    { key: "1", value: "Current" },
    { key: "2", value: "Saving" },
  ];




  const initialValues = {
    account_holder_name: KycList?.merchant_account_details?.account_holder_name ? KycList?.merchant_account_details?.account_holder_name : "",
    account_number: KycList?.merchant_account_details?.account_number,
    oldAccountNumber: KycList?.merchant_account_details?.account_number,
    ifsc_code: KycList?.merchant_account_details?.ifsc_code,
    oldIfscCode: KycList?.merchant_account_details?.ifsc_code,
    bank_id: KycList?.merchant_account_details?.bankId, // change stste
    account_type: KycList?.merchant_account_details?.accountType === "Current" ? 1 : KycList?.merchant_account_details?.accountType === "Saving" ? 2 : "",
    branch: KycList?.merchant_account_details?.branch,
    isAccountNumberVerified: KycList?.merchant_account_details?.account_number !== null ? "1" : "",
  };


  const validationSchema = Yup.object().shape({
    account_holder_name: Yup.string()
      .trim()
      .allowOneSpace()
      .required("Required")
      .nullable(),
    ifsc_code: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(IFSCRegex, "Your IFSC code is Invalid and must be in capital letters")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required")
      .nullable(),
    account_number: Yup.string()
      .allowOneSpace()
      .matches(AccountNoRgex, "Your Account Number is Invalid")
      .required("Required")
      .nullable(),
    account_type: Yup.string()
      .required("Required")
      .nullable(),
    branch: Yup.string()
      .trim()
      .required("Required")
      .nullable(),
    bank_id: Yup.string()
      .required("Required")
      .nullable(),
    isAccountNumberVerified: Yup.string().required("You need to verify Your Account Number"),
    oldIfscCode: Yup.string()
      .oneOf([Yup.ref("ifsc_code"), null], "IFSC code is not verified")
      .required("IFSC code is not verified")
      .nullable(),
    oldAccountNumber: Yup.string()
      .oneOf([Yup.ref("account_number"), null],
        "You need to verify Your Account Number")
      .required("You need to verify Your Account Number")
      .nullable(),
  });

  const ifscValidationNo = (values, setFieldValue) => {
    setLoading(true)
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
          // console.log(res?.payload?.bank_name)
          setLoading(false)
          const postData = { bank_name: res?.payload?.bank_name };
          // console.log(postData)
          dispatch(getBankId(postData)).then(resp => {
            if (resp?.payload?.length > 0) {
              setFieldValue("bank_id", resp?.payload[0]?.bankId)
            }

            // console.log(resp?.payload?.bankId)
          }).catch(err => {
            // console.log(err?.payload?.bankName)
          })
          setFieldValue("branch", res?.payload?.branch)
          setFieldValue("ifsc_code", values)
          setFieldValue("oldIfscCode", values)
          // toast.success(res?.payload?.message);
        } else {
          setLoading(false)
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const bankAccountValidate = (values, ifscCode, setFieldValue) => {
    setLoading(true)
    dispatch(
      bankAccountVerification({
        account_number: values,
        ifsc: ifscCode,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        setLoading(false)
        // console.log(res?.payload)
        // setFieldValue()
        // check the space 
        const bankFirstName = res?.payload?.first_name?.trim()
        const bankLastName = res?.payload?.last_name?.trim()
        let fullName = `${bankFirstName} ${bankLastName}`


        setFieldValue("account_holder_name", fullName.trim());

        setFieldValue("account_number", values);
        setFieldValue("oldAccountNumber", values);
        setFieldValue("isAccountNumberVerified", 1);
        toast.success(res?.payload?.message);

        ifscValidationNo(ifscCode, setFieldValue);
      } else {
        setLoading(false)
        toast.error(res?.payload?.message);
      }
    });
  };

  //---------------GET ALL BANK NAMES DROPDOWN--------------------

  // TODO: remove the api 
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

    // KycList?.ifscCode ? isIfscVerifed("1") : isIfscVerifed("");
  }, []);


  // TODO: remove the bank list api and update with the response from the bank name api
  const onSubmit = (values) => {
    let selectedChoice = values.account_type.toString() === "1" ? "Current" : values.account_type.toString() === "2" ? "Saving" : "";

    setIsDisable(true);
    dispatch(
      saveMerchantBankDetais({
        account_holder_name: values.account_holder_name,
        account_number: values.account_number,
        ifsc_code: values.ifsc_code,
        bank_id: values.bank_id,
        account_type: selectedChoice,
        branch: values.branch,
        login_id: merchantloginMasterId,
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
        dispatch(kycUserList({ login_id: merchantloginMasterId }));
        dispatch(GetKycTabsStatus({ login_id: merchantloginMasterId }));

      } else {
        toast.error(res?.payload?.detail);
        setIsDisable(false);
      }
    });

  };



  const checkInputIsValid = (err, val, setErr, setFieldTouched, key, setFieldValue) => {
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

    // console.log("key",key)
    if (!hasErr && isValidVal && val[key] !== "" && key === "ifsc_code") {
      ifscValidationNo(val[key]);
    }

    if (!hasErr && isValidVal && val[key] !== "" && key === "account_number") {
      const ifscCodeVal = val?.ifsc_code;
      bankAccountValidate(val[key], ifscCodeVal, setFieldValue);
    }
  };

  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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
            {console.log(errors)}
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6 ">
                <label className="col-form-label mt-0 p-2">
                  IFSC Code<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    text="text"
                    name="ifsc_code"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified"}
                    readOnly={false}
                  />

                  {(values?.ifsc_code !== null && loading) &&
                    <div className="input-group-append">
                      <button className="btn cob-btn-primary text-white mb-0 btn-sm" type="button"
                        disabled={loading}
                      >

                        <span className="spinner-border spinner-border-sm" role="status">
                          <span className="sr-only">Loading...</span>
                        </span>

                      </button>
                    </div>
                  }

                  {/* if found any error in validation */}
                  {/* {console.log("errors",errors)} */}
                  {(values?.ifsc_code !== null && values?.ifsc_code !== undefined && !errors.hasOwnProperty("oldAccountNumber") && !errors.hasOwnProperty("oldIfscCode")) &&
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
                  }
                </div>

                {
                  <ErrorMessage name="ifsc_code">
                    {(msg) => (
                      <span className="errortxt- text-danger">
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
                  Business Account Number
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group">

                  <Field
                    type="text"
                    name="account_number"
                    className="form-control"
                    readOnly={false}
                    disabled={VerifyKycStatus === "Verified"}
                  />

                  {/* if both values are same then display verified icon */}
                  {(values?.account_number !== null && values?.account_number !== undefined && !errors.hasOwnProperty("oldAccountNumber") && !errors.hasOwnProperty("oldIfscCode")) && <span className="success input-group-append">
                    <img
                      src={gotVerified}
                      alt=""
                      title=""
                      width={"20px"}
                      height={"20px"}
                      className="btn-outline-secondary"
                    />
                  </span>
                  }

                  {/* if found any error in validation */}
                  {/* {console.log("values",values)} */}
                  {(values?.ifsc_code !== null && (errors.hasOwnProperty("oldAccountNumber") || errors.hasOwnProperty("oldIfscCode"))) &&
                    <div className="input-group-append">
                      <button className="btn cob-btn-primary text-white mb-0 btn-sm" type="button"
                        disabled={loading}
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "account_number",
                            setFieldValue
                          );
                        }}>
                        {loading ?
                          <span className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                          :
                          "Verify"
                        }
                      </button>
                    </div>
                  }

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

                {errors?.oldAccountNumber && (
                  <p className="notVerifiedtext- text-danger imp_css">
                    {errors?.oldAccountNumber}
                  </p>
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
                  readOnly={true}
                  disabled={true}
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
                  className="form-select"
                  readOnly={false}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />

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
                  readOnly={true}
                  disabled={true}
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
                  readOnly={true}
                  disabled={true}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {VerifyKycStatus === "Verified" ? <></> : (
                  <button
                    disabled={disable}
                    className="float-lg-right cob-btn-primary text-white btn-sm border-0 mt-4"
                    type="submit"
                  >
                    {disable && <>
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    </>}
                    {buttonText}
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
export default BankDetails;
