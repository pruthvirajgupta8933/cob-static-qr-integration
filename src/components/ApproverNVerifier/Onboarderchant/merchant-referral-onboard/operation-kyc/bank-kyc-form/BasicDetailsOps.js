import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';

import {Formik, Field, Form, ErrorMessage} from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import {Regex, RegexMsg} from '../../../../../../_components/formik/ValidationRegex';
import API_URL from '../../../../../../config';
import {axiosInstanceJWT} from '../../../../../../utilities/axiosInstance';
import {convertToFormikSelectJson} from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import {
    clearErrorMerchantReferralOnboardSlice, saveMerchantBasicDetails
} from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import {
    businessType, clearKycDetailsByMerchantLoginId, kycDetailsByMerchantLoginId
} from "../../../../../../slices/kycSlice";
import toastConfig from "../../../../../../utilities/toastTypes";


function BasicDetailsOps({setCurrentTab}) {
    const dispatch = useDispatch()

    const [submitLoader, setSubmitLoader] = useState(false);
    const [businessCode, setBusinessCode] = useState([]);
    const [businessTypeData, setBusinessTypeData] = useState([]);
    const [passwordType, setPasswordType] = useState({showPasswords: false});
    const {auth, merchantReferralOnboardReducer, kyc} = useSelector(state => state)
    const {merchantKycData} = kyc
    const {merchantBasicDetails, merchantOnboardingProcess} = merchantReferralOnboardReducer

    // console.log("merchantBasicDetails", merchantBasicDetails)

    const initialValues = {
        fullName: merchantKycData?.name ?? "",
        mobileNumber: merchantKycData?.contactNumber ?? "",
        email_id: merchantKycData?.emailId ?? "",
        business_category: merchantKycData?.businessCategory ?? "",
        business_type: merchantKycData?.businessType ?? "",
        password: merchantBasicDetails?.resp?.password ?? ""
    };


    const validationSchema = Yup.object({
        fullName: Yup.string()
            .trim()
            .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
            .required("Required").wordLength("Word character length exceeded", 100)
            .max(100, "Maximum 100 characters are allowed")
            .nullable(),
        mobileNumber: Yup.string()
            .trim()
            .required("Required")
            .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
            .min(10, "Phone number is not valid")
            .max(10, "Only 10 digits are allowed ")
            .nullable(),
        email_id: Yup.string()
            .trim()
            .email("Invalid email")
            .required("Required")
            .nullable(),
        business_category: Yup.string().required("Required"),
        business_type: Yup.string().required("Required"),
        password: Yup.string()
            .required("Password Required")
            .matches(Regex.password, RegexMsg.password),
    });


    const handleSubmitContact = async (value) => {
        setSubmitLoader(true)
        const {
            fullName, mobileNumber, email_id, business_category, password, business_type
        } = value
        try{
            await dispatch(saveMerchantBasicDetails({
                name: fullName,
                mobileNumber: mobileNumber,
                email: email_id,
                business_category: business_category,
                business_type: business_type,
                password: password,
                isDirect: false,
                created_by: auth?.user?.loginId,
                updated_by: auth?.user?.loginId
            }))
            setSubmitLoader(false)
            toastConfig.successToast("Submitted Successfully")
        }catch (error){
            toastConfig.errorToast("Error", error)
        }

        setSubmitLoader(false)
    }


    useEffect(() => {
        axiosInstanceJWT
            .get(API_URL.Business_Category_CODE)
            .then((resp) => {
                const data = resp.data;
                const dataOpt = convertToFormikSelectJson("category_id", "category_name", data);
                setBusinessCode(dataOpt);
            })
            .catch((err) => {
                console.error(err);
            });

        axiosInstanceJWT
            .get(API_URL.Business_type)
            .then((resp) => {
                // console.log("busType", resp)
                const data = convertToFormikSelectJson("businessTypeId", "businessTypeText", resp.data);
                setBusinessTypeData(data);
            })
            .catch((err) => {
                console.error(err);
            });

    }, []);

    useEffect(() => {
        if (merchantOnboardingProcess.merchantLoginId !== "") {
            dispatch(kycDetailsByMerchantLoginId({login_id: merchantOnboardingProcess.merchantLoginId}))
        }

        if (merchantBasicDetails.resp.error === true) {
            toastConfig.errorToast(merchantBasicDetails.resp.errorMsg)
        }
        return () => {
            dispatch(clearErrorMerchantReferralOnboardSlice())
        }
    }, [merchantOnboardingProcess, merchantBasicDetails]);

    const togglePassword = () => {
        setPasswordType({
            ...passwordType, showPasswords: !passwordType.showPasswords,
        });
    };


    return (<div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel"
                 aria-labelledby="v-pills-link1-tab">
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmitContact}
            enableReinitialize={true}
        >
            {({
                  values, setFieldValue, errors, setFieldError
              }) => (<Form>
                <div className="row g-3">
                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="text"
                            name="fullName"
                            className="form-control"
                            label="Full Name"
                        />
                    </div>

                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="text"
                            name="mobileNumber"
                            className="form-control"
                            label="Contact Number"
                        />
                    </div>
                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="email"
                            name="email_id"
                            className="form-control"
                            label="Email ID"
                        />
                    </div>

                    <div className="col-sm-6 col-md-6 col-lg-6">
                        <FormikController
                            control="select"
                            name="business_type"
                            options={businessTypeData}
                            className="form-select"
                            label="Business Type"
                        />
                    </div>

                    <div className="col-md-6">
                        <FormikController
                            control="select"
                            options={businessCode}
                            name="business_category"
                            className="form-select"
                            label="Business Category"
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Create Password</label>
                        <div className="input-group">
                            <FormikController
                                control="input"
                                type={passwordType.showPasswords ? "text" : "password"}
                                name="password"
                                className="form-control"
                                displayMsgOutside={true}
                            />
                            <span className="input-group-text" onClick={togglePassword} id="basic-addon2">
                                        {passwordType.showPasswords ? (
                                            <i className="fa fa-eye" aria-hidden="true"></i>) : (
                                            <i className="fa fa-eye-slash" aria-hidden="true"></i>)}
                                    </span>
                        </div>
                        <ErrorMessage name={"password"}>{msg => <p
                            className="text-danger m-0">{msg}</p>}</ErrorMessage>
                    </div>
                    <div className="col-6">
                        {merchantBasicDetails?.resp?.status !== "Activate" &&
                            <button type="submit" className="btn cob-btn-primary btn-sm m-2">
                                {submitLoader && <>
                                            <span className="spinner-border spinner-border-sm" role="status"
                                                  aria-hidden="true"/>
                                    <span className="sr-only">Loading...</span>
                                </>}
                                Save
                            </button>}
                        {merchantBasicDetails?.resp?.status === "Activate" &&
                            <a className="btn active-secondary btn-sm m-2"
                               onClick={() => setCurrentTab(2)}>Next</a>}
                    </div>
                </div>
            </Form>)}
        </Formik>
    </div>)
}

export default BasicDetailsOps