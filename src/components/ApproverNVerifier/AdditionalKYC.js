import React, { useEffect } from "react";
import NavBar from "../dashboard/NavBar/NavBar";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { useState } from "react";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  authPanValidation,
  gstValidation,
  ifscValidation,
  getBankId,
  bankAccountVerification,
} from "../../slices/kycSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";

const AdditionalKYC = () => {
  const dispatch = useDispatch();
  const { kyc } = useSelector((state) => state);

  const KycList = kyc?.kycUserList;
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
  const bankAccountStatus = allTabsValidate?.BankDetails;

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

  //  For GSTIN INFORMATION

  const panNumber =
    BusinessDetailsStatus?.GSTINValidation?.pan === null
      ? ""
      : BusinessDetailsStatus?.GSTINValidation?.pan;

  const legalName =
    BusinessDetailsStatus?.GSTINValidation?.legalName === null
      ? ""
      : BusinessDetailsStatus?.GSTINValidation?.legalName;

  const state =
    BusinessDetailsStatus?.GSTINValidation?.state === null
      ? ""
      : BusinessDetailsStatus?.GSTINValidation?.state;

  const registered_date =
    BusinessDetailsStatus?.GSTINValidation?.register === null
      ? ""
      : BusinessDetailsStatus?.GSTINValidation?.register;

  const updated_date =
    BusinessDetailsStatus?.GSTINValidation?.updated === null
      ? ""
      : BusinessDetailsStatus?.GSTINValidation?.updated;

  const gstinValidity = BusinessDetailsStatus?.GSTINValidation?.valid;

  //  For GSTIN INFORMATION

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
  const [gstStatus, setGstStatus] = useState(false);
  const [bankStatus, setBankStatus] = useState(false);

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
    dispatch(
      authPanValidation({
        pan_number: values.pan_card,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        toast.success(res.payload.message);
        setPanStatus(res.payload.status);
        // console.log("PAN Data",res.payload)
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleSubmitForGSTIN = (values) => {
    dispatch(
      gstValidation({
        gst_number: values.gst_number,
        fetchFilings: false,
        fy: "2018-19",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        toast.success(res?.payload?.message);
        setGstStatus(res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleSubmitForBankAccount = (values) => {
    dispatch(
      bankAccountVerification({
        account_number: values.account_number,
        ifsc: values.ifsc_code,
      })
    ).then((res) => {
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        toast.success(res?.payload?.message);
        setBankStatus(res?.payload?.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Additional KYC</h1>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12 mb-4 bgcolor-">
                <div className="form-group col-lg-3 col-md-12 mt-2">
                  <label>Document Type</label>
                  <select
                    className="ant-input"
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
                      <div className="col-lg-5">
                        <FormikController
                          control="input"
                          type="text"
                          name="pan_card"
                          className="form-control"
                          placeholder="Enter your PAN"
                        />
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <button
                        type="submit"
                        className="btn float-lg-right btnbackground text-white"
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
                      <div className="col-lg-5">
                        <FormikController
                          control="input"
                          type="text"
                          name="gst_number"
                          className="form-control"
                          placeholder="Enter your GSTIN Number"
                        />
                      </div>
                    </div>
                    <div className="col-lg-5">
                      <button
                        type="submit"
                        className="btn float-lg-right btnbackground text-white"
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

            {selectedDocType === "3" ? (
              <Formik
                initialValues={initialValuesForBankAccount}
                validationSchema={validationSchemaForBankAccount}
                onSubmit={handleSubmitForBankAccount}
                enableReinitialize={true}
              >
                <Form className="form">
                  <div class="row">
                    <div class="col-lg-4">
                      <label class="col-form-label mt-0 p-2">
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

                    <div class="col-lg-4">
                      <label class="col-form-label mt-0 p-2">
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
                    <div className="col-lg-8">
                      <button
                        type="submit"
                        className="btn float-lg-right btnbackground text-white"
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

            {panStatus === true && selectedDocType === "1" ? (
              <div class="container" style={{ marginTop: "91px" }}>
                <h2 className="font-weight-bold">PAN Information</h2>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    Name : {accHolderName.length > 2 ? accHolderName : ""}
                  </div>
                  {/* <div class="col-lg-5">
          
            </div> */}
                  <div class="col-lg-4 font-weight-bold">
                    Valid :{" "}
                    {panValidity === true
                      ? "True"
                      : panValidity === false
                      ? "false"
                      : "Not Found"}
                  </div>
                  <div class="col-lg-5"></div>
                </div>
              </div>
            ) : (
              ""
            )}

            {gstStatus === true && selectedDocType === "2" ? (
              <div class="container" style={{ marginTop: "91px" }}>
                <h2 className="font-weight-bold">GSTIN Information</h2>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    Legal Name : {legalName ? legalName : ""}
                  </div>
                  {/* <div class="col-lg-5">
          
            </div> */}
                  <div class="col-lg-4 font-weight-bold">PAN : {panNumber}</div>
                </div>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    State : {state ? state : ""}
                  </div>
                  {/* <div class="col-lg-5">
          
            </div> */}
                  <div class="col-lg-4 font-weight-bold">
                    Registered Date : {registered_date ? registered_date : ""}
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    Updated Date : {updated_date ? updated_date : ""}
                  </div>
                  {/* <div class="col-lg-5">
          
            </div> */}
                  <div class="col-lg-4 font-weight-bold">
                    Valid :{" "}
                    {gstinValidity === true
                      ? "True"
                      : gstinValidity === false
                      ? "false"
                      : "Not Found"}
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {bankStatus === true && selectedDocType === "3" ? (
              <div class="container" style={{ marginTop: "32px" }}>
                <h2 className="font-weight-bold">Bank Account Information</h2>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    Full Name :{" "}
                    {bankAccountHolderName.length > 2
                      ? bankAccountHolderName
                      : ""}
                  </div>
                  {/* <div class="col-lg-5">
          
            </div> */}
                  <div class="col-lg-4 font-weight-bold">
                    Account Status : {accountStatus}
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-4 font-weight-bold">
                    Valid :{" "}
                    {accountValidity === true
                      ? "True"
                      : accountValidity === false
                      ? "false"
                      : "Not Found"}
                  </div>
                  {/* <div class="col-lg-5">
          
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
