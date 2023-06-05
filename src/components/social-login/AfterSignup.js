/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import HeaderPage from "../login/HeaderPage";
import onlineshopinglogo from "../../assets/images/COB.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { logout, register, udpateRegistrationStatus } from "../../slices/auth";
import { useHistory, Link } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";

import "../login/css/home.css";
import "../login/css/homestyle.css";
import "../login/css/style-style.css";
import "../login/css/style.css";


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({

  mobilenumber: Yup.string()
    .required("Required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number in not valid")
    .max(10, "too long"),
  business_cat_code: Yup.string().required("Required"),
});

function Registration({hideDetails,getPendingDetails}) {
  const history = useHistory();

  const reduxState = useSelector((state) => state);
  const { message, auth } = reduxState;
  const authData = auth;
  const { isUserRegistered } = authData;

  const [btnDisable, setBtnDisable] = useState(false);
  const [businessCode, setBusinessCode] = useState([]);
  const [queryString, setQueryString] = useState({});
  const [mobileNumber,setMobileNumber]=useState("");
  const [businessCategoryCode,setBussinessCategoryCode]=useState("");
  const [passwordType, setPasswordType] = useState({
    confirmpassword: "",
    showPasswords: false,
  });

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });

  
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
      const appid = params.get('appid'); 
      const planid = params.get('planid'); 
      const domain = params.get('domain'); 
      const page = params.get('page'); 
      const appName = params.get('appName'); 
      const planName = params.get('planName'); 

      const paramObject = {
        appid,
        planid,
        domain,
        page,
        appName,
        planName
      }
      setQueryString(paramObject);
  }, []);

  const handleRegistration = (formData, { resetForm }) => {
    let businessType = 1;
    console.log(formData);
    setMobileNumber(formData?.mobilenumber);
    setBussinessCategoryCode(formData?.business_cat_code);
    setBtnDisable(false);

    getPendingDetails(mobileNumber,businessCategoryCode);
  };


  const handleClickShowPassword = () => {
    setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
  };


  useEffect(() => {
    const userLocalData = JSON.parse(sessionStorage.getItem("user"));
    const isLoggedInLc =
      userLocalData && userLocalData.loginId !== null ? true : false;
    if(isLoggedInLc){
        history.push("/dashboard")
    }else{
      dispatch(logout())
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


  const queryStringUrl  = window.location.search


  return (
    <>
      {/* <HeaderPage /> */}
      <div className="container-fluid">
        <div className="row">
          <div className="">
          
            <div className={hideDetails? "" :`col-sm-12 col-md-12 col-lg-6`}>
              {/* authfy-login start */}
              <div className="">
                {/* panel-login start */}
                <div className="">
                  <div className="">
                  
                    <div className="">
                      <div className="">
                        <div className="show ">
                          <div className="text-center">
                            <h5 className="">
                              Welcome to SabPaisa
                            </h5>
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
                                    {
                                      !hideDetails &&
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
                                    }

                                    <div className="sminputs">
                                      <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="mobile"
                                        >
                                          Mobile Number
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
                                      {
                                        !hideDetails &&
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
                                      }

                                      <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="business_category"
                                        >
                                          Business Category
                                        </label>
                                        <Field
                                          name="business_cat_code"
                                          className="form-select"
                                          component="select"
                                        >
                                          <option
                                            type="text"
                                            className="form-select"
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
                                  {
                                    !hideDetails &&
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
                                          placeholder="Re-enter the password"
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

                                  }
                                  <div className="sminputs">
                                    <div className="simform__actions-">
                                      <button
                                        className="figmabtn  text-white disabled1 w-50"
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
                                        Create an account
                                      </button>

                                      {/* <span className="simform__actions-sidetext"></span>
                                      {<ErrorMessage name="terms_and_condition">
                                          {(msg) => (
                                            <p
                                              className="abhitest errortxt">
                                              {msg}
                                            </p>
                                          )}
                                        </ErrorMessage>} */}
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
       
        </div>
        {/* ./row */}
      </div>
    </>
  );
}

export default Registration;
