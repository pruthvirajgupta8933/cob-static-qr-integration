import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import Yup from '../../../../../_components/formik/Yup';
import toastConfig from '../../../../../utilities/toastTypes';
import { Regex, RegexMsg } from '../../../../../_components/formik/ValidationRegex';
import FormikController from '../../../../../_components/formik/FormikController';
import paymentLinkService from '../paylink-service/pamentLinkSolution.service';
import { convertToFormikSelectJson } from '../../../../../_components/reuseable_components/convertToFormikSelectJson';

const AddPayerModal = ({ componentState, loadDataFn, onClose }) => {



    const { user } = useSelector((state) => state.auth);
    const [disable, setDisable] = useState(false)
    const [payerTypeList, setPayerTypeList] = useState([])
    const { editPayerModal } = componentState || {}



    let clientMerchantDetailsList = [];
    let clientCode = "";

    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;

    const initialValues = {
        payer_name: editPayerModal?.payer_name || "",
        payer_mobile: editPayerModal?.payer_mobile || "",
        payer_email: editPayerModal?.payer_email || "",
        client_code: clientCode || "",
        payer_type: editPayerModal?.payer_type || "",
    }

    const validationSchema = Yup.object().shape({
        payer_name: Yup.string()
            .min(3, "It's too short")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
            .required("Required")
            .allowOneSpace(),
        payer_mobile: Yup.string()
            .required("Required")
            .matches(Regex.phoneRegExp, RegexMsg.phoneRegExp)
            .min(10, "Mobile number should be of 10 digits")
            .max(10, "Too long"),
        payer_email: Yup.string().email("Enter valid email").required("Required").allowOneSpace(),
        client_code: Yup.string().required("Required"),
        payer_type: Yup.string().required("Required"),
    });

    const modalCloseHandler = () => {
        onClose()
    }

    const onSubmit = async (values) => {

        setDisable(true)
        try {
            let response = {}
            if (editPayerModal?.isEditable) {
                const editData = {
                    ...values,
                    id: editPayerModal.id
                }
                response = await paymentLinkService.editPayer(editData)
                toastConfig.successToast(response.data?.message ?? response.data?.detail)

            } else {
                response = await paymentLinkService.addPayer(values)
                modalCloseHandler()
                toastConfig.successToast(response.data?.message ?? response.data?.detail)

            }
            loadDataFn()


            setDisable(false)

        } catch (error) {
            setDisable(false)
            console.log(error.response)

        }
    };

    const fetchPayerType = async () => {
        try {
            const respPayer = await paymentLinkService.getPayerType();
            const formikOpt = convertToFormikSelectJson(
                "id",
                "payer_type_name",
                respPayer.data?.data,

            );
            setPayerTypeList(formikOpt)
        } catch (error) {
            console.log(error.response)
        }

    }

    useEffect(() => {
        fetchPayerType()
    }, [])


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
                            onSubmit(values); // This onSubmit used for API integration
                            resetForm();
                        }}
                    >
                        {({ errors }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold">
                                        {editPayerModal?.isEditable ? "Edit Payer" : "Add Payer"}
                                    </h6>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={modalCloseHandler}
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>

                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">

                                                    <FormikController
                                                        control="input"
                                                        name="payer_name"
                                                        className="form-control"
                                                        label="Payer Name"
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">

                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="payer_email"
                                                        className="form-control"
                                                        label="Payer Email"
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-6">
                                                <div className="form-group">

                                                    <FormikController
                                                        control="input"
                                                        type="text"
                                                        name="payer_mobile"
                                                        className="form-control"
                                                        label="Payer Mobile"
                                                        required={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="form-group">

                                                    <FormikController
                                                        control="select"
                                                        options={payerTypeList}
                                                        name="payer_type"
                                                        className="form-select"
                                                        label="Payer Type"
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="row mt-3">
                                            <div className="col-6">
                                                <button
                                                    type="button"
                                                    className="btn cob-btn-secondary btn-danger text-white btn-sm w-100"
                                                    data-dismiss="modal"
                                                    onClick={modalCloseHandler}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <div className="col-6">
                                                <button
                                                    type="submit"
                                                    disabled={disable}
                                                    className="btn cob-btn-primary text-white btn-sm w-100"
                                                >
                                                    {editPayerModal?.isEditable ? "Edit Payer" : "Add Payer"}
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

export default AddPayerModal
