import React from 'react'
import HeaderPage from './HeaderPage'

function LoginPage() {
  return (
    <>
      <HeaderPage />
      <div className="container-fluid">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-12 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-5 authfy-panel-left">
              <div className="brand-col">
                <div className="headline">
                  {/* brand-logo start */}
                  <div className="brand-logo">
                    <img
                      src="sabpaisa-logo-white.png"
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
                          <a href="#" style={{ width: "100%" }}>
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
                            <form
                              acceptCharset="utf-8"
                              action="#"
                              className="simform"
                            >
                              <div className="sminputs">
                                <div className="input full">
                                  <label
                                    className="string optional"
                                    htmlFor="user-name"
                                  >
                                    Email*
                                  </label>
                                  <input
                                    className="string optional"
                                    maxLength={255}
                                    id="user-email"
                                    placeholder="Email"
                                    type="email"
                                    size={50}
                                  />
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
                                  <input
                                    className="string optional"
                                    maxLength={255}
                                    id="user-pw"
                                    placeholder="Password"
                                    type="password"
                                    size={50}
                                  />
                                  <span className="hide-password">Show</span>
                                </div>
                              </div>
                              <div className="simform__actions">
                                {/*<input class="sumbit" name="commit" type="sumbit" value="Log In" />*/}
                                <a
                                  href="./dashboard/payout.html"
                                  className="sumbit"
                                  name="commit"
                                  type="sumbit"
                                  value="Log In"
                                  style={{ color: "#fff" }}
                                >
                                  LogIn
                                </a>
                                <span className="simform__actions-sidetext">
                                  <a className="special" role="link" href="#">
                                    Forgot your password? Click here
                                  </a>
                                </span>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                {/* ./panel-login */}
                {/* panel-signup start */}
                <div className="authfy-panel panel-signup text-center">
                  <div className="row">
                    <div className="col-xs-12 col-sm-12">
                      <div className="authfy-heading">
                        <h3 className="auth-title">Sign up for free!</h3>
                      </div>
                      <form
                        name="signupForm"
                        className="signupForm"
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
                          <input
                            type="text"
                            className="form-control"
                            name="fullname"
                            placeholder="Full name"
                          />
                        </div>
                        <div className="form-group">
                          <div className="pwdMask">
                            <input
                              type="password"
                              className="form-control"
                              name="password"
                              placeholder="Password"
                            />
                            <span className="fa fa-eye-slash pwd-toggle" />
                          </div>
                        </div>
                        <div className="form-group">
                          <p className="term-policy text-muted small">
                            I agree to the <a href="#">privacy policy</a> and{" "}
                            <a href="#">terms of service</a>.
                          </p>
                        </div>
                        <div className="form-group">
                          <button
                            className="btn btn-lg btn-primary btn-block"
                            type="submit"
                          >
                            Sign up with email
                          </button>
                        </div>
                      </form>
                      <a
                        className="lnk-toggler"
                        data-panel=".panel-login"
                        href="#"
                      >
                        Already have an account?
                      </a>
                    </div>
                  </div>
                </div>{" "}
                {/* ./panel-signup */}
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