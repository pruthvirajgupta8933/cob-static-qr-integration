import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Yup from "../../../_components/formik/Yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import { updateMerchantInfo } from "../../../slices/editKycSlice";
import {
  gstValidation,
  advancePanValidation,
} from "../../../slices/kycValidatorSlice";
import {
  businessOverviewState,
  kycUserList,
  GetKycTabsStatus,
} from "../../../slices/kycSlice";

import { Regex, RegexMsg } from "../../../_components/formik/ValidationRegex";

import gotVerified from "../../../assets/images/verified.png";
import { isNull } from "lodash";
import { udyamValidate } from "../../../services/kyc/kyc-validate/kyc-validate.service";
import toastConfig from "../../../utilities/toastTypes";
import { cinValidation } from "../../../slices/kycValidatorSlice";

function BusinessDetailEdtKyc(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const selectedId = props.selectedId;
  const merchantloginMasterId = props.merchantloginMasterId;

  const reqexPinCode = /^[1-9][0-9]{5}$/;
  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { allTabsValidate, KycTabStatusStore } = kyc;


  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus;

  const KycList = kyc?.kycUserList;
  const { loginId } = user;
  const [BusinessOverview, setBusinessOverview] = useState([]);
  const VerifyKycStatus = KycTabStatusStore?.merchant_info_status;


  const buttonText = "Save and Next";
  const [udyamData, setUdyamData] = useState("");
  const [disable, setIsDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingForCin, setLoadingForCin] = useState(false);
  const [loadingForGst, setLoadingForGst] = useState(false);
  const [loadingForSiganatory, setLoadingForSignatory] = useState(false);
  const [isLoader, setIsloader] = useState(false);
  const [udyamResponseData, setUdyamResponseData] = useState({});
  const readOnly = false;

  const busiAuthFirstName =
    BusinessDetailsStatus.AuthPanValidation?.first_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation.first_name;
  const busiAuthLastName =
    BusinessDetailsStatus?.AuthPanValidation?.last_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation.last_name;

  let businessAuthName = `${busiAuthFirstName !== undefined ? busiAuthFirstName : ""
    } ${busiAuthLastName !== undefined ? busiAuthLastName : ""}`;

  const trimFullName = (strOne, strTwo) => {
    let fullStr = isNull(strOne) ? "" : strOne;
    fullStr += isNull(strTwo) ? "" : strTwo;
    return fullStr;
  };

  const radioBtnOptions = [
    { value: true, key: "Yes" },
    { value: false, key: "No" },
  ];

  let registerd_with_udyam;

  if (KycList?.is_udyam !== undefined && KycList?.is_udyam !== null) {
    try {
      registerd_with_udyam = JSON.parse(KycList.is_udyam);
    } catch (error) {
      registerd_with_udyam = {};
    }
  } else {
    registerd_with_udyam = {};
  }

  const initialValues = {
    company_name: KycList?.companyName,
    registerd_with_gst: KycList?.registerdWithGST ?? true,

    name_on_pancard:
      businessAuthName.length > 2 ? businessAuthName : KycList?.nameOnPanCard,
    pin_code: KycList?.merchant_address_details?.pin_code,
    city_id: KycList?.merchant_address_details?.city,
    state_id: KycList?.merchant_address_details?.state,
    registered_business_address: KycList?.merchant_address_details?.address,
    operational_address: KycList?.merchant_address_details?.address,

    gst_number: KycList?.gstNumber,
    prevGstNumber: KycList?.gstNumber?.length > 2 ? KycList?.gstNumber : "00",

    registerd_with_udyam: registerd_with_udyam,
    udyam_number: KycList?.udyam_data?.reg_number ?? "",
    prevUdyamNumber:
      KycList?.udyam_data?.reg_number?.length > 2
        ? KycList?.udyam_data?.reg_number
        : "0000",

    pan_card: KycList?.panCard,
    prev_pan_card: KycList?.panCard?.length > 2 ? KycList?.panCard : "pan",
    isPanVerified: KycList?.pan_card?.length > 9 && 1,

    signatory_pan: KycList?.signatoryPAN === null ? "" : KycList?.signatoryPAN,
    prevSignatoryPan: KycList?.signatoryPAN,
    isSignatoryPanVerified: KycList?.signatoryPAN?.length > 9 && 1,
    pan_dob_or_doi: KycList?.pan_dob_or_doi ?? "",
    father_name: KycList?.father_name ?? "",
    authorized_person_dob: KycList?.authorized_person_dob ?? "",
    cin_number: KycList?.cin ?? "",
    cin_data: {},
    prevCinNumber: KycList?.cin ?? "",
    isCinVerified: KycList?.cin ? true : false
  };



  const validationSchema = Yup.object().shape(
    {
      company_name: Yup.string()
        .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)

        .nullable(),
      gst_number: Yup.string()
        .allowOneSpace()
        .when(["registerd_with_gst"], {
          is: true,
          then: Yup.string()
            .trim()
            .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
            // .matches(regexGSTN, "GSTIN Number is Invalid")
            .required("Required")
            .nullable(),
          otherwise: Yup.string().notRequired().nullable(),
        }),
      prevGstNumber: Yup.string()
        .allowOneSpace()
        .when(["registerd_with_gst"], {
          is: true,
          then: Yup.string()
            .oneOf(
              [Yup.ref("gst_number"), null],
              "You need to verify Your GSTIN Number"
            )
            .required("You need to verify Your GSTIN Number")
            .nullable(),
          otherwise: Yup.string().notRequired().nullable(),
        }),

      udyam_number: Yup.string()
        .allowOneSpace()
        .when(["registerd_with_udyam"], {
          is: true,
          then: Yup.string()

            .max(25, "Invalid Format")

            .nullable(),
          otherwise: Yup.string().notRequired().nullable(),
        }),
      prevUdyamNumber: Yup.string()
        .allowOneSpace()
        .when(["registerd_with_udyam"], {
          is: true,
          then: Yup.string()
            .oneOf(
              [Yup.ref("udyam_number"), null],
              "You need to verify Your Udyam Reg. Number"
            )
            .required("Udyam Reg. Number Required")

            .nullable(),
          otherwise: Yup.string().notRequired().nullable(),
        }),
      pan_card: Yup.string()
        .allowOneSpace()
        .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)

        .nullable(),
      isPanVerified: Yup.string().nullable(),

      signatory_pan: Yup.string()
        .allowOneSpace()
        .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)

        .nullable(),
      isSignatoryPanVerified: Yup.string().allowOneSpace().nullable(),
      prevSignatoryPan: Yup.string()
        .allowOneSpace()
        .oneOf(
          [Yup.ref("signatory_pan"), null],
          "You need to verify Your Authorized Signatory PAN Number"
        )

        .nullable(),

      name_on_pancard: Yup.string()
        .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)

        .nullable(),
      city_id: Yup.string()
        .allowOneSpace()
        .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)

        .max(50, "City name character length exceeded")
        .wordLength("Word character length exceeded")
        .nullable(),
      state_id: Yup.string()
        .allowOneSpace()

        .nullable(),
      pin_code: Yup.string()
        .allowOneSpace()
        .matches(reqexPinCode, "Pin Code is Invalid")

        .nullable(),
      cin_number: Yup.string().nullable(),
      operational_address: Yup.string()
        .allowOneSpace()
        .matches(Regex.addressForSpecific, RegexMsg.addressForSpecific)

        .wordLength("Word character length exceeded")
        .max(120, "Address Max length exceeded, 120 charactes are allowed")
        .nullable(),
      registerd_with_gst: Yup.boolean().nullable(),
      registerd_with_udyam: Yup.boolean().nullable(),
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
    setIsLoading(true);

    dispatch(
      advancePanValidation({
        pan_number: values,
      })
    ).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true &&
          res.payload.valid === true
        ) {
          const fullNameByPan = trimFullName(
            res?.payload?.first_name,
            res?.payload?.last_name
          );
          setFieldValue(key, fullNameByPan);
          setFieldValue("pan_dob_or_doi", res?.payload?.dob);
          setFieldValue("pan_card", values);
          setFieldValue("prev_pan_card", values);
          setFieldValue("isPanVerified", 1);
          toast.success(res?.payload?.message);
          setIsLoading(false);
        } else {
          setFieldValue(key, "");
          setIsLoading(false);
          toast.error(res?.payload?.message ?? res.payload.data?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
    setIsLoading(false);
    // setRegisterWithGstState(false)
  };

  const gstinValidate = (values, key, setFieldValue) => {
    setLoadingForGst(true);
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
        const fullName = trimFullName(res?.payload?.trade_name, "");
        setFieldValue(key, fullName);
        setFieldValue("gst_number", values);
        setFieldValue("prevGstNumber", values);

        setFieldValue("pan_card", res?.payload?.pan);
        setFieldValue("prev_pan_card", res?.payload?.pan);
        setFieldValue("isPanVerified", 1);
        dispatch(advancePanValidation({ pan_number: res?.payload?.pan }))
          .then((res) => {
            if (res.payload?.dob)
              setFieldValue("pan_dob_or_doi", res.payload?.dob);
            else toastConfig.warningToast("Please verify PAN as well");
          })
          .catch((err) => toastConfig.errorToast(err.message));
        setFieldValue("registerd_with_gst", true);
        setFieldValue("registerd_with_udyam", false);
        setFieldValue("udyam_number", "");
        setLoadingForGst(false);

        toast.success(res?.payload?.message);
      } else {
        setFieldValue(key, "");
        toast.error(res?.payload?.message);
        setLoadingForGst(false);
      }
    });
  };


  const udyamValidation = (values, key, setFieldValue, setIsloader) => {
    setIsloader(true);
    setUdyamData("");

    udyamValidate({ reg_number: values })
      .then((resp) => {
        if (resp?.data?.valid === true) {
          setFieldValue(key, values);
          setFieldValue("prevUdyamNumber", values);
          setUdyamResponseData(resp?.data);
          toastConfig.successToast(resp?.data?.message);
          setUdyamData({
            entity: resp?.data?.entity,
            valid: resp?.data?.valid,
          });
        } else {
          setUdyamResponseData({});
          toastConfig.errorToast("Detail is not valid");
        }
        setIsloader(false);
      })
      .catch((err) => {
        setIsloader(false);
        toastConfig.errorToast(err.response?.data?.detail);
      });
  };

  const authValidation = (values, key, setFieldValue) => {
    setLoadingForSignatory(true);
    // console.log("auth", "auth pan")
    dispatch(
      advancePanValidation({
        pan_number: values,
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        const authName = res.payload.first_name + " " + res.payload?.last_name;

        setFieldValue(key, values);
        setLoadingForSignatory(false);
        setFieldValue("prevSignatoryPan", values);
        setFieldValue("name_on_pancard", authName);
        setFieldValue("isSignatoryPanVerified", 1);
        setFieldValue("authorized_person_dob", res?.payload?.dob);
        setFieldValue("father_name", res?.payload?.father_name);
        toast.success(res.payload.message);
      } else {
        toast.error(res?.payload?.message);
        setLoadingForSignatory(false);
        // setIsLoading(false)
      }
    });
  };

  const cinValidationField = (values, key, setFieldValue) => {
    setLoadingForCin(true);

    setFieldValue(key, values);
    setFieldValue("prevCinNumber", "");
    setFieldValue("cin_data", "");
    setFieldValue("isCinVerified", "");
    try {
      dispatch(cinValidation({ cin_number: values })).then(res => {
        console.log("res?.payload", res?.payload)
        setLoadingForCin(false);
        // console.log(res)
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true &&
          res.payload.valid === true
        ) {
          setFieldValue(key, values);
          setFieldValue("prevCinNumber", values);
          setFieldValue("cin_data", res?.payload);
          setFieldValue("isCinVerified", true);
          // console.log(res?.payload)
          // setCinData(res?.payload);
          // setCinStatus(res.payload.status);
        } else {
          setLoadingForCin(false);
          toastConfig.errorToast(
            res?.payload?.data?.message ?? res?.payload?.data?.detail ?? "Something went wrong"
          );
        }
      }).catch(error => {
        setLoadingForCin(false);
      })

    } catch (error) {
      setLoadingForCin(false);
    }

  };

  const checkInputIsValid = async (
    err,
    val,
    setErr,
    setFieldTouched,
    key,
    setFieldValue = () => { }
  ) => {
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
      setIsLoading(true);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "signatory_pan") {

      authValidation(
        val[key],
        "signatory_pan",
        setFieldValue,
        setLoadingForSignatory
      );
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "gst_number") {
      gstinValidate(val[key], "company_name", setFieldValue, setLoadingForGst);
      setLoadingForGst(true);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "udyam_number") {
      udyamValidation(val[key], "udyam_number", setFieldValue, setIsloader);
      setIsloader(true);
    }
    if (!hasErr && isValidVal && val[key] !== "" && key === "cin_number") {
      cinValidationField(val[key], "cin_number", setFieldValue);
      setLoadingForCin(true);
    }
  };

  const onSubmit = (values) => {

    const emptyFields = [
      "company_name",
      "gst_number",
      "registerd_with_gst",
      "gst_number",
      "pan_card",
      "signatory_pan",
      "name_on_pancard",
      "pin_code",
      "city_id",
      "state_id",
      "operational_address",
      "is_udyam",
      "udyam_data",
      "cin_number"
    ].some((field) => !values[field]);


    if (emptyFields) {
      const confirmSubmit = window.confirm(
        "Some fields are empty. Are you sure you want to proceed?"
      );

      if (!confirmSubmit) {
        return;
      }
    }


    setIsDisable(true);
    const postData = {
      login_id: selectedId,
      company_name: values.company_name,
      registerd_with_gst: JSON.parse(values.registerd_with_gst),
      gst_number: values.gst_number,
      pan_card: values.pan_card,
      pan_dob_or_doi: values.pan_dob_or_doi ?? values.signatory_pan_dob_or_doi,
      signatory_pan: values.signatory_pan,
      name_on_pancard: values.name_on_pancard,
      pin_code: values.pin_code,
      city_id: values.city_id,
      state_id: values.state_id,
      registered_business_address: values.registered_business_address, // Added missing value
      operational_address: values.operational_address,
      modified_by: loginId,
      is_udyam: JSON.parse(values.registerd_with_udyam),
      udyam_data: udyamResponseData,
      udyam_number: values.udyam_number, // Added missing value
      cin_number: values.cin_number,
      cin_data: values.cin_data,
      father_name: values.father_name, // Added missing value
      authorized_person_dob: values.authorized_person_dob, // Added missing value
    };


    dispatch(updateMerchantInfo(postData)).then((res) => {

      if (
        res?.meta?.requestStatus === "fulfilled" &&
        res?.payload?.status === true
      ) {
        // console.log("in if");
        toast.success(res?.payload?.message);
        setTab(4);
        setTitle("BANK DETAILS");
        dispatch(kycUserList({ login_id: selectedId, masking: 1 }));
        dispatch(GetKycTabsStatus({ login_id: selectedId }));
        setIsDisable(false);
      } else {
        // console.log("in else");
        toast.error(res?.payload);
        setIsDisable(false);
      }
    });
  };

  const registeredWithGstHandler = (value, setFieldValue) => {
    const valueGst = JSON.parse(value);
    setFieldValue("registerd_with_gst", valueGst);
    setFieldValue("gst_number", "");
    setFieldValue("prevGstNumber", "");

    setFieldValue("company_name", "");
    setFieldValue("pan_card", "");
    setFieldValue("prev_pan_card", "");

    setFieldValue("registerd_with_udyam", false);
    setFieldValue("udyam_number", "");
    setFieldValue("prevUdyamNumber", "");
  };

  const registeredWithUdyamHandler = (value, setFieldValue) => {
    setUdyamData("");
    const valueUdyam = JSON.parse(value);
    setFieldValue("registerd_with_udyam", valueUdyam);
    setFieldValue("udyam_number", "");
    setFieldValue("prevUdyamNumber", "");

    setFieldValue("gst_number", "");
    setFieldValue("company_name", "");
    setFieldValue("pan_card", "");
    setFieldValue("prev_pan_card", "");

    setUdyamResponseData({});
  };

  useEffect(() => {
    setUdyamResponseData(KycList?.udyam_data);
  }, [KycList]);

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
          setFieldTouched,
        }) => (
          <Form>
            <div className="row">

              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="">
                  <lable>Do you have a GST number? </lable>
                  <div className="d-flex d-flex justify-content-between w-50">
                    <FormikController
                      control="radio"
                      name="registerd_with_gst"
                      options={radioBtnOptions}
                      className="form-check-input"
                      onChange={(e) => {
                        registeredWithGstHandler(e.target.value, setFieldValue);
                      }}

                    />
                  </div>
                </div>

                {JSON.parse(values.registerd_with_gst) === false && (
                  <div className="mt-2">
                    <lable>Do you have a Udyam Number?</lable>
                    <div className="d-flex d-flex justify-content-between w-50">
                      <FormikController
                        control="radio"
                        name="registerd_with_udyam"
                        options={radioBtnOptions}
                        className="form-check-input"
                        onChange={(e) => {
                          registeredWithUdyamHandler(
                            e.target.value,
                            setFieldValue
                          );
                        }}

                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6 marg-b pb-3">

                {JSON.parse(values?.registerd_with_gst) === true && (
                  <React.Fragment>
                    <label className="col-form-label pt-0 p-2 ">
                      GSTIN<span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <Field
                        type="text"
                        name="gst_number"
                        className="form-control"

                      />

                      {values?.gst_number !== null &&
                        values?.gst_number !== undefined &&
                        values?.gst_number !== "" &&
                        !errors.hasOwnProperty("gst_number") &&
                        !errors.hasOwnProperty("prevGstNumber") ? (
                        <span className="success input-group-append">
                          <img
                            src={gotVerified}
                            alt=""
                            title=""
                            width={"20px"}
                            height={"20px"}
                            className="btn-outline-secondary"
                          />
                        </span>
                      ) : (
                        <div className="input-group-append">
                          <button
                            type="button"
                            className="btn cob-btn-primary text-white btn-sm"
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
                            {loadingForGst ? (
                              <span className="spinner-border spinner-border-sm">
                                <span className="sr-only">Loading...</span>
                              </span>
                            ) : (
                              "Verify"
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    <ErrorMessage name="gst_number">
                      {(msg) => <p className="text-danger m-0">{msg}</p>}
                    </ErrorMessage>
                    {errors?.prevGstNumber && (
                      <p className="text-danger m-0">{errors?.prevGstNumber}</p>
                    )}
                  </React.Fragment>
                )}



                {JSON.parse(values?.registerd_with_udyam) === true &&
                  JSON.parse(values?.registerd_with_gst) === false && (
                    <React.Fragment>
                      <label className="col-form-label pt-0 p-2">
                        Udyam Aadhaar Number
                        <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <Field
                          type="text"
                          name="udyam_number"
                          className="form-control"

                        />

                        {values?.udyam_number !== null &&
                          values?.udyam_number !== "" &&
                          values?.udyam_number !== undefined &&
                          !errors.hasOwnProperty("udyam_number") &&
                          !errors.hasOwnProperty("prevUdyamNumber") ? (
                          <span className="success input-group-append">
                            <img
                              src={gotVerified}
                              alt=""
                              title=""
                              width={"20px"}
                              height={"20px"}
                              className="btn-outline-secondary"
                            />
                          </span>
                        ) : (
                          <div className="input-group-append">
                            <button
                              type="button"
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
                              {isLoader ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </span>
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <ErrorMessage name="udyam_number">
                        {(msg) => <p className="text-danger">{msg}</p>}
                      </ErrorMessage>
                      {errors?.prevUdyamNumber && (
                        <p className="text-danger mb-0">
                          {errors?.prevUdyamNumber}
                        </p>
                      )}
                      <p className="m-0">{udyamData?.entity}</p>
                    </React.Fragment>
                  )}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-3 col-lg-3">

                <label className="col-form-label p-2">
                  Business PAN<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="pan_card"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isPanVerified", "");
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("pan_card", uppercaseValue); // Set the uppercase value to form state
                    }}

                  />

                  {values?.pan_card !== null &&
                    values?.isPanVerified !== "" &&
                    values?.pan_card !== "" &&
                    values?.pan_card !== undefined &&
                    !errors.hasOwnProperty("pan_card") &&
                    !errors.hasOwnProperty("prev_pan_card") &&
                    values?.pan_card === values?.prev_pan_card ? (
                    <span className="success input-group-append">
                      <img
                        src={gotVerified}
                        alt=""
                        title=""
                        width={"20px"}
                        height={"20px"}
                        className="btn-outline-secondary"
                      />
                    </span>
                  ) : (
                    <div className="input-group-append">
                      <button
                        type="button"
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
                        {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  )}
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
                
              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                 Business Pan DOB or DOI<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  // type="date"
                  name="pan_dob_or_doi"
                  className="form-control"

                />
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  Authorized Signatory PAN
                  <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="signatory_pan"
                    className="form-control"
                    // disabled={VerifyKycStatus === "Verified" ? true : false}
                    // readOnly={readOnly}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("signatory_pan", uppercaseValue); // Set the uppercase value to form state
                      setFieldValue("isSignatoryPanVerified", "");
                    }}
                  />
                  {values?.signatory_pan &&
                    values?.isSignatoryPanVerified &&
                    !errors.hasOwnProperty("signatory_pan") &&
                    !errors.hasOwnProperty("prevSignatoryPan") ? (
                    <span className="success input-group-append">
                      <img
                        src={gotVerified}
                        alt=""
                        title=""
                        width={"20px"}
                        height={"20px"}
                        className="btn-outline-secondary"
                      />
                    </span>
                  ) : (
                    <div className="input-group-append">
                      <button
                        type="button"
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
                        {loadingForSiganatory ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : (
                          "Verify"
                        )}
                      </button>
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

               <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  Authorized Person's DOB<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  // type="date"
                  name="authorized_person_dob"
                  className="form-control"

                />
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

                />
              </div>

              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  PAN Owner's Name<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="name_on_pancard"
                  className="form-control"

                />
              </div>
               <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  Father's Name<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="father_name"
                  className="form-control"

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

                />
              </div>
            
   <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  CIN
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="cin_number"
                    className="form-control"

                    readOnly={readOnly}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("cin_number", uppercaseValue); // Set the uppercase value to form state
                      setFieldValue("isCinVerified", false);
                    }}
                  />
                  {values?.cin_number &&
                    values?.isCinVerified &&
                    !errors.hasOwnProperty("cin_number") &&
                    !errors.hasOwnProperty("prevCinNumber") ? (
                    <span className="success input-group-append">
                      <img
                        src={gotVerified}
                        alt=""
                        title=""
                        width={"20px"}
                        height={"20px"}
                        className="btn-outline-secondary"
                      />
                    </span>
                  ) : (
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn cob-btn-primary text-white btn-sm"
                        disabled={loadingForCin}
                        onClick={() => {
                          checkInputIsValid(
                            errors,
                            values,
                            setFieldError,
                            setFieldTouched,
                            "cin_number",
                            setFieldValue
                          );
                        }}
                      >

                        {loadingForCin ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {errors?.cin_number && (
                  <span className="text-danger mb-0 d-flex">
                    {errors?.cin_number}
                  </span>
                )}
              </div>

            </div>
            <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  City<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="city_id"
                  className="form-control"

                />
              </div>
              <div className="col-sm-12 col-md-3 col-lg-3">
                <label className="col-form-label mt-0 p-2">
                  State<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="select"
                  name="state_id"
                  options={BusinessOverview}
                  className="form-select"

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

                />
              </div>


            </div>
        

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                <button
                  type="submit"
                  disabled={disable}
                  className="float-lg-right cob-btn-primary text-white btn-sm btn border-0"
                >
                  {disable && (
                    <>
                      <span className="mr-2">
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          ariaHidden="true"
                        />
                        <span className="sr-only">Loading...</span>
                      </span>
                    </>
                  )}

                  {buttonText}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessDetailEdtKyc;
