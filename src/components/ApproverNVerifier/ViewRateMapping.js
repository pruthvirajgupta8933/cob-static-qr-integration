import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import { toast } from "react-toastify";
import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import RateRadioMapping from './RateRadioMapping';
import { useDispatch, useSelector } from "react-redux";
import { riskCategory, businessCategory,templateRate,viewRateMap} from '../../slices/rateMappingSlice';

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
    const[businessTemplate,setBusinessTemplate]=useState("")
    const[businessTemplates,setBusinessTemplates]=useState([])
    const [show, setShow] = useState(false)
    const [riskTemplate, setRisktemplate] = useState([])
    const [risk, setRisk] = useState([])
    const [riskCode, setRiskCode] = useState("")
    const [businessCode, setBusinessCode] = useState([]);
    
    const dispatch = useDispatch();

   


    useEffect(() => {
       dispatch(riskCategory())
            .then((resp) => {
                const data =
                    convertToFormikSelectJson("risk_category_code", "risk_category_name", resp?.payload);

                setRisk(data);

            })
        // .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (riskCode !== "") {
            const postData = {
                risk_category_code: riskCode
            };
           dispatch( businessCategory(postData)).then((resp) => {
                    
                    const data = convertToFormikSelectJson("business_category_id", "category_name", resp?.payload?.Data);

                    setTemplate(data)
                }).catch((err) => {

                })
        }
    }, [riskCode]);

    ///////////////////////////////////////////////////////////new Work
    useEffect(() => {
        if (businessTemplate !== "") {
            const postData = {
                business_cat_code: businessTemplate
            };
           dispatch(templateRate(postData)).then((resp) => {
                    const data = convertToFormikSelectJson("rate_template_code", "rate_template_name", resp?.payload);

                    setBusinessTemplates(data)
                }).catch((err) => {

                })
        }
    }, [businessTemplate]);
    //////////////////////////////////////////////////////////////////


   

    // useEffect(() => {
    //     axiosInstanceAuth
    //         .get(API_URL.Business_Category_CODE)
    //         .then((resp) => {
    //             const data =
    //                 convertToFormikSelectJson("category_id", "category_name", resp?.data);

    //             // const sortAlpha = data?.sort((a, b) =>
    //             //   a.category_name
    //             //     .toLowerCase()
    //             //     .localeCompare(b.category_name.toLowerCase())
    //             // );

    //             setBusinessCode(data);
    //         })
    //         .catch((err) => console.log(err));
    // }, []);








    const handleSubmit = (values) => {


        const postData = {
            "rate_template_code": values.category_name,
            "business_cat_code": values.risk_category_name ,
            "risk_cat_code": values.rate_template_name

        };
       dispatch(viewRateMap(postData)).then((resp) => {
                setRisktemplate(resp?.payload)
                // toast.success(resp?.data?.message);
            
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
                                                                name="category_name"
                                                                options={risk}
                                                                className="form-control"

                                                            />
                                                            {formik.handleChange(
                                                                "category_name",
                                                                setRiskCode(formik?.values?.category_name)
                                                            )}

                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div className="input full- optional">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="rate_template_name"
                                                            >
                                                                Business category
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name="rate_template_name"
                                                                options={template}
                                                                className="form-control"

                                                            />
                                                              {formik.handleChange(
                                                                "rate_template_name",
                                                                setBusinessTemplate(formik?.values?.rate_template_name)
                                                            )}


                                                        </div>
                                                    </div>
                                                    <div class="col-lg-4">
                                                        <div className="input full- optional">
                                                            <label
                                                                className="string optional"
                                                                htmlFor="Template_rate"
                                                            >
                                                                Template Rate
                                                            </label>
                                                            <FormikController
                                                                control="select"
                                                                name= "risk_category_name"
                                                                options={businessTemplates}
                                                                className="form-control"

                                                            />


                                                        </div>
                                                    </div>
                                                 
                                                </div>


                                                <div class="modal-footer">
                                                    {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                                                    <button type="submit"  class="btn btn-primary">View</button>
                                                    {show === true ? (
                                                        <div className='col-lg-12'>
                                                        <RateRadioMapping riskTemplate={riskTemplate} chiledCode={props?.userData}/>
                                                        </div>
                                                       

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
