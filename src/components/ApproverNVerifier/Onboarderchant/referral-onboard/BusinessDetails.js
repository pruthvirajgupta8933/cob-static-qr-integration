import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { toast } from "react-toastify";
import gotVerified from "../../../../assets/images/verified.png";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";
import Yup from "../../../../_components/formik/Yup";
import FormikController from "../../../../_components/formik/FormikController";
import {
  businessOverviewState,
  panValidation,
  authPanValidation,
  gstValidation,
  kycUserList,
  GetKycTabsStatus,
} from "../../../../slices/kycSlice";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";

const BusinessDetails = ({ setCurrentTab }) => {
  const [BusinessOverview, setBusinessOverview] = useState([]);
  const dispatch = useDispatch();
  const initialValues = {
    gst: "",
    businessPan: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  };
  const validationSchema = Yup.object().shape({
    businessName: Yup.string()
      .matches(Regex.alphaBetwithhyphon, RegexMsg.alphaBetwithhyphon)

      .nullable(),
    gst: Yup.string()
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
    businessPan: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)

      .nullable(),
    isPanVerified: Yup.string().nullable(),

    signatory_pan: Yup.string()
      .allowOneSpace()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)

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
      .matches(Regex.pinCodeRegExp, RegexMsg.pinRegex)

      .nullable(),
    operational_address: Yup.string()
      .allowOneSpace()
      .matches(Regex.addressForSpecific, RegexMsg.addressForSpecific)

      .wordLength("Word character length exceeded")
      .max(120, "Address Max length exceeded, 120 charactes are allowed")
      .nullable(),
    registerd_with_gst: Yup.boolean().nullable(),
    registerd_with_udyam: Yup.boolean().nullable(),
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
    // console.log("useEffect call")
  }, []);

  const verifyGst = (gst, setFieldValue) => {
    dispatch(
      gstValidation({
        gst_number: gst,
        fetchFilings: false,
        fy: "2018-19",
      })
    ).then((res) => {
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setFieldValue("businessName", res?.payload?.trade_name);
        setFieldValue("pan", res?.payload?.pan);
        setFieldValue("isPanVerified", 1);
        setFieldValue("registered_with_gst", true);

        toast.success(res?.payload?.message);
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };
  const verifyPan = async (pan, setFieldValue) => {
    try {
      const res = await dispatch(authPanValidation({ pan_number: pan }));
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.status === true &&
        res.payload.valid === true
      ) {
        setFieldValue("isPanVerified", res.payload.status);
      } else {
        toast.error(res?.payload?.message);
      }
    } catch (error) {
      setFieldValue("isPanVerified", false);
    }
  };
  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-link1"
      role="tabpanel"
      aria-labelledby="v-pills-link1-tab"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        // onSubmit={onSubmit}
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
              <div className="col-sm-12 col-md-6 col-lg-6 marg-b pb-3">
                <label className="col-form-label pt-0 p-2 ">
                  GSTIN<span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <Field
                    type="text"
                    name="gst"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isGstVerified", "");
                      setFieldValue("gst", e.target.value);
                    }}
                  />

                  {values?.gst !== null &&
                  values?.gst !== undefined &&
                  values?.gst !== "" &&
                  values?.isGstVerified !== "" ? (
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
                      <a
                        href={() => false}
                        className="btn cob-btn-primary text-white btn-sm"
                        onClick={() => verifyGst(values.gst, setFieldValue)}
                      >
                        {/* {loadingForGst ? (
                                <span className="spinner-border spinner-border-sm">
                                  <span className="sr-only">Loading...</span>
                                </span>
                              ) : ( */}
                        Verify
                        {/* )} */}
                      </a>
                    </div>
                  )}
                </div>

                <ErrorMessage name="gst">
                  {(msg) => <p className="text-danger m-0">{msg}</p>}
                </ErrorMessage>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Business Name<span className="text-danger"></span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="businessName"
                  className="form-control"
                  // readOnly={readOnly === false ? true : readOnly}
                />
              </div>
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
                    name="businessPan"
                    className="form-control"
                    onChange={(e) => {
                      setFieldValue("isPanVerified", "");
                      const uppercaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                      setFieldValue("businessPan", uppercaseValue); // Set the uppercase value to form state
                    }}
                    // disabled={VerifyKycStatus === "Verified"}
                    // readOnly={JSON.parse(values?.registerd_with_gst)}
                  />

                  {values?.businessPan !== null &&
                  values?.isPanVerified !== "" &&
                  values?.businessPan !== "" &&
                  values?.businessPan !== undefined &&
                  !errors.hasOwnProperty("pan") ? (
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
                        href={() => false}
                        className="btn cob-btn-primary text-white btn btn-sm"
                        onClick={() => {
                          verifyPan(values.businessPan, setFieldValue);
                        }}
                      >
                        {/* {isLoading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </span>
                        ) : ( */}
                        Verify
                        {/* )} */}
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
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
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
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
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
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
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
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                <button
                  type="submit"
                  // disabled={disable}
                  className="float-lg-right cob-btn-primary text-white btn-sm btn border-0"
                  onClick={() => setCurrentTab("bank")}
                >
                  {/* {disable && <>
                      <span className="mr-2">
                        <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                        <span className="sr-only">Loading...</span>
                      </span>
                    </>} */}
                  Next
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default BusinessDetails;
