import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import "yup-phone";
import { changePasswordSlice } from "../../../slices/auth";
import { toast} from "react-toastify";
import NavBar from "../NavBar/NavBar";
import { logout } from "../../../slices/auth";

function ChangePassword() {
  const dispatch = useDispatch();
  let history = useHistory();

  // let { path, url } = useRouteMatch();
  const { user } = useSelector((state) => state.auth);

  
  const { loginId, userName } = user;

  // const [clientId,setClientId] = useState(clientMerchantDetailsList!==null && clientMerchantDetailsList[0]?.clientId)

  // useEffect(() => {

  //     if(passwordChange===true){

  //         toast.success("Your password has been changed",{
  //             autoClose:2000,
  //             limit :1,
  //             transition:Zoom
  //           })
  //     }
  //     if(passwordChange===false){

  //       toast.error("Password Change Unsuccessful.",{
  //         autoClose:2000,
  //         limit :1,
  //         transition:Zoom
  //       })}

  // }, [passwordChange])

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
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content Satoshi-Medium">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper">
            <h1 className="right_side_heading">Change Password</h1>
            <div className="ant-tabs ant-tabs-top ant-tabs-line">
              <div
                role="tablist"
                className="ant-tabs-bar ant-tabs-top-bar"
                tabIndex={0}
              >
                <div className="ant-tabs-nav-container">
                  <div className="ant-tabs-nav-wrap">
                    <div className="ant-tabs-nav-scroll">
                      <div className="ant-tabs-nav- ant-tabs-nav-animated">
                        <div>
                        
                        </div>
                        <div
                          className="ant-tabs-ink-bar ant-tabs-ink-bar-animated"
                          style={{
                            display: "block",
                            transform: "translate3d(0px, 0px, 0px)",
                            width: "116px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                tabIndex={0}
                role="presentation"
                style={{
                  width: "0px",
                  height: "0px",
                  overflow: "hidden",
                  position: "absolute",
                }}
              />
              <div
                className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content"
                style={{ marginLeft: "0%" }}
              >
                <div
                  role="tabpanel"
                  aria-hidden="false"
                  className="ant-tabs-tabpane ant-tabs-tabpane-active"
                >
                  <div
                    tabIndex={0}
                    role="presentation"
                    style={{
                      width: "0px",
                      height: "0px",
                      overflow: "hidden",
                      position: "absolute",
                    }}
                  ></div>
                  <div className="container col-sm-8">
                    <Formik
                      enableReintialize="true"
                      initialValues={{
                        ...INITIAL_FORM_STATE,
                      }}
                      validationSchema={FORM_VALIDATION}
                      onSubmit={updataPassword}
                    >
                      <Form className="form-horizontal">
                        <h4 className="text-left m-b-lg m-b-20">
                          Update Your Password.
                        </h4>
                        <Field type="hidden" name="loginId" disabled />
                        <Field type="hidden" name="email" disabled />

                        <div className="form-group">
                          
                          <div className="col-lg-4">
                          <label
                            className="control-label"
                            htmlFor="email"
                          >
                            Old Password :
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
                                <div className="error_msg_display">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        
                          
                          <div className="col-lg-4">
                          <label
                            className="control-label"
                            htmlFor="newPassword"
                          >
                            {" "}
                            New Password :
                          </label>
                            <Field
                              type={values.showPassword ? "text" : "password"}
                              name="new_password"
                              placeholder="Enter New Password"
                              className="form-control"
                            />
                          

                            <ErrorMessage name="new_password">
                              {(msg) => (
                                <div className="error_msg_display">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>

                          <div className="col-lg-4">
                          <label
                            className="control-label"
                            htmlFor="changepassword"
                          >
                            {" "}
                            Confirm New Password :
                          </label>
                            <Field
                              type={values.showPassword ? "text" : "password"}
                              name="confirm_password"
                              placeholder="Re-type New Password"
                              className="form-control"
                            />
                            <span class="input-group-addon eyeicon">
                              <a onClick={handleClickShowPassword}>
                                {" "}
                                {values.showPassword ? (
                                  <i class="fa fa-eye" aria-hidden="true"></i>
                                ) : (
                                  <i
                                    class="fa fa-eye-slash"
                                    aria-hidden="true"
                                  ></i>
                                )}
                              </a>
                            </span>
                            <ErrorMessage name="confirm_password">
                              {(msg) => (
                                <div className="error_msg_display">{msg}</div>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>
                          <div className="form-group  ">
                          <div className="col-sm-12">
                            <button
                              type="sumbit"
                              style={{
                                margin: "10px",
                                float: "right",
                                width: "25%",
                              }}
                              className=" btn bttn font-weight-bold bttnbackgroundkyc"
                              
                            >
                              {" "}
                              Update Password
                            </button>
                          </div>
                        </div>
                        <br />
                      </Form>
                    </Formik>
                  </div>
                </div>
                <div
                  tabIndex={0}
                  role="presentation"
                  style={{
                    width: "0px",
                    height: "0px",
                    overflow: "hidden",
                    position: "absolute",
                  }}
                ></div>
              </div>
            </div>
            <div
              tabIndex={0}
              role="presentation"
              style={{
                width: "0px",
                height: "0px",
                overflow: "hidden",
                position: "absolute",
              }}
            />
          </div>
        </div>
      </main>
    </section>
  );
}

export default ChangePassword;
