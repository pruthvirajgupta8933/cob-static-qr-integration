import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";
import {
  authPanValidation,
  gstValidation,
  bankAccountVerification,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

const AdditionalKYC = () => {

  const initialValuesForBankAccount = {
    ifsc_code: "",
    account_number: "",
  };

  const regexGSTN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const IFSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const AccountNoRgex = /^[a-zA-Z0-9]{2,25}$/;


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
  const dispatch = useDispatch();
  const { kyc } = useSelector((state) => state);
  const [initialValuesForPAN, setInitialValuesForPAN] = useState({
    pan_card: "",
  });
  const [initialValuesForGSTIN, setInitialValuesForGSTIN] = useState({
    gst_number: "",

  });

  //   const handleSubmitForBankAccount = (values) => {
  //     setButtonDisable(true)
  //     dispatch(
  //       bankAccountVerification({
  //         account_number: values.account_number,
  //         ifsc: values.ifsc_code,
  //       })
  //     ).then((res) => {
  //       if (
  //         setButtonDisable(false),
  //         // setBankaccount(res?payload),
  //         setBankaccount(res?.payload),

  //         res?.meta?.requestStatus === "fulfilled" &&
  //         res?.payload?.status === true &&
  //         res?.payload?.valid === true
  //       ) {
  //         // toast.success(res?.payload?.message);
  //         setBankStatus(res?.payload?.status);
  //       } else {
  //         toast.error(res?.payload?.message);
  //       }
  //     });
  //   };

  const [initialValuesForIfsc, setInitialValuesForIfsc] = useState({ ifsc_code: "", })
  //   const[initialValuesForBankAccount,setInitialValuesForBankAccount]=useState({account_number:"",ifsc_code:""})

  console.log("initialValuesForBankAccount", initialValuesForBankAccount)

  const documentTypeList = [
    { documentType: "PAN", value: "1" },
    { documentType: "GSTIN", value: "2" },
    { documentType: "BANK ACCOUNT", value: "3" },
  ];




  // State variables
  const [selectedDocType, setSelectedDocType] = useState("");
  const [panStatus, setPanStatus] = useState(false);
  const [gstinData, setGstinData] = useState([]);
  const [bankAccount, setBankAccount] = useState([]);

  const [gstStatus, setGstStatus] = useState(false);
  const [bankStatus, setBankStatus] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPanInfo, setShowPanInfo] = useState([]);
  const objArray = Object.entries(gstinData);
  const panInfoData = Object.entries(showPanInfo);
  const bankAccountInfo = Object.entries(bankAccount);



  // Helper functions
  const handleChange = (event) => {
    setSelectedDocType(event.target.value);
  };

  const handlePanSubmit = (values) => {
    setButtonDisable(true);
    setIsLoading(true);
    dispatch(authPanValidation({ pan_number: values.pan_card })).then((res) => {
      setButtonDisable(false);
      setShowPanInfo(res?.payload);
      setIsLoading(false);
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setPanStatus(res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleGstinSubmit = (values) => {
    setIsLoading(true);
    dispatch(
      gstValidation({
        gst_number: values.gst_number,
        fetchFilings: false,
        fy: "2018-19",
      })
    ).then((res) => {
      setIsLoading(false);
      setGstinData(res?.payload);
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setGstStatus(res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleBankAccountSubmit = (values) => {
    setButtonDisable(true);
    dispatch(
      bankAccountVerification({
        account_number: values.account_number,
        ifsc: values.ifsc_code,
      })
    ).then((res) => {
      setButtonDisable(false);
      setBankAccount(res?.payload);
      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true &&
        res?.payload?.valid === true
      ) {
        setBankStatus(res?.payload?.status);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  // Reset status on document type change
  useEffect(() => {
    setPanStatus(false);
    setGstStatus(false);
    setBankStatus(false);
  }, [selectedDocType]);

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="ml-4">Additional KYC</h5>
          </div>
          <div className="container-fluid mt-5">
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
                      <option value={data.value} key={data.value}>
                        {data.documentType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {selectedDocType === "1" && (
              <div className="form">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-3">
                      <input
                        type="text"
                        name="pan_card"
                        className="form-control"
                        placeholder="Enter your PAN"
                        value={initialValuesForPAN.pan_card}
                        onChange={(e) =>
                          setInitialValuesForPAN({ pan_card: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="button"
                        className="btn cob-btn-primary text-white"
                        onClick={() => handlePanSubmit(initialValuesForPAN)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedDocType === "2" && (
              <div className="form">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-3">
                      <input
                        type="text"
                        name="gst_number"
                        className="form-control"
                        placeholder="Enter your GSTIN Number"
                        value={initialValuesForGSTIN.gst_number}
                        onChange={(e) =>
                          setInitialValuesForGSTIN({ gst_number: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-lg-3">
                      <button
                        type="button"
                        className="btn cob-btn-primary text-white"
                        onClick={() => handleGstinSubmit(initialValuesForGSTIN)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedDocType === "3" ? (
              <Formik
                initialValues={initialValuesForBankAccount}
                validationSchema={validationSchemaForBankAccount}
                onSubmit={handleBankAccountSubmit}
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
                    <div className="col-lg-3 mt-3">
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

            {/* Render additional details after verification */}
            {panStatus && selectedDocType === "1" && (
              <div className="container mt-5">
                <h5 className="">PAN Details</h5>
                <div className="row">
                  {panInfoData.map(([key, value]) => (
                    <div className="col-md-6 p-2 text-uppercase" key={key}>
                      <span className="font-weight-bold mb-1">
                        {key.replace("_", " ")}:
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

            {gstStatus && selectedDocType === "2" && (
              <div className="container mt-5">
                <h5 className="">GSTIN Information</h5>
                <div className="row">
                  {objArray.map(([key, value]) => (
                    <div className="col-md-6 p-2 text-uppercase" key={key}>
                      <span className="font-weight-bold mb-1">
                        {key.replace("_", " ")}:
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
            )}

            {bankStatus && selectedDocType === "3" && (
              <div className="container" style={{ marginTop: "32px" }}>
                <h5 className="font-weight-bold">Bank Account Information</h5>
                <div className="row">
                  {bankAccountInfo.map(([key, value]) => (
                    <div className="col-md-6 p-2 text-uppercase" key={key}>
                      <span className="font-weight-bold mb-1">
                        {key.replace("_", " ")}:
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
            )}
          </div>
        </div>
      </main>
    </section>
  );
};

  


export default AdditionalKYC;
