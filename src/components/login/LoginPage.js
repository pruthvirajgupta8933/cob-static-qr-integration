
import React, { useState, useEffect } from "react";
import HeaderPage from "./HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { isUserAlreadyLogin, login } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import { toast } from "react-toastify";
import "./Login.css";
import imageSlide1 from "../../assets/images/rafiki.png";
import { Link } from "react-router-dom";

const INITIAL_FORM_STATE = {
  clientUserId: "",
  userPassword: "",
};

const FORM_VALIDATION = Yup.object().shape({
  clientUserId: Yup.string().required("Required"),
  userPassword: Yup.string().required("Password Required"),
});

function LoginPage() {
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const authentication = useSelector((state) => state.auth);

  // const {auth} = useSelector(state => state);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [auth, setAuthData] = useState(authentication);
  const [namee, setNamee] = useState("");

  // const [otp, setOtp] = useState({ otp: "" });
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const dispatch = useDispatch();

  // message = message?.length>=0?message=null:message;
  const { user, userAlreadyLoggedIn } = auth;

  useEffect(() => {
    const userLocalData = JSON.parse(localStorage.getItem("user"));
    const isLoggedInLc =
      userLocalData && userLocalData.loginId !== null ? true : false;

    dispatch(isUserAlreadyLogin(isLoggedInLc));
    if (
      (userAlreadyLoggedIn || isLoggedInLc) &&
      user?.loginStatus === "Activate"
    ) {
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
    dispatch(login({ username, password })).then((res) => {
      // console.log(res?.payload?.user)
      // console.log('asdfghjkl', res, res.payload)
      if (res?.payload?.user) {
        const activeStatus = res?.payload?.user?.loginStatus;
        const loginMessage = res?.payload?.user?.loginMessage;
        if (activeStatus === "Activate" && loginMessage === "success") {
          history.push("/dashboard");
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

  return (
    <>
      <HeaderPage />
      <div className="container-fluid toppad">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-6 authfy-panel-right login-float-right nopad login-float-none">
              <div className="authfy-login">
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                    
                      <div className="logmod__tab-wrapper">
                        <div className="logmod__tab lgm-2 show">
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle"></span>
                            <h1 className="loginHeaderr OpenSans-Regular">
                              Welcome to your Dashboard
                            </h1>
                            <p
                              style={{ color: "#0A2FB6" }}
                              className="loginpara1 OpenSans-Regular"
                            >
                              You can login to track and record every
                              transaction in real time.
                            </p>
                          </div>
                          <div className="logmod__form- m-r-l-100 m0">
                            <Formik
                              initialValues={{
                                ...INITIAL_FORM_STATE,
                              }}
                              validationSchema={FORM_VALIDATION}
                              onSubmit={handleLogin}
                            >
                              {(formik) => (
                                <Form>
                                  <div className="sminputs">
                                    <div className="input full">
                                      <label
                                        className="string optional loginFontForLabel NunitoSans-Regular"
                                        htmlFor="user-name"
                                      >
                                        User name
                                      </label>
                                      <Field
                                        className="string optional NunitoSans-Regular"
                                        maxLength={255}
                                        id="user-email"
                                        placeholder="Type your username here"
                                        type="text"
                                        name="clientUserId"
                                        onClick={() => setNamee("clientUserId")}
                                      />
                                      {namee === "clientUserId" ? (
                                        <span>
                                          <p
                                            style={{
                                              padding: "1px",
                                              backgroundColor: "#54E28D",
                                            }}
                                          ></p>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <ErrorMessage name="clientUserId">
                                        {(msg) => (
                                          <div
                                            className="abhitest"
                                            style={{
                                              color: "red",
                                              position: "absolute",
                                              top: "91px",
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
                                        className="string optional loginFontForLabel NunitoSans-Regular"
                                        htmlFor="user-pw"
                                      >
                                        Enter Your Password
                                      </label>
                                      <Field
                                        className="string optional"
                                        maxLength={255}
                                        id="user-pw"
                                        placeholder="Type your password here"
                                        type={
                                          values.showPassword
                                            ? "text"
                                            : "password"
                                        }
                                        size={50}
                                        name="userPassword"
                                        onClick={() => setNamee("userPassword")}
                                      />
                                      {namee === "userPassword" ? (
                                        <span>
                                          <p
                                            style={{
                                              padding: "1px",
                                              backgroundColor: "#54E28D",
                                            }}
                                          ></p>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                      <Link
                                        to={`/forget`}
                                        className="pull-right mt-2"
                                        style={{ color: "#0A2FB6" }}
                                      >
                                        Forgot Password ?
                                      </Link>
                                      <ErrorMessage name="userPassword">
                                        {(msg) => (
                                          <div
                                            className="abhitest NunitoSans-Regular"
                                            style={{
                                              color: "red",
                                              position: "absolute",
                                              top: "91px",
                                              zIndex: " 999",
                                            }}
                                          >
                                            {msg}
                                          </div>
                                        )}
                                      </ErrorMessage>

                                      <span
                                        class="input-group-addon eyeicon2"
                                        onClick={handleClickShowPassword}
                                      >
                                        {values.showPassword ? (
                                          <i
                                            class="fa fa-eye"
                                            aria-hidden="true"
                                          ></i>
                                        ) : (
                                          <i
                                            class="fa fa-eye-slash"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="simform__actions mt-4">
                                    {/*<input className="sumbit" name="commit" type="sumbit" value="Log In" />*/}
                                    <button
                                      className="sumbit btn-0156B3"
                                      type="sumbit"
                                      style={{
                                        boxShadow:
                                          "0px 14px 10px rgba(66, 133, 248, 0.5)",
                                        borderRadius: "6px",
                                      }}
                                      disabled={
                                        !(formik.isValid && formik.dirty)
                                          ? true
                                          : false
                                      }
                                      // disabled={
                                      //   (
                                      //     INITIAL_FORM_STATE.clientUserId == ""
                                      //     &&
                                      //     INITIAL_FORM_STATE.userPassword == ""
                                      //   )
                                      //     ? true : false}
                                    >
                                      {loading && (
                                        <span
                                          className="spinner-border forSpinner NunitoSans-Regular"
                                          role="status"
                                        ></span>
                                      )}
                                      LogIn
                                    </button>

                                 
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                          <div className="logmod__form- m-r-l-100 mt-3 termsconditionss NunitoSans-Regular">
                            <p>Term of Service | Privacy Policy | Contact us</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                
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
            <div className="col-sm-6 authfy-panel-left">
              <div className="brand-col">
                <div
                  id="carouselExampleIndicators"
                  class="carousel slide"
                  data-ride="carousel"
                >
                  <ol
                    class="carousel-indicators"
                    style={{
                      position: "absolute",
                      zIndex: "999",
                      top: "450px",
                    }}
                  >
                    <li
                      data-target="#carouselExampleIndicators"
                      data-slide-to="0"
                      class="active"
                    ></li>
                    <li
                      data-target="#carouselExampleIndicators"
                      data-slide-to="1"
                    ></li>
                    <li
                      data-target="#carouselExampleIndicators"
                      data-slide-to="2"
                    ></li>
                  </ol>
                  <div class="carousel-inner OpenSans-Regular">
                    <div class="carousel-item active">
                      <div class="heading1 pt-2">
                        <p
                          className="font-text-large mb-0 OpenSans-Regular"
                          style={{ color: "#012167", fontWeight: "700" }}
                        >
                          An all-in-one
                        </p>
                        <p
                          className="font-size-32 mb-2 OpenSans-Regular"
                          style={{ color: "#012167" }}
                        >
                          {" "}
                          Transaction Dashboard
                        </p>
                        <p className="mt-4 loginBanSubHeader OpenSans-Regular">
                          {" "}
                          Power of real-time payment analysis
                        </p>
                        <img
                          class="loginscreenimage"
                          src={imageSlide1}
                          alt="slide"
                        />
                      </div>
                    </div>
                    <div class="carousel-item">
                      <div class="heading1 pt-2">
                        <p
                          className="font-text-large mb-0 OpenSans-Regular"
                          style={{ color: "#012167", fontWeight: "700" }}
                        >
                          An all-in-one
                        </p>
                        <p
                          className="font-size-32 mb-2 OpenSans-Regular"
                          style={{ color: "#012167" }}
                        >
                          {" "}
                          Transaction Dashboard
                        </p>
                        <p className="mt-4 loginBanSubHeader OpenSans-Regular">
                          {" "}
                          Power of real-time payment analysis
                        </p>
                        <img
                          class="loginscreenimage"
                          src={imageSlide1}
                          alt="slide"
                        />
                      </div>
                    </div>
                    <div class="carousel-item">
                      <div class="heading1 pt-2">
                        <p
                          className="font-text-large mb-0 OpenSans-Regular "
                          style={{ color: "#012167", fontWeight: "700" }}
                        >
                          An all-in-one
                        </p>
                        <p
                          className="font-size-32 mb-2 OpenSans-Regular "
                          style={{ color: "#012167" }}
                        >
                          {" "}
                          Transaction Dashboard
                        </p>
                        <p className="mt-4 loginBanSubHeader OpenSans-Regular ">
                          {" "}
                          Power of real-time payment analysis
                        </p>
                        <img
                          class="loginscreenimage"
                          src={imageSlide1}
                          alt="slide"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="footerforcopyright NunitoSans-Regular text-center">
            Copyright 2022 SabPaisa, all rights reserve version 0.1
          </p>
        </div>
        {/* ./row */}
      </div>
    </>
  );
}

export default LoginPage;
