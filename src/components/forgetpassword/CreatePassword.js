import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import API_URL from "../../config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import Yup from "../../_components/formik/Yup";
import ThanksCard from "./ThanksCard";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

const CreatePassword = (props) => {
  const { auth } = useSelector((state) => state);
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const verification_token = auth.forgotPassword.otpResponse.verification_token;
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password Required")
      .matches(
        Regex.password,
        RegexMsg.password
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
    setLoading(true)
    const res = await axiosInstanceJWT
      .put(API_URL.AUTH_CREATE_NEW_PASSWORD, {
        email: "textbhuvi@gmail.com",
        verification_token: verification_token,
        password: values.password,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          // props.props("a3");
          setShow(true)
          setLoading(false)
        } else {
          toast.error(response.data.message);
          setShow(false)
          setLoading(false)
        }
      });
  };

  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-lg-12 mx-auto">
          {!show && (<h5 className="text-center font-weight-bold text_primary_color">Create Password</h5>)}
          {!show ? (
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

                        <span className="input-group-text">
                          <a
                            href={() => false}
                            onClick={handleClickShowPassword}
                          >
                            {valuesIn.showPassword ? (
                              <i
                                className="fa fa-eye"
                                ariaHidden="true"
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                ariaHidden="true"
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

                    <div className="form-group">
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

                        <span className="input-group-text">
                          <a
                            href={() => false}
                            onClick={togglePassword}
                          >
                            {passwordType.showPasswords ? (
                              <i
                                className="fa fa-eye"
                                ariaHidden="true"
                              ></i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                ariaHidden="true"
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

                    {/* <button
                        type="submit"
                        className="btn cob-btn-primary btn-sm text-white m-3 text-white"
                      >
                        Submit
                      </button> */}
                    <div className="d-flex">
                      <button type="submit" className="btn  cob-btn-primary  w-100 mb-2 "
                        disabled={loading}
                      >
                        {loading && (
                          <span className="spinner-grow spinner-grow-sm text-light mr-1"></span>
                        )}Submit</button>

                    </div>
                  </Form>
                </>
              )}
            </Formik>
          ) : (

            <ThanksCard />

          )}

        </div>

      </div>
    </div>

  );
};

export default CreatePassword;
