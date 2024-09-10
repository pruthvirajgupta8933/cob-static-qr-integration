import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../../_components/formik/Yup";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../../_components/formik/FormikController";

import { businessType, busiCategory } from "../../../../slices/kycSlice";

const BusinessOverview = ({ setCurrentTab }) => {
  const [bizTypeData, setBizTypeData] = useState([]);
  const [bizCategory, setBizCategory] = useState([]);
  const initialValues = {
    type: "",
    category: "",
    description: "",
    yearOfEst: "",
  };
  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Select Business Type").nullable(),
    category: Yup.string().required("Select Business Category").nullable(),
    yearOfEst: Yup.number().required("Enter Establishment Year").nullable(),
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
  const onSubmit = () => {};
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
                  name="business_type"
                  options={bizTypeData}
                  className="form-select"
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
                />
              </div>
              <div className="col-sm-6 col-md-6 col-lg-6">
                <label className="col-form-label p-2 mt-0">
                  Business Category<span className="text-danger"></span>
                </label>

                <FormikController
                  control="select"
                  name="business_category"
                  options={bizCategory}
                  className="form-select"
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
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
                  // disabled={VerifyKycStatus === "Verified" ? true : false}
                  // readOnly={readOnly}
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
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                <button
                  className="float-lg-right cob-btn-primary text-white btn btn-sm mt-4"
                  type="submit"
                  onClick={() => setCurrentTab("biz_details")}
                  // disabled={disabled}
                >
                  {/* {disabled &&  */}
                  <>
                    <span className="mr-2">
                      {/* <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        ariaHidden="true"
                      />
                      <span className="sr-only">Loading...</span> */}
                    </span>
                  </>
                  {/* } */}
                  {"Next"}
                </button>
                {/* )} */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessOverview;
