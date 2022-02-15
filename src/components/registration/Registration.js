import React,{useEffect,useState} from 'react';
//import Header from './Header'
import HeaderPage from '../login/HeaderPage'
import '../login/css/home.css'
import '../login/css/homestyle.css'
import '../login/css/style-style.css'
import '../login/css/style.css'
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { register } from "../../slices/auth";
import { Link, useHistory  } from "react-router-dom";
import { toast, Zoom } from 'react-toastify';


const INITIAL_FORM_STATE = {
  fullName:'',
  mobileNumber:'',
  email:'',
  password:'',
  selectStates:''
};

// const INITIAL_VALUES= {
//   firstname: '',
//   lastname: '',
//   mobilenumber: '',
//   emaill:'',
//   passwordd: '',
//   confirmpasswordd: ''
// }

const FORM_VALIDATION = Yup.object().shape({
  firstname: Yup.string().required("Required"),
  lastname: Yup.string().required("Required"),
  mobilenumber: Yup.string().required("Required"),
  emaill: Yup.string().required("Required"),
  passwordd: Yup.string().required("Password Required"),
  // confirmpasswordd: Yup.string().required("Password Required"),
  confirmpasswordd: Yup.string()
     .oneOf([Yup.ref('passwordd'), null], 'Passwords must match')
});

