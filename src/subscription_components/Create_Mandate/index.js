import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "../../utilities/axiosInstance";
import subAPIURL from "../../config"
import { Link } from 'react-router-dom'

// import CustomModal from "../../../_components/custom_modal";
import CustomModal from "../../_components/custom_modal";
// import {
//   fetchFrequency,
//   fetchMandateType,
//   fetchMandatePurpose,
//   fetchRequestType,
//   fetchBankName,
// } from "../../slices/subscription-slice/createMandateSlice";
// import fetchMandateType from "../../slices/subscription-slice/createMandateSlice"

import FormikController from "../../_components/formik/FormikController";
import Progress from "../../_components/progress_bar/Progress";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import PersonalDetails from "./personalDetails";
import BankDetails from "./bankDetails";
import AuthMandate from "./Mandate_Submission/authMandate";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom"
import { fetchFrequency, fetchMandatePurpose, fetchMandateType, fetchRequestType, saveFormFirstData } from "../../slices/subscription-slice/createMandateSlice";

const options1 = [
  { key: "Select", value: "Select" },
  { key: "Fixed", value: "Fixed" },
];

const FORM_VALIDATION = Yup.object().shape({
  mandateType: Yup.string().required("Required"),
  mandateMaxAmount: Yup.number().required("Required"),
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
  fixedmaxAmount: Yup.string().required("Required"),
  emiamount: Yup.string().required("Required"),
  requestType: Yup.string().required("Required"),
});



