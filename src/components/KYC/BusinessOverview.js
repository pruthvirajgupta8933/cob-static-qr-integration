import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
// import * as Yup from "yup";
import Yup from "../../_components/formik/Yup"
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
  kycUserList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";

function BusinessOverview(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role } = props;
  const [data, setData] = useState([]);
  const [businessCategory, setBusinessCategory] = useState([]);
  const [disabled, setIsDisabled] = useState(false)
  const { auth, kyc } = useSelector((state) => state);

  let readOnly = false;
  let buttonText = "Save and Next";


  const { user } = auth;
  let clientMerchantDetailsList = {};
  if (
    user?.clientMerchantDetailsList &&
    user?.clientMerchantDetailsList?.length > 0
  ) {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const KycList = kyc?.kycUserList;
  const KycTabStatusStore = kyc?.KycTabStatusStore;

  const { business_cat_code } = clientMerchantDetailsList[0];

  const { loginId } = user;

  const dispatch = useDispatch();



  const WebsiteAppUrl = [
    { key: "Without website/app", value: "No" },
    { key: "On my website/app", value: "Yes" },
  ];

  const VerifyKycStatus = KycTabStatusStore?.business_info_status;
  
  // check if data exists
  let business_category_code;
  if (business_cat_code !== null) {
    business_category_code = business_cat_code;
  }
  if (KycList?.businessCategory !== null) {
    business_category_code = KycList?.businessCategory;
  }

  const initialValues = {
    business_type: KycList.businessType,
    business_category: business_category_code,
    business_model: "Working",
    billing_label: KycList.billingLabel,
    erp_check: KycList.erpCheck === true ? "True" : "False",
    platform_id: "1234567",
    // company_website: KycList.companyWebsite,
    seletcted_website_app_url: KycList?.is_website_url ? "Yes" : "No",
    website_app_url: KycList?.website_app_url,
    avg_ticket_size: KycList?.avg_ticket_size,
    collection_type_id: "6752767",
    collection_frequency_id: "3787910",
    ticket_size: "10",
    expected_transactions: KycList?.expectedTransactions,
    form_build: "Yes",
  };

  const validationSchema = Yup.object(
    {
      business_type: Yup.string()
        .required("Select Business Type")
        .nullable(),
      business_category: Yup.string()
        .required("Select Business Category")
        .nullable(),
      billing_label: Yup.string()
        .trim()
        .min(1, "Please enter more than 1 character")
        .max(250, "Please do not enter more than 250 characters")
        .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
        .required("Required")
        .wordLength("Word character length exceeded")
        .nullable(),
      // company_website: Yup.string().trim()
      //   .matches(urlRegex, "Website Url is not Valid")
      //   .required("Required")
      //   .nullable(),
      website_app_url: Yup.string().when(["seletcted_website_app_url"], {
        is: "Yes",
        then: Yup.string()
          .url("Please enter the valid website url")
          .trim()
          .ensure()
          .required("Website App Url is required")
          .nullable(),
        otherwise: Yup.string()
          .notRequired()
          .nullable(),
      }),
      expected_transactions: Yup.string()
        .trim()
        .required("Required")
        .matches(Regex.digit, RegexMsg.digit)
        .test("IntergerRequired", "Value should be more then 1", (val) => {
        return val > 0
        })
        .min(1,"Please enter more than 1 character")
        .max(19,"Please do not enter more then 19 characters")
        .nullable(),

      avg_ticket_size: Yup.string()
        .trim()
        .matches(Regex.digit, RegexMsg.digit)
        .min(1,"Please enter more than 1 character")
        .max(19,"Please do not enter more then 19 characters")
        .test("IntergerRequired", "Value should be more then 1", (val) => {
          return val > 0
          })
        .required("Required")
        .nullable(),
    },
    [["seletcted_website_app_url"]]
  );

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
        // setPlatform(data);
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

        // setCollectFreqency(data);
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
        // setCollection(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = (values) => {
    if (role.merchant) {
      // setIsDisabled(true)
      if (window.confirm(`Are you sure for the Expected Transaction : ${values.expected_transactions}`)) {
        
      dispatch(
        saveBusinessInfo({
          business_type: values.business_type,
          business_category: values.business_category,
          business_model: values.business_model,
          billing_label: values.billing_label,
          company_website: "NA",
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
          toast.success(res.payload.message);
          setTab(3);
          setTitle("BUSINESS DETAILS");
          dispatch(kycUserList({ login_id: loginId }));
          dispatch(GetKycTabsStatus({ login_id: loginId }));
          setIsDisabled(false)
        } else {
          toast.error(
            res?.payload?.message
              ? res?.payload?.message
              : "Something Went Wrong! Please try again after some time."
          );
          setIsDisabled(false)
        }
      });
    }
    }
   
  };

  // let converter = require('number-to-words');




  // function div(x) {
  //   if(!isNaN(x) && !isNull(x)){
  //     const xx = parseFloat(x)
  //     if (isFinite(1000 / xx)) {
  //       console.log( "this is chnages value",converter.toWords(xx))
  //     }else{
  //       console.log( "this is chnages value----"+ xx)

  //     }
  //   }


  // }

  const handleShowHide = (event) => {
    const getuser = event.target.value;
    // setAppUrl(getuser);
  };
