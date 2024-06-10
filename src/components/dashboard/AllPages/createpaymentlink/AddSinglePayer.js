import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import _ from "lodash";
import Yup from "../../../../_components/formik/Yup";
import toastConfig from "../../../../utilities/toastTypes";
import { v4 as uuidv4 } from 'uuid';
import createPaymentLinkService from "../../../../services/create-payment-link/payment-link.service";
import { Regex, RegexMsg } from '../../../../_components/formik/ValidationRegex';

const AddSinglePayer = ({ loadUser, customerType }) => {
    
    const { user } = useSelector((state) => state.auth);
    const [disable, setDisable] = useState(false)
    let history = useHistory();
    let clientMerchantDetailsList = [];
    let clientCode = "";
    if (user && user.clientMerchantDetailsList === null) {
        // console.log("payerDetails");
        history.push("/dashboard/profile");
    } else {
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode = clientMerchantDetailsList[0].clientCode;
    }



    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "It's too short")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
            .required("Required")
            .allowOneSpace(),
        phone_number: Yup.string()
            .required("Required")
            .matches(Regex.phoneRegExp, RegexMsg.phoneRegExp)
            .min(10, "Mobile number should be of 10 digits")
            .max(10, "Too long"),
        email: Yup.string().email("Enter valid email").required("Required").allowOneSpace(),
        customer_type_id: Yup.string().required("Required"),
    });

    const onSubmit = async (e) => {
        setDisable(true)
        const postData = {
            name: e.name,
            email: e.email,
            phone_number: e.phone_number,
            client_code: clientCode,
            customer_type_id: e.customer_type_id

        }
        await createPaymentLinkService.addCustomer(postData)
            .then(resp => {
                if (resp.data?.response_code === '1') {
                    toastConfig.successToast(resp.data?.message?.toUpperCase());
                    loadUser();
                } else {
                    toastConfig.errorToast(resp.data?.message?.toUpperCase());
                }
                setDisable(false)
            }).catch(err => {
                setDisable(false)
                toastConfig.errorToast("something went wrong")
            })


    };
    return (
        <div
            className="mymodals modal fade"
            id="exampleModal"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            ariaHidden="true"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <Formik
                        initialValues={{
                            name: "",
                            email: "",
                            phone_number: "",
                            customer_type_id: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            onSubmit(values); // this onsubmit used for api integration
                            resetForm();
                        }}
                    >
                        {({ resetForm }) => (
                            <>
                                <div className="modal-header">
                                    <h6 className="fw-bold" >Add Payer </h6>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={resetForm}
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span ariaHidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <Form>
                                        <div className="form-group">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label"
                                            >
                                                Name of Payer:
                                            </label>
                                            <Field
                                                name="name"
                                                placeholder="Enter Name of Payer"
                                                className="form-control"
                                                autoComplete="off"
                                            />
                                            <ErrorMessage name="name">
                                                {(msg) => (
                                                    <div
                                                        className="abhitest"
                                                        style={{
                                                            color: "red",
                                                            position: "absolute",
                                                            zIndex: " 999",
                                                        }}
                                                    >
                                                        {msg}
                                                    </div>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label"
                                            >
                                                Mobile No.:
                                            </label>
                                            <Field
                                                name="phone_number"
                                                id="phoneNumber"
                                                onKeyDown={(e) =>
                                                    ["e", "E", "+", "-", "."].includes(e.key) &&
                                                    e.preventDefault()
                                                }
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Enter Mobile No."
                                                className="form-control"
                                                pattern="\d{10}"
                                                minLength="4"
                                                maxLength="10"
                                            />
                                            <ErrorMessage name="phone_number">
                                                {(msg) => (
                                                    <div
                                                        className="abhitest"
                                                        style={{
                                                            color: "red",
                                                            position: "absolute",
                                                            zIndex: " 999",
                                                        }}
                                                    >
                                                        {msg}
                                                    </div>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label"
                                            >
                                                Email ID:
                                            </label>
                                            <Field
                                                name="email"
                                                autoComplete="off"
                                                placeholder="Enter Email"
                                                id="pairphn"
                                                className="form-control"
                                            />
                                            <ErrorMessage name="email">
                                                {(msg) => (
                                                    <div
                                                        className="abhitest"
                                                        style={{
                                                            color: "red",
                                                            position: "absolute",
                                                            zIndex: " 999",
                                                        }}
                                                    >
                                                        {msg}
                                                    </div>
                                                )}
                                            </ErrorMessage>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="recipient-name"
                                                className="col-form-label"
                                            >
                                                Payer Category:
                                            </label>
                                            <Field
                                                name="customer_type_id"
                                                className="form-select"
                                                component="select"
                                            >
                                                <option type="text" id="recipient-name">
                                                    Select Your Payer Category
                                                </option>
                                                {customerType.map((payer, i) => (
                                                    <option value={payer.id} key={uuidv4()}>
                                                        {payer.type?.toUpperCase()}
                                                    </option>
                                                ))}
                                            </Field>
                                            {
                                                <ErrorMessage name="customer_type_id">
                                                    {(msg) => (
                                                        <p
                                                            className="abhitest"
                                                            style={{
                                                                color: "red",
                                                                position: "absolute",
                                                                zIndex: " 999",
                                                            }}
                                                        >
                                                            {msg}
                                                        </p>
                                                    )}
                                                </ErrorMessage>
                                            }
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="submit"
                                                disabled={disable}
                                                className="btn cob-btn-primary text-white btn-sm position-relative"
                                            >
                                                {disable && <span className="ml-4 spinner-border spinner-border-sm position-absolute start-0 top-50 translate-middle-y" role="status" ariaHidden="true"></span>}
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn cob-btn-secondary btn-danger text-white btn-sm"
                                                data-dismiss="modal"
                                                onClick={resetForm}
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
