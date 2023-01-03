import React from 'react'
import sabpaisalogo_white from "../../assets/images/sabpaisa-logo-white.png";
import DemoHeader from './DemoHeader'

function DemoReg() {
  return (
    <React.Fragment>
  <DemoHeader/>
  <div className="container-fluid bg-light login-m-container">
      <div className="row mobile-view-col">
        <div className="col-lg-6 bg-black center-left-content h-full">
          <div className="left-panal-logo-mt">
            <img
              src={sabpaisalogo_white}
              alt="sabpaisa"
              className="logo-h bg-black"
            />
          </div>
          <div className="left-panal-logo-mb">
            <p className="text-white font-size-24 mt-2">Receive Payments, The Easy Way</p>
            <p className="text-white font-size-24 m-0">A Payments Solution for</p>
            <p className="text-white font-size-24 m-0">Businesses, SMEs, Freelancers, Homepreneurs.</p>
          </div>
        </div>
        <div className="col-lg-6 p-0 ">
          <div className="bg-orange">
            <p className="text-white font-weight-bold text-center p-25 m-0">
              SIGN UP
            </p>
          </div>
          <div className="d-flex">
            <div className="login-type"> <button type="button" className="btn btn-secondary btn-lg sign-up-type-btn text-white selected-btn"><span className="fa fa-user mr-2"></span>INDIVIDUAL</button></div>
            <div className="login-type"> <button type="button" className="btn btn-secondary btn-lg sign-up-type-btn text-white"><span className="fa fa-users mr-2"></span>BUSINESS</button> </div>
           
          </div>
          <div className="border ">
            <p className="text-center p-25 m-0">
            Enter your personal details <strong>to create an account</strong>{" "}
            </p>
        </div>
        <div className="login-form-part p-2 m-3">
            <form>
                <div className="form-row">  
                    <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">FIRST NAME *</label>
                    <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">LAST NAME*</label>
                    <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                    </div>
                </div>
                <div className="form-row">  
                    <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">MOBILE NUMBER*</label>
                    <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">EMAIL*</label>
                    <input type="password" className="form-control" id="inputPassword4" placeholder="Password" />
                    </div>
                </div>
                <div className="form-row">  
                    <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">CREATE PASSWORD *</label>
                    <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                    </div>
                    <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">CONFIRM PASSWORD *</label>
                    <input type="email" className="form-control"  placeholder="Email" />
                    </div>
                </div>
             
                <div className="form-group">
    <div className="form-check">
      <input className="form-check-input" type="checkbox" />
      <label className="form-check-label mt-1">
        Show Password
      </label>
    </div>
  </div>
                <div className="form-row">  
                    <div className="form-group col-md-6">
                    <label className="form-check-label" htmlFor="gridCheck">
                    Click here to accept terms and conditions
                    </label>
                    </div>
                    <div className="form-group col-md-6">
                    <button type="submit" className="btn bg-black text-white">Create Account</button>
                    </div>
                </div>
        </form>
        </div>
        </div>
    </div>
    </div>
    </React.Fragment>
    
  )
}

export default DemoReg