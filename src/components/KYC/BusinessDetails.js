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
  panValidation,
  authPanValidation,
  gstValidation,
  kycUserList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";
import { isNull } from "lodash";
import { udyamValidate } from "../../services/kyc/kyc-validate/kyc-validate.service";
import toastConfig from "../../utilities/toastTypes";

function BusinessDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  
  
  const reqexPinCode = /^[1-9][0-9]{5}$/;

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { allTabsValidate, KycTabStatusStore } = kyc;
  const VerifyKycStatus = KycTabStatusStore?.merchant_info_status;

  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus;
  const KycList = kyc?.kycUserList;
  const { loginId } = user;
  const [BusinessOverview, setBusinessOverview] = useState([]);

  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");
  const [udyamData, setUdyamData] = useState("");
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingForGst, setLoadingForGst] = useState(false)
  const [loadingForSiganatory, setLoadingForSignatory] = useState(false)
  const [isLoader, setIsloader] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // const [latestCompanyNameFromResp, setLatestCompanyNameFromResp] = useState("")
  // const [bussinessPanFromGST, setBussinessPanFromGST] = useState("")

  // const [gstNumberByState, setGstNumberByState] = useState("")
  // const [udyamAadharByState, setudyamAadharByState] = useState("")
  // const [registerWithGstState, setRegisterWithGstState] = useState(true)
  // const [registerWithUdyam, setRegisterWithUdyam] = useState(true)
  const [udyamResponseData, setUdyamResponseData] = useState({})



  const dispatch = useDispatch();
  const busiAuthFirstName = BusinessDetailsStatus.AuthPanValidation?.first_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.first_name;
  const busiAuthLastName = BusinessDetailsStatus?.AuthPanValidation?.last_name === null ? "" : BusinessDetailsStatus?.AuthPanValidation.last_name;

  // let businessName = `${busiFirstName} ${busiLastName}`;
  // let businessAuthName = ``;
  let businessAuthName = `${busiAuthFirstName !== undefined ? busiAuthFirstName : ""
    } ${busiAuthLastName !== undefined ? busiAuthLastName : ""}`;

  const trimFullName = (strOne, strTwo) => {
    let fullStr = isNull(strOne) ? "" : strOne
    fullStr += isNull(strTwo) ? "" : strTwo
    return fullStr
  }


  const radioBtnOptions = [
    { "value": true, "key": "Yes" },
    { "value": false, "key": "No" },



  ]

  let registerd_with_udyam;

  if (KycList?.is_udyam !== undefined && KycList?.is_udyam !== null) {
    try {
      registerd_with_udyam = JSON.parse(KycList.is_udyam);
    } catch (error) {
      // console.error('Error parsing JSON:', error);
      registerd_with_udyam = {};
    }
  } else {
    registerd_with_udyam = {};
  }


  const initialValues = {
    company_name: KycList?.companyName,
    registerd_with_gst: KycList?.registerdWithGST ?? true,

    name_on_pancard: businessAuthName.length > 2 ? businessAuthName : KycList?.nameOnPanCard,
    pin_code: KycList?.merchant_address_details?.pin_code,
    city_id: KycList?.merchant_address_details?.city,
    state_id: KycList?.merchant_address_details?.state,
    registered_business_address: KycList?.merchant_address_details?.address,
    operational_address: KycList?.merchant_address_details?.address,

    gst_number: KycList?.gstNumber,
    prevGstNumber: KycList?.gstNumber?.length > 2 ? KycList?.gstNumber : "00",

    registerd_with_udyam: registerd_with_udyam,
    udyam_number: KycList?.udyam_data?.reg_number ?? "",
    prevUdyamNumber: KycList?.udyam_data?.reg_number?.length > 2 ? KycList?.udyam_data?.reg_number : "0000",

    pan_card: KycList?.panCard,
    prev_pan_card: KycList?.panCard?.length > 2 ? KycList?.panCard : "pan",
    isPanVerified: KycList?.pan_card?.length > 9 && 1,

    signatory_pan: KycList?.signatoryPAN === null ? "" : KycList?.signatoryPAN,
    prevSignatoryPan: KycList?.signatoryPAN,
    isSignatoryPanVerified: KycList?.signatoryPAN?.length > 9 && 1,
  };

  // console.log("isPanVerified", isPanVerified)

  // console.log("initialValues-----reupdate", initialValues)
  const validationSchema = Yup.object().shape({
    company_name: Yup.string()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    gst_number: Yup.string().allowOneSpace().when(["registerd_with_gst"], {
      is: true,
      then: Yup.string()
        .trim()
        .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
        // .matches(regexGSTN, "GSTIN Number is Invalid")
        .required("Required")
        .nullable(),
      otherwise: Yup.string()
        .notRequired()
        .nullable(),
    }),
    prevGstNumber: Yup.string().allowOneSpace().when(["registerd_with_gst"], {
      is: true,
      then: Yup.string().oneOf(
        [Yup.ref("gst_number"), null], "You need to verify Your GSTIN Number")
        .required("You need to verify Your GSTIN Number")
        .nullable(),
      otherwise: Yup.string().notRequired().nullable()
    }),
    udyam_number: Yup.string().allowOneSpace().when(["registerd_with_udyam"], {
      is: true,
      then: Yup.string()

        .max(25, "Invalid Format")
        .required("Required")
        .nullable(),
      otherwise: Yup.string()
        .notRequired()
        .nullable(),
    }),
    prevUdyamNumber: Yup.string().allowOneSpace().when(["registerd_with_udyam"], {
      is: true,
      then: Yup.string().oneOf(
        [Yup.ref("udyam_number"), null], "You need to verify Your Udyam Reg. Number")
        .required("Udyam Reg. Number Required")
        .nullable(),
      otherwise: Yup.string().notRequired().nullable()
    }),
    pan_card: Yup.string().allowOneSpace()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .required("Required")
      .nullable(),
    isPanVerified: Yup.string().required("Please verify the pan number").nullable(),

    signatory_pan: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .required("Required")
      .nullable(),
    isSignatoryPanVerified: Yup.string().allowOneSpace().required("Please verify the signatory pan number").nullable(),
    prevSignatoryPan: Yup.string().allowOneSpace()
      .oneOf(
        [Yup.ref("signatory_pan"), null],
        "You need to verify Your Authorized Signatory PAN Number"
      )
      .required("Authorized Signatory PAN Number Required")
      .nullable(),

    name_on_pancard: Yup.string()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    city_id: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .max(50, "City name character length exceeded")
      .wordLength("Word character length exceeded")
      .nullable(),
    state_id: Yup.string().allowOneSpace()
      .required("Required")
      .nullable(),
    pin_code: Yup.string()
      .allowOneSpace()
      .matches(reqexPinCode, "Pin Code is Invalid")
      .required("Required")
      .nullable(),
    operational_address: Yup.string()
      .allowOneSpace()
      .matches(Regex.addressForSpecific, RegexMsg.addressForSpecific)
      .required("Required")
      .wordLength("Word character length exceeded")
      .max(120, "Address Max length exceeded, 120 charactes are allowed")
      .nullable(),
    registerd_with_gst: Yup.boolean().required("Required").nullable(),
    registerd_with_udyam: Yup.boolean().required("Required").nullable(),
  },

    [["registerd_with_gst", "registerd_with_udyam"]]
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
    // console.log("useEffect call")
  }, []);




  const panValidate = (values, key, setFieldValue) => {
    setIsLoading(true)

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
        setFieldValue(key, fullNameByPan)

        setFieldValue("pan_card", values)
        setFieldValue("prev_pan_card", values)
        setFieldValue("isPanVerified", 1)
        toast.success(res?.payload?.message);
        setIsLoading(false)

      } else {
        setFieldValue(key, "")
        setIsLoading(false)
        toast.error(res?.payload?.message);
      }
    }).catch(err => { console.log("err", err) })
    setIsLoading(false)
    // setRegisterWithGstState(false)
  };


  const gstinValidate = (values, key, setFieldValue) => {
    setLoadingForGst(true)
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

        const fullName = trimFullName(res?.payload?.trade_name, "")
        setFieldValue(key, fullName)
        setFieldValue("gst_number", values)
        setFieldValue("prevGstNumber", values)

        setFieldValue("pan_card", res?.payload?.pan)
        setFieldValue("prev_pan_card", res?.payload?.pan)
        setFieldValue("isPanVerified", 1)

        setFieldValue("registerd_with_gst", true)
        setFieldValue("registerd_with_udyam", false)
        setFieldValue("udyam_number", "")
        setLoadingForGst(false)

        toast.success(res?.payload?.message);
      } else {
        setFieldValue(key, "")
        toast.error(res?.payload?.message);
        setLoadingForGst(false)
      }
    })
  };


  // const udyamValidation = (values, key, setFieldValue) => {
  //   setIsloader(true)
  //   setUdyamData("")

  //   udyamValidate({ "reg_number": values }).then(
  //     resp => {
  //       if (resp?.data?.valid === true) {

  //         setFieldValue(key, values)
  //         setFieldValue("prevUdyamNumber", values)
  //         setUdyamResponseData(resp?.data)
  //         setIsloader(false)

  //         toastConfig.successToast(resp?.data?.message)
  //         setUdyamData({ entity: resp?.data?.entity, valid: resp?.data?.valid })
  //       } else {
  //         setUdyamResponseData({})
  //         setIsloader(false)
  //         toastConfig.errorToast("Detail is not valid");
  //       }
  //     }).catch(err => 
  //       toastConfig.errorToast(err.response?.data?.detail)

  //       )
  // }
  const udyamValidation = (values, key, setFieldValue, setIsloader) => {
    setIsloader(true);
    setUdyamData("");

    udyamValidate({ "reg_number": values }).then(
      resp => {
        if (resp?.data?.valid === true) {
          setFieldValue(key, values);
          setFieldValue("prevUdyamNumber", values);
          setUdyamResponseData(resp?.data);
          toastConfig.successToast(resp?.data?.message);
          setUdyamData({ entity: resp?.data?.entity, valid: resp?.data?.valid });
        } else {
          setUdyamResponseData({});
          toastConfig.errorToast("Detail is not valid");
        }
        setIsloader(false);
      }).catch(err => {
        setIsloader(false);
        toastConfig.errorToast(err.response?.data?.detail);
      });
  };




  const authValidation = (values, key, setFieldValue) => {
    setLoadingForSignatory(true)
    // console.log("auth", "auth pan")
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
        const authName = res.payload.first_name + ' ' + res.payload?.last_name

        setFieldValue(key, values)
        setLoadingForSignatory(false)
        setFieldValue("prevSignatoryPan", values)
        setFieldValue("name_on_pancard", authName)
        setFieldValue("isSignatoryPanVerified", 1)

        toast.success(res.payload.message);
      } else {

        toast.error(res?.payload?.message);
        setLoadingForSignatory(false)
        // setIsLoading(false)
      }
    });
  };



  const checkInputIsValid = async (err, val, setErr, setFieldTouched, key, setFieldValue = () => { }) => {

    // setIsLoading(true)
    const hasErr = err.hasOwnProperty(key);
    const fieldVal = val[key];
    let isValidVal = true;
    if (fieldVal === null || fieldVal === undefined) {
      isValidVal = false;
      setFieldTouched(key, true);
    }
    if (hasErr) {
      if (val[key] === "") {
        setErr(key, true);
      }
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "pan_card") {

      // for  -Business PAN 
      panValidate(val[key], "company_name", setFieldValue, setIsLoading);
      setIsLoading(true)
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "signatory_pan") {
      // auth signatory pan
      // console.log("dfdfdf")
      authValidation(val[key], "signatory_pan", setFieldValue, setLoadingForSignatory);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "gst_number") {
      gstinValidate(val[key], "company_name", setFieldValue, setLoadingForGst);
      setLoadingForGst(true)
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "udyam_number") {
      udyamValidation(val[key], "udyam_number", setFieldValue, setIsloader);
      setIsloader(true)
    }
  };

  const onSubmit = (values) => {
    setIsDisable(true);
    const postData = {
      "company_name": values.company_name,
      "registerd_with_gst": JSON.parse(values.registerd_with_gst),
      "gst_number": values.gst_number,

      "pan_card": values.pan_card,
      "signatory_pan": values.signatory_pan,

      "name_on_pancard": values.name_on_pancard,
      "pin_code": values.pin_code,
      "city_id": values.city_id,
      "state_id": values.state_id,
      "operational_address": values.operational_address,
      "registered_business_address": values.registered_business_address,
      "files": null,
      "modified_by": loginId,
      "login_id": loginId,
      "is_udyam": JSON.parse(values.registerd_with_udyam),
      "udyam_data": udyamResponseData
    }

    // console.log("postData", postData)

    dispatch(saveMerchantInfo(postData)).then((res) => {
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
        toast.error(res?.payload?.detail);
        setIsDisable(false);
      }
    });

  };


  const registeredWithGstHandler = (value, setFieldValue) => {
    const valueGst = JSON.parse(value)
    setFieldValue("registerd_with_gst", valueGst)
    setFieldValue("gst_number", "")
    setFieldValue("prevGstNumber", "")

    setFieldValue("company_name", "")
    setFieldValue("pan_card", "")
    setFieldValue("prev_pan_card", "")

    setFieldValue("registerd_with_udyam", false)
    setFieldValue("udyam_number", "")
    setFieldValue("prevUdyamNumber", "")
  }


  const registeredWithUdyamHandler = (value, setFieldValue) => {
    setUdyamData("")
    const valueUdyam = JSON.parse(value)
    setFieldValue("registerd_with_udyam", valueUdyam)
    setFieldValue("udyam_number", "")
    setFieldValue("prevUdyamNumber", "")

    setFieldValue("gst_number", "")
    setFieldValue("company_name", "")
    setFieldValue("pan_card", "")
    setFieldValue("prev_pan_card", "")

    setUdyamResponseData({})
  }


  useEffect(() => {
    setUdyamResponseData(KycList?.udyam_data)
  }, [KycList])

  return (
    <div className="col-lg-12 p-0">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {({
          initialValues,
          values,
          setFieldValue,
          errors,
          setFieldError,
          setFieldTouched
        }) => (
          <Form>
            <div className="row">

              {/* {console.log("initialValues",initialValues)}
            {console.log("values",values)}
            {console.log("errors",errors)} */}
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="input-group">
                  <lable>Do you have a GST number?</lable>
                  <div className="d-flex d-flex justify-content-between w-50">

                    <FormikController
                      control="radio"
                      name="registerd_with_gst"
                      options={radioBtnOptions}
                      className="form-check-input"
                      onChange={(e) => { registeredWithGstHandler(e.target.value, setFieldValue) }}
                      disabled={VerifyKycStatus === "Verified" ? true : false}
                      readOnly={readOnly}
                    />
                  </div>
                </div>

                {JSON.parse(values.registerd_with_gst) === false &&
                  <div className="input-group mt-2">
                    <lable>Do you have a Udyam Number?</lable>
                    <div className="d-flex d-flex justify-content-between w-50">
                      <FormikController
                        control="radio"
                        name="registerd_with_udyam"
                        options={radioBtnOptions}
                        className="form-check-input"
                        onChange={(e) => { registeredWithUdyamHandler(e.target.value, setFieldValue) }}
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>}
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6 marg-b pb-3">
                {/* {console.log("{JSON.parse(values?.registerd_with_gst)",JSON.parse(values?.registerd_with_gst))} */}
                {JSON.parse(values?.registerd_with_gst) === true &&
                  <React.Fragment>
                    <label className="col-form-label pt-0 p-2 ">
                      GSTIN<span className="text-danger">*</span>
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
                        values?.gst_number !== undefined &&
                        values?.gst_number !== "" &&
                        !errors.hasOwnProperty("gst_number") &&
                        !errors.hasOwnProperty("prevGstNumber") ? (
                        <span className="success input-group-append">
                          <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                        </span>
                      ) : (
                        <div className="input-group-append">
                          <a
                            href={() => false}
                            className="btn cob-btn-primary text-white btn-sm"
                            onClick={
                              () => {
                                checkInputIsValid(
                                  errors,
                                  values,
                                  setFieldError,
                                  setFieldTouched,
                                  "gst_number",
                                  setFieldValue
                                );
                              }

                            }
                          >
                            {loadingForGst ? (
                              <span className="spinner-border spinner-border-sm">
                                <span className="sr-only">Loading...</span>
                              </span>
                            ) : (
                              "Verify"
                            )}
                          </a>
                        </div>
                      )}
                    </div>

                    <ErrorMessage name="gst_number">
                      {(msg) => (
                        <p className="text-danger m-0">
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                    {errors?.prevGstNumber && (
                      <p className="text-danger m-0">
                        {errors?.prevGstNumber}
                      </p>
                    )}
                  </React.Fragment>}

                {(JSON.parse(values?.registerd_with_udyam) === false && JSON.parse(values?.registerd_with_gst) === false) &&
                  <div className="input-group">
                    <label>
                      Kindly fill the donwloaded form and upload in the <strong>Upload Document</strong> Tab"
                    </label>
                    <a className="btn cob-btn-primary text-white btn-sm mb-1" href="https://firebasestorage.googleapis.com/v0/b/cob-staging.appspot.com/o/SRS-GST-Declaration.pdf?alt=media&token=9eaae583-b357-4146-b7d9-96b58073d075" target="_blank" rel="noreferrer" alt="GST Declaration Form">Download GST Declaration Format </a>
                  </div>

                }


                {(JSON.parse(values?.registerd_with_udyam) === true && JSON.parse(values?.registerd_with_gst) === false) &&
                  <React.Fragment >
                    <label className="col-form-label pt-0 p-2">
                      Udyam Aadhar Number<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <Field
                        type="text"
                        name="udyam_number"
                        className="form-control"
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />

                      {values?.udyam_number !== null &&
                        values?.udyam_number !== "" &&
                        values?.udyam_number !== undefined &&
                        !errors.hasOwnProperty("udyam_number") &&
                        !errors.hasOwnProperty("prevUdyamNumber") ? (
                        <span className="success input-group-append">
                          <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                        </span>
                      ) : (
                        <div className="input-group-append">
                          <button
                            href={() => false}
                            className="btn cob-btn-primary text-white btn-sm"
                            onClick={() => {
                              checkInputIsValid(
                                errors,
                                values,
                                setFieldError,
                                setFieldTouched,
                                "udyam_number",
                                setFieldValue
                              );
                            }}
                          >
                            {isLoader ?
                              <span className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                              </span>
                              :
                              "Verify"
                            }
                          </button>
                        </div>
                      )}
                    </div>
                    <ErrorMessage name="udyam_number">
                      {(msg) => (
                        <p className="text-danger">
                          {msg}
                        </p>
                      )}
                    </ErrorMessage>
                    {errors?.prevUdyamNumber && (
                      <p className="text-danger mb-0">
                        {errors?.prevUdyamNumber}
                      </p>
                    )}
                    <p className="m-0">{udyamData?.entity}</p>
                  </React.Fragment>
                }
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                {/* <label className="col-form-label mt-0 p-2">
                  Business PAN <span className="text-danger">*</span>
                </label> */}
                <label className="col-form-label p-2">
                  Business PAN<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="pan_card"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isPanVerified", "")
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("pan_card", uppercaseValue); // Set the uppercase value to form state
                    }}
                    disabled={VerifyKycStatus === "Verified"}
                    readOnly={JSON.parse(values?.registerd_with_gst)}

                  />


                  {(values?.pan_card !== null &&
                    values?.isPanVerified !== "" &&
                    values?.pan_card !== "" &&
                    values?.pan_card !== undefined &&
                    !errors.hasOwnProperty("pan_card") &&
                    !errors.hasOwnProperty("prev_pan_card") &&
                    (values?.pan_card === values?.prev_pan_card)) ?
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                    </span>
                    : <div className="input-group-append">
                      <button
                        href={() => false}
                        className="btn cob-btn-primary text-white btn btn-sm"

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
                        {isLoading ?
                          <span className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                          :
                          "Verify"
                        }
                      </button>
                    </div>}
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

                {errors?.isPanVerified && (
                  <p className="notVerifiedtext- text-danger mb-0">
                    {errors?.isPanVerified}
                  </p>
                )}


              </div>


              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Authorized Signatory PAN
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="signatory_pan"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("signatory_pan", uppercaseValue); // Set the uppercase value to form state
                      setFieldValue("isSignatoryPanVerified", "")
                    }}

                  />
                  {values?.signatory_pan &&
                    values?.isSignatoryPanVerified &&
                    !errors.hasOwnProperty("signatory_pan") &&
                    !errors.hasOwnProperty("prevSignatoryPan") ? (
                    <span className="success input-group-append">
                      <img src={gotVerified} alt="" title="" width={'20px'} height={'20px'} className="btn-outline-secondary" />
                    </span>
                  ) : (
                    <div className="input-group-append">
                      <a
                        href={() => false}
                        className="btn cob-btn-primary text-white btn-sm"
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "signatory_pan",
                            setFieldValue
                          );
                        }}
                      >
                        {loadingForSiganatory ?
                          <span className="spinner-border spinner-border-sm" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                          :
                          "Verify"
                        }
                      </a>
                    </div>
                  )}
                </div>

                {errors?.signatory_pan && (
                  <span className="text-danger mb-0 d-flex">
                    {errors?.signatory_pan}
                  </span>
                )}
                {errors?.prevSignatoryPan && (
                  <span className="text-danger mb-0 d-flex">
                    {errors?.prevSignatoryPan}
                  </span>
                )}
                {errors?.isSignatoryPanVerified && (
                  <span className="text-danger mb-0 d-flex">
                    {errors?.isSignatoryPanVerified}
                  </span>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Business Name<span className="text-danger">*</span>
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
                  PAN Owner's Name<span className="text-danger">*</span>
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
                  Address<span className="text-danger">*</span>
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
                  City<span className="text-danger">*</span>
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
              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  State<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="select"
                  name="state_id"

                  options={BusinessOverview}
                  className="form-select"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>

              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  Pin Code<span className="text-danger">*</span>
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
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {VerifyKycStatus === "Verified" ? null : (
                  <button
                    type="submit"
                    disabled={disable}
                    className="float-lg-right cob-btn-primary text-white btn-sm btn border-0"
                  >
                    {disable && <>
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    </>}

                    {buttonText}
                  </button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessDetails;
