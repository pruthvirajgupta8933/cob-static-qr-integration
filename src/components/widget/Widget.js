import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import widgetService from '../../services/widget.service';
import axios from 'axios';
import { WIDGET_URL } from '../../config';
import FormikController from '../../_components/formik/FormikController';
import { FaCopy } from 'react-icons/fa';
import { widgetClientKeys, widgetDetails } from '../../slices/widgetSlice';
import { toast } from "react-toastify";




function MyForm() {
    const dispatch = useDispatch();
    const codeSnippetRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);
    const [show, setShow] = useState(true)
    const [clientKey, setClientKey] = useState("")
    const [disable, setDisable] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useSelector((state) => state.auth);
    const widgetDetail = useSelector((state) => state?.widget?.widgetDetail?.data)

    const activeStatus = widgetDetail?.status
    const postDataSlice = useSelector(state => state?.widget?.postdata);
    const client_key = postDataSlice?.data?.client_key;
    




    // useEffect(() => {
    //     sessionStorage.setItem('client_key', client_key);
    // }, [client_key]); 





    let clientMerchantDetailsList = [];
    let clientCode = "";
    if (user && user.clientMerchantDetailsList === null) {

    } else {
        clientMerchantDetailsList = user.clientMerchantDetailsList;
        clientCode = clientMerchantDetailsList[0].clientCode;
    }
    const initialValues = {
        client_name: widgetDetail?.client_name || '',
        client_code: clientCode,
        client_type: widgetDetail?.client_type || '',
        client_url: widgetDetail?.client_url || '',
        return_url: widgetDetail?.return_url || '',
        image_URL: widgetDetail?.image_URL || '',
        position: widgetDetail?.position || '',
        company_name: widgetDetail?.company_name || ''
    };

    useEffect(() => {
        dispatch(widgetDetails(clientCode))
            .then(() => {
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching widget details:', error);
                setIsLoading(false);
            });
    }, [dispatch, clientCode, activeStatus]);


    const validationSchema = Yup.object().shape({
        client_name: Yup.string().required('Client Name is required'),
        client_code: Yup.string().required('Client Code is required'),
        client_type: Yup.string().required('Client Type is required'),
        client_url: Yup.string().url('Invalid URL').required('Client URL is required'),
        return_url: Yup.string().url('Invalid URL').required('Return URL is required'),
        image_URL: Yup.string().url('Invalid URL').required('Return URL is required'),
        position: Yup.string().required('Position is required'),
        company_name: Yup.string().required('Company Name is required')
    });





    const handleSubmit = (values) => {

        setDisable(true);
        const postData = {

            "client_name": values.client_name,
            "client_code": clientCode,
            "client_type": values.client_type,
            "client_url": values.client_url,
            "return_url": values.return_url,
            "image_URL": values.image_URL,
            "position": values.position,
            "company_name": values.company_name

        }


        dispatch(
            widgetClientKeys(postData)
        )
            .then((res) => {

                if (
                    res?.meta?.requestStatus === "fulfilled"

                ) {
                    setDisable(false);
                    const data = res?.payload?.data?.client_key
                    dispatch(widgetDetails(clientCode))
                    setClientKey(data)
                    setShow(false)
                    toast.success(res.payload?.message);

                } else {
                    toast.error(res?.payload ?? "Somthing went wrong");
                }
            }).catch((error) => {
                toast.error(error?.res?.data.message);

                // console.log("error",error);
                // console.log("error", error)
                // toast.error("Something went wrong");
            })


    };

    const copyToClipboard = () => {
        if (codeSnippetRef.current) {
            const codeSnippet = codeSnippetRef.current.innerText;
            navigator.clipboard.writeText(codeSnippet)
                .then(() => {
                    setIsCopied(true);

                    // Reset the copy status after a delay (e.g., 2 seconds)
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 1000);
                })
                .catch((error) => {
                    console.error('Error copying code to clipboard:', error);
                });
        }


    };

    // useEffect(() => {
    //     // Access the DOM element and set the client_key attribute
    //     const sabpaisaDiv = document.getElementById('sabpaisa');
    //     sabpaisaDiv.setAttribute('client_key', clientKey);
    //   }, [clientKey]);


    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-6">
                    <h5 className="">Create Widget</h5>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {({

                        }) => (
                            <Form>
                                <div className="row mt-3">
                                    <div className="col-lg-6 col-sm-12 col-md-12">
                                        <label className="col-form-label mt-0 p-2" >
                                            Client Name<span className="text-danger">*</span>
                                        </label>

                                        <FormikController
                                            control="input"
                                            type="text"
                                            name="client_name"
                                            className="form-control"
                                            placeholder="Enter client name"
                                            disabled={activeStatus === "Active" || activeStatus === "Pending"}

                                        />
                                    </div>

                                    <div className="col-sm-6 col-md-6 col-lg-6" >
                                        <label className="col-form-label mt-0 p-2 " >
                                            Client Code<span style={{ color: "red" }}>*</span>
                                        </label>

                                        <FormikController
                                            control="input"
                                            type="text"
                                            name="client_code"
                                            placeholder="Enter client code"
                                            disabled={activeStatus === "Active" || activeStatus === "Pending"}
                                            className="form-control"


                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6 col-md-6 col-lg-6">
                                        <label className="col-form-label mt-0 p-2">
                                            Client Type<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="client_type"
                                                placeholder="Enter client type"
                                                className="form-control"
                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}
                                            />
                                        </div>

                                        {
                                            <ErrorMessage name="client_type">
                                                {(msg) => (
                                                    <span className="abhitest- errortxt- text-danger">
                                                        {msg}
                                                    </span>
                                                )}
                                            </ErrorMessage>
                                        }
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 ">
                                        <label className="col-form-label mt-0 p-2">
                                            Client URL<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="client_url"
                                                placeholder="Enter client url"
                                                className="form-control"
                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}

                                            />


                                        </div>

                                        {<ErrorMessage name="client_url">
                                            {(msg) => (
                                                <span className="abhitest- errortxt- text-danger">
                                                    {msg}
                                                </span>
                                            )}
                                        </ErrorMessage>
                                        }

                                    </div>


                                </div>

                                <div className="row">
                                    <div className="col-sm-6 col-md-6 col-lg-6">
                                        <label className="col-form-label mt-0 p-2">
                                            Return URL<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="return_url"
                                                className="form-control"
                                                placeholder="Enter return url"

                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}
                                            />
                                        </div>

                                        {
                                            <ErrorMessage name="return_url">
                                                {(msg) => (
                                                    <span className="abhitest- errortxt- text-danger">
                                                        {msg}
                                                    </span>
                                                )}
                                            </ErrorMessage>
                                        }
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 ">
                                        <label className="col-form-label mt-0 p-2">
                                            Image URL<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="image_URL"
                                                className="form-control"
                                                placeholder="Enter image url"
                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}

                                            />


                                        </div>

                                        {<ErrorMessage name="image_URL">
                                            {(msg) => (
                                                <span className="abhitest- errortxt- text-danger">
                                                    {msg}
                                                </span>
                                            )}
                                        </ErrorMessage>
                                        }

                                    </div>

                                </div>


                                <div className="row">
                                    <div className="col-sm-6 col-md-6 col-lg-6">
                                        <label className="col-form-label mt-0 p-2">
                                            Position<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="position"
                                                className="form-control"
                                                placeholder="Enter position"

                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}
                                            />
                                        </div>

                                        {
                                            <ErrorMessage name="position">
                                                {(msg) => (
                                                    <span className="abhitest- errortxt- text-danger">
                                                        {msg}
                                                    </span>
                                                )}
                                            </ErrorMessage>
                                        }
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 ">
                                        <label className="col-form-label mt-0 p-2">
                                            Company Name<span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="input-group">
                                            <Field
                                                type="text"
                                                name="company_name"
                                                className="form-control"
                                                placeholder="Enter company name"
                                                disabled={activeStatus === "Active" || activeStatus === "Pending"}

                                            />


                                        </div>

                                        {<ErrorMessage name="company_name">
                                            {(msg) => (
                                                <span className="abhitest- errortxt- text-danger">
                                                    {msg}
                                                </span>
                                            )}
                                        </ErrorMessage>
                                        }

                                    </div>

                                </div>
                                {!(activeStatus === "Active" || activeStatus === "Pending") && (
                                    <div className="row mt-4">
                                        <div className="col-sm-12 col-md-12 col-lg-12 col-form-label d-flex justify-content-center">

                                            <button
                                                disabled={activeStatus === "Active" ? true : false}
                                                type="submit"
                                                className="btn btn-sm  cob-btn-primary text-white"
                                                style={{ width: "150px", height: "40px" }}
                                            >

                                                Create Client Key
                                            </button>

                                        </div>
                                    </div>
                                )}

                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="col-lg-6">
                    {isLoading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        activeStatus === "Active" ? (
                            <React.Fragment>
                                <div className="code-snippet mt-5">
                                    <div className="d-flex justify-content-end align-items-center mb-3">
                                        <span
                                            className="input-group-text"
                                            style={{ cursor: 'pointer' }}
                                            onClick={copyToClipboard}
                                            data-tip={isCopied ? "Copied!" : "Copy"}
                                        >
                                            <i className="fa fa-copy" style={{ fontSize: '12px' }}></i>
                                        </span>
                                    </div>
                                    <pre ref={codeSnippetRef}>
                                        <code>
                                            &lt;div id="sabpaisa" client_code="{clientCode}" client_key="{widgetDetail?.client_key}"&gt;&lt;/div&gt; <br /><br />
                                            &lt;script id="widget-1" src="https://pg-widget-button-staging.web.app/src/widgets/Widget1/Widget1.js"
                                            <br />
                                            &nbsp;data-config="https://pg-widget-button-staging.web.app/src/widgets/Widget1/config.json"&gt;&lt;/script&gt;
                                            <br />
                                            &lt;script src="https://payment-widget-sabpaisa.web.app/widget-bundle.js"&gt;&lt;/script&gt;
                                            <br />
                                        </code>
                                    </pre>
                                </div>
                                <div className="instructions">
                                    <h6>
                                        Instruction : To use this widget, please copy the <span className="ml-1 mr-1">above</span>
                                        <span className="html-tag">&lt;div&gt;</span> and
                                        <span className="ml-1 mr-1">above</span>
                                        <span className="html-tag">&lt;script&gt;</span>
                                        <span className="ml-1 mr-1">into the &lt;body&gt; tag of your HTML document.</span>
                                    </h6>
                                </div>
                            </React.Fragment>
                        ) : (
                            activeStatus === "Pending" && (
                                <div className="alert alert-warning alertcss ml-3" role="alert">
                                    Thank you for your registration with our new product, "Widget".Please bear with us.Your "Access Key" will be generated below, post approval from us!
                                </div>
                            ))
                    )}
                </div>

            </div>
        </div>
    );
}

export default MyForm;




