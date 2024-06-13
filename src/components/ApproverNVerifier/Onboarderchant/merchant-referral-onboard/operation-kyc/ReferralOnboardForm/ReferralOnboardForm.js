import React, { useState } from 'react';
import { Form, Formik } from "formik";
import FormikController from "../../../../../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../../../../../_components/formik/Yup";
import { Regex, RegexMsg } from "../../../../../../_components/formik/ValidationRegex";
import toastConfig from "../../../../../../utilities/toastTypes";
import { generateWord } from "../../../../../../utilities/generateClientCode";
import { addReferralService } from "../../../../../../services/approver-dashboard/merchantReferralOnboard.service";
import authService from "../../../../../../services/auth.service";
import { createClientProfile } from "../../../../../../slices/auth";
import { values } from 'lodash';

function ReferralOnboardForm({ referralChild, fetchData, referrerLoginId, zoneCode, marginTopCss }) {

    const dispatch = useDispatch()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [disable, setDisable] = useState(false)
    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const { merchantKycData } = kyc
    const { merchantBasicDetails } = merchantReferralOnboardReducer

    const generateRandomPassword = () => {
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const specialChars = '@';
        const passwordLength = 8;
        let password = '';
        password += upperChars.charAt(Math.floor(Math.random() * upperChars.length));  // For uppercase letter
        password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));   // For lowercase letter
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));  // For exactly one number
        password += specialChars.charAt(Math.floor(Math.random() * specialChars.length)); // Ensure exactly one special character
        for (let i = password.length; i < passwordLength; i++) {
            const randomChars = upperChars + lowerChars + numberChars + specialChars;
            const randomIndex = Math.floor(Math.random() * randomChars.length);
            password += randomChars.charAt(randomIndex);
        }
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        return password;
    };

    const initialValues = {
        fullName: "",
        mobileNumber: "",
        email_id: "",
        username: "",
        referrer_login_id: "",
        pan_card: "",
        signatory_pan: "",
        address: "",
        city: "",
        state: "",
        pin_code: "",
        password: generateRandomPassword(),
        isPasswordReq: referralChild
    };


    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .allowOneSpace()
            .matches(Regex.acceptAlphaNumericDot, RegexMsg.acceptAlphaNumericDot)
            .required("Required").wordLength("Word character length exceeded", 100)
            .max(100, "Maximum 100 characters are allowed")
            .nullable(),
        username: Yup.string()
            .allowOneSpace()
            .when('isPasswordReq', {
                is: true,
                then: Yup.string().matches(Regex.userNameRegex, RegexMsg.userNameRegex).required('Required'),
                otherwise: Yup.string(),
            }),
        mobileNumber: Yup.string()

            .allowOneSpace()
            .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
            .min(10, "Phone number is not valid")
            .max(10, "Only 10 digits are allowed ")
            .required("Required")
            .nullable(),
        email_id: Yup.string()
            .allowOneSpace()
            .email("Invalid email")
            .required("Required")
            .nullable(),
        pan_card: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),
        // signatory_pan: Yup.string()
        //     .allowOneSpace()
        //     .required("Required")
        //     .nullable(),
        city: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),
        state: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),
        address: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),
        pin_code: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),

        password: Yup.string(),
    });


    const handleSubmitContact = async (value, { resetForm }) => {

        setDisable(true)
        const { fullName, mobileNumber, email_id, password, username,pan_card,city,state,address,signatory_pan,pin_code} = value;
        // alert(3)
        setSubmitLoader(true)
        try {
            let postData = {};

            if (referralChild === true) {
                postData = {
                    name: fullName,
                    email: email_id,
                    phone: mobileNumber,
                    password: password,
                    username: username,
                    created_by: auth?.user?.loginId,
                    referrer_login_id: auth?.user?.loginId

                };

                if (referrerLoginId) {
                    postData.referrer_login_id = referrerLoginId;  //check for referrer_login_id
                }

                if (zoneCode) {
                    postData.zone_code = zoneCode; // check for zone_code
                }
            } else {
                postData = {
                    referrer_name: fullName,
                    referrer_email: email_id,
                    referrer_phone: mobileNumber,
                    created_by: auth?.user?.loginId,
                    zone_code: zoneCode,
                    pan_card:pan_card,
                    signatory_pan:signatory_pan,
                    merchant_address:{
                        address:address,
                        city:city,
                        state:state,
                        pin_code:pin_code
                    }
                };
            } const resp1 = await addReferralService(postData, referralChild);

            resp1?.data?.status && toastConfig.successToast("Data Saved")
            // resetForm()
            // create user
            const refLoginId = resp1?.data?.data?.loginMasterId
            // user account activation
            const resp2 = await authService.emailVerification(refLoginId)
            // const resp
            resp2?.data && toastConfig.successToast("Account Activate")
            resetForm()
            if (merchantKycData?.clientCode === null || merchantKycData?.clientCode === undefined) {
                // console.log("1.4")
                const clientFullName = fullName
                const clientMobileNo = mobileNumber
                const arrayOfClientCode = generateWord(clientFullName, clientMobileNo)

                // check client code is existing
                const resp3 = await authService.checkClintCode({ "client_code": arrayOfClientCode })
                let newClientCode
                // if client code available return status true, then make request with the given client
                if (resp3?.data?.clientCode !== "" && resp3?.data?.status === true) {
                    newClientCode = resp3?.data?.clientCode
                } else {
                    newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
                }

                const data = {
                    loginId: refLoginId,
                    clientName: merchantKycData?.name,
                    clientCode: newClientCode,
                };
                // console.log(3)
                await dispatch(createClientProfile(data)).then(clientProfileRes => {
                    toastConfig.successToast("Client Code Created")
                    setSubmitLoader(false)
                    setDisable(false)
                    // after create the client update the subscribe product
                    // console.log("clientProfileRes", clientProfileRes)
                }).catch(err => {
                    toastConfig.errorToast("Error : Client Code not Create")
                    setSubmitLoader(false)
                    setDisable(false)
                });

                if (referralChild) {
                    await fetchData()
                    setSubmitLoader(false)
                    setDisable(false)
                }
            }
        } catch (error) {
            // console.log("catch-error", error.response)
            toastConfig.errorToast(error.response.data.detail)
            setSubmitLoader(false)
            setDisable(false)
        }


    }

    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel"
            aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // onSubmit={(values) => handleSubmitContact(values)}
                onSubmit={async (values, { resetForm }) => {
                    await handleSubmitContact(values, { resetForm })

                }}
                enableReinitialize={false
                }
            >
                {(formik) => (<Form>
                    <div className={`row g-3 ${marginTopCss ? "mt-5" : ""}`}>
                        <div className={`col-lg-${referralChild ? "6" : "4"}`}>
                            <FormikController
                                control="input"
                                type="text"
                                name="fullName"
                                placeholder="Enter Name"
                                className="form-control"
                                label="Client Name *"
                            />
                        </div>

                        <div className={`col-lg-${referralChild ? "6" : "4"}`}>
                            <FormikController
                                control="input"
                                type="text"
                                name="mobileNumber"
                                placeholder="Enter Mobile Number"
                                className="form-control"
                                label="Contact Number *"
                            />
                        </div>
                        <div className={`col-lg-${referralChild ? "6" : "4"}`}>
                            <FormikController
                                control="input"
                                name="email_id"
                                placeholder="Enter Email"
                                className="form-control"
                                label="Email ID *"
                            />
                        </div>

                        {referralChild && (
                            <div className={`col-lg-6`}>
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="username"
                                    placeholder="Create User Name"
                                    className="form-control"
                                    label="Username *"
                                />
                            </div>
                        )}

                        {!referralChild && (
                            <>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="pan_card"
                                        placeholder="Enter Business PAN"
                                        className="form-control"
                                        label="Business PAN *"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="signatory_pan"
                                        placeholder="Enter Business PAN"
                                        className="form-control"
                                        label="Authorized Signatory PAN *"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="address"
                                        placeholder="Enter Address"
                                        className="form-control"
                                        label="Address *"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="city"
                                        placeholder="Enter City"
                                        className="form-control"
                                        label="City *"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="state"
                                        placeholder="Enter State"
                                        className="form-control"
                                        label="State *"
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <FormikController
                                        control="input"
                                        name="pin_code"
                                        placeholder="Enter Pin Code"
                                        className="form-control"
                                        label="Pin Code *"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="row g-3">
                        <div className="col-6">
                            {merchantBasicDetails?.resp?.status !== "Activate" &&
                                <button type="submit" className="btn cob-btn-primary btn-sm m-2" disabled={disable}>
                                    {submitLoader && <>
                                        <span className="spinner-border spinner-border-sm" ariaHidden="true" />
                                        <span className="sr-only">Loading...</span>
                                    </>}
                                    Save
                                </button>}
                        </div>
                    </div>

                </Form>)}
            </Formik>
        </div>);
}

export default ReferralOnboardForm;