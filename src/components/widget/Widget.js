import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FieldArray } from 'formik';
import { toast } from 'react-toastify';
import Splogo from "../../assets/images/sp-logo.png";
import "./widget.css";
import widgetService from "../../services/widget.service";

import CardLayout from "../../utilities/CardLayout"

function MyForm() {
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [nextParamId, setNextParamId] = useState(12); // Param ID starts at 12

    const stepTitles = ['Basic Info', 'Button Details', 'Client Params', 'Amount Type', 'Submit'];

    const initialValues = {
        client_name: '',
        client_code: '',
        client_type: '',
        client_url: '',
        return_url: '',
        image_url: '',
        position: '',
        company_name: '',
        description: '',
        button_style: { button_color: '', size: '', border_radius: '', title: '' },
        button_type: '',
        amount_type: {
            amount_type: '',
            options: [{ item: '', amount: '' }],
            default_amount: '',
            static_amount: false
        },
        client_params: [
            { param_id: nextParamId, label: '', mandatory: false, input_type: 'text', options: [], date: '' }
        ]
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (values) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const clientMerchantDetailsList = user?.clientMerchantDetailsList;
        const transformedValues = {
            client_data: {
                client_name: clientMerchantDetailsList[0].clientName,
                client_code: clientMerchantDetailsList[0].clientCode,
                client_type: clientMerchantDetailsList[0].clientType,
                client_url: values.client_url,
                return_url: values.return_url,
                image_URL: values.image_url,
                position: "top",
                company_name: values.company_name,
                description: values.description,
                button_style: values.button_style,
                button_type: values.button_type
            },
            amount_type: values.amount_type,
            client_params: values.client_params
        };
        try {

            const response = await widgetService.createClientkey(transformedValues);
            if (response?.status == 200) {
                toast.success(`${response?.data?.message}`);
                setStep(1);
            }
        }
        catch (err) {
            toast.error(`Something went wrong.`);

        }

    };

    const [buttonTitle, setButtonTitle] = useState("Pay Now");
    const [buttonColor, setButtonColor] = useState("");
    // ✅ Centralized Handle Change Function
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        if (name == "button_style.title") {
            setButtonTitle(fieldValue);
        }
        if (name == "button_style.button_color") {
            setButtonColor(fieldValue);
        }

    };

    // ✅ Helper to use setFieldValue with logging
    const customHandleChange = (e, setFieldValue) => {
        handleChange(e);
        setFieldValue(e.target.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value);
    };



    return (
        <CardLayout title="Create Widget" maxWidth="800px" center={true}  >

            <div className="mb-5">
                <div className="position-relative d-flex justify-content-between align-items-center mx-auto" style={{ maxWidth: '720px' }}>
                    {stepTitles.map((title, index) => {
                        const isActive = step === index + 1;
                        const isCompleted = step > index + 1;

                        return (
                            <div key={index} className="text-center position-relative" style={{ zIndex: 2 }}>
                                <div className={`rounded-circle d-flex justify-content-center align-items-center mx-auto mb-2 
                                    ${isActive ? 'bg-primary text-white shadow' : isCompleted ? 'bg-success text-white' : 'bg-secondary-subtle text-dark'}`}
                                    style={{
                                        width: '26px', height: '26px', fontSize: '0.8rem', border: '2px solid white'
                                    }}>
                                    {isCompleted ? <i className="bi bi-check-lg" style={{ fontSize: '0.9rem' }}></i> : index + 1}
                                </div>
                                <div className={`small ${isActive ? 'text-primary fw-bold' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>{title}</div>
                                {index < stepTitles.length - 1 && (
                                    <div className="position-absolute top-50 start-100 translate-middle-y" style={{
                                        height: '2px', width: '100%', backgroundColor: step > index + 1 ? '#198754' : '#ced4da', zIndex: 1
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue, handleBlur }) => (
                    <Form>

                        {step === 1 && (
                            <div className="row">
                                {["client_url", "return_url", "image_url", "company_name"].map(field => (
                                    <div className="col-md-6 mb-4" key={field}>
                                        <label htmlFor={field} className="form-label mb-2">
                                            {field.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </label>
                                        <Field
                                            name={field}
                                            id={field}
                                            className="form-control"
                                            placeholder={`Enter ${field.replace('_', ' ').split(' ').map(word => word.charAt(0) + word.slice(1)).join(' ')}`}
                                            onChange={(e) => customHandleChange(e, setFieldValue)}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 2 && (
                            <>
                                <h5 className="mb-4">Button Style</h5>
                                <div className="d-flex justify-content-between flex-wrap gap-4">
                                    <div style={{ flex: 1, minWidth: "280px", maxWidth: "400px" }}>
                                        <div className="mb-3">
                                            <label className="form-label">Button Title</label>
                                            <Field
                                                name="button_style.title"
                                                className="form-control"
                                                placeholder="Enter Button Title"
                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                onBlur={handleBlur}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Button Color</label>
                                            <Field
                                                as="select"
                                                name="button_style.button_color"
                                                className="form-select"
                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Button Color</option>
                                                <option value="#BE3D2A">Red</option>
                                                <option value="#3F7D58">Green</option>
                                                <option value="#2a53ee">Blue</option>
                                            </Field>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Button Type</label>
                                            <Field
                                                as="select"
                                                name="button_type"
                                                className="form-select"
                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select Button Type</option>
                                                <option value="quickpay">Quick Pay</option>
                                                <option value="donationpay">Donation Pay</option>
                                            </Field>
                                        </div>
                                    </div>

                                    <div>
                                        <h6 className="mb-3">Button Preview</h6>
                                        <div className="widget-cross" style={{ backgroundColor: buttonColor }}>
                                            <div style={{ cursor: "pointer" }} className="my-flex-container">
                                                <img src={Splogo} className="logo-img" alt="SabPaisa Logo" />
                                                <div>
                                                    <div className="pay-now-title" style={{ fontStyle: 'italic' }}>{buttonTitle}</div>
                                                    <div className="secured-by" style={{ fontSize: '10px', marginLeft: '5px' }}>
                                                        Secured By SabPaisa
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h5>Client Params</h5>
                                <FieldArray name="client_params">
                                    {({ push, remove }) => (
                                        <>
                                            {values.client_params.map((param, idx) => (
                                                <div key={idx} className="border p-3 mb-3 rounded">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-2">
                                                            <Field
                                                                name={`client_params[${idx}].label`}
                                                                className="form-control"
                                                                placeholder="Label"
                                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-2">
                                                            <Field
                                                                as="select"
                                                                name={`client_params[${idx}].input_type`}
                                                                className="form-control"
                                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                                onBlur={handleBlur}
                                                            >
                                                                <option value="text">Text</option>
                                                                <option value="number">Number</option>
                                                                <option value="dropdown">Dropdown</option>
                                                                <option value="checkbox">Checkbox</option>
                                                                <option value="date">Date</option>
                                                            </Field>
                                                        </div>
                                                    </div>

                                                    {param.input_type === 'dropdown' && (
                                                        <FieldArray name={`client_params[${idx}].options`}>
                                                            {({ push: pushOpt, remove: removeOpt }) => (
                                                                <>
                                                                    {(param.options || []).map((opt, oIdx) => (
                                                                        <div key={oIdx} className="d-flex mb-2">
                                                                            <Field
                                                                                name={`client_params[${idx}].options[${oIdx}]`}
                                                                                className="form-control me-2"
                                                                                placeholder={`Option ${oIdx + 1}`}
                                                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                                                onBlur={handleBlur}
                                                                            />
                                                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeOpt(oIdx)}>x</button>
                                                                        </div>
                                                                    ))}
                                                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => pushOpt('')}>+ Add Option</button>
                                                                </>
                                                            )}
                                                        </FieldArray>
                                                    )}

                                                    <div className="form-check mt-2">
                                                        <Field
                                                            type="checkbox"
                                                            name={`client_params[${idx}].mandatory`}
                                                            className="form-check-input"
                                                            onChange={(e) => customHandleChange(e, setFieldValue)}
                                                            onBlur={handleBlur}
                                                        />
                                                        <label className="form-check-label">Mandatory</label>
                                                    </div>
                                                    <button type="button" className="btn btn-danger btn-sm mt-2" onClick={() => remove(idx)}>Remove Param</button>
                                                </div>
                                            ))}

                                            <button type="button" className="btn cob-btn-primary approve text-white btn-sm"
                                                onClick={() => {
                                                    push({ param_id: nextParamId, label: '', mandatory: false, input_type: 'text', options: [], date: '' });
                                                    setNextParamId(prev => prev + 1);
                                                }}>
                                                + Add Param
                                            </button>
                                        </>
                                    )}
                                </FieldArray>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <label>Amount Type</label>

                                <div className="mb-3">
                                    <Field
                                        as="select"
                                        name="amount_type.amount_type"
                                        className="form-control form-select"
                                        onChange={(e) => customHandleChange(e, setFieldValue)}
                                        onBlur={handleBlur}
                                    >
                                        <option value="">Select Amount Type</option>
                                        <option value="Donation">Donation</option>
                                        <option value="Quickpay">Quickpay</option>
                                    </Field>
                                </div>

                                {values.amount_type.amount_type === 'Donation' && (
                                    <FieldArray name="amount_type.options">
                                        {({ push, remove }) => (
                                            <>
                                                {values.amount_type.options.map((option, idx) => (
                                                    <div key={idx} className="row mb-2">
                                                        <div className="col">
                                                            <Field
                                                                name={`amount_type.options[${idx}].item`}
                                                                className="form-control"
                                                                placeholder="Item"
                                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>
                                                        <div className="col">
                                                            <Field
                                                                name={`amount_type.options[${idx}].amount`}
                                                                type="number"
                                                                className="form-control"
                                                                placeholder="Amount"
                                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>
                                                        <div className="col-auto">
                                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(idx)}>Remove</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button type="button" className="mt-2 btn cob-btn-primary approve text-white ms-auto btn-sm" onClick={() => push({ item: '', amount: '' })}>+ Add Option</button>
                                            </>
                                        )}
                                    </FieldArray>
                                )}

                                {values.amount_type.amount_type === 'Quickpay' && (
                                    <>
                                        <Field
                                            name="amount_type.default_amount"
                                            type="number"
                                            className="form-control mb-2"
                                            placeholder="Default Amount"
                                            onChange={(e) => customHandleChange(e, setFieldValue)}
                                            onBlur={handleBlur}
                                        />
                                        <div className="form-check">
                                            <Field
                                                type="checkbox"
                                                name="amount_type.static_amount"
                                                className="form-check-input"
                                                onChange={(e) => customHandleChange(e, setFieldValue)}
                                                onBlur={handleBlur}
                                            />
                                            <label className="form-check-label">Static Amount</label>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {step === 5 && (
                            <div className="text-center">
                                <h5 className="mb-4">Review & Submit</h5>
                                <button type="submit" className="btn cob-btn-primary approve text-white">Submit</button>
                            </div>
                        )}

                        <div className="d-flex justify-content-between mt-4">
                            {step > 1 ? (
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={prevStep}>← Back</button>
                            ) : <div />}
                            {step < 5 ? (
                                <button type="button" className="btn cob-btn-primary approve text-white ms-auto" onClick={nextStep}>Next →</button>
                            ) : null}
                        </div>
                    </Form>
                )}
            </Formik>

        </CardLayout>
    );
}

export default MyForm;