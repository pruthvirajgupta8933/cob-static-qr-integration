import React, { useEffect, useState } from "react";
import "../../login/css/home.css"
import "../../login/css/homestyle.css"
import "../../login/css/style-style.css"
import "../../login/css/style.css"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register, udpateRegistrationStatus } from "../../../slices/auth";
import { useHistory } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import API_URL from "../../../config";
import { axiosInstanceAuth } from "../../../utilities/axiosInstance";
import NavBar from "../../dashboard/NavBar/NavBar";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";



const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
  fullname: Yup.string()
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("Required"),
  // lastname: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").required("Required"),
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
  roleId: Yup.string().required("Required")
});

const OnboardMerchant = () => {
  const history = useHistory();

  const reduxState = useSelector((state) => state);
  const { message, auth } = reduxState;
  const datar = auth;
  const { isUserRegistered, user } = datar;
  const [checkboxStatus, setCheckboxStatus] = useState(Array(3).fill(false));
  const [isActive, setActive] = useState(true);
  const [acceptTc, setAcceptTc] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);

  const [businessCode, setBusinessCode] = useState([]);
  const [roles,setRoles] = useState([]);

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });

  function buttonHandler(index) {
    let status = [...checkboxStatus];
    status[index] = !status[index];
    setCheckboxStatus(status);
  }

  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.Business_Category_CODE)
      .then((resp) => {
        const data = resp.data;
        setBusinessCode(data);
      })
      .catch((err) => console.log(err));
  }, []);


  
  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.Roles_DropDown)
      .then((resp) => {
        const data = resp.data;
        // console.log("Roles DropDown",data)
        setRoles(data);
      })
      .catch((err) => console.log(err));
  }, []);


  const dispatch = useDispatch();

  const handleRegistration = (formData) => {

    let businessType = 1;
    let {
      fullname,
      mobilenumber,
      emaill,
      passwordd,
      business_cat_code,
      roleId
    } = formData;

    dispatch(
      register({
        fullname: fullname,
        mobileNumber: mobilenumber,
        email: emaill,
        business_cat_code: business_cat_code,
        password: passwordd,
        businessType: businessType,
        isDirect: false,
        requestId: user?.loginId,
        roleId: roleId
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

  const toggleClass = () => {
    setActive(!isActive);
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

      history.push("/dashboard/approver");
    }

    if (isUserRegistered === false) {
      toast.error(message.message, {
        position: "top-right",
        autoClose: 5000,
        limit: 5,
        transition: Zoom,
      });
    }
    return () => {
      // dispatch(udpateRegistrationStatus());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserRegistered]);

  const callBackFn = (isClickOnAccept, isChecked) => {
    setAcceptTc(!acceptTc);
    setIsCheck(isChecked);
  };

  const handlerTermCond = (isChecked) => {
    setBtnDisable(isChecked);
  };
  return (
    <>
      {/* <HeaderPage /> */}
      <div className="ant-layout">
        < NavBar />
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-8 col-sm-offset-1- col-md-offset-2- col-lg-offset-3- mx-auto">

            <div className="col-sm-12- authfy-panel-right-">
              <div className="authfy-login" style={{overflow:"scroll"}}>
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">

                      <div className="logmod__tab-wrapper">
                        <div className="show logmod__tab lgm-1">
                          <div className="logmod__heading">
                            <span className="fontfigma">
                              OnBoard Merchant
                            </span>

                          </div>
                          <div className="logmod__form">
                            <Formik
                              initialValues={{
                                fullname: "",
                                mobilenumber: "",
                                emaill: "",
                                passwordd: "",
                                business_cat_code: "",
                                confirmpasswordd: "",
                                roleId:"",
                                // termsAndConditions: false,
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

                                  {/* {console.log(values)} */}
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
                                    <div className="input full- optional">
                                        <label
                                          className="string optional"
                                          htmlFor="business_category"
                                        >
                                          Roles
                                        </label>
                                        <Field
                                          name="roleId"
                                          className="selct"
                                          component="select"
                                        >
                                          <option
                                            type="text"
                                            className="form-control"
                                          >
                                            Select Roles
                                          </option>
                                          {roles.map((role, i) => (
                                            <option
                                              value={role.roleId}
                                              key={i}
                                            >
                                              {role.roleName.toUpperCase()}
                                            </option>
                                          ))}
                                        </Field>
                                        {
                                          <ErrorMessage name="roleId">
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


                                  </div>
                                  

                                  <div className="sminputs">
                                  
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
                                          valuesIn.showPassword
                                            ? "text"
                                            : "password"
                                        }
                                        name="confirmpasswordd"
                                        size={50}
                                      />
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

                                      <span
                                        className="hide-password"
                                        onClick={handleClickShowPassword}
                                        style={{ marginTop: "49px", marginRight: "-20px" }}
                                      >
                                        {valuesIn.showPassword ? (
                                          <i class="fa fa-eye" aria-hidden="true"></i>
                                        ) : (
                                          <i
                                            class="fa fa-eye-slash"
                                            aria-hidden="true"
                                          ></i>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="sminputs">
                                    <div className="simform__actions">
                                      <button
                                        className="figmabtn text-white mt-4 disabled1"
                                        name="commit"
                                        type="submit"
                                        defaultValue="Create Account"
                                        // disabled={btnDisable}
                                        disabled={(!(formik.isValid && formik.dirty)) ? true : false}
                                        data-rel={btnDisable}
                                      >
                                        Submit
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

            </div>
          </div>

        </div>

      </div>
    </>
  )
}

export default OnboardMerchant