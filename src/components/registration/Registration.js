import React, { useEffect, useState } from 'react';
import HeaderPage from '../login/HeaderPage'
import '../login/css/home.css'
import '../login/css/homestyle.css'
import '../login/css/style-style.css'
import '../login/css/style.css'
// import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'
import onlineshopinglogo from '../../assets/images/onlineshopinglogo.png'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register, udpateRegistrationStatus } from "../../slices/auth";
import { useHistory } from "react-router-dom";
import { toast, Zoom } from 'react-toastify';
import TermCondition from './TermCondition';
import API_URL from '../../config';
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson';


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


const FORM_VALIDATION = Yup.object().shape({
  fullname: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").required("Required"),
  // lastname: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").required("Required"),
  mobilenumber: Yup.string().required("Required").matches(phoneRegExp, 'Phone number is not valid')
    .min(10, "Phone number in not valid")
    .max(10, "too long"),
  emaill: Yup.string().email('Must be a valid email').max(255).required("Required"),
  passwordd: Yup.string().required("Password Required").matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"),
  confirmpasswordd: Yup.string().oneOf([Yup.ref('passwordd'), null], 'Passwords must match').required("Confirm Password Required"),
  terms_and_condition: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  business_cat_code: Yup.string().required("Required"),
  // termsAndConditions: Yup.boolean().oneOf([true], "Required"),
});

