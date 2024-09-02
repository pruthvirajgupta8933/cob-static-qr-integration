import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from "../../../_components/formik/Yup";
import { useDispatch, useSelector } from "react-redux";
import { logout, register, udpateRegistrationStatus } from "../../../slices/auth";
import { useHistory, Link } from "react-router-dom";
import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import AfterSignUp from "../../../components/social-login/AfterSignup";
// import classes from "./signup.module.css"
import classes from "../login/login.module.css"
import Header from '../header/Header'
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import CustomModal from "../../../_components/custom_modal";
import signupBnr from "../../../assets/images/signup-banner.svg"
// import { v4 as uuidv4 } from 'uuid';
import toastConfig from "../../../utilities/toastTypes";
import useMediaQuery from "../../../hooks/useMediaQuery";
import arrow_one from "../../../assets/images/arrow_one.png"
import arrow_two from "../../../assets/images/arrow_two.png"

const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const initialValues = {
    fullname: "",
    mobilenumber: "",
    emaill: "",
    passwordd: "",
    business_cat_code: "38",
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
    // const [passwordType, setPasswordType] = useState({
    //     confirmpassword: "",
    //     showPasswords: false,
    // });

    const [valuesIn, setValuesIn] = useState({
        password: "",
        showPassword: false,
    });


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const dispatch = useDispatch();

    const isDesktop = useMediaQuery('(min-width: 993px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width:  992px)');
    const isMobile = useMediaQuery('(max-width: 767px)');

    // const togglePassword = () => {
    //     setPasswordType({
    //         ...passwordType,
    //         showPasswords: !passwordType.showPasswords,
    //     });
    // };



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
            history.replace("/dashboard");
        } else {
            dispatch(logout());

        }
    }, []);

    useEffect(() => {
        if (isUserRegistered === true) {
            toastConfig.successToast(message.message);
            setTimeout(() => {
                history.replace("/login");
                dispatch(udpateRegistrationStatus());
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
            <AfterSignUp hideDetails={true} fullName={fullName} email={email} getPendingDetails={getPendingDetails} />
        );
    };

    return (
        <React.Fragment>
            <CustomModal
                modalBody={modalBody}
                headerTitle={"Registration"}
                modalToggle={isModalOpen}
                fnSetModalToggle={setIsModalOpen}
            />

            <div className={`container-fluid p-0`}>
                <div className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}>
                    <div className={`col-lg-5 text-white ${classes.background_image_left}`}>
                        <div className="container-fluid text-center d-flex flex-column h-100">
                            <div className="row align-items-start flex-grow-1">
                                <div className="col">
                                    {isDesktop && <Header display_bg_color={false} />}
                                </div>
                            </div>
                            <div className="row align-items-center flex-grow-1">
                                <div className="col">
                                    <div className="p-4 text-center">
                                        <img src={signupBnr} alt="banner" className={`${classes.login_banner}`} />
                                        <div className={`my-5  ${classes.sp_font_24}`} >
                                            <p className="text-white">Welcome to Your Dashboard</p>
                                            <p className={`m-0 text-white ${classes.sp_font_17}`} >Quick onboarding | Easy Integration |</p>
                                            <p className={`m-0 text-white ${classes.sp_font_17}`}>Feature filled Checkout</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row align-items-start flex-grow-1" >
                                <div className={`col-lg-2 col-md-1 col-sm-1 d-flex justify-content-end`}>
                                    <img src={arrow_two} alt="arrow" className={`${classes.left_side_arrow}`} />
                                </div>
                                <div className="col-lg-8 col-md-10 col-sm-10">
                                    <div className="text-center">
                                        <div className={`${classes.sp_font_20}`} >
                                            <h4 className={`hr_line text-white`}>Need help? Contact us</h4>

                                        </div>
                                        <div className="d-flex justify-content-around my-1 ">
                                            <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-envelope"></i> support@sabpaisa.in</p>
                                            <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-phone"></i> 011-41733223</p>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-1 col-sm-1"></div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>


                    <div className="col-lg-7 d-flex justify-content-center p-0 scroll-bar-hide bg-auth">
                        <div className="container-fluid d-flex flex-column h-100 p-0">
                            <div className="row align-items-start flex-grow-1" >
                                <div className="col">
                                    {(isTablet || isMobile) &&
                                        <Header display_bg_color={true} />}
                                    <img src={arrow_one} alt="arrow" className={`${classes.right_side_arrow}`} />
                                </div>
                            </div>

                            <div className="row align-items-start flex-grow-1 mt-md-5 mt-sm-5">
                                <div className="col-lg-3 col-md-2 col-sm-2 col-xs-2"></div>
                                <div className={`col ${classes.form_container}`}>

                                    <h5 className={`text-center  text_primary_color heading ${classes.heading}`}>Welcome to SabPaisa</h5>
                                    <h6 className={`text-center mb-4  sub_heading ${classes.sub_heading}`}>Create New Account</h6>
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={FORM_VALIDATION}
                                        onSubmit={(values, { resetForm }) => {
                                            handleRegistration(values, { resetForm });
                                        }}
                                    >
                                        {(formik, resetForm) => (
                                            <Form>
                                                <div className="mb-3">
                                                    <label className="form-label font-weight-bold font-size-16">Full Name <span className="text-danger">*</span></label>
                                                    <Field
                                                        className="form-control"
                                                        maxLength={255}
                                                        id="fullname"
                                                        placeholder="Enter your full name"
                                                        type="text"
                                                        name="fullname"
                                                        size={50}
                                                    />
                                                    <ErrorMessage name="fullname">
                                                        {(msg) => (<p className="text-danger">{msg}</p>
                                                        )}
                                                    </ErrorMessage>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label font-weight-bold font-size-16">Mobile Number <span className="text-danger">*</span></label>
                                                    <Field
                                                        className="form-control"
                                                        maxLength={10}
                                                        id="mobilenumber"
                                                        placeholder="Enter your mobile number"
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

                                                <div className="mb-3">
                                                    <label className="form-label font-weight-bold font-size-16">Email ID <span className="text-danger">*</span></label>
                                                    <Field
                                                        className="form-control"
                                                        maxLength={255}
                                                        id="email"
                                                        placeholder="Enter your email ID"
                                                        name="emaill"
                                                        size={50}
                                                        autocomplete="off"
                                                    />
                                                    <ErrorMessage name="emaill">
                                                        {(msg) => (<p className="text-danger">{msg}</p>)}
                                                    </ErrorMessage>
                                                </div>

                                                <div className="mb-3 ">
                                                    <label className="label font-weight-bold font-size-16" htmlFor="user-pw" >Password <span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <Field
                                                            className="form-control border-right-0"
                                                            maxLength={255}
                                                            id="user-pws"
                                                            placeholder="Password"
                                                            type={
                                                                valuesIn.showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="passwordd"
                                                            autocomplete="new-password"
                                                        />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text border-left-0 bg-transparent" onClick={handleClickShowPassword} id="basic-addon2">
                                                                {valuesIn.showPassword ? (<i className="fa fa-eye" ariaHidden="true" ></i>) : (<i className="fa fa-eye-slash" ariaHidden="true"></i>
                                                                )}</span>
                                                        </div>
                                                    </div>
                                                    <ErrorMessage name="passwordd">
                                                        {(msg) => (<p className="text-danger">{msg}</p>)}
                                                    </ErrorMessage>

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
                                                    <div className="form-group col-lg-12">

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
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>



                                    <h6 className={`hr_line_or my-2 `} >or</h6>
                                    <div className="d-flex justify-content-center">
                                        <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign in with Google"} />
                                    </div>

                                    <div className="text-center my-5">
                                        <p className={`${classes.sp_font_20} `}>Already have an account with SabPaisa?  <Link
                                            to={`/login/${queryStringUrl}`}
                                            className="text-primary text-decoration-underline pb-2"
                                        >
                                            Login
                                        </Link></p>
                                    </div>


                                </div>
                                <div className="col-lg-3 col-md-2 col-sm-2 col-xs-2"></div>

                            </div>

                            <div className="row align-items-end flex-grow-1">
                                <div className="col">
                                    <div className="p-2 bd-highlight sp-font-12 text-center">
                                        <p className="bd-highlight text-center sp-font-12">
                                            Copyright @ {new Date().getFullYear()} SabPaisa All Rights Reserved version 1.0 | &nbsp;
                                            <a href="https://sabpaisa.in/term-conditions/" rel="noreferrer" target="_blank" className="text-primary">Terms &amp; Conditions </a>&nbsp;and &nbsp;
                                            <a href="https://sabpaisa.in/privacy-policy/" rel="noreferrer" target="_blank" className="text-primary">Privacy Policy</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </React.Fragment>

    )
}

export default Signup