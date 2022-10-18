import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
import API_URL from "../../config";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { Regex, RegexMsg } from "../../_components/formik/ValidationRegex";
import {
  businessType,
  busiCategory,
  platformType,
  collectionFrequency,
  collectionType,
  saveBusinessInfo,
  verifyKycEachTab,
} from "../../slices/kycSlice";

function BusinessOverview(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role, kycid } = props;
  const [data, setData] = useState([]);
  const [appUrl, setAppUrl] = useState("");
  const [notShowUrl, setnotShowUrl] = useState(false);
  const [businessCategory, setBusinessCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [CollectFreqency, setCollectFreqency] = useState([]);
  const [collection, setCollection] = useState([]);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;

  const KycList = useSelector((state) => state.kyc.kycUserList);

  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const dispatch = useDispatch();

  const ErpCheck = useSelector((state) => state.kyc.kycUserList.erpCheck);

  const ErpCheckStatus = () => {
    if (ErpCheck === true) return "Yes";
    else return "No";
  };

  const BuildYourForm = [
    { key: "Select", value: "Select Option" },
    { key: "yes", value: "Yes" },
    { key: "No", value: "No" },
  ];
  const Erp = [
    { key: "Select", value: "Select Option" },
    { key: "True", value: "Yes" },
    { key: "False", value: "No" },
  ];
  const WebsiteAppUrl = [
    { key: "Select Option", value: "Select Option" },
    { key: "No", value: "We do not have url" },
    { key: "Yes", value: "Website/App url" },
  ];

  // console.log(ErpCheck,"<======Erp Check=====>")
  // console.log(KycList, "<===List===>");

  // const erpCheck = () => {
  //   if(ErpCheck === true)
  //   return "Yes"
  //   else return "No"
  // }

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.kycVerificationForAllTabs.business_info_status
  );

  // const initialValues = {
  //   business_type: KycList.businessType,
  //   business_category: KycList.businessCategory,
  //   business_model: KycList.businessModel,
  //   billing_label: KycList.billingLabel,
  //   erp_check: KycList.erpCheck === true ? "True" : "False",
  //   platform_id: KycList.platformId,
  //   company_website: KycList.companyWebsite,
  //   seletcted_website_app_url: KycList?.is_website_url ? "Yes" : "No",
  //   website_app_url: KycList?.website_app_url,
  //   collection_type_id: KycList.collectionTypeId,
  //   collection_frequency_id: KycList.collectionFrequencyId,
  //   ticket_size: KycList.ticketSize,
  //   expected_transactions: KycList.expectedTransactions,
  //   form_build: KycList.formBuild,
  // };

  const initialValues = {
    business_type: KycList.businessType,
    business_category: KycList.businessCategory,
    business_model: "Working",
    billing_label: KycList.billingLabel,
    erp_check: KycList.erpCheck === true ? "True" : "False",
    platform_id: "1234567",
    company_website: KycList.companyWebsite,
    seletcted_website_app_url: KycList?.is_website_url ? "Yes" : "No",
    website_app_url: "False",
    avg_ticket_size: KycList?.avg_ticket_size,
    collection_type_id: "6752767",
    collection_frequency_id: "3787910",
    ticket_size: "10",
    expected_transactions: "",
    form_build: "Yes",
  };

  // const validationSchema = Yup.object({
  //   business_type: Yup.string().required("Select BusinessType").nullable(),
  //   business_category: Yup.string().required("Select Business Category").nullable(),
  //   business_model: Yup.string().required("Required").nullable(),
  //   billing_label: Yup.string().required("Required").nullable(),
  //   erp_check: Yup.string().required("Select Erp").nullable(),
  //   platform_id: Yup.string().required("Required").nullable(),
  //   seletcted_website_app_url: Yup.string().required("Select website app Url").nullable(),
  //   website_app_url: Yup.string().required("Required").nullable(),
  //   company_website: Yup.string().required("Required").nullable(),
  //   collection_type_id: Yup.string().required("Required").nullable(),
  //   collection_frequency_id: Yup.string().required("Required").nullable(),
  //   ticket_size: Yup.string().required("Required").nullable(),
  //   expected_transactions: Yup.string().required("Required").nullable(),
  //   form_build: Yup.string().required("Required").nullable(),
  // });
  const validationSchema = Yup.object({
    business_type: Yup.string()
      .required("Select BusinessType")
      .nullable(),
    business_category: Yup.string()
      .required("Select Business Category")
      .nullable(),
    billing_label: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    company_website: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required")
      .nullable(),
    expected_transactions: Yup.string()
      .required("Required")
      .matches(Regex.digit, RegexMsg.digit)
      .nullable(),
    avg_ticket_size: Yup.string()
      .matches(Regex.digit, RegexMsg.digit)
      .required("Required")
      .nullable(),
  });

  ////Get Api for Buisness overview///////////
  useEffect(() => {
    dispatch(businessType())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "businessTypeId",
          "businessTypeText",
          resp.payload
        );
        setData(data);
      })

      .catch((err) => console.log(err));
  }, []);

  //////////////////////BusinessCategory//////////
  useEffect(() => {
    dispatch(busiCategory())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "category_id",
          "category_name",
          resp.payload
        );

        setBusinessCategory(data);
      })
      .catch((err) => console.log(err));
  }, []);

  //////////////////APi for Platform
  useEffect(() => {
    dispatch(platformType())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "platformId",
          "platformName",
          resp.payload
        );
        setPlatform(data);
      })
      .catch((err) => console.log(err));
  }, []);

  ////////////////////////////////////////
  useEffect(() => {
    dispatch(collectionFrequency())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "collectionFrequencyId",
          "collectionFrequencyName",
          resp.payload
        );

        setCollectFreqency(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    dispatch(collectionType())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "collectionTypeId",
          "collectionTypeName",
          resp.payload
        );
        setCollection(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (values) => {
    // console.log(values, "===>");
    if (role.merchant) {
      dispatch(
        saveBusinessInfo({
          business_type: values.business_type,
          business_category: values.business_category,
          business_model: values.business_model,
          billing_label: values.billing_label,
          company_website: values.company_website,
          erp_check: values.erp_check,
          platform_id: values.platform_id,
          collection_type_id: values.collection_type_id,
          collection_frequency_id: values.collection_frequency_id,
          expected_transactions: values.expected_transactions,
          form_build: values.form_build,
          avg_ticket_size: values.avg_ticket_size,
          ticket_size: values.ticket_size,
          modified_by: loginId,
          login_id: loginId,
          is_website_url:
            values.seletcted_website_app_url === "Yes" ? "True" : "False",
          website_app_url: values.website_app_url,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled" && res.payload.status) {
          // console.log("This is the response", res);
          toast.success(res.payload.message);
          setTab(3);
          setTitle("BUSINESS DETAILS");
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      });
    } else if (role.verifier) {
      const veriferDetails = {
        login_id: kycid,
        business_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.business_info_status &&
            toast.success(resp?.payload?.business_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  const handleShowHide = (event) => {
    const getuser = event.target.value;
    setAppUrl(getuser);
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
    <div className="col-md-12 p-3">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label mt-0 p-2">
                <h4 class="text-kyc-label text-nowrap">
                  Business Type<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="select"
                  name="business_type"
                  options={data}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  Business Category<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="select"
                  name="business_category"
                  options={businessCategory}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* 
              <div className="form-group col-md-4">
              <label><h4 class ="font-weight-bold">Business Model <span style={{color:"red"}}>*</span></h4></label>
                
                <FormikController
                  control="input"
                  type="text"
                 
                  name="business_model"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  Business Label<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="textArea"
                  type="text"
                  name="billing_label"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div
                class="col-sm-7 col-md-7 col-lg-7 "
                style={{ marginLeft: "238px", color: "red", fontSize: "12px" }}
              >
                <span>
                  Please give a brief description of the nature of your
                  business. Please give examples of products you sell, business
                  categories you operate in, your customers and channels through
                  which you operate (website, offline retail).
                </span>
              </div>
            </div>

            {/* <div className="form-group col-md-4">
              <label><h4 class ="font-weight-bold">Do you have your own ERP<span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="select"
                  name="erp_check"
                  options={Erp}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* <div className="form-group col-md-4 mt-3">
              <label><h4 class ="font-weight-bold">Platform<span style={{color:"red"}}>*</span></h4></label>
                
                <FormikController
                  control="select"
                  name="platform_id"
                  options={platform}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* <div className="form-row">
              <div className="form-group col-md-4">
              <label><h4 class ="font-weight-bold">Website/App url<span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="select"
                  onChange={(e) => {
                    handleShowHide(e);
                    formik.setFieldValue(
                      "seletcted_website_app_url",
                      e.target.value
                    );
                  }}
                  name="seletcted_website_app_url"
                  options={WebsiteAppUrl}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* {formik.values?.seletcted_website_app_url === "Yes" && (
                <div className="form-group col-md-4">
                      <label><h4 class ="font-weight-bold">Enter Website/App url<span style={{color:"red"}}>*</span></h4></label>
                  <FormikController
                    control="input"
                    type="text"
                    name="website_app_url"
                    className="form-control"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                </div>
              )} */}

            {/* <div className="form-group col-md-4">
              <label><h4 class ="font-weight-bold">Type Of Collection <span style={{color:"red"}}>*</span></h4></label>
                
                <FormikController
                  control="select"
                  name="collection_type_id"
                  options={collection}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            {/* <div className="form-group col-md-4">
              <label><h4 class ="font-weight-bold">Collection Frequency <span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="select"
                  name="collection_frequency_id"
                  options={CollectFreqency}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  Company Website<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="company_website"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            {/* <div className="form-group col-md-4 mt-3">
              <label><h4 class ="font-weight-bold">Company website <span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="company_website"
                 
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}
            {/* 
              <div className="form-group col-md-4 mt-3">
              <label><h4 class ="font-weight-bold">Ticket size<span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="input"
                  type="text"
                  name="ticket_size"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div> */}

            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  Expected Transactions<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="expected_transactions"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-md-4 col-lg-4 col-form-label p-2 mt-0">
                <h4 class="text-kyc-label text-nowrap">
                  Avg Ticket Size<span style={{ color: "red" }}>*</span>
                </h4>
              </label>
              <div class="col-sm-7 col-md-7 col-lg-7">
                <FormikController
                  control="input"
                  type="text"
                  name="avg_ticket_size"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* <div className="form-group col-md-5">
              <label><h4 class ="font-weight-bold">Do you need SabPaisa to build your form<span style={{color:"red"}}>*</span></h4></label>
                <FormikController
                  control="select"
                  name="form_build"
                  options={BuildYourForm}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
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
              <div class="mt-2">
                <div class="row">
                  <div class="col-sm-11 col-md-11 col-lg-11 col-form-label">
                    {VerifyKycStatus === "Verified" ? null : (
                      <button
                        className="btn float-lg-right"
                        type="submit"
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

export default BusinessOverview;
