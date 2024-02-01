import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, ErrorMessage } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex';
import API_URL from '../../../../../../config';
import { axiosInstanceJWT } from '../../../../../../utilities/axiosInstance';
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
import { saveMerchantBasicDetails, updateBasicDetailsSlice } from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import { clearKycDetailsByMerchantLoginId, kycDetailsByMerchantLoginId } from "../../../../../../slices/kycSlice";
import toastConfig from "../../../../../../utilities/toastTypes";
import { updateBasicDetails } from '../../../../../../services/approver-dashboard/merchantReferralOnboard.service';


function BasicDetailsOps({ setCurrentTab, isEditableInput }) {
    // console.log("isEditableInput", isEditableInput)
    const dispatch = useDispatch()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [businessCode, setBusinessCode] = useState([]);
    const [businessTypeData, setBusinessTypeData] = useState([]);
    const [passwordType, setPasswordType] = useState({ showPasswords: false });
    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const { merchantKycData } = kyc
    const { merchantBasicDetails, merchantOnboardingProcess } = merchantReferralOnboardReducer

    // const searchParams = new URLSearchParams(document.location.search)
    // const edit = searchParams.get('edit')


    // console.log("merchantKycData", merchantKycData)
    const loginIdFromState = merchantOnboardingProcess?.merchantLoginId !== "" ? true : false

    const initialValues = {
        fullName: merchantKycData?.name ?? "",
        mobileNumber: merchantKycData?.contactNumber ?? "",
        email_id: merchantKycData?.emailId ?? "",
        business_category: merchantKycData?.businessCategory ?? "",
        business_type: merchantKycData?.businessType ?? "",
        password: merchantBasicDetails?.resp?.password ?? "",
        username: merchantKycData?.username ?? "",
        isEditTable: loginIdFromState
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

        password: Yup.string().when("isEditTable", {
            is: true,
            then: Yup.string(),
            otherwise: (Yup) => Yup.matches(Regex.password, RegexMsg.password).required("Required")
        }),
        username: Yup.string()
            .trim()
            .required("Required")
            .min(6, "Minimum 6 characters are allowed")
            .max(100, "Maximum 100 characters are allowed")
            .nullable(),
    });

    const handleSubmitContact = async (value) => {
        setSubmitLoader(true)
        const {
            fullName, mobileNumber, email_id, business_category, password, business_type, username
        } = value
        // console.log("merchantOnboardingProcess", merchantOnboardingProcess)

        // return false
        const updateReqBody = {
            "login_id": merchantOnboardingProcess?.merchantLoginId,
            "name": fullName,
            "mobileNumber": mobileNumber,
            "business_category": business_category,
            "business_type": business_type,
            "updated_by": auth?.user?.loginId,
            "password": merchantKycData?.secret_key
        }

        const saveDetailsReqBody = {
            name: fullName,
            mobileNumber: mobileNumber,
            email: email_id,
            business_category: business_category,
            business_type: business_type,
            password: password,
            username: username,
            isDirect: false,
            created_by: auth?.user?.loginId,
            updated_by: auth?.user?.loginId
        }

        if (merchantOnboardingProcess?.merchantLoginId === "") {

            dispatch(saveMerchantBasicDetails(saveDetailsReqBody)).then((resp) => {
                setSubmitLoader(false)
                // console.log(resp?.payload?.merchant_data?.loginMasterId)
                if (resp?.error?.message) {
                    toastConfig.errorToast(resp?.error?.message)
                    toastConfig.errorToast(resp?.payload?.toString()?.toUpperCase())
                }

                if (resp?.payload?.status === true) {
                    // console.log(resp)
                    dispatch(kycDetailsByMerchantLoginId({ login_id: resp?.payload?.merchant_data?.loginMasterId, password_required: true }))
                    toastConfig.successToast(resp?.payload?.message)
                }
            }).catch(err => {
                toastConfig.errorToast("Something went wrong!")
                // console.log(err)
                setSubmitLoader(false)
            })
        } else {
            dispatch(updateBasicDetailsSlice(updateReqBody)).then((resp) => {
                setSubmitLoader(false)
                if (resp?.error?.message) {
                    toastConfig.errorToast(resp?.error?.message)
                    toastConfig.errorToast(resp?.payload?.toString()?.toUpperCase())
                }

                if (resp?.payload?.status === true) {
                    dispatch(kycDetailsByMerchantLoginId({ login_id: merchantOnboardingProcess.merchantLoginId, password_required: true }))
                    toastConfig.successToast(resp?.payload?.message)
                }
            }).catch(err => {
                toastConfig.errorToast("Something went wrong!")
                // console.log(err)
                setSubmitLoader(false)
            })
        }

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
                const data = convertToFormikSelectJson("businessTypeId", "businessTypeText", resp.data);
                setBusinessTypeData(data);
            })
            .catch((err) => {
                console.error(err);
            });


    }, []);

    // useEffect(() => {
    //     if (merchantOnboardingProcess.merchantLoginId !== "") {
    //         dispatch(kycDetailsByMerchantLoginId({ login_id: merchantOnboardingProcess.merchantLoginId }))
    //     }

    // }, [merchantOnboardingProcess]);

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
            {() => (<Form>
                <div className="row g-3">
                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="text"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter Merchant Name"
                            label="Full Name *"
                            autoComplete='off'
                            disabled={isEditableInput}
                        />
                    </div>

                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="text"
                            name="mobileNumber"
                            placeholder="Enter Mobile Number"
                            className="form-control"
                            label="Contact Number *"
                            autoComplete='off'
                            disabled={isEditableInput}
                        />
                    </div>
                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="email"
                            name="email_id"
                            className="form-control"
                            placeholder="Enter Email Id"
                            label="Email ID *"
                            autoComplete='off'
                            disabled={loginIdFromState}

                        />
                    </div>
                    <div className="col-md-6">
                        <FormikController
                            control="input"
                            type="text"
                            name="username"
                            className="form-control"
                            label="Username *"
                            autoComplete='off'
                            disabled={loginIdFromState}
                        />
                    </div>
                    <div className="col-sm-6 col-md-3">
                        <FormikController
                            control="select"
                            name="business_type"
                            options={businessTypeData}
                            className="form-select"
                            label="Business Type *"
                            autoComplete='off'
                            disabled={isEditableInput}

                        />
                    </div>
                    <div className="col-md-3">
                        <FormikController
                            control="select"
                            options={businessCode}
                            name="business_category"
                            className="form-select"
                            label="Business Category *"
                            autoComplete='off'
                            disabled={isEditableInput}
                        />
                    </div>
                    <div className="col-md-6">
                        <label>Create Password <span>*</span></label>
                        <div className="input-group">
                            <FormikController
                                control="input"
                                type={passwordType.showPasswords ? "text" : "password"}
                                name="password"
                                autoComplete='off'
                                className="form-control"
                                displayMsgOutside={true}
                                disabled={loginIdFromState}
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

                        {!isEditableInput && <button type="submit" className="btn cob-btn-primary btn-sm m-2">
                            {submitLoader && <>
                                <span className="spinner-border spinner-border-sm" role="status"
                                    aria-hidden="true" />
                                <span className="sr-only">Loading...</span>
                            </>}
                            Save
                        </button>}


                        {merchantKycData?.isContactNumberVerified === 1 &&
                            <a className="btn active-secondary btn-sm m-2"
                                onClick={() => setCurrentTab(2)}>Next</a>}
                    </div>
                </div>
            </Form>)}
        </Formik>
    </div>)
}

export default BasicDetailsOps