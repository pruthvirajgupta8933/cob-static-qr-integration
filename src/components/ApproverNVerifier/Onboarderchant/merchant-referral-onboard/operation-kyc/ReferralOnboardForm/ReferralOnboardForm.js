import React, {useEffect, useState} from 'react';
import {ErrorMessage, Form, Formik} from "formik";
import FormikController from "../../../../../../_components/formik/FormikController";
import {useDispatch, useSelector} from "react-redux";
import Yup from "../../../../../../_components/formik/Yup";
import {Regex, RegexMsg} from "../../../../../../_components/formik/ValidationRegex";
import {saveMerchantBasicDetails} from "../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import toastConfig from "../../../../../../utilities/toastTypes";
import {axiosInstanceJWT} from "../../../../../../utilities/axiosInstance";
import API_URL from "../../../../../../config";
import {convertToFormikSelectJson} from "../../../../../../_components/reuseable_components/convertToFormikSelectJson";
import {kycDetailsByMerchantLoginId} from "../../../../../../slices/kycSlice";
import {generateWord} from "../../../../../../utilities/generateClientCode";
import {checkClientCodeSlice, createClientProfile} from "../../../../../../slices/auth";
import {addReferralService} from "../../../../../../services/approver-dashboard/merchantReferralOnboard.service";

function ReferralOnboardForm({referralChild}) {
    const dispatch = useDispatch()
    // const theme = useContext("MroContext")
    // const theme = useContext(ThemeContext);

    // console.log("theme",theme)

    const [submitLoader, setSubmitLoader] = useState(false);
    const [businessCode, setBusinessCode] = useState([]);
    const [businessTypeData, setBusinessTypeData] = useState([]);
    const [passwordType, setPasswordType] = useState({showPasswords: false});
    const {auth, merchantReferralOnboardReducer, kyc} = useSelector(state => state)
    // const {merchantKycData} = kyc
    const {merchantBasicDetails, merchantOnboardingProcess} = merchantReferralOnboardReducer

    const initialValues = {
        fullName: "",
        mobileNumber: "",
        email_id: ""
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
            .nullable()
    });


    const handleSubmitContact = async (value) => {
        setSubmitLoader(true)
        const {
            fullName, mobileNumber, email_id
        } = value

        let postData = {}
        if(referralChild===true){
            postData ={
                name: fullName,
                email: email_id,
                phone: mobileNumber,
                password: "Pass@123",
                referrer_login_id: auth?.user?.loginId
            }

        }else{
            postData = {
                referrer_name: fullName,
                referrer_email: email_id,
                referrer_phone: mobileNumber,
                created_by: auth?.user?.loginId
            }
        }

        await addReferralService(postData, referralChild).then((resp) => {
            console.log("resp", resp)

            toastConfig.successToast(resp?.data?.message)
            const loginMasterId = resp?.data?.data?.loginMasterId
            const clientFullName = resp?.data?.data?.name
            const clientMobileNo = resp?.data?.data?.mobileNumber
            // const clientFullName = merchantKycData?.name
            // const clientMobileNo = merchantKycData?.contactNumber
            const arrayOfClientCode = generateWord(clientFullName, clientMobileNo)
            dispatch(checkClientCodeSlice({"client_code": arrayOfClientCode})).then(res => {
                let newClientCode = ""
                // if client code available return status true, then make request with the given client
                if (res?.payload?.clientCode !== "" && res?.payload?.status === true) {
                    newClientCode = res?.payload?.clientCode
                } else {
                    newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
                }
                // update new client code
                const data = {
                    loginId: loginMasterId,
                    clientName: clientFullName,
                    clientCode: newClientCode,
                };

                dispatch(createClientProfile(data)).then(clientProfileRes => {
                    // after create the client update the subscribe product
                    console.log("clientProfileRes", clientProfileRes)
                    setSubmitLoader(false)
                }).catch(err => {
                    console.log(err)
                    setSubmitLoader(false)
                });
            })


        }).catch(err => {
            toastConfig.errorToast(err.response.data.detail)
            setSubmitLoader(false)
        })

        // dispatch(saveMerchantBasicDetails({
        //     name: fullName,
        //     mobileNumber: mobileNumber,
        //     email: email_id,
        //     isDirect: false,
        //     created_by: auth?.user?.loginId,
        //     updated_by: auth?.user?.loginId
        // })).then((resp) => {
        //     setSubmitLoader(false)
        //     if (resp?.error?.message) {
        //         toastConfig.errorToast(resp?.error?.message)
        //         toastConfig.errorToast(resp?.payload?.toString()?.toUpperCase())
        //     }
        //
        //     if (resp?.payload?.status === true) {
        //         toastConfig.successToast(resp?.payload?.message)
        //     }
        // }).catch(err => {
        //     toastConfig.errorToast("Something went wrong!")
        //     setSubmitLoader(false)
        // })


    }


    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel"
             aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // onSubmit={handleSubmitContact}
                onSubmit={async (values, {resetForm}) => {
                    await handleSubmitContact(values)
                    resetForm()
                }}
                enableReinitialize={true}
            >
                {({
                      values, setFieldValue, errors, setFieldError
                  }) => (<Form>
                    <div className="row g-3">
                        <div className="col-lg-4">
                            <FormikController
                                control="input"
                                type="text"
                                name="fullName"
                                className="form-control"
                                label="Client Name"
                            />
                        </div>

                        <div className="col-lg-4">
                            <FormikController
                                control="input"
                                type="text"
                                name="mobileNumber"
                                className="form-control"
                                label="Contact Number"
                            />
                        </div>
                        <div className="col-lg-4">
                            <FormikController
                                control="input"
                                type="email"
                                name="email_id"
                                className="form-control"
                                label="Email ID"
                            />
                        </div>
                    </div>
                    <div className="row g-3">
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
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-lg-12">

                        </div>
                    </div>

                </Form>)}
            </Formik>
        </div>);
}

export default ReferralOnboardForm;