const MandateForm = () => {


  const [data, setData] = useState({});
  const [mandateScreen, setMandateScreen] = useState(true);
  const [showResponseModal, setShowMandateModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [mandatePurpose, setMandatePurpose] = useState([])
  const [mandateRequestType, setMandateRequestType] = useState([])
  const [mandateCatogoryData, setMandatecatogoryData] = useState([])
  const [manDateFrequency, setMandateFrequency] = useState([])
  const [mandateType, setMandateType] = useState([])
  const [personalScreen, setPersonalScreen] = useState(false);
  const [bankScreen, setBankScreen] = useState(false);
  const [mandateSubmission, setMandateSubmission] = useState(false);
  const [progressWidth, setProgressWidth] = useState("1%");
  const [progressBar, setProgressBar] = useState(true);
  const [updatedData, setUpdatedData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [handelResponseData, setHandleResponseData] = useState({})
  const [disableEndDate, setDisableEndDate] = useState(false);
  const [radioButtonValue, setRadioButtonValue] = useState("");
  const now = new Date();
  const dispatch = useDispatch();
  const { createMandate } = useSelector((state) => state);
  const { firstForm } = createMandate.createMandate.formData;




  function generateRandomNumber() {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const randomNumber = generateRandomNumber();







  const initialValues = {
    radioButtonValue: "",
    mandateType: firstForm.mandateType ?? "",
    // mandateMaxAmount: firstForm.mandateMaxAmount.tofixed() ?? "",
    mandateMaxAmount: !isNaN(firstForm.mandateMaxAmount) ? parseInt(firstForm.mandateMaxAmount).toFixed(2) : '0.00',
    frequency: firstForm.frequency ?? "",
    mandateEndDate: firstForm.mandateEndDate ?? "",
    mandateStartDate: firstForm.mandateStartDate ?? "",
    fixedmaxAmount: firstForm.fixedmaxAmount ?? "",
    schemeReferenceNumber: firstForm.schemeReferenceNumber ?? generateRandomNumber(),
    consumerReferenceNumber: firstForm.consumerReferenceNumber ?? generateRandomNumber(),
    emiamount: firstForm.emiamount ? firstForm.emiamount : "1",
    requestType: firstForm.requestType ?? "",
    mandateCategory: firstForm.mandateCategory ?? "",
    untilCancelled: false,
  }



  const params = useParams();
  const location = useLocation();
  const { search } = location;
  const mendateRegId = search.split("?mendateRegId=")[1];
  console.log(mendateRegId);




  useEffect(() => {
    handleResponseApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mendateRegId])




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
      setMandatecatogoryData(resp?.payload?.data)


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



  const handleResponseApi = () => {
    axiosInstance
      .get(subAPIURL.HANDLE_RESPONSE + mendateRegId)
      .then((response) => {

        setHandleResponseData(response.data)
        if (response.status === 200) {
          setShowMandateModal(true)
        }
        // console.log(response.data,"this is response");
      })

  };





  const handleSubmit = (values) => {


    setPersonalScreen(true);
    setProgressWidth("50%")
    setMandateScreen(false);
    setProgressBar(true);


    const getDescriptionById = (code) => {
      const result = mandateCatogoryData.filter((item) => item.code === code);
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
      fixedmaxAmount: values.fixedmaxAmount,
      frequency: values.frequency,
      mandateCategory: values.mandateCategory,
      mandatePurpose: getDescriptionById(values.mandateCategory).toString(), // need to fix
      mandateEndDate: endIsoDate,
      mandateMaxAmount: parseInt(values.mandateMaxAmount).toFixed(2) ?? '0.00',
      mandateStartDate: startIsoDate,
      mandateType: values.mandateType,
      requestType: values.requestType,
      schemeReferenceNumber: values.schemeReferenceNumber,
      untilCancelled: values.untilCancelled,
    };

    dispatch(saveFormFirstData({ newValues }))
    // console.log("this----- is new values", newValues)
    setProgressWidth("50%");
    setData(newValues);
    setProgressBar(true);
  };

  const showBankDetails = (e, values) => {
    const updateData = { ...data, ...values };

    if (e === "showPersonalDetails") {
      setPersonalScreen(false);
      setBankScreen(true);
      setProgressWidth("100%");
      setData(updateData);
      setProgressBar(true);
    }
  };

  const showbankData = (val, validStatus, verifiedStatus) => {
    const updatedNewData = { ...data, ...val };
    if (verifiedStatus && validStatus) {
      setMandateSubmission(true);
      setPersonalScreen(false);
      setBankScreen(false);

      setMandateScreen(false);
      setProgressBar(false);
      setUpdatedData(updatedNewData);
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
  const handlePrint = () => {
    window.print();
  };



  const modalBody = () => {
    return (
      <>
        <div className="text-centre">
          <div className="row">
            <div className="col-md-3">
              <h6>Mandate Registration ID</h6>
              <p>{handelResponseData?.mandateRegistrationId}</p>
            </div>
            <div className="col-md-3">
              <h6>Client Registration ID</h6>
              <p>{handelResponseData?.clientRegistrationId}</p>
            </div>
            <div className="col-md-3">
              <h6>Status</h6>
              <p>{handelResponseData?.regestrationStatus}</p>
            </div>
            <div className="col-md-3">
              <button className="btn bttn cob-btn-primary" onClick={handlePrint}>Print</button>

            </div>



          </div>
        </div>
      </>
    )
  }


  const modalFooter = () => {
    return (
      <>
        <div className='col-md-12'>
          <h6>Your E-Mandate registration is rejected due to Rejected as per customer confirmation</h6>
        </div>

        <div className='col-md-12'>
          <h6>Do you want to create another E-Mandate <Link to={`/dashboard/subscription/mandate_registration`} onClick={() => { setIsModalOpen(false) }}> Click here</Link> </h6>

        </div>



        {/* <button type="button" className="btn btn-secondary text-white" onClick={pushToDashboard}>Disagree</button>
        <button type="button" className="btn approve text-white btn-sm" data-dismiss="modal" onClick={() => { setIsModalOpen(false) }}>Agree</button> */}
      </>

    )

  }



  return (
    <>
      <section className="ant-layout">

        {progressBar && (
          <div className="progress_bar_container">
            <Progress progressWidth={progressWidth} />
          </div>
        )}
        <div className="d-flex justify-content-center">
          {showResponseModal && <CustomModal modalBody={modalBody} headerTitle={"Manadate Cancellation"} modalFooter={modalFooter} modalToggle={isModalOpen} fnSetModalToggle={setIsModalOpen} />}


        </div>

        <div className="d-flex justify-content-center">
          {mandateScreen && <div className="col-lg-8">
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
                            label="Mandate Max amount *"
                            name="mandateMaxAmount"
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
                            name="fixedmaxAmount"
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
          </div>}


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
          {mandateSubmission && <AuthMandate handleResponseApi={handleResponseApi} />}

        </div>
      </section>
    </>
  );
};

export default MandateForm



