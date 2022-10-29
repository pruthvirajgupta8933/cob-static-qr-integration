import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
  gstValidation

} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

function BusinessDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const { role, kycid } = props;

  const regexGSTN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const reqexPAN =/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;

  const { auth, kyc} = useSelector((state) => state);

  const {user} = auth
  const {allTabsValidate, kycUserList, KycTabStatusStore } = kyc

  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus
  const KycList = kycUserList
console.log("KycList",KycList)


  const VerifyKycStatus = KycTabStatusStore?.merchant_info_status
  
  const { loginId } = user;
  const [BusinessOverview, setBusinessOverview] = useState([]);
  const [gstin, setGstin] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [checked, setChecked] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const [operationvalue, setOperationvalue] = useState(
    KycList.registeredBusinessAdress
  );
  const dispatch = useDispatch();
  
  const panStatus = BusinessDetailsStatus?.PanValidation?.status
  
  const panValidStatus = BusinessDetailsStatus?.PanValidation?.valid


  
  const notValid = useSelector(
    (state) =>
      state.kyc.allTabsValidate.BusinessDetailsStatus.AuthPanValidation.message
  );
  const busiFirstName = BusinessDetailsStatus?.PanValidation?.first_name === null ? "" : BusinessDetailsStatus?.PanValidation?.first_name

  const busiLastName = BusinessDetailsStatus?.PanValidation?.last_name === null ? "" : BusinessDetailsStatus?.PanValidation?.last_name
  
  const busiAuthFirstName = BusinessDetailsStatus.AuthPanValidation.first_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.first_name

  const busiAuthLastName = BusinessDetailsStatus?.AuthPanValidation?.last_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.last_name;

  let businessNamee = `${busiFirstName} ${busiLastName}`;
  let businessAuthName = `${busiAuthFirstName} ${busiAuthLastName}`;

  const choicesCheckBox = [{ key: "Same As Registered Address", value: "yes" }];

  const GSTIN = [
    { key: "Select Option", value: "Select Option" },
    { key: "True", value: "We have a registered GSTIN" },
    { key: "False", value: "We don't have a GSTIN" },
  ];
  const handleChange = (event) => {
    setChecked(event.value);
  };

  const handleShowHide = (event) => {
    const getuser = event.target.value;
    setGstin(getuser);

    // console.log(getuser, "222222222222222");
  };

  const test = (e, val) => {
    if (e.length > 0 && e[0] === "yes") {
      setChecked(true);
      setOperationvalue(val);
      // fn("operational_address",val)
    } else {
      setChecked(false);
      setOperationvalue(null);
    }
  };

  const panValidate = (values) => {
    // console.log("Values ========>",values)
    dispatch(panValidation({
      pan_number: values
        })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" && res.payload.status === true && res.payload.valid === true) {
        // console.log("This is the response", res);
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }

    })

  }

  const gstinValidate = (values) => {
    // console.log("Values GSTIN ========>",values)
    dispatch(gstValidation({
        gst_number: values,
        "fetchFilings": false,
        "fy": "2018-19"
        })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" && res.payload.status === true && res.payload.valid === true) {
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }

    })

  }

  const authValidation = (values) => {
    // console.log("Values ========>",values)
    dispatch(authPanValidation({
      pan_number: values
        })).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" && res.payload.status === true && res.payload.valid === true) {
        // console.log("This is the response", res);
        toast.success(res.payload.message);
      } else {
        toast.error(res?.payload?.message);
      }

    })

  }
