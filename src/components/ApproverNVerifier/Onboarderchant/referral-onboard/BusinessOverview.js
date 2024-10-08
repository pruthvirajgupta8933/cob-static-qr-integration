import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../../_components/formik/Yup";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../../_components/formik/FormikController";

import toastConfig from "../../../../utilities/toastTypes";
import { businessType, busiCategory } from "../../../../slices/kycSlice";
import { saveBusinessOverview } from "../../../../slices/approver-dashboard/referral-onboard-slice";

const BusinessOverview = ({ setCurrentTab }) => {
  const [bizTypeData, setBizTypeData] = useState([]);
  const [bizCategory, setBizCategory] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const initialValues = {
    type: "",
    category: "",
    description: "",
  };
  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Select Business Type").nullable(),
    category: Yup.string().required("Select Business Category").nullable(),
  });
  const dispatch = useDispatch();

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
        setBizTypeData(data);
      })
      .catch((err) => console.log(err));

    // busniessCategory
    dispatch(busiCategory())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "category_id",
          "category_name",
          resp.payload
        );

        setBizCategory(data);
      })
      .catch((err) => console.log(err));
  }, []);
  const onSubmit = async (values) => {
    setSubmitLoader(true);
    const postData = {
      loginMasterId: basicDetailsResponse?.login_master_id,
      businessCategory: values.category,
      businessType: values.type,
      billingLabel: values.description,
    };
    try {
      const res = await dispatch(saveBusinessOverview(postData));
      res?.data?.status && toastConfig.successToast("Data Saved");
      setSubmitLoader(false);
    } catch (e) {
      setSubmitLoader(false);
      toastConfig.errorToast(e?.response?.data?.detail);
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
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Business Type<span className="text-danger"></span>
                </label>

                <FormikController
                  control="select"
                  name="type"
                  options={bizTypeData}
                  className="form-select"
                />
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  Business Category<span className="text-danger"></span>
                </label>

                <FormikController
                  control="select"
                  name="category"
                  options={bizCategory}
                  className="form-select"
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
                  name="description"
                  className="form-control fs-12"
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
              {/* <div className="col-sm-12 col-md-12 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  Year of Establishment
                  <span className="text-danger">*</span>
                </label>

                <FormikController
                  control="input"
                  onChange={(e) => {
                    // handleShowHide(e);
                    formik.setFieldValue(
                      "seletcted_website_app_url",
                      e.target.value
                    );
                  }}
                  name="seletcted_website_app_url"
                  className="form-control"
                />
              </div> */}
            </div>

            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
                >
                  {submitLoader ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        ariaHidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
                <a
                  className="btn active-secondary btn-sm m-2"
                  onClick={() => setCurrentTab("biz_details")}
                >
                  Next
                </a>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessOverview;