function Registration() {
  const history = useHistory()

  const reduxState = useSelector(state => state)
  const { message, auth } = reduxState
  const datar = auth;

  const { isUserRegistered } = datar;
  // const [loading, setLoading] = useState(false);
  const [checkboxStatus, setCheckboxStatus] = useState(Array(3).fill(false))
  const [isActive, setActive] = useState(true);
  const [acceptTc, setAcceptTc] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [btnDisable, setBtnDisable] = useState(true);
  const [trmCond, setTrmCond] = useState(false);

  const [businessCode, setBusinessCode] = useState([]);



  const [valuesIn, setValuesIn] = useState({
    password: '',
    showPassword: false,
  });

  function buttonHandler(index) {
   

    let status = [...checkboxStatus];
    status[index] = !status[index]
    setCheckboxStatus(status)
  }


  useEffect(() => {
    axiosInstanceAuth.get(API_URL.Business_Category_CODE).then((resp) => {
      const data = resp.data.message
      // console.log(data,"my all dattaaa")

      setBusinessCode(data)
    }).catch(err => console.log(err))
  }, [])


  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(udpateRegistrationStatus())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleRegistration = (formData) => {

    // console.log(formData, "here is form dataaaaaaaaaaaaaaaaaaaaaaaaaaa")

    // setBtnDisable(true)

    var businessType = 1;
    var { fullname, mobilenumber, emaill, passwordd, business_cat_code } = formData;
    var fullname = fullname;
    var mobileNumber = mobilenumber;
    var email = emaill;
    var business_cat_code = business_cat_code;
    var password = passwordd;



    // setLoading(true);
    // console.log(formValue);
    dispatch(register({ fullname, mobileNumber, email, business_cat_code, password, businessType }))
      .unwrap()
      .then((res) => {
        setBtnDisable(false)
      })
      .catch((err) => {
        setBtnDisable(false)
        // setLoading(false);
      });


  }

  const toggleClass = () => {
    setActive(!isActive);
  };


  const handleClickShowPassword = () => {
    setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
  };


  useEffect(() => {
    // console.log("isUserRegistered",isUserRegistered);
    if (isUserRegistered === true) {
      toast.success("User Registered, Verify Your Email", {
        position: "top-right",
        autoClose: 2000,
        limit: 1,
        transition: Zoom,
      });
      setTimeout(() => {
        // alert("aa4");
        history.push("/login-page");

      }, 2000);
    }

    if (isUserRegistered === false) {
      toast.error(message.message, {
        position: "top-right",
        autoClose: 1500,
        limit: 5,
        transition: Zoom,

      })
    }
    return () => {

      dispatch(udpateRegistrationStatus())

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserRegistered])


  const callBackFn = (isClickOnAccept, isChecked) => {
    setAcceptTc(!acceptTc)
    setIsCheck(isChecked)
  }

  const handlerTermCond = (isChecked)=>{
      setBtnDisable(isChecked)
  }
  // console.log("btnDisable",btnDisable)
  return (
    <>
      <HeaderPage />
      <div className="container toppad">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-5 authfy-panel-left">
              <div className="brand-col">
                <div className="headline">
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
                  <h1 style={{ fontSize: "30px", fontStyle: "Satoshi", color: "#0143A1" }} class="text-center" >Empower your</h1>
                  <h1 style={{ fontSize: "30px", whiteSpace: "20px", fontStyle: "Satoshi", color: "#0143A1" }} class="text-center">
                    business,&nbsp;&nbsp;boost
                  </h1>
                  <h1 style={{ fontSize: "30px", whiteSpace: "20px", fontStyle: "Satoshi", color: "#0143A1" }} class="text-center">
                    your&nbsp;finance
                  </h1>

                  <div className="brand-logo">
                    <div class="text-center">
                      <img
                        src={onlineshopinglogo}
                        width={300}
                        alt="SabPaisa"
                        title="SabPaisa"
                      />
                    </div>
                  </div>
                  {/* <h1 style={{ fontSize: "26px" }}>A Payments Solution for</h1>
                <h1 style={{ fontSize: "26px", whiteSpace: "10px" }}>
                  Businesses,&nbsp;SMEs,&nbsp;Freelancers, Homepreneurs.
                </h1> */}
                </div>
              </div>
            </div>
            <div className="col-sm-7- authfy-panel-right">
              {/* authfy-login start */}
              <div className="authfy-login">
                {/* panel-login start */}
                <div className="authfy-panel panel-login text-center active">
                  <div className="logmod__wrapper">
                    <span className="logmod__close">Close</span>
                    <div className="logmod__container">
                      {/* <ul className="logmod__tabs">
                      <li
                        data-tabtar="lgm-2"
                        id="lgm-2"
                        className={isActive ? "current" : "left"}
                      >
                        <a id="btnLeft" href={()=>false} >
                          
                        </a>
                      </li>
                      <li
                        data-tabtar="lgm-1"
                        id="lgm-1"
                        className={isActive ? "current" : "current"}
                      >
                       <a id="btnLeft" href={()=>false} >
                          
                        </a>
                      </li>
                    </ul> */}
                      <div className="logmod__tab-wrapper">
                        <div className="show logmod__tab lgm-1">
                          <div className="logmod__heading">
                            <span className='fontfigma'>
                              Welcome to SabPaisa{" "}
                            </span>
                            <div className='flex'>
                              <span className='Signupfigma mt-2'>Signup to Create New Account</span>
                            </div>
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
                                // termsAndConditions: false,
                                terms_and_condition: false,
                              }}
                              validationSchema={FORM_VALIDATION}
                              onSubmit={handleRegistration}
                            >
                              {({ values, setFieldValue }) => (

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
                                        <label className="string optional" htmlFor="mobile">Enter Mobile</label>
                                        <Field className="string optional" maxLength={10} id="mobilenumber" placeholder="Mobile Number" name='mobilenumber' type="text" pattern="\d{10}" size={10} onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()} />
                                        {<ErrorMessage name="mobilenumber">
                                          {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                        </ErrorMessage>}
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
                                            id="business_code"
                                          >Select Business Category</option>
                                          {
                                            businessCode.map((business, i) => (
                                              <option value={business.category_code} key={i}>{business.category_name}</option>
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

                                    {/* <div className="input full- optional">
                                  <label
                                    className="string optional"
                                    htmlFor="last-name"
                                  >
                                    Last Name
                                  </label>
                                  <Field
                                    className="string optional"
                                    maxLength={255}
                                    id="last-name"
                                    placeholder="Last Name"
                                    name="lastname"
                                    type="text"
                                    size={50}
                                  />
                                  {
                                    <ErrorMessage name="lastname">
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
                                </div> */}


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
                                        id="user-pw"
                                        placeholder="Type your password here"
                                        type={
                                          valuesIn.showPassword ? "text" : "password"
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
                                                fontSize: "12px"
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
                                          valuesIn.showPassword ? "text" : "password"
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
                                      >
                                        {valuesIn.showPassword ? "Hide" : "Show"}
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
                                        disabled={btnDisable}
                                        data-rel={btnDisable}
                                      >
                                        Create Account
                                      </button>


                                      <span className="simform__actions-sidetext">
                                        {/* {Array(3).fill(0).map((_, index) =>
                                          <Field
                                            type="checkbox"
                                            className="form-check-input"
                                            name="termsAndConditions"
                                            checked={checkboxStatus[index]} onChange={() => buttonHandler(index)}

                                          />
                                        )} */}
                                        {/* {
                                          <ErrorMessage name="termsAndConditions">
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
                                        } */}

                                        {/* <TermCondition acceptTnC={acceptTc} callbackHandler={callBackFn} setFieldValues={setFieldValue} /> */}


                                        {/* <p onClick={()=>{ setAcceptTc(!acceptTc)}} >accept the t&c </p> */}
                                        {/* <p className="mb-0" style={{ cursor: "pointer" }} onClick={() => { callBackFn(acceptTc, isCheck) }} > Click here to accept <span className="text-primary">terms and conditions</span></p> */}
                                        {/* {
                                          
                                        } */}
                                        <span className="ant-checkbox">
                                      <Field
                                        type="checkbox"
                                        className="form-check-input mt-0"
                                        name="terms_and_condition"
                                        onClick={()=>{ handlerTermCond(values?.terms_and_condition)}}
                                      /> 
                                         <p className=" ml-2" style={{ cursor: "pointer" }} onClick={() => { callBackFn(acceptTc, isCheck) }} > Click here to accept <span className="text-primary">terms and conditions</span></p>
                                    </span>
                                 
                      <TermCondition acceptTnC={acceptTc} callbackHandler={callBackFn} setFieldValues={setFieldValue} />
                                    {/* I agree to the{" "}
                                    <a href="https://sabpaisa.in/term-conditions/" rel="noreferrer" className="special" target="_blank" >
                                      Terms &amp; Conditions
                                    </a> */}
                                      </span>
                                      {  <ErrorMessage name="terms_and_condition">
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
                                            </ErrorMessage>}

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
          <p className="footerforcopyright">Copyright 2022 SabPaisa, all rights reserve version 0.1</p>

        </div>

        {/* ./row */}

      </div>

    </>
  );
}

export default Registration
