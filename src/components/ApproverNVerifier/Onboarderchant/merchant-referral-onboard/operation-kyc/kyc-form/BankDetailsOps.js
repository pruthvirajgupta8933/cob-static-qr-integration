import React, { useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex';
// import gotVerified from "../../assets/images/verified.png";
import gotVerified from "../../../../../../assets/images/verified.png";
import { useState } from 'react';
import { bankAccountVerification, getBankId, ifscValidation } from '../../../../../../slices/kycSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBankList } from '../../../../../../services/approver-dashboard/merchantReferralOnboard.service';
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import { saveBankDetails } from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';


function BankDetailsOps() {

    const [accountNumberVerified, setAccountNumberVerified] = useState(false)
    const [ifscCodeVerified, setIfscCodeVerified] = useState(false)
    const [loading, setLoading] = useState(false);


    const [bankList, setBankList] = useState([]);
    const dispatch = useDispatch();
    const {auth} = useSelector(state=>state)




    const initialValues = {
        account_holder_name: "",
        account_number: "",
        oldAccountNumber: "",
        ifsc_code: "",
        oldIfscCode: "",
        bank_id: "",
        account_type: "",
        branch: "",
        isAccountNumberVerified: ""
    };


    const validationSchema = Yup.object({
        account_holder_name: Yup.string()
            .trim()
            .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
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
            .matches(Regex.addressForSpecific, "Branch Name is not in valid format")
            .nullable(),
        bank_id: Yup.string()
            .required("Required")
            .nullable(),
        isAccountNumberVerified: Yup.string().required(
            "You need to verify Your Account Number"
        ),
        oldIfscCode: Yup.string()
            .oneOf([Yup.ref("ifsc_code"), null], "IFSC code is not verified")
            .required("IFSC code is not verified")
            .nullable(),
        oldAccountNumber: Yup.string()
            .oneOf(
                [Yup.ref("account_number"), null],
                "You need to verify Your Account Number"
            )
            .required("You need to verify Your Account Number")
            .nullable(),
    });
    const handleSubmit= (values) => {
        let selectedChoice = values.account_type.toString() === "1" ? "Current" : values.account_type.toString() === "2" ? "Saving" : "";
        
        //   setIsDisable(true);
          dispatch(
            saveBankDetails({
              account_holder_name: values.account_holder_name,
              account_number: values.account_number,
              ifsc_code: values.ifsc_code,
              bank_id: values.bank_id,
              account_type: selectedChoice,
              branch: values.branch,
              login_id: auth?.user?.loginId,
              modified_by: auth?.user?.loginId,
            })
          ).then((res) => {
            if (
              res.meta.requestStatus === "fulfilled" &&
              res.payload.status === true
            ) {
              toast.success(res?.payload?.message);
            //   setTab(5);
            //   setIsDisable(false);
            //   setTitle("DOCUMENTS UPLOAD");
            //   dispatch(kycUserList({ login_id: loginId }));
            //   dispatch(GetKycTabsStatus({ login_id: loginId }));
    
            } else {
              toast.error(res?.payload?.detail);
            //   setIsDisable(false);
            }
          });

    }


    // account button attr
    const accountButtonComponent = <button class="btn cob-btn-primary btn-sm" type="button" id="button-addon2" onClick={(vdd) => { console.log(vdd) }}>verify</button>
    const accountIcon = <span className="success input-group-append">
        <img
            src={gotVerified}
            alt=""
            title=""
            width={"20px"}
            height={"20px"}
            className="btn-outline-secondary"
        />
    </span>
    const accountNumberVerification = (val) => {
        console.log("val", val)
        setAccountNumberVerified(true)
    }

    // ifsc button attr
    const ifscButtonComponent = <button class="btn cob-btn-primary btn-sm" type="button" id="button-addon2" onClick={(vdd) => { console.log(vdd) }}>verify</button>
    const ifscIcon = <span className="success input-group-append">
        <img
            src={gotVerified}
            alt=""
            title=""
            width={"20px"}
            height={"20px"}
            className="btn-outline-secondary"
        />
    </span>

    const ifscCodeVerification = (val) => {

    }


    const selectedType = [
        { key: "", value: "Select" },
        { key: "1", value: "Current" },
        { key: "2", value: "Saving" },
    ];


    //---------------GET ALL BANK NAMES DROPDOWN--------------------

    useEffect(() => {
        fetchBankList().then(resp=>{
            console.log(resp.data)
            const convertResp =  convertToFormikSelectJson(
                            "bankId",
                            "bankName",
                            resp.data
                        );
                setBankList(convertResp)

        }).catch(err=>console.log(err))
        // dispatch(kycBankNames())
        //     .then((resp) => {
        //         const data = convertToFormikSelectJson(
        //             "bankId",
        //             "bankName",
        //             resp.payload
        //         );
        //         setData(data);
        //     })

        //     .catch((err) => console.log(err));

        // KycList?.ifscCode ? isIfscVerifed("1") : isIfscVerifed("");
    }, []);




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
                    const postData = { bank_name: res?.payload?.bank };
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
                const fullName = res?.payload?.first_name + ' ' + res?.payload?.last_name;
                setFieldValue("account_holder_name", fullName);

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
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
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
                                    {(values?.ifsc_code !== null && values?.ifsc_code !== "" && !errors.hasOwnProperty("oldAccountNumber") && !errors.hasOwnProperty("oldIfscCode")) &&
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
                                    Business Account Number{" "}
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <div className="input-group">

                                    <Field
                                        type="text"
                                        name="account_number"
                                        className="form-control"

                                    />

                                    {/* if both values are same then display verified icon */}
                                    {(values?.account_number !== null && values?.account_number !== "" && !errors.hasOwnProperty("oldAccountNumber") && !errors.hasOwnProperty("oldIfscCode")) && <span className="success input-group-append">
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
                                            <p className="abhitest- errortxt- text-danger">
                                                {msg}
                                            </p>
                                        )}
                                    </ErrorMessage>
                                }

                                {errors?.oldAccountNumber && (
                                    <p className="notVerifiedtext- text-danger">
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

                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <label className="col-form-label mt-0 p-2">
                                    Bank Name<span className="text-danger">*</span>
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
                                    Branch <span className="text-danger">*</span>
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
                            <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                                {/* {VerifyKycStatus === "Verified" ? <></> : ( */}
                                <button
                                    className="save-next-btn float-lg-right cob-btn-primary text-white btn-sm"
                                    type="submit"
                                >
                                    {/* {disable && <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            <span className="sr-only">Loading...</span>
                                        </>} */}
                                    save
                                </button>
                                {/* )} */}
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>

    )
}

export default BankDetailsOps