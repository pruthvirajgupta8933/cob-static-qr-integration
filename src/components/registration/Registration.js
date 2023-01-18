import React, { useEffect, useState } from "react";
import HeaderPage from "../login/HeaderPage";
import "../login/css/home.css";
import "../login/css/homestyle.css";
import "../login/css/style-style.css";
import "../login/css/style.css";
import onlineshopinglogo from "../../assets/images/COB.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register, udpateRegistrationStatus } from "../../slices/auth";
import { useHistory, Link } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

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

function Registration() {
  const history = useHistory();

  const reduxState = useSelector((state) => state);
  const { message, auth } = reduxState;
  const datar = auth;

  const { isUserRegistered } = datar;
  const [acceptTc, setAcceptTc] = useState(false);
  // const [isCheck, setIsCheck] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  const [businessCode, setBusinessCode] = useState([]);
  const [passwordType, setPasswordType] = useState({
    confirmpassword: "",
    showPasswords: false,
  });

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });
  const togglePassword = () => {
    setPasswordType({
      ...passwordType,
      showPasswords: !passwordType.showPasswords,
    });
  };


  useEffect(() => {
    axiosInstanceAuth
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
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(udpateRegistrationStatus());
    };
  }, []);

  const handleRegistration = (formData, { resetForm }) => {
    let businessType = 1;
    let {
      fullname,
      mobilenumber,
      emaill,
      passwordd,
      business_cat_code,
    } = formData;
    setBtnDisable(true)

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

    if (isUserRegistered === false || isUserRegistered === null) {
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


  return (
    <>
      <HeaderPage />
      <div className="container-fluid toppad">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="authfy-container col-xs-12 col-sm-12 col-md-12 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-12 col-md-12 col-lg-6 authfy-panel-left mdn">
              <div className="brand-col ">
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
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular"
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              Empower your
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular"
                              style={{ color: "#012167" }}
                            >
                            business
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular">
                              boost  your&nbsp;finance
                            </p>
                            <img
                              src={onlineshopinglogo}
                              alt="SabPaisa"
                              title="SabPaisa"
                              className="loginscreenimagereg w-50 h-50"
                            />
                          </div>
                        </div>
                        <div className="carousel-item ">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular"
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              Empower your
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular"
                              style={{ color: "#012167" }}
                            >
                              business
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular">
                              
                              boost  your&nbsp;finance
                            </p>
                            <img
                              src={onlineshopinglogo}
                              alt="SabPaisa"
                              title="SabPaisa"
                              className="loginscreenimagereg w-50 h-50"
                            />
                          </div>
                        </div>
                        <div className="carousel-item">
                          <div className="heading1 pt-2">
                            <p
                              className="font-text-large mb-0 NunitoSans-Regular"
                              style={{ color: "#012167", fontWeight: "700" }}
                            >
                              Empower your
                            </p>
                            <p
                              className="font-size-32 mb-2 NunitoSans-Regular"
                              style={{ color: "#012167" }}
                            >
                              
                              business
                            </p>
                            <p className="mt-2 loginBanSubHeader NunitoSans-Regular">
                              
                              boost  your&nbsp;finance
                            </p>
                            <img
                              src={onlineshopinglogo}
                              alt="SabPaisa"
                              title="SabPaisa"
                              className="loginscreenimagereg w-50 h-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6 authfy-panel-right pt-0">
              {/* authfy-login start */}
              <div className="authfy-login">
                {/* panel-login start */}
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                      <div className="logmod__tab-wrapper">
                        <div className="show logmod__tab lgm-1">
                          <div className="logmod__heading NunitoSans-Regular">
                            <span className="fontfigma">
                              Welcome to SabPaisa
                            </span>
                            <div className="flex">
                              <span className="Signupfigma mt-2">
                                <span
                                  style={{
                                    color: "#4BB543",
                                    fontWeight: "700",
                                    fontSize: "18px",
                                  }}
                                >
                                  Signup
                                </span>
                                to Create New Account
                              </span>
                            </div>
                          </div>
                          <div className="logmod__form- NunitoSans-Regular">
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
                                handleRegistration(values, { resetForm })
                              }}
                            >
                              {(formik, resetForm) => (
                                <Form
                                  acceptCharset="utf-8"
                                  action="#"
                                  className="simform"
                                >
                                  <div className="sminputs">
                                    <div className="input full- optional">
                                      <label
                                        className="string optional"
                                        htmlFor="full-name"
                                      >
                                        Full Name
                                      </label>
                                      <Field
                                        className="string optional"
                                        maxLength={255}
                                        id="fullname"
                                        placeholder="Full Name"
                                        type="text"
                                        name="fullname"
                                        size={50}
                                      />
                                      {
                                        <ErrorMessage name="fullname">
                                          {(msg) => (
                                            <p
                                              className="abhitest errortxt">
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      }
                                    </div>

                                    <div className="sminputs">
                                      <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="mobile"
                                        >
                                          Enter Mobile Number
                                        </label>
                                        <Field
                                          className="string optional"
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
                                        {
                                          <ErrorMessage name="mobilenumber">
                                            {(msg) => (
                                              <p
                                                className="abhitest errortxt">
                                                {msg}
                                              </p>
                                            )}
                                          </ErrorMessage>
                                        }
                                      </div>
                                      <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="user-email"
                                        >
                                          Email Id
                                        </label>
                                        <Field
                                          className="string optional"
                                          maxLength={255}
                                          id="email"
                                          placeholder="Enter your email"
                                          type="email"
                                          name="emaill"
                                          size={50}
                                        />
                                        {
                                          <ErrorMessage name="emaill">
                                            {(msg) => (
                                              <p
                                                className="abhitest errortxt">
                                                {msg}
                                              </p>
                                            )}
                                          </ErrorMessage>
                                        }
                                      </div>

                                      <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="business_category"
                                        >
                                          Business Category
                                        </label>
                                        <Field
                                          name="business_cat_code"
                                          className="selct fnt-lab"
                                          component="select"
                                        >
                                          <option
                                            type="text"
                                            className="form-control"
                                            id="businesscode"
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
                                        {
                                          <ErrorMessage name="business_cat_code">
                                            {(msg) => (
                                              <p
                                                className="abhitest errortxt">
                                                {msg}
                                              </p>
                                            )}
                                          </ErrorMessage>
                                        }
                                      </div>
                                    </div>
                                  </div>

                                  <div className="sminputs mb-40">
                                    <div className="input full- optional">
                                      <label
                                        className="string optional"
                                        htmlFor="user-pw"
                                      >
                                        Create Password
                                      </label>
                                      <Field
                                        className="string optional"
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
                                      <div className="input-group-addon viewfor">
                                        <a
                                          href={() => false}
                                          onClick={handleClickShowPassword}
                                        >
                                          {valuesIn.showPassword ? (
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
                                        </a>
                                      </div>

                                      {
                                        <ErrorMessage name="passwordd">
                                          {(msg) => (
                                            <p
                                              className="abhitest errortxt">
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      }
                                    </div>
                                    <div className="input full- optional">
                                      <label
                                        className="string optional"
                                        htmlFor="user-cpw"
                                      >
                                        Confirm Password
                                      </label>
                                      <Field
                                        className="string optional"
                                        maxLength={255}
                                        id="user-cpw"
                                        placeholder="Re-enter"
                                        type={
                                          passwordType.showPasswords
                                            ? "text"
                                            : "password"
                                        }
                                        name="confirmpasswordd"
                                        size={50}
                                      />

                                      <div className="input-group-addon viewfor">
                                        <a
                                          href={() => false}
                                          onClick={togglePassword}
                                        >
                                          {passwordType.showPasswords ? (
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
                                        </a>
                                      </div>
                                      <input
                                        type="hidden"
                                        name="requestedClientType"
                                        value="1"
                                      />
                                      {
                                        <ErrorMessage name="confirmpasswordd">
                                          {(msg) => (
                                            <p
                                              className="abhitest errortxt">
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      }
                                    </div>
                                  </div>
                                  <div className="sminputs">
                                    <div className="simform__actions-">
                                      <button
                                        className="figmabtn Satoshi-Medium text-white mt-4- disabled1 w-50"
                                        name="commit"
                                        type="submit"
                                        defaultValue="Create Account"
                                        disabled={btnDisable ||
                                          !(formik.isValid && formik.dirty)
                                          ? true
                                          : false
                                        }
                                        data-rel={btnDisable}
                                      >
                                        Signup
                                      </button>

                                      <span className="simform__actions-sidetext"></span>
                                      {<ErrorMessage name="terms_and_condition">
                                          {(msg) => (
                                            <p
                                              className="abhitest errortxt">
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>}
                                    </div>
                                  </div>
                                  <div className="container">
                                    <div className="row">
                                      <div className="col">Already have an account? <Link
                                        to={`/login`}
                                        style={{ color: "#0156B3" }}
                                      >
                                        Sign in
                                      </Link></div>
                                    </div>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ./authfy-login */}
            </div>
          </div>
          <p className="footerforcopyright text-center NunitoSans-Regular">
            Copyright @ 2022 SabPaisa All Rights Reserved version 1.0
          </p>
        </div>
        {/* ./row */}
      </div>
    </>
  );
}

export default Registration;
