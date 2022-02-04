import React,{useState,useEffect} from 'react'
import HeaderPage from './HeaderPage'
import { useDispatch, useSelector } from 'react-redux';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'
import { Formik, Field, Form,ErrorMessage} from "formik";
import { useHistory  } from "react-router-dom";
import * as Yup from 'yup';
import { login,logout } from "../../slices/auth";
import { clearMessage } from "../../slices/message";
import OtpView from "../login/OtpView";
import toastConfig from "../../utilities/toastTypes";
import OTPVerificationApi from "../../slices/auth";
import {Link} from 'react-router-dom'
import DisplayErrorMessage from '../../_components/reuseable_components/DisplayErrorMessage';


const INITIAL_FORM_STATE = {
  clientUserId:'',
  userPassword:''
};

const FORM_VALIDATION = Yup.object().shape({
  clientUserId: Yup.string().required("Required"),
  userPassword: Yup.string().min(6, "Password minimum length should be 6").required('Password is required')
});


function LoginPage(props) {
  const history = useHistory()
  const [loading, setLoading] = useState(false);
  const  isLoggedIn  = useSelector((state) => state.auth.isLoggedIn);
  var { message } = useSelector((state) => state.message);
  const authentication = useSelector(state => state.auth);

  const [open, setOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = React.useState('Username or password not valid');
  const [auth,setAuthData] = useState(authentication);
  const [showOTP, setShowOtp] = useState(false);
  const [signUpOrSignIn,setSignUpOrSignIn]=useState(false)
  const [otp, setOtp] = useState({ otp: "" });
  const [otpVerificationError, setOtpVerificationError] = useState("");
  const [showResendCode, setShowResendCode] = useState(false);
  const [showBackDrop, setShowBackDrop] = useState(false);
  const [GeoLocation, setGeeolocation] = useState("");

 
  const dispatch = useDispatch();

  // message = message?.length>=0?message=null:message;
  console.log(message)
  useEffect(()=>{
    setAuthData(authentication);
    // console.log('change auth data',auth);
    redirectRoute(auth);
},[authentication])

useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

useEffect(() => {
    // console.log('call one tiem');
    dispatch(logout());
}, [])

const handleLogin = (formValue) => {
  var { clientUserId, userPassword } = formValue;
  var username= clientUserId; 
  var password= userPassword; 
  setLoading(true);
  // console.log(formValue);
  dispatch(login({ username, password }))
    .unwrap()
    .then(() => {
      history.push("/dashboard");
      // window.location.reload();
    })
    .catch(() => {
      setLoading(false);
    });
};

const handleChangeForOtp = (otp) => {
  const regex = /^[0-9]*$/;
  if (!otp || regex.test(otp.toString())) {
    setOtp({ otp });
  }
};


const redirectRoute = (authen) => {
  // console.log('function call route');
  // console.log('isLoggedIn',isLoggedIn);
  // console.log('authvaliduser',authen.isValidUser);
  if (isLoggedIn ) {
      setOpen(false);
        // console.log('redirect','dashboard')
        history.push("/dashboard");
    }
    if (authen.isValidUser==="No"){
        setOpen(true);
    }
};


const handleClickForVerification = () => {
  setShowBackDrop(true);
  dispatch(
    OTPVerificationApi({
      //verification_code: AuthToken,
      otp: parseInt(otp.otp, 10),
      geo_location: GeoLocation,
    })
  ).then((res) => {
    if (res) {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.response_code === "1") {
          setOtpVerificationError("");
          setShowBackDrop(false);
          history.push("/ledger");
        } else if (res.payload.response_code === "0") {
          setShowBackDrop(false);
          toastConfig.errorToast(res.payload.message);
        }
      } else {
        setShowBackDrop(false);
        setShowResendCode(true);
      }
    }
  });
};


const handleClick = () => {
  setOpen(true);
};

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
  return;
  }

  setOpen(false);
};




  return (
    <>
      <HeaderPage />
      <DisplayErrorMessage data={message} />
    {/* <p className="showErrormsg">{message && message!=''?message:''}</p> */}
      <div className="container-fluid">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-5 authfy-panel-left">
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
                  <h1 style={{ fontSize: "26px" }}>A Payments Solution for</h1>
                  <h1 style={{ fontSize: "26px", whiteSpace: "10px" }}>
                    Businesses,&nbsp;SMEs,&nbsp;Freelancers, Homepreneurs.
                  </h1>
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
                      <ul className="logmod__tabs">
                        <li data-tabtar="lgm-2" className="current">
                          <a href="javascript:void(0)" style={{ width: "100%" }}>
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
                                        ...INITIAL_FORM_STATE
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
                                    Email*
                                  </label>
                                  <Field
                                    className="string optional"
                                    maxLength={255}
                                    id="user-email"
                                    placeholder="Email"
                                    type="text"
                                    name="clientUserId"
                                  />
                                  <ErrorMessage name="clientUserId">
                                      { msg => <div className="abhitest" style={{color: "red",position: "absolute",zIndex:" 999"}}>{msg}</div> }
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
                                    type="password"
                                    size={50}
                                    name="userPassword"
                                  />
                                  <ErrorMessage name="userPassword">
                                      { msg => <div className="abhitest" style={{color: "red",position: "absolute",zIndex:" 999"}}>{msg}</div> }
                                  </ErrorMessage>
                                  <span className="hide-password">Show</span>
                                </div>
                              </div>
                              <div className="simform__actions">
                                {/*<input class="sumbit" name="commit" type="sumbit" value="Log In" />*/}
                                <button
                                  className="sumbit"
                                  type="sumbit"
                                  style={{ color: "#fff" }}
                                > {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                  LogIn
                                </button>
                                <span className="simform__actions-sidetext">
                                  <Link className="special" role="link" to="/forget">
                                    Forgot your password? Click here
                                  </Link>
                                </span>
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
                            href="#"
                          >
                            Already have an account?
                          </a>
                        </div>
                        <div className="form-group">
                          <a
                            className="lnk-toggler"
                            data-panel=".panel-signup"
                            href="#"
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
          </div>
        </div>{" "}
        {/* ./row */}
      </div>
    </>
  );
}

export default LoginPage