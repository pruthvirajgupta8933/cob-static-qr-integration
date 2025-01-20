import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import classes from "./login.module.css";
import Yup from '../../../_components/formik/Yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginVerify } from '../../../slices/auth';
import toastConfig from '../../../utilities/toastTypes';
import { login } from '../../../slices/auth';
import TimerComponent from '../../../utilities/TimerComponent';

function AuthOtpVerify({ updateOtpModal, inputValue }) {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const { auth_verification } = useSelector((state) => state.auth);
    const history = useHistory()
    const initailState = {
        otp: ""
    };

    const validationSchema = Yup.object().shape({
        otp: Yup.string().required("Please enter OTP").max(6, "OTP must be 6 digits").min(6, "OTP must be 6 digits")
    });


    const handleLogin = (formValue) => {
        setLoading(true);
        dispatch(loginVerify({ otp: formValue?.otp, verification_token: auth_verification?.verification_token }))
            .then((res) => {
                if (res?.payload?.user) {
                    const { loginStatus, loginMessage } = res.payload.user;
                    if (loginStatus === "Activate" && loginMessage === "success") {
                        history.replace("/dashboard");
                    } else {
                        toastConfig.errorToast(loginMessage || "Rejected");
                    }
                } else {
                    toastConfig.errorToast(res?.payload || "Rejected");
                }
                setLoading(false);
            });
    }

    const bankNavHandler = () => {
        updateOtpModal(false)
    }


    const resendOtp = () => {
        dispatch(login(inputValue))
    };



    return (
        <div className={`col ${classes.form_container}`}>
            <p className="text-primary cursor-pointer mb-3" onClick={() => bankNavHandler()}><i className="fa fa-arrow-left"></i> Back to login</p>
            <h6 className={`text-center mb-4 sub_heading ${classes.sub_heading}`}>Enter the OTP</h6>
            <Formik
                initialValues={initailState}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {(formik) => (
                    <Form>
                        <div className="mb-3">
                            <Field
                                className="form-control"
                                maxLength={6}
                                id="otp"
                                placeholder="Enter the OTP"
                                type="text"
                                name="otp"
                            />
                            <ErrorMessage name="otp">
                                {(msg) => <div className="text-danger">{msg}</div>}
                            </ErrorMessage>
                        </div>
                        <div className="d-flex justify-content-between">
                            <TimerComponent resend={resendOtp} />
                            <button type="submit" className="btn cob-btn-primary btn-sm" disabled={loading}>
                                {loading && <span className="spinner-grow spinner-grow-sm text-light"></span>}
                                Verify
                            </button>

                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AuthOtpVerify