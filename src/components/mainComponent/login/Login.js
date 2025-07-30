import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import Yup from "../../../_components/formik/Yup";
import { login, loginVerify, logout } from "../../../slices/auth";
import { clearMessage } from "../../../slices/message";
import sbbnner from "../../../assets/images/login-banner.svg";
import arrow_one from "../../../assets/images/arrow_one.png";
import arrow_two from "../../../assets/images/arrow_two.png";
import GoogleLoginButton from "../../social-login/GoogleLoginButton";
import Header from "../header/Header";
import classes from "./login.module.css";
import toastConfig from "../../../utilities/toastTypes";
import useMediaQuery from "../../../custom-hooks/useMediaQuery";
import ReCAPTCHA from "react-google-recaptcha";
import authService from "../../../services/auth.service";
import AuthOtpVerify from "./AuthOtpVerify";

import keyConfig from "../../../key.config";
import { APP_ENV } from "../../../config";
import { encrypt } from "@cto_sabpaisa/sabpaisa-aes-256-encryption";

const INITIAL_FORM_STATE = {
  clientUserId: "",
  userPassword: "",
  reCaptcha: "",
};


const validationSchema = Yup.object().shape({
  clientUserId: Yup.string().required("Please enter username").allowOneSpace(),
  userPassword: Yup.string().required("Please enter password").allowOneSpace(),
  reCaptcha: APP_ENV
    ? Yup.string().required("Please complete the reCAPTCHA").nullable()
    : Yup.string().notRequired().nullable(),
});

