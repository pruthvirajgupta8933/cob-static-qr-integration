import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../_components/formik/FormikController";

const initialStateForRadio = {
    isChecked: "",
}

const NewvalidationSchemaforRadio = Yup.object({
    isChecked: Yup.string().required("Please choose Rate Template").nullable(),

})


const RateRadioMapping = (props) => {

    const radiobutton = [
        { key: "", value: "true" },
    ];


    const handleSubmitForRadio = (values) => {
       console.log(values)
    }
    return (
        <div>

            <table class="table mt-5-">
                <thead>
                    <tr>
                        <th scope="col">Check</th>
                        <th scope="col">ClientCode</th>
                        <th scope="col">Template Name</th>

                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(props?.riskTemplate) ? props?.riskTemplate?.map((riskTemplate, i) => (

                        <tr>


                            <td>
                                <div class="form-check">
                                    <Formik
                                        initialValues={initialStateForRadio}
                                        validationSchema={NewvalidationSchemaforRadio}
                                        
                                        onSubmit={(values) => {
                                            
                                            handleSubmitForRadio(values);

                                        }}
                                        enableReinitialize={true}>
                                        <Form>



                                            <FormikController
                                                control="radio"
                                                name="isChecked"
                                                options={radiobutton}
                                                className="form-control"

                                            />
                                            <button type="submit"  class="btn btn-primary">Submit</button>

                                        </Form>
                                        </Formik>
                                </div></td>
                            <td>{riskTemplate?.client_code}</td>
                            <td>{riskTemplate?.rate_template_name}</td>

                        </tr>


                    )) : []}


                </tbody>


            </table>
      


        </div >
    )
}

export default RateRadioMapping
