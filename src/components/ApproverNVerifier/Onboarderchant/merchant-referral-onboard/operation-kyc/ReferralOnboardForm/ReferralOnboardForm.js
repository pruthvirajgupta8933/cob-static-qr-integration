import React, { useState,useEffect } from 'react';
import { Form, Formik, Field } from "formik";
import { panValidation } from '../../../../../../slices/kycSlice';
import FormikController from "../../../../../../_components/formik/FormikController";
import { useDispatch, useSelector } from "react-redux";
import Yup from "../../../../../../_components/formik/Yup";
import { Regex, RegexMsg } from "../../../../../../_components/formik/ValidationRegex";
import toastConfig from "../../../../../../utilities/toastTypes";
import { generateWord } from "../../../../../../utilities/generateClientCode";
import { addReferralService } from "../../../../../../services/approver-dashboard/merchantReferralOnboard.service";
import authService from "../../../../../../services/auth.service";
import { createClientProfile } from "../../../../../../slices/auth";
import { isNull } from 'lodash';
import { toast } from 'react-toastify';
import gotVerified from "../../../../../../assets/images/verified.png"
import { authPanValidation } from '../../../../../../slices/kycSlice';
import { businessOverviewState } from '../../../../../../slices/kycSlice';
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';

function ReferralOnboardForm({ referralChild, fetchData, referrerLoginId, zoneCode, marginTopCss }) {

    const dispatch = useDispatch()
    const [submitLoader, setSubmitLoader] = useState(false);
    const [loadingForSiganatory, setLoadingForSignatory] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [BusinessOverview, setBusinessOverview] = useState([]);
    const [disable, setDisable] = useState(false)
    const { auth, merchantReferralOnboardReducer, kyc } = useSelector(state => state)
    const { merchantKycData } = kyc
    const { merchantBasicDetails } = merchantReferralOnboardReducer
    const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

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

    const trimFullName = (strOne, strTwo) => {
        let fullStr = isNull(strOne) ? "" : strOne
        fullStr += isNull(strTwo) ? "" : strTwo
        return fullStr
    }
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
        state_id: "",
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
        isPanVerified: Yup.string().required("Please verify the pan number").nullable(),
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
        pan_card: Yup.string().allowOneSpace()
            .matches(reqexPAN, "PAN number is invalid")
            .required("Required")
            .nullable(),

        isSignatoryPanVerified: Yup.string().allowOneSpace().required("Please verify the signatory pan number").nullable(),
        prevSignatoryPan: Yup.string().allowOneSpace()
            .oneOf(
                [Yup.ref("signatory_pan"), null],
                "You need to verify Your Authorized Signatory PAN Number"
            )
            .nullable(),
        signatory_pan: Yup.string()
            .allowOneSpace()
            .matches(reqexPAN, "Authorized PAN number is Invalid")
            .required("Required")
            .nullable(),
        city: Yup.string()
            .allowOneSpace()
            .required("Required")
            .nullable(),
        state_id: Yup.string()
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
        const { fullName, mobileNumber, email_id, password, username, pan_card, city, state_id, address, signatory_pan, pin_code } = value;
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
                    pan_card: pan_card,
                    signatory_pan: signatory_pan,
                    merchant_address: {
                        address: address,
                        city: city,
                        state: state_id,
                        pin_code: pin_code
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
    const panValidate = (values, key, setFieldValue) => {
        setIsLoading(true)

        dispatch(
            panValidation({
                pan_number: values,
            })
        ).then((res) => {
            if (

                res.meta.requestStatus === "fulfilled" &&
                res.payload.status === true &&
                res.payload.valid === true
            ) {
                const fullNameByPan = trimFullName(res?.payload?.first_name, res?.payload?.last_name)
                setFieldValue(key, fullNameByPan)

                setFieldValue("pan_card", values)
                setFieldValue("prev_pan_card", values)
                setFieldValue("isPanVerified", 1)
                toast.success(res?.payload?.message);
                setIsLoading(false)

            } else {
                setFieldValue(key, "")
                setIsLoading(false)
                toast.error(res?.payload?.message);
            }
        }).catch(err => { console.log("err", err) })
        setIsLoading(false)
        // setRegisterWithGstState(false)
    };

    useEffect(() => {
        dispatch(businessOverviewState())
          .then((resp) => {
            const data = convertToFormikSelectJson(
              "stateId",
              "stateName",
              resp.payload
            );
            setBusinessOverview(data);
          })
          .catch((err) => console.log(err));
        // console.log("useEffect call")
      }, []);

    const authValidation = (values, key, setFieldValue) => {
        setLoadingForSignatory(true)
        // console.log("auth", "auth pan")
        dispatch(
            authPanValidation({
                pan_number: values,
            })
        ).then((res) => {
            if (
                res.meta.requestStatus === "fulfilled" &&
                res.payload.status === true &&
                res.payload.valid === true
            ) {
                const authName = res.payload.first_name + ' ' + res.payload?.last_name

                setFieldValue(key, values)
                setLoadingForSignatory(false)
                setFieldValue("prevSignatoryPan", values)
                setFieldValue("name_on_pancard", authName)
                setFieldValue("isSignatoryPanVerified", 1)

                toast.success(res.payload.message);
            } else {

                toast.error(res?.payload?.message);
                setLoadingForSignatory(false)
                // setIsLoading(false)
            }
        });
    };


    const checkInputIsValid = async (err, val, setErr, setFieldTouched, key, setFieldValue = () => { }) => {

        // setIsLoading(true)
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
        if (!hasErr && isValidVal && val[key] !== "" && key === "pan_card") {

            // for  -Business PAN 
            panValidate(val[key], "company_name", setFieldValue, setIsLoading);
            setIsLoading(true)
        }

        if (!hasErr && isValidVal && val[key] !== "" && key === "signatory_pan") {
            // auth signatory pan
            // console.log("dfdfdf")
            authValidation(val[key], "signatory_pan", setFieldValue, setLoadingForSignatory);
        }

    };

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
                {({
                    initialValues,
                    values,
                    setFieldValue,
                    errors,
                    setFieldError,
                    setFieldTouched
                }) => (


                    <Form>
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
                                        {/* <label className="col-form-label mt-0 p-2">
                  Business PAN <span className="text-danger">*</span>
                </label> */}
                                        <label className="col-form-label mt-0">
                                            Business PAN<span > *</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="pan_card"
                                                className="form-control"
                                                placeholder="Enter Business PAN"
                                                onChange={(e) => {
                                                    setFieldValue("isPanVerified", "")
                                                    const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                                                    setFieldValue("pan_card", uppercaseValue); // Set the uppercase value to form state
                                                }}
                                            // disabled={VerifyKycStatus === "Verified"}
                                            // readOnly={JSON.parse(values?.registerd_with_gst)}

                                            />


                                            {(values?.pan_card !== null &&
                                                values?.isPanVerified !== "" &&
                                                values?.pan_card !== "" &&
                                                values?.pan_card !== undefined &&
                                                !errors.hasOwnProperty("pan_card") &&
                                                !errors.hasOwnProperty("prev_pan_card") &&
                                                (values?.pan_card === values?.prev_pan_card)) ?
                                                <span className="success input-group-append">
                                                    <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                                                </span>
                                                : <div className="input-group-append">
                                                    <button
                                                        href={() => false}
                                                        className="btn cob-btn-primary text-white btn btn-sm"

                                                        onClick={() => {

                                                            checkInputIsValid(
                                                                errors,
                                                                values,
                                                                setFieldError,
                                                                setFieldTouched,
                                                                "pan_card",
                                                                setFieldValue
                                                            );
                                                        }}
                                                    >
                                                        {isLoading ?
                                                            <span className="spinner-border spinner-border-sm" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </span>
                                                            :
                                                            "Verify"
                                                        }
                                                    </button>
                                                </div>}
                                        </div>
                                        {errors?.pan_card && (
                                            <p className="notVerifiedtext- text-danger mb-0">
                                                {errors?.pan_card}
                                            </p>
                                        )}

                                        {errors?.prev_pan_card && (
                                            <p className="notVerifiedtext- text-danger mb-0">
                                                {errors?.prev_pan_card}
                                            </p>
                                        )}

                                        {errors?.isPanVerified && (
                                            <p className="notVerifiedtext- text-danger mb-0">
                                                {errors?.isPanVerified}
                                            </p>
                                        )}



                                    </div>

                                    <div className="col-md-4">
                                        <label className="col-form-label mt-0 p-2">
                                            Authorized Signatory PAN
                                            <span className="text-danger"></span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="signatory_pan"
                                                className="form-control"
                                                placeholder="Enter Signatory PAN"
                                                onChange={(e) => {
                                                    const uppercaseValue = e.target.value.toUpperCase();
                                                    setFieldValue("signatory_pan", uppercaseValue);
                                                    setFieldValue("isSignatoryPanVerified", "")
                                                }}

                                            />
                                            {values?.signatory_pan &&
                                                values?.isSignatoryPanVerified &&
                                                !errors.hasOwnProperty("signatory_pan") &&
                                                !errors.hasOwnProperty("prevSignatoryPan") ? (
                                                <span className="success input-group-append">
                                                    <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                                                </span>
                                            ) : (
                                                <div className="input-group-append">
                                                    <a
                                                        href={() => false}
                                                        className="btn cob-btn-primary text-white btn-sm"
                                                        onClick={() => {
                                                            checkInputIsValid(
                                                                errors,
                                                                values,
                                                                setFieldError,
                                                                setFieldTouched,
                                                                "signatory_pan",
                                                                setFieldValue
                                                            );
                                                        }}
                                                    >
                                                        {loadingForSiganatory ?
                                                            <span className="spinner-border spinner-border-sm" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </span>
                                                            :
                                                            "Verify"
                                                        }
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {errors?.signatory_pan && (
                                            <span className="text-danger mb-0 d-flex">
                                                {errors?.signatory_pan}
                                            </span>
                                        )}
                                        {errors?.prevSignatoryPan && (
                                            <span className="text-danger mb-0 d-flex">
                                                {errors?.prevSignatoryPan}
                                            </span>
                                        )}
                                        {errors?.isSignatoryPanVerified && (
                                            <span className="text-danger mb-0 d-flex">
                                                {errors?.isSignatoryPanVerified}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-lg-4 mt-4">
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
                                        {/* <FormikController
                                            control="input"
                                            name="state"
                                            placeholder="Enter State"
                                            className="form-control"
                                            label="State *"
                                        /> */}
                                        <FormikController
                                            control="select"
                                            name="state_id"
                                            label="State *"
                                            options={BusinessOverview}
                                            className="form-select"
                                           
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