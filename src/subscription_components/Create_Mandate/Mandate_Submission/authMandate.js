import React, { useState } from "react";
import EmandateSummary from "./mandateDetails/emandateSummary";
import MandateSummary from "./mandateDetails/mandateSummary";
import PersonalDetails from "./mandateDetails/personalDetails";
import MandateBankDetails from "./mandateDetails/mandateBankDetails";
import "./mandateDetails/mandateSubmission.css";
import npciLogo from "../../../assets/images/npci.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormikController from "../../../_components/formik/FormikController";
import * as Yup from "yup";
import subAPIURL from "../../../config";
import { axiosInstance } from "../../../utilities/axiosInstance";
import "../Mandate_Submission/mandateDetails/mandateSubmission.css";

const AuthMandate = ({ updatedData }) => {
  const [mandateSubmissionResponse, setMandateSubmissionResponse] = useState();
  const [showLoader,setShowLoader] = useState(false)

  const initialValues = {
    term_condition: "",
    sourcing_code:
      updatedData?.authenticationMode === "Debit Card"
        ? "Debit Card"
        : updatedData?.authenticationMode === "Netbanking"
        ? "Netbanking"
        : "",
  };

  const validationSchema = Yup.object({
    term_condition: Yup.string().oneOf(
      ["true"],
      "You must accept all the terms & conditions"
    ),
    sourcing_code: Yup.string().required("Required").nullable(),
  });

  const referingMode = [
    { key: "Internet Banking", value: "Netbanking" },
    { key: "Debit Card", value: "Debit Card" },
  ];
  const [value, setValue] = useState("");

  function generateRandomNumber() {
    const min = 1000000000;
    const max = 9999999999;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const randomNumber = generateRandomNumber();

  // console.log("updatedData :  :", updatedData);

  const onSubmit = (values) => {
    // console.log(values)
    setShowLoader(false)

    const mandateSubmissionDetails = {
      clientCode: 3,
      clientRegistrationId: Number(randomNumber),
      consumerReferenceNumber: updatedData?.consumerReferenceNumber,
      mandatePurpose: updatedData?.mandatePurpose,
      payerUtilitityCode: "NACH00000000022341",
      mandateEndDate: updatedData?.untilCancelled === true ? null : updatedData?.mandateEndDate,
      payerName: updatedData?.payerName,
      mandateMaxAmount: "100.00",
      mandateType: "ONLINE",
      mandateStartDate: updatedData?.mandateStartDate,
      panNo: updatedData?.panNo ? updatedData?.panNo : "",
      mandateCategory: updatedData?.mandateCategory,
      payerAccountNumber: updatedData?.payerAccountNumber,
      payerAccountType: updatedData?.payerAccountType,
      payerBank: updatedData?.payerBank,
      payerEmail: updatedData?.payerEmail,
      payerMobile: `+91-${updatedData?.payerMobile}`,
      telePhone:  updatedData?.telePhone !== "" ? `+91-011-${updatedData?.telePhone}` : "",
      payerBankIfscCode: updatedData?.payerBankIfscCode,
      authenticationMode: values?.sourcing_code,
      frequency: updatedData?.frequency,
      requestType: updatedData?.requestType,
      npciPaymentBankCode: updatedData?.payerBank,
      schemeReferenceNumber: updatedData?.schemeReferenceNumber,
      untilCancelled: updatedData?.untilCancelled,
      userType: "merchant",
      emiamount: "",
    };

    axiosInstance
      .post(subAPIURL.mandateSubmit, mandateSubmissionDetails)
      .then((res) => {
        // console.log("API Submission Response", res);
        setMandateSubmissionResponse(res.data);
        setShowLoader(true)
        document.getElementById("mandate_form").submit();
      })
      .catch((error) => {
        console.log(error);
      });
  };


  return (
    <div className="row">
      <div className="col-lg-6 mand">
        <div id="accordion" style={{ marginTop: "50px" }}>
          <div
            className="card-header mandateCard"
            id="headingOne"
            style={{ borderRadius: "20px" }}
          >
            <h3 className="mb-0">
              <button
                className="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                E-Mandate Summary &nbsp;
                <i
                  className="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>

          <div
            id="collapseOne"
            className="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div className="card-body">
              <EmandateSummary updatedData={updatedData} />
            </div>
          </div>

          <div className="card-header mandateCard" id="headingTwo">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Mandate Summary &nbsp; &nbsp; &nbsp;
                <i
                  className="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div className="card-body">
              <MandateSummary updatedData={updatedData} />
            </div>
          </div>

          <div className="card-header mandateCard" id="headingThree">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Personal Details &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <i
                  className="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseThree"
            className="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordion"
          >
            <div className="card-body">
              <PersonalDetails updatedData={updatedData} />
            </div>
          </div>
          <div className="card-header mandateCard" id="headingFour">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Bank Details &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <i
                  className="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseFour"
            className="collapse"
            aria-labelledby="headingFour"
            data-parent="#accordion"
          >
            <div className="card-body">
              <MandateBankDetails updatedData={updatedData} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card">
          <div className="card-header text-center font-weight-bold">
            Mandate Authorization
          </div>
          <div className="card-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {(formik) => (
                <Form>
                  <div style={{ display: "inline-flex" }}>
                    <FormikController
                      control="radio"
                      name="sourcing_code"
                      options={referingMode}
                      className="form-check-input"
                    />

                    {formik.handleChange(
                      "sourcing_code",
                      setValue(formik?.values?.sourcing_point)
                    )}
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    1. I confirm that the contents have been carefully read,
                    understood and correct in all respects.
                  </div>
                  2. I agree for the debit of mandate processing charges by the
                  bank as per the latest schedule of charges of the bank.
                  <div>
                    <Field
                      type="checkbox"
                      name="term_condition"
                      className="mr-0"
                    />
                    3. I am authorizing the user entity to debit my account
                    based on the instructions as agreed.
                  </div>
                  <div>
                    4. I am authorized to cancel/amend this mandate
                    communicating the request to the user entity/corporate or
                    the bank where I have authorized the debit.
                  </div>
                  {
                    <ErrorMessage name="term_condition">
                      {(msg) => (
                        <p
                          className="abhitest"
                          style={{
                            color: "red",
                            position: "absolute",
                            zIndex: " 999",
                          }}
                        >
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                  }
                  <div className="container">
                    <div className="row mt-3">
                      <div className="col-sm">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="col-sm" style={{ display: "contents" }}>
                        <button
                          type="submit"
                          className="btn btn-success btn-sm text-white"
                          disabled={
                            !(formik.isValid && formik.dirty) ? true : false
                          }
                        >
                          {showLoader === true ? (
                            <>
                           
                              <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            &nbsp;  Please wait...
                            </>
                          ) : (
                            "Proceed"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="container">
              <div className="row mt-3">
                <div className="col-sm">
                  <h4 className="font-weight-bold text-decoration-underline text-center">
                    Disclaimer
                  </h4>
                </div>
                <div>
                  <p>
                    I further agree that SabPaisa Pvt. Ltd. is only a Third
                    Party Technology Service Provider and does not have any
                    liability towards the transaction mandate or any subsequent
                    action which arises. Any dispute/differences or issues to
                    the solely between the user entity Corporate or the bank and
                    me.
                  </p>
                </div>

                <img
                  src={npciLogo}
                  alt="SabPaisa"
                  title="SabPaisa"
                  className="rounded mx-auto d-block npciimg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12 d-none">
        {mandateSubmissionResponse?.merchantID && (
          <form
            id="mandate_form"
            method="post"
            action="https://enach.npci.org.in/onmags/sendRequest"
          >
            <input
              name="MerchantID"
              value={mandateSubmissionResponse?.merchantID}
            />
            <input
              name="MandateReqDoc"
              value={mandateSubmissionResponse?.mandateReqDoc}
            />
            <input name="BankID" value={mandateSubmissionResponse?.bankID} />
            <input
              name="CheckSumVal"
              value={mandateSubmissionResponse?.checkSumVal}
            />
            <input
              name="AuthMode"
              value={mandateSubmissionResponse?.authMode}
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthMandate;
