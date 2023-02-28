import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import API_URL from "../../config";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    Regex,
    RegexMsg,
    space,
} from "../../_components/formik/ValidationRegex";
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const BizzAppForm = (props) => {
    const validationSchema = Yup.object().shape({
        merchant_business_name: Yup.string()
            .required("Merchant bussiness name is required"),
        merchant_legal_name: Yup.string()
            .required("Merchant legal name Required"),
        merchant_address: Yup.string()
            .required("Merchant address Required"),
        product_name: Yup.string()
            .required("Product name Required"),
        types_of_entity: Yup.string()
            .required("Types of entity Required"),
        year_of_establishment: Yup.string()
            .required("year of establishment Required"),
        merchant_portal: Yup.string()
            .required("Merchant portal Required"),
        average_transaction_amount: Yup.string()
            .required("Average transaction amount Required"),
        expected_transactions_numbers: Yup.string()
            .required("Expected transactions numbers Required"),
        account_details: Yup.string()
            .required("Account details Required"),
        annual_transaction_value: Yup.string()
            .required("annual transaction value Required"),
        question: Yup.string()
            .required("question Required"),
        authorized_contact_person_name: Yup.string()
            .required("Authorized contact person name Required"),
        authorized_contact_person_contact_number: Yup.string()
            .trim()
            .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
            .required("Required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number is not valid")
            .max(10, "too long")
            .nullable(),
        authorized_contact_person_email_id: Yup.string()
            .required("Authorized contact person email id Required"),
        technical_contact_person_contact_number: Yup.string()
            .trim()
            .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
            .required("Required")
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number is not valid")
            .max(10, "too long")
            .nullable(),
        technical_contact_person_email_id: Yup.string()
            .required("Technical contact person email id Required"),
        technical_contact_person_name: Yup.string()
            .required("Technical contact person name Required"),
        gst_number: Yup.string()
            .required("GST number Required"),
        entity_pan_card_number: Yup.string()
            .required("Entity pan card number Required"),
        zone: Yup.string()
            .required("Zone Required"),
        nature_of_business: Yup.string()
            .required("Nature of business Required"),
        mcc: Yup.string()
            .required("mcc Required"),
    }
    );
    // const [values, setValues] = useState({
    //     merchant_business_name: "",
    //     merchant_legal_name: "",
    //     merchant_address: "",
    //     product_name: "",
    //     types_of_entity: "",
    //     year_of_establishment: "",
    //     merchant_portal: "",
    //     average_transaction_amount: "",
    //     expected_transactions_numbers: "",
    //     account_details: "",
    //     annual_transaction_value: "",
    //     question: "",
    //     authorized_contact_person_name: "",
    //     authorized_contact_person_contact_number: "",
    //     authorized_contact_person_email_id: "",
    //     technical_contact_person_contact_number: "",
    //     technical_contact_person_email_id: "",
    //     technical_contact_person_name: "",
    //     gst_number: "",
    //     entity_pan_card_number: "",
    //     zone: "",
    //     nature_of_business: "",
    //     mcc: ""
    // });
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
        question: "",
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
        { key: 'East', value: 'East' },
        { key: 'West', value: 'West' },
        { key: 'North', value: 'North' },
        { key: 'South', value: 'South' },
        { key: 'Government Business', value: 'Government Business' },
        { key: 'Inside Sales', value: 'Inside Sales' },
        { key: 'New Cob', value: 'New Cob' },
    ]

    const onSubmit = async (values) => {
        console.log(">>>>>>>>>>>>>>>>>>>", values)
        const res = await axios
            .post(API_URL.BizzAPPForm, values)
            .then((response) => {
                if (response.status === 200) {
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            });
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-12 mx-auto">
                    <div className="card ">
                        <div className="card-header text-center">SabPaisa Biz App Form</div>
                        <div className="card-body Satoshi-Medium">
                            <h5 className="card-title">Please Enter the detatils. </h5>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ formik }) => (
                                    <>
                                        <Form>
                                            <div className="form-group">
                                                <label htmlFor="merchant_business_name1">
                                                    <h3 className="font-weight-bold">Merchant Business Name (DBA Name)</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="merchant_business_name1"
                                                        name="merchant_business_name"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="merchant_business_name">
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

                                                <label htmlFor="merchant_legal_name1">
                                                    <h3 className="font-weight-bold">Merchant Leagal Name</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="merchant_legal_name1"
                                                        name="merchant_legal_name"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="merchant_legal_name">
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
                                                <label htmlFor="merchant_address1">
                                                    <h3 className="font-weight-bold">Merchant address </h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="merchant_address1"
                                                        name="merchant_address"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="merchant_address">
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
                                                <div>
                                                    <label htmlFor="product_name1"><h3 className="font-weight-bold">Product name</h3></label>
                                                    <br />
                                                    <Field name="product_name" >
                                                        {
                                                            ({ field }) => {
                                                                return product_name_options.map(option => {
                                                                    return (
                                                                        <React.Fragment key={option.key}>
                                                                            <input
                                                                                type='radio'
                                                                                id={option.id}
                                                                                {...field}
                                                                                value={option.value}
                                                                                checked={field.value === option.value}
                                                                            />
                                                                            <label htmlFor={option.id}>{option.key}</label>
                                                                            <br />
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            }
                                                        }
                                                    </Field>
                                                </div>
                                                <ErrorMessage name="product_name">
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
                                                <div>
                                                    <label htmlFor="types_of_entity1"><h3 className="font-weight-bold">Type of entity</h3></label>
                                                    <br />
                                                    <Field name="types_of_entity" >
                                                        {
                                                            ({ field }) => {
                                                                return types_of_entity_options.map(option => {
                                                                    return (
                                                                        <React.Fragment key={option.key}>
                                                                            <input
                                                                                type='radio'
                                                                                id={option.id}
                                                                                {...field}
                                                                                value={option.value}
                                                                                checked={field.value === option.value}
                                                                            />
                                                                            <label htmlFor={option.id}>{option.key}</label>
                                                                            <br />
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            }
                                                        }
                                                    </Field>
                                                </div>
                                                <ErrorMessage name="types_of_entity">
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
                                                <label htmlFor="merchant_portal1">
                                                    <h3 className="font-weight-bold">Merchant Portal (Website URL)</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="merchant_portal1"
                                                        name="merchant_portal"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="merchant_portal">
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
                                                <label htmlFor="year_of_establishment1">
                                                    <h3 className="font-weight-bold">Year of establishment</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="year_of_establishment1"
                                                        name="year_of_establishment"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="year_of_establishment">
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
                                                <label htmlFor="average_transaction_amount1">
                                                    <h3 className="font-weight-bold">Average transaction amount</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="average_transaction_amount1"
                                                        name="average_transaction_amount"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="average_transaction_amount">
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
                                                <label htmlFor="expected_transactions_numbers1">
                                                    <h3 className="font-weight-bold">Expected transactions numbers</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="expected_transactions_numbers1"
                                                        name="expected_transactions_numbers"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="expected_transactions_numbers">
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
                                                <label htmlFor="account_details1">
                                                    <h3 className="font-weight-bold">Account details</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="account_details1"
                                                        name="account_details"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="account_details">
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
                                                <label htmlFor="annual_transaction_value1">
                                                    <h3 className="font-weight-bold">Annual transaction value</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="annual_transaction_value1"
                                                        name="annual_transaction_value"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="annual_transaction_value">
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
                                                <label htmlFor="question1">
                                                    <h3 className="font-weight-bold">Question</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="question1"
                                                        name="question"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="question">
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
                                                <label htmlFor="authorized_contact_person_name1">
                                                    <h3 className="font-weight-bold">Authorized contact person name</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="authorized_contact_person_name1"
                                                        name="authorized_contact_person_name"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="authorized_contact_person_name">
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
                                                <label htmlFor="authorized_contact_person_contact_number1">
                                                    <h3 className="font-weight-bold">Authorized contact person contact number</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="authorized_contact_person_contact_number1"
                                                        name="authorized_contact_person_contact_number"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="authorized_contact_person_contact_number">
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
                                                <label htmlFor="authorized_contact_person_email_id1">
                                                    <h3 className="font-weight-bold">Authorized contact person email id</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="authorized_contact_person_email_id1"
                                                        name="authorized_contact_person_email_id"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="authorized_contact_person_email_id">
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
                                                <label htmlFor="technical_contact_person_name1">
                                                    <h3 className="font-weight-bold">Technical contact person name</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="technical_contact_person_name1"
                                                        name="technical_contact_person_name"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="technical_contact_person_name">
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
                                                <label htmlFor="technical_contact_person_email_id1">
                                                    <h3 className="font-weight-bold">Technical contact person EmailId</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="technical_contact_person_email_id1"
                                                        name="technical_contact_person_email_id"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="technical_contact_person_email_id">
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
                                                <label htmlFor="technical_contact_person_contact_number1">
                                                    <h3 className="font-weight-bold">Technical contact person contact number</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="technical_contact_person_contact_number1"
                                                        name="technical_contact_person_contact_number"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="technical_contact_person_contact_number">
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
                                                <label htmlFor="gst_number1">
                                                    <h3 className="font-weight-bold">GST number</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="gst_number1"
                                                        name="gst_number"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="gst_number">
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
                                                <label htmlFor="entity_pan_card_number1">
                                                    <h3 className="font-weight-bold">Entity PAN card number</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="entity_pan_card_number1"
                                                        name="entity_pan_card_number"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="entity_pan_card_number">
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
                                                <label htmlFor="nature_of_business1">
                                                    <h3 className="font-weight-bold">Nature of business</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="nature_of_business1"
                                                        name="nature_of_business"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="nature_of_business">
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
                                                <div>
                                                    <label htmlFor="zone1"><h3 className="font-weight-bold">Product name</h3></label>
                                                    <br />
                                                    <Field name="zone" >
                                                        {
                                                            ({ field }) => {
                                                                return zone_options.map(option => {
                                                                    return (
                                                                        <React.Fragment key={option.key}>
                                                                            <input
                                                                                type='radio'
                                                                                id={option.id}
                                                                                {...field}
                                                                                value={option.value}
                                                                                checked={field.value === option.value}
                                                                            />
                                                                            <label htmlFor={option.id}>{option.key}</label>
                                                                            <br />
                                                                        </React.Fragment>
                                                                    );
                                                                })
                                                            }
                                                        }
                                                    </Field>
                                                </div>
                                                <ErrorMessage name="zone">
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
                                                <label htmlFor="nature_of_business1">
                                                    <h3 className="font-weight-bold">Nature of business</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="nature_of_business1"
                                                        name="nature_of_business"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="nature_of_business">
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
                                                <label htmlFor="mcc1">
                                                    <h3 className="font-weight-bold">mcc</h3>
                                                </label>
                                                <div className="input-group" >
                                                    <Field
                                                        id="mcc1"
                                                        name="mcc"
                                                        className="form-control"
                                                        placeholder="Enter your answer"
                                                        type="text"
                                                    />
                                                </div>
                                                <ErrorMessage name="mcc">
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
                            Sabpaisa.in
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BizzAppForm;
