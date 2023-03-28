import React, { Component } from "react";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import FormikController from "../../_components/formik/FormikController";
import Progress from "../../_components/progress_bar/Progress";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import { connect } from "react-redux";
import "./index.css";
import { fetchFrequency } from "../../slices/subscription-slice/createMandateSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";
import PersonalDetails from "./personalDetails";
import BankDetails from "./bankDetails";
import * as Yup from "yup";

let options1 = [
  { key: "Select", value: "Select" },
  { key: "Fixed", value: "Fixed" },
];
const FORM_VALIDATION = Yup.object().shape({
  mandateType: Yup.string()
    // .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
    .required("Required"),
  mandateMaxAmount: Yup.string().required("Required"),
  frequency: Yup.string().required("Required"),
  emiamount: Yup.string().required("Required"),
  mandateEndDate: Yup.string().required("Required"),
  mandateStartDate: Yup.string().required("Required"),
  schemeReferenceNumber: Yup.string().required("Required"),
  consumerReferenceNumber: Yup.string().required("Required"),
  emiamount: Yup.string().required("Required"),
  requestType:Yup.string().required("Required")
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
      progressWidth: "0%",
      bankName: [],

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
      console.log(resp, "-----------");
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

  // handleInputChange = (event) => {
  //   const target = event.target;
  //   const value = target.value;
  //   const name = target.name;

  //   this.setState({
  //     [name]: value,
  //   });
  // };

  handleSubmit = (values) => {
    // e.preventDefault();
    console.log(values, "This is values");
    this.setState({
      personalScreen: true,
      mandateScreen: false,
      progressWidth: "50%",
      data:values
    });
  
    console.log("running");

    // Do something with the form data
  };

  showBankDetails = (e,values) => {
    console.log(values,'kkk');
    const updatedData={...this.state.data,...values};
  
    if (e == "showPersonalDetails") {
      this.setState({
        personalScreen: false,
        bankScreen: true,
        progressWidth: "100%",
        data:updatedData
      });
    }
  };
  showbankData=(val)=>
  {
    const updatedData={...this.state.data,...val};
    console.log(updatedData,'updated')
  }

  backToPreviousScreen = (e) => {
    if (e == "personalScreen") {
      this.setState({
        personalScreen: true,
        bankScreen: false,
        mandateScreen: false,
        progressWidth: "50%",
      });
    } else if (e == "mandateScreen") {
      this.setState({
        personalScreen: false,
        bankScreen: false,
        mandateScreen: true,
        progressWidth: "0%",
      });
    }
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
      "id",
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
    console.log(frequencyOptionsData);
    return (
      <>
        <section className="ant-layout">
          <div>
            <NavBar />
          </div>
          <div className="progress_bar_container">
            <Progress progressWidth={this.state.progressWidth} />
          </div>
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
                  requestType:""
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={this.handleSubmit}
              >
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
                        <div className="col-lg-4">
                          <FormikController
                            control="input"
                            type="date"
                            label="End Date"
                            name="mandateEndDate"
                            className="form-control rounded-0"
                          />
                        </div>
                      </div>
                      <button class="btn btn-primary" type="submit">
                        Next
                      </button>
                    </div>
                  )}
                </Form>
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
