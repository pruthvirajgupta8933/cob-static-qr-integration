import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../../_components/formik/FormikController";
import "./kyc-style.css";
import { updateContactInfoEditDetails } from "../../../slices/editKycSlice";
import { kycUserList } from "../../../slices/kycSlice";
import { toast } from "react-toastify";
import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";
import Yup from "../../../_components/formik/Yup";




function ContactInfoEdtkyc(props) {
  const setTitle = props.title
  const setTab = props.tab

  const selectedId = props.selectedId
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const KycList = kyc.kycUserList;
  const isContactNumberVerified = KycList?.isContactNumberVerified
  const isEmailVerified = KycList?.isEmailVerified
  const dispatch = useDispatch()
  const [disable, setIsDisable] = useState(false)

  const initialValues = {
    name: KycList?.name,
    contact_number: KycList?.contactNumber,
    email_id: KycList?.emailId,
    aadhar_number: KycList?.aadharNumber,


  };
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumericDot, RegexMsg.acceptAlphaNumericDot)

      .nullable()
      .allowOneSpace(),
    contact_number: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .matches(Regex.phoneNumber, RegexMsg.phoneNumber)
      .min(10, "Phone number is not valid")
      .max(10, "Only 10 digits are allowed ")
      .nullable(),

    email_id: Yup.string()
      .allowOneSpace()
      .email("Invalid email")
      .nullable(),

    aadhar_number: Yup.string()
      .allowOneSpace()
      .max(18, "Exceeds the limit")

      .nullable(),

  });

  const handleSubmitContact = (values) => {

    const emptyFields = ['name', 'contact_number', 'email_id', 'aadhar_number'].some(
      (field) => !values[field]
    );

    if (emptyFields) {
      const confirmSubmit = window.confirm(
        "Some fields are empty. Are you sure you want to proceed?"
      );

      if (!confirmSubmit) {
        return; // Exit the function if the user cancels
      }
    }

    setIsDisable(true);
    dispatch(
      updateContactInfoEditDetails({
        login_id: selectedId,
        name: values.name,
        contact_number: values.contact_number,
        email_id: values.email_id,
        modified_by: loginId,
        aadhar_number: values.aadhar_number,
        is_email_verified: isEmailVerified === 1,
        is_contact_number_verified: isContactNumberVerified === 1,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res.payload?.status === true
      ) {
        setTab(2);
        setTitle("BUSINESS OVERVIEW");
        setIsDisable(false);
        toast.success(res.payload?.message);
        dispatch(kycUserList({ login_id: selectedId }));
      } else {
        toast.error(res.payload?.message || "Something went wrong");
        toast.error(res.payload?.detail);
        setIsDisable(false);
      }
    });
  };



  const tooltipData = {
    "contact_person_name": "The name of an individual who serves as a point of contact for a particular organization or business.",
    "contact_phone": "We will reach out to this phone for any account related issues."
  }

  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitContact}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          setFieldError,
          setFieldValue
        }) => (
          <Form>
            <div className="row">
              <div className="col-lg-6 col-sm-12 col-md-12">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_person_name}>
                  Contact Person Name<span className="text-danger"> *</span>
                </label>

                <FormikController
                  control="input"
                  type="text"
                  name="name"
                  className="form-control"

                />
              </div>

              <div className="col-sm-6 col-md-6 col-lg-6" >
                <label className="col-form-label mt-0 p-2 " >
                  Aadhaar Number<span className="text-danger"> *</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="aadhar_number"
                  className="form-control maskedInput"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2" data-tip={tooltipData.contact_phone}>
                  Contact Number<span className="text-danger"> *</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="contact_number"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("contact_number", e.target.value)
                      // setFieldValue("isContactNumberVerified", 0)
                    }}

                  />


                </div>
                <span className="mb-1">

                  <p className={isContactNumberVerified === 1 ? "text-success" : "text-danger"}>
                    {isContactNumberVerified === 1 ? "Verified" : "Not Verified"}
                  </p>

                </span>




              </div>
              <div className="col-sm-6 col-md-6 col-lg-6 ">
                <label className="col-form-label mt-0 p-2">
                  Email Id<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="email_id"
                    className="form-control"


                  />

                </div>
                <span className="mb-1">

                  <p className={isEmailVerified === 1 ? "text-success" : "text-danger"}>
                    {isEmailVerified === 1 ? "Verified" : "Not Verified"}
                  </p>

                </span>


              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">

                <button
                  disabled={disable}
                  type="submit"
                  className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                >
                  {disable &&
                    <span className="mr-2">
                      <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                      <span className="sr-only">Loading...</span>
                    </span>
                  }
                  {"Save and Next"}
                </button>

              </div>
            </div>



          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ContactInfoEdtkyc;

