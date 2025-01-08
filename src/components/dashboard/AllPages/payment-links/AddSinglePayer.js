import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
// import _ from "lodash";
import Yup from "../../../../_components/formik/Yup";
import toastConfig from "../../../../utilities/toastTypes";
// import { v4 as uuidv4 } from 'uuid';
// import createPaymentLinkService from "../../../../services/create-payment-link/payment-link.service";
import { Regex, RegexMsg } from '../../../../_components/formik/ValidationRegex';
// import { capitalizeFirstLetter } from '../../../../utilities/capitlizedFirstLetter';
import FormikController from '../../../../_components/formik/FormikController';
// import CustomLoader from '../../../../_components/loader';
import paymentLinkService from '../../../../services/create-payment-link/paymentLink.service';
import { convertToFormikSelectJson } from '../../../../_components/reuseable_components/convertToFormikSelectJson';
// import { toast } from 'react-toastify';
const AddSinglePayer = ({ componentState, dispatchFn, loadUserFn }) => {

    const { user } = useSelector((state) => state.auth);
    const [disable, setDisable] = useState(false)
    const [payerTypeList, setPayerTypeList] = useState([])
    const { editPayerModal } = componentState

    let clientMerchantDetailsList = [];
    let clientCode = "";

    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;

    const initialValues = {
        payer_name: editPayerModal?.payer_name ?? "",
        payer_mobile: editPayerModal?.payer_mobile ?? "",
        payer_email: editPayerModal?.payer_email ?? "",
        client_code: clientCode ?? "",
        payer_type: editPayerModal?.payer_type ?? "",
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
        dispatchFn({ type: "reset" })
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
                loadUserFn()
            } else {
                response = await paymentLinkService.addPayer(values)
            }

            toastConfig.successToast(response.data?.message ?? response.data?.detail)
            setDisable(false)
            modalCloseHandler()
        } catch (error) {
            setDisable(false)
            console.log(error.response)
            // toastConfig.errorToast((error.response.data?.message || error.response.data?.detail) ?? "Something went wrong.")

        }
    };

    const fetchPayerType = async () => {
        try {
            const respPayer = await paymentLinkService.getPayerType();
            const formikOpt = convertToFormikSelectJson(
                "id",
                "payer_type_name",
                respPayer.data?.data
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
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            onSubmit(values); // this onsubmit used for api integration
                            resetForm();
                        }}
                    >
                        {({ errors }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold" > {editPayerModal?.isEditable ? "Edit Payer" : "Add Payer"} </h6>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={modalCloseHandler}
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span ariaHidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>
                                        <div className="form-group">
                                            <label>Payer Name</label>
                                            <FormikController
                                                control="input"
                                                name="payer_name"
                                                className="form-control"
                                                lable="Payer Name"
                                                required={true}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Payer Email</label>
                                            <FormikController
                                                control="input"
                                                type="text"
                                                name="payer_email"
                                                className="form-control"
                                                lable="Payer Email"
                                                required={true}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Payer Mobile</label>
                                            <FormikController
                                                control="input"
                                                type="text"
                                                name="payer_mobile"
                                                className="form-control"
                                                lable="Payer Mobile"
                                                required={true}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Payer Type</label>
                                            <FormikController
                                                control="select"
                                                options={payerTypeList}
                                                name="payer_type"
                                                className="form-select"
                                                lable="Payer Type"
                                                required={true}
                                            />
                                        </div>

                                        <div className="modal-footer">
                                            <button
                                                type="submit"
                                                disabled={disable}
                                                className="btn cob-btn-primary text-white btn-sm position-relative"
                                            >
                                                {disable ? "Submiting..." : "Submit"}

                                            </button>
                                            <button
                                                type="button"
                                                className="btn cob-btn-secondary btn-danger text-white btn-sm"
                                                data-dismiss="modal"
                                                onClick={modalCloseHandler}
                                            >
                                                Cancel
                                            </button>
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

export default AddSinglePayer
