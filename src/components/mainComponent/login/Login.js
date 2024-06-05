import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import Yup from "../../../_components/formik/Yup";
import { login, logout } from "../../../slices/auth";
import { clearMessage } from "../../../slices/message";
import sbbnner from "../../../assets/images/login-banner.png"
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import Header from '../header/Header'
import classes from "./login.module.css"
import toastConfig from "../../../utilities/toastTypes";

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
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });

    const dispatch = useDispatch();
    const { user, userAlreadyLoggedIn } = authentication;

    useEffect(() => {
        const userLocalData = JSON.parse(localStorage.getItem("user"));
        const isLoggedInLc =
            userLocalData && userLocalData.loginId !== null ? true : false;
        if (isLoggedInLc) {
            if (userAlreadyLoggedIn && user?.loginStatus === "Activate") {
                // console.log("push to dashboard")
                history.push("/dashboard");
            }
        } else {
            dispatch(logout());
        }
    }, [userAlreadyLoggedIn, user, dispatch, history]);

    // useEffect(() => {
    //     setAuthData(authentication);
    // }, [authentication]);

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
                    // window.location.href = `https://sabpaisa.in/pricing/`;

                }
            }).catch(err => console.log("err", err))
        }
    }
    // const queryStringUrl = window.location.search;


    return (
        <div className={`container-fluid p-0`}>
            <div className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}>
                <div className={`${classes.background_image_left} col-lg-5`}>
                    <Header />
                    <div className={`${classes.right_screen_} text-white`}>
                        <div className="p-4 text-center">
                            <img src={sbbnner} alt="banner" className={`${classes.login_banner}`} />
                            <h1>An all-in-one</h1>
                            <h2>Dashboard</h2>
                            <h4>Trusted by over 3000+ Mega Clients</h4>

                        </div>

                        <p>Need help? Contact us</p>
                        <div className="d-flex-inline">
                            <p>Support@sabpaisa.in</p>
                            <p>011-41733223</p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7 col-lg-7 d-flex justify-content-center">
                    <div className={`${classes.left_screen_}`}>
                        <div className={`${classes.form_container}`}>
                            <h4 className="text-center">Login</h4>
                            <p className="text-center">Login to your merchant account</p>
                            <Formik
                                initialValues={{
                                    ...INITIAL_FORM_STATE,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleLogin}
                            >
                                {(formik) => (<Form>
                                    <div className="mb-3">
                                        <label htmlFor="userName" className="form-label">Email ID</label>
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
                                    <label htmlFor="userPassword" className="form-label">Password</label>

                                    <div className="m-0 input-group">
                                        <Field
                                            className="form-control"
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
                                        <div className="input-group-append">
                                            <span className="input-group-text" onClick={handleClickShowPassword}>  {values.showPassword ? (
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


                                    <div className="form-text p-2 text-right">
                                        <Link to={`/forget/${queryString}`} className="text-decoration-underline">
                                            Forgot Password ?
                                        </Link>
                                    </div>
                                    <div className="d-flex">
                                        <button type="submit" className="btn  cob-btn-primary  w-100 mb-2 "
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <span className="spinner-grow spinner-grow-sm text-light mr-1"></span>
                                            )}Login <i className="fa fa-sign-in" ariaHidden="true"></i></button>
                                    </div>

                                </Form>
                                )}
                            </Formik>
                            <h6 className={`text-center mt-1 ${classes.text_line}`} >OR</h6>
                            <div className="d-flex justify-content-center">
                                <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign in with Google"} />
                            </div>

                            <div className="text-center mt-2">
                                <p className={`${classes.sp_font_14}`}>Don’t have an account with SabPaisa?
                                    <a className="text-primary text-decoration-underline" href={`https://sabpaisa.in/pricing/`}> Sign Up</a></p>
                            </div>
                        </div>


                        <div className="">
                            <div className="p-2 bd-highlight sp-font-12 text-center">Copyright @ {new Date().getFullYear()} SabPaisa All Rights Reserved version 1.0 |   <div className="bd-highlight text-center sp-font-12"><p><a href="https://sabpaisa.in/term-conditions/" rel="noreferrer" target="_blank">Terms &amp; Conditions </a> | <a href="https://sabpaisa.in/privacy-policy/" rel="noreferrer" target="_blank">Privacy Policy</a></p></div></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login