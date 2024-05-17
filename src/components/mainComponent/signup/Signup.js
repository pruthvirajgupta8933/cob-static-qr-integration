import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from "../../../_components/formik/Yup";
import { useDispatch, useSelector } from "react-redux";
import { logout, register, udpateRegistrationStatus } from "../../../slices/auth";
import { useHistory, Link } from "react-router-dom";
import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import AfterSignUp from "../../../components/social-login/AfterSignup";
import classes from "./signup.module.css"
import Header from '../header/Header'
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import CustomModal from "../../../_components/custom_modal";
import signupBnr from "../../../assets/images/sb-front-bnrr.png"
import { v4 as uuidv4 } from 'uuid';
import toastConfig from "../../../utilities/toastTypes";


const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const initialValues = {
    fullname: "",
    mobilenumber: "",
    emaill: "",
    passwordd: "",
    business_cat_code: "",
    confirmpasswordd: "",
    terms_and_condition: false,
}

const FORM_VALIDATION = Yup.object().shape({
    fullname: Yup.string()
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required("Required")
        .allowOneSpace(),
    mobilenumber: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "Phone number in not valid")
        .max(10, "too long")
        .allowOneSpace(),

    emaill: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Required")
        .allowOneSpace(),
    passwordd: Yup.string()
        .required("Password Required")
        .allowOneSpace()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special Character"
        ),
    confirmpasswordd: Yup.string()
        .oneOf([Yup.ref("passwordd"), null], "Passwords must match")
        .required("Confirm Password")
        .allowOneSpace(),
    business_cat_code: Yup.string().required("Required"),
    terms_and_condition: Yup.boolean().oneOf([true], 'Please accept the terms & conditions and privacy policy to proceed further')
});


