import React from 'react'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'


function BankDetails() {

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
   
    <div className="form-row ">
        <p>We will deposit a small amount of money in your account to verify the account.</p>
    </div>
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
                        label="Account Name *"
                        name="account_name"
                        placeholder="Account Holder Name"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                    <FormikController
                        control="input"
                        type="text"
                        label="Account Type *"
                        name="account_type"
                        placeholder="Account Type"
                        className="form-control"
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <FormikController
                          control="select"                          
                          label="Bank Name*"
                          name="bank_name"
                          className="form-control"
                          placeholder="Enter Bank Name"
                          options={choices}
                        />
                    </div>
                  </div>


                  <div className="form-row">
                    <div className="form-group col-md-3">
                      <FormikController
                        control="input"
                        type="text"
                        label="Branch *"
                        name="branch"
                        placeholder="Enter Branch Name"
                        className="form-control"
                      />
                    </div>

                  
                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Branch IFSC Code *"
                          name="ifsc_code"
                          placeholder="IFSC Code"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Account Number *"
                          name="account_number"
                          placeholder="Account Number"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-3">
                      <FormikController
                          control="input"
                          type="text"
                          label="Re-Enter Account Number  *"
                          name="confirm_account_number"
                          placeholder="Re-Enter Account Number"
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

export default BankDetails