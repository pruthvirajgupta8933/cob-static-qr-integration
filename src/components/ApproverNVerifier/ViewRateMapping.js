import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import { toast } from "react-toastify";
import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';

const initialValues = {
    rate_template_name: "",
    risk_category_name: "",
    category_name: ""
}

const validationSchema = Yup.object({
    rate_template_name: Yup.string().required("Required").nullable(),
    risk_category_name: Yup.string().required("Required").nullable(),
    category_name: Yup.string().required("Required").nullable()
})


const ViewRateMapping = (props) => {

    const [template, setTemplate] = useState([])
    const [show, setShow] = useState(false)
    const [riskTemplate, setRisktemplate] = useState([])
    const [risk, setRisk] = useState([])
    const [riskCode, setRiskCode] = useState("")
    const [businessCode, setBusinessCode] = useState([]);

    const radiobutton = [
        { key: "", value: "true" },
    ];


    useEffect(() => {
        axiosInstanceAuth
            .get(API_URL.RISK_CATEGORY)
            .then((resp) => {
                const data =
                    convertToFormikSelectJson("risk_category_code", "risk_category_name", resp?.data);

                setRisk(data);

            })
        // .catch((err) => console.log(err));
    }, []);

    useEffect(() => {

        if (riskCode !== "") {
            const postData = {
                risk_cat_code: riskCode
            };
            axiosInstanceAuth
                .post(API_URL.GET_TEMPLATE_DETAILS, postData).then((resp) => {
                    const data = convertToFormikSelectJson("rate_template_code", "rate_template_name", resp?.data);

                    setTemplate(data)
                }).catch((err) => {

                })
        }
    }, [riskCode]);
    function GetSortOrder(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }    

    useEffect(() => {
        axiosInstanceAuth
            .get(API_URL.Business_Category_CODE)
            .then((resp) => {
                const data =
                    convertToFormikSelectJson("category_id", "category_name", resp?.data);

                // const sortAlpha = data?.sort((a, b) =>
                //   a.category_name
                //     .toLowerCase()
                //     .localeCompare(b.category_name.toLowerCase())
                // );

                setBusinessCode(data);
            })
            .catch((err) => console.log(err));
    }, []);



    const handleSubmit = (values) => {

        const postData = {
            "rate_template_code": values.rate_template_name,
            "business_cat_code": values.risk_category_name,
            "risk_cat_code": values.category_name
        };
        axiosInstanceAuth
            .post(API_URL.GET_RISK_TEMPLSTE, postData).then((resp) => {
                setRisktemplate(resp?.data)
                // toast.success(resp?.data?.message);
                console.log(resp, "the response is here")

                setShow(true)
            }).catch(() => {


            })
    }
    return (
        <div>

            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            // onSubmit={(values)=>handleSubmit(values)}
                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values)
                                resetForm()
                            }}
                            enableReinitialize={true}
                        >
                            {(formik, resetForm) => (

                                <>

                                    <div class="modal-header">
                                        <h5 class="modal-title bolding text-black" id="exampleModalLongTitle">Rate Mapping</h5>

                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"  onClick={() => setShow(false)}>
                                            <span aria-hidden="true">&times;
                                            </span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <h5 className="font-weight-bold">Name: {props?.userData?.clientName}</h5>
                                        <h5 className="font-weight-bold">ClientCode: {props?.userData?.clientCode}</h5>
                                        <div class="container">

                                            <Form>

                                                <div class="row">
                                                    <div class="col-lg-4">
                                                        <div className="input full- optional">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="risk_category"
                                                            >
                                                                Risk category
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="risk_category_name"
                                                                options={risk}
                                                                className="form-control"

                                                            />
                                                            {formik.handleChange(
                                                                "risk_category_name",
                                                                setRiskCode(formik?.values?.risk_category_name)
                                                            )}

                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div className="input full- optional">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="rate_template_name"
                                                            >
                                                                Template Rate
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="rate_template_name"
                                                                options={template}
                                                                className="form-control"

                                                            />


                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div className="input full- optional">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="category_name"
                                                            >
                                                                Business category
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="category_name"
                                                                options={businessCode}
                                                                className="form-control"

                                                            />


                                                        </div>
                                                    </div>
                                                </div>


                                                <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                                                    <button type="subbmit" onClick={resetForm} class="btn btn-primary">View</button>
                                                    {show === true ? (
                                                        <table class="table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Check</th>
                                                                    <th scope="col">ClientCode</th>
                                                                    <th scope="col">Template Name</th>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {riskTemplate?.map((riskTemplate, i) => (
                                                                <tr>


                                                                    <td>
                                                                        <div class="form-check">
                                                                        <label class="form-check-label" for="flexRadioDefault1">
                                                                                Default radio
                                                                            </label>
                                                                            <FormikController
                                                                                control="radio"
                                                                                name="risk_category_name"
                                                                                options={radiobutton}
                                                                                className="form-control"

                                                                            />
                                                                           
                                                                        </div></td>
                                                                    <td>{riskTemplate?.client_code}</td>
                                                                    <td>{riskTemplate?.rate_template_name}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>

                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>

                                            </Form>


                                        </div>

                                    </div>


                                </>
                            )}

                        </Formik>



                    </div>

                </div>
            </div>

        </div>
    )
}

export default ViewRateMapping;
