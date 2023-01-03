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
  gstValidation,
  kycUserList,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import gotVerified from "../../assets/images/verified.png";

function BusinessDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const { role, kycid } = props;

  const regexGSTN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const reqexPAN = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  const reqexPinCode = /^[1-9][0-9]{5}$/

  const { auth, kyc } = useSelector((state) => state);

  const { user } = auth;
  const { allTabsValidate, KycTabStatusStore } = kyc;
  const VerifyKycStatus = KycTabStatusStore?.merchant_info_status;

  const BusinessDetailsStatus = allTabsValidate?.BusinessDetailsStatus;
  const KycList = kyc?.kycUserList;

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

  const notValid = useSelector(
    (state) =>
      state.kyc.allTabsValidate.BusinessDetailsStatus.AuthPanValidation.message
  );
  const busiFirstName =
    BusinessDetailsStatus?.PanValidation?.first_name === null
      ? ""
      : BusinessDetailsStatus?.PanValidation?.first_name;

  const busiLastName =
    BusinessDetailsStatus?.PanValidation?.last_name === null
      ? ""
      : BusinessDetailsStatus?.PanValidation?.last_name;

  const busiAuthFirstName =
    BusinessDetailsStatus.AuthPanValidation.first_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation.first_name;

  const busiAuthLastName =
    BusinessDetailsStatus?.AuthPanValidation?.last_name === null
      ? ""
      : BusinessDetailsStatus?.AuthPanValidation.last_name;

  let businessNamee = `${busiFirstName} ${busiLastName}`;
  let businessAuthName = `${
    busiAuthFirstName !== undefined ? busiAuthFirstName : ""
  } ${busiAuthLastName !== undefined ? busiAuthLastName : ""}`;

  const panValidate = (values) => {
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
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const gstinValidate = (values) => {
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
        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
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

  const initialValues = {
    company_name:
      gstinData?.trade_name?.length > 2
        ? gstinData?.trade_name
        : KycList?.companyName,
    company_logo: "",
    registerd_with_gst: "True",
    gst_number: KycList?.gstNumber,
    oldGstNumber: KycList?.gstNumber,
    pan_card: gstinData?.pan?.length > 2 ? gstinData?.pan : KycList?.panCard,
    signatory_pan: KycList?.signatoryPAN === null ? "" : KycList?.signatoryPAN,
    oldSignatoryPan: KycList?.signatoryPAN,
    name_on_pancard:
      businessAuthName.length > 2 ? businessAuthName : KycList?.nameOnPanCard,
    pin_code: KycList?.merchant_address_details?.pin_code,
    city_id: KycList?.merchant_address_details?.city,
    state_id: KycList?.merchant_address_details?.state,
    registered_business_address: KycList?.merchant_address_details?.address,
    operational_address: KycList?.merchant_address_details?.address,
    isPANVerified: KycList?.panCard !== null ? "1" : "",
    isAuthPANVerified: KycList?.signatoryPAN !== null ? "1" : "",
    isGSTINVerified: KycList?.gstNumber !== null ? "1" : "",
  };

  const validationSchema = Yup.object({
    company_name: Yup.string().trim()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    gst_number: Yup.string().trim()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .matches(regexGSTN, "GSTIN Number is Invalid")
      .required("Required")
      .nullable(),
    oldGstNumber: Yup.string()
      .oneOf(
        [Yup.ref("gst_number"), null],
        "You need to verify Your GSTIN Number"
      )
      .required("You need to verify Your GSTIN Number")
      .nullable(),
    pan_card: Yup.string().trim()
      .matches(reqexPAN, "PAN number is Invalid")
      .required("Required")
      .nullable(),
    signatory_pan: Yup.string().trim()
      .matches(reqexPAN, "Authorized PAN number is Invalid")
      .required("Required")
      .nullable(),
    oldSignatoryPan: Yup.string()
      .oneOf(
        [Yup.ref("signatory_pan"), null],
        "You need to verify Your Authorized Signatory PAN Number"
      )
      .required("You need to verify Your Authorized Signatory PAN Number")
      .nullable(),
    name_on_pancard: Yup.string().trim()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)
      .required("Required")
      .nullable(),
    city_id: Yup.string().trim()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    state_id: Yup.string()
      .required("Required")
      .nullable(),
    pin_code: Yup.string().trim()
      .matches(reqexPinCode, "Pin Code is Invalid")
      .required("Required")
      .nullable(),
    operational_address: Yup.string().trim()
    .matches(Regex.addressForSpecific, RegexMsg.addressForSpecific)
      .required("Required")
      .nullable(),
  });

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
  }, []);

  const checkInputIsValid = (err, val, setErr, setFieldTouched, key) => {
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
          dispatch(kycUserList({ login_id: loginId }));
        } else {
          toast.error(res?.payload?.message);
        }
      });
    } 
    // else if (role.verifier) {
    //   const veriferDetails = {
    //     login_id: kycid,
    //     merchant_info_verified_by: loginId,
    //   };
    //   dispatch(verifyKycEachTab(veriferDetails))
    //     .then((resp) => {
    //       resp?.payload?.merchant_info_status &&
    //         toast.success(resp?.payload?.merchant_info_status);
    //       resp?.payload?.detail && toast.error(resp?.payload?.detail);
    //     })
    //     .catch((e) => {
    //       toast.error("Try Again Network Error");
    //     });
    // }
  };

  // useEffect(() => {
  //   if (role.approver) {
  //     setReadOnly(true);
  //     setButtonText("Approve and Next");
  //   } else if (role.verifier) {
  //     setReadOnly(true);
  //     setButtonText("Verify and Next");
  //   }
  // }, [role]);

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
          handleChange,
        }) => (
          <Form>
            
            <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 marg-b">
              <label className="col-form-label mt-0 p-2">
                GSTIN<span style={{ color: "red" }}>*</span>
              </label>
              <FormikController
                control="input"
                type="text"
                name="gst_number"
                className="form-control"
                disabled={VerifyKycStatus === "Verified" ? true : false}
                readOnly={readOnly}
              />
              {KycList?.gstNumber !== null &&
              !errors.hasOwnProperty("gst_number") &&
              !errors.hasOwnProperty("oldGstNumber") ? (
                <span className="success">
                  <img src={gotVerified} alt="" title="" width="26" />
                </span>
              ) : (
                <div className="position-sticky pull-right- otpbtngst">
                  <a
                    href={() => false}
                    className="btn btnbackground text-white btn-sm panbtn "
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
                    Verify GST
                  </a>
                </div>
              )}
              {errors?.oldGstNumber && (
                <span className="notVerifiedtext- text-danger mb-0">
                  {errors?.oldGstNumber}
                </span>
              )}
            </div>
            </div>
            <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <label className="col-form-label mt-0 p-2">
                Business PAN<span style={{ color: "red" }}>*</span>
              </label>
              <FormikController
                control="input"
                type="text"
                name="pan_card"
                className="form-control"
                readOnly={readOnly === false ? true : readOnly}
              />
            </div>

            <div className="col-sm-12 col-md-6 col-lg-6">
              <label className="col-form-label mt-0 p-2">
                Authorized Signatory PAN <span style={{ color: "red" }}>*</span>
              </label>
              <FormikController
                control="input"
                type="text"
                name="signatory_pan"
                className="form-control"
                disabled={VerifyKycStatus === "Verified" ? true : false}
                readOnly={readOnly}
              />

              {KycList?.signatoryPAN !== null &&
              !errors.hasOwnProperty("signatory_pan") &&
              !errors.hasOwnProperty("oldSignatoryPan") ? (
                <span className="success">
                  <img src={gotVerified} alt="" title="" width="26" />
                </span>
              ) : (
                <div className="position-sticky pull-right- otpbtndetail">
                  <a
                    href={() => false}
                    className="btn btnbackground text-white btn-sm panbtn- "
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

              {errors?.oldSignatoryPan && (
                <span className="notVerifiedtext- text-danger mb-0">
                  {errors?.oldSignatoryPan}
                </span>
              )}
            </div>
            </div>
            <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <label className="col-form-label mt-0 p-2">
                {" "}
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
                        className="btn float-lg-right btnbackground text-white"
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
