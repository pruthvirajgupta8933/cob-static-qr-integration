/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import HeaderPage from "./HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import sabpaisalogo from "../../assets/images/sabpaisa-logo-white.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { isUserAlreadyLogin, login } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import { toast } from "react-toastify";
import "./Login.css";

const INITIAL_FORM_STATE = {
  clientUserId: "",
  userPassword: "",
};

const FORM_VALIDATION = Yup.object().shape({
  clientUserId: Yup.string().required("Required"),
  userPassword: Yup.string()
    .min(6, "Password minimum length should be 6")
    .required("Password is required"),
});

function LoginPage() {
  console.log("load components");

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const authentication = useSelector((state) => state.auth);
  console.log(authentication);
  // const {auth} = useSelector(state => state);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [auth, setAuthData] = useState(authentication);
  // const [otp, setOtp] = useState({ otp: "" });
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const dispatch = useDispatch();

  // message = message?.length>=0?message=null:message;
  // console.log(message)
  const { user, userAlreadyLoggedIn } = auth;
  // console.log(auth)

  useEffect(() => {
    // if user already logged in then redirect to the dashboard
    const userLocalData = JSON.parse(localStorage.getItem("user"));
    const isLoggedInLc =
      userLocalData && userLocalData.loginId !== null ? true : false;

    dispatch(isUserAlreadyLogin(isLoggedInLc));
    if (
      (userAlreadyLoggedIn || isLoggedInLc) &&
      user?.loginStatus === "Activate"
    ) {
      // console.log("login1");
      history.push("/dashboard");
    }
  }, [userAlreadyLoggedIn, user]);

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
    dispatch(login({ username, password }))
      .then((res) => {
        // console.log(res?.payload?.user)
        if (res?.payload?.user) {
          const activeStatus = res?.payload?.user?.loginStatus;
          const loginMessage = res?.payload?.user?.loginMessage;
          if (activeStatus === "Activate" && loginMessage === "success") {
            // console.log("user redirect to dashboard")
            history.push("/dashboard");
            setLoading(false);
          } else {
            if (loginMessage === "Pending") {
              toast.error("User Not Verified, Please Check your email");
            }
            setLoading(false);
          }
        } else {
          setLoading(false);
          toast.error("Username or Email Not Correct");
        }
      })
      .catch((err) => {
        toast.error("Something went wrong" + err?.message);
        setLoading(false);
        // console.log(err)
      });
  };

  // useEffect(() => {

  //   if (isLoggedIn) {

  //       console.log("login2");
  //       console.log(user)
  //       // if(user?.role==='14' || user?.role==='15'){
  //       //   history.push("/dashboard/approver")
  //       // }else{
  //       //   history.push("/dashboard")
  //       // }
  //   }

  //     // setLoading(false);

  // }, [isLoggedIn])

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };



  return (
    <>
      <HeaderPage />
      {/* <p className="showErrormsg">{message && message!=''?message:''}</p> */}
      <div className="container-fluid toppad">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-7 authfy-panel-right push-right nopad">
              {/* authfy-login start */}
              <div className="authfy-login">
                {/* panel-login start */}
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                      <ul className="logmod__tabs">
                        <li data-tabtar="lgm-2" className="current">
                          <a href={() => false} style={{ width: "100%" }}>
                            Login
                          </a>
                        </li>
                        {/*<li data-tabtar="lgm-1"><a href="#">Sign Up</a></li>*/}
                      </ul>
                      <div className="logmod__tab-wrapper">
                        <div className="logmod__tab lgm-2 show">
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle">
                              Enter your email and password{" "}
                              <strong>to sign in</strong>
                            </span>
                          </div>
                          <div className="logmod__form">
                            <Formik
                              initialValues={{
                                ...INITIAL_FORM_STATE,
                              }}
                              validationSchema={FORM_VALIDATION}
                              onSubmit={handleLogin}
                            >
                              <Form>
                                <div className="sminputs">
                                  <div className="input full">
                                    <label
                                      className="string optional"
                                      htmlFor="user-name"
                                    >
                                      User name*
                                    </label>
                                    <Field
                                      className="string optional"
                                      maxLength={255}
                                      id="user-email"
                                      placeholder="user name"
                                      type="text"
                                      name="clientUserId"
                                      autoComplete="username"
                                    />
                                    <ErrorMessage name="clientUserId">
                                      {(msg) => (
                                        <div
                                          className="abhitest"
                                          style={{
                                            color: "red",
                                            position: "absolute",
                                            zIndex: " 999",
                                          }}
                                        >
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                                <div className="sminputs">
                                  <div className="input full">
                                    <label
                                      className="string optional"
                                      htmlFor="user-pw"
                                    >
                                      Password *
                                    </label>
                                    <Field
                                      className="string optional"
                                      maxLength={255}
                                      id="user-pw"
                                      placeholder="Password"
                                      type={
                                        values.showPassword
                                          ? "text"
                                          : "password"
                                      }
                                      size={50}
                                      name="userPassword"
                                      autoComplete="current-password"
                                    />
                                    <ErrorMessage name="userPassword">
                                      {(msg) => (
                                        <div
                                          className="abhitest"
                                          style={{
                                            color: "red",
                                            position: "absolute",
                                            zIndex: " 999",
                                          }}
                                        >
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                    <span
                                      className="hide-password"
                                      onClick={handleClickShowPassword}
                                    >
                                      {values.showPassword ? "Hide" : "Show"}
                                    </span>
                                  </div>
                                </div>

                                <div className="simform__actions">
                                  {/*<input className="sumbit" name="commit" type="sumbit" value="Log In" />*/}
                                  <button
                                    className="sumbit"
                                    type="sumbit"
                                    style={{ color: "#fff" }}
                                    disabled={loading ? true : false}
                                  >
                                    {loading && (
                                      <span
                                        className="spinner-border "
                                        role="status"
                                      ></span>
                                    )}
                                    LogIn
                                  </button>
                                  {/* <span className="simform__actions-sidetext">
                                     <Link
                                      className="special"
                                      role="link"
                                      to="#"
                                      // to="/forget"
                                    >
                                      Forgot your password? Click here
                                    </Link> 
                                  </span>*/}
                                </div>
                              </Form>
                            </Formik>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* ./panel-login */}
                {/* panel-forget start */}
                <div className="authfy-panel panel-forgot">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      <div className="authfy-heading">
                        <h3 className="auth-title">Recover your password</h3>
                        <p>
                          Fill in your e-mail address below and we will send you
                          an email with further instructions.
                        </p>
                      </div>
                      <form
                        name="forgetForm"
                        className="forgetForm"
                        action="#"
                        method="POST"
                      >
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            name="username"
                            placeholder="Email address"
                          />
                        </div>
                        <div className="form-group">
                          <button
                            className="btn btn-lg btn-primary btn-block"
                            type="submit"
                          >
                            Recover your password
                          </button>
                        </div>
                        <div className="form-group">
                          <a
                            className="lnk-toggler"
                            data-panel=".panel-login"
                            href={() => false}
                          >
                            Already have an account?
                          </a>
                        </div>
                        <div className="form-group">
                          <a
                            className="lnk-toggler"
                            data-panel=".panel-signup"
                            href={() => false}
                          >
                            Don’t have an account?
                          </a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>{" "}
                {/* ./panel-forgot */}
              </div>{" "}
              {/* ./authfy-login */}
            </div>
            <div className="col-sm-5 authfy-panel-left push-left">
              <div className="brand-col">
                <div className="headline">
                  {/* brand-logo start */}
                  <div className="brand-logo">
                    <img
                      src={sabpaisalogo}
                      width={150}
                      alt="SabPaisa"
                      title="SabPaisa"
                    />
                  </div>
                  {/* ./brand-logo */}
                  <p style={{ fontSize: "24px", lineHeight: "20px" }}>
                    Receive Payments, The Easy Way
                  </p>
                  <h1 style={{ fontSize: "24px" }}>A Payments Solution for</h1>
                  <h1 style={{ fontSize: "24px", whiteSpace: "10px" }}>
                    Businesses,&nbsp;SMEs,&nbsp;Freelancers, Homepreneurs.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* ./row */}
      </div>
    </>
  );
}

export default LoginPage