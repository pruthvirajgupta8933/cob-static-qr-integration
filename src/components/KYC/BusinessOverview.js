import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { useSelector,useDispatch} from "react-redux";
import * as Yup from "yup";
import API_URL from "../../config";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import {businessType,
  busiCategory,
  platformType,
  collectionFrequency,
  collectionType,
  saveBusinessInfo} from "../../slices/kycSlice"


function BusinessOverview() {
  const [data, setData] = useState([]);
  const [appUrl, setAppUrl] = useState("");
  const [notShowUrl, setnotShowUrl] = useState(false);
  const[businessCategory,setBusinessCategory]=useState([])
  const [platform, setPlatform] = useState([]);
  const [CollectFreqency, setCollectFreqency] = useState([]);
  const [collection, setCollection] = useState([]);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

const dispatch=useDispatch();

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

  const KycList = useSelector(
    (state) =>
      state.kyc.kycUserList
  );



  const initialValues = {
    business_type: KycList.businessType,
    business_category: KycList.businessCategory,
    business_model: KycList.businessModel,
    billing_label: KycList.billingLabel,
    erp_check: KycList.erpCheck,
    platform_id: KycList.platformId,
    company_website: KycList.companyWebsite,
    seletcted_website_app_url: "",
    website_app_url: KycList.successUrl,
    collection_type_id: KycList.collectionTypeId,
    collection_frequency_id: KycList.collectionFrequencyId,
    ticket_size: KycList.ticketSize,
    expected_transactions: KycList.expectedTransactions,
    form_build: KycList.formBuild,
  };
  const validationSchema = Yup.object({
    business_type: Yup.string().required("Select BusinessType"),
    business_category: Yup.string().required("Select Business Category"),
    business_model: Yup.string().required("Required"),
    billing_label: Yup.string().required("Required"),
    erp_check: Yup.string().required("Select Erp"),
    platform_id: Yup.string().required("Required"),
    seletcted_website_app_url: Yup.string().required("Select website app Url"),
    website_app_url: Yup.string().required("Required"),
    company_website: Yup.string().required("Required"),
    collection_type_id: Yup.string().required("Required"),
    collection_frequency_id: Yup.string().required("Required"),
    ticket_size: Yup.string().required("Required"),
    expected_transactions: Yup.string().required("Required"),
    form_build: Yup.string().required("Required"),
  });
  

  ////Get Api for Buisness overview///////////
  useEffect(() => {
   dispatch(businessType()).then((resp) => {
    const data = convertToFormikSelectJson( "businessTypeId",
    "businessTypeText",
    resp.payload
  );
     setData(data);
  })
    
      .catch((err) => console.log(err));
  }, []);


  //////////////////////BusinessCategory//////////
  useEffect(() => {
   dispatch(busiCategory()).then((resp) => {
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

  const onSubmit =  (values) => {
   dispatch(saveBusinessInfo ({
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
      ticket_size: values.ticket_size,
      modified_by:270,
      login_id: loginId,
      // client_code: clientCode,
    
    })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        console.log("This is the response", res);
        toast.success(res.payload.message);
      } else {
        toast.error(res.payload.message);

      }
    });
   

  };

  const handleShowHide = (event) => {
    const getuser = event.target.value;
    setAppUrl(getuser);
  };

  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
           
            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Business Type* "
                  name="business_type"
                  options={data}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Business Category *"
                  name="business_category"
                  options={businessCategory}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Business Model *"
                  name="business_model"
                  placeholder="Business Model"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Billing Label *"
                  name="billing_label"
                  placeholder="Billing Label"
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Do you have you own ERP *"
                  name="erp_check"
                  options={Erp}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Platform *"
                  name="platform_id"
                  options={platform}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  onChange={(e) =>
                  { 
                    handleShowHide(e);
                    formik.setFieldValue("seletcted_website_app_url",e.target.value)
                  }
                   
                  }
                  label="Website/App url *"
                  name="seletcted_website_app_url"
                  options={WebsiteAppUrl}
                  className="form-control"
                />
              </div>

              {formik.values?.seletcted_website_app_url ==="Yes" && (
                  <div className="form-group col-md-4">
                    <FormikController
                      control="input"
                      type="text"
                      label="Website/App url *"
                      name="website_app_url"
                      placeholder="Enter Website/App URL"
                      className="form-control"
                    />
                  </div>
                )}

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Type Of Collection *"
                  name="collection_type_id"
                  options={collection}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Collection Frequency *"
                  name="collection_frequency_id"
                  options={CollectFreqency}
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Company website *"
                  name="company_website"
                  placeholder="Enter Ticket Size"
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Ticket size *"
                  name="ticket_size"
                  placeholder="Enter Ticket Size"
                  className="form-control"
                />
              </div>
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Expected Transactions *"
                  name="expected_transactions"
                  placeholder="Enter Expected Transactions"
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="Do you need SabPaisa to built your form *"
                  name="form_build"
                  options={BuildYourForm}
                  className="form-control"
                />
              </div>
            </div>

           

            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BusinessOverview;
