import React, { useEffect, useState } from "react";
// import HeaderPage from "../login/HeaderPage";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { logout, register, udpateRegistrationStatus } from "../../../slices/auth";
import { useHistory, Link } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import API_URL from "../../../config";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import AfterSignUp from "../../../components/social-login/AfterSignup";
import classes from "./signup.module.css"
import Header from '../header/Header'
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import CustomModal from "../../../_components/custom_modal";


const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
    fullname: Yup.string()
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required("Required"),
    mobilenumber: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "Phone number in not valid")
        .max(10, "too long"),
    emaill: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Required"),
    passwordd: Yup.string()
        .required("Password Required")
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    confirmpasswordd: Yup.string()
        .oneOf([Yup.ref("passwordd"), null], "Passwords must match")
        .required("Confirm Password"),
    business_cat_code: Yup.string().required("Required"),
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

    //details from goole sign in
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
                requestId: null,
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
                setBtnDisable(false);
            });
    };

    const handleClickShowPassword = () => {
        setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
    };

    useEffect(() => {
        const userLocalData = JSON.parse(sessionStorage.getItem("user"));
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
            toast.success(message.message, {
                position: "top-right",
                autoClose: 5000,
                limit: 1,
                transition: Zoom,
            });
            setTimeout(() => {
                history.push("/login-page");
            }, 2000);
        }

        if (isUserRegistered === false) {
            toast.error(message.message, {
                position: "top-right",
                autoClose: 5000,
                limit: 2,
                transition: Zoom,
            });
        }
        return () => {
            dispatch(udpateRegistrationStatus());
        };
    }, [isUserRegistered, dispatch, history, message]);


    const enableSocialLogin = (flag, response) => {
        setIsModalOpen(true);
        toast.warning("Please add mobile number & bussiness category.")
        setFullName(response?.profileObj?.familyName);
        setEmail(response?.profileObj?.email);

    }
    const queryStringUrl = window.location.search;


    //function to get pending details like mobile number,bussiness caregory code
    const getPendingDetails = (mobileNumber, businessCategoryCode) => {
        let businessType = 1;
        console.log(mobileNumber, businessCategoryCode);
        if (mobileNumber && businessCategoryCode) {
            setBtnDisable(true);
            dispatch(
                register({
                    fullname: fullName,
                    mobileNumber: mobileNumber,
                    email: email,
                    business_cat_code: businessCategoryCode,
                    // password: passwordd,
                    businessType,
                    isDirect: true,
                    requestId: null,
                    plan_details: queryString,
                    is_social: true
                })
            )
                .unwrap()
                .then((res) => {
                    console.log(res);
                    setBtnDisable(false);
                    // resetForm();
                })
                .catch((err) => {
                    setBtnDisable(false);
                });
        }

    }

    const modalBody = () => {
        return (
            <>
                <AfterSignUp hideDetails={true} getPendingDetails={getPendingDetails} />
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
                            <img src="https://partner.sabpaisa.in/static/media/COB.291fe45cb61eeb6e8b0d.png" className={` ${classes.signup_banner}`} />
                        </div>
                    </div>
                    <div className={`${classes.left_screen}`}>
                        <div className="p-4">
                            <h4 className="text-center">Welcome to Sabpaisa</h4>
                            <p className="text-center">Sign up  to Create New Account</p>
                            <Formik
                                initialValues={{
                                    fullname: "",
                                    mobilenumber: "",
                                    emaill: "",
                                    passwordd: "",
                                    business_cat_code: "",
                                    confirmpasswordd: "",
                                    terms_and_condition: false,
                                }}
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
                                                    type="email"
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
                                                            key={i}
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
                                                            {valuesIn.showPassword ? (<i className="fa fa-eye" aria-hidden="true" ></i>) : (<i className="fa fa-eye-slash" aria-hidden="true"></i>
                                                            )}</span>
                                                    </div>
                                                </div>
                                                <ErrorMessage name="passwordd">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>

                                            </div>
                                            <div className="form-group col-lg-6 col-md-6 col-sm-12 p-2">
                                                <label className="label" htmlFor="user-pw" >Create Password</label>
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
                                                            {passwordType.showPasswords ? (<i className="fa fa-eye" aria-hidden="true" ></i>) : (<i className="fa fa-eye-slash" aria-hidden="true"></i>
                                                            )}</span>
                                                    </div>

                                                </div>
                                                <ErrorMessage name="confirmpasswordd">
                                                    {(msg) => (<p className="text-danger">{msg}</p>)}
                                                </ErrorMessage>


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
                                                    Create an account
                                                </button>
                                            </div>
                                            
                                            {/* <div className="d-flex justify-content-center mt-2"> */}
                                          {/* <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign up with Google"} /> */}
                                        {/* </div> */}
                                        </div>
                                        <div className="d-flex justify-content-center m-2">
                                        <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign up with Google"} />
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
                        <div className="bd-highlight text-center sp-font-12"><p>By signing up, you agree to our Terms &amp; Conditions and Privacy Policy</p></div>
                    </div>
                </div>
                <div className="d-flex justify-content-center bd-highlight mb-3">
                    <div className="p-1 bd-highlight sp-font-12 text-center"><p>Copyright @ 2023 SabPaisa All Rights Reserved version 1.0</p></div>
                </div>
            </main>
        </React.Fragment>

    )
}

export default Signup