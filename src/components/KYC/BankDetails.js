import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import axios from "axios";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  kycBankNames,
  saveMerchantBankDetais,
  verifyKycEachTab,
  ifscValidation,
  bankAccountVerification
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

function BankDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const { role, kycid } = props;
  const dispatch = useDispatch();

  const KycList = useSelector((state) => state.kyc.kycUserList);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.KycTabStatusStore.settlement_info_status
  );

  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");
  const [ifsc,setIfsc] = useState("");
  // console.log(VerifyKycStatus,"<==STATUS==>")

  //  console.log(KycList ,"====================>")

  const [data, setData] = useState([]);
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/


  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const initialValues = {
    account_holder_name: KycList?.accountHolderName,
    account_number: KycList?.accountNumber,
    confirm_account_number: KycList?.accountNumber,
    ifsc_code: KycList?.ifscCode,
    bank_id: KycList?.merchant_account_details?.bankId,
    account_type: KycList?.bankName,
    branch: KycList?.merchant_account_details?.branch,
    isIFSCCode: KycList?.ifscCode !== null ? "1" : "",
    isAccountNumberVerified: KycList?.accountNumber !== null ? "1" : ""
  };
  const validationSchema = Yup.object({
    account_holder_name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    account_number: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(AccountNoRgex,"Your Account Number is Invalid")
      .required("Required")
      .nullable(),
    // confirm_account_number: Yup.string()
    //   .oneOf([Yup.ref("account_number"), null], "Account Number  must match")
    //   .required("Confirm Account Number Required").nullable(),
    ifsc_code: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(IFSCRegex,"Your IFSC Number is Invalid")
      .min(6, 'Username must be at least 6 characters')
      .max(20, 'Username must not exceed 20 characters')
      .required("Required")

      .nullable(),
    account_type: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    branch: Yup.string()
      .required("Required")
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .nullable(),
    bank_id: Yup.string()
      .required("Required")
      .nullable(),
      isIFSCCode: Yup.string().required("You need to verify Your IFSC Code"),
      isAccountNumberVerified:Yup.string().required("You need to verify Your Account Number")
  });


  const ifscValidationNo= (values) => {
    // console.log("Values ========>",values)
    if(values?.length !== 0 || typeof(values?.length) !== 'undefined' ) {
    dispatch(ifscValidation({
        ifsc_number: values
        })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" && res.payload.status === true && res.payload.valid === true) {
        // console.log("This is the response", res);
        toast.success(res.payload.message);
      } else {
        toast.error("Your IFSC Number is not Valid.");
      }

    })
  }

  }

  
  const bankAccountValidate = (values) => {
    // console.log("Values ========>",values)
    dispatch(bankAccountVerification({
      account_number: values,
      ifsc: ""
        })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" && res.payload.status === true && res.payload.valid === true) {
        // console.log("This is the response", res);
        toast.success(res.payload.message);
      } else {
        toast.error("Your IFSC Number is not Valid.");
      }

    })
  

  }

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
  }, []);

  // ------------------------------------------

  const onSubmit = (values) => {
    if (role.merchant) {
      dispatch(
        saveMerchantBankDetais({
          account_holder_name: values.account_holder_name,
          account_number: values.account_number,
          ifsc_code: values.ifsc_code,
          bank_id: values.bank_id,
          account_type: values.account_type,
          branch: values.branch,
          login_id: loginId,
          modified_by: loginId,
        })
      ).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          // console.log(res)
          // console.log("This is the response", res);
          toast.success(res.payload.message);
          setTab(5);
          setTitle("DOCUMENTS UPLOAD");
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      });
    } else if (role.verifier) {
      const veriferDetails = {
        login_id: kycid,
        settlement_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.settlement_info_status &&
            toast.success(resp?.payload?.settlement_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
      setButtonText("Approve and Next");
    } else if (role.verifier) {
      setReadOnly(true);
      setButtonText("Verify and Next");
    }
  }, [role]);

  const checkInputIsValid = (err, val, setErr, key) => {
    const hasErr = err.hasOwnProperty(key);
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }
    if (!hasErr && val[key] !== "" && key === "ifsc_code") {
      ifscValidationNo(val[key]);
    }
    if (!hasErr && val[key] !== "" && key === "account_number") {
      bankAccountValidate(val[key]);
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
        {(formik) => (
          <Form>
            {/* {console.log(formik)} */}
            <div class="form-group row">
            <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  IFSC Code<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="ifsc_code"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
              {formik?.initialValues?.isIFSCCode === "1" ? (
                <span>
                <p className="panVerfied text-success">
                  Verified
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </p>
              </span> 
              ) : (
              <div class="position-sticky pull-right">
                <a
                  href={() => false}
                  className="btn btnbackground text-white btn-sm panbtn"
                  style={{
                    boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                  }}
                  onClick={() => {
                    checkInputIsValid(
                      formik.errors,
                      formik.values,
                      formik.setFieldError,
                      "ifsc_code"
                    );
                  }}
                >
                  Verify
                </a>
              </div>
                )}
                  {formik?.errors?.isIFSCCode && (
                  <span className="notVerifiedtext text-danger">
                    {formik?.errors?.isIFSCCode}
                  </span>
                  )}
            </div>

            <div class="form-group row">
            <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Account Number <span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="account_number"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
              {formik?.initialValues?.isAccountNumberVerified === "1" ? (
                <span>
                <p className="panVerfied text-success">
                  Verified
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </p>
              </span> 
              ) : (
              <div class="position-sticky pull-right">
                <a
                  href={() => false}
                  className="btn btnbackground text-white btn-sm panbtn"
                  style={{
                    boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                  }}
                  onClick={() => {

                    // console.log("Values ==>>><<<",formik?.values)
                    checkInputIsValid(
                      formik.errors,
                      formik.values,
                      formik.setFieldError,
                      "account_number"
                    );
                  }}
                >
                  Verify
                </a>
              </div>
                )}
                  {formik?.errors?.isAccountNumberVerified && (
                  <span className="notVerifiedtext text-danger">
                    {formik?.errors?.isAccountNumberVerified}
                  </span>
                  )}
              </div>

            <div class="form-group row">
            <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Account Holder Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>

              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="account_holder_name"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div class="form-group row">
            <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Account Type<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="account_type"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
            
            </div>

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Bank Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="select"
                  name="bank_id"
                  className="form-control"
                  options={data}
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div class="form-group row">
            <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Branch<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7 ">
                <FormikController
                  control="input"
                  type="text"
                  name="branch"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
         
             
            </div>

            <div class="my-5 p-2">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />

              <div class="row">
                <div class="col-sm-11 col-md-11 col-lg-11 col-form-label">
                  {VerifyKycStatus === "Verified" ? null : (
                    <button
                      className="btn float-lg-right"
                      type="submit"
                      style={{ backgroundColor: "#0156B3" }}
                    >
                      <h4 className="text-white text-kyc-sumit">
                        {" "}
                        {buttonText}
                      </h4>
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
