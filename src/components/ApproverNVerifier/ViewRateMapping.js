/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";

import RateRadioMapping from './RateRadioMapping';
import { useDispatch } from "react-redux";
import { templateRate, viewRateMap } from '../../slices/rateMappingSlice';
import { busiCategory } from '../../slices/kycSlice';

const initialValues = {
    business_category: "",
    risk_category_name: "",
    category_name: ""
}

const validationSchema = Yup.object({
    business_category: Yup.string().required("Required").nullable(),
    risk_category_name: Yup.string().required("Required").nullable(),

})


const ViewRateMapping = (props) => {


    const [businessTemplate, setBusinessTemplate] = useState("")
    const [businessTemplates, setBusinessTemplates] = useState([])
    const [show, setShow] = useState(false)
    const [riskTemplate, setRisktemplate] = useState([])
    const [risk, setRisk] = useState([])


    const [disable, setDisable] = useState(false)

    const dispatch = useDispatch();




    useEffect(() => {

        dispatch(busiCategory())
            .then((resp) => {
                const data = convertToFormikSelectJson(
                    "category_id",
                    "category_name",
                    resp.payload
                );
                setRisk(data);

            })
        // .catch((err) => console.log(err));
    }, []);


    ///////////////////////////////////////////////////////////new Work
    useEffect(() => {

        if (businessTemplate !== "") {
            const postData = {
                business_cat_code: businessTemplate
            };
            setDisable(false)
            dispatch(templateRate(postData)).then((resp) => {
                const data = convertToFormikSelectJson("rate_template_code", "rate_template_name", resp?.payload);
                setBusinessTemplates(data)
            }).catch((err) => {

            })
        }

    }, [businessTemplate]);
    /////////////////////////////////////////////////// ///////////////


    const handleSubmit = async (values) => {
        setDisable(true);
        const postData = {
            "rate_template_code": values?.business_category,
            "business_cat_code": values?.risk_category_name,
            // "risk_cat_code": values.rate_template_name
        };

        try {
            const resp = await dispatch(viewRateMap(postData));
            setRisktemplate(resp?.payload);
            setDisable(true);
            setShow(true);
        } catch (error) {
            setDisable(true);

        }
    };

    return (
        <div>

            <div className="modal fade mymodals" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}

                            onSubmit={(values, { resetForm }) => {
                                handleSubmit(values)

                            }}
                            enableReinitialize={true}
                        >
                            {(formik) => (

                                <>
                                    <div className="modal-header">
                                        <h5 className="modal-title bolding text-black" id="exampleModalLongTitle">Rate Mapping</h5>

                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShow(false)}>
                                            <span aria-hidden="true">&times;
                                            </span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <p className="m-0">Client Name: {props?.userData?.clientName}</p>
                                            <p className="m-0">Client Code: {props?.userData?.clientCode}</p>
                                        </div>

                                        <div className="container">
                                            <Form>
                                                <div className="row">
                                                    <div className="col-lg-6 ">
                                                        <div className="">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="business_category"
                                                            >
                                                                Business Category
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="business_category"
                                                                options={risk}
                                                                className="form-control"

                                                            />
                                                            {formik.handleChange(
                                                                "rate_template_name",
                                                                setBusinessTemplate(formik?.values?.business_category),

                                                            )}


                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="Template_rate"
                                                            >
                                                                Choose Rate Template
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="risk_category_name"
                                                                options={businessTemplates}
                                                                className="form-control"

                                                            />


                                                        </div>
                                                    </div>

                                                </div>

                                                <div >
                                                    <button disabled={disable} type="submit" className="btn cob-btn-primary mt-2  text-white">View</button>

                                                </div>
                                            </Form>

                                            {show === true ? (
                                                <div className="col-lg-12 mt-5">
                                                    <RateRadioMapping riskTemplate={riskTemplate} chiledCode={props?.userData} />
                                                </div>


                                            ) : (
                                                <></>
                                            )}

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
