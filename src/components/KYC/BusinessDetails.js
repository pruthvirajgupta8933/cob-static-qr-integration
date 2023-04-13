import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Yup from "../../_components/formik/Yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import {
  businessOverviewState,
  saveMerchantInfo,
  verifyKycEachTab,
  panValidation,
  authPanValidation,
  gstValidation,
  kycUserList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { isNull, values } from "lodash";

function BusinessDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const { role, kycid } = props;

  const regexGSTN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const reqexPinCode = /^[1-9][0-9]{5}$/;

  const { auth, kyc } = useSelector((state) => state);

  const { user } = auth;
  const { allTabsValidate, KycTabStatusStore } = kyc;
  const VerifyKycStatus = KycTabStatusStore?.merchant_info_status;

  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus;
  const KycList = kyc?.kycUserList;

  // console.log("BusinessDetailsStatus",BusinessDetailsStatus)
  const { loginId } = user;
  const [BusinessOverview, setBusinessOverview] = useState([]);
  const [gstin, setGstin] = useState("");
  // const [fieldValue, setFieldValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");
  const [disable, setIsDisable] = useState(false);

  const [latestCompanyNameFromResp, setLatestCompanyNameFromResp] = useState("")
  const [bussinessPanFromGST, setBussinessPanFromGST] = useState("")
  const [gstNumberByState, setGstNumberByState] = useState("")
  const [registerWithGstState, setRegisterWithGstState] = useState('true')



  const dispatch = useDispatch();

  const notValid = useSelector(
    (state) =>
      state.kyc.allTabsValidate.BusinessDetailsStatus.AuthPanValidation.message
  );
  const busiFirstName = BusinessDetailsStatus?.PanValidation?.first_name === null ? "" : BusinessDetailsStatus?.PanValidation?.first_name;

  const busiLastName = BusinessDetailsStatus?.PanValidation?.last_name === null ? "" : BusinessDetailsStatus?.PanValidation?.last_name;

  const busiAuthFirstName = BusinessDetailsStatus.AuthPanValidation.first_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.first_name;

  const busiAuthLastName = BusinessDetailsStatus?.AuthPanValidation?.last_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.last_name;

  let businessName = `${busiFirstName} ${busiLastName}`;
  let businessAuthName = `${busiAuthFirstName !== undefined ? busiAuthFirstName : ""
    } ${busiAuthLastName !== undefined ? busiAuthLastName : ""}`;

  const trimFullName = (strOne, strTwo)=>{
      let fullStr = isNull(strOne) ? "" : strOne
      fullStr += isNull(strTwo) ? "" : strTwo
      return fullStr
  }

  const panValidate = (values, key, setFieldValue) => {

    dispatch(
      panValidation({
        pan_number: values,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {

        const fullNameByPan = trimFullName(res?.payload?.first_name, res?.payload?.last_name)
        // setFieldValue(key, fullNameByPan)
        setLatestCompanyNameFromResp(fullNameByPan)
        setBussinessPanFromGST(values)
        setGstNumberByState("")
        toast.success(res?.payload?.message);
        
      } else {
        setFieldValue(key, "")
        toast.error(res?.payload?.message);
      }
    });
    setRegisterWithGstState('false')
  };


  const gstinValidate = (values, key, setFieldValue) => {
    dispatch(
      gstValidation({
        gst_number: values,
        fetchFilings: false,
        fy: "2018-19",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        const fullNameByAuthPan = trimFullName(res?.payload?.trade_name, "")
        // console.log(key, fullNameByAuthPan)
        // setFieldValue(key, fullNameByAuthPan)
        setLatestCompanyNameFromResp(fullNameByAuthPan)
        setBussinessPanFromGST(res?.payload?.pan)
        setGstNumberByState(values)

        toast.success(res?.payload?.message);
      } else {
        setFieldValue(key, "")

        toast.error(res?.payload?.message);
      }
    });
    setRegisterWithGstState('true')
  };


  const authValidation = (values) => {
    dispatch(
      authPanValidation({
        pan_number: values,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        toast.success(res.payload.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const gstinData = BusinessDetailsStatus?.GSTINValidation;

  const radioBtnOptions = [
    { "value": true, "key": "Yes" },
    { "value": false, "key": "No" },
  ]

  // get company name from GST and Business pan 
  let companyNameFromResponse = ""
  if(gstinData?.trade_name?.length > 3){
    companyNameFromResponse = gstinData?.trade_name
  }else if(businessName?.length > 3){
    companyNameFromResponse = businessName
  }else{
    companyNameFromResponse = KycList?.companyName
  }
  // console.log("gstNumberByState",gstNumberByState)

  const initialValues = {
    company_name: latestCompanyNameFromResp,
    company_logo: "",
    registerd_with_gst: registerWithGstState,

    name_on_pancard: businessAuthName.length > 2 ? businessAuthName : KycList?.nameOnPanCard,
    pin_code: KycList?.merchant_address_details?.pin_code,
    city_id: KycList?.merchant_address_details?.city,
    state_id: KycList?.merchant_address_details?.state,
    registered_business_address: KycList?.merchant_address_details?.address,
    operational_address: KycList?.merchant_address_details?.address,

    gst_number: gstNumberByState,
    prevGstNumber: gstNumberByState==="" ? gstNumberByState : gstNumberByState?.length > 2 ? gstNumberByState : KycList?.gstNumber,

    // pan_card: gstinData?.pan?.length > 2 ? gstinData?.pan : KycList?.panCard,
    pan_card: bussinessPanFromGST,
    prev_pan_card: bussinessPanFromGST==="" ? bussinessPanFromGST : bussinessPanFromGST?.length > 2 ? bussinessPanFromGST : KycList?.panCard,

    signatory_pan: KycList?.signatoryPAN === null ? "" : KycList?.signatoryPAN,
    prevSignatoryPan: KycList?.signatoryPAN,

    // isGSTINVerified: KycList?.gstNumber !== null ? "1" : "",
    // isPANVerified: KycList?.panCard !== null ? "1" : "",
    // isAuthPANVerified: KycList?.signatoryPAN !== null ? "1" : "",
  };


  // console.log("initialValues",initialValues)
  const validationSchema = Yup.object({
    company_name: Yup.string().trim()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    gst_number: Yup.string().when(["registerd_with_gst"], {
      is: true,
      then: Yup.string()
        .trim()
        .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
        .matches(regexGSTN, "GSTIN Number is Invalid")
        .required("Required")
        .nullable(),
      otherwise: Yup.string()
        .notRequired()
        .nullable(),
    }),
    prevGstNumber: Yup.string().when(["registerd_with_gst"], {
      is: true,
      then: Yup.string().oneOf(
        [Yup.ref("gst_number"), null], "You need to verify Your GSTIN Number")
        .required("You need to verify Your GSTIN Number")
        .nullable(),
      otherwise: Yup.string().notRequired().nullable()
    }),
    pan_card: Yup.string()
      .matches(reqexPAN, "PAN number is Invalid")
      .required("Required")
      .nullable(),
    signatory_pan: Yup.string()
      .trim()
      .matches(reqexPAN, "Authorized PAN number is Invalid")
      .required("Required")
      .nullable(),
    prevSignatoryPan: Yup.string()
      .oneOf(
        [Yup.ref("signatory_pan"), null],
        "You need to verify Your Authorized Signatory PAN Number"
      )
      .required("You need to verify Your Authorized Signatory PAN Number")
      .nullable(),
    name_on_pancard: Yup.string()
      .trim()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    city_id: Yup.string()
      .trim()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .max(50, "City name character length exceeded")
      .wordLength("Word character length exceeded")
      .nullable(),
    state_id: Yup.string()
      .required("Required")
      .nullable(),
    pin_code: Yup.string()
      .trim()
      .matches(reqexPinCode, "Pin Code is Invalid")
      .required("Required")
      .nullable(),
    operational_address: Yup.string()
      .trim()
      .matches(Regex.addressForSpecific, RegexMsg.addressForSpecific)
      .required("Required")
      .wordLength("Word character length exceeded")
      .max(120, "Address Max length exceeded, 120 charactes are allowed")
      .nullable(),
    registerd_with_gst: Yup.boolean().required("Required").nullable(),
  },

    [["registerd_with_gst"]]
  );

  useEffect(() => {
    dispatch(businessOverviewState())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "stateId",
          "stateName",
          resp.payload
        );
        setBusinessOverview(data);
      })
      .catch((err) => console.log(err));

      // set initial value
      setLatestCompanyNameFromResp(KycList?.companyName)
      setBussinessPanFromGST(KycList?.panCard)
      setRegisterWithGstState(KycList?.registerdWithGST?.toString() ?? 'true')
      setGstNumberByState(KycList?.gstNumber)
  }, []);

  const   checkInputIsValid = async (err, val, setErr, setFieldTouched, key, setFieldValue = ()=>{} ) => {
    const hasErr = err.hasOwnProperty(key);
    // console.log("hasErr-"+key ,err.hasOwnProperty(key))

    const fieldVal = val[key];
    let isValidVal = true;

    if (fieldVal === null || fieldVal === undefined) {
      isValidVal = false;
      setFieldTouched(key, true);
    }
    // console.log("isValidVal",isValidVal);

    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "pan_card") {
      // console.log("check 2")
      await panValidate(val[key], "company_name", setFieldValue);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "signatory_pan") {
      await authValidation(val[key]);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "gst_number") {
      await gstinValidate(val[key], "company_name", setFieldValue);
    }
  };

  const onSubmit = (values) => {
    if (role.merchant) {
      setIsDisable(true);
      const bodyFormData = new FormData();
      bodyFormData.append("company_name", values.company_name);
      bodyFormData.append("registerd_with_gst", JSON.parse(values.registerd_with_gst));
      bodyFormData.append("gst_number", values.gst_number);
      bodyFormData.append("pan_card", values.pan_card);
      bodyFormData.append("signatory_pan", values.signatory_pan);
      bodyFormData.append("name_on_pancard", values.name_on_pancard);
      bodyFormData.append("pin_code", values.pin_code);
      bodyFormData.append("city_id", values.city_id);
      bodyFormData.append("state_id", values.state_id);
      if (checked === true) {
        bodyFormData.append(
          "operational_address",
          values.registered_business_address
        );
      } else {
        bodyFormData.append("operational_address", values.operational_address);
      }
      bodyFormData.append(
        "registered_business_address",
        values.registered_business_address
      );
      bodyFormData.append("files", "");
      bodyFormData.append("modified_by", loginId);
      bodyFormData.append("login_id", loginId);

      dispatch(saveMerchantInfo(bodyFormData)).then((res) => {
        if (
          res?.meta?.requestStatus === "fulfilled" &&
          res?.payload?.status === true
        ) {
          toast.success(res?.payload?.message);
          setTab(4);
          setTitle("BANK DETAILS");
          dispatch(kycUserList({ login_id: loginId }));
          dispatch(GetKycTabsStatus({ login_id: loginId }));

          setIsDisable(false);
        } else {
          toast.error(res?.payload?.message);
          setIsDisable(false);
        }
      });
    }
  };

  const enableVerifiedIconByParam = (key, formVal)=>{
    let status = false;



  }

  return (
    <div className="col-sm-12 col-md-6 col-lg-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          setFieldValue,
          initialValues,
          errors,
          setFieldError,
          setFieldTouched,
          change
        }) => (
          <Form>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6 marg-b">
                <div className="input-group">
                  <div>
                    {/* {console.log("values",values)} */}
                    <FormikController
                      control="radio"
                      name="registerd_with_gst"
                      label="Do you have a GST Number ?"
                      options={radioBtnOptions}
                      className="form-check-input"
                      onChange={(e)=>{
                        setFieldValue("registerd_with_gst",e.target.value)
                        setFieldValue("company_name","")
                        setFieldValue("pan_card","")                        
                        setFieldValue("prev_pan_card","")                        
                        setFieldValue("prevGstNumber","")
                      }}
                      
                      disabled={VerifyKycStatus === "Verified" ? true : false}
                      readOnly={readOnly}
                    />

                  </div>
                </div>
              </div>
              {/* if merchant has GST number */}
              {/* {console.log("values?.registerd_with_gst",typeof(values?.registerd_with_gst))}
              {values?.registerd_with_gst == 'true' ? console.log("okay tested") : console.log("failed") } */}
              {values?.registerd_with_gst == "true" ?
              <div className="col-sm-12 col-md-6 col-lg-6 marg-b">
                <label className="col-form-label mt-0 p-2">
                  GSTIN<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="gst_number"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
         
                  {values?.gst_number !== null &&
                    values?.gst_number !== "" &&
                    !errors.hasOwnProperty("gst_number") &&
                    !errors.hasOwnProperty("prevGstNumber") ? (
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                    </span>
                  ) : (
                    <div className="position-sticky pull-right- otpbtn input-group-append">
                      <a
                        href={() => false}
                        className="btn btnbackground text-white btn-sm optbtn- btn-outline-secondary mb-0"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "gst_number",
                            setFieldValue
                          );
                        }}
                      >
                        Verify GST
                      </a>
                    </div>
                  )}
                </div>
                {
                  <ErrorMessage name="gst_number">
                    {(msg) => (
                      <span className="abhitest- errortxt- text-danger">
                        {msg}
                      </span>
                    )}
                  </ErrorMessage>
                }
                <br />
                {errors?.prevGstNumber && (
                  <span className="notVerifiedtext- text-danger mb-0">
                    {errors?.prevGstNumber}
                  </span>
                )}
              </div> :
              <div className="col-sm-12 col-md-6 col-lg-6 marg-b">
              <div className="input-group">
              <label>
              Kindly fill the donwloaded form and upload in the <strong>Upload Document</strong> Tab"
              </label>
                <a className="btn btn-sm btn-primary" href="https://sp2-partner.sabpaisa.in/SRS+GST+Declaration.pdf" target="_blank"  rel="noreferrer" alt="GST Declaration Form">Download GST Declaration Format </a>
              </div>
              </div>
              }
            </div>

            
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">

                <label className="col-form-label mt-0 p-2">
                  Business PAN <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                <Field
                    type="text"
                    name="pan_card"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={values?.registerd_with_gst === 'true' ? true : false}
                  />

                  {(values?.pan_card !== null &&
                    values?.pan_card !== "" &&
                    !errors.hasOwnProperty("pan_card") &&
                    !errors.hasOwnProperty("prev_pan_card") &&
                    (values?.pan_card===values?.prev_pan_card) &&
                    {/* (values?.registerd_with_gst === 'true' && values?.gst_number!=="") */}
                    ) ?  
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                  </span> 
                  :  <div className="position-sticky pull-right- otpbtn input-group-append">
                      <a
                        href={() => false}
                        className="btn btnbackground text-white btn-sm optbtn- btn-outline-secondary mb-0"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "pan_card",
                            setFieldValue
                          );
                        }}
                      >
                        Verify
                      </a>
                    </div> }
                </div>
                {errors?.pan_card && (
                  <p className="notVerifiedtext- text-danger mb-0">
                    {errors?.pan_card}
                  </p>
                )}

                {errors?.prev_pan_card && (
                  <p className="notVerifiedtext- text-danger mb-0">
                    {errors?.prev_pan_card}
                  </p>
                )}

                
              </div>


              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Authorized Signatory PAN{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="signatory_pan"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                  {values?.signatory_pan !== null &&
                    values?.signatory_pan !== "" &&
                    !errors.hasOwnProperty("signatory_pan") &&
                    !errors.hasOwnProperty("prevSignatoryPan") ? (
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                    </span>
                  ) : (
                    <div className="position-sticky pull-right- otpbtn input-group-append">
                      <a
                        href={() => false}
                        className="btn btnbackground text-white btn-sm optbtn- btn-outline-secondary mb-0"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "signatory_pan"
                          );
                        }}
                      >
                        Verify
                      </a>
                    </div>
                  )}
                </div>
                {
                  <ErrorMessage name="signatory_pan">
                    {(msg) => (
                      <span className="abhitest- errortxt- text-danger">
                        {msg}
                      </span>
                    )}
                  </ErrorMessage>
                }
                <br />
                {errors?.prevSignatoryPan && (
                  <span className="notVerifiedtext- text-danger mb-0">
                    {errors?.prevSignatoryPan}
                  </span>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Business Name<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="company_name"
                  className="form-control"
                  readOnly={readOnly === false ? true : readOnly}
                />
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  PAN Owner's Name<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="name_on_pancard"
                  className="form-control"
                  readOnly={readOnly === false ? true : readOnly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Address<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="operational_address"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  City<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="city_id"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  State<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="select"
                  name="state_id"
                  options={BusinessOverview}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Pin Code<span style={{ color: "red" }}>*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="pin_code"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="my-5- w-100 pull-left p-2">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div className="mt-3">
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                    {VerifyKycStatus === "Verified" ? null : (
                      <button
                        type="submit"
                        disabled={disable}
                        className="save-next-btn float-lg-right btnbackground text-white"
                      >
                        {buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessDetails;