const Login = () => {
  const { user, userAlreadyLoggedIn } = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [inputValue, setInputValue] = useState({});

  const isDesktop = useMediaQuery("(min-width: 993px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 992px)");
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const userLocalData = JSON.parse(localStorage.getItem("user"));
    const isLoggedInLc = userLocalData && userLocalData.loginId !== null;
    if (
      isLoggedInLc &&
      userAlreadyLoggedIn &&
      user?.loginStatus === "Activate"
    ) {
      history.replace("/dashboard");
      // window.localStorage.setItem("openTabs", 1);
    } else {
      dispatch(logout());
    }
  }, [userAlreadyLoggedIn, user, dispatch, history]);

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const handleCaptchaChange = async (token, formik) => {
    const { setFieldValue } = formik;

    const postCaptcha = {
      "g-recaptcha-response": token,
    };

    authService
      .captchaVerify(postCaptcha)
      .then((resp) => {
        setFieldValue("reCaptcha", token);
      })
      .catch((error) => {
        toastConfig.errorToast(
          "Error captcha verification failed. Please try again after sometime."
        );
      });
  };

  const handleLogin = async (formValue) => {
    const { clientUserId, userPassword } = formValue;

    setLoading(true);


    const encQuery = {
      query: await encrypt(
        JSON.stringify({
          clientUserId: clientUserId,
          userPassword: userPassword,
          is_social: false,
        }),
        keyConfig.LOGIN_AUTH_KEY,
        keyConfig.LOGIN_AUTH_IV
      ),
    };

    dispatch(login(encQuery)).then((res) => {
      if (res?.payload?.user?.status && res?.payload?.user?.is_mfa_enabled) {
        setOpenOtpModal(true);
        setInputValue(encQuery);
      } else {
        // if MFA false
        if (
          res?.payload?.user?.status &&
          res?.payload?.user?.is_mfa_enabled === false
        ) {
          setLoading(true);
          dispatch(
            loginVerify({
              otp: "",
              verification_token: res?.payload?.user?.verification_token,
            })
          ).then((res) => {
            if (res?.payload?.user) {
              const { loginStatus, loginMessage } = res.payload.user;
              if (loginStatus === "Activate" && loginMessage === "success") {
                setLoading(false);
                history.replace("/dashboard");
                // window.localStorage.setItem("openTabs", 1);
              } else {
                setLoading(false);
                toastConfig.errorToast(loginMessage || "Rejected");
              }
            } else {
              setLoading(false);
              toastConfig.errorToast(res?.payload || "Rejected");
            }
            setLoading(false);
          });
        } else {
          setOpenOtpModal(false);
          setLoading(false);
          toastConfig.errorToast(res?.payload || "Something went wrong.");
        }
      }
      setLoading(false);
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const enableSocialLogin = async (flag, response) => {
    if (flag) {
      const username = response?.profileObj?.email;
      const encQuery = {
        query: encrypt(
          JSON.stringify({ clientUserId: username, is_social: true }),
          keyConfig.LOGIN_AUTH_KEY,
          keyConfig.LOGIN_AUTH_IV
        ),
      };
      dispatch(login(encQuery))
        .then((res) => {
          if (
            res?.payload?.user?.status &&
            res?.payload?.user?.is_mfa_enabled
          ) {
            setOpenOtpModal(true);
          } else {
            // if MFA false
            if (
              res?.payload?.user?.status &&
              res?.payload?.user?.is_mfa_enabled === false
            ) {
              setLoading(true);
              dispatch(
                loginVerify({
                  otp: "",
                  verification_token: res?.payload?.user?.verification_token,
                })
              ).then((res) => {
                if (res?.payload?.user) {
                  const { loginStatus, loginMessage } = res.payload.user;
                  if (
                    loginStatus === "Activate" &&
                    loginMessage === "success"
                  ) {
                    history.replace("/dashboard");
                    // window.localStorage.setItem("openTabs", 1);
                  } else {
                    toastConfig.errorToast(loginMessage || "Rejected");
                  }
                } else {
                  toastConfig.errorToast(res?.payload || "Rejected");
                }
                setLoading(false);
              });
            } else {
              setOpenOtpModal(false);
              toastConfig.errorToast(res?.payload || "Something went wrong.");
            }
          }
          setLoading(false);
        })
        .catch((err) => toastConfig.errorToast("Something went wrong."));
    }
  };

  return (
    <div className={`container-fluid p-0`}>
      <div
        className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}
      >
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
                  <img
                    src={sbbnner}
                    alt="banner"
                    className={`${classes.login_banner}`}
                    loading="lazy"
                  />
                  <div className={`my-5 ${classes.sp_font_24}`}>
                    <p className="text-white">Login to Your Dashboard</p>
                    <p className={`m-0 text-white ${classes.sp_font_17}`}>
                      One Payment Gateway for all your needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-items-start flex-grow-1">
              <div
                className={`col-lg-2 col-md-1 col-sm-1 d-flex justify-content-end`}
              >
                <img
                  src={arrow_two}
                  alt="arrow"
                  className={`${classes.left_side_arrow}`}
                  loading="lazy"
                />
              </div>
              <div className="col-lg-8 col-md-10 col-sm-10">
                <div className="text-center">
                  <div className={`${classes.sp_font_20}`}>
                    <h4 className={`hr_line text-white`}>
                      Need help? Contact us
                    </h4>
                  </div>
                  <div className="d-flex justify-content-around my-1">
                    <p className="mx-2 text-white">
                      <i className="mx-2 fa fa-light fa-envelope"></i>{" "}
                      support@sabpaisa.in
                    </p>
                    <p className="mx-2 text-white">
                      <i className="mx-2 fa fa-light fa-phone"></i> 011-41733223
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-1 col-sm-1"></div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 d-flex justify-content-center p-0 scroll-bar-hide bg-auth">
          <div className="container-fluid d-flex flex-column h-100 p-0">
            <div className="row align-items-start flex-grow-1">
              <div className="col">
                {(isTablet || isMobile) && <Header display_bg_color={true} />}
                <img
                  src={arrow_one}
                  alt="arrow"
                  className={`${classes.right_side_arrow}`}
                  loading="lazy"
                />
              </div>
            </div>
            <div className="row align-items-start flex-grow-1 mt-md-5 mt-sm-5">
              <div className="col-lg-3 col-md-2 col-sm-2 col-1"></div>

              {openOtpModal ? (
                <AuthOtpVerify
                  updateOtpModal={setOpenOtpModal}
                  inputValue={inputValue}
                />
              ) : (
                <div className={`col ${classes.form_container}`}>
                  <h5
                    className={`text-center text_primary_color heading ${classes.heading}`}
                  >
                    Login
                  </h5>
                  <h6
                    className={`text-center mb-4 sub_heading ${classes.sub_heading}`}
                  >
                    Login to your merchant account
                  </h6>
                  <Formik
                    initialValues={INITIAL_FORM_STATE}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                  >
                    {(formik) => (
                      <Form>
                        <div className="mb-3">
                          <label
                            htmlFor="clientUserId"
                            className="form-label font-weight-bold font-size-16"
                          >
                            Email ID <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control"
                            maxLength={255}
                            id="clientUserId"
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCut={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            placeholder="Enter your username"
                            type="text"
                            name="clientUserId"
                            autoComplete="off"
                          />
                          <ErrorMessage name="clientUserId">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="mb-3">
                          <label
                            htmlFor="userPassword"
                            className="form-label font-weight-bold font-size-16"
                          >
                            Password <span className="text-danger">*</span>
                          </label>
                          <div className="m-0 input-group">
                            <Field
                              className="form-control border-right-0"
                              maxLength={255}
                              id="userPassword"
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onCut={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              name="userPassword"
                              autoComplete="new-password"
                            />
                            <div className="input-group-append">
                              <span
                                className="input-group-text border-left-0 bg-transparent"
                                onClick={handleClickShowPassword}
                              >
                                {showPassword ? (
                                  <i className="fa fa-eye"></i>
                                ) : (
                                  <i className="fa fa-eye-slash"></i>
                                )}
                              </span>
                            </div>
                          </div>
                          <ErrorMessage name="userPassword">
                            {(msg) => <div className="text-danger">{msg}</div>}
                          </ErrorMessage>
                        </div>

                        <div className="mb-3">
                          <ReCAPTCHA
                            sitekey="6Le8XYMqAAAAANwufmddI2_Q42TdWhDiAlcpem4g"
                            onChange={(token) =>
                              handleCaptchaChange(token, formik)
                            }
                            onExpired={() => {
                              formik.setFieldValue("reCaptcha", null);
                            }}
                          />
                          <ErrorMessage name="reCaptcha">
                            {(msg) => <p className="text-danger">{msg}</p>}
                          </ErrorMessage>
                        </div>

                        <div className="form-text p-2 my-3 text-right font-size-14">
                          <Link
                            to={`/forget/${window.location.search}`}
                            className="text-decoration-underline"
                          >
                            Reset Password?
                          </Link>
                        </div>
                        <div className="d-flex">
                          <button
                            type="submit"
                            className="btn cob-btn-primary w-100 mb-2"
                            disabled={loading}
                          >
                            {loading && (
                              <span className="spinner-grow spinner-grow-sm text-light mr-1"></span>
                            )}
                            Login
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                  <h6 className={`hr_line_or my-2`}>or</h6>
                  <div className="d-flex justify-content-center">
                    <GoogleLoginButton
                      enableSocialLogin={enableSocialLogin}
                      btnText={"Sign in with Google"}
                    />
                  </div>
                  <div className="text-center my-5">
                    <p className={`${classes.sp_font_18}`}>
                      Don’t have an account with SabPaisa?
                      <a
                        className="text-primary text-decoration-underline"
                        href={`https://sabpaisa.in`}
                      >
                        {" "}
                        Sign Up
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <div className="col-lg-3 col-md-2 col-sm-2 col-1"></div>
            </div>
            <div className="row align-items-end flex-grow-1">
              <div className="col">
                <div className="p-2 bd-highlight sp-font-12 text-center">
                  <p className="bd-highlight text-center sp-font-12">
                    Copyright @ {new Date().getFullYear()} SabPaisa All Rights
                    Reserved version 1.0 |&nbsp;
                    <a
                      href="https://sabpaisa.in/term-conditions/"
                      rel="noreferrer"
                      target="_blank"
                      className="text-primary"
                    >
                      Terms &amp; Conditions
                    </a>{" "}
                    and&nbsp;
                    <a
                      href="https://sabpaisa.in/privacy-policy/"
                      rel="noreferrer"
                      target="_blank"
                      className="text-primary"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
