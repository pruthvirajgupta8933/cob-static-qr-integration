import React, { Component } from "react";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import FormikController from "../../_components/formik/FormikController";
import Progress from "../../_components/progress_bar/Progress";
import { Formik, Form } from "formik";
import { connect } from "react-redux";
import "./index.css";
import { fetchFrequency } from "../../slices/subscription-slice/createMandateSlice";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";

let options1 = [
  { key: "ALL", value: "ALL" },
  { key: "FAILED", value: "FAILED" },
  { key: "SUCCESS", value: "SUCCESS" },
  { key: "PROCESSED", value: "PROCESSED" },
];

class MandateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mandateVariant: "",
      mandatePurpose: "",
      emiAmount: "",
      frequency: "",
      fixedMaximumAmount: "",
      requestType: "",
      consumerReferenceNumber: "",
      schemeReferenceNumber: "",
      data: [],
      mandateType:[],
      mandateCategory:[]
    };
  }

  componentDidMount() {
    this.props.fetchFrequency();
    createMandateService.fetchMandateType().then((resp) => {
      if(resp?.status===200)
      {
        this.setState({
          mandateType:resp?.data
        })
      }
    });
    createMandateService.fetchMandatePurpose().then((resp)=>
    {
      console.log(resp,'-----------');
      if(resp?.status===200)
      {
        this.setState({
          mandateCategory:resp?.data
        })
      }
    })
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data
  };

  render() {
    const frequencyData = this.props.createMandate?.fetchFrequencyData;
    const frequencyOptionsData = convertToFormikSelectJson(
      "code",
      "description",
      frequencyData
    );
    const mandateTypeOptions=convertToFormikSelectJson(
      "id",
      "description",
      this.state.mandateType
    )
    const mandateTypeCategory=convertToFormikSelectJson(
      "id",
      "description",
      this.state.mandateCategory
    )
    console.log(frequencyOptionsData);
    return (
      <>
        <section className="ant-layout">
          <div>
            <NavBar />
          </div>
          <div className="progress_bar">
            <Progress />
          </div>
          <div className="container">
            <Formik>
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-lg-4 form-group">
                    <FormikController
                      control="select"
                      label="Mandate Variant *"
                      name="description"
                      className="form-control rounded-0 mt-0"
                      options={mandateTypeOptions}
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <FormikController
                      control="select"
                      label="Mandate Purpose *"
                      name="description"
                      className="form-control rounded-0 mt-0"
                      options={mandateTypeCategory}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 form-group">
                    <label htmlFor="emiAmount">EMI Amount *</label>
                    <FormikController
                      control="select"
                      label="EMI Amount *"
                      name="description"
                      className="form-control rounded-0 mt-0"
                      options={options1}
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <FormikController
                      control="select"
                      label="Frequency"
                      name="description"
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
                      name="description"
                      className="form-control rounded-0 mt-0"
                      options={options1}
                    />
                  </div>
                  <div className="col-lg-4 form-group">
                    <FormikController
                      control="select"
                      label="Request Type"
                      name="description"
                      className="form-control rounded-0 mt-0"
                      options={options1}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <FormikController
                      control="input"
                      type="date"
                      label="From Date"
                      name="fromDate"
                      className="form-control rounded-0"
                    />
                  </div>
                  <div className="col-lg-4">
                    <FormikController
                      control="input"
                      type="date"
                      label="From Date"
                      name="fromDate"
                      className="form-control rounded-0"
                    />
                  </div>
                </div>
                <button class="btn btn-primary" type="submit">
                  Next
                </button>
              </form>
            </Formik>
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
