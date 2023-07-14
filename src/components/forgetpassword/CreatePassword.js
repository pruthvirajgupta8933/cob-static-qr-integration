import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
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


  const [passwordType, setPasswordType] = useState({
    confirmpassword: "",
    showPasswords: false,
  });

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });





  const initialValues = {
    password: "",
    confirmpassword: "",
  };

  const togglePassword = () => {
    setPasswordType({
      ...passwordType,
      showPasswords: !passwordType.showPasswords,
    });
  };


  const handleClickShowPassword = () => {
    setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
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
          <div className="card mt-5 ">
            <div className="card-header text-center">Create Password</div>
            <div className="card-body NunitoSans-Regular">
              <h5 className="card-title">Please Enter the details. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ formik }) => (
                  <>
                    <Form>
                      <div className="form-group m-3">
                        <label htmlFor="exampleInputPassword1">
                          New Password
                        </label>

                        <div className="input-group" id="show_hide_password">
                          <Field
                            className="form-control"
                            maxLength={255}
                            id="user-pws"
                            placeholder="Password"
                            type={
                              valuesIn.showPassword
                                ? "text"
                                : "password"
                            }
                            name="password"
                            autoComplete="off"
                          />

                          <span class="input-group-text">
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
                          </span>

                        </div>
                        <ErrorMessage name="password">
                          {(msg) => (
                            <div className="text-danger">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="form-group m-3">
                        <label htmlFor="exampleInputPassword2">
                          Confirm Password
                        </label>
                        <div className="input-group mt-1">
                          <Field
                            className="form-control"
                            maxLength={255}
                            id="user-cpw"
                            placeholder="Re-type password"
                            type={
                              passwordType.showPasswords
                                ? "text"
                                : "password"
                            }
                            name="confirmpassword"
                            size={50}
                          />

                          <span class="input-group-text">
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
                          </span>
                        </div>
                        <ErrorMessage name="confirmpassword">
                          {(msg) => (
                            <div className="text-danger">
                              {msg}
                            </div>
                          )}
                        </ErrorMessage>

                      </div>

                      <button
                        type="submit"
                        className="btn cob-btn-primary btn-sm text-white m-3 text-white"
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
