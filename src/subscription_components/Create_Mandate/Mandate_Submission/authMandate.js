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
import { useDispatch, useSelector } from "react-redux";
import { createMandateSubmission } from "../../../slices/subscription-slice/createMandateSlice";

const AuthMandate = ({ updatedData }) => {
  const dispatch = useDispatch();

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

  const onSubmit = (values) => {


    const mandadateSubmissionDetails = {
      clientCode: 3,
      clientRegistrationId: 4430200951,
      consumerReferenceNumber: "tertertertr22s",
      mandatePurpose: "Education fees",
      payerUtilitityCode: "NACH00000000022341",
      mandateEndDate: null,
      payerName: "Ansari",
      mandateMaxAmount: "11.00",
      mandateType: "ONLINE",
      mandateStartDate: "2023-04-06T16:40:00.000Z",
      panNo: "AKZPA3341F",
      mandateCategory: "E001",
      payerAccountNumber: "62300100005139",
      payerAccountType: "SAVINGS",
      payerBank: "BARB",
      payerEmail: "rahmat.ali@sabpaisa.in",
      payerMobile: "+91-8750212347",
      telePhone: "+91-011-50212347",
      payerBankIfscCode: "BARB0VJRAPH",
      authenticationMode: "Netbanking",
      frequency: "DAIL",
      requestType: "REGSTRN",
      npciPaymentBankCode: "BARB",
      schemeReferenceNumber: "ewrewrewr",
      untilCancelled: true,
      userType: "merchant",
      emiamount: "",
    }

    dispatch(
      createMandateSubmission(mandadateSubmissionDetails)
    ).then((res) => {
      console.log(res?.payload, "ressssssssssssss");
    });
  };

  const fetchFrequencyData = () =>  {
    console.group(updated?.authencationMode, "Data recovered from the schedule")
  }
  return (
    <div class="row">
      <div class="col-lg-6 mand">
        <div id="accordion" style={{ marginTop: "50px" }}>
          <div
            class="card-header mandateCard"
            id="headingOne"
            style={{ borderRadius: "20px" }}
          >
            <h3 class="mb-0">
              <button
                class="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                E-Mandate Summary &nbsp;
                <i
                  class="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>

          <div
            id="collapseOne"
            class="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordion"
          >
            <div class="card-body">
              <EmandateSummary updatedData={updatedData} />
            </div>
          </div>

          <div class="card-header mandateCard" id="headingTwo">
            <h3 class="mb-0">
              <button
                class="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                Mandate Summary &nbsp; &nbsp; &nbsp;
                <i
                  class="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseTwo"
            class="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordion"
          >
            <div class="card-body">
              <MandateSummary updatedData={updatedData} />
            </div>
          </div>

          <div class="card-header mandateCard" id="headingThree">
            <h3 class="mb-0">
              <button
                class="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Personal Details &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <i
                  class="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseThree"
            class="collapse"
            aria-labelledby="headingThree"
            data-parent="#accordion"
          >
            <div class="card-body">
              <PersonalDetails updatedData={updatedData} />
            </div>
          </div>
          <div class="card-header mandateCard" id="headingFour">
            <h3 class="mb-0">
              <button
                class="btn btn-link collapsed"
                data-toggle="collapse"
                data-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Bank Details &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <i
                  class="fa fa-chevron-down downMandate"
                  aria-hidden="true"
                ></i>
              </button>
            </h3>
          </div>
          <div
            id="collapseFour"
            class="collapse"
            aria-labelledby="headingFour"
            data-parent="#accordion"
          >
            <div class="card-body">
              <MandateBankDetails updatedData={updatedData} />
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header text-center font-weight-bold">
            Mandate Authorization
          </div>
          <div class="card-body">
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
                  <div class="container">
                    <div class="row mt-3">
                      <div class="col-sm">
                        <button
                          type="button"
                          class="btn btn-danger btn-sm text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div class="col-sm" style={{ display: "contents" }}>
                        <button
                          type="submit"
                          class="btn btn-success btn-sm text-white"
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div class="container">
              <div class="row mt-3">
                <div class="col-sm">
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
                  className="rounded mx-auto d-block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthMandate;
