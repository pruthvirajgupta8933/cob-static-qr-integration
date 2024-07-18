import React, { useState } from 'react'
import Yup from '../../../../_components/formik/Yup';
import { Form, Formik } from 'formik';
import FormikController from '../../../../_components/formik/FormikController';
// import { v4 as uuidv4 } from 'uuid';
import CustomModal from '../../../../_components/custom_modal';
import { Decrypt, Encrypt } from '../../../../utilities/aes';
import { axiosInstance, axiosInstanceAuth } from '../../../../utilities/axiosInstance';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
function TransactionRefund(props) {

    const { radioInputVal } = props
    const [submitLoader, setSubmitLoader] = useState(false)

    const initialValues = {
        refund_type: "1",
        refund_amt: radioInputVal?.payee_amount,
        refund_reason: "",
        clientCode: radioInputVal?.client_code,
        client_txn_id: radioInputVal?.client_txn_id,
        txn_id: radioInputVal?.txn_id,
        payee_amount: radioInputVal?.payee_amount
    };


    const validationSchema = Yup.object().shape({
        refund_type: Yup.string().required("Select the refund type")
            .nullable(),
        refund_amt: Yup.string().allowOneSpace().when("refund_type", (val, schema) => {
            if (parseInt(val) === 2) {
                return Yup.number().min(1, "Enter the minimun amount").max(parseFloat(radioInputVal?.payee_amount), "Amount should be equal to and less the the payee amount").required("Required")
            } else {
                return Yup.number()
                    .min(parseFloat(radioInputVal?.payee_amount), "Amount should be same as full requesting amount")
                    .max(parseFloat(radioInputVal?.payee_amount), "Amount should be equal to and less the the payee amount").required("Required")
            }
        }),
        refund_reason: Yup.string()
            .min(10, "Minimun 10 character")
            .max(500, "Please do not  enter more than 500 characters")
            .allowOneSpace()
            .required("Required")
            .nullable(),
        payee_amount: Yup.number().required("Required")
    });




    // TODO: radio button swtich . set amount 
    const handleSubmit = async (values) => {
        setSubmitLoader(true)
        const clientCode = values.clientCode
        const amount = values.refund_amt
        const spTxnId = values.txn_id
        const clientTxnId = values.client_txn_id
        const message = values.refund_reason
        // const amount = 35
        // const spTxnId = "307262905241094658"
        // const clientTxnId = "TESTING290524104847134"


        try {

            const response = await axiosInstanceAuth.post(API_URL.CLIENT_DETAIL, {
                clientCode: values.clientCode
            })

            const authIV = response.data?.ClientData?.authIV
            const authKey = response.data?.ClientData?.authKey

            if (response.data?.ClientData?.authIV && response.data?.ClientData?.authKey) {

                const str = `clientCode=${clientCode}&amount=${amount}&spTxnId=${spTxnId}&clientTxnId=${clientTxnId}&message=${message}`
                const enc = Encrypt(str, authKey, authIV)
                // console.log("str", str)


                const reqBody = {
                    clientCode: clientCode,
                    refundQuery: enc
                }

                // console.log(reqBody)

                const refundResponse = await axiosInstance.post(API_URL.refundTxn, reqBody)

                // console.log(refundResponse)

                const dc = Decrypt(refundResponse.data.refundResponse, authKey, authIV)
                const jsonRsp = JSON.parse(dc)

                // console.log("dc", JSON.parse(dc))

                toastConfig.successToast(jsonRsp.message || "Refund Request Initiated")
                setSubmitLoader(false)
                props.setRefundModal(false)

            }


        } catch (error) {
            // console.log(error)
            toastConfig.errorToast(error.message)
            setSubmitLoader(false)
        }



    }

    const headerTitle = "Refund Payment"

    const modalbody = () => {

        const refundTypeOption = [
            { "value": "1", "key": "Full Refund" },
            { "value": "2", "key": "Partial Refund" }
        ]

        return (
            <div className="container-fluid">
                <h6 className="mb-4">Refunds take 5-10 days to appear on a customer's statement.</h6>
                <div className="row">
                    <ul className="list-group list-group-horizontal mb-1">
                        <li className="list-group-item">Transaction  ID: <b>{radioInputVal?.txn_id}</b></li>
                        <li className="list-group-item">Payee Amount (INR) : <b>{radioInputVal?.payee_amount}</b></li>
                    </ul>
                </div>

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
                        {({ values, setFieldValue }) => (
                            <Form>
                                <div className="col-lg-12 d-flex justify-content-between my-2">
                                    <FormikController
                                        control="radio"
                                        name="refund_type"
                                        className="form-check-input radio-input"
                                        options={refundTypeOption}
                                        value={values.refund_type}
                                        onChange={(e) => {
                                            setFieldValue("refund_type", e.target.value)
                                            setFieldValue("refund_amt", radioInputVal?.payee_amount)

                                        }}
                                    />
                                </div>
                                <div className="col-lg-12 my-2">
                                    <FormikController
                                        control="input"
                                        label="Refund Amount"
                                        name="refund_amt"
                                        className="form-control"
                                        placeholder="Refund Amount"
                                        readOnly={values.refund_type === '1'}
                                    />
                                </div>

                                <div className="col-lg-12 my-2">
                                    <FormikController
                                        control="textArea"
                                        label="Refund Reason"
                                        name="refund_reason"
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <div className="mt-2">
                                        <button type="submit" className="text-white btn-sm cob-btn-primary" disabled={submitLoader}>
                                            {submitLoader && (
                                                <span
                                                    className="spinner-border spinner-border-sm mr-1"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                            )}
                                            Submit</button>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>)
    };



    return (
        <CustomModal headerTitle={headerTitle} modalBody={modalbody} modalToggle={props?.refundModal} fnSetModalToggle={props?.setRefundModal} modalSize={"modal-md"} />
    )
}

export default TransactionRefund