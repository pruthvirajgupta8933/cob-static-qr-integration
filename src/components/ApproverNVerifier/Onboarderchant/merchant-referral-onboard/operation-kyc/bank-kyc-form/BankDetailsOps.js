import React, {useEffect, useState} from 'react'
import {Formik, Field, Form, ErrorMessage} from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import {Regex, RegexMsg} from '../../../../../../_components/formik/ValidationRegex';
import verifiedIcon from "../../../../../../assets/images/verified.png";

import {
    bankAccountVerification,
    getBankId,
    ifscValidation,
    kycDetailsByMerchantLoginId
} from '../../../../../../slices/kycSlice';
import {toast} from 'react-toastify';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBankList} from '../../../../../../services/approver-dashboard/merchantReferralOnboard.service';
import {convertToFormikSelectJson} from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import {saveBankDetails} from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import toastConfig from "../../../../../../utilities/toastTypes";


function BankDetailsOps({setCurrentTab}) {

    const [loading, setLoading] = useState(false);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [bankList, setBankList] = useState([]);
    const dispatch = useDispatch();
    const {auth, merchantReferralOnboardReducer, kyc} = useSelector(state => state)

    const merchantLoginId = merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId
    const {bankDetails} = merchantReferralOnboardReducer
    const {merchantKycData} = kyc

    const initialValues = {
        account_holder_name: merchantKycData?.merchant_account_details?.account_holder_name ?? "",
        account_number: merchantKycData?.merchant_account_details?.account_number ?? "",
        ifsc_code: merchantKycData?.merchant_account_details?.ifsc_code ?? "",
        bank_id: merchantKycData?.merchant_account_details?.bankId ?? "",
        account_type: merchantKycData?.merchant_account_details?.accountType?.toString().toLowerCase() === "saving" ? "2" : "1",
        branch: merchantKycData?.merchant_account_details?.branch ?? "",
        isAccountNumberVerified: merchantKycData?.merchant_account_details?.account_number ?? "",
        isIfscVerified: merchantKycData?.merchant_account_details?.ifsc_code ?? ""
    };


    const validationSchema = Yup.object({
        account_holder_name: Yup.string()
            .trim()
            .required("Required")
            .nullable(),
        ifsc_code: Yup.string()
            .trim()
            .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
            .matches(Regex.ifscRegex, RegexMsg.ifscRegex)
            .min(6, "Username must be at least 6 characters")
            .max(20, "Username must not exceed 20 characters")
            .required("Required")
            .nullable(),
        account_number: Yup.string()
            .trim()
            .matches(Regex.accountNoRgex, RegexMsg.accountNoRgex)
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
        isAccountNumberVerified: Yup.string().required(
            "You need to verify Your Account Number"
        ),
        isIfscVerified: Yup.string().required(
            "You need to verify Your IFSC Code"
        )
    });

    const handleSubmit = (values) => {
        // console.log("hekki")
        setSubmitLoader(true)
        let selectedAccType = values.account_type?.toString() === "1" ? "Current" : values.account_type?.toString() === "2" ? "Saving" : "";
        // console.log('dfd')
        dispatch(
            saveBankDetails({
                account_holder_name: values.account_holder_name,
                account_number: values.account_number,
                ifsc_code: values.ifsc_code,
                bank_id: values.bank_id,
                account_type: selectedAccType,
                branch: values.branch,
                login_id: merchantLoginId,
                modified_by: auth?.user?.loginId,
            })).then((resp)=>{
            if(resp?.error?.message){
                toastConfig.errorToast(resp?.error?.message)
                toastConfig.errorToast(resp?.payload?.toString()?.toUpperCase())
            }

            if(resp?.payload?.status===true){
                toastConfig.successToast(resp?.payload?.message)
            }
        }).catch(err=>toastConfig.errorToast("Something went wrong!"))

        // console.log("23432")
        setSubmitLoader(false)
        // tabHandler(3)

    }


    const selectedType = [
        {key: "", value: "Select"},
        {key: "1", value: "Current"},
        {key: "2", value: "Saving"},
    ];


    //---------------GET ALL BANK NAMES DROPDOWN--------------------
    useEffect(() => {
        fetchBankList().then(resp => {
            const convertResp = convertToFormikSelectJson(
                "bankId",
                "bankName",
                resp.data
            );
            setBankList(convertResp)

        }).catch(err => console.log(err))

    }, []);

    useEffect(() => {
        if(merchantLoginId!==""){
            dispatch(kycDetailsByMerchantLoginId({login_id: merchantLoginId}))
        }
    }, [merchantLoginId]);

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
                    // console.log(res?.payload)
                    setLoading(false)
                    const postData = {bank_name: res?.payload?.bank};
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
                    setFieldValue("isIfscVerified", 1)
                    // setFieldValue("oldIfscCode", values)
                    // toast.success(res?.payload?.message);
                } else {
                    setLoading(false)
                    setFieldValue("isIfscVerified", "")
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
                const fullName = res?.payload?.first_name + ' ' + res?.payload?.last_name;
                setFieldValue("account_holder_name", fullName);

                setFieldValue("account_number", values);
                setFieldValue("oldAccountNumber", values);
                setFieldValue("isAccountNumberVerified", 1);
                toast.success(res?.payload?.message);

                ifscValidationNo(ifscCode, setFieldValue);
            } else {
                setLoading(false)
                setFieldValue("isAccountNumberVerified", "");
                toast.error(res?.payload?.message);
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
        // create html bootstrap from with for the bank details eg: account number / ifce / account holder name/ bank name/ account type
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel"
             aria-labelledby="v-pills-link1-tab">
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
                                    IFSC Code<span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                    <Field
                                        text="text"
                                        name="ifsc_code"
                                        className="form-control"
                                        onChange={(e) => {
                                            setFieldValue("ifsc_code", e.target.value)
                                            setFieldValue("isIfscVerified", "")
                                        }}
                                    />

                                    {(values?.ifsc_code !== null && loading) &&
                                        <div className="input-group-append">
                                            <button className="btn cob-btn-primary text-white mb-0 btn-sm" type="button"
                                                    disabled={loading}>
                                                <span className="spinner-border spinner-border-sm" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </span>

                                            </button>
                                        </div>
                                    }

                                    {/* if found any error in validation */}
                                    {/* {console.log("errors",errors)} */}
                                    {(values?.ifsc_code !== null && values?.ifsc_code !== "" && !errors.hasOwnProperty("isAccountNumberVerified") && !errors.hasOwnProperty("isIfscVerified")) &&
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
                                    }
                                </div>

                                {
                                    <ErrorMessage name="ifsc_code">
                                        {(msg) => (
                                            <span className="text-danger">
                                                {msg}
                                            </span>
                                        )}
                                    </ErrorMessage>
                                }
                                {errors?.isIfscVerified && (
                                    <span className="text-danger imp_css">
                                        {errors?.isIfscVerified}
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
                                        onChange={(e) => {
                                            setFieldValue("account_number", e.target.value)
                                            setFieldValue("isAccountNumberVerified", "")
                                        }}
                                    />
                                    {/* if both values are same then display verified icon */}
                                    {(values?.account_number !== null && values?.account_number !== "" && !errors.hasOwnProperty("isAccountNumberVerified") && !errors.hasOwnProperty("isIfscVerified")) &&
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
                                    }

                                    {/* if found any error in validation */}
                                    {/* {console.log("values",values)} */}
                                    {(values?.ifsc_code !== null && (errors.hasOwnProperty("isAccountNumberVerified") || errors.hasOwnProperty("isIfscVerified"))) &&
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
                                            <p className="text-danger">
                                                {msg}
                                            </p>
                                        )}
                                    </ErrorMessage>
                                }

                                {errors?.isAccountNumberVerified && (
                                    <p className="notVerifiedtext- text-danger">
                                        {errors?.isAccountNumberVerified}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <label className="col-form-label mt-0 p-2">
                                    Account Holder Name<span>*</span>
                                </label>
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="account_holder_name"
                                    className="form-control"

                                />
                            </div>

                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <label className="col-form-label mt-0 p-2">
                                    Account Type<span>*</span>
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
                                    Bank Name<span className="">*</span>
                                </label>
                                <FormikController
                                    control="select"
                                    name="bank_id"
                                    className="form-select"
                                    options={bankList}

                                />
                            </div>

                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <label className="col-form-label mt-0 p-2">
                                    Branch<span className="">*</span>
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
                                {/*{console.log(submitLoader)}*/}
                                    <button
                                        className="cob-btn-primary btn text-white btn-sm"
                                        type="submit" >
                                        {submitLoader && <>
                                            <span className="spinner-border spinner-border-sm" role="status"
                                                  aria-hidden="true"/>
                                            <span className="sr-only">Loading...</span>
                                        </>}
                                        Save
                                    </button>

                                {bankDetails?.resp?.status === true &&
                                    <a className="btn active-secondary btn-sm m-2" onClick={()=>setCurrentTab(3)}>Next</a>
                                }

                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    )
}

export default BankDetailsOps