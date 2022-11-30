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
    risk_category_name: ""
}

const validationSchema = Yup.object({
    rate_template_name: Yup.string().required("Required").nullable(),
    risk_category_name: Yup.string().required("Required").nullable()
})


const ViewRateMapping = (props) => {
    
    const [template, setTemplate] = useState([])
    const [risk, setRisk] = useState([])
    const [riskCode, setRiskCode] = useState("")
  

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
   

  const handleSubmit=()=>{
        
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

                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={resetForm} >
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
                                                    <div class="col-lg-6">
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
                                                    <div class="col-lg-6">
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
                                                     </div>


                                                <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                                                    <button type="subbmit" onClick={resetForm} class="btn btn-primary">Subbmit</button>
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
