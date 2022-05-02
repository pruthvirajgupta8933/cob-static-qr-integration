import React from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'



function BusinessDetails() {

  
  const choices = [
    { key: "choice a", value: "choicea" },
    { key: "choice b", value: "choiceb" },
  ]

  const initialValues = {
    email: "",
    description: "",
    selectChoice: "",
    radioChoice: "",
    checkBoxChoice: "",
  }
  const validationSchema = Yup.object({
    email: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    selectChoice: Yup.string().required("Required"),
    radioChoice: Yup.string().required("Required"),
    checkBoxChoice: Yup.array().required("Required"),
  })

  const onSubmit = values => console.log("Form data",values)


  return (
    <div className="col-md-12 col-md-offset-4">   
     <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(onSubmit)}
    >
          {formik => (
            <Form>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Business Name *"
                        name="business_name"
                        placeholder="Enter Your Business Name"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                    <FormikController
                        control="input"
                        type="file"
                        label="Company Logo *"
                        name="company_logo"
                        className="form-control"
                      />
                    </div>

                    <div class="form-group col-md-4">
                      <FormikController
                          control="select"                          
                          label="GSTIN *"
                          name="gstin"
                          className="form-control"
                          options={choices}
                        />
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Business Pan *"
                        name="business_pan"
                        placeholder="Enter Business PAN"
                        className="form-control"
                      />
                    </div>

                  
                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="Authorised Signatory PAN *"
                          name="authorised_signatory_pan"
                          placeholder="Enter Authorised Signatory PAN"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="Enter GST No *"
                          name="gst_number"
                          placeholder="Enter GST Number"
                          className="form-control"
                        />
                    </div>

                  </div>

                  <button className="btn btn-primary" type="submit">Submit</button>
                    
            </Form>
          )}

    </Formik>
   
  </div>
  )
}

export default BusinessDetails