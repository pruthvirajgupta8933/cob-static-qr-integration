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

function ReferralOnboardForm({referralChild,fetchData}) {
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
        password:generateRandomPassword(),
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
            password:Yup.string(),

        //    password:Yup.string()
        //     .trim()
        //     .when("isPasswordReq", {
        //         is:true,
        //         then:Yup.string().required("Required")
        //     }).nullable()
    });

    const togglePassword = () => {
        setPasswordType({
            ...passwordType, showPasswords: !passwordType.showPasswords,
        });
    };


    const handleSubmitContact = async (value) => {
         setSubmitLoader(true)
      
        const {
            fullName, mobileNumber, email_id,password
        } = value

        let postData = {}
        if(referralChild===true){
            postData ={
                name: fullName,
                email: email_id,
                phone: mobileNumber,
                password: password,
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
           
            toastConfig.successToast(resp?.data?.message)
            fetchData()
            setSubmitLoader(false)
            

        }).catch(err => {
            toastConfig.errorToast(err.response.data.detail)
            setSubmitLoader(false)
        })

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