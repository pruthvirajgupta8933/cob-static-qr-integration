import { createFilter } from "react-select";
import React, { useState, useEffect } from "react";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form, Field } from "formik";
import Yup from "../../_components/formik/Yup";
import CustomReactSelect from "../../_components/formik/components/CustomReactSelect";
import API_URL from "../../config";
import toastConfig from "../../utilities/toastTypes";
// import { createUpdater } from "../custom-hooks/updateGetValue";

import { axiosInstance, axiosInstanceJWT } from "../../utilities/axiosInstance";
import {
  createSubscriptionPlan,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
} from "../../slices/subscription";
import { useDispatch } from "react-redux";
import DateFormatter from "../../utilities/DateConvert";
import { getAllCLientCodeSlice } from "../../slices/approver-dashboard/approverDashboardSlice";

const SubscriptionModal = ({ data, setOpenModal }) => {
  const [subscriptionData, setSubscriptionData] = useState(data);
  const [clientCodeList, setCliencodeList] = useState([]);
  const [selectedClientLoginId, setSelectedClientLoginId] = useState(null);
  const [clientId, setClientId] = useState();
  const [disable, setIsDisable] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setCliencodeList(resp?.payload?.result);
    });
  }, []);
  // useEffect(() => {
  //   // dispatch();
  //   console.log(data);
  //   dispatch(getSubscriptionPlanById({ id: 3 })).then((resp) => {
  //     if (resp?.meta?.requestStatus === "fulfilled") {
  //       toastConfig.successToast("Data Saved");
  //       setIsDisable(false);
  //       setSubscriptionData(resp.payload?.data);
  //     } else {
  //       toastConfig.errorToast(resp?.payload ?? "Something went wrong");
  //       setIsDisable(false);
  //     }
  //   });
  // }, [data]);
  const options = [
    { value: "", label: "Select Client Code" },
    ...clientCodeList.map((data) => ({
      value: data.clientCode,
      label: `${data.clientCode} - ${data.name}`,
      loginMasterId: data.loginMasterId,
    })),
  ];
  const validationSchema = Yup.object().shape({
    app_id: Yup.string().required("Required").allowOneSpace(),
    app_name: Yup.string().required("Required").allowOneSpace(),
    react_select: Yup.object().required("Required").nullable(),
    client_txn_id: Yup.string().required("Required").allowOneSpace(),
    bank_ref: Yup.string().required("Required").allowOneSpace(),
    payment_mode: Yup.string().required("Required").allowOneSpace(),
    mandate_start: Yup.string().required("Required").nullable(),
    mandate_end: Yup.string().required("Required").allowOneSpace(),
    mandate_status: Yup.string().required("Required").allowOneSpace(),
    mandate_frequency: Yup.string().required("Required").nullable(),
    plan_id: Yup.string().required("Required").allowOneSpace(),
    plan_name: Yup.string().required("Required").allowOneSpace(),
    amount: Yup.string().required("Required").nullable(),
    subscription_status: Yup.string().required("Required").allowOneSpace(),
  });

  const startDate = new Date();
  startDate.setMinutes(
    new Date().getMinutes() - new Date().getTimezoneOffset()
  );
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);
  endDate.setMinutes(new Date().getMinutes() - new Date().getTimezoneOffset());

  const initialValues = {
    app_id: subscriptionData?.applicationId ?? "10",
    app_name: subscriptionData?.applicationName ?? "Payment Gateway",
    react_select: subscriptionData?.clientCode
      ? {
          value: subscriptionData.clientCode,
          label: `${subscriptionData.clientCode} - ${subscriptionData.clientName}`,
        }
      : "",
    client_txn_id: subscriptionData?.clientTxnId ?? "",
    bank_ref: subscriptionData?.bankRef ?? "",
    payment_mode: subscriptionData?.paymentMode ?? "UPI",
    mandate_start:
      subscriptionData?.mandateStartTime ?? startDate.toJSON().slice(0, 19),
    mandate_end:
      subscriptionData?.mandateEndTime ?? endDate.toJSON().slice(0, 19),
    mandate_status: subscriptionData?.mandateStatus ?? "SUCCESS",
    mandate_frequency: subscriptionData?.mandateFrequency ?? "Yearly",
    plan_id: subscriptionData?.planId ?? "1",
    plan_name: subscriptionData?.planName ?? "Subscription",
    amount: subscriptionData?.purchaseAmount ?? 10000,
    subscription_status: subscriptionData?.subscription_status ?? "Subscribed",
  };
  const handleSelectChange = async (selectedOption) => {
    setSelectedClientLoginId(selectedOption ? selectedOption.value : null);
    const merchantData = await axiosInstanceJWT.post(API_URL.Kyc_User_List, {
      login_id: selectedOption.loginMasterId,
    });
    setClientId(merchantData?.data?.clientId);
  };
  const handleSubmit = async (values) => {
    const postData = {
      applicationId: values.app_id,
      applicationName: values.app_name,
      bankRef: values.bank_ref,
      clientCode: values.react_select.label?.split(" - ")?.[0],
      clientId: clientId,
      clientName: values.react_select.label?.split(" - ")?.[1],
      clientTxnId: values.client_txn_id,
      mandateStartTime: DateFormatter(values.mandate_start).props?.children,
      mandateEndTime: DateFormatter(values.mandate_end).props?.children,
      mandateStatus: values.mandate_status,
      paymentMode: values.payment_mode,
      planId: values.plan_id,
      planName: values.plan_name,
      purchaseAmount: values.amount,
      mandateFrequency: values.mandate_frequency,
      subscription_status: values.subscription_status,
    };
    try {
      const resp = await dispatch(createSubscriptionPlan(postData));
      if (resp?.meta?.requestStatus === "fulfilled") {
        toastConfig.successToast("Data Saved");
        setIsDisable(false);
        setOpenModal(false);
      } else {
        toastConfig.errorToast(resp?.payload ?? "Something went wrong");
        setIsDisable(false);
      }
    } catch (e) {
      setIsDisable(false);
      toastConfig.errorToast(e?.data?.detail);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {(formik) => (
        <Form>
          <div className="container-fluid">
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="app_id">Application Id</label>
                <FormikController
                  control="input"
                  type="number"
                  name="app_id"
                  className="form-control"
                  placeholder="10"
                  disabled={subscriptionData}
                />
              </div>
              <div className="col-lg-6">
                <label htmlFor="app_name">Application Name</label>
                <FormikController
                  control="input"
                  type="text"
                  name="app_name"
                  className="form-control"
                  disabled={subscriptionData}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <CustomReactSelect
                  name="react_select"
                  options={options}
                  placeholder="Select Client Code"
                  filterOption={createFilter({
                    ignoreAccents: false,
                  })}
                  label="Client Code"
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-lg-6">
                <label htmlFor="client_txn_id">Client Transaction ID</label>
                <FormikController
                  control="input"
                  type="text"
                  name="client_txn_id"
                  className="form-control pb-2"
                  placeholder="73c59bce-4479-40c3-9309-4e0d95a08867"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="bank_ref">Bank Reference</label>
                <FormikController
                  control="input"
                  type="text"
                  name="bank_ref"
                  className="form-control"
                />
              </div>

              <div className="col-lg-6">
                <label htmlFor="payment_mode">Payment Mode</label>
                <FormikController
                  control="input"
                  type="text"
                  name="payment_mode"
                  className="form-control"
                  placeholder="netbanking"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="mandate_start">Mandate Start Date</label>
                <FormikController
                  control="input"
                  type="datetime-local"
                  name="mandate_start"
                  className="form-control"
                />
              </div>

              <div className="col-lg-6">
                <label htmlFor="mandate_end">Mandate End Date</label>
                <FormikController
                  control="input"
                  type="datetime-local"
                  name="mandate_end"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="mandate_status">Mandate Status</label>
                <FormikController
                  control="input"
                  type="text"
                  name="mandate_status"
                  className="form-control"
                />
              </div>

              <div className="col-lg-6">
                <label htmlFor="mandate_frequency">Mandate Frequency</label>
                <FormikController
                  control="input"
                  type="text"
                  name="mandate_frequency"
                  className="form-control"
                  placeholder="high"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="plan_id">Plan ID</label>
                <FormikController
                  control="input"
                  type="number"
                  name="plan_id"
                  className="form-control"
                />
              </div>

              <div className="col-lg-6">
                <label htmlFor="plan_name">Plan Name</label>
                <FormikController
                  control="input"
                  type="text"
                  name="plan_name"
                  className="form-control"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <label htmlFor="amount">Purchase Amount</label>
                <FormikController
                  control="input"
                  type="number"
                  name="amount"
                  className="form-control"
                />
              </div>

              <div className="col-lg-6">
                <label htmlFor="subscription_status">Subscription Status</label>
                <FormikController
                  control="input"
                  type="text"
                  name="subscription_status"
                  className="form-control"
                  placeholder="Subscribed"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12 col-form-label">
                <button
                  disabled={disable}
                  type="submit"
                  className="float-lg-right cob-btn-primary text-white btn btn-sm"
                >
                  {disable && (
                    <span className="mr-2">
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        ariaHidden="true"
                      />
                      <span className="sr-only">Loading...</span>
                    </span>
                  )}
                  Save
                </button>
                {/* )} */}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SubscriptionModal;
