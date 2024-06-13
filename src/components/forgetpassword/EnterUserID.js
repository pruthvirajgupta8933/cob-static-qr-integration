import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { getEmailToSendOtpSlice } from "../../slices/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Yup from "../../_components/formik/Yup";
import classes from "./forgotPassword.module.css"
import useMediaQuery from "../../hooks/useMediaQuery";
import Header from "../mainComponent/header/Header";
import sbbnner from "../../assets/images/login-banner.png"
import arrow_one from "../../../src/assets/images/arrow_one.png"
import arrow_two from "../../assets/images/arrow_two.png"
import VerifyEmailPhone from "./VerifyEmailPhone";

const EnterUserID = (props) => {
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 993px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width:  992px)');
  const isMobile = useMediaQuery('(max-width: 767px)');


  const validationSchema = Yup.object().shape({
    email: Yup.string().allowOneSpace()
      .email("Must be a valid email")
      .max(255)
      .required("Required"),
  });

  const handleSubmit = (data) => {
    setLoading(true)

    dispatch(
      getEmailToSendOtpSlice({
        email: data.email,
        otp_type: "both",
        otp_for: "Forgot Password",
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {

        if (res.payload.status === true) {
          // props.props("a2", data);
          toast.success("OTP Sent Successfully");
          setLoading(false)
          setShow(true)
        }
      } else {
        toast.errorToast(res?.payload ?? "Rejected")
        setLoading(false)
        setShow(false)
      }
    })
  };

  const initialValues = {
    email: "",
  };

  return (
    <div className={`container-fluid p-0`}>
      <div className={`d-flex flex-row ${classes.flex_column_reverse} ${classes.container_custom}`}>
        <div className={`${classes.background_image_left} col-lg-5 text-white`}>
          <div className="container-fluid text-center d-flex flex-column h-100">
            <div className="row align-items-start flex-grow-1">
              <div className="col">
                {isDesktop && <Header display_bg_color={false} />}
              </div>
            </div>
            <div className="row align-items-center flex-grow-1">
              <div className="col">
                <div className="p-4 text-center">
                  <img src={sbbnner} alt="banner" className={`${classes.login_banner}`} />
                  <div className={`my-5  ${classes.sp_font_24}`} >
                    <p className="text-white">Forgot Password</p>

                  </div>
                </div>
              </div>
            </div>

            <div className="row align-items-start flex-grow-1" >
              <div className={`col-2 `}>
                <img src={arrow_two} alt="arrow" className={`${classes.left_side_arrow}`} />
              </div>
              <div className="col-8">
                <div className="text-center">
                  <div className={`${classes.sp_font_20}`} >
                    <hr className={`${classes.hr_class_one}`} />
                    Need help? Contact us
                    <hr className={`${classes.hr_class_two}`} />
                  </div>
                  <div className="d-flex justify-content-around my-1">
                    <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-envelope"></i> Support@sabpaisa.in</p>
                    <p className="mx-2 text-white"><i class="mx-2 fa fa-light fa-phone"></i> 011-41733223</p>
                  </div>

                </div>
              </div>
              <div className="col-2"></div>
            </div>
          </div>
          <div>
          </div>
        </div>


        <div className="col-lg-7 d-flex justify-content-center  p-0">
          <div className="container-fluid d-flex flex-column h-100 p-0">
            <div className="row align-items-start flex-grow-1" >
              <div className="col">
                {(isTablet || isMobile) &&
                  <Header display_bg_color={true} />}
                <img src={arrow_one} alt="arrow" className={`${classes.right_side_arrow}`} />
              </div>
            </div>

            <div className="row align-items-start flex-grow-1 mt-md-5 mt-sm-5">
              <div className="col-lg-3 col-md-2 col-sm-2 col-xs-2"></div>
              <div className={`col ${classes.form_container}`}>
                {!show && (
                  <h5 className="text-center font-weight-bold text_primary_color">Forgot Password</h5>)}
                {!show ? (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                      handleSubmit(values);
                      resetForm();
                    }}
                  >
                    {({ resetForm }) => (
                      <>
                        <Form>
                          <div className="form-group">
                            <label htmlFor="exampleInputEmail1">
                              Email address / User name
                            </label>
                            <Field
                              name="email"
                              type="text"
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              placeholder="Enter email address"
                            />
                            {
                              <ErrorMessage name="email">
                                {(msg) => (
                                  <div
                                    className="abhitest "
                                    style={{
                                      color: "red",
                                      position: "absolute",
                                      zIndex: " 999",
                                      marginTop: "15px",
                                    }}
                                  >
                                    {msg}
                                  </div>
                                )}
                              </ErrorMessage>
                            }
                            <small id="emailHelp" className="form-text text-muted">
                              We'll never share your email with anyone else.
                            </small>
                          </div>
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
                  <VerifyEmailPhone />
                )}



              </div>
              <div className="col-lg-3 col-md-2 col-sm-2 col-xs-2"></div>

            </div>

            <div className="row align-items-end flex-grow-1">
              <div className="col">
                <div className="p-2 bd-highlight sp-font-12 text-center">
                  <p className="bd-highlight text-center sp-font-12">
                    Copyright @ {new Date().getFullYear()} SabPaisa All Rights Reserved version 1.0 | &nbsp;
                    <a href="https://sabpaisa.in/term-conditions/" rel="noreferrer" target="_blank">Terms &amp; Conditions </a>&nbsp;and &nbsp;
                    <a href="https://sabpaisa.in/privacy-policy/" rel="noreferrer" target="_blank">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterUserID;
