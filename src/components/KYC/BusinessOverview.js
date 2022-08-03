import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import { Zoom } from "react-toastify";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import API_URL from "../../config";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { FormatLineSpacing } from "@mui/icons-material";

function BusinessOverview() {
  const [data, setData] = useState([]);
  const [appUrl, setAppUrl] = useState("");
  const [notShowUrl, setnotShowUrl] = useState(false);
  const [platform, setPlatform] = useState([]);
  const [CollectFreqency, setCollectFreqency] = useState([]);
  const [collection, setCollection] = useState([]);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;

  const Buisnesscategory = [
    { key: "Select Option", value: "Select Option" },
    { key: "1", value: "1" },
    { key: "2", value: "2" },
  ];

  const GEtAllCollectionType = [
    { key: "Select", value: "Select" },
    { key: "collectionTypeId", value: "collectionTypeId" },
    { key: "collectionTypeName", value: "collectionTypeName" },
  ];
  const BuildYourForm = [
    { key: "Select", value: "Select Option" },
    { key: "yes", value: "Yes" },
    { key: "No", value: "No" },
  ];
  const Erp = [
    { key: "Select", value: "Select Option" },
    { key: true, value: "Yes" },
    { key: false, value: "No" },
  ];
  const WebsiteAppUrl = [
    { key: "Select Option", value: "Select Option" },
    { key: "No", value: "We do not have url" },
    { key: "Yes", value: "Website/App url" },
  ];

  const initialValues = {
    business_type: "",
    business_category: "",
    business_model: "",
    billing_label: "",
    erp_check: "",
    platform_id: "",
    company_website: "",
    seletcted_website_app_url: "",
    website_app_url: "",
    type_of_collection: "",
    collection_frequency_id: "",
    ticket_size: "",
    expected_transactions: "",
    form_build: "",
  };
  const validationSchema = Yup.object({
    business_type: Yup.string().required("Required"),
    business_category: Yup.string().required("Required"),
    business_model: Yup.string().required("Required"),
    billing_label: Yup.string().required("Required"),
    erp_check: Yup.boolean().required("Required"),
    platform_id: Yup.string().required("Required"),
    seletcted_website_app_url: Yup.string().required("Required"),
    website_app_url: Yup.string().required("Required"),
    company_website: Yup.string().required("Required"),
    // type_of_collection: Yup.string().required("Required"),
    collection_frequency_id: Yup.string().required("Required"),
    ticket_size: Yup.string().required("Required"),
    expected_transactions: Yup.string().required("Required"),
    form_build: Yup.string().required("Required"),
  });

  ////Get Api for Buisness overview///////////
  useEffect(() => {
    axios
      .get(API_URL.Business_type)
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "businessTypeId",
          "businessTypeText",
          resp.data
        );
      // console.log(data);

        setData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  //////////////////APi for Platform
  useEffect(() => {
    axios
      .get(API_URL.Platform_type)
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "platformId",
          "platformName",
          resp.data
        );
        // console.log(resp, "my all dattaaa")

        // console.log(data,"here is my get data")

        setPlatform(data);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    axios
      .get(API_URL.Collection_frequency)
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "collectionFrequencyId",
          "collectionFrequencyName",
          resp.data
        );
        // console.log(resp, "my all dattaaa")

        // console.log(data,"here is my get data")

        setCollectFreqency(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(API_URL.Get_ALL_Collection_Type)
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "collectionTypeId",
          "collectionTypeName",
          resp.data
        );
        // console.log(resp, "my all dattaaa")

        // console.log(data,"here is my get data")

        setCollection(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = async (values) => {
    const res = await axios.put(API_URL.save_Business_Info, {
      business_type: values.business_type,
      business_category: values.business_category,
      business_model: values.business_model,
      billing_label: values.billing_label,
      company_website: values.company_website,
      erp_check: true,
      platform_id: values.platform_id,
      collection_type_id: "499999998888",
      collection_frequency_id: values.collection_frequency_id,
      expected_transactions: values.expected_transactions,
      form_build: values.form_build,
      ticket_size: values.ticket_size,
      login_id: loginId,
    });

    // console.log(values, "form data");

    if (res.status === 200) {
      toast.success("File Upload Successfull");
    } else {
      toast.error("something went wrong");
    }
  };

  const handleShowHide = (event) => {
    const getuser = event.target.value;
    setAppUrl(getuser);

    // console.log(getuser, "222222222222222");
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
                  options={Buisnesscategory}
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
                  name="type_of_collection"
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
            </div>

            <div className="form-row">
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
