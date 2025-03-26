import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
// import * as Yup from "yup";

import { useSelector } from "react-redux";
import API_URL from "../../config";
import Yup from "../../_components/formik/Yup";
import { axiosInstance, axiosInstanceAuth, axiosInstanceJWT } from "../../utilities/axiosInstance";

const ResetPassword = (props) => {
  // const { handleFormSubmit } = props;

  const validationSchema = Yup.object().shape({
    password: Yup.string().allowOneSpace().required(" Old Password Required"),
    newpassword: Yup.string()
      .allowOneSpace()
      .required("Password Required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmpassword: Yup.string()
      .allowOneSpace()
      .oneOf([Yup.ref("newpassword"), null], "Passwords must match")
      .required("Confirm Password Required"),
  });
  const { auth } = useSelector((state) => state);
  // const verification_token=auth.forgotPassword.otpResponse.verification_token;

  const initialValues = {
    password: "",
    newpassword: "",
    confirmpassword: "",
  };
  const resetSubmit = async (values) => {
    // console.log(values)
    await axiosInstanceAuth.put(API_URL.AUTH_CHANGE_PASSWORD, {
      password: values.password,
      newpassword: values.newpassword,
    })
      .then((res) => {
        // console.log(res);
        // if (res.status === 200) {
        //   const data = res.data;
        //         }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });

    // props?.props("a4");
    // console.log("You clicked submit.");
  };

  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Update Password</div>
            <div className="card-body ">
              <h5 className="card-title">Please Enter the detatils. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  resetSubmit(values);
                  resetForm();
                }}
              >
                {({ resetForm }) => (
                  <>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="exampleInputPassword1">
                          Old password
                        </label>
                        <Field
                          name="password"
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          aria-describedby="PasswordHelp"
                          placeholder="Enter old Password"
                        />
                        <label htmlFor="exampleInputPassword1">
                          New Password
                        </label>
                        <Field
                          name="newpassword"
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
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputpassword2">
                          Confirm Password
                        </label>
                        <Field
                          name="confirmpassword"
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
                          <ErrorMessage name="newpassword">
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
                        className="btn  cob-btn-primary "
                      // onClick={() => props.props("a4")}
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
