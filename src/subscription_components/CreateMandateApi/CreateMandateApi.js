import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { axiosInstance } from "../../utilities/axiosInstance";
import subAPIURL from "../../config"
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom"
import { fetchFrequency, fetchMandatePurpose, fetchRequestType, } from "../../slices/subscription-slice/createMandateSlice";
import Yup from "../../_components/formik/Yup";
import { createMandateService } from "../../services/subscription-service/create.mandate.service";

const CreateMandateApi = () => {
  const initialValues = {
    consumerReferenceNumber: "",
    mandatePurpose: "",
    mandateEndDate: "",
    payerName: "",
    mandateMaxAmount: "",
    mandateStartDate: "",
    panNo: "",
    mandateCategory: "",
    payerAccountNumber: "",
    payerAccountType: "",
    payerBank: "",
    payerEmail: "",
    payerMobile: "",
    telePhone: "",
    payerBankIfscCode: "",
    authenticationMode: "",
    frequency: "",
    npciPaymentBankCode: "",
    schemeReferenceNumber: ""


  }
  const FORM_VALIDATION = Yup.object().shape({
    consumerReferenceNumber: Yup.string().required("Required"),
    mandatePurpose: Yup.string().required("Required"),
    mandateEndDate: Yup.string()
      .required("Required")
      .nullable(),

    payerName: Yup.string().required("Required"),
    mandateMaxAmount: Yup.string()
      .required('Required')
      .matches(/^[0-9]+$/, 'Only numbers are allowed'),
    mandateStartDate: Yup.string().required("Required"),

    mandateCategory: Yup.string().required("Required"),
    payerAccountNumber: Yup.string().required("Required"),
    payerAccountType: Yup.string().required("Required"),
    payerBank: Yup.string().required("Required"),
    payerEmail: Yup.string().required("Required"),
    payerMobile: Yup.string().required("Required"),

    payerBankIfscCode: Yup.string().required("Required"),
    authenticationMode: Yup.string().required("Required"),
    frequency: Yup.string().required("Required"),
    schemeReferenceNumber: Yup.string().required("Required"),
    npciPaymentBankCode: Yup.string().required("Required")

  });

  const [mandatePurpose, setMandatePurpose] = useState([])
  // const [mandateRequestType, setMandateRequestType] = useState([])

  const [mandateCatogoryData, setMandatecatogoryData] = useState([])
  const [manDateFrequency, setMandateFrequency] = useState([])
  const [netBankingBankList, setNetbankingBankList] = useState([])
  const [debitCardBankList, setDebitCardBankList] = useState([])
  const [selectedMode, setSelectedMode] = useState("Select");
  const now = new Date();
  const dispatch = useDispatch();
  const location = useLocation();
  const { search } = location;
  const mendateRegId = search.split("?mendateRegId=")[1];
  console.log("mendateRegId", mendateRegId)


  const handleResponseApi = () => {
    if (mendateRegId) {
      axiosInstance
        .post(subAPIURL.CREATE_MANDATE_API_RESPONSE + mendateRegId)
        .then((response) => {
          console.log("response", response)
          if (response.status === 200) {

          }
          // console.log(response.data,"this is response");
        })
    }


  };
  useEffect(() => {
    handleResponseApi()
  }, [mendateRegId])


  useEffect(() => {
    fetchManDatePurpose();
    fetchManDateFrequency();
    fetchMandateRequestType();
  }, []);

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
      await dispatch(fetchRequestType());
      // const data = convertToFormikSelectJson("code", "description", resp.payload?.data);
      // setMandateRequestType(data);
    } catch (err) {
      // console.log(err);
    }
  };

  function generateRandomNumber() {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const handleSubmit = async (values) => {
    try {
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
      const endIsoDate = endDateObj.toISOString();

      const formData = new FormData();
      formData.append("consumerReferenceNumber", values.consumerReferenceNumber ?? generateRandomNumber());
      formData.append("mandatePurpose", getDescriptionById(values.mandateCategory).toString());
      formData.append("mandateEndDate", endIsoDate);
      formData.append("mandateMaxAmount", parseFloat(values.mandateMaxAmount).toFixed(2) ?? '0.00');
      formData.append("mandateStartDate", startIsoDate);
      formData.append("schemeReferenceNumber", values.schemeReferenceNumber);
      formData.append("npciPaymentBankCode", values.npciPaymentBankCode);
      formData.append("frequency", values.frequency);
      formData.append("mandateCategory", values.mandateCategory);
      formData.append("payerName", values.payerName);
      formData.append("panNo", values.panNo);
      formData.append("payerAccountNumber", values.payerAccountNumber);
      formData.append("payerAccountType", values.payerAccountType);
      formData.append("payerBank", values.payerBank);
      formData.append("payerEmail", values.payerEmail);
      formData.append("payerMobile", `+91-${values?.payerMobile}`);
      formData.append("telePhone", values.telePhone);
      formData.append("payerBankIfscCode", values.payerBankIfscCode);
      formData.append("authenticationMode", values.authenticationMode);

      const response = await createMandateService.createMandateApi(formData);

      if (response && response.headers && response.headers["content-type"].includes("text/html")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");
        const form = doc.querySelector("form");

        if (form) {
          const newForm = document.createElement("form");
          newForm.action = form.action;
          newForm.method = form.method;

          Array.from(form.elements).forEach((input) => {
            const newInput = document.createElement("input");
            newInput.type = "hidden";
            newInput.name = input.name;
            newInput.value = input.value;
            newForm.appendChild(newInput);
          });

          document.body.appendChild(newForm);
          newForm.submit();
        }
      } else {
        console.log("Unexpected response format or no headers found:", response?.data);
      }
    } catch (err) {
      console.error("Error occurred while submitting the form:", err);
    }
  };

  const referingMode = [
    { key: "", value: "Select" },
    { key: "Netbanking", value: "Netbanking" },
    { key: "Debit Card", value: "Debit Card" },
  ];

  const fetchNetbankingBankList = async () => {
    try {
      const resp = await createMandateService.netBannkingBankList();


      const data = convertToFormikSelectJson("code", "description", resp.data);
      setNetbankingBankList(data);
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchdebitCardbankList = async () => {
    try {
      const resp = await createMandateService.debitCardBankList();


      const data = convertToFormikSelectJson("code", "description", resp.data);
      setDebitCardBankList(data);
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    if (selectedMode === "Netbanking") {
      fetchNetbankingBankList();
    } else if (selectedMode === "Debit Card") {
      fetchdebitCardbankList();
    }
  }, [selectedMode]);


  return (
    <>
      <section className="ant-layout">
        <div >
          <h5 className="">Create Mandate API</h5>
        </div>
        <div className="d-flex justify-content-center mt-5">
          <div className="col-lg-8">
            <Formik
              initialValues={initialValues}
              validationSchema={FORM_VALIDATION}
              enableReinitialize={true}
              onSubmit={(values) => {
                handleSubmit(values)

              }}
            >
              {({ values, setFieldValue }) => (
                <Form id="createMandateForm">
                  <div>
                    <div className="row">
                      <div className="col-lg-6 form-group">

                        <FormikController
                          control="input"
                          label="Payer Name *"
                          name="payerName"
                          className="form-control rounded-0"
                          placeholder="Enter Payer Name"
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
                          label="Consumer Refrence Number *"
                          name="consumerReferenceNumber"
                          className="form-control rounded-0"
                          placeholder="Enter Refrence Number"
                        />
                      </div>
                      <div className="col-lg-6 form-group ">
                        <FormikController
                          control="input"
                          label="Mandate Category *"
                          name="mandatePurpose"
                          className="form-control rounded-0"
                          placeholder="Enter Mandate Category "
                        />
                      </div>
                    </div>


                    <div className="row">
                      <div className="col-lg-6 form-group">

                        <FormikController
                          control="input"
                          label="Payer Email *"
                          name="payerEmail"
                          className="form-control rounded-0"
                          placeholder="Enter Payer Email"
                        />
                      </div>
                      <div className="col-lg-6 form-group ">
                        <FormikController
                          control="input"
                          label="Payer Mobile *"
                          name="payerMobile"
                          className="form-control rounded-0"
                          placeholder="Enter Payer Mobile"
                        />
                      </div>
                    </div>


                    <div className="row">
                      <div className="col-lg-6 form-group">

                        <FormikController
                          control="input"
                          label="Npci Payment Code *"
                          name="npciPaymentBankCode"
                          className="form-control rounded-0"
                          placeholder="Enter Npci Payment Code"
                        />
                      </div>
                      <div className="col-lg-6 form-group ">
                        <FormikController
                          control="input"
                          label="Scheme Reference Number *"
                          name="schemeReferenceNumber"
                          className="form-control rounded-0"
                          placeholder="Enter Scheme Reference Number"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 form-group">

                        <FormikController
                          control="input"
                          label="TelePhone (Optional)"
                          name="telePhone"
                          className="form-control rounded-0"
                          placeholder="Enter Telephone"
                        />
                      </div>
                      <div className="col-lg-6 form-group ">
                        <FormikController
                          control="input"
                          label="PAN (Optional)"
                          name="panNo"
                          className="form-control rounded-0"
                          placeholder="Enter PAN"
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
                          placeholder="Enter Mandate Max Amount"
                        />
                      </div>
                      <div className="col-lg-6 form-group">
                        <FormikController
                          control="select"
                          label="Frequency *"
                          name="frequency"
                          className="form-control form-select rounded-0 mt-0"
                          options={manDateFrequency}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 form-group">
                        <FormikController
                          control="input"
                          label="IFSC Code *"
                          name="payerBankIfscCode"
                          className="form-control rounded-0 mt-0"
                          placeholder="Enter IFSC Code"

                        />
                      </div>
                      <div className="col-lg-6 form-group">
                        <FormikController
                          control="input"
                          label="Account Number*"
                          name="payerAccountNumber"
                          className="form-control rounded-0"
                          placeholder="Enter Account Number"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 ">
                        <FormikController
                          control="select"
                          name="authenticationMode"
                          options={referingMode}
                          className="form-control form-select rounded-0 mt-0"
                          label="Authentication Mode *"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setFieldValue("authenticationMode", selectedValue);
                            setSelectedMode(selectedValue);

                            if (selectedValue === "Netbanking") {
                              fetchNetbankingBankList();
                              setNetbankingBankList([]); // Reset the dropdown if needed
                            } else if (selectedValue === "Debit Card") {
                              fetchdebitCardbankList();
                              setDebitCardBankList([]); // Reset the dropdown if needed
                            }
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormikController
                          control="select"
                          label="Bank *"
                          name="payerBank"
                          className="form-control form-select rounded-0 mt-0"
                          options={values.authenticationMode === "Netbanking" ? netBankingBankList : debitCardBankList}
                        />
                      </div>

                      <div className="col-lg-3">
                        <FormikController
                          control="input"
                          label="Account Type *"
                          name="payerAccountType"
                          className="form-control rounded-0"
                          placeholder="Enter Account Type"
                        />
                      </div>

                    </div>

                    <div className="row mt-3">
                      <div className="col-lg-6">
                        <FormikController
                          control="input"
                          type="date"
                          label="Start Date *"
                          name="mandateStartDate"
                          className="form-control rounded-0"
                        />
                      </div>

                      <div className="col-lg-6">
                        <FormikController
                          control="input"
                          type="date"
                          label="End Date *"
                          name="mandateEndDate"
                          className="form-control rounded-0"

                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button className="btn bttn cob-btn-primary mt-3 mb-3" type="submit">
                        Submit
                      </button>
                    </div>

                  </div>

                </Form>
              )}
            </Formik>
          </div>



        </div>
      </section>
    </>
  );
};

export default CreateMandateApi







