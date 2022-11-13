import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
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

  // console.log(AccfirstName,"=====>")
  let accHolderName = `${AccfirstName} ${AcclastName}`;

  // console.log("Account Holder Name ===>",accHolderName.length)

  const [readOnly, setReadOnly] = useState(false);
  const [checkIfscChange, setCheckIfscChange] = useState("");
  const [ifscVerifed, isIfscVerifed] = useState("");
  const [accountNumberVerifed, isAccountNumberVerifed] = useState("");
  const [buttonText, setButtonText] = useState("Save and Next");

  const [data, setData] = useState([]);
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;

  const { loginId } = user;

  const initialValues = {
    account_holder_name:
      accHolderName.length > 2
        ? accHolderName
        : KycList?.accountHolderName
        ? KycList?.accountHolderName
        : "",
    account_number: KycList?.accountNumber,
    oldAccountNumber: KycList?.accountNumber,
    // confirm_account_number: KycList?.accountNumber,
    ifsc_code: KycList?.ifscCode,
    oldIfscCode: KycList?.ifscCode,
    bank_id:
      bankDetailsById?.length > 0
        ? bankDetailsById[0]?.bankId
        : KycList?.merchant_account_details?.bankId, // change stste
    account_type: KycList?.merchant_account_details?.accountType,

    branch:
      branch?.length > 2 ? branch : KycList?.merchant_account_details?.branch,
    // isIFSCCode: KycList?.ifscCode !== null ? "1" : "",
    // isIFSCCode: ifscVerifed,
    isAccountNumberVerified: KycList?.accountNumber !== null ? "1" : "",
  };
  //   previousField: yup.bool(),
  // field: yup.string().test('required', 'please provide value',
  //   (value, ctx) => !ctx.parent.previousField)
  const validationSchema = Yup.object({
    account_holder_name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    ifsc_code: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(IFSCRegex, "Your IFSC Number is Invalid")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required")

      .nullable(),
    account_number: Yup.string()
      .matches(AccountNoRgex, "Your Account Number is Invalid")
      .required("Required")
      .nullable(),
    // confirm_account_number: Yup.string()
    //   .oneOf([Yup.ref("account_number"), null], "Account Number  must match")
    //   .required("Confirm Account Number Required").nullable(),

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
    // console.log("Values ========>",values)
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
          // console.log("<==== IFSC Validation Response ===>",res)
          // setCheckIfscChange(values)
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
    // console.log("Values ========>",values)
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
        // console.log("This is the response", res);
        // console.log(res?.payload?.ifsc[0])
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  // const checkValueChange = (val) => {
  //   if()
  // }
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

    // setCheckIfscChange update data from the KYC state
    // setCheckIfscChange(KycList?.ifscCode)
    KycList?.ifscCode ? isIfscVerifed("1") : isIfscVerifed("");
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
          toast.success(res?.payload?.message);
          setTab(5);
          setTitle("DOCUMENTS UPLOAD");
          dispatch(kycUserList({ login_id: loginId }))

        } else {
          toast.error(res?.payload?.message);
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

  //  const formikHandlerChange = (input, oldValue, newVal, setFormikVal) => {
  //   //
  //     if (input === "ifsc_code") {
  //       if (newVal?.length === 11) {
  //         if(oldValue!==newVal){
  //           // setFormikVal("isIFSCCode","")
  //           // setFormikVal(input,newVal)
  //           // setFormikVal("isIFSCCode","")
  //           // isIfscVerifed("")
  //           console.log("set blank = =")
  //         }else{
  //           // isIfscVerifed("1")

  //           // setFormikVal("isIFSCCode","1")
  //           console.log("set blank = 1")
  //         }
  //       }
  //     }
  //   }

  // useEffect(() => {
  //    setTimeout(() => {
  //     isIfscVerifed("")
  //    }, 2000);
  // }, [])

  // {console.log("IFSC PAYLODE VALUE =====>",checkIfscChange)}

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
            {/* {console.log("values", values)}
            {console.log("initialValues", initialValues)}
            {console.log("errors", errors)} */}
            <div class="col-sm-12 col-md-12 col-lg-6 ">
              <label class="col-form-label mt-0 p-2">
                  IFSC Code<span style={{ color: "red" }}>*</span>
                
              </label>
             
                <FormikController
                  control="input"
                  type="text"
                  name="ifsc_code"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}

                  readOnly={readOnly}
                />

                {/* {handleChange(
                  "ifsc_code",
                  formikHandlerChange("ifsc_code", values?.ifsc_code, KycList?.ifscCode, setFieldValue)
                )} */}
              
              {/* {console.log("initialValues.isIFSCCode",initialValues.isIFSCCode)} */}
              {/* {console.log("checkIfscChange",checkIfscChange)} */}
              {/* {console.log("ifsc_code",values.ifsc_code)} */}
              {/* obj.hasOwnProperty("key") */}
              {/* && values?.ifsc_code === KycList?.ifscCode */}
              {KycList?.ifscCode !== null &&
              !errors.hasOwnProperty("ifsc_code") &&
              !errors.hasOwnProperty("oldIfscCode") ? (
                // {initialValues?.isIFSCCode === "1" && values?.ifsc_code === KycList?.ifscCode ? (
                <span className="success">
                  <img src={gotVerified} alt="" title="" width="26" />
                </span>
              ) : (
                (// values.ifsc_code !== checkIfscChange && values.ifsc_code === "" ?
                <div class="position-sticky pull-right- otpbtndetail">
                  <a
                    href={() => false}
                    className="btn btnbackground text-white btn-sm panbtn "
                    onClick={() => {
                      // {console.log("Values =======>",values)}
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
                </div> /*: <></>*/ /*: <></>*/ /*: <></>*/ /*: <></>*/)
                // : <></>
              )}

              {/* {console.log("eorro",errors)}
              {console.log(errors?.isIFSCCode)} */}
              {errors?.oldIfscCode && (
                <span className="notVerifiedtext- text-danger">
                  {errors?.oldIfscCode}
                </span>
              )}
            </div>

            <div class="col-sm-12 col-md-12 col-lg-6">
              <label class="col-form-label mt-0 p-2">Account Number <span style={{ color: "red" }}>*</span></label>
             
                <FormikController
                  control="input"
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
                <span className="success">
                  <img src={gotVerified} alt="" title="" width="26" />
                </span>
              ) : !errors.hasOwnProperty("oldIfscCode") &&
                !errors.hasOwnProperty("ifsc_code") ? (
                <div class="position-sticky pull-right- otpbtnaccnt">
                  <a
                    href={() => false}
                    className="btn btnbackground text-white btn-sm panbtn "
                    onClick={() => {
                      // console.log("Values ==>>><<<",values)
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
                </div>
              ) : (
                <> </>
              )}

              {errors?.oldAccountNumber && (
                <span className="notVerifiedtext- text-danger">
                  {errors?.oldAccountNumber}
                </span>
              )}
            </div>

            <div class="col-sm-12 col-md-12 col-lg-6">
              <label class="col-form-label mt-0 p-2">Account Holder Name<span style={{ color: "red" }}>*</span></label>
                <FormikController
                  control="input"
                  type="text"
                  name="account_holder_name"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                />
            </div>

            <div class="col-sm-12 col-md-12 col-lg-6">
              <label class="col-form-label mt-0 p-2">Account Type<span style={{ color: "red" }}>*</span></label>
              <FormikController
                  control="input"
                  type="text"
                  name="account_type"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}/>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-6">
              <label class="col-form-label mt-0 p-2">Bank Name<span style={{ color: "red" }}>*</span></label>
              <FormikController
                  control="select"
                  name="bank_id"
                  className="form-control"
                  options={data}
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}/>
            </div>

            <div class="col-sm-12 col-md-12 col-lg-6">
              <label class="col-form-label mt-0 p-2">Branch<span style={{ color: "red" }}>*</span></label>
              <FormikController
                  control="input"
                  type="text"
                  name="branch"
                  className="form-control"
                  readOnly={readOnly}
                  disabled={VerifyKycStatus === "Verified" ? true : false}/>
            </div>

            <div class="my-5- p-2 w-100 pull-left">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />

              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12 col-form-label">
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
