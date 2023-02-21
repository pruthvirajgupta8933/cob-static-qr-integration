import React, { useState, useEffect } from "react";
import HeaderPage from "./HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import * as Yup from "yup";
import { login, logout } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import { toast } from "react-toastify";
import "./Login.css";
import imageSlide1 from "../../assets/images/COB.png";
import TokenService from "../../services/token.service";
import UserService from "../../services/test-service";
// import api from './api';

const INITIAL_FORM_STATE = {
  clientUserId: "",
  userPassword: "",
};

const FORM_VALIDATION = Yup.object().shape({
  clientUserId: Yup.string().required("Please enter username"),
  userPassword: Yup.string().required("Please enter Password"),
});

function LoginPage() {
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

  useEffect(() => {
    setAuthData(authentication);
  }, [authentication]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  //Dummy login for JWT
  const customLogin = async () => {
    const data = {
      clientUserId: "Abh789@sp",
      userPassword: "P8c3WQ7ei",
    };
    UserService.login(data).then((res)=>{
      TokenService.setUser(res.data);
    })
 

      // navigate(from, { replace: true });
 
  };

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

  return (
    <>
      <HeaderPage />
      <div className="container-fluid toppad">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="authfy-container col-xs-12 col-sm-12 col-md-12 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-12 col-md-12 col-lg-6 authfy-panel-right pt-0 login-float-right nopad login-float-none">
              {/* col-sm-12 col-md-12 col-lg-6 authfy-panel-right  */}
              <div className="authfy-login ">
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                      <div className="logmod__tab-wrapper">
                        <div className="logmod__tab lgm-2 show">
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle"></span>
                            <h1 className="loginHeaderr NunitoSans-Regular">
                              Welcome to your Dashboard
                            </h1>
                            <p
                              style={{ color: "#0A2FB6" }}
                              className="loginpara1 NunitoSans-Regular"
                            >
                              You can login to track and record every
                              transaction in real time.
                            </p>
                          </div>
                          <div className="logmod__form- m-r-l-200 m-10 col-lg-8 col-md-12 col-sm-12">
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
                                        placeholder="Type your username"
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
                                        className="input-group-addon eyeicon2"
                                        onClick={handleClickShowPassword}
                                      >
                                        {values.showPassword ? (
                                          <i
                                            className="fa fa-eye"
                                            aria-hidden="true"
                                          ></i>
                                        ) : (
                                          <i
                                            className="fa fa-eye-slash"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="simform__actions mt-4">
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
                                    >
                                      {loading && (
                                        // <span
                                        //   className="spinner-border forSpinner NunitoSans-Regular"
                                        //   role="status"
                                        // ></span>
                                        <div
                                          className="spinner-border text-secondary- NunitoSans-Regular"
                                          role="status"
                                        ></div>
                                        // <div className="spinner-grow" role="status"></div>
                                      )}
                                      Login
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        </div>
                        <div className="logmod__form- m-r-l-100- mt-3 termsconditionss NunitoSans-Regular text-center">
                          <p>
                            <a
                              href="https://sabpaisa.in/term-conditions/"
                              rel="noreferrer"
                              target={"_blank"}
                              alt="SabPaisa Terms & Conditions"
                              title="SabPaisa Terms & Conditions"
                            >
                              Terms & Conditions
                            </a>
                            &nbsp;|{" "}
                            <a
                              href="https://sabpaisa.in/privacy-policy/"
                              rel="noreferrer"
                              target={"_blank"}
                              alt="SabPaisa Privacy Policy"
                              title="SabPaisa Privacy Policy"
                            >
                              Privacy Policy
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
            <div className="col-sm-12 col-md-12 col-lg-6 authfy-panel-left">
              <div className="brand-col">
                <div className="headline pt-1 NunitoSans-Regular">
                  <div className="brand-logo">
                    <div
                      id="carouselExampleIndicators"
                      className="carousel slide"
                      data-ride="carousel"
                    >
                      <ol className="carousel-indicators">
                        <li
                          data-target="#carouselExampleIndicators"
                          data-slide-to="0"
                          className="active"
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
                      <div className="carousel-inner NunitoSans-Regular">
                        <div className="carousel-item active">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular"
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              An all-in-one
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular"
                              style={{ color: "#012167" }}
                            >
                              {" "}
                              Dashboard
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular">
                              {" "}
                              Trusted by over 3000 Mega Clients
                            </p>
                            <img
                              className="loginscreenimage w-50 h-50"
                              src={imageSlide1}
                              alt="slide"
                            />
                          </div>
                        </div>
                        <div className="carousel-item">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular"
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              An all-in-one
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular"
                              style={{ color: "#012167" }}
                            >
                              {" "}
                              Dashboard
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular">
                              {" "}
                              Trusted by over 3000 Mega Clients
                            </p>
                            <img
                              className="loginscreenimage w-50 h-50"
                              src={imageSlide1}
                              alt="slide"
                            />
                          </div>
                        </div>
                        <div className="carousel-item">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular "
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              An all-in-one
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular "
                              style={{ color: "#012167" }}
                            >
                              {" "}
                              Dashboard
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular ">
                              {" "}
                              Trusted by over 3000 Mega Clients
                            </p>
                            <img
                              className="loginscreenimage w-50 h-50"
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
            </div>
          </div>

          <p className="footerforcopyright NunitoSans-Regular text-center">
            Copyright @ 2023 SabPaisa All Rights Reserved version 1.0
          </p>
        </div>
        {/* ./row */}
      </div>
    </>
  );
}

export default LoginPage;
