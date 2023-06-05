import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-toastify";
// import FormikController from "../../../_components/formik/FormikController";

import { login, logout } from "../../../slices/auth";
import { clearMessage } from "../../../slices/message";
import imageSlide1 from "../../../assets/images/COB.png";
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import Header from '../header/Header'
import classes from "./login.module.css"
// import api from './api';

const INITIAL_FORM_STATE = {
    clientUserId: "",
    userPassword: "",
};

const FORM_VALIDATION = Yup.object().shape({
    clientUserId: Yup.string().required("Please enter username"),
    userPassword: Yup.string().required("Please enter Password"),
});


function Login() {
    const authentication = useSelector((state) => state.auth);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [auth, setAuthData] = useState(authentication);
    const [namee, setNamee] = useState("");

    const [values, setValues] = useState({
        password: "",
        showPassword: false,
    });

    const dispatch = useDispatch();

    const { user, userAlreadyLoggedIn } = auth;

    useEffect(() => {
        const userLocalData = JSON.parse(sessionStorage.getItem("user"));
        const isLoggedInLc =
            userLocalData && userLocalData.loginId !== null ? true : false;
        // console.log("isLoggedInLc",isLoggedInLc)
        if (isLoggedInLc) {
            // console.log("userAlreadyLoggedIn",userAlreadyLoggedIn)
            // console.log("user?.loginStatus",user?.loginStatus)
            if (userAlreadyLoggedIn && user?.loginStatus === "Activate") {
                // console.log("push to dashboard")
                history.push("/dashboard");
            }
        } else {
            dispatch(logout());
        }
    }, [userAlreadyLoggedIn, user, dispatch, history]);

    useEffect(() => {
        setAuthData(authentication);
    }, [authentication]);

    useEffect(() => {
        dispatch(clearMessage());
    }, [dispatch]);

    const handleLogin = (formValue) => {
        const { clientUserId, userPassword } = formValue;

        const username = clientUserId;
        const password = userPassword;

        setLoading(true);
        dispatch(login({ username, password })).then((res) => {
            if (res?.payload?.user) {
                const activeStatus = res?.payload?.user?.loginStatus;
                const loginMessage = res?.payload?.user?.loginMessage;
                if (activeStatus === "Activate" && loginMessage === "success") {
                    history.push("/dashboard");
                    // customLogin();
                    setLoading(false);
                } else {
                    if (loginMessage === "Pending") {
                        toast.error(loginMessage);
                    }
                    setLoading(false);
                }
            } else {
                setLoading(false);
                toast.error(res?.payload ?? "Rejected"); ///////it means when we have server or api response is diffrent it show rejected
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
                        // customLogin();
                        setLoading(false);
                    } else {
                        if (loginMessage === "Pending") {
                            toast.error(loginMessage);
                        }
                        setLoading(false);
                    }
                } else {
                    history.push("/Registration");
                    setLoading(false);
                    toast.error(res?.payload ?? "Rejected"); ///////it means when we have server or api response is diffrent it show rejected
                }
            })
        }
    }


    return (
        <React.Fragment>
            <Header />
            <main className="container-fluid">
                <div className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}>
                    <div className={`${classes.right_screen}`}>
                        <div className="p-4 text-center ">
                            <h1>An all-in-one</h1>
                            <h2>Dashboard</h2>
                            <h4>Trusted by over 3000+ Mega Clients</h4>
                            <img src="https://partner.sabpaisa.in/static/media/COB.291fe45cb61eeb6e8b0d.png" className={`${classes.login_banner}`} />
                        </div>
                    </div>

                    <div className={`${classes.left_screen} card`}>
                        <div className={`${classes.form_container}`}>
                            <h4 className="text-center">Welcome to your Dashboard</h4>
                            <p className="text-center">You can login to track and record every transaction in real time.</p>
                            <Formik
                                initialValues={{
                                    ...INITIAL_FORM_STATE,
                                }}
                                validationSchema={FORM_VALIDATION}
                                onSubmit={handleLogin}
                            >
                                {(formik) => (<Form>
                                    <div className="mb-3">
                                        <label htmlFor="userName" className="form-label">Username</label>
                                        <Field
                                            className="form-control"
                                            maxLength={255}
                                            id="user-email"
                                            placeholder="Type your username"
                                            type="text"
                                            name="clientUserId"
                                            onClick={() => setNamee("clientUserId")}
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
                                            placeholder="Type your password"
                                            type={
                                                values.showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            size={50}
                                            name="userPassword"
                                            onClick={() => setNamee("userPassword")}
                                        />
                                        <div className="input-group-append">
                                            <span className="input-group-text" onClick={handleClickShowPassword} id="basic-addon2">  {values.showPassword ? (
                                                <i
                                                    className="fa fa-eye"
                                                    aria-hidden="true"
                                                ></i>
                                            ) : (
                                                <i
                                                    className="fa fa-eye-slash"
                                                    aria-hidden="true"
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
                                    <button type="submit" className="btn  cob-btn-primary  w-100 mb-2 " disabled={
                                        !(formik.isValid && formik.dirty)
                                            ? true
                                            : false
                                    }> {loading && (
                                        <span
                                            class="spinner-grow spinner-grow-sm text-light mr-1"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    )}
                                        Login <i class="fa fa-sign-in" aria-hidden="true"></i></button>
                                    </div>

                                </Form>
                                )}
                            </Formik>
                            <div className="d-flex justify-content-center m-2">
                            {/* <p>OR</p> */}
                            
                            <GoogleLoginButton enableSocialLogin={enableSocialLogin} btnText={"Sign in with Google"} />
                            

                            </div>
                        
                            <div className="text-center mt-2">
                                <p className={`${classes.sp_font_14}`}>Don’t have an account with SabPaisa?  <Link className="text-primary text-decoration-underline" to="/Registration">Sign Up</Link></p>
                            </div>
                        </div>
                        <div className="bd-highlight text-center sp-font-12"><p>Terms &amp; Condition | Privacy Policy</p></div>
                    </div>
                </div>
                <div className="d-flex justify-content-center bd-highlight mt-3 ">
                    <div className="p-2 bd-highlight sp-font-12 text-center">Copyright @ 2023 SabPaisa All Rights Reserved version 1.0</div>
                </div>
            </main>

        </React.Fragment>
    )
}

export default Login