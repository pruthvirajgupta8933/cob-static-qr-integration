import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "yup-phone";
import { changePasswordSlice } from "../../../slices/auth";
import { toast } from "react-toastify";
import { logout } from "../../../slices/auth";

function ChangePassword() {
  const dispatch = useDispatch();
  

  // let { path, url } = useRouteMatch();
  const { user } = useSelector((state) => state.auth);


  const { loginId, userName } = user;

  

  const INITIAL_FORM_STATE = {
    loginId: loginId,
    email: userName,
    new_password: "",
    old_password: "",
    confirm_password: "",
  };

  const [values, setValues] = useState({
    new_password: "",
    old_password: "",
    confirm_password: "",
    showPassword: false,
  });
  // const exitback = () => {

  // };


  const FORM_VALIDATION = Yup.object().shape({
    loginId: Yup.string().required("Required"),
    email: Yup.string().required("Required"),

    old_password: Yup.string().required("Old Password Required"),

    new_password: Yup.string()
      .required("New Password Required")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),

    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm Password Required"),
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const updataPassword = (data) => {

    dispatch(
      changePasswordSlice({
        email: data.email,
        password: data.old_password,
        newpassword: data.new_password,
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toast.success(res.payload.message);
          dispatch(logout());
        } else if (res.payload.status === false) {
          toast.error(res.payload.message);
        }
      }
    });
  };

  return (
    <section className="">
      <main className="">
        <div className="container-fluid">
          <div className="right_layout my_account_wrapper">
            <h5 className="right_side_heading">Change Password</h5>

            <div className="row">


              <div className="col-lg-12">

                <Formik
                  enableReintialize="true"
                  initialValues={{
                    ...INITIAL_FORM_STATE,
                  }}
                  validationSchema={FORM_VALIDATION}
                  onSubmit={updataPassword}
                >
                  <Form className="form-horizontal">

                    <Field type="hidden" name="loginId" disabled />
                    <Field type="hidden" name="email" disabled />

                    <div className="form-group">


                      <div className="col-lg-4 mb-3">
                        <label className="form-label">
                          Old Password
                        </label>
                        <Field
                          type={
                            values.showPassword
                              ? "old_password"
                              : "password"
                          }
                          name="old_password"
                          placeholder="Enter Old Password"
                          className="form-control"
                        />


                        <ErrorMessage name="old_password">
                          {(msg) => (
                            <div className="text-danger m-0">{msg}</div>
                          )}
                        </ErrorMessage>
                      </div>


                      <div className="col-lg-4 mb-3">
                        <label
                          className="form-label"
                        >
                          New Password
                        </label>
                        <Field
                          type={values.showPassword ? "text" : "password"}
                          name="new_password"
                          placeholder="Enter New Password"
                          className="form-control"
                        />


                        <ErrorMessage name="new_password">
                          {(msg) => (
                            <div className="text-danger m-0">{msg}</div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="col-lg-4 mb-3">
                        <label
                          className="form-label"
                          htmlFor="changepassword"
                        >
                          Confirm New Password :
                        </label>
                        <div className="input-group">

                          <Field
                            type={values.showPassword ? "text" : "password"}
                            name="confirm_password"
                            placeholder="Re-type New Password"
                            className="form-control"
                          />
                          <div className="input-group-append">
                          <span className="input-group-text" id="basic-addon2" onClick={handleClickShowPassword} > 
                          {values.showPassword ? (
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              ) : (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                ></i>
                              )}
                           </span></div>
                          <span className="input-group-addon eyeicon d-none">
                            <a onClick={handleClickShowPassword} href={false}>

                              {values.showPassword ? (
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              ) : (
                                <i
                                  className="fa fa-eye-slash"
                                  aria-hidden="true"
                                ></i>
                              )}
                            </a>
                          </span>
                       
                        </div>
                        <ErrorMessage name="confirm_password">
                            {(msg) => (
                              <div className="text-danger m-0">{msg}</div>
                            )}
                          </ErrorMessage>
                      </div>



                      <div className="col-lg-4 mb-3">
                        <button
                          type="sumbit"
                          className=" btn bttn font-weight-bold cob-btn-primary w-100"

                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <br />
                  </Form>
                </Formik>
              </div>
            </div>

          </div>
        </div>
      </main>
    </section>
  );
}

export default ChangePassword;
