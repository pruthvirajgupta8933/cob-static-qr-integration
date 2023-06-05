import React, { Component, useState } from "react";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import FormikController from "../../_components/formik/FormikController";
import Progress from "../../_components/progress_bar/Progress";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import "./index.css";
import { fetchFrequency } from "../../slices/subscription-slice/createMandateSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";
import PersonalDetails from "./personalDetails";
import BankDetails from "./bankDetails";
import * as Yup from "yup";
import AuthMandate from "./Mandate_Submission/authMandate";

let options1 = [
  { key: "Select", value: "Select" },
  { key: "Fixed", value: "Fixed" },
];

const FORM_VALIDATION = Yup.object().shape({
  mandateType: Yup.string()
    // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("Required"),
  mandateMaxAmount: Yup.string().required("Required"),
  mandateCategory: Yup.string().required("Required"),
  frequency: Yup.string().required("Required"),
  emiamount: Yup.string().required("Required"),
  untilCancelled: Yup.boolean(),
  mandateEndDate: Yup.string().when("untilCancelled", {
    is: true,
    then: Yup.string().notRequired().nullable(),
    otherwise: Yup.string()
      .required("Specify End Date or check Until cancelled")
      .nullable(),
  }),
  mandateStartDate: Yup.string().required("Required"),
  schemeReferenceNumber: Yup.string().required("Required"),
  consumerReferenceNumber: Yup.string().required("Required"),
  emiamount: Yup.string().required("Required"),
  requestType: Yup.string().required("Required"),
});

class MandateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      mandateType: [],
      mandateCategory: [],
      requestType: [],
      mandateScreen: true,
      personalScreen: false,
      bankScreen: false,
      mandateSubmission: false,
      progressWidth: "0%",
      progressBar: true,
      bankName: [],
      updatedData: [],
      // disableEndDate:false,
      // isChecked:false
    };
  }

  componentDidMount() {
    this.props.fetchFrequency();
    createMandateService.fetchMandateType().then((resp) => {
      if (resp?.status === 200) {
        this.setState({
          mandateType: resp?.data,
        });
      }
    });
    createMandateService.fetchMandatePurpose().then((resp) => {
      // console.log(resp, "-----------");
      if (resp?.status === 200) {
        this.setState({
          mandateCategory: resp?.data,
        });
      }
    });

    createMandateService.fetchrequestType().then((resp) => {
      if (resp.status === 200) {
        this.setState({
          requestType: resp.data,
        });
      }
    });
    createMandateService.fetchBankName().then((resp) => {
      if (resp.status === 200) {
        this.setState({
          bankName: resp.data,
        });
      }
    });
  }

  handleSubmit = (values) => {
    const getDescriptionById = (code) => {
      // Find an item in the `mandateCategory` array that matches the `code` parameter
      const result = this.state.mandateCategory.filter(
        (item) => item.code === code
      );
      // If a matching item is found, return its `description` field, otherwise return an empty string
      return result.length > 0 ? result[0].description : "";
    };

    // console.log(getDescriptionById(values.mandateCategory).toString());
    // // e.preventDefault();
    // console.log(values,"values")

    const now = new Date();
    const startDate = values.mandateStartDate.split("-").map(Number); // Convert the startDate string to an array of numbers
    const startDateObj = new Date(
      Date.UTC(
        startDate[0],
        startDate[1] - 1,
        startDate[2],
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    );
    const startIsoDate = startDateObj.toISOString(); // "2023-04-24T16:53:52.960Z"

    const endDate = values.mandateEndDate.split("-").map(Number);
    const endDateObj = new Date(
      Date.UTC(
        endDate[0],
        endDate[1] - 1,
        endDate[2],
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
      )
    );
    const endIsoDate =
      values.untilCancelled === true ? "" : endDateObj.toISOString();

    const newValues = {
      consumerReferenceNumber: values.consumerReferenceNumber,
      emiamount: values.emiamount,
      frequency: values.frequency,
      mandateCategory: values.mandateCategory,
      mandatePurpose: getDescriptionById(values.mandateCategory).toString(),
      mandateEndDate: endIsoDate,
      mandateMaxAmount: values.mandateMaxAmount,
      mandateStartDate: startIsoDate,
      mandateType: values.mandateType,
      requestType: values.requestType,
      schemeReferenceNumber: values.schemeReferenceNumber,
      untilCancelled: values.untilCancelled,
    };

    this.setState({
      personalScreen: true,
      mandateScreen: false,
      progressWidth: "50%",
      data: newValues,
      progressBar: true,
    });

    // console.log("running");

    // Do something with the form data
  };

  showBankDetails = (e, values) => {
    // console.log(values, "kkk");
    const updatedData = { ...this.state.data, ...values };

    if (e == "showPersonalDetails") {
      this.setState({
        personalScreen: false,
        bankScreen: true,
        progressWidth: "100%",
        data: updatedData,
        progressBar: true,
      });
    }
  };
  showbankData = (val, validStatus, verifiedStatus) => {
    const updatedData = { ...this.state.data, ...val };
    if (verifiedStatus && validStatus) {
      this.setState({
        personalScreen: false,
        bankScreen: false,
        mandateSubmission: true,
        mandateScreen: false,
        progressBar: false,
        updatedData: updatedData,
      });
    }
    // console.log(updatedData, "updated");
    // console.log(validStatus, verifiedStatus, "state-------");
  };

  backToPreviousScreen = (e) => {
    if (e == "personalScreen") {
      this.setState({
        personalScreen: true,
        bankScreen: false,
        mandateScreen: false,
        progressWidth: "50%",
        progressBar: true,
      });
    } else if (e == "mandateScreen") {
      this.setState({
        personalScreen: false,
        bankScreen: false,
        mandateScreen: true,
        progressWidth: "0%",
        progressBar: true,
      });
    }
  };

  handleCheckboxClick = () => {
    this.setState((prevState) => ({
      isChecked: !prevState.isChecked,
      disableEndDate: !prevState.disableEndDate,
    }));
  };

  render() {
    const frequencyData = this.props.createMandate?.fetchFrequencyData;
    const frequencyOptionsData = convertToFormikSelectJson(
      "code",
      "description",
      frequencyData
    );
    const mandateTypeOptions = convertToFormikSelectJson(
      "id",
      "description",
      this.state.mandateType
    );
    const mandateTypeCategory = convertToFormikSelectJson(
      "code",
      "description",
      this.state.mandateCategory
    );
    const requestTypeOptions = convertToFormikSelectJson(
      "code",
      "description",
      this.state.requestType
    );
    const bankNameOptions = convertToFormikSelectJson(
      "code",
      "description",
      this.state.bankName
    );
    // console.log(frequencyOptionsData);

    return (
      <>
        <section className="ant-layout">
          <div>
            
          </div>
          {this.state.progressBar && (
            <div className="progress_bar_container">
              <Progress progressWidth={this.state.progressWidth} />
            </div>
          )}
          <div className="container">
            {this.state.personalScreen && (
              <PersonalDetails
                showBankDetails={this.showBankDetails}
                backToPreviousScreen={this.backToPreviousScreen}
              />
            )}
            {this.state.bankScreen && (
              <BankDetails
                backToPersonalScreen={this.backToPreviousScreen}
                bankNameOptions={bankNameOptions}
                showbankData={this.showbankData}
              />
            )}
            {this.state.mandateSubmission && (
              <AuthMandate updatedData={this.state.updatedData} />
            )}
            <div className="inner-container ">
              <Formik
                initialValues={{
                  mandateType: "",
                  mandateMaxAmount: "",
                  frequency: "",
                  mandateEndDate: "",
                  mandateStartDate: "",
                  schemeReferenceNumber: "",
                  consumerReferenceNumber: "",
                  emiamount: "",
                  requestType: "",
                  mandateCategory: "",
                  untilCancelled: false,
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={this.handleSubmit}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ errors, touched, values, setFieldValue }) => (
                  <Form>
                    {this.state.mandateScreen && (
                      <div>
                        <div className="row">
                          <div className="col-lg-4 form-group">
                            <FormikController
                              control="select"
                              label="Mandate Variant *"
                              name="mandateType"
                              className="form-control rounded-0 mt-0"
                              options={mandateTypeOptions}
                            />
                          </div>
                          <div className="col-lg-4 form-group ">
                            <FormikController
                              control="select"
                              label="Mandate Purpose *"
                              name="mandateCategory"
                              className="form-control rounded-0 mt-0"
                              options={mandateTypeCategory}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 form-group">
                            <label htmlFor="emiAmount">EMI Amount *</label>
                            <FormikController
                              control="input"
                              label="EMI Amount *"
                              name="emiamount"
                              className="form-control rounded-0 mt-0"
                            />
                          </div>
                          <div className="col-lg-4 form-group">
                            <FormikController
                              control="select"
                              label="Frequency"
                              name="frequency"
                              className="form-control rounded-0 mt-0"
                              options={frequencyOptionsData}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4 form-group">
                            <FormikController
                              control="select"
                              label="Fixed/Maximum Amount"
                              name="mandateMaxAmount"
                              className="form-control rounded-0 mt-0"
                              options={options1}
                            />
                          </div>
                          <div className="col-lg-4 form-group">
                            <FormikController
                              control="select"
                              label="Request Type"
                              name="requestType"
                              className="form-control rounded-0 mt-0"
                              options={requestTypeOptions}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <FormikController
                              control="input"
                              label="Consumer Reference Number"
                              name="consumerReferenceNumber"
                              className="form-control rounded-0"
                            />
                          </div>
                          <div className="col-lg-4">
                            <FormikController
                              control="input"
                              label="Scheme Reference Number"
                              name="schemeReferenceNumber"
                              className="form-control rounded-0"
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-4">
                            <FormikController
                              control="input"
                              type="date"
                              label="Start Date"
                              name="mandateStartDate"
                              className="form-control rounded-0"
                            />
                          </div>
                          <div className="col-lg-1 mr-3">
                            <Field
                              type="checkbox"
                              name="untilCancelled"
                              className="mr-0"
                              checked={values.untilCancelled}
                              onChange={() => {
                                setFieldValue("untilCancelled", !values.untilCancelled);
                                setFieldValue("mandateEndDate", ""); // clear value of end date when checkbox is checked
                              }}
                            />
                            Until Cancelled
                          </div>

                          <div className="col-lg-4">
                            <FormikController
                              control="input"
                              type="date"
                              label="End Date"
                              name="mandateEndDate"
                              className="form-control rounded-0"
                              disabled={values.untilCancelled}
                            />
                          
                          </div>
                        </div>
                        <button
                          class="btn bttn cob-btn-primary"
                          type="submit"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </section>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    createMandate: state.createMandate,
  };
};
const mapDispatchToProps = (dispatch) => ({
  fetchFrequency: () => dispatch(fetchFrequency()),
});
export default connect(mapStateToProps, mapDispatchToProps)(MandateForm);
