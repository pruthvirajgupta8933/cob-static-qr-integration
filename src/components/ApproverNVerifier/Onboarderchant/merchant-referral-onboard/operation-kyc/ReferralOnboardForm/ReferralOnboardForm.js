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
// import authService from
import authService from "../../../../../../services/auth.service";

function ReferralOnboardForm({referralChild, fetchData}) {
    const dispatch = useDispatch()
    // const theme = useContext("MroContext")
    // const theme = useContext(ThemeContext);

    // console.log("theme",theme)

    const [submitLoader, setSubmitLoader] = useState(false);
    const [businessCode, setBusinessCode] = useState([]);
    const [businessTypeData, setBusinessTypeData] = useState([]);
    const [passwordType, setPasswordType] = useState({showPasswords: false});
    const {auth, merchantReferralOnboardReducer, kyc} = useSelector(state => state)
    const {merchantKycData} = kyc
    const {merchantBasicDetails, merchantOnboardingProcess} = merchantReferralOnboardReducer

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
        password: generateRandomPassword(),
        isPasswordReq: referralChild
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
        password: Yup.string()
    });

    const togglePassword = () => {
        setPasswordType({
            ...passwordType, showPasswords: !passwordType.showPasswords,
        });
    };




    const handleSubmitContact = async (value, resetForm) => {
        setSubmitLoader(true)
        console.log(1)

        const {
            fullName, mobileNumber, email_id, password
        } = value

        let postData = {}
        if (referralChild === true) {
            postData = {
                name: fullName,
                email: email_id,
                phone: mobileNumber,
                password: password,
                referrer_login_id: auth?.user?.loginId
            }

        } else {
            postData = {
                referrer_name: fullName,
                referrer_email: email_id,
                referrer_phone: mobileNumber,
                created_by: auth?.user?.loginId
            }
        }

        await addReferralService(postData, referralChild).then((resp) => {

            toastConfig.successToast(resp?.data?.message)
            console.log("1.0")
            if(referralChild){
                fetchData()
            }


            console.log("1.1")
            authService.emailVerification(auth?.user?.loginId).then(resp=>{
                toastConfig.successToast("Account Activated")
                console.log("1.2")
            }).catch(err=>{
                console.log("1.3")
                toastConfig.errorToast("Error : Account is not activate")
            })


            console.log(2,merchantKycData?.clientCode)
            console.log("merchantKycData",merchantKycData)
            if (merchantKycData?.clientCode === null || merchantKycData?.clientCode===undefined) {
                console.log("1.4")
                const clientFullName = merchantKycData?.name
                const clientMobileNo = merchantKycData?.contactNumber
                const arrayOfClientCode = generateWord(clientFullName, clientMobileNo)
                dispatch(checkClientCodeSlice({"client_code": arrayOfClientCode})).then(res => {
                    console.log("1.5")
                    let newClientCode = ""
                    // if client code available return status true, then make request with the given client
                    if (res?.payload?.clientCode !== "" && res?.payload?.status === true) {
                        newClientCode = res?.payload?.clientCode
                    } else {
                        newClientCode = Math.random().toString(36).slice(-6).toUpperCase();
                    }
                    // update new client code
                    const data = {
                        loginId: merchantKycData?.loginMasterId,
                        clientName: merchantKycData?.name,
                        clientCode: newClientCode,
                    };

                    console.log(3)
                    dispatch(createClientProfile(data)).then(clientProfileRes => {
                        console.log("1.6")
                        console.log("clientProfileRes",clientProfileRes)
                        console.log(4)
                        toastConfig.successToast("Client Code Created")
                        setSubmitLoader(false)
                        // after create the client update the subscribe product
                        // console.log("clientProfileRes", clientProfileRes)
                    }).catch(err => console.log(err));
                })

            }




        }).catch(err => {
            toastConfig.errorToast(err.response.data.detail)
            setSubmitLoader(false)
            console.log(5)
        })

    }

    console.log("submitLoader",submitLoader)
    console.log(6)

    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel"
             aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values)=>handleSubmitContact(values)}
                // onSubmit={async (values, {resetForm}) => {
                //     await handleSubmitContact(values)
                //
                // }}
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
                        {/* {referralChild===true &&
                       
                        <div className={`col-lg-${referralChild ? "6" : "4"}`}>
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
                        
                        
                        } */}
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