import React from "react";
import { Formik,Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
import * as Yup from "yup";
const PersonalDetails = ({ showBankDetails,backToPreviousScreen }) => {
  const handleSubmitPersonal = (values) => {
    showBankDetails("showPersonalDetails",values);
    console.log(values,'values');
  };
  const FORM_VALIDATION = Yup.object().shape({
    payerName: Yup.string()
      // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
      .required("Required"),
    payerEmail: Yup.string().required("Required"),
    payerMobile: Yup.string().required("Required"),
  });

  return (
    <div>
      <Formik
            initialValues={{
              payerName: "",
              payerEmail:"",
              payerMobile:"",
              panNo:"",
              telePhone:""
            }}
            validationSchema={FORM_VALIDATION}
            onSubmit={handleSubmitPersonal}
      >
        <Form>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Name"
                name="payerName"
                className="form-control rounded-0 mt-0"
                // options={mandateTypeOptions}
              />
            </div>
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Email"
                name="payerEmail"
                className="form-control rounded-0 mt-0"
                // options={mandateTypeCategory}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Mobile Number"
                name="payerMobile"
                className="form-control rounded-0 mt-0"
              />
            </div>
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="PAN Number"
                name="panNo"
                className="form-control rounded-0 mt-0"
                // options={frequencyOptionsData}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 form-group">
              <FormikController
                control="input"
                label="Telephone Number (optional) "
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
            class="btn btn-light"
            onClick={() => backToPreviousScreen("mandateScreen")}
          >
            Back
          </button>
          <button class="btn btn-primary" type="submit">
            Next
          </button>
        </Form>
      </Formik>
    </div>
  );
};
export default PersonalDetails;
