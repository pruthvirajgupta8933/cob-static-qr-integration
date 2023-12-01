import React, { useEffect, useState } from "react";
import "../../login/css/home.css"
// import "../../login/css/homestyle.css"
// import "../../login/css/style-style.css"
// import "../../login/css/style.css"
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../slices/auth";
// import { useHistory } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import API_URL from "../../../config";
import { axiosInstanceAuth, axiosInstanceJWT } from "../../../utilities/axiosInstance";
// import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
// import {logout} from "../../../slices/auth";


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
    fullname: Yup.string()
        .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
        .required("Required"),
    // lastname: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ").required("Required"),
    mobilenumber: Yup.string()
        .required("Required")
        .matches(phoneRegExp, "Phone number is not valid")
        .min(10, "Phone number in not valid")
        .max(10, "too long"),
    emaill: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Required"),
    passwordd: Yup.string()
        .required("Password Required")
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    confirmpasswordd: Yup.string()
        .oneOf([Yup.ref("passwordd"), null], "Passwords must match")
        .required("Confirm Password Required"),
    business_cat_code: Yup.string().required("Required"),
    roleId: Yup.string().required("Required")
});

const OnboardMerchant = () => {
    // const history = useHistory();

    // let roleShow = roleBasedAccess()

    const reduxState = useSelector((state) => state);
    const { message, auth } = reduxState;
    const datar = auth;
    const { isUserRegistered, user } = datar;
    const [btnDisable, setBtnDisable] = useState(false);

    const [businessCode, setBusinessCode] = useState([]);
    const [roles, setRoles] = useState([]);

    const [valuesIn, setValuesIn] = useState({
        passwordd: "",
        showPassword: false,
    });
    const [passwordType, setPasswordType] = useState({
        confirmpasswordd: "",
        showPasswords: false,
    });

    const togglePassword = () => {
        setPasswordType({
            ...passwordType,
            showPasswords: !passwordType.showPasswords,
        });
    };

    useEffect(() => {

        axiosInstanceJWT
            .get(API_URL.Business_Category_CODE)
            .then((resp) => {
                const data = resp.data;
                const sortAlpha = data?.sort((a, b) =>
                    a.category_name
                        .toLowerCase()
                        .localeCompare(b.category_name.toLowerCase())
                );


                setBusinessCode(sortAlpha);
            })
            .catch((err) => console.log(err));
    }, []);


    useEffect(() => {
        axiosInstanceJWT
            .get(API_URL.Roles_DropDown)
            .then((resp) => {
                const data = resp.data;
                // console.log("Roles DropDown",data)
                setRoles(data);
            })
            .catch((err) => console.log(err));
    }, []);


    const dispatch = useDispatch();

    const handleRegistration = (formData,{resetForm}) => {

        let businessType = 1;
        let {
            fullname,
            mobilenumber,
            emaill,
            passwordd,
            business_cat_code,
            roleId
        } = formData;
        dispatch(
            register({
                fullname: fullname,
                mobileNumber: mobilenumber,
                email: emaill,
                business_cat_code: business_cat_code,
                password: passwordd,
                businessType: businessType,
                isDirect: false,
                created_by: user?.loginId,
                roleId: roleId,
                is_social: false
            })
        )
            .unwrap()
            .then((res) => {
                // console.log("res", res)
                const resLoginId = res.login_id
                axiosInstanceAuth.put(`${API_URL.EMAIL_VERIFY}${resLoginId}`)

                setBtnDisable(false);
                resetForm()
            })
            .catch((err) => {
                setBtnDisable(false);
            });
    };


    const handleClickShowPassword = () => {
        setValuesIn({ ...valuesIn, showPassword: !valuesIn.showPassword });
    };

    useEffect(() => {
        if (isUserRegistered === true) {
            toast.success(message.message, {
                position: "top-right",
                autoClose: 5000,
                limit: 1,
                transition: Zoom,
            });
            setTimeout(function () {
                window.location.href = ""
            }, 3000)

            // history.push("/dashboard/approver");
        }

        if (isUserRegistered === false) {
            toast.error(message.message, {
                position: "top-right",
                autoClose: 5000,
                limit: 5,
                transition: Zoom,
            });
        }
        return () => {
            // dispatch(udpateRegistrationStatus());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserRegistered]);

    // useEffect(() => {
    //     if (roleShow?.verifier !== true && roleShow?.approver !== true) {
    //         dispatch(logout())
    //     }
    // })
    return (
        <>
            <div className="logmod__heading">
                <span className="fontfigma">
                    Onboard Merchant
                </span>

            </div>
            <Formik
                initialValues={{
                    fullname: "",
                    mobilenumber: "",
                    emaill: "",
                    passwordd: "",
                    business_cat_code: "",
                    confirmpasswordd: "",
                    roleId: "",
                    // termsAndConditions: false,
                    terms_and_condition: false,
                }}
                validationSchema={FORM_VALIDATION}
                // onSubmit={handleRegistration}
                onSubmit={(values, { resetForm }) => {
                    handleRegistration(values, { resetForm });
                }}
            >

                {(formik) => (


                    <Form class="row g-3 mt-4">
                        <div className="col-md-10"></div>
                        <div class="col-md-6">
                            <label htmlFor="full-name" class="form-label font-weight-bold">Full Name</label>
                            <Field
                                class="form-control"
                                maxLength={230}
                                id="fullname"
                                placeholder="Full Name"
                                type="text"
                                name="fullname"
                                size={50}
                            />
                            <ErrorMessage name="fullname">
                                {(msg) => (
                                    <p
                                        className="text-danger"

                                    >
                                        {msg}
                                    </p>
                                )}
                            </ErrorMessage>
                        </div>
                        <div class="col-md-6">
                            <label htmlFor="mobile" class="form-label font-weight-bold">Mobile Number</label>

                            <Field
                                className="form-control"
                                maxLength={10}
                                id="mobilenumber"
                                placeholder="Mobile Number"
                                name="mobilenumber"
                                type="text"
                                pattern="\d{10}"
                                size={10}
                                onKeyDown={(e) =>
                                    ["e", "E", "+", "-", "."].includes(
                                        e.key
                                    ) && e.preventDefault()
                                }
                            />
                            {
                                <ErrorMessage name="mobilenumber">
                                    {(msg) => (
                                        <p
                                            className="text-danger"

                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }
                            {/* <input type="password" class="form-control" id="inputPassword4" /> */}
                        </div>
                        <div class="col-md-6">
                            <label htmlFor="user-email" class="form-label font-weight-bold">Email ID</label>
                            <Field
                                className="form-control"
                                maxLength={255}
                                id="email"
                                placeholder="Enter your email"
                                type="email"
                                name="emaill"
                                size={50}
                            />
                            {
                                <ErrorMessage name="emaill">
                                    {(msg) => (
                                        <p
                                            className="text-danger"
                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }
                        </div>
                        <div class="col-md-3">
                            <label htmlFor="business_category" className="form-label font-weight-bold">Business
                                Category</label>
                            <Field
                                name="business_cat_code"
                                className="form-select"
                                component="select"


                            >
                                <option
                                    type="text"
                                    className="form-control"
                                    id="businesscode"

                                >
                                    Select Business
                                </option>
                                {businessCode?.map((business, i) => (
                                    <option
                                        value={business.category_id}
                                        key={i}

                                    >
                                        {business.category_name}
                                    </option>
                                ))}
                            </Field>
                            {
                                <ErrorMessage name="business_cat_code">
                                    {(msg) => (
                                        <p
                                            className="text-danger"

                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }
                        </div>

                        <div class="col-md-3">
                            <label htmlFor="roles" className="form-label font-weight-bold">Roles</label>
                            <Field
                                name="roleId"
                                className="form-select"
                                component="select"
                            >
                                <option
                                    type="text"
                                    className="form-control"
                                    value={""}
                                >
                                    Select Roles
                                </option>
                                {roles.map((role, i) => (
                                    <option
                                        value={role.roleId}
                                        key={i}
                                    >
                                        {role.roleName.toUpperCase()}
                                    </option>
                                ))}
                            </Field>
                            {
                                <ErrorMessage name="roleId">
                                    {(msg) => (
                                        <p
                                            className="text-danger"

                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }
                        </div>

                        <div class="col-md-6">
                            <label htmlFor="user-pw" class="form-label font-weight-bold">Create Password</label>
                            <div class="input-group mb-3">
                                <Field
                                    className="form-control"
                                    maxLength={255}
                                    id="user-pws"
                                    placeholder="Password"

                                    name="passwordd"
                                    type={
                                        passwordType.showPasswords
                                            ? "password"
                                            : "text"
                                    }
                                    size={50}
                                    autoComplete="off"
                                />

                                <span className="input-group-text" onClick={togglePassword} id="basic-addon2">
                                    {passwordType.showPasswords ? (<i className="fa fa-eye" aria-hidden="true"></i>) : (
                                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                                    )}</span>
                            </div>
                            {
                                <ErrorMessage name="passwordd">
                                    {(msg) => (
                                        <p
                                            className="text-danger"

                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }
                        </div>

                        <div class="col-md-6">
                            <label htmlFor="user-cpw" class="form-label font-weight-bold">Confirm Password</label>
                            <div class="input-group mb-3">
                                <Field
                                    className="form-control"
                                    maxLength={255}
                                    id="user-cpw"
                                    placeholder="Re-enter the password"
                                    type={
                                        valuesIn.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmpasswordd"
                                    size={50}
                                />

                                <span className="input-group-text" onClick={handleClickShowPassword} id="basic-addon2">
                                    {valuesIn.showPassword ? (<i className="fa fa-eye" aria-hidden="true"></i>) : (
                                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                                    )}</span>
                            </div>

                            {
                                <ErrorMessage name="confirmpasswordd">
                                    {(msg) => (
                                        <p
                                            className="text-danger"

                                        >
                                            {msg}
                                        </p>
                                    )}
                                </ErrorMessage>
                            }

                        </div>
                        <div className="col-md-3">

                        </div>
                        <div className="col-md-9">
                            <button className="figmabtn  text-white  disabled1 w-50"
                                name="commit"
                                type="submit"
                                width={50}
                                defaultValue="Create Account"
                                disabled={btnDisable ||
                                    !(formik.isValid && formik.dirty)
                                    ? true
                                    : false
                                }
                                data-rel={btnDisable}
                            >Sign in
                            </button>

                        </div>


                    </Form>
                )}


            </Formik>


        </>
    )
}

export default OnboardMerchant