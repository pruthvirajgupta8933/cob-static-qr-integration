import React from "react";
import sabpaisalogo_white from "../../assets/images/sabpaisa-logo-white.png";
import DemoHeader from "./DemoHeader";


function DemoLogin() {

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
              LOGIN
            </p>
          </div>
          <div className="border ">
            <p className="text-center p-25 m-0">
              Enter your email and password to <strong>login in</strong>{" "}
            </p>
          </div>
          <div className="login-form-part p-2 m-3">
            <div>
              <div className="form-group">
                <label
                  htmlFor="exampleInputEmail1"
                  className="font-weight-normal"
                >
                  USER NAME *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="User Name"
                  aria-describedby="emailHelp"
                />
              </div>

              <div>
                <span className="font-weight-normal">PASSWORD *</span>
                <div className="input-group mb-3 mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <span className="input-group-text" id="basic-addon2">
                      Show - Hide
                      <i className="ml-1 fa fa-eye" aria-hidden="true"></i>
                      <i
                        className="ml-1  fa fa-eye-slash"
                        aria-hidden="true"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-md bg-black">
                <span className="text-white">
                  Login <i className="fa fa-circle-o-notch fa-spin"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </React.Fragment>
  
  );
}

export default DemoLogin;