console.log(BusinessDetailsStatus,"BusinessDetailsStatus")
const gstinData = BusinessDetailsStatus?.GSTINValidation

  const initialValues = {
    company_name: gstinData?.legalName?.length > 2 ? gstinData?.legalName  : KycList?.companyName,
    company_logo: "",
    registerd_with_gst: "True",
    gst_number: KycList?.gstNumber,
    oldGstNumber: KycList?.gstNumber,
    pan_card: gstinData?.pan?.length > 2 ? gstinData?.pan : KycList?.panCard,
    // oldPanCard: KycList?.panCard,
    signatory_pan: KycList?.signatoryPAN===null? "" : KycList?.signatoryPAN,
    oldSignatoryPan: KycList?.signatoryPAN,
    name_on_pancard: businessAuthName.length > 2 ? businessAuthName : KycList?.nameOnPanCard ,
    pin_code: KycList?.merchant_address_details?.pin_code,
    city_id: KycList?.merchant_address_details?.city,
    state_id: KycList?.merchant_address_details?.state,
    registered_business_address: KycList?.merchant_address_details?.address,
    operational_address: KycList?.merchant_address_details?.address,
    isPANVerified: KycList?.panCard !== null ? "1" : "",
    isAuthPANVerified: KycList?.signatoryPAN !== null ? "1" : "",
    isGSTINVerified: KycList?.gstNumber !== null ? "1" : ""
    // checkBoxChoice: "",
  };

  const businessNameField = (businessAuthName) => {
    if(businessAuthName === undefined) return ""
  }

 

  const validationSchema = Yup.object({
    company_name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    gst_number: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(regexGSTN, "GSTIN Number is Invalid")
      .required("Required")
      .nullable(),
      oldGstNumber: Yup.string()
      .oneOf([Yup.ref("gst_number"), null], "You need to verify Your GSTIN Number")
      .required("You need to verify Your GSTIN Number")
      .nullable(),
    pan_card: Yup.string()
      .matches(reqexPAN,"PAN number is Invalid")
      .required("Required")
      .nullable(),
      // oldPanCard: Yup.string()
      // .oneOf([Yup.ref("pan_card"), null], "You need to verify Your PAN Number")
      // .required("You need to verify Your PAN Number")
      // .nullable(),
    signatory_pan: Yup.string()
      .matches(reqexPAN,"Authorized PAN number is Invalid")
      .required("Required")
      .nullable(),
      oldSignatoryPan:Yup.string()
      .oneOf([Yup.ref("signatory_pan"), null], "qqq You need to verify Your Authorized Signatory PAN Number")
      .required("aaaa You need to verify Your Authorized Signatory PAN Number")
      .nullable(),
    name_on_pancard: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    city_id: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    state_id: Yup.string()
      .required("Required")
      .nullable(),
    pin_code: Yup.string()
      .matches(Regex.digit, RegexMsg.digit)
      .required("Required")
      .nullable(),
    operational_address: Yup.string()
      .matches(Regex.address, RegexMsg.address)
      .required("Required")
      .nullable(),
      // isPANVerified: Yup.string().required("You need to verify Your PAN Number").nullable(),
      // isAuthPANVerified:  Yup.string().required("You need to verify Your Authorized Signatory PAN Number").nullable(),
      // isGSTINVerified: Yup.string().required("You need to verify Your GSTIN Number").nullable()
  });

  useEffect(() => {
    dispatch(businessOverviewState())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "stateId",
          "stateName",
          resp.payload
        );
        // console.log(resp?.payload?.message);
        setBusinessOverview(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const checkInputIsValid = (err, val, setErr, setFieldTouched, key) => {
 
    const hasErr = err.hasOwnProperty(key);

    const fieldVal = val[key];
    let  isValidVal = true;
    if(fieldVal===null || fieldVal===undefined){
      isValidVal = false
      setFieldTouched(key, true);
    }


    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "pan_card") {
      panValidate(val[key]);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "signatory_pan") { 
      authValidation(val[key]);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "gst_number") {
      gstinValidate(val[key]);
    }
  };

  const onSubmit = (values) => {
    if (role.merchant) {
      const bodyFormData = new FormData();
      bodyFormData.append("company_name", values.company_name);
      bodyFormData.append("registerd_with_gst", values.registerd_with_gst);
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
      bodyFormData.append("files", fieldValue);
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
        } else {
          toast.error(res?.payload?.message);
        }
      });
    } else if (role.verifier) {
      const veriferDetails = {
        login_id: kycid,
        merchant_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.merchant_info_status &&
            toast.success(resp?.payload?.merchant_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
      setButtonText("Approve and Next");
    } else if (role.verifier) {
      setReadOnly(true);
      setButtonText("Verify and Next");
    } 
  }, [role]);

  // console.log("readOnly", readOnly);

  return (
    <div className="col-md-12 col-md-offset-4">
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
          handleChange,
        }) => (
          <Form>
                {console.log("values", values)}
            {console.log("initialValues", initialValues)}
            {console.log("errors", errors)}
         
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  GSTIN<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="gst_number"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
            
              {KycList?.gstNumber !== null &&
              !errors.hasOwnProperty("gst_number") &&
              !errors.hasOwnProperty("oldGstNumber") ? (
                <span>
                <p className="panVerfied text-success">
                  Verified
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </p>
              </span> 
              ) : (
              <div class="position-sticky pull-right">
                <a
                  href={() => false}
                  className="btn btnbackground text-white btn-sm panbtn"
                  style={{
                    boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                  }}
                  onClick={() => {
                    checkInputIsValid(
                      errors,
                      values,
                      setFieldError,
                      setFieldTouched,
                      "gst_number"
                    );
                  }}
                >
                  Verify
                </a>
              </div>
                )}
                  {errors?.oldGstNumber && (
                  <span className="notVerifiedtext text-danger">
                    {errors?.oldGstNumber}
                  </span>
                  )}
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Business PAN<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="pan_card"
                  className="form-control"
                  readOnly={readOnly===false? true : readOnly }
                />
              </div>
              {/* {KycList?.panCard !== null &&
              !errors.hasOwnProperty("pan_card") &&
              !errors.hasOwnProperty("oldPanCard") ? (
                <span>
                <p className="panVerfied text-success">
                  Verified
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </p>
              </span> 
              ) : (
              <div class="position-sticky pull-right">
                <a
                  href={() => false}
                  className="btn btnbackground text-white btn-sm panbtn"
                  style={{
                    boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                  }}
                  onClick={() => {

                    // console.log("Values ==>>><<<",formik?.values)
                    checkInputIsValid(
                      errors,
                      values,
                      setFieldError,
                      setFieldTouched,
                      "pan_card"
                    );
                  }}
                >
                  Verify
                </a>
              </div>
                )}
                  {errors?.oldPanCard && (
                  <span className="notVerifiedtext text-danger">
                    {errors?.oldPanCard}
                  </span>
                  )} */}
            </div>
            
            

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Authorized Signatory PAN
                  <span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7 pull-right">
                <FormikController
                  control="input"
                  type="text"
                  name="signatory_pan"
                  className="form-control"
                  readOnly={readOnly}
                />
              </div>
              {KycList?.signatoryPAN !== null &&
              !errors.hasOwnProperty("signatory_pan") &&
              !errors.hasOwnProperty("oldSignatoryPan")? (
                <span>
                <p className="panVerfied text-success">
                  Verified
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                </p>
              </span> 
              ) : (
              <div class="position-sticky pull-right">
                <a
                  href={() => false}
                  className="btn btnbackground text-white btn-sm panbtn"
                  style={{
                    boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                    borderRadius: "6px",
                  }}
                  onClick={() => {

                    // console.log("Values ==>>><<<",formik?.values)
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
                  {errors?.oldSignatoryPan && (
                  <span className="notVerifiedtext text-danger">
                    {errors?.oldSignatoryPan}
                  </span>
                  )}
            </div>

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Business Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="company_name"
                  className="form-control"
                  readOnly={readOnly===false? true : readOnly }
                />
              </div>
            </div>
            {/* <div className="form-row">
              <div className="form-group col-md-4">
                <label>
                  <h4 class="font-weight-bold">
                    Business Name <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="company_name"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* {role.verifier || role.approver ? (
                <div className="form-group col-md-4">"show company logo" </div>
              ) : (
                <div className="form-group col-md-4">
                  <label>
                    <h4 class="font-weight-bold">
                      Company Logo<span style={{ color: "red" }}>*</span>
                    </h4>
                  </label>
                  <FormikController
                    control="file"
                    type="file"
                    name="company_logo"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                    onChange={(event) => {
                      setFieldValue(event.target.files[0]);
                      formik.setFieldValue(
                        "company_logo",
                        event.target.files[0].name
                      );
                    }}
                    accept="image/jpeg,image/jpg,image/png "
                  />
                </div>
              )} */}

            {/* <div class="form-group row">
              <label class="col-sm-2 col-form-label p-2">
                <h4 class="font-weight-bold text-nowrap">
                  GSTIN<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-8 ml-5">
              <FormikController
                  control="select"
                  name="registerd_with_gst"
                  onChange={(e) => {
                    handleShowHide(e);
                    formik.setFieldValue("registerd_with_gst", e.target.value);
                  }}
                  className="form-control"
                  options={GSTIN}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div> */}

            {/* {formik.values?.registerd_with_gst === "True" && (
                <div className="form-group col-md-4">
                  <label>
                    <h4 class="font-weight-bold">
                      Enter Gst No <span style={{ color: "red" }}>*</span>
                    </h4>
                  </label>
                  <FormikController
                    control="input"
                    type="text"
                    name="gst_number"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                </div>
              )}
             */}

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  PAN Owner's Name<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="name_on_pancard"
                  className="form-control"
                  readOnly={readOnly===false? true : readOnly }
                />
              </div>
            </div>

            {/* <div className="form-group col-md-4">
                <label>
                  <h4 class="font-weight-bold">
                    PAN Owner's Name <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="name_on_pancard"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}
            {/* <div className="form-group col-md-4">
                <label>
                  <h4 class="font-weight-bold">
                    PIN Code <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="input"
                  type="number"
                  name="pin_code"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}
            {/* <div className="form-group col-md-4 mt-4">
                <label>
                  <h4 class="font-weight-bold">
                    City <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="city_id"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}
            {/* <div className="form-group col-md-4 mt-4">
                <label>
                  <h4 class="font-weight-bold">
                    State <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="select"
                  name="state_id"
                  options={BusinessOverview}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Address<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="operational_address"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  City<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
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

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  State<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="select"
                  name="state_id"
                  options={BusinessOverview}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Pincode<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
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
            {/* 
              <div className="form-group col-md-4 mt-1">
                <label>
                  <h4 class="font-weight-bold">
                    Authorised Signatory PAN
                    <span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="pan_card"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* <div className="form-group col-md-4">
                <label>
                  <h4 class="font-weight-bold">
                    Registered Address<span style={{ color: "red" }}>*</span>
                  </h4>
                </label>
                <FormikController
                  control="textArea"
                  type="textArea"
                  name="registered_business_address"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div className="form-group col-md-5 d-flex">
                <label>
                  <p>Same as Registered Address</p>
                </label>
                <FormikController
                  control="checkbox"
                  name="checkBoxChoice"
                  options={choicesCheckBox}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  checked={readOnly}
                />
                {formik.handleChange(
                  "checkBoxChoice",
                  test(
                    formik.values.checkBoxChoice,
                    formik.values.registered_business_address
                  )
                )}
                <FormikController
                  control="textArea"
                  type="textArea"
                  disabled={checked}
                  name="operational_address"
                  className="form-control"
                  value={operationvalue}
                  readOnly={readOnly}
                />
              </div> */}
            <div class="my-5 p-2">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div class="mt-3">
                <div class="row">
                  <div class="col-sm-11 col-md-11 col-lg-11 col-form-label">
                    {VerifyKycStatus === "Verified" ? null : (
                      <button
                        type="submit"
                        className="btn float-lg-right"
                        style={{ backgroundColor: "#0156B3" }}
                      >
                        <h4 className="text-white text-kyc-sumit">
                          {" "}
                          {buttonText}
                        </h4>
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