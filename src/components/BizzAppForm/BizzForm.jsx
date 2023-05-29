import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import API_URL from "../../config";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
    Regex,
    RegexMsg,
    space,
} from "../../_components/formik/ValidationRegex";
import FormikController from '../../_components/formik/FormikController'
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const BizzAppForm = (props) => {
    const validationSchema = Yup.object().shape({
        merchant_business_name: Yup.string()
            .required("Required"),
        merchant_legal_name: Yup.string()
            .required("Required"),
        merchant_address: Yup.string()
            .required("Required"),
        product_name: Yup.string()
            .required("Required"),
        types_of_entity: Yup.string()
            .required("Required"),
        year_of_establishment: Yup.string()
            .required("Required")
            .test(
                'Is positive?',
                'ERROR: The number must be greater than 0!',
                (value) => value > 0
            ),
        merchant_portal: Yup.string()
            .required("Required"),
        average_transaction_amount: Yup.string()
            .required("Required")
            .test(
                'Is positive?',
                'ERROR: The number must be greater than 0!',
                (value) => value > 0
            ),
        expected_transactions_numbers: Yup.string()
            .required("Required")
            .test(
                'Is positive?',
                'ERROR: The number must be greater than 0!',
                (value) => value > 0
            ),
        account_details: Yup.string()
            .required("Required"),
        annual_transaction_value: Yup.string()
            .required("Required").test(
                'Is positive?',
                'ERROR: The number must be greater than 0!',
                (value) => value > 0
            ),
        question: Yup.string()
            // .required("Required")
            ,
        authorized_contact_person_name: Yup.string()
            .required("Required"),
        authorized_contact_person_contact_number: Yup.string()
            .trim()
            .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
            .required("Required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number is not valid")
            .max(10, "too long")
            .nullable(),
        authorized_contact_person_email_id: Yup.string()
            .required("Required")
            .email("Must be a valid email"),
        technical_contact_person_contact_number: Yup.string()
            .trim()
            .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
            .required("Required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number is not valid")
            .max(10, "too long")
            .nullable(),
        technical_contact_person_email_id: Yup.string()
            .required("Required")
            .email("Must be a valid email"),
        technical_contact_person_name: Yup.string()
            .required("Required"),
        gst_number: Yup.string()
            .required("Required"),
        entity_pan_card_number: Yup.string()
            .required("Required"),
        zone: Yup.string()
            .required("Required"),
        nature_of_business: Yup.string()
            .required("Required"),
        mcc: Yup.string()
            .required("Required"),
    }
    );
    const initialValues = {
        merchant_business_name: "",
        merchant_legal_name: "",
        merchant_address: "",
        product_name: "",
        types_of_entity: "",
        year_of_establishment: "",
        merchant_portal: "",
        average_transaction_amount: "",
        expected_transactions_numbers: "",
        account_details: "",
        annual_transaction_value: "",
        question: "static default question",
        authorized_contact_person_name: "",
        authorized_contact_person_contact_number: "",
        authorized_contact_person_email_id: "",
        technical_contact_person_contact_number: "",
        technical_contact_person_email_id: "",
        technical_contact_person_name: "",
        gst_number: "",
        entity_pan_card_number: "",
        zone: "",
        nature_of_business: "",
        mcc: ""
    };


    const product_name_options = [
        { key: '', value: 'Select product name' },
        { key: 'Domestic Payment Gateway', value: 'Domestic Payment Gateway' },
        { key: 'International Payment Gateway', value: 'International Payment Gateway' },
        { key: 'Subscriptions', value: 'Subscriptions' },
        { key: 'SettlePaisa', value: 'SettlePaisa' },
        { key: 'PayLink', value: 'PayLink' },
        { key: 'QwikForm', value: 'QwikForm' },
        { key: 'E-Collection through VAN', value: 'E-Collection through VAN' },
        { key: 'PayOut', value: 'PayOut' }
    ];
    const types_of_entity_options = [
        { key: '', value: 'Select entity' },
        { key: 'Proprietorship', value: 'Proprietorship' },
        { key: 'Partnership', value: 'Partnership' },
        { key: 'Private Limited', value: 'Private Limited' },
        { key: 'Public Limited', value: 'Public Limited' },
        { key: 'Government', value: 'Government' },
        { key: 'Society', value: 'Society' },
        { key: 'Trust', value: 'Trust' },
        { key: 'LLP', value: 'LLP' },
        { key: 'Association', value: 'Association' }
    ];
    const zone_options = [
        { key: '', value: 'Select zone' },
        { key: 'East', value: 'East' },
        { key: 'West', value: 'West' },
        { key: 'North', value: 'North' },
        { key: 'South', value: 'South' },
        { key: 'Government Business', value: 'Government Business' },
        { key: 'Inside Sales', value: 'Inside Sales' },
        { key: 'New Cob', value: 'New Cob' },
    ]

    const onSubmit = async (values, { setSubmitting, resetForm }) => {
        const res = await axiosInstanceAuth
            .post(API_URL.BizzAPPForm, values)
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
                resetForm(initialValues)
            }).catch((error) => {
                toast.error("Data not saved");
            })
    };
    const InputArray =
        [{ control: "input", label: "Merchant business name (DBA name)", name: "merchant_business_name", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Merchant legal name", name: "merchant_legal_name", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Merchant address", name: "merchant_address", placeholder: "Enter your answer", type: 'text' },
        { control: "select", label: "Product name", name: "product_name", placeholder: "Enter your answer", options: product_name_options },
        { control: "select", label: "Type of entity", name: "types_of_entity", placeholder: "Enter your answer", options: types_of_entity_options },
        { control: "input", label: "Merchant portal (website URL)", name: "merchant_portal", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Year of establishment", name: "year_of_establishment", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Average transaction amount", name: "average_transaction_amount", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Expected transaction numbers", name: "expected_transactions_numbers", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Account details", name: "account_details", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Annual transaction value", name: "annual_transaction_value", placeholder: "Enter your answer", type: 'text' },
        // { control: "input", label: "Question", name: "question", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Authorized contact person name", name: "authorized_contact_person_name", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Authorized contact person contact number", name: "authorized_contact_person_contact_number", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Authorized contact person email id", name: "authorized_contact_person_email_id", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Technical contact person name", name: "technical_contact_person_name", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Technical contact person email id", name: "technical_contact_person_email_id", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Technical contact person contact number", name: "technical_contact_person_contact_number", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "GST number", name: "gst_number", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Entity PAN card number", name: "entity_pan_card_number", placeholder: "Enter your answer", type: 'text' },
        { control: "input", label: "Nature of business", name: "nature_of_business", placeholder: "Enter your answer", type: 'text' },
        { control: "select", label: "Zones", name: "zone", placeholder: "Enter your answer", options: zone_options },
        { control: "input", label: "MCC", name: "mcc", placeholder: "Enter your answer", options: zone_options, type: "text" },
        ]

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 mx-auto">
                    <div className="card ">
                        <div className="card-header text-center">SabPaisa Biz App Form</div>
                        <div className="card-body ">
                            <h5 className="card-title">Please enter the detatils. </h5>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ formik }) => (
                                    <>
                                        <Form>
                                            <div className="form-group">
                                                {InputArray.map((singleData) => {
                                                    return (<>
                                                        <div className="form-group ">
                                                            {singleData.control === "input" ? <FormikController
                                                                control={singleData.control}
                                                                label={singleData.label}
                                                                name={singleData.name}
                                                                className="form-control rounded-0"
                                                                placeholder={singleData.placeholder}
                                                                type={singleData.type}
                                                            /> : <FormikController
                                                                control={singleData.control}
                                                                label={singleData.label}
                                                                name={singleData.name}
                                                                className="form-control rounded-0"
                                                                options={singleData.options}

                                                                type={singleData.type}
                                                            />}


                                                        </div>
                                                    </>)
                                                })}
                                            </div>
                                            <button
                                                type="submit"
                                                className="createpasswordBtn mt-3 text-white"
                                            >
                                                Submit
                                            </button>
                                        </Form>
                                    </>
                                )}
                            </Formik>

                        </div>
                        <div className="card-footer text-muted text-center">
                            sabpaisa.in
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BizzAppForm;



