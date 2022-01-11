import React from 'react'
import Header from './Header'

function Registration() {
    return (
        <>
        <Header/>
        <div className="container-fluid">
        <div className="row">
          <div className="authfy-container col-xs-12 col-sm-10 col-md-8 col-lg-10 col-sm-offset-1- col-md-offset-2- col-lg-offset-3-">
            <div className="col-sm-5 authfy-panel-left">
              <div className="brand-col">
                <div className="headline">
                  {/* brand-logo start */}
                  <div className="brand-logo">
                    <img src="sabpaisa-logo-white.png" width={150} alt="SabPaisa" title="SabPaisa" />
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
                        <li data-tabtar="lgm-2"><a href="#">Individual</a></li>
                        <li data-tabtar="lgm-1"><a href="#">Business</a></li>
                      </ul>
                      <div className="logmod__tab-wrapper">
                        <div className="logmod__tab lgm-1">
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle">Enter your personal details <strong>to create an acount</strong></span>
                          </div>
                          <div className="logmod__form">
                            <form acceptCharset="utf-8" action="#" className="simform">
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Full Name*</label>
                                  <input className="string optional" maxLength={255} id="user-name" placeholder="Full Name" type="text" size={50} />
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Mobile Number*</label>
                                  <input className="string optional" maxLength={10} id="user-name" placeholder="Mobile Number" type="number" size={10} />
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Email*</label>
                                  <input className="string optional" maxLength={255} id="user-name" placeholder="email" type="email" size={50} />
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Password *</label>
                                  <input className="string optional" maxLength={255} id="user-pw" placeholder="Password" type="password" size={50} />
                                  <span className="hide-password">Show</span>
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full">
                                  <label className="string optional" htmlFor="user-pw">Select *</label>
                                  {/*<input class="string optional" maxlength="255" id="user-pw" placeholder="Password" type="password" size="50" />*/}
                                  <select name="states" id="states" className="string optional" style={{border: '1px solid #fafafa', width: '100%', marginBottom: '10px', padding: '2px'}}>
                                    <option value="Select States" selected>Select States</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>								
                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                                    <option value="Daman and Diu">Daman and Diu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Puducherry">Puducherry</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                  </select>					
                                </div>
                              </div>
                              <div className="simform__actions">
                                <input className="sumbit" name="commit" type="sumbit" defaultValue="Create Account" />
                                <span className="simform__actions-sidetext"><span className="ant-checkbox"><input name="agreement" id="agreement" type="checkbox" className="ant-checkbox-input" defaultValue /><span className="ant-checkbox-inner" /></span> I agree to the <a className="special" role="link" href="#">Terms &amp; Conditions</a></span>
                              </div>
                            </form>
                          </div> 
                        </div>
                        <div className="logmod__tab lgm-2">
                          <div className="logmod__heading">
                            <span className="logmod__heading-subtitle">Create New Account <strong>Enter your details below</strong></span>
                          </div> 
                          <div className="logmod__form">
                            <form acceptCharset="utf-8" action="#" className="simform">
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Full Name*</label>
                                  <input className="string optional" maxLength={255} id="user-name" placeholder="Full Name" type="text" size={50} />
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Mobile Number*</label>
                                  <input className="string optional" maxLength={10} id="user-name" placeholder="Mobile Number" type="number" size={10} />
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-name">Email*</label>
                                  <input className="string optional" maxLength={255} id="user-name" placeholder="email" type="email" size={50} />
                                </div>
                                <div className="input full- optional">
                                  <label className="string optional" htmlFor="user-pw">Password *</label>
                                  <input className="string optional" maxLength={255} id="user-pw" placeholder="Password" type="password" size={50} />
                                  <span className="hide-password">Show</span>
                                </div>
                              </div>
                              <div className="sminputs">
                                <div className="input full">
                                  <label className="string optional" htmlFor="user-pw">Select *</label>
                                  {/*<input class="string optional" maxlength="255" id="user-pw" placeholder="Password" type="password" size="50" />*/}
                                  <select name="states" id="states" className="string optional" style={{border: '1px solid #fafafa', width: '100%', marginBottom: '10px', padding: '2px'}}>
                                    <option value="Select States" selected>Select States</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chandigarh">Chandigarh</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Dadar and Nagar Haveli">Dadar and Nagar Haveli</option>
                                    <option value="Daman and Diu">Daman and Diu</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Lakshadweep">Lakshadweep</option>
                                    <option value="Puducherry">Puducherry</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                  </select>					
                                </div>
                              </div>
                              <div className="simform__actions">
                                <input className="sumbit" name="commit" type="sumbit" defaultValue="Create Account" />
                                <span className="simform__actions-sidetext"><span className="ant-checkbox"><input name="agreement" id="agreement" type="checkbox" className="ant-checkbox-input" defaultValue /><span className="ant-checkbox-inner" /></span> I agree to the <a className="special" role="link" href="#">Terms &amp; Conditions</a></span>
                              </div> 
                            </form>
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
