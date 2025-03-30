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

    const validFrom = moment().add(5, "minutes").toDate();
    const validTo = moment(validFrom).add(24, "hours").toDate();




    const initialValues = {
        valid_from: validFrom,
        valid_to: validTo,
        payer_account_number: "12345678901234",
        total_amount: "",
        purpose: "",
        is_link_date_validity: true,
        is_partial_payment_accepted: false,
        payer: componentState?.id ?? "",
        client_request_id: uuidv4(),

    };

    const validationSchema = Yup.object().shape({
        valid_from: Yup.date()
            .min(new Date(), "Start date can't be before today")
            .required("Start Date Required"),
        valid_to: Yup.date()
            .min(Yup.ref("valid_from"), "End date can't be before Start date")
            .required("End Date Required"),
        total_amount: Yup.number()
            .typeError("Only numbers are allowed")
            .min(1, "Enter Valid Amount")
            .max(1000000, "Limit Exceed")
            .required("Required"),
        purpose: Yup.string().required("Enter Remark"),
        payer: Yup.string().required("Payer is required"),
        communication_mode: Yup.array()
            .min(1, "At least one communication method is required")
            .required("At least one communication method is required")
    });

    const onSubmit = async (values) => {
        setDisable(true);
        const formattedValidFrom = moment(values.valid_from).format("YYYY-MM-DD HH:mm");
        const formattedValidTo = moment(values.valid_to).format("YYYY-MM-DD HH:mm");

        const postData = {
            ...values,
            valid_from: formattedValidFrom,
            valid_to: formattedValidTo,
            client_request_id: uuidv4(),
            communication_mode: values.communication_mode,
        };

        try {
            const response = await paymentLinkService.createPaymentLink(postData);
            toastConfig.successToast(response.data?.response_data?.message ?? "Link Created");
            setDisable(false);
            onClose();
        } catch (error) {
            toastConfig.errorToast(
                error.response?.data?.detail || error.response?.data?.message || "Something went wrong."
            );
            setDisable(false);
        }
    };


    return (
        <div className="mymodals modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <Formik
                        initialValues={{ ...initialValues, communication_mode: ["email"] }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm, setErrors }) => {
                            if (values.communication_mode.length === 0) {
                                setErrors({ communication_mode: "At least one communication mode is required" });
                                return;
                            }
                            onSubmit(values);
                            resetForm();
                        }}
                    >
                        {({ setFieldValue, values, errors, touched }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold">Create Payment Link</h6>
                                    <button type="button" className="close" onClick={onClose} data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>
                                        <div className="form-row mb-3">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <label>Start Date</label>
                                                {/* <DatePicker
                                                    format="yyyy-MM-dd HH:mm"
                                                    value={values.valid_from}
                                                    onChange={(date) => setFieldValue("valid_from", date)}
                                                    className="w-100"
                                                    placement="bottomStart"
                                                    placeholder="Select Start Date"
                                                    showMeridian={false}
                                                /> */}
                                                <CustomDatePicker
                                                    // label="Start Date"
                                                    value={values.valid_from}
                                                    onChange={(date) => setFieldValue("valid_from", date)}
                                                    error={errors.valid_from && touched.valid_from ? errors.valid_from : ""}
                                                    placeholder="Select Start Date"
                                                />

                                                {errors.valid_from && touched.valid_from && (
                                                    <div className="text-danger">{errors.valid_from}</div>
                                                )}
                                            </div>

                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                {/* <label>End Date</label> */}
                                                {/* <DatePicker
                                                    format="yyyy-MM-dd HH:mm"
                                                    value={values.valid_to}
                                                    onChange={(date) => setFieldValue("valid_to", date)}
                                                    className="w-100"
                                                    placement="auto"
                                                    placeholder="Select End Date"
                                                    showMeridian={false}
                                                /> */}
                                                <CustomDatePicker
                                                    label="End Date"
                                                    value={values.valid_to}
                                                    onChange={(date) => setFieldValue("valid_to", date)}
                                                    error={errors.valid_to && touched.valid_to ? errors.valid_to : ""}
                                                    placeholder="Select End Date"
                                                />
                                                {errors.valid_to && touched.valid_to && (
                                                    <div className="text-danger">{errors.valid_to}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6">
                                                <label>Amount</label>
                                                <FormikController control="input" type="text" name="total_amount" className="form-control" required />
                                            </div>
                                            <div className="col-lg-6">
                                                <label>Remark</label>
                                                <FormikController control="input" type="text" name="purpose" className="form-control" required />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Payer</label>
                                            <FormikController control="select" options={payerData} name="payer" className="form-select" required />
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
                                                                : values.communication_mode.filter((mode) => mode !== "email");
                                                            setFieldValue("communication_mode", updatedModes);
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="emailCheckbox">Email</label>
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
                                                                : values.communication_mode.filter((mode) => mode !== "sms");
                                                            setFieldValue("communication_mode", updatedModes);
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor="smsCheckbox">SMS</label>
                                                </div>
                                            </div>


                                            {errors.communication_mode && (
                                                <div className="text-danger mt-0">{errors.communication_mode}</div>
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
                                                        <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                                                    )}
                                                    {disable ? "Submitting..." : "Create Link"}
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            </>
                        )}
                    </Formik>


                </div>
            </div>
        </div>
    );
}

export default CreatePaymentLink;
