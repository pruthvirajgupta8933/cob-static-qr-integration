import React, { useState } from 'react'
import Yup from '../../../../_components/formik/Yup';
import { Form, Formik } from 'formik';
import FormikController from '../../../../_components/formik/FormikController';
import { v4 as uuidv4 } from 'uuid';
import CustomModal from '../../../../_components/custom_modal';
function TransactionRefund(props) {



    const initialValues = {
        comments: "",
    };


    const validationSchema = Yup.object({
        comments: Yup.string()
            .min(1, "Please enter , more than 1 character")
            .max(500, "Please do not  enter more than 500 characters")
            .required("Required")
            .nullable(),
    });


    const commentsList = {}
    const handleSubmit = async (values) => {

    }

    const headerTitle = "Refund Payment"

    // const refundTypeOption


    const modalbody = () => {

        const refundTypeOption = [
            { "value": "Full Refund", "key": "Full Refund" },
            { "value": "Partial Refund", "key": "Partial Refund" }
        ]

        return (
            <div className="container-fluid">
                <h6 className="mb-4">Refunds take 5-10 days to appear on a customer's statement.</h6>

                <div className="row">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handleSubmit(values);
                            resetForm();
                        }}
                        enableReinitialize={true}
                    >
                        <Form>
                            <div className="col-lg-12 d-flex justify-content-between my-2">
                                <FormikController
                                    control="radio"
                                    name="refund_type"
                                    className="form-check-input radio-input"
                                    options={refundTypeOption}
                                />
                            </div>
                            <div className="col-lg-12 my-2">
                                <FormikController
                                    control="input"
                                    label="Refund Amount"
                                    name="refund_amt"
                                    className="form-control"
                                    placeholder="Refund Amount"
                                />
                            </div>
                            <div className="col-lg-12 my-2">
                                <FormikController
                                    control="input"
                                    label="Refund Reason"
                                    name="refund_reason"
                                    className="form-control"
                                    placeholder="Refund Reason"
                                />
                            </div>
                            <div className="col-lg-12 my-2">
                                <FormikController
                                    control="textArea"
                                    label="Refund Note"
                                    name="refund_note"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-lg-6">
                                <div className="mt-2">
                                    <button type="submit" className="text-white btn-sm cob-btn-primary"> Submit</button>
                                </div>
                            </div>

                        </Form>
                    </Formik>
                </div>

            </div>)
    };

    // const modalFooter = () => {
    //     return (
    //         <button
    //             type="button"
    //             className="btn btn-secondary text-white"
    //             data-dismiss="modal"
    //             onClick={() => {
    //                 // setCommentsList([]);
    //                 props?.setModalState(false);
    //             }}
    //         >
    //             Close
    //         </button>

    //     );
    // };



    return (
        <CustomModal headerTitle={headerTitle} modalBody={modalbody} modalToggle={true} fnSetModalToggle={props?.setModalState} modalSize={"modal-md"} />
    )
}

export default TransactionRefund