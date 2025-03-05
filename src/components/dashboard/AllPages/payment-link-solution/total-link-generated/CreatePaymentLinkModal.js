import React, { useEffect, useState } from "react";
import { Formik, Form, } from 'formik'
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import toastConfig from "../../../../../utilities/toastTypes";
import Yup from "../../../../../_components/formik/Yup";

import FormikController from "../../../../../_components/formik/FormikController";
import { dateFormatBasic } from "../../../../../utilities/DateConvert";
import paymentLinkService from "../paylink-service/pamentLinkSolution.service";
import { convertToFormikSelectJson } from "../../../../../_components/reuseable_components/convertToFormikSelectJson";

function CreatePaymentLink({ componentState, onClose }) {
    const [disable, setDisable] = useState(false)
    const [payerData, setPayerData] = useState([])
    const { user } = useSelector((state) => state.auth);
    let clientMerchantDetailsList = [];
    let clientCode = '';

    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;

    const loadUser = async () => {
        try {
            const getPayerResponse = await paymentLinkService.getPayer({ "client_code": clientCode, order_by: "-id" })
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
            setPayerData(data)
        } catch (error) {
            toastConfig.errorToast(error.response.message)
        }
    }

    useEffect(() => {

        loadUser();

    }, []);


    const initialValues = {
        valid_from: "",
        valid_to: "",
        payer_account_number: "12345678901234",
        total_amount: "",
        purpose: "",
        is_link_date_validity: true,
        is_partial_payment_accepted: false,
        payer: componentState?.id ?? "",
        client_request_id: uuidv4()
    }

    const validationSchema = Yup.object().shape({
        valid_from: Yup.date()
            .min(new Date(), "Start date and time can't be before today date and time")
            .required("Start Date Required"),
        valid_to: Yup.date()
            .min(Yup.ref("valid_from"), "End date can't be before Start date")
            .required("End Date Required"),
        payer_account_number: Yup.string(),
        total_amount: Yup.number()
            .typeError("Only numbers are allowed")
            .min(1, "Enter Valid Amount")
            .max(1000000, "Limit Exceed")
            .required("Required"),
        purpose: Yup.string().required("Enter Remark"),
        is_link_date_validity: Yup.string().required(),
        is_partial_payment_accepted: Yup.string().required(),
        payer: Yup.string().required(),
        client_request_id: Yup.string().required(),
    });

    const onSubmit = async (values) => {
        setDisable(true)
        const postData = {
            ...values,
            valid_from: dateFormatBasic(values.valid_from)?.props?.children,
            valid_to: dateFormatBasic(values.valid_to)?.props?.children,
            client_request_id: uuidv4()
        }

        try {
            const response = await paymentLinkService.createPaymentLink(postData)

            toastConfig.successToast(response.data?.response_data?.message ?? "Link Created")

            setDisable(false)

            onClose()
        } catch (error) {
            toastConfig.errorToast((error.response.data?.detail || error.response.data?.message) ?? "Something went wrong.")
            setDisable(false)
        }
    };




    return (

        <div
            className="mymodals modal fade show"
            style={{ display: 'block' }}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            onSubmit(values); // this onsubmit used for api integration
                            resetForm();
                        }}
                    >
                        {({ }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold" >Create Payment Link </h6>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={onClose}
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span ar iaHidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>

                                        <div className="form-row mb-3">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <label>Start Date</label>
                                                <FormikController
                                                    control="input"
                                                    type="datetime-local"
                                                    name="valid_from"
                                                    className="form-control"
                                                    required={true}
                                                />

                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <label>End Date</label>
                                                <FormikController
                                                    control="input"
                                                    type="datetime-local"
                                                    name="valid_to"
                                                    className="form-control"
                                                    required={true}
                                                />
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label>Amount</label>
                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="total_amount"
                                                        className="form-control"
                                                        lable="Amount"
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">

                                                <div className="form-group">
                                                    <label>Remark</label>
                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="purpose"
                                                        className="form-control"
                                                        lable="Remark"
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Payer</label>
                                            <FormikController
                                                control="select"
                                                options={payerData}
                                                name="payer"
                                                className="form-select"
                                                lable="payer"
                                                required={true}
                                            />
                                        </div>

                                        <div className="row mt-3" >
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
                                                    {disable ? "Submiting..." : "Create Link"}

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
    )
}

export default CreatePaymentLink