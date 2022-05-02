import React from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'


function ContactInfo() {
  
  const choices = [
    { key: "choice a", value: "choicea" },
    { key: "choice b", value: "choiceb" },
  ]

  const initialValues = {
    contact_name: "",
    contact_number: "",
    contact_email: "",
    contact_designation: "",
  }
  const validationSchema = Yup.object({
    contact_name: Yup.string().required("Required"),
    contact_number: Yup.string().required("Required"),
    contact_email: Yup.string().required("Required"),
    contact_designation: Yup.array().required("Required"),
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
                        label="Contact Name *"
                        name="contact_name"
                        placeholder="Contact Name"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                    <FormikController
                        control="input"
                        type="text"
                        label="Contact Number *"
                        name="contact_number"
                        placeholder="Contact Number"
                        className="form-control"
                      />
                      <p>Send OTP</p>
                    </div>
                    
                  </div>


                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Contact Email *"
                        name="contact_email"
                        placeholder="Enter Contact Email"
                        className="form-control"
                      />
                      <p>Send OTP</p>
                    </div>

                  
                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="Contact Designation *"
                          name="contact_designation"
                          placeholder="Contact Designation"
                          className="form-control"
                        />
                    </div>
                  </div>

                  <button className="btn btn-primary" type="submit">Save</button>
                    
            </Form>
          )}

    </Formik>
    
  </div>
  )
}

export default ContactInfo