//////////////////////////////////// Check for finite number
  // useEffect(() => {
  //   const number = numberChnaged;
  //   if (number?.length > 1) {
  //     if (!isNaN(number) && !isNull(number)) {
  //       const xx = parseFloat(number)
  //       if (isFinite(1000 / xx)) {
  //         setTextWord(converter.toWords(xx))
  //       } else {
  //         setTextWord("")


  //       }
  //     }
  //   }

  // }, [numberChnaged])

  ////////////////////////////////

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
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
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
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label p-2 mt-0">
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
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label className="col-form-label p-2 mt-0">
                  Business Description <span style={{ color: "red" }}>*</span>
                </label>

                <FormikController
                  control="textArea"
                  type="text"
                  name="billing_label"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
                <p>Please give a brief description of the nature of your business. Please give examples of products you sell, business category you operate in, your customers and channels through which you operate (website, offline retail).</p>
                <div className="my-5- p-2- w-100 pull-left">
                  <hr
                    style={{
                      borderColor: "#D9D9D9",
                      textShadow: "2px 2px 5px grey",
                      width: "100%",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <label className="col-form-label p-2 mt-0">
                  How do you wish to accept payments?
                  <span style={{ color: "red" }}>*</span>
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
                  <div className="row">
                    <div className="col-lg-10">
                      <label className="col-form-label p-2 mt-0">
                        Company Website / App URL 
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <FormikController
                        control="input"
                        type="text"
                        name="website_app_url"
                        placeHolder="Enter your website/app URL"
                        className="form-control pull-left"
                        disabled={VerifyKycStatus === "Verified" ? true : false}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              {/* <div className="col-sm-4 col-md-4 col-lg-4">
              <label className="col-form-label p-2 mt-0">
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
            </div> */}

              <div className="col-sm-4 col-md-4 col-lg-4">
                <label className="col-form-label p-2 mt-0">
                  Expected Transaction/Year<span style={{ color: "red" }}>*</span>
                 
                </label>

              <FormikController
                  control="input"
                  type="text"
                  name="expected_transactions"
                  className="form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
                 {/* <span className="font-weight-bold m-0">{textWord}</span> */}
                {/* {formik.handleChange(
                  "expected_transactions",
                  setNumberChanged(formik?.values?.expected_transactions)
                )} */}
              </div>

              <div className="col-sm-4 col-md-4 col-lg-4">
                <label className="col-form-label p-2 mt-0">
                  Avg Ticket Amount<span style={{ color: "red" }}>*</span>
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
            </div>
            <div className="my-5- p-2- w-100 pull-left">
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                }}
              />
              <div className="mt-2">
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                    {VerifyKycStatus === "Verified" ? (
                      <></>
                    ) : (
                      <button
                        className="save-next-btn float-lg-right btnbackground text-white"
                        type="submit"
                        disabled={disabled}
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
