import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from "../../../../_components/formik/Yup";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../../../_components/formik/FormikController";

import toastConfig from "../../../../utilities/toastTypes";
import {
  businessOverviewState,
  kycUserList,
} from "../../../../slices/kycSlice";
import { saveAddressDetails } from "../../../../slices/approver-dashboard/referral-onboard-slice";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";

const AddressDetails = ({ setCurrentTab, disableForm, setInfoModal }) => {
  const [stateData, setStateData] = useState([]);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const initialValues = {
    operational_address: kycData?.merchant_address_details?.address ?? "",
    city: kycData?.merchant_address_details?.city ?? "",
    state: kycData?.merchant_address_details?.state ?? "",
    pin_code: kycData?.merchant_address_details?.pin_code ?? "",
  };
  const validationSchema = Yup.object().shape({
    operational_address: Yup.string()
      .required("Required")
      .matches(Regex.address, RegexMsg.address)
      .nullable(),
    city: Yup.string()
      .required("Required")
      .matches(Regex.acceptAlphaNumeric, RegexMsg.acceptAlphaNumeric)
      .nullable(),
    state: Yup.string().required("Please select state").nullable(),
    pin_code: Yup.string().required("Required").nullable(),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(businessOverviewState()) //api for fetching indian states
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "stateId",
          "stateName",
          resp.payload
        );
        setStateData(data);
      })
      .catch((err) => console.log(err));
    if (basicDetailsResponse)
      dispatch(kycUserList({ login_id: basicDetailsResponse?.loginMasterId }));
  }, []);

  useEffect(() => {
    if (basicDetailsResponse && !kycData?.isEmailVerified) setInfoModal(true);
  }, []);
  const onSubmit = async (values) => {
    setSubmitLoader(true);
    const postData = {
      login_id: kycData?.loginMasterId ?? basicDetailsResponse?.loginMasterId,
      address: values.operational_address,
      city: values.city,
      state: values.state,
      pin_code: values.pin_code,
    };
    try {
      const res = await dispatch(saveAddressDetails(postData));
      res?.data?.status && toastConfig.successToast("Data Saved");
      res?.data?.status &&
        dispatch(
          kycUserList({
            login_id: basicDetailsResponse?.loginMasterId,
            password_required: true,
          })
        );

      res?.error &&
        toastConfig.errorToast(res.error.message ?? "Some error occurred");
      setSubmitLoader(false);
      setShowNext(true);
      toastConfig.successToast(res?.payload?.message);
    } catch (e) {
      setSubmitLoader(false);
      toastConfig.errorToast(e?.data?.detail);
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
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Address<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  type="text"
                  name="operational_address"
                  className="form-control"
                  disabled={disableForm}
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
                  name="city"
                  className="form-control"
                  disabled={disableForm}
                  // readOnly={readOnly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  State<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="select"
                  name="state"
                  options={stateData}
                  className="form-select"
                  disabled={disableForm}
                  // readOnly={readOnly}
                />
              </div>

              <div className="col-sm-12 col-md-6 col-lg-6">
                <label className="col-form-label mt-0 p-2">
                  Pin Code<span className="text-danger">*</span>
                </label>
                <FormikController
                  control="input"
                  type="number"
                  name="pin_code"
                  className="form-control"
                  disabled={disableForm}
                  // readOnly={readOnly}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn cob-btn-primary btn-sm m-2"
                  disabled={disableForm}
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

                {showNext && (
                  <a
                    className="btn active-secondary btn-sm m-2"
                    onClick={() => setCurrentTab("bank")}
                  >
                    Next
                  </a>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddressDetails;
