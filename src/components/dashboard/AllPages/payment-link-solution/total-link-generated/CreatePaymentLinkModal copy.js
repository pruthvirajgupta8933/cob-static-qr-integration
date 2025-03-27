import React, { useEffect, useState } from "react";
import { Formik, Form } from 'formik';
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { DatePicker } from 'rsuite';
import "rsuite/dist/rsuite.min.css";
import toastConfig from "../../../../../utilities/toastTypes";
import Yup from "../../../../../_components/formik/Yup";
import FormikController from "../../../../../_components/formik/FormikController";
import { dateFormatBasic } from "../../../../../utilities/DateConvert";
import paymentLinkService from "../paylink-service/pamentLinkSolution.service";
import { convertToFormikSelectJson } from "../../../../../_components/reuseable_components/convertToFormikSelectJson";
import "./styles.css"; // Ensure this CSS file is included

function CreatePaymentLink({ componentState, onClose }) {
    const [disable, setDisable] = useState(false);
    const [payerData, setPayerData] = useState([]);
    const { user } = useSelector((state) => state.auth);
    let clientMerchantDetailsList = user.clientMerchantDetailsList;
    let clientCode = clientMerchantDetailsList[0].clientCode;

    const loadUser = async () => {
        try {
            const getPayerResponse = await paymentLinkService.getPayer({ "client_code": clientCode, order_by: "-id" });
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
            toastConfig.errorToast(error.response.message);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const initialValues = {
        valid_from: null,
        valid_to: null,
        payer_account_number: "12345678901234",
        total_amount: "",
        purpose: "",
        is_link_date_validity: true,
        is_partial_payment_accepted: false,
        payer: componentState?.id ?? "",
        client_request_id: uuidv4()
    };

    const validationSchema = Yup.object().shape({
        valid_from: Yup.date()
            .min(new Date(), "Start date and time can't be before today date and time")
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
        payer: Yup.string().required()
    });

    const onSubmit = async (values) => {
        setDisable(true);
        const postData = {
            ...values,
            valid_from: dateFormatBasic(values.valid_from)?.props?.children,
            valid_to: dateFormatBasic(values.valid_to)?.props?.children,
            client_request_id: uuidv4()
        };

        try {
            const response = await paymentLinkService.createPaymentLink(postData);
            toastConfig.successToast(response.data?.response_data?.message ?? "Link Created");
            setDisable(false);
            onClose();
        } catch (error) {
            toastConfig.errorToast((error.response.data?.detail || error.response.data?.message) ?? "Something went wrong.");
            setDisable(false);
        }
    };

    return (
        <div className="mymodals modal fade show" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            onSubmit(values);
                            resetForm();
                        }}
                    >
                        {({ setFieldValue, values }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold">Create Payment Link</h6>
                                    <button type="button" className="close" onClick={onClose}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>
                                        <div className="form-row mb-3">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <label>Start Date</label>
                                                <DatePicker
                                                    format="yyyy-MM-dd hh:mm aa"
                                                    block
                                                    value={values.valid_from}
                                                    onChange={(date) => setFieldValue("valid_from", date)}
                                                    placement="bottomEnd"
                                                    disabledDate={(date) => date < new Date()}
                                                    showMeridian
                                                    container={document.body} // Ensure dropdown renders outside modal
                                                    menuClassName="custom-datepicker-menu"
                                                />
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <label>End Date</label>
                                                <DatePicker
                                                    format="yyyy-MM-dd hh:mm aa"
                                                    block
                                                    value={values.valid_to}
                                                    onChange={(date) => setFieldValue("valid_to", date)}
                                                    placement="bottomEnd"
                                                    disabledDate={(date) => values.valid_from && date < values.valid_from}
                                                    showMeridian
                                                    container={document.body}
                                                    menuClassName="custom-datepicker-menu"
                                                />
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

                                        <div className="row mt-3">
                                            <div className="col-lg-6">
                                                <button type="button" className="btn btn-danger btn-sm w-100" onClick={onClose}>Cancel</button>
                                            </div>
                                            <div className="col-lg-6">
                                                <button type="submit" disabled={disable} className="btn btn-primary btn-sm w-100">
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
