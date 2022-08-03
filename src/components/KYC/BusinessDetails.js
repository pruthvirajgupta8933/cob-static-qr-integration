import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import API_URL from '../../config';
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'



function BusinessDetails() {
  const [BusinessOverview,setBusinessOverview]=useState([])

  
  const choices = [
    { key: "Same As Registered Address", value: "choice" }
  ]

  const GSTIN =[
   
    { key: "Select Option", value: "Select Option" },
    { key: "yes", value: "We have a registered GSTIN"},
    { key: "No", value: "We don't have a GSTIN" },
  
  ] 

  const initialValues = {
   company_name:"",
   registerd_with_gst:"",
   gst_number:"",
   pan_card:"",
   signatory_pan:"",
   name_on_pancard:"",
   pin_code:"",
   city_id:"",
   state_id:"",
   registered_business_address:"",
   operational_address:"",
}
  const validationSchema = Yup.object({
    company_name: Yup.string().required("Required"),
    registerd_with_gst: Yup.string().required("Required"),
    gst_number: Yup.string().required("Required"),
    pan_card: Yup.string().required("Required"),
    signatory_pan: Yup.string().required("Required"),
    name_on_pancard:Yup.string().required("Required"),
    pin_code:Yup.string().required("Required"),
    city_id:Yup.string().required("Required"),
    state_id:Yup.string().required("Required"),
    registered_business_address:Yup.string().required("Required"),
    operational_address:Yup.string().required("Required"),


  })


  useEffect(() => {
    axios.get(API_URL.Business_overview_state).then((resp) => {
      const data = convertToFormikSelectJson('stateId', 'stateName',resp.data);
      //  console.log(resp, "my all dattaaa")


       console.log(data,"here is my get data")

      setBusinessOverview(data)

      
    }).catch(err => console.log(err))
  }, [])


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
                        name="company_name"
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

                    <div className="form-group col-md-4">
                      <FormikController
                          control="select"                          
                          label="GSTIN *"
                          name="gstin"
                          className="form-control"
                          options={GSTIN}
                        />
                    </div>
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Enter Gst No *"
                        name="gst_number"
                        placeholder="Enter Gst No"
                        className="form-control"
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
                        label=" PAN Owner's Name *"
                        name="business_pan"
                        placeholder="Pan owner's Name"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="number"
                        label=" Pin code *"
                        name="pin_code"
                        placeholder="Pin code"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="City *"
                        name="city_id"
                        placeholder="Enter City"
                        className="form-control"
                      />
                    </div>
                    <div className="form-group col-md-4">
                    <FormikController
                  control="select"
                  label="State *"
                  name="state_id"
                  options={BusinessOverview}
                  className="form-control"
                />
                    </div>

                  
                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="Authorised Signatory PAN *"
                          name="signatory_pan"
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

                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="Registered Address *"
                          name="registered_business_address"
                          placeholder="Enter Your Address here"
                          className="form-control"
                        />
                    </div>

                  </div>


                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="input"
                        type="text"
                        label="Pin Code *"
                        name="pin_code"
                        placeholder="Enter Pin Code"
                        className="form-control"
                      />
                    </div>

                  
                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="City *"
                          name="city"
                          placeholder="Enter City Name"
                          className="form-control"
                        />
                    </div>

                    <div className="form-group col-md-4">
                      <FormikController
                          control="input"
                          type="text"
                          label="State*"
                          name="state"
                          placeholder="Enter State"
                          className="form-control"
                        />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <FormikController
                        control="textArea"
                        type="textArea"
                        label="Registered Address *"
                        name="registered_address"
                        placeholder="Enter Registered Address"
                        className="form-control"
                      />
                    </div>

                  
                    <div className="form-group col-md-4 d-flex">
                      {/* <FormikController
                        control="checkbox"
                        name="checkBoxChoice"
                        options={choices}
                        /> */}

                      <FormikController
                          control="textArea"
                          type="textArea"
                          label="Operational Address"
                          name="operational_address"
                          placeholder="Enter Operational Address"
                          className="form-control"
                        />
                    </div>

                    {/* <div className="form-group col-md-4">
                      <FormikController
                          control="textArea"
                          type="textArea"
                          label="Operational Address"
                          name="operational_address"
                          placeholder="Enter Operational Address"
                          className="form-control"
                        />
                    </div> */}
                  </div>
                  <button className="btn btn-primary" type="submit">Submit</button>
                    
            </Form>
          )}

    </Formik>
   
  </div>
  )
}

export default BusinessDetails