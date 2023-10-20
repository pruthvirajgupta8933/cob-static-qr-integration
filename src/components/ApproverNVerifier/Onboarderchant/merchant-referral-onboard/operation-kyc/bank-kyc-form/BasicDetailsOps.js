import React, { useEffect, useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import Yup from '../../../../../../_components/formik/Yup';
import FormikController from '../../../../../../_components/formik/FormikController';
import { Regex, RegexMsg } from '../../../../../../_components/formik/ValidationRegex';
// import { useEffect } from 'react';
import API_URL from '../../../../../../config';
import { axiosInstanceJWT } from '../../../../../../utilities/axiosInstance';
import { convertToFormikSelectJson } from '../../../../../../_components/reuseable_components/convertToFormikSelectJson';
// import { register } from '../../../../../../slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { saveMerchantBasicDetails } from '../../../../../../slices/approver-dashboard/merchantReferralOnboardSlice';
// import { useState } from 'react';


function BasicDetailsOps() {

    const [businessCode, setBusinessCode] = useState([]);
    const [passwordType, setPasswordType] = useState({showPasswords: false});


    const dispatch = useDispatch()
    const {auth} = useSelector(state=>state)
    // console.log(auth?.user?.loginId)

    const initialValues = {
        fullname: "",
        mobilenumber: "",
        email_id: "",
        business_cat_code: "",
        password: ""

    };


    const validationSchema = Yup.object({
        fullname: Yup.string()
            .trim()
            .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
            .required("Required")
            .wordLength("Word character length exceeded")
            .max(100, "Maximum 100 characters are allowed")
            .nullable(),
        mobilenumber: Yup.string()
            .trim()
            .required("Required")
            .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
            .min(10, "Phone number is not valid")
            .max(10, "Only 10 digits are allowed ")
            .nullable(),
        email_id: Yup.string()
            .trim()
            .email("Invalid email")
            .required("Required")
            .nullable(),
        business_cat_code: Yup.string().required("Required"),
        password: Yup.string()
            .required("Password Required")
            .matches(Regex.password, RegexMsg.password
            ),
    });

    const handleSubmitContact = (value) => {
        const { fullname,
            mobilenumber,
            email_id,
            business_cat_code,
            password } = value

            dispatch(
                saveMerchantBasicDetails({
                    name: fullname,
                    mobileNumber: mobilenumber,
                    email: email_id,
                    business_cat_code: business_cat_code,
                    password: password,
                    isDirect: false,
                    created_by: auth?.user?.loginId,
                    updated_by: auth?.user?.loginId
                })
            )

    }




    useEffect(() => {
        axiosInstanceJWT
            .get(API_URL.Business_Category_CODE)
            .then((resp) => {
                const data = resp.data;

                const dataOpt = convertToFormikSelectJson(
                    "category_id",
                    "category_name",
                    data
                );

                setBusinessCode(dataOpt);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);


    const togglePassword = () => {
        setPasswordType({
            ...passwordType,
            showPasswords: !passwordType.showPasswords,
        });
    };



    // console.log(passwordType)
    return (
        <div className="tab-pane fade show active" id="v-pills-link1" role="tabpanel" aria-labelledby="v-pills-link1-tab">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitContact}
                enableReinitialize={true}
            >
                {({
                    values,
                    setFieldValue,
                    errors,
                    setFieldError
                }) => (
                    <Form>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="fullname"
                                    className="form-control"
                                    label="Full Name"
                                />
                            </div>

                            <div className="col-md-6">
                                <FormikController
                                    control="input"
                                    type="text"
                                    name="mobilenumber"
                                    className="form-control"
                                    label="Contact Number"
                                />
                            </div>
                            <div className="col-md-6">
                                <FormikController
                                    control="input"
                                    type="email"
                                    name="email_id"
                                    className="form-control"
                                    label="Email ID"
                                />
                            </div>
                            <div className="col-md-6">
                                <FormikController
                                    control="select"
                                    options={businessCode}
                                    name="business_cat_code"
                                    className="form-select"
                                    label="Business Category"
                                />
                            </div>
                            <div className="col-md-6">
                                <label>Create Password</label>
                                <div className="input-group">
                                    <FormikController
                                        control="input"
                                        type={
                                            passwordType.showPasswords
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        className="form-control"
                                        displayMsgOutside={true}
                                    />
                                    <span className="input-group-text" onClick={togglePassword} id="basic-addon2">
                                        {passwordType.showPasswords ? (<i className="fa fa-eye" aria-hidden="true" ></i>) : (<i className="fa fa-eye-slash" aria-hidden="true"></i>
                                        )}
                                    </span>
                                </div>
                                <ErrorMessage name={"password"}>{msg => <p className="text-danger m-0">{msg}</p>}</ErrorMessage>
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn cob-btn-primary btn-sm">Save</button>
                            </div>
                        </div>
                    </Form>)
                }
            </Formik>

        </div>
    )
}

export default BasicDetailsOps