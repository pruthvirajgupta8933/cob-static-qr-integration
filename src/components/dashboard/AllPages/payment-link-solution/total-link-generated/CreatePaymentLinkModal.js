import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import toastConfig from "../../../../../utilities/toastTypes";
import * as Yup from "yup";
import moment from "moment";
import FormikController from "../../../../../_components/formik/FormikController";
import { dateFormatBasic } from "../../../../../utilities/DateConvert";
import paymentLinkService from "../paylink-service/pamentLinkSolution.service";
import { convertToFormikSelectJson } from "../../../../../_components/reuseable_components/convertToFormikSelectJson";
import CustomDatePicker from "./CustomDatePicker";

import { DatePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";

function CreatePaymentLink({ componentState, onClose }) {
  const [disable, setDisable] = useState(false);
  const [payerData, setPayerData] = useState([]);
  const [isSchedule, setIsSchedule] = useState(false);
  const { user } = useSelector((state) => state.auth);

  let clientMerchantDetailsList = user.clientMerchantDetailsList || [];
  let clientCode = clientMerchantDetailsList[0]?.clientCode || "";

  useEffect(() => {
    const loadUser = async () => {
      try {
        const getPayerResponse = await paymentLinkService.getPayer({
          client_code: clientCode,
          order_by: "-id",
        });

        const data = convertToFormikSelectJson(
          "id",
          "payer_name",
          getPayerResponse.data?.results,
          {},
          false,
          false,
          true,
          "payer_email"
        );
        setPayerData(data);
      } catch (error) {
        toastConfig.errorToast(error.response?.message);
      }
    };

    loadUser();
  }, [clientCode]);

  const validFrom = moment().add(1, "minutes").toDate();
  const validTo = moment(validFrom).add(24, "hours").toDate();

  const initialValues = {
    valid_from: validFrom,
    valid_to: validTo,
    valid_from_date: moment(validFrom).format("YYYY-MM-DD"),
    valid_from_time: moment(validFrom).format("HH:mm"),
    valid_to_date: moment(validTo).format("YYYY-MM-DD"),
    valid_to_time: moment(validTo).format("HH:mm"),
    total_amount: "",
    purpose: "",
    schedule: false,
    is_link_date_validity: true,
    is_partial_payment_accepted: false,
    payer: componentState?.id ?? "",
    client_request_id: uuidv4(),
  };

  const getValidationSchema = (schedule) =>
    Yup.object().shape({
      ...(schedule && {
        valid_from_date: Yup.string().required("Start Date Required"),
        valid_from_time: Yup.string().required("Start Time Required"),
        valid_to_date: Yup.string().required("End Date Required"),
        valid_to_time: Yup.string().required("End Time Required"),
        valid_to: Yup.mixed().test(
          "is-greater",
          "End date/time must be after start date/time",
          function () {
            const { valid_from_date, valid_from_time, valid_to_date, valid_to_time } =
              this.parent;
            const from = moment(
              `${valid_from_date} ${valid_from_time}`,
              "YYYY-MM-DD HH:mm"
            );
            const to = moment(
              `${valid_to_date} ${valid_to_time}`,
              "YYYY-MM-DD HH:mm"
            );
            return to.isAfter(from);
          }
        ),
      }),
      total_amount: Yup.number()
        .typeError("Only numbers are allowed")
        .min(1, "Enter Valid Amount")
        .max(1000000, "Limit Exceed")
        .required("Required"),
      purpose: Yup.string()
        .max(200, "Max 200 characters allowed")
        .matches(/^[a-zA-Z0-9\s]*$/, "Only alphabets and numbers are allowed")
        .required("Enter Remark"),

      payer: Yup.string().required("Payer is required"),
      communication_mode: Yup.array()
        .min(1, "At least one communication method is required")
        .required("At least one communication method is required"),
    });

  const onSubmit = async (values, resetForm) => {
    setDisable(true);

    // Clone values to avoid mutating the original object
    const postData = {
      ...values,
      client_request_id: uuidv4(),
      communication_mode: values.communication_mode,
      schedule: isSchedule,
    };

    // Always remove time fields (they are only used for combining)
    delete postData.valid_from_time;
    delete postData.valid_to_time;


    if (isSchedule) {

      const combinedValidFrom = moment(
        `${values.valid_from_date} ${values.valid_from_time}`,
        "YYYY-MM-DD HH:mm"
      );
      const combinedValidTo = moment(
        `${values.valid_to_date} ${values.valid_to_time}`,
        "YYYY-MM-DD HH:mm"
      );

      postData.valid_from = combinedValidFrom.format("YYYY-MM-DD HH:mm");
      postData.valid_to = combinedValidTo.format("YYYY-MM-DD HH:mm");
    } else {
      // If schedule is false, remove date fields also
      delete postData.valid_from_date;
      delete postData.valid_to_date;
      delete postData.valid_from;
      delete postData.valid_to;
    }

    try {
      const response = await paymentLinkService.createPaymentLink(postData);
      toastConfig.successToast(
        response.data?.response_data?.message ?? "Link Created"
      );
      setDisable(false);
      resetForm();
      onClose();
    } catch (error) {
      toastConfig.errorToast(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Something went wrong."
      );
      setDisable(false);
      resetForm();
    }
  };





  return (
    <div className="mymodals modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg model_custom_w modal-dialog-centered" role="document">
        <div className="modal-content">
          <Formik
            initialValues={{ ...initialValues, communication_mode: ["email"] }}
            validationSchema={getValidationSchema(isSchedule)}
            enableReinitialize
            onSubmit={(values, { resetForm, setErrors }) => {
              if (values.communication_mode.length === 0) {
                setErrors({
                  communication_mode:
                    "At least one communication mode is required",
                });
                return;
              }
              onSubmit(values, resetForm);
            }}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form>
                <div className="modal-header">
                  <h6 className="fw-bold">Create Payment Link</h6>
                  <button
                    type="button"
                    className="close"
                    onClick={onClose}
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <nav className="my-2 mb-4 d-flex justify-content-center gap-3">
                    <a
                      href="#"
                      className={`btn px-4 btn-sm text-center flex-fill ${!isSchedule ? "btn cob-btn-primary text-white text-white" : "btn-outline-primary"
                        }`}
                      style={{ maxWidth: "200px" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSchedule(false);
                        setFieldValue("schedule", false);
                      }}
                    >
                      Upto 24 Hours
                    </a>
                    <a
                      href="#"
                      className={`btn px-4 btn-sm text-center flex-fill ${isSchedule ? "btn cob-btn-primary text-white" : "btn-outline-primary"
                        }`}
                      style={{ maxWidth: "200px" }}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSchedule(true);
                        setFieldValue("schedule", true);
                      }}
                    >
                      Schedule
                    </a>
                  </nav>

                  {isSchedule && (
                    <div className="form-row mb-3">
                      <div className="col-lg-6 col-md-12 col-sm-12 d-flex  justify-content-between">
                        <div style={{ width: "56%" }}>
                          <label>Start Date</label>
                          <CustomDatePicker
                            value={
                              values.valid_from_date
                                ? new Date(values.valid_from_date)
                                : null
                            }
                            onChange={(date) =>
                              setFieldValue(
                                "valid_from_date",
                                moment(date).format("YYYY-MM-DD")
                              )
                            }
                            error={
                              touched.valid_from_date && errors.valid_from_date
                                ? errors.valid_from_date
                                : ""
                            }
                            placeholder="Select Start Date"
                          />
                        </div>

                        <div style={{ width: "40%" }}>
                          <label>Start Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={values.valid_from_time}
                            onChange={(e) =>
                              setFieldValue("valid_from_time", e.target.value)
                            }
                            placeholder="Select Start Time"
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12 col-sm-12 d-flex  justify-content-between">
                        <div style={{ width: "56%" }}>
                          <label>End Date</label>
                          <CustomDatePicker
                            value={
                              values.valid_to_date ? new Date(values.valid_to_date) : null
                            }
                            onChange={(date) =>
                              setFieldValue(
                                "valid_to_date",
                                moment(date).format("YYYY-MM-DD")
                              )
                            }
                            error={
                              touched.valid_to_date && errors.valid_to_date
                                ? errors.valid_to_date
                                : ""
                            }
                            placeholder="Select End Date"
                          />
                        </div>

                        <div style={{ width: "39%" }}>
                          <label>End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={values.valid_to_time}
                            onChange={(e) =>
                              setFieldValue("valid_to_time", e.target.value)
                            }
                            placeholder="Select End Time"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-lg-6">
                      <label>Amount</label>
                      <FormikController
                        control="input"
                        type="text"
                        name="total_amount"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label>Remark</label>
                      <FormikController
                        control="input"
                        type="text"
                        name="purpose"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Payer</label>
                    <FormikController
                      control="select"
                      options={payerData}
                      name="payer"
                      className="form-select"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Communication Mode</label>
                    <div className="d-flex align-items-center">
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="emailCheckbox"
                          className="form-check-input"
                          checked={values.communication_mode.includes("email")}
                          onChange={(e) => {
                            const updatedModes = e.target.checked
                              ? [...values.communication_mode, "email"]
                              : values.communication_mode.filter(
                                (mode) => mode !== "email"
                              );
                            setFieldValue("communication_mode", updatedModes);
                          }}
                        />
                        <label className="form-check-label" htmlFor="emailCheckbox">
                          Email
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          id="smsCheckbox"
                          className="form-check-input"
                          checked={values.communication_mode.includes("sms")}
                          onChange={(e) => {
                            const updatedModes = e.target.checked
                              ? [...values.communication_mode, "sms"]
                              : values.communication_mode.filter(
                                (mode) => mode !== "sms"
                              );
                            setFieldValue("communication_mode", updatedModes);
                          }}
                        />
                        <label className="form-check-label" htmlFor="smsCheckbox">
                          SMS
                        </label>
                      </div>
                    </div>
                    {errors.communication_mode && (
                      <div className="text-danger mt-0">
                        {errors.communication_mode}
                      </div>
                    )}
                  </div>

                  <div className="row mt-3">
                    <div className="col-lg-6">
                      <button
                        type="button"
                        className="btn cob-btn-secondary btn-danger text-white btn-sm w-100"
                        data-dismiss="modal"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-lg-6">
                      <button
                        type="submit"
                        disabled={disable}
                        className="btn cob-btn-primary text-white btn-sm position-relative w-100"
                      >
                        {disable && (
                          <span
                            className="spinner-border spinner-border-sm mr-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        {disable ? "Submitting..." : "Create Link"}
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}

          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreatePaymentLink;
