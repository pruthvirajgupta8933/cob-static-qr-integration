/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API_URL from "../../config";
import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";

import "../login/css/home.css";
import "../login/css/homestyle.css";
import "../login/css/style-style.css";
import "../login/css/style.css";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
  mobilenumber: Yup.string()
    .required("Required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number in not valid")
    .max(10, "too long"),
  business_cat_code: Yup.string().required("Required"),
});

function Registration({ hideDetails, getPendingDetails, fullName, email }) {
  const history = useHistory();

  const reduxState = useSelector((state) => state);
  const { message, auth } = reduxState;
  const authData = auth;
  const { isUserRegistered } = authData;

  const [btnDisable, setBtnDisable] = useState(false);
  const [businessCode, setBusinessCode] = useState([]);
  const [queryString, setQueryString] = useState({});
  const [mobileNumber, setMobileNumber] = useState("");
  const [businessCategoryCode, setBussinessCategoryCode] = useState("");

  const [valuesIn, setValuesIn] = useState({
    password: "",
    showPassword: false,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    axiosInstanceJWT
      .get(API_URL.Business_Category_CODE)
      .then((resp) => {
        const data = resp?.data;
        const sortAlpha = data?.sort((a, b) =>
          a.category_name
            .toLowerCase()
            .localeCompare(b.category_name.toLowerCase())
        );
        setBusinessCode(sortAlpha);
      })
      .catch((err) => console.log(err));

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const appid = params.get("appid");
    const planid = params.get("planid");
    const domain = params.get("domain");
    const page = params.get("page");
    const appName = params.get("appName");
    const planName = params.get("planName");

    const paramObject = {
      appid,
      planid,
      domain,
      page,
      appName,
      planName,
    };
    setQueryString(paramObject);
  }, []);

  const handleRegistration = async (formData) => {
    setBtnDisable(false);
    //Function passing as props to Registration for social login
    getPendingDetails(mobileNumber, businessCategoryCode);
    let businessType = 1;
    const data = {
      fullname: fullName,
      mobileNumber: formData?.mobilenumber,
      email: email,
      business_cat_code: formData?.business_cat_code,
      businessType,
      isDirect: true,
      requestId: null,
      plan_details: queryString,
      is_social: true,
    };
    try {
      const response = await AuthService.register(data);
      if(response.status===200)
      {
        toast.success(response.data.message);
        history.push("/login");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className={hideDetails ? "" : `col-sm-12 col-md-12 col-lg-6`}>
          <div className="text-center">
            <h5>Welcome to SabPaisa</h5>
          </div>
          <Formik
            initialValues={{
              fullname: "",
              mobilenumber: "",
              emaill: "",
              passwordd: "",
              business_cat_code: "",
              confirmpasswordd: "",
              terms_and_condition: false,
            }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values, { resetForm }) => {
              handleRegistration(values);
            }}
          >
            {(formik, resetForm) => (
              <Form acceptCharset="utf-8" action="#" className="simform">
                <div className="row m-5">
                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="mobile">
                      Mobile Number
                    </label>
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
                        ["e", "E", "+", "-", "."].includes(e.key) &&
                        e.preventDefault()
                      }
                    />
                    {
                      <ErrorMessage name="mobilenumber">
                        {(msg) => <p className="text-danger errortxt">{msg}</p>}
                      </ErrorMessage>
                    }
                  </div>

                  <div className="col-lg-6">
                    <label className="form-label" htmlFor="business_category">
                      Business Category
                    </label>
                    <Field
                      name="business_cat_code"
                      className="form-select"
                      component="select"
                    >
                      <option type="text" id="businesscode" value={""}>
                        Select Business
                      </option>
                      {businessCode?.map((business, i) => (
                        <option value={business.category_id} key={i}>
                          {business.category_name}
                        </option>
                      ))}
                    </Field>
                    {
                      <ErrorMessage name="business_cat_code">
                        {(msg) => <p className="text-danger">{msg}</p>}
                      </ErrorMessage>
                    }
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="cob-btn-primary btn text-white disabled1 w-50"
                    name="commit"
                    type="submit"
                    defaultValue="Create Account"
                    disabled={
                      btnDisable || !(formik.isValid && formik.dirty)
                        ? true
                        : false
                    }
                    data-rel={btnDisable}
                    // onClick={()=>handleRegistration()}
                  >
                    Create an account
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default Registration;
