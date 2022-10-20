import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import API_URL from "../../config";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import {
  businessOverviewState,
  saveMerchantInfo,
  verifyKycEachTab,
} from "../../slices/kycSlice";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";

function BusinessDetails(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  console.log(props, "====>");

  const { role, kycid } = props;
  const KycList = useSelector((state) => state.kyc.kycUserList);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.merchant_info_status
  );


  const regexGSTN = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
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

  // const initialValues = {
  //   company_name: KycList.companyName,
  //   company_logo: KycList.companyLogoPath,
  //   registerd_with_gst: KycList.registerdWithGST,
  //   gst_number: KycList.gstNumber,
  //   pan_card: KycList.panCard,
  //   signatory_pan: KycList.signatoryPAN,
  //   name_on_pancard: KycList.nameOnPanCard,
  //   pin_code: KycList.pinCode,
  //   city_id: KycList.cityId,
  //   state_id: KycList.stateId,
  //   registered_business_address: KycList.registeredBusinessAdress,
  //   operational_address: KycList.registeredBusinessAdress,
  //   checkBoxChoice: "",
  // };
  const initialValues = {
    company_name: KycList?.companyName,
    company_logo: "",
    registerd_with_gst: "True",
    gst_number: KycList?.gstNumber,
    pan_card: KycList?.panCard,
    signatory_pan: KycList?.signatoryPAN,
    name_on_pancard: KycList?.nameOnPanCard,
    pin_code: "",
    city_id: "",
    state_id: "",
    registered_business_address: "Delhi",
    operational_address: "",
    // checkBoxChoice: "",
  };

  // const initialValues = {
  //   company_name: KycList.companyName,
  //   gst_number: KycList.gstNumber,
  //   pan_card: KycList.panCard,
  //   signatory_pan: KycList.signatoryPAN,
  //   name_on_pancard: KycList.nameOnPanCard,

  // };
  // const validationSchema = Yup.object({

  //   company_name: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   registerd_with_gst: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   gst_number: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   pan_card: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   signatory_pan: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   name_on_pancard: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   pin_code: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   city_id: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   state_id: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   registered_business_address: Yup.string()
  //     .required("Required")
  //     .nullable(),
  //   operational_address: Yup.string()
  //     .when("checkBoxChoice", {
  //       is: "yes",
  //       then: Yup.string().required("Required"),
  //     })
  //     .nullable(),
  //   checkBoxChoice: Yup.array().nullable(),
  // });

  const validationSchema = Yup.object({
    company_name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    gst_number: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric).matches(regexGSTN,"GSTIN Number is Invalid")
      .required("Required")
      .nullable(),
    pan_card: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .required("Required")
      .nullable(),
    signatory_pan: Yup.string()
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .required("Required")
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
  });

  useEffect(() => {
    dispatch(businessOverviewState())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "stateId",
          "stateName",
          resp.payload
        );
         console.log(resp, "my all dattaaa")
        setBusinessOverview(data);
      })
      .catch((err) => console.log(err));
  }, []);

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
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          toast.success(res.payload.message);
          setTab(4);
          setTitle("BANK DETAILS");
        } else {
          toast.error("Something Went Wrong! Please try again.");
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

  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            {/* {console.log(formik)} */}
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div class="position-sticky pull-right">
                    <a
                      href={() => false}
                      className="btn btnbackground text-white btn-sm panbtn"
                      style={{
                        boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: "6px",
                      }}
                      onClick={() => {
                       console.log("Hello")
                      }}
                    >
                      Verify
                    </a>
                  </div>
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
                  name="signatory_pan"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div class="position-sticky pull-right">
                    <a
                      href={() => false}
                      className="btn btnbackground text-white btn-sm panbtn"
                      style={{
                        boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: "6px",
                      }}
                      onClick={() => {
                       console.log("Hello")
                      }}
                    >
                      Verify
                    </a>
                  </div>
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
                  name="pan_card"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div class="position-sticky pull-right">
                    <a
                      href={() => false}
                      className="btn btnbackground text-white btn-sm panbtn"
                      style={{
                        boxShadow: "0px 11px 14px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: "6px",
                      }}
                      onClick={() => {
                       console.log("Hello")
                      }}
                    >
                      Verify
                    </a>
                  </div>
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
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