function Signup() {
    const history = useHistory();
    const reduxState = useSelector((state) => state);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { message, auth } = reduxState;
    const authData = auth;
    const { isUserRegistered } = authData;

    const [btnDisable, setBtnDisable] = useState(false);
    const [businessCode, setBusinessCode] = useState([]);
    const [queryString, setQueryString] = useState({});
    const [passwordType, setPasswordType] = useState({
        confirmpassword: "",
        showPasswords: false,
    });

    const [valuesIn, setValuesIn] = useState({
        password: "",
        showPassword: false,
    });


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const dispatch = useDispatch();

    const togglePassword = () => {
        setPasswordType({
            ...passwordType,
            showPasswords: !passwordType.showPasswords,
        });
    };



    useEffect(() => {
        axiosInstanceJWT
            .get(API_URL.Business_Category_CODE)
            .then((resp) => {
                const data = resp?.data;
                const sortAlpha = data?.sort((a, b) =>
                    a.category_name
                        .toLowerCase()
                        .localeCompare(b.category_name.toLowerCase())
                );
                setBusinessCode(sortAlpha);
            })
            .catch((err) => console.log(err));

        const search = window.location.search;
        const params = new URLSearchParams(search);
        const appid = params.get("appid");
        const planid = params.get("planid");
        const domain = params.get("domain");
        const page = params.get("page");
        const appName = params.get("appName");
        const planName = params.get("planName");

        const paramObject = {
            appid,
            planid,
            domain,
            page,
            appName,
            planName,
        };
        setQueryString(paramObject);
    }, []);

    const handleRegistration = (formData, { resetForm }) => {
        let businessType = 1;
        let { fullname, mobilenumber, emaill, passwordd, business_cat_code } =
            formData;
        setBtnDisable(true);

        dispatch(
            register({
                fullname: fullname,
                mobileNumber: mobilenumber,
                email: emaill,
                business_cat_code: business_cat_code,
                password: passwordd,
                businessType,
                isDirect: true,
                created_by: null,
                plan_details: queryString,
                is_social: true
            })
        )
            .unwrap()
            .then((res) => {
                setBtnDisable(false);
                resetForm();
            })
            .catch((err) => {
                // console.log("err", err)
                setBtnDisable(false);
            });
    };

    const handleClickShowPassword = () => {
        setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
    };

    useEffect(() => {
        const userLocalData = JSON.parse(localStorage.getItem("user"));
        const isLoggedInLc =
            userLocalData && userLocalData.loginId !== null ? true : false;
        if (isLoggedInLc) {
            history.push("/dashboard");
        } else {
            dispatch(logout());

        }
    }, []);

    useEffect(() => {
        if (isUserRegistered === true) {
            toastConfig.successToast(message.message);
            setTimeout(() => {
                history.push("/login-page");
            }, 2000);
        }

        if (isUserRegistered === false) {
            // console.log("toast err")
            toastConfig.errorToast(message.message);
        }
        // return () => {
        //     dispatch(udpateRegistrationStatus());
        // };
    }, [isUserRegistered, dispatch, history, message]);


    const enableSocialLogin = (flag, response) => {
        setIsModalOpen(true);
        toastConfig.warningToast("Please add mobile number & bussiness category.")
        setFullName(response?.profileObj?.name);
        setEmail(response?.profileObj?.email)
    }
    const queryStringUrl = window.location.search;


    //function to get pending details like mobile number,bussiness caregory code
    const getPendingDetails = (mobileNumber, businessCategoryCode) => {
        let businessType = 1;
        if (mobileNumber && businessCategoryCode) {
            setBtnDisable(true);
            dispatch(
                register({
                    fullname: fullName,
                    mobileNumber: mobileNumber,
                    email: email,
                    business_cat_code: businessCategoryCode,
                    businessType,
                    isDirect: true,
                    created_by: null,
                    plan_details: queryString,
                    is_social: true
                })
            )
                .unwrap()
                .then((res) => {
                    setBtnDisable(false);
                })
                .catch((err) => {
                    setBtnDisable(false);
                });
        }

    }

    const modalBody = () => {
        return (
            <>
                <AfterSignUp hideDetails={true} fullName={fullName} email={email} getPendingDetails={getPendingDetails} />
            </>
        );
    };

    return (
        <React.Fragment>
            <Header />
            <CustomModal
                modalBody={modalBody}
                headerTitle={"Registration"}
                modalToggle={isModalOpen}
                fnSetModalToggle={setIsModalOpen}
            />
            <main className="container-fluid">
                <div className={`d-flex flex-row flex-xs-column-reverse mt-3 ${classes.flex_xs_column_reverse_cob}  ${classes.container_custom} `}>
                    <div className={`${classes.right_screen}`}>
                        <div className="p-4 text-center ">
                            <h1>Empower your</h1>
                            <h2>Business</h2>
                            <h4>Boost your finance</h4>
                            <img src={signupBnr} className={` ${classes.signup_banner}`} alt="banner" />
                        </div>
                    </div>
                    <div className={`${classes.left_screen} card`}>
                        <div className="p-4">
                            <h4 className="text-center">Welcome to SabPaisa</h4>
                            <p className="text-center">Sign up  to Create New Account</p>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={FORM_VALIDATION}
                                onSubmit={(values, { resetForm }) => {
                                    handleRegistration(values, { resetForm });
                                }}
                            >
                                {(formik, resetForm) => (
                                    <Form>
                                        <div className={`form-row ${classes.form_row_cob}`}>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label htmlFor="inputEmail4" className="form-label">Full Name</label>
                                                <Field
                                                    className="form-control"
                                                    maxLength={255}
                                                    id="fullname"
                                                    placeholder="Full Name"
                                                    type="text"
                                                    name="fullname"
                                                    size={50}
                                                />
                                                <ErrorMessage name="fullname">
                                                    {(msg) => (<p className="text-danger">{msg}</p>
                                                    )}
                                                </ErrorMessage>
                                            </div>

                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label htmlFor="inputEmail4" className="form-label">Mobile Number</label>
                                                <Field
                                                    className="form-control"
                                                    maxLength={10}
                                                    id="mobilenumber"
                                                    placeholder="Mobile Number"
                                                    name="mobilenumber"
                                                    type="text"
                                                    pattern="\d{10}"
                                                    size={10}
                                                    onKeyDown={(e) =>
                                                        ["e", "E", "+", "-", "."].includes(
                                                            e.key
                                                        ) && e.preventDefault()
                                                    }
                                                />
                                                <ErrorMessage name="mobilenumber">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>
                                            </div>
                                        </div>

                                        <div className={`form-row ${classes.form_row_cob}`}>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label htmlFor="inputEmail4" className="form-label">Email ID</label>
                                                <Field
                                                    className="form-control"
                                                    maxLength={255}
                                                    id="email"
                                                    placeholder="Enter your email"
                                                    name="emaill"
                                                    size={50}
                                                />
                                                <ErrorMessage name="emaill">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>
                                            </div>

                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label htmlFor="inputEmail4" className="form-label"> Business Category</label>
                                                <Field
                                                    name="business_cat_code"
                                                    className="form-select"
                                                    component="select"
                                                >
                                                    <option
                                                        type="text"
                                                        className="form-control"
                                                        id="businesscode"
                                                        value={""}
                                                    >
                                                        Select Business
                                                    </option>
                                                    {businessCode?.map((business, i) => (
                                                        <option
                                                            value={business.category_id}
                                                            key={uuidv4()}
                                                        >
                                                            {business.category_name}
                                                        </option>
                                                    ))}
                                                </Field>
                                                <ErrorMessage name="business_cat_code">
                                                    {(msg) => (
                                                        <p className="abhitest errortxt">
                                                            {msg}
                                                        </p>
                                                    )}
                                                </ErrorMessage>
                                            </div>
                                        </div>


                                        <div className={`form-row ${classes.form_row_cob}`}>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label className="label" htmlFor="user-pw" >Create Password</label>
                                                <div className="input-group">
                                                    <Field
                                                        className="form-control"
                                                        maxLength={255}
                                                        id="user-pws"
                                                        placeholder="Password"
                                                        type={
                                                            valuesIn.showPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="passwordd"
                                                        autoComplete="off"
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" onClick={handleClickShowPassword} id="basic-addon2">
                                                            {valuesIn.showPassword ? (<i className="fa fa-eye" ariaHidden="true" ></i>) : (<i className="fa fa-eye-slash" ariaHidden="true"></i>
                                                            )}</span>
                                                    </div>
                                                </div>
                                                <ErrorMessage name="passwordd">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>

                                            </div>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label className="label" htmlFor="user-pw" >Confirm Password</label>
                                                <div className="input-group">
                                                    <Field
                                                        className="form-control"
                                                        maxLength={255}
                                                        id="user-cpw"
                                                        placeholder="Re-enter the password"
                                                        type={
                                                            passwordType.showPasswords
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        name="confirmpasswordd"
                                                        size={50}
                                                    />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" onClick={togglePassword} id="basic-addon2">
                                                            {passwordType.showPasswords ? (<i className="fa fa-eye" ariaHidden="true" ></i>) : (<i className="fa fa-eye-slash" ariaHidden="true"></i>
                                                            )}</span>
                                                    </div>

                                                </div>
                                                <ErrorMessage name="confirmpasswordd">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>


                                            </div>
                                        </div>
                                        <div className="bd-highlight text-center sp-font-12">
                                            <div className="form-check">
                                                <Field
                                                    className="form-check-input border border-primary"
                                                    name="terms_and_condition"
                                                    type="checkbox"
                                                    id="flexCheckDefault"

                                                />

                                                <lable>
                                                    I have read the <a href="https://sabpaisa.in/term-conditions/" rel="noreferrer" target="_blank" className="text-primary">Terms &amp; Conditions </a> and <a href="https://sabpaisa.in/privacy-policy/" rel="noreferrer" target="_blank" className="text-primary">Privacy Policy</a> and hereby grant my consent for utilization and processing of data accordingly
                                                </lable>
                                                <p className="text-danger">{formik?.errors?.terms_and_condition}</p>
                                            </div>

                                        </div>
                                        <div className={`form-row ${classes.form_row_cob}`}>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2 m-2 justify-content-center d-flex">

                                                <button
                                                    className="cob-btn-primary btn text-white disabled1 w-100"
                                                    name="commit"
                                                    type="submit"
                                                    defaultValue="Create Account"
                                                    disabled={
                                                        btnDisable ||
                                                            !(formik.isValid && formik.dirty)
                                                            ? true
                                                            : false
                                                    }
                                                    data-rel={btnDisable}
                                                >
                                                    Create Account
                                                </button>
                                            </div>

                                            {/* <div className="d-flex justify-content-center mt-2"> */}
                                            {/* <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign up with Google"} /> */}
                                            {/* </div> */}
                                        </div>
                                        <p className="text-center">OR</p>
                                        <div className="d-flex justify-content-center m-2">
                                            <GoogleLoginButton enableSocialLogin={enableSocialLogin} fullName={fullName} email={email} btnText={"Sign up with Google"} />

                                        </div>
                                    </Form>
                                )}
                            </Formik>

                            <div className="text-center">

                                <p className="sp-font-14">Already have an account with SabPaisa?  <Link
                                    to={`/login/${queryStringUrl}`}
                                    className="text-primary text-decoration-underline pb-2"
                                >
                                    Login
                                </Link></p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="d-flex justify-content-center bd-highlight mt-4">
                    <div className="p-1 bd-highlight sp-font-12 text-center"><p className="m-0">Copyright @ 2023 SabPaisa All Rights Reserved version 1.0</p></div>
                </div>
            </main>
        </React.Fragment>

    )
}

export default Signup