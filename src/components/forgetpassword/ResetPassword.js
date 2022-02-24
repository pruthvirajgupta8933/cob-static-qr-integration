import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const ResetPassword = (props) => {
  const { handleFormSubmit } = props;

  const validationSchema = Yup.object().shape({
    password1: Yup.string()
      .required("Password Required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    password2: Yup.string()
      .oneOf([Yup.ref("password1"), null], "Passwords must match")
      .required("Confirm Password Required"),
  });

  const initialValues = {
    password1: "",
    password2: "",
  };
  const resetSubmit = () => {
    // handleFormSubmit("a3");
    console.log("You clicked submit.");
  };

  return (
    <div className="container-fluid bg-info">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Reset Password</div>
            <div className="card-body">
              <h5 className="card-title">Please Enter the detatils. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  resetSubmit(values);
                  console.log(values);
                  resetForm();
                }}
              >
                {({ resetForm }) => (
                  <>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">
                          New Password
                        </label>
                        <Field
                          name="password1"
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          aria-describedby="PasswordHelp"
                          placeholder="Enter New Password"
                        />
                        {/* <small
                          id="passwordHelp"
                          className="form-text text-muted"
                        >
                          Password validation message.
                        </small> */}
                        {
                          <ErrorMessage name="password1">
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
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputpassword2">
                          Confirm Password
                        </label>
                        <Field
                          name="password2"
                          type="password"
                          className="form-control"
                          id="exampleInputpassword2"
                          aria-describedby="password2Help"
                          placeholder="Enter Confirm Password"
                        />
                    
                        {/* <small
                          id="password2Help"
                          className="form-text text-muted"
                        >
                          Password validation message
                        </small> */}
                        {
                          <ErrorMessage name="password2">
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
                        }
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        //   onClick={() => props.props("a4")}
                      >
                        Submit
                      </button>
                    </Form>
                  </>
                )}
              </Formik>
              <p className="card-text" style={{ display: "none" }}>
                With supporting text below as a natural lead-in to additional
                content.
              </p>
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

export default ResetPassword;
