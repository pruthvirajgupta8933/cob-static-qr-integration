import React from "react";
import { Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
// import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { saveFormSecondData } from "../../slices/subscription-slice/createMandateSlice";
import Yup from "../../_components/formik/Yup";

const PersonalDetails = ({ showBankDetails, backToPreviousScreen }) => {
  const handleSubmitPersonal = (values) => {
    showBankDetails("showPersonalDetails", values);
    dispatch(saveFormSecondData({ values }))
  };





  const FORM_VALIDATION = Yup.object().shape({
    payerName: Yup.string()
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .required("Required"),
    payerEmail: Yup.string().required("Required"),
    payerMobile: Yup.string()
      .matches(/^(?!0)\d{10}$/, 'Phone number must not start with 0 and be 10 digits long')
      .required("Required"),
    telePhone: Yup.string()
      .matches(/^[0-9]{8}$/, 'Invalid telphone Number')
      .notRequired(),
    panNo: Yup.string()
      .matches(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/, 'Invalid PAN Number')
      .notRequired(),
  });
  const { createMandate } = useSelector((state) => state);
  const { secondForm } = createMandate.createMandate.formData;

  const initialValues = {
    payerName: secondForm.payerName ? secondForm.payerName : "",
    payerEmail: secondForm.payerEmail ? secondForm.payerEmail : "",
    payerMobile: secondForm.payerMobile ? secondForm.payerMobile : "",
    panNo: secondForm.panNo ? secondForm.panNo : "",
    telePhone: secondForm.telePhone ? secondForm.telePhone : ""
  }
  const dispatch = useDispatch();




  return (
    <div className="col-lg-8">
      <Formik
        initialValues={initialValues}
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        onSubmit={handleSubmitPersonal}
      >
        <Form>
          <div className="row">
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                placeholder="Enter Name"
                label="Name"
                name="payerName"
                className="form-control rounded-0 mt-0"
              // options={mandateTypeOptions}
              />
            </div>
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                label="Email"
                placeholder="Enter Email"
                name="payerEmail"
                className="form-control rounded-0 mt-0"
              // options={mandateTypeCategory}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                label="Mobile Number"
                placeholder="Enter Mobile Number"
                name="payerMobile"
                className="form-control rounded-0 mt-0"
              />
            </div>
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                label="PAN Number ( Optional ) "
                placeholder="Enter PAN Number"
                name="panNo"
                className="form-control rounded-0 mt-0"
              // options={frequencyOptionsData}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 form-group">
              <FormikController
                control="input"
                label="Telephone Number ( Optional )"
                placeholder="Enter Telephone Number"
                name="telePhone"
                className="form-control rounded-0 mt-0"
              // options={options1}
              />
            </div>
            {/* <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Alternate Email ID (optional)"
                name="description"
                className="form-control rounded-0 mt-0"
                // options={requestTypeOptions}
              />
            </div> */}
          </div>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => backToPreviousScreen("mandateScreen")}
          >
            Back
          </button>
          <button className="btn bttn cob-btn-primary ml-2" type="submit">
            Next
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default PersonalDetails;
