import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";
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
  kycUserList,
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

  const {auth , kyc} =useSelector((state) => state) 
  
  const { user } = auth;
  let clientMerchantDetailsList = {}
  if (user?.clientMerchantDetailsList && user?.clientMerchantDetailsList?.length > 0) {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const KycList = kyc?.kycUserList;
  const KycTabStatusStore = kyc?.KycTabStatusStore
  // console.log("KycTabStatusStore",KycTabStatusStore)

  const { clientCode, business_cat_code } = clientMerchantDetailsList[0];

  const { loginId } = user;

  const dispatch = useDispatch();

  const ErpCheck = KycList?.erpCheck;

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
    { key: "Without Website/app", value: "No" },
    { key: "On my website/app", value: "Yes" },
  ];

  const VerifyKycStatus = KycTabStatusStore?.business_info_status

  const urlRegex = "((http|https)://)(www.)?"
    + "[a-zA-Z0-9@:%._\\+~#?&//=]"
    + "{2,256}\\.[a-z]"
    + "{2,6}\\b([-a-zA-Z0-9@:%"
    + "._\\+~#?&//=]*)";


  // check if data exists 
  let business_category_code;
  if (business_cat_code !== null) {
    business_category_code = business_cat_code
  }
  if (KycList?.businessCategory !== null) {
    business_category_code = KycList?.businessCategory
  }


  const initialValues = {
    business_type: KycList.businessType,
    business_category: business_category_code,
    business_model: "Working",
    billing_label: KycList.billingLabel,
    erp_check: KycList.erpCheck === true ? "True" : "False",
    platform_id: "1234567",
    company_website: KycList.companyWebsite,
    seletcted_website_app_url: KycList?.is_website_url ? "Yes" : "No",
    website_app_url: KycList?.website_app_url,
    avg_ticket_size: KycList?.avg_ticket_size,
    collection_type_id: "6752767",
    collection_frequency_id: "3787910",
    ticket_size: "10",
    expected_transactions: KycList?.expectedTransactions,
    form_build: "Yes",
  };

  
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
      .matches(urlRegex, "Website Url is not Valid")
      .required("Required")
      .nullable(),
      website_app_url: Yup.string().when(['seletcted_website_app_url'], {
        is: "Yes",
        then: Yup.string().ensure().required("Website App Url is required").nullable(),
        otherwise:Yup.string().notRequired().nullable()
      }),
    expected_transactions: Yup.string()
      .required("Required")
      .matches(Regex.digit, RegexMsg.digit)
      .nullable(),
    avg_ticket_size: Yup.string()
      .matches(Regex.digit, RegexMsg.digit)
      .required("Required")
      .nullable(),
  },[['seletcted_website_app_url']]);

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
          is_website_url: values.seletcted_website_app_url === "Yes" ? "True" : "False",
          website_app_url: values.website_app_url,
        })
      ).then((res) => {

        if (res.meta.requestStatus === "fulfilled" && res.payload.status) {
          // console.log("This is the response", res);
          toast.success(res.payload.message);
          setTab(3);
          setTitle("BUSINESS DETAILS");
          dispatch(kycUserList({ login_id: loginId }))

        } else {
          toast.error(res?.payload?.message ? res?.payload?.message: "Something Went Wrong! Please try again after some time.");
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

  // console.log("seletcted_website_app_url",initialValues)

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
            <div class="col-sm-6 col-md-6 col-lg-6">
              <label class="col-form-label mt-0 p-2">
                
                  Business Type<span style={{ color: "red" }}>*</span>
                
              </label>
              
                <FormikController
                  control="select"
                  name="business_type"
                  options={data}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
             
            </div>
            <div class="col-sm-6 col-md-6 col-lg-6">
              <label class="p-2 mt-0">
                
                  Business Category<span style={{ color: "red" }}>*</span>
                
              </label>
              
                <FormikController
                  control="select"
                  name="business_category"
                  options={businessCategory}
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12">
              <label class="col-form-label p-2 mt-0">
               
                  Business Label <span style={{ color: "red" }}>*</span> 
                 
              </label>
              
              
                <FormikController
                  control="textArea"
                  type="text"
                  name="billing_label"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
                  <span style={{fontSize: "13px" }}>
                  Please give a brief description of the nature of your
                  business. Please give examples of products you sell, business
                  categories you operate in, your customers and channels through
                  which you operate (website, offline retail).
                </span>

                <div class="my-5- p-2- w-100 pull-left">
                  <hr style={{ borderColor: "#D9D9D9", textShadow: "2px 2px 5px grey", width: "100%",}}/>
                </div>
              
            </div>

            <div class="col-sm-12 col-md-12 col-lg-12">
              <label class="col-form-label p-2 mt-0">
               
                  How do you wish to accept payments?<span style={{ color: "red" }}>*</span>
               
              </label>
              
                <FormikController
                  control="radio"
                  onChange={(e) => {
                    handleShowHide(e);
                    formik.setFieldValue(
                      "seletcted_website_app_url",
                      e.target.value
                    );
                  }}
                  name="seletcted_website_app_url"
                  options={WebsiteAppUrl}
                  className="form-control pull-left mr-2"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
                {formik.values?.seletcted_website_app_url === "Yes" && (
                <div className="form-group">
                  <FormikController
                    control="input"
                    type="text"
                    name="website_app_url"
                    placeHolder="Enter your website/ app URL"
                    className="form-control pull-left"
                    disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                </div>
              )}
              
              
            </div>



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
            <div class="col-sm-4 col-md-4 col-lg-4">
              <label class="col-form-label p-2 mt-0">
                
                  Company Website<span style={{ color: "red" }}>*</span>
                
              </label>
              
                <FormikController
                  control="input"
                  type="text"
                  name="company_website"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              
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

            <div class="col-sm-4 col-md-4 col-lg-4">
              <label class="col-form-label p-2 mt-0">
                
                  Expected Transactions<span style={{ color: "red" }}>*</span>
                
              </label>
              
                <FormikController
                  control="input"
                  type="text"
                  name="expected_transactions"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            
            <div class="col-sm-4 col-md-4 col-lg-4">
              <label class="col-form-label p-2 mt-0">
               
                  Avg Ticket Size<span style={{ color: "red" }}>*</span>
               
              </label>
              
                <FormikController
                  control="input"
                  type="text"
                  name="avg_ticket_size"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
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

            <div class="my-5- p-2- w-100 pull-left">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div class="mt-2">
                <div class="row">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-form-label">
                  {/* {console.log("VerifyKycStatus",VerifyKycStatus)} */}
                    {VerifyKycStatus === "Verified" ? null : (
                      <button
                        className="btn float-lg-right btnbackground text-white"
                        type="submit"
                        
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

export default BusinessOverview;
