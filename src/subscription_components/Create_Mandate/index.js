import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
// import {
//   fetchFrequency,
//   fetchMandateType,
//   fetchMandatePurpose,
//   fetchRequestType,
//   fetchBankName,
// } from "../../slices/subscription-slice/createMandateSlice";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";
// import fetchMandateType from "../../slices/subscription-slice/createMandateSlice"
import NavBar from "../../components/dashboard/NavBar/NavBar";
import FormikController from "../../_components/formik/FormikController";
import Progress from "../../_components/progress_bar/Progress";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import PersonalDetails from "./personalDetails";
import BankDetails from "./bankDetails";
import AuthMandate from "./Mandate_Submission/authMandate";
import { useDispatch, useSelector } from "react-redux";
import { fetchFrequency, fetchMandatePurpose, fetchMandateType, fetchRequestType, saveFormFirstData } from "../../slices/subscription-slice/createMandateSlice";

const options1 = [
  { key: "Select", value: "Select" },
  { key: "Fixed", value: "Fixed" },
];

const FORM_VALIDATION = Yup.object().shape({
  mandateType: Yup.string().required("Required"),
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



const MandateForm = ({
  // fetchFrequency,
  //  fetchMandateType,
  // fetchMandatePurpose,
  // fetchRequestType,
  fetchBankName,
  frequencyData,
  // mandateType,
  mandateCategory,
  requestType,
  bankName,
}) => {


  const [data, setData] = useState({});
  const [mandateScreen, setMandateScreen] = useState(true);
  const [mandatePurpose, setMandatePurpose] = useState([])
  const [mandateRequestType, setMandateRequestType] = useState([])
  const [manDateFrequency, setMandateFrequency] = useState([])
  const [mandateType, setMandateType] = useState([])
  const [personalScreen, setPersonalScreen] = useState(false);
  const [bankScreen, setBankScreen] = useState(false);
  const [mandateSubmission, setMandateSubmission] = useState(false);
  const [progressWidth, setProgressWidth] = useState("0%");
  const [progressBar, setProgressBar] = useState(true);
  const [updatedData, setUpdatedData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [disableEndDate, setDisableEndDate] = useState(false);
  const [radioButtonValue, setRadioButtonValue] = useState("");
  const now = new Date();
  const dispatch = useDispatch();
  const { createMandate } = useSelector((state) => state);
  const { firstForm } = createMandate.createMandate.formData;
  console.log(firstForm,"this is firstForm")

 console.log("firstForm.mandateType",firstForm.mandateType)



  const initialValues = {
    radioButtonValue: "",
    mandateType: firstForm.mandateType ? firstForm.mandateType : "",
    mandateMaxAmount: firstForm.mandateMaxAmount ? firstForm.mandateMaxAmount : "",
    frequency: firstForm.frequency ? firstForm.frequency : "",
    mandateEndDate: firstForm.mandateEndDate ? firstForm.mandateEndDate : "",
    mandateStartDate: firstForm.mandateStartDate ? firstForm.mandateStartDate : "",
    schemeReferenceNumber: firstForm.schemeReferenceNumber ? firstForm.schemeReferenceNumber : "",
    consumerReferenceNumber: firstForm.consumerReferenceNumber ? firstForm.consumerReferenceNumber : "",
    emiamount: firstForm.emiamount ? firstForm.emiamount : "",
    requestType: firstForm.requestType ? firstForm.requestType : "",
    mandateCategory: firstForm.mandateCategory ? firstForm.mandateCategory : "",
    untilCancelled: false,
  }




  useEffect(() => {


    fetchManDateData();
    fetchManDatePurpose();
    fetchManDateFrequency();
    fetchMandateRequestType();
  }, []);

  const fetchManDateData = async () => {
    try {
      const resp = await dispatch(fetchMandateType());

      const data = convertToFormikSelectJson("id", "description", resp.payload.data);
      setMandateType(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchManDatePurpose = async () => {
    try {
      const resp = await dispatch(fetchMandatePurpose());

      const data = convertToFormikSelectJson("code", "description", resp.payload.data);
      setMandatePurpose(data);
    } catch (err) {
      // console.log(err);
    }
  };


  const fetchManDateFrequency = async () => {
    try {
      const resp = await dispatch(fetchFrequency());


      const data = convertToFormikSelectJson("code", "description", resp.payload);
      setMandateFrequency(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchMandateRequestType = async () => {
    try {
      const resp = await dispatch(fetchRequestType());


      const data = convertToFormikSelectJson("code", "description", resp.payload?.data);
      setMandateRequestType(data);
    } catch (err) {
      // console.log(err);
    }
  };








  const handleSubmit = (values) => {

    
    setPersonalScreen(true);
    setProgressWidth("50%")
    setMandateScreen(false);
    setProgressBar(true);


    const getDescriptionById = (code) => {
      const result = mandateCategory.filter((item) => item.code === code);
      return result.length > 0 ? result[0].description : "";
    };

    const startDate = values.mandateStartDate.split("-").map(Number);
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
    const startIsoDate = startDateObj.toISOString();

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
      // console.log(getDescriptionById(values.mandateCategory).toString())
    const newValues = {
      consumerReferenceNumber: values.consumerReferenceNumber,
      emiamount: values.emiamount,
      frequency: values.frequency,
      mandateCategory: values.mandateCategory,
      mandatePurpose: "bank manadate", // need to fix
      mandateEndDate: endIsoDate,
      mandateMaxAmount: values.mandateMaxAmount,
      mandateStartDate: startIsoDate,
      mandateType: values.mandateType,
      requestType: values.requestType,
      schemeReferenceNumber: values.schemeReferenceNumber,
      untilCancelled: values.untilCancelled,
    };

    console.log(
      newValues,"newValues is this"
    )

    
    dispatch(saveFormFirstData({ newValues }))
    // console.log("this----- is new values", newValues)




    setProgressWidth("50%");
    setData(newValues);
    setProgressBar(true);
  };

  const showBankDetails = (e, values) => {
    const updatedData = { ...data, ...values };

    if (e === "showPersonalDetails") {
      setPersonalScreen(false);
      setBankScreen(true);
      setProgressWidth("100%");
      setData(updatedData);
      setProgressBar(true);
    }
  };

  const showbankData = (val, validStatus, verifiedStatus) => {
    const updatedData = { ...data, ...val };
    if (verifiedStatus && validStatus) {
      setMandateSubmission(true);
      setPersonalScreen(false);
      setBankScreen(false);

      setMandateScreen(false);
      setProgressBar(false);
      setUpdatedData(updatedData);
    }
  };

  const backToPreviousScreen = (e) => {
    if (e === "personalScreen") {
      setPersonalScreen(true);
      setBankScreen(false);
      setMandateScreen(false);
      setProgressWidth("50%");
      setProgressBar(true);
    } else if (e === "mandateScreen") {
      setPersonalScreen(false);
      setBankScreen(false);
      setMandateScreen(true);
      setProgressWidth("0%");
      setProgressBar(true);
    }
  };

  const handleCheckboxClick = () => {
    setIsChecked((prevIsChecked) => !prevIsChecked);
    setDisableEndDate((prevDisableEndDate) => !prevDisableEndDate);
  };



  return (
    <>
      <section className="ant-layout">
        <div></div>
        {progressBar && (
          <div className="progress_bar_container">
            <Progress progressWidth={progressWidth} />
          </div>
        )}
        <div className="container">
        <div className="inner-container d-flex justify-content-center align-items-center">
            <Formik
              initialValues={initialValues}
              validationSchema={FORM_VALIDATION}
              enableReinitialize={true}
              // onSubmit={handleSubmit}
              onSubmit={(values) => {
                handleSubmit(values)

              }}
            // validateOnChange={false}
            // validateOnBlur={false}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  {mandateScreen && (
                    <div>
                      <div>
                        <label htmlFor="radioButtonValue" className="d-block">
                          Requested By
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Field
                          type="radio"
                          id="radioButtonValue"
                          name="radioButtonValue"
                          value="merchant"
                          checked={values.radioButtonValue === "merchant"}
                          onChange={() =>
                            setFieldValue("radioButtonValue", "merchant")
                          }
                          className="form-check-input"
                        />
                        <label
                          htmlFor="Merchant"
                          className="form-check-label mr-3"
                        >
                          Merchant
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <Field
                          type="radio"
                          name="radioButtonValue"
                          value="customer"
                          checked={values.radioButtonValue === "customer"}
                          onChange={() =>
                            setFieldValue("radioButtonValue", "customer")
                          }
                          className="form-check-input"
                        />
                        <label htmlFor="customer" className="form-check-label">
                          Customer
                        </label>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 form-group">
                          <FormikController
                            control="select"
                            label="Mandate Variant *"
                            name="mandateType"
                            className="form-control form-select rounded-0 mt-0"
                            options={mandateType}
                          />
                        </div>
                        <div className="col-lg-6 form-group ">
                          <FormikController
                            control="select"
                            label="Mandate Purpose *"
                            name="mandateCategory"
                            className="form-control form-select rounded-0 mt-0"
                            options={mandatePurpose}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 form-group">
                          <FormikController
                            control="input"
                            label="EMI Amount *"
                            name="emiamount"
                            className="form-control rounded-0 mt-0"
                          />
                        </div>
                        <div className="col-lg-6 form-group">
                          <FormikController
                            control="select"
                            label="Frequency"
                            name="frequency"
                            className="form-control form-select rounded-0 mt-0"
                            options={manDateFrequency}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 form-group">
                          <FormikController
                            control="select"
                            label="Fixed/Maximum Amount"
                            name="mandateMaxAmount"
                            className="form-control form-select rounded-0 mt-0"
                            options={options1}
                          />
                        </div>
                        <div className="col-lg-6 form-group">
                          <FormikController
                            control="select"
                            label="Request Type"
                            name="requestType"
                            className="form-control form-select rounded-0 mt-0"
                            options={mandateRequestType}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <FormikController
                            control="input"
                            label="Consumer Reference Number"
                            name="consumerReferenceNumber"
                            className="form-control rounded-0"
                          />
                        </div>
                        <div className="col-lg-6">
                          <FormikController
                            control="input"
                            label="Scheme Reference Number"
                            name="schemeReferenceNumber"
                            className="form-control rounded-0"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6">
                          <FormikController
                            control="input"
                            type="date"
                            label="Start Date"
                            name="mandateStartDate"
                            className="form-control rounded-0"
                          />
                        </div>
                        <div className="col-lg-3">
                          <div className="form-check">
                            <Field
                              type="checkbox"
                              name="untilCancelled"
                              className="form-check-input "
                              checked={values.untilCancelled}
                              onChange={() => {
                                setFieldValue(
                                  "untilCancelled",
                                  !values.untilCancelled
                                );
                                setFieldValue("mandateEndDate", "");
                              }}
                            />
                            <label
                              htmlFor="untilCancelled"
                              className="form-check-label ml-1"
                            >
                              Until Cancelled
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-3">
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
                      <button className="btn bttn cob-btn-primary" type="submit">
                        Next
                      </button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </div>

          {personalScreen && (
            <PersonalDetails
              showBankDetails={showBankDetails}
              backToPreviousScreen={backToPreviousScreen}
            />
          )}
          {bankScreen && (
            <BankDetails
              backToPersonalScreen={backToPreviousScreen}
              showbankData={showbankData}
              setMandateSubmission={setMandateSubmission}
              setBankScreen={setBankScreen}
              setProgressBar={setProgressBar}
            />
          )}
            {mandateSubmission && <AuthMandate  />}
          
        </div>
      </section>
    </>
  );
};

export default MandateForm