function Registration() {
  const history = useHistory()
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [isActive, setActive] = useState(true);
  const [values, setValues] = useState({
    showPassword: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
      localStorage.setItem("register", "");
  }, []);

  const saved = localStorage.getItem("register");

  const handleRegistration = (formData) => {
    var businessType = isActive? 1 : 2 ;
    var { firstname, lastname , mobilenumber, emaill, passwordd } = formData;
    var firstName = firstname;
    var lastName = lastname;
    var mobileNumber = mobilenumber;
    var email = emaill;
    var password = passwordd;

        setLoading(true);
        // console.log(formValue);
        dispatch(register({ firstName, lastName, mobileNumber, email, password, confirmPassword,businessType}))
          .unwrap()
          .then(() => {
            history.push("/dashboard");
            // window.location.reload();
          })
          .catch(() => {
            toast.error("Sign Up Unsuccessfull",{
              position: "top-right",
              autoClose: 1000,
              transition: Zoom,
              limit: 2,
            })
            setLoading(false);
          });
  }


 
 

  const toggleClass = () => {
    setActive(!isActive);
  };


  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  

  

return (
        <>
        <HeaderPage/>
        <div className="container-fluid">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-10 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-5 authfy-panel-left">
              <div className="brand-col">
                <div className="headline">
                  {/* brand-logo start */}
                  <div className="brand-logo">
                    <img src={sabpaisalogo} width={150} alt="SabPaisa" title="SabPaisa" />
                  </div>{/* ./brand-logo */}
                  <p style={{fontSize: '20px', lineHeight: '20px'}}>Receive Payments, The Easy Way</p>
                  <h1 style={{fontSize: '26px'}}>A Payments Solution for</h1>
                  <h1 style={{fontSize: '26px', whiteSpace: '10px'}}>Businesses,&nbsp;SMEs,&nbsp;Freelancers, Homepreneurs.</h1>
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
                        <li data-tabtar="lgm-2" id="lgm-2" className={isActive ? 'current': 'left'} 
                        onClick={toggleClass} ><Link id="btnLeft" href="javascript:void(0)">Individual</Link></li>
                        <li data-tabtar="lgm-1" id="lgm-1" className={isActive ? 'right': 'current'} 
                      onClick={toggleClass} ><Link id="btnRight" href="javascript:void(0)">Business</Link></li>
                      </ul>
                      <div className="logmod__tab-wrapper">
                        <div className={isActive ? 'show logmod__tab lgm-1 ': 'logmod__tab lgm-1 '} >
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle">Enter your personal details <strong>to create an account</strong></span>
                            {/* {saved &&
                            <div style={{ borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0,}} className="alert alert-success">User successfully Signed in</div>
                            } */}
                          </div>
                          <div className="logmod__form">
                          <Formik initialValues={{
                          firstname: '',
                          lastname: '',
                          mobilenumber: '',
                          emaill:'',
                          passwordd: '',
                          confirmpasswordd: ''

                         }}
                        validationSchema={FORM_VALIDATION} 
                        onSubmit= { handleRegistration}
                        >
                            <Form acceptCharset="utf-8" action="#" className="simform">
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">First Name *</label>
                                  <Field className="string optional" maxLength={255} id="user-name"  placeholder="First Name" type="text" name='firstname' size={50}/>
                                  {<ErrorMessage name="firstname">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Last Name*</label>
                                  <Field className="string optional" maxLength={255} id="user-name" placeholder="Last Name" name = 'lastname' type="text" size={50} />
                                  {<ErrorMessage name="lastname">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                </div>                                
                              </div>
                              <div className="sminputs">
                              <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Mobile Number*</label>
                                  <Field className="string optional" maxLength={10} id="user-name" placeholder="Mobile Number" name = 'mobilenumber' type="number" size={10}/>
                                  {<ErrorMessage name="mobilenumber">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-email">Email*</label>
                                             <Field className="string optional" maxLength={255} id="email" placeholder="email" type="email" name = 'emaill'  size={50} />
                                             {<ErrorMessage name="emaill">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}

                                  
                                </div>
                                </div>
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Password *</label>
                                  <Field className="string optional" maxLength={255} id="user-pw" placeholder="Password" type="password" name = "passwordd" size={50} autocomplete="off" />
                                  {<ErrorMessage name="passwordd">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}

                            
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Confirm Password *</label>
                                  <Field className="string optional" maxLength={255} id="user-pw" placeholder="Confirm Password" type="password"  name="confirmpasswordd" size={50} />
                                  <input type="hidden" name="requestedClientType" value="1" />
                                  {<ErrorMessage name="confirmpasswordd">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                
                                  <span className="hide-password">Show</span>
                                </div>
                                
                                
                              </div>
                              <div className="sminputs">                              
                              <div className="simform__actions">
                              {/* <button
                                  className="sumbit"
                                  type="sumbit"
                                  style={{ color: "#fff" }}
                                  onClick={handleRegistration}
                                > 
                                  Create Account
                                </button> */}
                                <button className="sumbit" name="commit" type="submit" defaultValue="Create Account" >Create Account </button>
                                <span className="simform__actions-sidetext"><span className="ant-checkbox"><input  style={{ marginTop :"-7px"}}name="agreement" id="agreement" type="checkbox" className="form-check-input" defaultValue /></span> I agree to the <a className="special" role="link" href="#">Terms &amp; Conditions</a></span>
                              </div>
                              </div>
                            </Form>
                            </Formik>
                          
                          </div> 
                        </div>
                        <div   className={isActive ? ' logmod__tab lgm-2 ': 'logmod__tab lgm-2  show'} >
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle">Create New Account <strong>Enter your details below</strong></span>
                          </div> 
                          <div className="logmod__form">
                            <Formik initialValues={{
                          firstname: '',
                          lastname: '',
                          mobilenumber: '',
                          emaill:'',
                          passwordd: '',
                          confirmpasswordd: '' 
                          
                        }}
                        validationSchema={FORM_VALIDATION} 
                        onSubmit={ handleRegistration}
                          >
                            <Form acceptCharset="utf-8" action="#" className="simform">
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">First Name*</label>
                                  <Field className="string optional" name='firstname' maxLength={255} id="user-name" placeholder="First Name" type="text" size={50} />
                                  {<ErrorMessage name="firstname">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Last Name*</label>
                                  <Field className="string optional" maxLength={255} id="user-name" placeholder="Last Name" type="text" size={50} name = 'lastname' />
                                  {<ErrorMessage name="lastname">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Mobile Number*</label>
                                  <Field className="string optional" maxLength={10} id="user-name" placeholder="Mobile Number" type="number" size={50} name = 'mobilenumber' />
                                  {<ErrorMessage name='mobilenumber'>
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                                  
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Email*</label>
                                  <Field className="string optional" maxLength={255} id="email" placeholder="email" type="email" size={50} name='emaill'/>
                                  {/* <span style= {{marginTop: "26px"}}className="hide-password">Show</span> */}
                                  {<ErrorMessage name='emaill'>
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}     
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Password *</label>
                                  <Field className="string optional" maxLength={255} id="user-pw" placeholder="Password" type="password" size={50} name = 'passwordd' autocomplete="off" />
                                  {<ErrorMessage name='passwordd'>
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>} 
                            
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Confirm Password *</label>
                                  <Field className="string optional" maxLength={255} id="user-pw" placeholder="Confirm Password" type="password" size={50} name='confirmpasswordd' />
                                  {<ErrorMessage name='confirmpasswordd'>
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>} 

                                  <input  type="hidden" name="requestedClientType" value="2" />
                                
                                  <span className="hide-password">Show</span>
                                </div>
                              </div>


                              <div className="simform__actions">
                              <button className="sumbit" name="commit" type="submit" defaultValue="Create Account" >Create Account </button>
                                 <span className="simform__actions-sidetext"><span className="ant-checkbox"><input  style={{ marginTop :"-7px"}}name="agreement" id="agreement" type="checkbox" className="form-check-input" defaultValue /></span> I agree to the <a className="special" role="link" href="#">Terms &amp; Conditions</a></span>
                              </div> 
                            </Form>
                            </Formik>
                          </div> 
                        </div>
                      </div>
                    </div>
                  </div>
                </div> {/* ./panel-login */}
                {/* panel-signup start */}
                <div className="authfy-panel panel-signup text-center">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      <div className="authfy-heading">
                        <h3 className="auth-title">Sign up for free!</h3>
                      </div>
                      <form name="signupForm" className="signupForm" action="#" method="POST">
                        <div className="form-group">
                          <input type="email" className="form-control" name="username" placeholder="Email address" />
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-control" name="fullname" placeholder="Full name" />
                        </div>
                        <div className="form-group">
                          <div className="pwdMask">
                            <input type="password" className="form-control" name="password" placeholder="Password" />
                            <span className="fa fa-eye-slash pwd-toggle" />
                          </div>
                        </div>
                        <div className="form-group">
                          <p className="term-policy text-muted small">I agree to the <a href="#">privacy policy</a> and <a href="#">terms of service</a>.</p>
                        </div>
                        <div className="form-group">
                          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up with email</button>
                        </div>
                      </form>
                      <a className="lnk-toggler" data-panel=".panel-login" href="#">Already have an account?</a>
                    </div>
                  </div>
                </div> {/* ./panel-signup */}
                {/* panel-forget start */}
                <div className="authfy-panel panel-forgot">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      <div className="authfy-heading">
                        <h3 className="auth-title">Recover your password</h3>
                        <p>Fill in your e-mail address below and we will send you an email with further instructions.</p>
                      </div>
                      <form name="forgetForm" className="forgetForm" action="#" method="POST">
                        <div className="form-group">
                          <input type="email" className="form-control" name="username" placeholder="Email address" />
                        </div>
                        <div className="form-group">
                          <button className="btn btn-lg btn-primary btn-block" type="submit">Recover your password</button>
                        </div>
                        <div className="form-group">
                          <a className="lnk-toggler" data-panel=".panel-login" href="#">Already have an account?</a>
                        </div>
                        <div className="form-group">
                          <a className="lnk-toggler" data-panel=".panel-signup" href="#">Don’t have an account?</a>
                        </div>
                      </form>
                    </div>
                  </div>
                </div> {/* ./panel-forgot */}
              </div> {/* ./authfy-login */}
            </div>
          </div>
        </div> {/* ./row */}
      </div>
      </>
    )
}

export default Registration
