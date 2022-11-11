import React, { useEffect, useState } from "react";
import HeaderPage from "../login/HeaderPage";
import "../login/css/home.css";
import "../login/css/homestyle.css";
import "../login/css/style-style.css";
import "../login/css/style.css";
import onlineshopinglogo from "../../assets/images/onlineshopinglogo.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register, udpateRegistrationStatus } from "../../slices/auth";
import { useHistory } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import { Link } from "react-router-dom";
import TermCondition from "./TermCondition";
import API_URL from "../../config";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";

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
    .required("Confirm Password Required"),
  business_cat_code: Yup.string().required("Required"),
  
});

function Registration() {
  const history = useHistory();

  const reduxState = useSelector((state) => state);
  const { message, auth } = reduxState;
  const datar = auth;

  const { isUserRegistered } = datar;
  const [checkboxStatus, setCheckboxStatus] = useState(Array(3).fill(false));
  const [isActive, setActive] = useState(true);
  const [acceptTc, setAcceptTc] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [trmCond, setTrmCond] = useState(false);

  const [businessCode, setBusinessCode] = useState([]);
  const [passwordType, setPasswordType] =useState({
    confirmpassword: "",
    showPasswords: false,
  });

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });
  const togglePassword = () => {
   setPasswordType({ ...passwordType, showPasswords: !passwordType.showPasswords });

  };

  // function buttonHandler(index) {
  //   let status = [...checkboxStatus];
  //   status[index] = !status[index];
  //   setCheckboxStatus(status);
  // }

  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.Business_Category_CODE)
      .then((resp) => {
        const data = resp?.data;
        const sortAlpha = data?.sort((a, b) => a.category_name.toLowerCase().localeCompare(b.category_name.toLowerCase()))
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

  const handleRegistration = (formData) => {

    var businessType = 1;
    var {
      fullname,
      mobilenumber,
      emaill,
      passwordd,
      business_cat_code,
    } = formData;
    var fullname = fullname;
    var mobileNumber = mobilenumber;
    var email = emaill;
    var business_cat_code = business_cat_code;
    var password = passwordd;

    dispatch(
      register({
        fullname,
        mobileNumber,
        email,
        business_cat_code,
        password,
        businessType,
      })
    )
      .unwrap()
      .then((res) => {
        setBtnDisable(false);
      })
      .catch((err) => {
        setBtnDisable(false);

      });
  };

  // const toggleClass = () => {
  //   setActive(!isActive);
  // };

  const handleClickShowPassword = () => {
    setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
  };

  useEffect(() => {
    if (isUserRegistered === true) {
      toast.success(message.message, {
        position: "top-right",
        autoClose: 2000,
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
        autoClose: 1500,
        limit: 5,
        transition: Zoom,
      });
    }
    return () => {
      dispatch(udpateRegistrationStatus());
    };
  }, [isUserRegistered]);

  const callBackFn = (isClickOnAccept, isChecked) => {
    setAcceptTc(!acceptTc);
    setIsCheck(isChecked);
  };

  // const handlerTermCond = (isChecked) => {
  //   setBtnDisable(isChecked);
  // };
  
  return (
    <>
      <HeaderPage />
      <div className="container-fluid toppad">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-4 authfy-panel-left">
              <div className="brand-col Satoshi-Medium">
                <div className="headline pt-1">
                  {/* brand-logo start */}
                  {/* <div className="brand-logo">
                  <img
                    src={sabpaisalogo}
                    width={150}
                    alt="SabPaisa"
                    title="SabPaisa"
                  />
                </div> */}
                  {/* ./brand-logo */}
                  <h1
                    style={{
                      fontSize: "30px",
                      fontStyle: "Satoshi",
                      color: "#0143A1",
                      lineHeight: "30px",

                    }}
                    class="text-center mt-40"
                  >
                    Empower your <br/>business,&nbsp;boost <br/> your&nbsp;finance
                  </h1>
                 

                  <div className="brand-logo">
                   
                    <div
                      id="carouselExampleIndicators"
                      class="carousel slide"
                      data-ride="carousel"
                    >
                      <ol class="carousel-indicators">
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
                      <div class="carousel-inner">
                        <div class="carousel-item active">
                          <img
                            src={onlineshopinglogo}
                           
                            alt="SabPaisa"
                            title="SabPaisa"
                            class="loginscreenimagereg"
                          />
                        </div>
                        <div class="carousel-item">
                          <img
                            src={onlineshopinglogo}
                            
                            alt="SabPaisa"
                            title="SabPaisa"
                            class="loginscreenimagereg"
                          />
                        </div>
                        <div class="carousel-item">
                          <img
                            src={onlineshopinglogo}
                           
                            alt="SabPaisa"
                            title="SabPaisa"
                            class="loginscreenimagereg"
                          />
                        </div>
                      </div>
                     
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
            <div className="col-sm-8 authfy-panel-right">
              {/* authfy-login start */}
              <div className="authfy-login">
                {/* panel-login start */}
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                    
                      <div className="logmod__tab-wrapper">
                        <div className="show logmod__tab lgm-1">
                          <div className="logmod__heading Satoshi-Medium">
                            <span className="fontfigma">
                              Welcome to SabPaisa{" "}
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
                                </span>{" "}
                                to Create New Account
                              </span>
                            </div>
                          </div>
                          <div className="logmod__form- Satoshi-Medium">
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
                              onSubmit={handleRegistration}
                            >
                              {(formik) => (
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
                                              className="abhitest"
                                              style={{
                                                color: "red",
                                                position: "absolute",
                                                zIndex: " 999",
                                              }}
                                            >
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
                                          Enter Mobile
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
                                                className="abhitest"
                                                style={{
                                                  color: "red",
                                                  position: "absolute",
                                                  zIndex: " 999",
                                                }}
                                              >
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
                                          Enter Email id
                                        </label>
                                        <Field
                                          className="string optional"
                                          maxLength={255}
                                          id="email"
                                          placeholder="email"
                                          type="email"
                                          name="emaill"
                                          size={50}
                                        />
                                        {
                                          <ErrorMessage name="emaill">
                                            {(msg) => (
                                              <p
                                                className="abhitest"
                                                style={{
                                                  color: "red",
                                                  position: "absolute",
                                                  zIndex: " 999",
                                                }}
                                              >
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
                                          className="selct"
                                          component="select"
                                        >
                                          <option
                                            type="text"
                                            className="form-control"
                                            id="businesscode"
                                          >
                                            Select Business Category
                                          </option>
                                          {businessCode.map((business, i) => (
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
                                                className="abhitest"
                                                style={{
                                                  color: "red",
                                                  position: "absolute",
                                                  zIndex: " 999",
                                                }}
                                              >
                                                {msg}
                                              </p>
                                            )}
                                          </ErrorMessage>
                                        }
                                      </div>
                                    </div>

                                   
                                  </div>

                                  <div className="sminputs">
                                    <div className="input full- optional">
                                      <label
                                        className="string optional"
                                        htmlFor="user-pw"
                                      >
                                        Enter Password
                                      </label>
                                      <Field
                                        className="string optional"
                                        maxLength={255}
                                        id="user-pws"
                                        placeholder="Type your password here"
                                        type={
                                          valuesIn.showPassword
                                            ? "text"
                                            : "password"
                                        }
                                        name="passwordd"
                                        size={50}
                                        autoComplete="off"
                                      />
                                      <div class="input-group-addon viewfor">
                                        <a onClick={handleClickShowPassword}>
                                          {" "}
                                          {valuesIn.showPassword ? (
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
                                        </a>
                                      </div>

                                      {
                                        <ErrorMessage name="passwordd">
                                          {(msg) => (
                                            <p
                                              className="abhitest"
                                              style={{
                                                color: "red",
                                                position: "absolute",
                                                zIndex: " 999",
                                                fontSize: "12px",
                                              }}
                                            >
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
                                        placeholder="Confirm password"
                                        type={
                                          passwordType.showPasswords
                                            ? "text"
                                            : "password"
                                        }
                                        name="confirmpasswordd"
                                        size={50}
                                      />

                                      <div class="input-group-addon viewfor">
                                      
                                        <a onClick={togglePassword}>
                                          {" "}
                                          {passwordType.showPasswords ? (
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
                                              className="abhitest"
                                              style={{
                                                color: "red",
                                                position: "absolute",
                                                zIndex: " 999",
                                              }}
                                            >
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      }

                                     
                                    </div>
                                  </div>
                                  <div className="sminputs">
                                    <div className="simform__actions">
                                      <button
                                        className="figmabtn Satoshi-Medium text-white mt-4- disabled1 w-50"
                                        name="commit"
                                        type="submit"
                                        defaultValue="Create Account"
                                        
                                        disabled={
                                          !(formik.isValid && formik.dirty)
                                            ? true
                                            : false
                                        }
                                        data-rel={btnDisable}
                                      >
                                        Signup
                                      </button>

                                      <span className="simform__actions-sidetext">
                                       
                                       
                                       
                                      </span>
                                      {
                                        <ErrorMessage name="terms_and_condition">
                                          {(msg) => (
                                            <p
                                              className="abhitest"
                                              style={{
                                                color: "red",
                                                float: "left",
                                              }}
                                            >
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>
                                      }
                                    </div>
                                  </div>
                                  <p className="foraccount Satoshi-Medium">
                                    Already have an account?
                                    <Link
                                      to={`/login`}
                                      style={{ color: "#0156B3" }}
                                    >
                                      {" "}
                                      Sign in
                                    </Link>
                                  </p>
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
            Copyright © 2022 SabPaisa, all rights reserve version 0.1
          </p>
        </div>

        {/* ./row */}
      </div>
    </>
  );
}

export default Registration;
