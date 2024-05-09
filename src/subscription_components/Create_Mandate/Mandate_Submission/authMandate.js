import React, { useEffect, useRef, useState } from "react";
import EmandateSummary from "./mandateDetails/emandateSummary";
import MandateSummary from "./mandateDetails/mandateSummary";
import PersonalDetails from "./mandateDetails/personalDetails";
import MandateBankDetails from "./mandateDetails/mandateBankDetails";
import "./mandateDetails/mandateSubmission.css";
import npciLogo from "../../../assets/images/npci.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import FormikController from "../../../_components/formik/FormikController";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import subAPIURL from "../../../config"
import { axiosInstance } from "../../../utilities/axiosInstance";
import "../Mandate_Submission/mandateDetails/mandateSubmission.css";
import CustomModal from "../../../_components/custom_modal";
import { useHistory } from "react-router-dom";
import API_URL from "../../../config";


const AuthMandate = () => {
  const [mandateSubmissionResponse, setMandateSubmissionResponse] = useState();
  const [showLoader, setShowLoader] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState({})
  const history = useHistory()
  const form = useRef()
  

  const { createMandate } = useSelector((state) => state);
  
  // console.log(createMandate.createMandate
  //   ?.mergedForm?.firstForm ,"this is createmen")


  // console.log("firstForm",firstForm)
  // console.log("secondForm",secondForm)
  // console.log("thirdForm",thirdForm)

  // console.log(createMandate?.createMandate?.formData)
  const { firstForm, secondForm, thirdForm } = createMandate?.createMandate?.formData;
  const mergedForm = {
    ...firstForm,
    ...secondForm,
    ...thirdForm
  };


  const initialValues = {
    term_condition: "",
    sourcing_code:
      mergedForm?.authenticationMode === "Debit Card"
        ? "Debit Card"
        : mergedForm?.authenticationMode === "Netbanking"
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

  // console.log("mergedForm :  :", mergedForm);

  const onSubmit = (values) => {
    // console.log(values)
    setShowLoader(false)

    const mandateSubmissionDetails = {
      clientCode: 3,
      clientRegistrationId: Number(randomNumber),
      consumerReferenceNumber: mergedForm?.consumerReferenceNumber,
      mandatePurpose: mergedForm?.mandatePurpose,
      payerUtilitityCode: "NACH00000000022341",
      mandateEndDate: mergedForm?.untilCancelled === true ? null : mergedForm?.mandateEndDate,
      payerName: mergedForm?.payerName,
      mandateMaxAmount: mergedForm?.mandateMaxAmount,
      mandateType: "ONLINE",
      mandateStartDate: mergedForm?.mandateStartDate,
      panNo: mergedForm?.panNo ? mergedForm?.panNo : "",
      mandateCategory: mergedForm?.mandateCategory,
      payerAccountNumber: mergedForm?.payerAccountNumber,
      payerAccountType: mergedForm?.payerAccountType,
      payerBank: mergedForm?.payerBank,
      payerEmail: mergedForm?.payerEmail,
      payerMobile: `+91-${mergedForm?.payerMobile}`,
      telePhone: mergedForm?.telePhone !== "" ? `+91-011-${mergedForm?.telePhone}` : "",
      payerBankIfscCode: mergedForm?.payerBankIfscCode,
      authenticationMode: values?.sourcing_code,
      frequency: mergedForm?.frequency,
      requestType: mergedForm?.requestType,
      npciPaymentBankCode: mergedForm?.payerBank,
      schemeReferenceNumber: mergedForm?.schemeReferenceNumber,
      untilCancelled: mergedForm?.untilCancelled,
      userType: "merchant",
      emiamount: mergedForm?.emiamount,
    };
    setPostData(mandateSubmissionDetails);
    
    // history.push("/")

    form.current.submit();
   
    // history.push("/dashboard/subscription/mandate-reg-response")

  };
 


  const pushToDashboard = () => {
    history.push("/dashboard")

  }

  const modalBody = () => {
    return (
      <>
        <div className="text-centre">
          <h5>Do you really want to Cancel this Mandate Request ?</h5>
        </div>
      </>
    )
  }


  const modalFooter = () => {
    return (
      <>
        <button type="button" className="btn btn-secondary text-white" onClick={pushToDashboard}>Disagree</button>
        <button type="button" className="btn approve text-white btn-sm" data-dismiss="modal" onClick={() => { setIsModalOpen(false) }}>Agree</button>
      </>

    )

  }

  return (
    <div className="row">
      <div className="col-lg-6">
        <CustomModal modalBody={modalBody} headerTitle={"Manadate Cancellation"} modalFooter={modalFooter} modalToggle={isModalOpen} fnSetModalToggle={setIsModalOpen} />
        <div id="accordion" style={{ marginTop: "50px" }}>
          <div
            className="card-header mandateCard"
            id="headingOne"
            style={{ borderRadius: "20px" }}
          >
            <h3>
              <button
                className="btn btn-link collapsed text-decoration-none"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                E-Mandate Summary
                <i
                  className="fa fa-chevron-down "
                 ariaHidden="true"
                ></i>
              </button>
            </h3>
          </div>

          <div
            id="collapseOne"
            className="collapse"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div className="card-body">
              <EmandateSummary mergedForm={mergedForm} />
            </div>
          </div>

          <div className="card-header mandateCard" id="headingTwo">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed text-decoration-none"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Mandate Summary
                <i
                  className="fa fa-chevron-down"
                 ariaHidden="true"
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
              <MandateSummary mergedForm={mergedForm} />
            </div>
          </div>

          <div className="card-header mandateCard" id="headingThree">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed text-decoration-none"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Personal Details
                <i
                  className="fa fa-chevron-down"
                 ariaHidden="true"
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
              <PersonalDetails mergedForm={mergedForm} />
            </div>
          </div>
          <div className="card-header mandateCard" id="headingFour">
            <h3 className="mb-0">
              <button
                className="btn btn-link collapsed text-decoration-none"
                data-toggle="collapse"
                data-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Bank Details
                <i
                  className="fa fa-chevron-down"
                 ariaHidden="true"
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
              <MandateBankDetails mergedForm={mergedForm} />
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
                  <div className="form-check form-check-inline">
                    <FormikController
                      control="radio"
                      name="sourcing_code"
                      options={referingMode}
                      className="form-check-input"
                    />

                    {formik.handleChange("sourcing_code", setValue(formik?.values?.sourcing_point))}
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
                    &nbsp;
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
                          onClick={() => { setIsModalOpen(true) }}
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
                                className="spinner-border spinner-border-sm"
                                role="status"
                               ariaHidden="true"
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

      <div>
        <form
          ref={form}
          id="mandateRegForm"
          action={API_URL.MANDATE_REGISTRATION}
          method="POST"
          name="mandateRegForm"
          // target="_blank"

        >
          <div style={{ display: "none" }}>
            <input name="authenticationMode" value={postData?.authenticationMode} />
            <input type="text" name="clientCode" value={postData?.clientCode} />
            <input type="text" name="clientRegistrationId" value={postData?.clientRegistrationId} />
            <input type="text" name="consumerReferenceNumber" value={postData?.consumerReferenceNumber} />
            <input type="text" name="emiamount" value={postData?.emiamount} />
            <input type="text" name="frequency" value={postData?.frequency} />
            <input type="text" name="mandateCategory" value={postData?.mandateCategory} />
            <input type="text" name="mandateEndDate" value={postData?.mandateEndDate} />
            <input type="text" name="mandateMaxAmount" value={postData?.mandateMaxAmount} />
            <input type="text" name="mandatePurpose" value={postData?.mandatePurpose} />
            <input type="text" name="mandateStartDate" value={postData?.mandateStartDate} />
            <input type="text" name="mandateType" value={postData?.mandateType} />
            <input type="text" name="npciPaymentBankCode" value={postData?.npciPaymentBankCode} />
            <input type="text" name="panNo" value={postData?.panNo} />
            <input type="text" name="payerAccountNumber" value={postData?.payerAccountNumber} />
            <input type="text" name="payerAccountType" value={postData?.payerAccountType} />
            <input type="text" name="payerBank" value={postData?.payerBank} />
            <input type="text" name="payerBankIfscCode" value={postData?.payerBankIfscCode} />
            <input type="text" name="payerEmail" value={postData?.payerEmail} />
            <input type="text" name="payerMobile" value={postData?.payerMobile} />
            <input type="text" name="payerName" value={postData?.payerName} />
            <input type="text" name="payerUtilitityCode" value={postData?.payerUtilitityCode} />
            <input type="text" name="requestType" value={postData?.requestType} />
            <input type="text" name="schemeReferenceNumber" value={postData?.schemeReferenceNumber} />
            <input type="text" name="telePhone" value={postData?.telePhone} />
            <input type="text" name="untilCancelled" value={postData?.untilCancelled} />
            <input type="text" name="userType" value={postData?.userType} />
            <input type="submit"  value="submit" />
           
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthMandate;
