import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CardLayout from '../../../utilities/CardLayout';
import FormikController from '../../../_components/formik/FormikController';
import { convertToFormikSelectJson } from '../../../_components/reuseable_components/convertToFormikSelectJson';
import { axiosInstanceJWT } from '../../../utilities/axiosInstance';
import API_URL from '../../../config';
import { adminAuthRegisterApi, applicationAllowed } from '../../../services/approver-dashboard/adminAuthRegister.service';
import toastConfig from '../../../utilities/toastTypes';
import Select from 'react-select';

const AdminAuthRegister = () => {
    const [roles, setRoles] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [applicationAllowedData, setApplicationAllowedData] = useState([]);

    useEffect(() => {
        axiosInstanceJWT
            .get(API_URL.Roles_DropDown)
            .then((resp) => {
                const data = convertToFormikSelectJson(
                    'roleId',
                    'roleName',
                    resp.data
                );
                setRoles(data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        applicationAllowed()
            .then((resp) => {

                const formattedData = resp?.data?.apps?.map(app => ({
                    value: app.app_id,
                    label: app.name
                })) || [];
                setApplicationAllowedData(formattedData);
            })
            .catch((err) => console.log(err));
    }, []);

    const initialValues = {
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: '',
        allowed_applications: [],
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
            .required('Mobile number is required'),
        // password: Yup.string().required('Password is required'),
        role: Yup.string().required('Role is required'),
        allowed_applications: Yup.array()
            .min(1, "At least one application is required")
            .required("Required"),
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        const payload = {
            ...values,
            allowed_applications: values.allowed_applications.map(app => app.value).join(',')
        };

        adminAuthRegisterApi(payload)
            .then((resp) => {
                console.log("resp", resp)
                toastConfig.successToast(resp?.data?.message);
                resetForm();
            })
            .catch((error) => {
                let errorMessage = 'Registration failed. Please try again.';
                if (error.response && error.response.data && error.response.data.detail) {
                    errorMessage = error.response.data.detail;
                }
                toastConfig.errorToast(errorMessage);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div>
            <CardLayout title="Admin Auth Register">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ setFieldValue, errors, touched, values, isValid, isSubmitting }) => (
                        <Form>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <FormikController
                                        control="input"
                                        label="Name"
                                        name="name"
                                        className="form-control"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <FormikController
                                        control="input"
                                        type="email"
                                        label="Email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <FormikController
                                        control="input"
                                        type="text"
                                        label="Mobile"
                                        name="mobile"
                                        className="form-control"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <div className="input-group">
                                            <FormikController
                                                control="input"
                                                type={passwordVisible ? 'text' : 'password'}
                                                name="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                                                >
                                                    <i className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                        {errors.password && touched.password && (
                                            <div className="text-danger mt-1">
                                                {errors.password}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <FormikController
                                        control="select"
                                        label="Role"
                                        name="role"
                                        options={roles}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="allowed_applications">Allowed Applications</label>
                                    <Select
                                        id="allowed_applications"
                                        name="allowed_applications"
                                        isMulti
                                        options={applicationAllowedData}
                                        value={values.allowed_applications}
                                        onChange={(selectedOptions) => {
                                            setFieldValue("allowed_applications", selectedOptions);
                                        }}
                                        classNamePrefix="react-select"
                                    />
                                    {errors.allowed_applications && touched.allowed_applications && (
                                        <div className="text-danger mt-1">{errors.allowed_applications}</div>
                                    )}
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-12 ">
                                    <button
                                        type="submit"
                                        className="btn cob-btn-primary approve text-white btn-sm"
                                        disabled={!isValid || isSubmitting}
                                    >
                                        {isSubmitting ? 'Registering...' : 'Register'}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardLayout>
        </div>
    );
};

export default AdminAuthRegister;