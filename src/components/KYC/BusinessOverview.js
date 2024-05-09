import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import Yup from "../../_components/formik/Yup";
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
import kycOperationService from "../../services/kycOperation.service";
// import { includes } from "lodash";

function BusinessOverview(props) {
  const setTab = props.tab;
  const setTitle = props.title;

  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [businessCategory, setBusinessCategory] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [disabled, setIsDisabled] = useState(false);
  const { auth, kyc } = useSelector((state) => state);
  const [transactionRangeOption, setTransactionRangeOption] = useState([]);
  const [avgTicketAmount, setAvgTicketAmount] = useState([]);

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

  // console.log("KycList", KycList)
  // *static data added after internal discussion
  const initialValues = {
    business_type: KycList.businessType,
    business_category: business_category_code,
    business_model: "Working",
    billing_label: KycList.billingLabel,
    erp_check: KycList.erpCheck === true ? "True" : "False",
    platform_id: KycList.platformId,
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

  const Regexx = {
    acceptAlphabet: /^[a-zA-Z,.\s]+$/, // Allow alphabet characters, commas, dots, and spaces
  };

  const RegexMssg = {
    acceptAlphabet: 'Please enter valid characters.',
  };

  const validationSchema = Yup.object(
    {
      business_type: Yup.string().required("Select Business Type").nullable(),
      business_category: Yup.string()
        .required("Select Business Category")
        .nullable(),
      platform_id: Yup.string()
        .required("Select the platform")
        .nullable(),
      billing_label: Yup.string()
        .trim()
        .min(1, 'Please enter more than 1 character')
        .max(250, 'Please do not enter more than 250 characters')
        .matches(Regexx.acceptAlphabet, RegexMssg.acceptAlphabet)
        .required('Required')
        .nullable(),

      website_app_url: Yup.string().when(["seletcted_website_app_url"], {
        is: "Yes",
        then: Yup.string()
          .matches(
            Regex.urlFormate, RegexMsg.urlFormate
          )
          .test('is-url', 'Please enter a valid website URL', (value) => {
            if (!value) return true; // Allow empty values
            try {
              new URL(value);
              return true;
            } catch (error) {
              return false;
            }
          })
          .required('Website App Url is required')
          .nullable(),
        otherwise: Yup.string().notRequired().nullable(),
      }),
      expected_transactions: Yup.string().trim().required("Required").nullable(),
      avg_ticket_size: Yup.string()
        .trim()

        .required("Required").nullable(),
      // .nullable(),
    },
    [["seletcted_website_app_url"]]
  );

  ////Get Api for Buisness overview///////////
  useEffect(() => {
    // business type
    dispatch(businessType())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "businessTypeId",
          "businessTypeText",
          resp.payload
        );
        setData(data);
      }).catch((err) => console.log(err));

    // busniessCategory
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

    // platform type
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

    // get slab data
    getExpectedTransactions("1");
    getExpectedTransactions("2");

  }, []);





  const onSubmit = (values) => {

    let expectedTxn = values.expected_transactions.split("-");
    let numbers = {};
    let maxValueTxn = 0;

    if (expectedTxn?.length === 1) {
      if (values.expected_transactions.includes("500000")) {
        maxValueTxn = 500000
      }
    } else {
      numbers = expectedTxn.map(part => parseInt(part));
      maxValueTxn = Math.max(...numbers);
    }
    const ticketSize = values.avg_ticket_size.split("-");
    const avgTicket = ticketSize.map(part => parseInt(part))
    const maxTicketSize = Math.max(...avgTicket);
    const avgCount = maxValueTxn * maxTicketSize;

    if (
      window.confirm(
        `Are you sure for the Expected Transaction : ${avgCount}`
      )
    ) {
      setIsDisabled(true)
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
          is_website_url: values.seletcted_website_app_url === "Yes" ? "True" : "False",
          website_app_url: values.website_app_url,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled" && res.payload.status) {
          toast.success(res.payload.message);
          setTab(3);
          setTitle("BUSINESS DETAILS");
          dispatch(kycUserList({ login_id: loginId }));
          dispatch(GetKycTabsStatus({ login_id: loginId }));
          setIsDisabled(false);
        } else {
          toast.error(res?.payload?.detail);
          setIsDisabled(false);
        }
      });
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
  // useEffect(() => {

  // }, []);

  const getExpectedTransactions = async (slabId) => {
    try {
      const response = await kycOperationService.expectedTransactions(slabId);
      if (response.status === 200) {
        if (slabId == 1) {
          setTransactionRangeOption(response.data.data);
        } else if (slabId == 2) {
          setAvgTicketAmount(response.data.data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
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

  const slabOptions = convertToFormikSelectJson(
    "id",
    "slab_range",
    transactionRangeOption
  );
  const ticketOptions = convertToFormikSelectJson(
    "id",
    "slab_range",
    avgTicketAmount
  );




  const tooltipData = {
    "expected_transaction_yr": "Expected transaction/year refers to the estimated number of transactions that are anticipated to occur within a specific time frame, typically a year",
    "avg_ticket_amount": "Average ticket amount refers to the average value or amount spent per transaction or customer."
  }


  return (
    <div className="col-lg-12 p-0">
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
                  Business Type<span className="text-danger">*</span>
                </label>

                <FormikController
                  control="select"
                  name="business_type"
                  options={data}
                  className="form-select"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  Business Category<span className="text-danger">*</span>
                </label>

                <FormikController
                  control="select"
                  name="business_category"
                  options={businessCategory}
                  className="form-select"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  Business Description <span className="text-danger">*</span>
                </label>

                <FormikController
                  control="textArea"
                  type="text"
                  name="billing_label"
                  className="form-control fs-12"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                />
                <p className="fs-10">
                  Please give a brief description of the nature of your
                  business. Please give examples of products you sell, business
                  category you operate in, your customers and channels through
                  which you operate (website, offline-retail).
                </p>
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
              <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  How do you wish to accept payments?
                  <span className="text-danger">*</span>
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
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  className="form-check-input"
                />

                {formik.values?.seletcted_website_app_url === "Yes" && (
                  <div className="row">
                    <div className="col-lg-10">
                      <label className="col-form-label p-2 mt-0">
                        Company Website / App URL
                        <span className="text-danger">*</span>
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
              <div className="col-sm-12 col-md-12 col-lg-4">
                <label className="col-form-label p-2 mt-0">
                  Platform Type<span className="text-danger">*</span>
                </label>

                <FormikController
                  control="select"
                  name="platform_id"
                  className="form-select"
                  valueFlag={false}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  options={platform}

                />
              </div>



              <div className="col-sm-12 col-md-12 col-lg-4">
                <label className="col-form-label p-2 mt-0" data-tip={tooltipData.expected_transaction_yr}>
                  Expected Trans./Year
                  <span className="text-danger">*</span>
                </label>

                <FormikController
                  control="select"
                  name="expected_transactions"
                  valueFlag={true}
                  className="form-select form-control"
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  options={slabOptions}

                />
              </div>

              <div className="col-sm-12 col-md-12 col-lg-4">
                <label className="col-form-label p-2 mt-0" data-tip={tooltipData.avg_ticket_amount}>
                  Avg Ticket Amount<span className="text-danger">*</span>
                </label>

                <FormikController
                  control="select"
                  type="text"
                  name="avg_ticket_size"
                  className="form-select form-control"
                  valueFlag={true}
                  disabled={VerifyKycStatus === "Verified" ? true : false}
                  readOnly={readOnly}
                  options={ticketOptions}
                // onClick={() => getExpectedTransactions(2)}
                />
              </div>


            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                {VerifyKycStatus === "Verified" ? (
                  <></>
                ) : (
                  <button
                    className="float-lg-right cob-btn-primary text-white btn btn-sm"
                    type="submit"
                    disabled={disabled}
                  >
                    {disabled && <>
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

export default BusinessOverview;
