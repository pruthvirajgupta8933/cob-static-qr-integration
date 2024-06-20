import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import Yup from "../../../_components/formik/Yup";
import { login, logout } from "../../../slices/auth";
import { clearMessage } from "../../../slices/message";
import sbbnner from "../../../assets/images/login-banner.png"
import arrow_one from "../../../assets/images/arrow_one.png"
import arrow_two from "../../../assets/images/arrow_two.png"
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import Header from '../header/Header'
import classes from "./login.module.css"
import toastConfig from "../../../utilities/toastTypes";
import useMediaQuery from "../../../hooks/useMediaQuery";



const INITIAL_FORM_STATE = {
    clientUserId: "",
    userPassword: "",
};

const validationSchema = Yup.object().shape({
    clientUserId: Yup.string()
        .required("Please enter username")
        .allowOneSpace(),
    userPassword: Yup.string()
        .required("Please enter Password")
        .allowOneSpace(),
});


function Login() {
    const authentication = useSelector((state) => state.auth);
    const history = useHistory();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });

    const { user, userAlreadyLoggedIn } = authentication;


    const isDesktop = useMediaQuery('(min-width: 993px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width:  992px)');
    const isMobile = useMediaQuery('(max-width: 767px)');


    useEffect(() => {
        const userLocalData = JSON.parse(localStorage.getItem("user"));
        const isLoggedInLc =
            userLocalData && userLocalData.loginId !== null ? true : false;
        if (isLoggedInLc) {
            if (userAlreadyLoggedIn && user?.loginStatus === "Activate") {

                history.push("/dashboard");
            }
        } else {
            dispatch(logout());
        }
    }, [userAlreadyLoggedIn, user, dispatch, history]);



    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const handleLogin = (formValue) => {
        const { clientUserId, userPassword } = formValue;
        const username = clientUserId;
        const password = userPassword;

        setLoading(true);
        dispatch(login({ username, password, is_social: false })).then((res) => {
            if (res?.payload?.user) {
                const activeStatus = res?.payload?.user?.loginStatus;
                const loginMessage = res?.payload?.user?.loginMessage;
                if (activeStatus === "Activate" && loginMessage === "success") {
                    history.push("/dashboard");
                    setLoading(false);
                } else {
                    if (loginMessage === "Pending") {
                        toastConfig.errorToast(loginMessage);
                    }
                    setLoading(false);
                }
            } else {
                setLoading(false);
                toastConfig.errorToast(res?.payload ?? "Rejected"); ///////it means when we have server or api response is diffrent it show rejected
            }
        });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const queryString = window.location.search;
    const enableSocialLogin = (flag, response) => {
        const username = response?.profileObj?.email;
        const is_social = true;
        if (flag) {
            dispatch(login({ username, is_social })).then((res) => {
                if (res?.payload?.user) {
                    const activeStatus = res?.payload?.user?.loginStatus;
                    const loginMessage = res?.payload?.user?.loginMessage;
                    if (activeStatus === "Activate" && loginMessage === "success") {
                        history.push("/dashboard");
                        setLoading(false);
                    } else {
                        if (loginMessage === "Pending") {
                            toastConfig.errorToast(loginMessage);
                        }
                        setLoading(false);
                    }
                } else {

                    setLoading(false);
                    toastConfig.errorToast(res?.payload?.detail ?? "Rejected"); ///////it means when we have server or api response is diffrent it show rejected
                }
            }).catch(err => console.log("err", err))
        }
    }

    return (
        <div className={`container-fluid p-0`}>
            <div className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}>
                <div className={`${classes.background_image_left} col-lg-5 text-white`}>
                    <div className="container-fluid text-center d-flex flex-column h-100">
                        <div className="row align-items-start flex-grow-1">
                            <div className="col">
                                {isDesktop && <Header display_bg_color={false} />}
                            </div>
                        </div>
                        <div className="row align-items-center flex-grow-1">
                            <div className="col">
                                <div className="p-4 text-center">
                                    <img src={sbbnner} alt="banner" className={`${classes.login_banner}`} />
                                    <div className={`my-5  ${classes.sp_font_24}`} >
                                        <p className="text-white">Login to Your Dashboard</p>
                                        <p className={`m-0 text-white ${classes.sp_font_17}`} >One Payment Gateway for</p>
                                        <p className={`m-0 text-white ${classes.sp_font_17}`}>all your needs</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row align-items-start flex-grow-1" >
                            <div className={`col-2 `}>
                                <img src={arrow_two} alt="arrow" className={`${classes.left_side_arrow}`} />
                            </div>
                            <div className="col-8">
                                <div className="text-center">
                                    <div className={`${classes.sp_font_20}`} >
                                        <hr className={`${classes.hr_class_one}`} />
                                        Need help? Contact us
                                        <hr className={`${classes.hr_class_two}`} />
                                    </div>
                                    <div className="d-flex justify-content-around my-1">
                                        <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-envelope"></i> support@sabpaisa.in</p>
                                        <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-phone"></i> 011-41733223</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col-2"></div>
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

                                <h5 className={`text-center  text_primary_color heading ${classes.heading}`}>Login</h5>
                                <h6 className={`text-center mb-4  sub_heading ${classes.sub_heading}`}>Login to your merchant account</h6>
                                <Formik
                                    initialValues={{
                                        ...INITIAL_FORM_STATE,
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={handleLogin}
                                >
                                    {(formik) => (<Form>
                                        <div className="mb-3">
                                            <label htmlFor="userName" className="form-label font-weight-bold font-size-16">Email ID <span className="text-danger">*</span></label>
                                            <Field
                                                className="form-control"
                                                maxLength={255}
                                                id="user-email"
                                                placeholder="Enter your username"
                                                type="text"
                                                name="clientUserId"
                                                autoComplete="off"
                                            />
                                            <ErrorMessage name="clientUserId">
                                                {(msg) => (<div className="text-danger">{msg}</div>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                        <label htmlFor="userPassword" className="form-label font-weight-bold font-size-16">Password <span className="text-danger">*</span></label>

                                        <div className="m-0 input-group">
                                            <Field
                                                className={`form-control border-right-0`}
                                                maxLength={255}
                                                id="user-pw"
                                                placeholder="Enter your password"
                                                type={
                                                    values.showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                size={50}
                                                name="userPassword"
                                                autoComplete="new-password"
                                            />
                                            <div className={`input-group-append `}>
                                                <span className={`input-group-text border-left-0 bg-transparent`} onClick={handleClickShowPassword} >  {values.showPassword ? (
                                                    <i
                                                        className="fa fa-eye"
                                                        ariaHidden="true"
                                                    ></i>
                                                ) : (
                                                    <i
                                                        className="fa fa-eye-slash"
                                                        ariaHidden="true"
                                                    ></i>
                                                )}</span>
                                            </div>
                                        </div>
                                        <ErrorMessage name="userPassword">
                                            {(msg) => (<div className="text-danger" >{msg}</div>)}
                                        </ErrorMessage>


                                        <div className="form-text p-2 my-3 text-right font-size-14">
                                            <Link to={`/forget/${queryString}`} className="text-decoration-underline">
                                                Forgot Password?
                                            </Link>
                                        </div>
                                        <div className="d-flex">
                                            <button type="submit" className="btn  cob-btn-primary  w-100 mb-2 "
                                                disabled={loading}
                                            >
                                                {loading && (
                                                    <span className="spinner-grow spinner-grow-sm text-light mr-1"></span>
                                                )}Login</button>
                                        </div>

                                    </Form>
                                    )}
                                </Formik>
                                <h6 className={`text-center my-2 ${classes.text_line}`} >or</h6>
                                <div className="d-flex justify-content-center">
                                    <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign in with Google"} />
                                </div>

                                <div className="text-center my-5">
                                    <p className={`${classes.sp_font_20}`}>Don’t have an account with SabPaisa?
                                        <a className="text-primary text-decoration-underline" href={`https://sabpaisa.in/pricing/`}> Sign Up</a></p>
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
    )
}

export default Login