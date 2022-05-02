import React from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'


function BusinessOverview() {

  
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
              <div class="form-group col-md-4">
              <FormikController
                  control="select"
                  label="Business Type* "
                  name="business_type"
                  options={choices}
                  className="form-control"
                />
              </div>

              <div class="form-group col-md-4">
              <FormikController
                  control="select"
                  label="Business Category *"
                  name="business_category"
                  options={choices}
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
              <FormikController
                        control="input"
                        type="text"
                        label="Business Model *"
                        name="business_model"
                        placeholder="Business Model"
                        className="form-control"
                      />
              </div>
          </div>

          
          <div className="form-row">
            <div className="form-group col-md-4">
            <FormikController
                        control="input"
                        type="text"
                        label="Billing Label *"
                        name="billing_label"
                        placeholder="Billing Label"
                        className="form-control"
                      />
            </div>
            
              <div class="form-group col-md-4">
              <FormikController
                  control="select"
                  label="Do you have you own ERP *"
                  name="erp"
                  options={choices}
                  className="form-control"
                />
              </div>
            
              <div class="form-group col-md-4">
              <FormikController
                  control="select"
                  label="Platform *"
                  name="platform"
                  options={choices}
                  className="form-control"
                />
              </div>

          </div>

          
          <div className="form-row">
          <div class="form-group col-md-4">
              <FormikController
                  control="select"
                  label="Website/App url *"
                  name="seletcted_website_app_url"
                  options={choices}
                  className="form-control"
                />
              </div>

            <div className="form-group col-md-4">
            <FormikController
                        control="input"
                        type="text"
                        label="Website/App url *"
                        name="website_app_url"
                        placeholder="Enter Website/App URL"
                        className="form-control"
                      />
            </div>

            <div class="form-group col-md-4">
            <FormikController
                  control="select"
                  label="Type Of Collection *"
                  name="type_of_collection"
                  options={choices}
                  className="form-control"
                />
              </div>
          </div>

          
          <div className="form-row">
          <div class="form-group col-md-4">
          <FormikController
                  control="select"
                  label="Collection Frequency *"
                  name="collection_frequency"
                  options={choices}
                  className="form-control"
                />
              </div>
            <div className="form-group col-md-4">
            <FormikController
                        control="input"
                        type="text"
                        label="Ticket size *"
                        name="ticket_size"
                        placeholder="Enter Ticket Size"
                        className="form-control"
                      />
            </div>
            <div className="form-group col-md-4">
            <FormikController
                        control="input"
                        type="text"
                        label="Expected Transactions *"
                        name="expexted_transaction"
                        placeholder="Enter Expected Transactions"
                        className="form-control"
                      />
            </div>
          </div>

          <div className="form-row">
            <div class="form-group col-md-4">
            <FormikController
                  control="select"
                  label="Do you need SabPaisa to built your form *"
                  name="build_your_form"
                  options={choices}
                  className="form-control"
                />
              </div>
            </div>

          <button type="submit" className="btn btn-primary">Save</button>

            </Form>
    )}

    
    
    </Formik>            
   
  </div>
  )
}

export default BusinessOverview