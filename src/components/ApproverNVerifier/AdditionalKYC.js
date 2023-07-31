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
  udyamRegistration
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
  const[intialValuesForRegistration,setIntialValuesForRegistration]=useState({
    reg_number:""
  })

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
    {documentType: "UDYAM",value:"4"}
  ];




  // State variables
  const [selectedDocType, setSelectedDocType] = useState("");
  const [panStatus, setPanStatus] = useState(false);
  const[udyamRegstatus,setUdyamRegstatus]=useState(false)
  const [gstinData, setGstinData] = useState([]);
  const[udyamRegistrationData,setUdyamRegistrationData]=useState({})
  const [bankAccount, setBankAccount] = useState([]);

  const [gstStatus, setGstStatus] = useState(false);
  const [bankStatus, setBankStatus] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPanInfo, setShowPanInfo] = useState([]);
  const objArray = Object.entries(gstinData);
  const panInfoData = Object.entries(showPanInfo);
  const bankAccountInfo = Object.entries(bankAccount);
  console.log("udyamRegistrationData",udyamRegistrationData.nic_codes
  )

  const nicCodes = udyamRegistrationData?.nic_codes ?? [];
  console.log(udyamRegistrationData.classifications
    ,"classifications")

 const classifications=udyamRegistrationData.classifications




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


  const handleReginSubmit = (values) => {
    setIsLoading(true);
    dispatch(
      udyamRegistration({
        reg_number: values.reg_number,
        
      })
    ).then((res) => {
      
      setIsLoading(false);
      setUdyamRegistrationData(res?.payload);
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setUdyamRegstatus(res.payload.status);
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
    setUdyamRegstatus(false)
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
        <div className="col-lg-3 col-md-4">
          <div className="form-group">
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
        <div className="col-lg-9 col-md-8 mt-4">
          {selectedDocType === "1" && (
            <div className="form-inline">
              <div className="form-group">
                <input
                  type="text"
                  name="pan_card"
                  className="form-control mr-4"
                  placeholder="Enter your PAN"
                  value={initialValuesForPAN.pan_card}
                  onChange={(e) =>
                    setInitialValuesForPAN({ pan_card: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
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
          )}

          {selectedDocType === "2" && (
            <div className="form-inline">
              <div className="form-group">
                <input
                  type="text"
                  name="gst_number"
                  className="form-control mr-4"
                  placeholder="Enter your GSTIN Number"
                  value={initialValuesForGSTIN.gst_number}
                  onChange={(e) =>
                    setInitialValuesForGSTIN({ gst_number: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
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
          )}

          {selectedDocType === "3" ? (
            <Formik
              initialValues={initialValuesForBankAccount}
              // validationSchema={validationSchemaForBankAccount}
              onSubmit={handleBankAccountSubmit}
              enableReinitialize={true}
            >
              <Form className="form-inline">
                <div className="form-group">
                  
                  <FormikController
                    control="input"
                    type="text"
                    name="ifsc_code"
                    className="form-control mr-4 mb-3"
                    placeholder="Enter your IFSC Code"
                  />
                </div>

                <div className="form-group">
                  <FormikController
                    control="input"
                    type="text"
                    name="account_number"
                    className="form-control mr-4 mb-3"
                    placeholder="Enter your Account Number"
                  />
                </div>
                <div className="form-group mb-3">
                  
                  <button
                    type="submit"
                    className="btn cob-btn-primary text-white"
                    disabled={buttonDisable}
                  >
                    Verify
                  </button>
                </div>
              </Form>
            </Formik>
          ) : (
            ""
          )}

          {selectedDocType === "4" && (
            <div className="form-inline">
              <div className="form-group">
                <input
                  type="text"
                  name="reg_number"
                  className="form-control mr-4"
                  placeholder="Enter your Registration Number"
                  value={intialValuesForRegistration.reg_number}
                  onChange={(e) =>
                    setIntialValuesForRegistration({ reg_number: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn cob-btn-primary text-white"
                  onClick={() => handleReginSubmit(intialValuesForRegistration)}
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

{udyamRegstatus && selectedDocType === "4" && (
  <div className="container "  style={{ marginTop: "32px" }}>
    <div className="row">
      <div className="col-md-12">
        {/* <h6 className="font-weight-bold mt-3">Enterprise Type</h6> */}
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              
              <th>Name of Enterprise</th>
              <th>Organisation Type</th>
              <th>Date of Incorporation</th>
              <th>Udyam Registration Number</th>

            </tr>
          </thead>
          <tbody>
          {/* {Array.isArray(udyamRegistrationData) && udyamRegistrationData.map((data, index) => ( */}
  <tr >
    
    <td>{udyamRegistrationData?.entity}</td>
    <td>{udyamRegistrationData?.type}</td>
    <td>{udyamRegistrationData?.incorporated_date}</td>
    <td>{udyamRegistrationData?.reg_number}</td>
  </tr>
{/* ))} */}
          </tbody>
        </table>
      </div>
    </div>





    <div className="row mt-4">
      <div className="col-md-9">
        <h6 className="font-weight-bold">Official address of Enterprise</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Block</th>
              <th>Building</th>
              <th>City</th>
              <th>District</th>
              <th>Masked Email</th>
              <th>Masked Mobile</th>
              <th>Road</th>
              <th>State</th>
              <th>Unit Number</th>
              <th>Village Or Town</th>
              <th>Zip</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{udyamRegistrationData?.official_address?.block}</td>
              <td>{udyamRegistrationData?.official_address?.building}</td>
              <td>{udyamRegistrationData?.official_address?.city}</td>
              <td>{udyamRegistrationData?.official_address?.district}</td>
              <td>{udyamRegistrationData?.official_address?.maskedEmail}</td>
              <td>{udyamRegistrationData?.official_address?.maskedMobile}</td>
              <td>{udyamRegistrationData?.official_address?.road}</td>
              <td>{udyamRegistrationData?.official_address?.state}</td>
              <td>{udyamRegistrationData?.official_address?.unitNumber}</td>
              <td>{udyamRegistrationData?.official_address?.villageOrTown}</td>
              <td>{udyamRegistrationData?.official_address?.zip}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="row mt-2">
      <div className="col-md-12">
        <h6 className="font-weight-bold mt-3">Enterprise Type</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Classification Year</th>
              <th>Enterprise Type</th>
              <th>Classification Date</th>
            </tr>
          </thead>
          <tbody>
            {classifications?.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data?.year}</td>
                <td>{data?.type}</td>
                <td>{data?.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="row mt-2">
      <div className="col-md-12">
        <h6 className="font-weight-bold mt-3">National Industry Classification Code(S)</h6>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.NO</th>
              <th>Nic 2 Digit</th>
              <th>Nic 4 Digit</th>
              <th>Nic 5 Digit</th>
              <th>Activity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {nicCodes?.map((data, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data?.digit2}</td>
                <td>{data?.digit4}</td>
                <td>{data?.digit5}</td>
                <td>{data?.activity}</td>
                <td>{data?.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
</div>
       </div>
       </div>
       </div>
      </main>
    </section>
  );
};

  


export default AdditionalKYC;
