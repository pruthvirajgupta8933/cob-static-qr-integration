import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import API_URL from "../../config";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";

const CreatePassword = (props) => {
  const { auth } = useSelector((state) => state);
  const verification_token = auth.forgotPassword.otpResponse.verification_token;
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password Required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password Required"),
  });
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });
  const [passwordType, setPasswordType] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const handlePasswordChange = (evnt) => {
    setPasswordInput(evnt.target.value);
  };
  const togglePassword = () => {
    setPasswordType(!passwordType);
  };

  const initialValues = {
    password: "",
    confirmpassword: "",
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const onSubmit = async (values) => {
    const res = await axiosInstanceJWT
      .put(API_URL.AUTH_CREATE_NEW_PASSWORD, {
        email: "textbhuvi@gmail.com",
        verification_token: verification_token,
        password: values.password,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          props.props("a3");
        } else {
          toast.error(response.data.message);
        }
      });

    props.props("a4");
  };

  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Create Password</div>
            <div className="card-body NunitoSans-Regular">
              <h5 className="card-title">Please Enter the detatils. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ formik }) => (
                  <>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">
                          New Password
                        </label>
                        <div className="input-group" id="show_hide_password">
                          <Field
                            name="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            aria-describedby="PasswordHelp"
                            placeholder="Enter New Password"
                            type={values.showPassword ? "text" : "password"}
                          />

                          <div className="input-group-addon viewicon">
                            <a onClick={handleClickShowPassword}>
                              {" "}
                              {values.showPassword ? (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              )}
                            </a>
                          </div>
                        </div>
                        <ErrorMessage name="password">
                          {(msg) => (
                            <div
                              className="abhitest"
                              style={{
                                color: "red",
                                position: "absolute",
                                zIndex: " 999",
                              }}
                            >
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                        {/* <label htmlFor="exampleInputPassword2">
                          New Password
                        </label> */}
                        <div className="input-group mt-40">
                          <Field
                            name="confirmpassword"
                            className="form-control"
                            id="exampleInputPassword2"
                            aria-describedby="PasswordHelp"
                            placeholder="Re-type password"
                            type={passwordType ? "password" : "text"}
                            // onChange={handlePasswordChange}
                            // value={passwordInput}
                          />
                          <div className="input-group-addon viewicon">
                            <a onClick={togglePassword}>
                              {passwordType === "confirmpassword" ? (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              )}
                            </a>
                          </div>
                                              </div>
                                              <ErrorMessage name="confirmpassword">
                            {(msg) => (
                              <div
                                className="abhitest"
                                style={{
                                  color: "red",
                                  position: "absolute",
                                  zIndex: " 999",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>

                      </div>

                      <button
                        type="submit"
                        className="createpasswordBtn mt-3 text-white"
                        // onClick={() => props.props("a4")}
                      >
                        Submit
                      </button>
                    </Form>
                  </>
                )}
              </Formik>
            
            </div>
            <div className="card-footer text-muted text-center">
              Sabpaisa.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
