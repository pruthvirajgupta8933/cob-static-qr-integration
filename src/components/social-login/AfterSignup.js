/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
// import API_URL from "../../config";
// import { axiosInstanceJWT } from "../../utilities/axiosInstance";
import AuthService from "../../services/auth.service";
import { toast } from "react-toastify";

import "../login/css/home.css";
import "../login/css/homestyle.css";
import "../login/css/style-style.css";
import "../login/css/style.css";
import Yup from "../../_components/formik/Yup";
import ReCAPTCHA from "react-google-recaptcha";
import authService from "../../services/auth.service";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FORM_VALIDATION = Yup.object().shape({
  mobilenumber: Yup.string()
    .required("Required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number in not valid"),

  reCaptcha: Yup.string().required("Required").nullable()

});

function Registration({ hideDetails, getPendingDetails, fullName, email }) {
  const history = useHistory();
  const [btnDisable, setBtnDisable] = useState(false);
  // const [businessCode, setBusinessCode] = useState([]);
  const [queryString, setQueryString] = useState({});
  const [mobileNumber, setMobileNumber] = useState("");
  const [businessCategoryCode, setBussinessCategoryCode] = useState("");


  useEffect(() => {
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




  const handleCaptchaChange = async (token, formik) => {
    const { setFieldValue } = formik

    const postCaptcha = {
      "g-recaptcha-response": token
    }

    authService.captchaVerify(postCaptcha).then(resp => {
      setFieldValue("reCaptcha", token)
    }).catch(error => {
      console.log(error)
    })

  };


  const handleRegistration = async (formData) => {
    setBtnDisable(true);
    try {

      getPendingDetails(mobileNumber, businessCategoryCode);
      let businessType = 1;
      const data = {
        fullname: fullName,
        mobileNumber: formData?.mobilenumber,
        email: email,
        business_cat_code: "38",
        businessType,
        isDirect: true,
        created_by: null,
        plan_details: queryString,
        is_social: true,
      };

      const response = await AuthService.register(data);

      if (response.status === 200) {
        toast.success(response.data.message);
        setBtnDisable(false);
        history.replace("/login");
      }
    } catch (err) {
      setBtnDisable(false);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className={"col-sm-12 col-md-6 col-lg-6"}>
        <Formik
          initialValues={{
            fullname: "",
            mobilenumber: "",
            emaill: "",
            passwordd: "",
            business_cat_code: "38",
            terms_and_condition: false,
            reCaptcha: ""
          }}
          validationSchema={FORM_VALIDATION}

          onSubmit={(values, { resetForm }) => {
            handleRegistration(values);
          }}
        >
          {(formik, resetForm) => (

            <Form>
              <div className="mb-3">
                <label className="form-label">  Mobile Number</label>
                <Field type="text" className="form-control" placeholder="Mobile Number"
                  name="mobilenumber"
                  pattern="\d{10}"
                  size={10}
                  onKeyDown={(e) =>
                    ["e", "E", "+", "-", "."].includes(e.key) &&
                    e.preventDefault()
                  } />

                <ErrorMessage name="mobilenumber">
                  {(msg) => <p className="text-danger">{msg}</p>}
                </ErrorMessage>
              </div>

              <div className="mb-3 mt-3">
                <ReCAPTCHA
                  sitekey="6Le8XYMqAAAAANwufmddI2_Q42TdWhDiAlcpem4g"
                  onChange={(token) => handleCaptchaChange(token, formik)}
                />
                <ErrorMessage name="reCaptcha">
                  {(msg) => (<p className="text-danger">{msg}</p>)}
                </ErrorMessage>
              </div>


              <button type="submit" className="cob-btn-primary btn text-white disabled1 w-50"
                name="submit"

                defaultValue="Create Account"
                disabled={
                  btnDisable || !(formik.isValid && formik.dirty)
                    ? true
                    : false
                }
                data-rel={btnDisable}>Submit</button>
            </Form>


          )}
        </Formik>
      </div>
    </div>
  );
}

export default Registration;
