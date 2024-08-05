import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import classes from "./forgotPassword.module.css";
import Yup from "../../_components/formik/Yup";
import { emailVerify } from "../../services/forgotPassword-service/forgotPassword.service";
import CreatePassword from "./CreatePassword";
import { getEmailToSendOtpSlice } from "../../slices/auth";
import toastConfig from "../../utilities/toastTypes";

const VerifyEmailPhone = ({ inputValue }) => {
  const { auth } = useSelector((state) => state);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(40);
  const [loadingResnedOtp, setLoadingResnedOtp] = useState(false);
  const verification_token = auth.forgotPassword.otpResponse.verification_token;
  const dispatch = useDispatch();

  const INITIAL_FORM_STATE = {
    otp: ""
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP Required")
      .allowOneSpace(),
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const emailverify = async (e) => {
    setLoading(true);
    const sendOtp = {
      verification_token: verification_token,
      otp: e.otp,
    };

    emailVerify(sendOtp)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message);
          setShow(true);
          setLoading(false);
        } else {
          toast.error(response.data.message);
          setShow(false);
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data["message"]);
        setShow(false);
        setLoading(false);
      });
  };

  const resendOtp = () => {
    setLoadingResnedOtp(true);
    dispatch(
      getEmailToSendOtpSlice({
        email: inputValue.email,
        otp_type: "both",
        otp_for: "Forgot Password",
      })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          toastConfig.successToast("OTP Sent Successfully");
          setTimer(40);
          setLoadingResnedOtp(false);
        } else {
          toastConfig.errorToast(res?.payload ?? "Rejected");
          setLoadingResnedOtp(false);
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div className="container-fluid toppad">
        <div className="row">
          <div className={`col ${classes.form_container}`}>
            {!show && (
              <h6 className="text-center mb-4 font-weight-bold">
                We have sent the OTP on your registered Email Address and on Phone Number.{" "}
              </h6>
            )}
            {!show ? (
              <Formik
                initialValues={INITIAL_FORM_STATE}
                validationSchema={validationSchema}
                onSubmit={emailverify}
              >
                {(formik) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label font-weight-bold font-size-16">
                        Email OTP <span className="text-danger">*</span>
                      </label>
                      <Field
                        className="form-control"
                        maxLength={6}
                        id="otp"
                        placeholder="Enter OTP"
                        type="text"
                        name="otp"
                      />
                      <ErrorMessage name="otp">
                        {(msg) => <div className="text-danger mt-1">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="d-flex justify-content-between">
                    {timer > 0 ? (
                        <button className={`${classes.resendOtp_border} btn btn-light btn-sm`} disabled>Resend OTP in {timer}s</button>
                      ) : (
                        <button className={`${classes.resendOtp_border} btn btn-light btn-sm`} onClick={resendOtp} type="button">
                          {loadingResnedOtp && <span className="spinner-grow spinner-grow-sm text-light mr-1"></span>}
                          Resend OTP
                        </button>
                      )}
                      <button type="submit" className="btn cob-btn-primary btn-sm" disabled={loading}>
                        {loading && <span className="spinner-grow spinner-grow-sm text-light"></span>}
                        Verify
                      </button>
                    
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <CreatePassword />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VerifyEmailPhone;
