import React, { useEffect } from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import { useState } from "react";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import { camelCase } from 'lodash';
import * as Yup from "yup";
import {
  authPanValidation,
  gstValidation,
  bankAccountVerification,
} from "../../slices/kycSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

// import "./kyc-style.css";

const AdditionalKYC = () => {
  const dispatch = useDispatch();
  const { kyc } = useSelector((state) => state);

  const { allTabsValidate } = kyc;

  const documentTypeList = [
    { documentType: "PAN", value: "1" },
    { documentType: "GSTIN", value: "2" },
    { documentType: "BANK ACCOUNT", value: "3" },
  ];

  const initialValuesForPAN = {
    pan_card: "",
  };

  const initialValuesForGSTIN = {
    gst_number: "",
    fetchFilings: false,
    fy: "2018-19",
  };

  const initialValuesForBankAccount = {
    ifsc_code: "",
    account_number: "",
  };

  const regexGSTN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;

  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus;
  // const bankAccountStatus = allTabsValidate?.BankDetails;

  //  For PAN INFORMATION
  const panFirstName =
    BusinessDetailsStatus?.AuthPanValidation?.first_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation?.first_name;

  const panLastName =
    BusinessDetailsStatus?.AuthPanValidation?.last_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation?.last_name;

  const panValidity = BusinessDetailsStatus?.AuthPanValidation?.valid;

  let accHolderName = `${panFirstName} ${panLastName}`;

  //  For PAN INFORMATION



  // For Bank Account Info

  const AccfirstName =
    allTabsValidate?.BankDetails?.accountValidation?.first_name;
  const AcclastName =
    allTabsValidate?.BankDetails?.accountValidation?.last_name;

  let bankAccountHolderName = `${AccfirstName} ${AcclastName}`;

  const accountStatus =
    allTabsValidate?.BankDetails?.accountValidation?.account_status;

  const accountValidity =
    allTabsValidate?.BankDetails?.accountValidation?.valid;

  // For Bank Account Info

  const validationSchemaForPAN = Yup.object({
    pan_card: Yup.string()
      .trim()
      .matches(reqexPAN, "PAN number is Invalid")
      .required("Required")
      .nullable(),
  });

  const validationSchemaForBankAccount = Yup.object({
    ifsc_code: Yup.string()
      .trim()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(IFSCRegex, "Your IFSC Number is Invalid")
      .min(6, "Username must be at least 6 characters")
      .max(20, "Username must not exceed 20 characters")
      .required("Required"),
    account_number: Yup.string()
      .trim()
      .matches(AccountNoRgex, "Your Account Number is Invalid")
      .required("Required")
      .nullable(),


  });

  const validationSchemaForGSTIN = Yup.object({
    gst_number: Yup.string()
      .trim()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(regexGSTN, "GSTIN Number is Invalid")
      .required("Required")
      .nullable(),
  });

  const [selectedDocType, setSelectedDocType] = useState("");
  const [panStatus, setPanStatus] = useState(false);
  const [gstinData, setGstinData] = useState([])

  const [gstStatus, setGstStatus] = useState(false);
  const [bankStatus, setBankStatus] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [showPanInfo, setShowPanInfo] = useState([])

  const objArray = Object.entries(gstinData);
  const panInfodata = Object.entries(showPanInfo);








  const handleChange = (event) => {
    setSelectedDocType(event.target.value);
  };

  // console.log("Pan First Name   =====> ", accHolderName.length > 2
  // ? accHolderName : "")

  // console.log("PAN VALIDITY",panValidity)

  useEffect(() => {
    setPanStatus(false);
    setGstStatus(false);
    setBankStatus(false);
  }, [selectedDocType]);

  const handleSubmitForPAN = (values) => {
    setButtonDisable(true)
    setIsLoading(true)
    dispatch(
      authPanValidation({
        pan_number: values.pan_card,
      })
    ).then((res) => {
      if (
        setButtonDisable(false),
        setShowPanInfo(res?.payload),
        setIsLoading(false),
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true

      ) {
        // toast.success(res.payload.message);
        setPanStatus(res.payload.status);
        // console.log("PAN Data",res.payload)
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleSubmitForGSTIN = (values) => {
    setIsLoading(true)

    dispatch(
      gstValidation({
        gst_number: values.gst_number,
        fetchFilings: false,
        fy: "2018-19",
      })
    ).then((res) => {


      if (

        setIsLoading(false),
        setGstinData(res?.payload),
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        // toast.success(res?.payload?.message);
        setGstStatus(res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleSubmitForBankAccount = (values) => {
    setButtonDisable(true)
    dispatch(
      bankAccountVerification({
        account_number: values.account_number,
        ifsc: values.ifsc_code,
      })
    ).then((res) => {
      if (
        setButtonDisable(false),
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        // toast.success(res?.payload?.message);
        setBankStatus(res?.payload?.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Additional KYC</h5>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-group col-lg-3 col-md-12">
                  <label className="form-label">Document Type</label>
                  <select
                    className="form-select"
                    documentType={selectedDocType}
                    onChange={handleChange}
                  >
                    <option value="Select a Document">Select a Document</option>
                    {documentTypeList.map((data) => (
                      <option value={data.value}>{data.documentType}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {selectedDocType === "1" ? (
              <Formik
                initialValues={initialValuesForPAN}
                validationSchema={validationSchemaForPAN}
                onSubmit={handleSubmitForPAN}
                enableReinitialize={true}
              >
                <Form className="form">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-3">
                        <FormikController
                          control="input"
                          type="text"
                          name="pan_card"
                          className="form-control"
                          placeholder="Enter your PAN"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 mr-2">
                        <button
                          type="submit"
                          // className={`verify-btn cob-btn-primary text-white ${isLoading ? 'spinner-grow spinner-grow-sm text-light mr-1' : ''}`}
                          className="btn cob-btn-primary text-white"
                        // disabled={buttonDisable}
                        >
                          {/* {isLoading ? 'Loading...' : 'Verify'} */}
                          {
                            isLoading &&
                            <>
                              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                            </>
                          }
                          Verify
                        </button>
                      </div>
                    </div>

                  </div>
                </Form>
              </Formik>
            ) : (
              ""
            )}

            {selectedDocType === "2" ? (
              <Formik
                initialValues={initialValuesForGSTIN}
                validationSchema={validationSchemaForGSTIN}
                onSubmit={handleSubmitForGSTIN}
                enableReinitialize={true}
              >
                <Form className="form">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-3">
                        <FormikController
                          control="input"
                          type="text"
                          name="gst_number"
                          className="form-control"
                          placeholder="Enter your GSTIN Number"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-3 mr-5">
                        <button
                          type="submit"
                          className="btn cob-btn-primary  text-white"
                          disabled={buttonDisable}
                        >
                          {
                            isLoading &&
                            <>
                              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                            </>
                          }
                          Verify
                        </button>
                      </div>
                    </div>

                  </div>
                </Form>
              </Formik>
            ) : (
              ""
            )}

            {selectedDocType === "3" ? (
              <Formik
                initialValues={initialValuesForBankAccount}
                validationSchema={validationSchemaForBankAccount}
                onSubmit={handleSubmitForBankAccount}
                enableReinitialize={true}
              >
                <Form className="form">
                  <div className="row">
                    <div className="col-lg-3 ml-3">
                      <label className="col-form-label mt-0 p-2 ml-1">
                        IFSC Code<span style={{ color: "red" }}>*</span>
                      </label>

                      <FormikController
                        control="input"
                        type="text"
                        name="ifsc_code"
                        className="form-control"
                        placeholder="Enter your IFSC Code"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label className="col-form-label mt-0 p-2">
                        Business Account Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>

                      <FormikController
                        control="input"
                        type="text"
                        name="account_number"
                        className="form-control"
                        placeholder="Enter your Account Number"
                      />
                    </div>
                    <div className="col-lg-3 mt-4">
                      <p></p>
                      <button
                        type="submit"
                        className="btn cob-btn-primary text-white"
                        disabled={buttonDisable}
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                </Form>
              </Formik>
            ) : (
              ""
            )}

            {panStatus === true && selectedDocType === "1" && (
              <div class="container mt-5">
                <h5 class="">PAN Details</h5>
                <div class="row">
                  {panInfodata.map(([key, value]) => (
                    <div class="col-md-6 p-2 text-uppercase" key={key}>
                      <span class="font-weight-bold mb-1">
                        {key.replace('_', ' ')}:
                      </span>
                      {typeof value === "boolean" ? (
                        <span>{value.toString()}</span>
                      ) : (
                        <span>&nbsp; {value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

        
            {gstStatus === true && selectedDocType === "2" &&
              <div class="container mt-5">
                <h5 class="">GSTIN Information</h5>
                <div class="row">
                  {objArray.map(([key, value]) => (
                    <div class="col-md-6 p-2 text-uppercase" key={key}>
                      <span class="font-weight-bold mb-1">
                        {key.replace('_', ' ')}:
                      </span>
                      {typeof value === "boolean" ? (
                        <span>{value.toString()}</span>
                      ) : (
                        <span>&nbsp;{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            }

            {bankStatus === true && selectedDocType === "3" ? (
              <div className="container" style={{ marginTop: "32px" }}>
                <h5 className="font-weight-bold">Bank Account Information</h5>
                <div className="row">
                  <div className="col-lg-4 font-weight-bold">
                    Full Name :{" "}
                    {bankAccountHolderName.length > 2
                      ? bankAccountHolderName
                      : ""}
                  </div>
                  {/* <div className="col-lg-5">
          
            </div> */}
                  <div className="col-lg-4 font-weight-bold">
                    Account Status : {accountStatus}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4 font-weight-bold">
                    Valid :{" "}
                    {accountValidity === true
                      ? "True"
                      : accountValidity === false
                        ? "false"
                        : "Not Found"}
                  </div>
                  {/* <div className="col-lg-5">
          
            </div> */}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

export default AdditionalKYC;
