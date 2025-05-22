import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import FormikController from '../../_components/formik/FormikController';
import moment from "moment";
import toast from 'react-hot-toast';
import { createEmandateByApi } from '../../slices/subscription-slice/createEmandateSlice';
import { getRedirectUrl } from '../../utilities/getRedirectUrl';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom"



const CreateEMandateByApi = ({ selectedOption }) => {

    const [dropdownData, setDropdownData] = useState([]);
    const [pusposeListData, setPurposeListDate] = useState([])
    const [bankDetailsUrl, setBankDetailsUrl] = useState(null);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [disable, setDisable] = useState(false)
    const dispatch = useDispatch()
    let now = moment();
    let futureStartDate = now.add(3, 'days').format("YYYY-MM-DD");
    let futureEndDate = moment(futureStartDate).add(3, 'days').format("YYYY-MM-DD"); // 3 days from start date
    const { user } = useSelector((state) => state.auth);
    const { clientCode } = user.clientMerchantDetailsList[0];
    // const redirectUrl = '/dashboard/create-mandate-api-response/?consumerId='

    function generateRandomNumber() {
        const min = 1000000000;
        const max = 9999999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const initialValues = {

        consumer_id: generateRandomNumber(),
        customer_name: '',
        customer_mobile: '',
        customer_email_id: '',
        start_date: futureStartDate,
        end_date: futureEndDate,
        max_amount: '',
        frequency: '',
        purpose: '',
        redirect_url: '',
        mandate_category: '',
        emi_amount: "",
        amount_type: "",
        untilCancelled: ""


    };
    useEffect(() => {
        if (selectedOption === 'customer') {
            setRedirectUrl('/e-nach-response/?consumerId=');
        } else if (selectedOption === 'merchant') {
            setRedirectUrl('/dashboard/create-mandate-api-response/?consumerId=');
        } else {
            setRedirectUrl('');
        }

        // Clear bankDetailsUrl when switching to merchant
        if (selectedOption === 'merchant') {
            setBankDetailsUrl(null);
        }
    }, [selectedOption]);


    const validationSchema = Yup.object({
        consumer_id: Yup.string().required('Required'),
        customer_name: Yup.string()
            .matches(/^[a-zA-Z0-9. ]+$/, "Only alphanumeric characters and dots are allowed")
            .max(100, "Maximum 100 characters are allowed")
            .required('Required'),

        customer_mobile: Yup.string()
            .matches(/^\d{10}$/, 'Must be a valid 10-digit mobile number')
            .required('Required'),
        customer_email_id: Yup.string().email('Invalid email').max(100, "Maximum 100 characters are allowed").required('Required'),


        start_date: Yup.date().required('Required'),
        end_date: Yup.date().min(Yup.ref("start_date"), "End date can't be before Start date").required('Required'),

        max_amount: Yup.number()
            .typeError('Max amount must be a number')
            .required('Required'),

        emi_amount: Yup.number()
            .typeError('EMI amount must be a number')
            .required('Required')
            .test(
                'emi-less-than-max',
                'EMI amount must be less than or equal to Max amount',
                function (value) {
                    const { max_amount } = this.parent;
                    return value !== undefined && max_amount !== undefined
                        ? value <= max_amount
                        : true;
                }
            ),

        frequency: Yup.string().required('Required'),
        amount_type: Yup.string().required('Required'),
        purpose: Yup.string().required('Required'),
    });






    const frequencyDropdown =
        [
            { key: '', value: 'Select' },
            { key: "ADHO", value: "Adhoc" },
            { key: "DAIL", value: "Daily" },
            { key: "WEEK", value: "Weekly" },
            { key: "MNTH", value: "Monthly" },
            { key: "QURT", value: "Quarterly" },
            { key: "MIAN", value: "Half-Yearly" },
            { key: "YEAR", value: "Yearly" },
            { key: "BIMN", value: "Bi-Monthly" },
            { key: "OOFF", value: "Sequence" },
            { key: "RCUR", value: "Recurring" }

        ]

    const AmountType = [
        { key: '', value: 'Select' },
        { key: "Fixed", value: "Fixed" },
        { key: "Variable", value: "Variable" },

    ]

    useEffect(() => {
        const apiResponse = {
            "data": [
                { "id": 1, "code": "U005", "description": "Utility Bill Payment Mobile Telephone Broadband", "sorting": 1 },
                { "id": 2, "code": "B001", "description": "Bill Payment Credit Card", "sorting": 2 },
                { "id": 3, "code": "A001", "description": "API Mandate", "sorting": 3 },
                { "id": 4, "code": "D001", "description": "Destination Bank Mandate", "sorting": 4 },
                { "id": 5, "code": "I002", "description": "Insurance Other Payment", "sorting": 5 },
                { "id": 6, "code": "L002", "description": "Loan Amount Security", "sorting": 6 },
                { "id": 7, "code": "E001", "description": "Education Fees", "sorting": 7 },
                { "id": 8, "code": "I001", "description": "Insurance Premium", "sorting": 8 },
                { "id": 9, "code": "L001", "description": "Loan Instalment Payment", "sorting": 9 },
                { "id": 10, "code": "M001", "description": "Mutual Fund Payment", "sorting": 10 },
                { "id": 12, "code": "U099", "description": "Others", "sorting": 12 },
                { "id": 13, "code": "T002", "description": "TReDS", "sorting": 13 },
                { "id": 14, "code": "T001", "description": "Tax Payment", "sorting": 14 },
                { "id": 17, "code": "U006", "description": "Utility Bill Payment Water", "sorting": 17 }
            ]
        };
        setPurposeListDate(apiResponse?.data)


        const formattedData = [
            { key: "", value: "Select" },
            ...apiResponse.data.map(item => ({
                key: item.description,
                value: item.description
            }))
        ];


        setDropdownData(formattedData);
    }, []);




    const handleViewSubmit = async (values) => {
        setDisable(true);
        try {
            const filteredPurpose = pusposeListData.filter(
                (item) => item.description === values.purpose
            );

            const mandateCategory = filteredPurpose.length > 0 ? filteredPurpose[0].code : null;

            let postDataS = {
                consumer_id: values.consumer_id,
                customer_name: values.customer_name,
                customer_mobile: values.customer_mobile,
                customer_email_id: values.customer_email_id,
                start_date: moment(values?.start_date).startOf("day").format("YYYY-MM-DD"),
                max_amount: values.max_amount,
                frequency: values.frequency,
                purpose: values.purpose,
                client_code: clientCode,
                mandate_category: mandateCategory,
                redirect_url: getRedirectUrl(redirectUrl),
                amount_type: values.amount_type,
                until_cancel: values.untilCancelled || false,
                emi_amount: values.emi_amount,
                customer_type: selectedOption === "customer" ? "customer" : "merchant"
            };

            // Conditionally add `end_date` if untilCancelled is false
            if (!values.untilCancelled) {
                postDataS.end_date = moment(values?.end_date).startOf("day").format("YYYY-MM-DD");
            }

            const response = await dispatch(createEmandateByApi(postDataS));


            if (response?.payload.data?.bank_details_url) {
                toast.success(response?.payload.data.message);
                if (selectedOption === 'customer') {
                    setBankDetailsUrl(response?.payload?.data.bank_details_url);
                } else if (selectedOption === 'merchant') {
                    window.location.href = response?.payload?.data.bank_details_url;
                }
            } else {
                toast.error(response?.payload?.detail);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong.');
        }
        setDisable(false);
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(bankDetailsUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="container-fluid mt-4">
            {bankDetailsUrl ? (
                <div className="card shadow-sm p-3">
                    <h5 className="mb-2">Mandate Registration Link</h5>
                    <Link
                        to="/dashboard/create-e-mandate"
                        className="btn cob-btn-primary approve text-white mt-3 position-absolute top-0 end-0 mr-3"
                        onClick={() => setBankDetailsUrl('')} // Clears the URL on click
                    >
                        <i class="fa fa-arrow-left" aria-hidden="true"></i> Back
                    </Link>
                    <div className="d-flex justify-content-between align-items-center border p-2 bg-light mt-3">
                        <span className="text-truncate" style={{ maxWidth: '90%' }}>{bankDetailsUrl}</span>
                        <button className="btn btn-secondary btn-sm" onClick={copyToClipboard}>
                            <i className="fa fa-clipboard"></i>
                        </button>


                    </div>
                </div>
            ) : (


                <div className="card shadow-sm  ">
                    <div className="card-body">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={(values) => {
                                handleViewSubmit(values)

                            }}

                        >
                            {({ setFieldValue, values, errors }) => (
                                <Form>

                                    <div className="row mb-3">

                                        <div className="col-md-3">
                                            <label htmlFor="consumer_id" className="form-label">Consumer ID</label>
                                            <FormikController type="text" id="consumer_id" name="consumer_id" className="form-control" placeholder="Enter Consumer ID" control='input' />

                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="customer_name" className="form-label">Customer Name</label>
                                            <FormikController type="text" id="customer_name" name="customer_name" className="form-control" placeholder="Enter Customer Name" control='input' />

                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="customer_mobile" className="form-label">Customer Mobile</label>
                                            <FormikController type="text" id="customer_mobile" name="customer_mobile" className="form-control" placeholder="Enter Customer Mobile" control='input' />

                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="customer_email_id" className="form-label">Customer Email</label>
                                            <FormikController type="email" id="customer_email_id" name="customer_email_id" className="form-control" placeholder="Enter Customer Email" control='input' />

                                        </div>


                                    </div>
                                    <div className="row mb-3">

                                        <div className="col-md-3">
                                            <label htmlFor="frequency" className="form-label">Amount Type</label>
                                            <FormikController type="number" id="frequency" name="amount_type" className="form-select" control='select' options={AmountType} />

                                        </div>

                                        <div className="col-md-3">
                                            <label htmlFor="frequency" className="form-label">Frequency</label>
                                            <FormikController type="number" id="frequency" name="frequency" className="form-select" control='select' options={frequencyDropdown} />

                                        </div>

                                        <div className="col-md-3">
                                            <label htmlFor="max_amount" className="form-label">Max Amount</label>
                                            <FormikController
                                                type="input"
                                                id="max_amount"
                                                name="max_amount"
                                                className="form-control"
                                                placeholder="Enter Max Amount"
                                                control="input"
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label htmlFor="max_amount" className="form-label">EMI Amount</label>
                                            <FormikController
                                                type="input"
                                                id="emi_amount"
                                                name="emi_amount"
                                                className="form-control"
                                                placeholder="Enter Max Amount"
                                                control="input"
                                            />
                                        </div>

                                    </div>

                                    <div className="row mb-3">



                                        <div className="col-md-3">
                                            <label htmlFor="purpose" className="form-label">Purpose</label>
                                            <FormikController type="text" id="purpose" name="purpose" className="form-select" placeholder="Enter Purpose" control='select' options={dropdownData} />

                                        </div>

                                        <div className="col-md-3">
                                            <label htmlFor="start_date" className="form-label">Start Date</label>
                                            <FormikController
                                                control="date"
                                                id="from_date"
                                                name="start_date"
                                                value={values?.start_date ? new Date(values?.start_date) : null}
                                                onChange={(date) => setFieldValue("start_date", date)}
                                                format="dd-MM-y"
                                                clearIcon={null}
                                                className="form-control rounded-datepicker p-2 zindex_DateCalender"
                                                required={true}
                                                errorMsg={errors["start_date"]}
                                                minDate={moment().add(3, 'days').toDate()}
                                                popperPlacement="top-end"
                                            />
                                        </div>


                                        <div className="col-md-3">
                                            <label htmlFor="end_date" className="form-label">End Date</label>
                                            <FormikController
                                                control="date"
                                                id="end_date"
                                                name="end_date"
                                                value={values.end_date ? new Date(values.end_date) : null}
                                                onChange={(date) => setFieldValue("end_date", date)}
                                                format="dd-MM-y"
                                                clearIcon={null}
                                                className="form-control rounded-datepicker p-2 zindex_DateCalender"
                                                required={true}
                                                errorMsg={errors["end_date"]}
                                                disabled={values.untilCancelled}
                                                popperPlacement="top-end"
                                                minDate={moment().add(4, 'days').toDate()} // disables today and past
                                            // calendarStartDate={moment().add(3, 'days').toDate()} // calendar opens showing 3 days ahead
                                            />
                                            <div className="form-check mt-2">
                                                <Field
                                                    type="checkbox"
                                                    name="untilCancelled *"
                                                    className="form-check-input"
                                                    checked={values.untilCancelled}
                                                    onChange={() => {
                                                        setFieldValue("untilCancelled", !values.untilCancelled);
                                                    }}
                                                />
                                                <label htmlFor="untilCancelled" className="form-check-label ml-1">
                                                    Until Cancelled
                                                </label>
                                            </div>
                                        </div>


                                    </div>



                                    <div className="row mb-3">

                                    </div>

                                    <div className="row">
                                        <div className="col text-center">
                                            <button type="submit" className="btn cob-btn-primary approve text-white" disabled={disable}>
                                                {disable && (
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

                </div>
            )}
        </div>
    );
};

export default CreateEMandateByApi;
