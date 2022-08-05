import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import FormikController from '../../_components/formik/FormikController'
import API_URL from '../../config';
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'



function BusinessDetails() {
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const [BusinessOverview, setBusinessOverview] = useState([])
  const [gstin, setGstin] = useState("");
  const [fieldValue, setFieldValue] = useState(null);
  const [checked, setChecked] =useState(false);
  const [operationvalue,setOperationvalue]=useState();



  const choicesCheckBox = [
    { key: "Same As Registered Address", value: "yes" }
  ]

  const GSTIN = [

    { key: "Select Option", value: "Select Option" },
    { key:"True", value: "We have a registered GSTIN" },
    { key: "False", value: "We don't have a GSTIN" },

  ]
  const handleChange = (event) => {
    setChecked(event.value);
  };
  const handleShowHide = (event) => {
    const getuser = event.target.value;
    setGstin(getuser);

    // console.log(getuser, "222222222222222");
  };

  const test=(e, val)=>{
   
    if(e.length>0 && e[0] === "yes"){
      setChecked(true)
      setOperationvalue(val)
      // fn("operational_address",val)
    } else{
      setChecked(false)
      setOperationvalue(null)
    }
    
  }
  const initialValues = {
    company_name: "",
    company_logo: "",
    registerd_with_gst: "",
    gst_number: "",
    pan_card: "",
    signatory_pan: "",
    name_on_pancard: "",
    pin_code: "",
    city_id: "",
    state_id: "",
    registered_business_address: "",
    operational_address: "",
    checkBoxChoice:""
  }
  const validationSchema = Yup.object({
    company_logo: Yup.mixed()
      .nullable()
      .required('Required file format PNG/JPEG/JPG'),
    company_name: Yup.string().required("Required"),
    registerd_with_gst: Yup.string().required("Required"),
    gst_number: Yup.string().required("Required"),
    pan_card: Yup.string().required("Required"),
    signatory_pan: Yup.string().required("Required"),
    name_on_pancard: Yup.string().required("Required"),
    pin_code: Yup.string().required("Required"),
    city_id: Yup.string().required("Required"),
    state_id: Yup.string().required("Required"),
    registered_business_address: Yup.string().required("Required"),
    operational_address: Yup.string().when("checkBoxChoice",{
      is:"yes",
      then:Yup.string().required("Required")
    }),
    checkBoxChoice:Yup.array(),


  })


  useEffect(() => {
    axios.get(API_URL.Business_overview_state).then((resp) => {
      const data = convertToFormikSelectJson('stateId', 'stateName', resp.data);
      //  console.log(resp, "my all dattaaa")
      setBusinessOverview(data)
    }).catch(err => console.log(err))
  }, [])




  const onSubmit = values => {
    console.log(API_URL.SAVE_MERCHANT_INFO, "appurlll")
    const bodyFormData = new FormData();
    bodyFormData.append('company_name', values.company_name);
    bodyFormData.append('registerd_with_gst', values.registerd_with_gst)
    bodyFormData.append('gst_number', values.gst_number)
    bodyFormData.append('pan_card', values.pan_card)
    bodyFormData.append('signatory_pan', values.signatory_pan)
    bodyFormData.append('name_on_pancard', values.name_on_pancard)
    bodyFormData.append('pin_code', values.pin_code)
    bodyFormData.append('city_id', values.city_id)
    bodyFormData.append('state_id', values.state_id)
    if(checked===true){
      bodyFormData.append('operational_address', values.registered_business_address)
    }else{
      bodyFormData.append('operational_address', values.operational_address)
    }
    bodyFormData.append('registered_business_address', values.registered_business_address)
    bodyFormData.append('files', fieldValue);
    bodyFormData.append('modified_by', loginId);
    // bodyFormData.append("client_code", [clientCode]);
    bodyFormData.append('login_id', loginId);


    axios({
      method: "put",
      url: API_URL.SAVE_MERCHANT_INFO,

      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        toast.success("File Upload Successfull")
        console.log(response);
      })
      .catch(function (error) {
        console.error("Error:", error);
        toast.error('File Upload Unsuccessfull')
      });
  }


  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(onSubmit)}
      >
        {formik => (

          <Form>
            {console.log(formik)}
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
                  control="file"
                  type="file"
                  label="Company Logo *"
                  name="company_logo"
                  className="form-control"
                  onChange={(event) => {
                    setFieldValue(event.target.files[0])
                    formik.setFieldValue("company_logo", event.target.files[0].name)
                  }}
                  accept="image/jpeg,image/jpg,image/png "
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="select"
                  label="GSTIN *"
                  name="registerd_with_gst"
                  onChange={(e) => {
                    handleShowHide(e);
                    formik.setFieldValue("registerd_with_gst", e.target.value)
                  }

                  }
                  className="form-control"
                  options={GSTIN}
                />
              </div>
              {formik.values?.registerd_with_gst === "True" && (
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
              )}



            </div>

            <div className="form-row">
              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label="Business Pan *"
                  name="signatory_pan"
                  placeholder="Enter Business PAN"
                  className="form-control"
                />
              </div>


              <div className="form-group col-md-4">
                <FormikController
                  control="input"
                  type="text"
                  label=" PAN Owner's Name *"
                  name="name_on_pancard"
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
                  name="pan_card"
                  placeholder="Enter Authorised Signatory PAN"
                  className="form-control"
                />
              </div>

              <div className="form-group col-md-4">
                <FormikController
                  control="textArea"
                  type="textArea"
                  label="Registered Address *"
                  name="registered_business_address"
                  placeholder="Enter Registered Address"
                  className="form-control"
                />

              </div>
              <div className="form-group col-md-4 d-flex">
               
              <FormikController
                control="checkbox"
                name="checkBoxChoice"
                options={choicesCheckBox}
              />
             {formik.handleChange("checkBoxChoice",test(formik.values.checkBoxChoice, formik.values.registered_business_address))}

               <FormikController
                  control="textArea"
                  type="textArea"
                  disabled={checked}
                  label="Operational Address"
                  name="operational_address"
                  placeholder="Enter Operational Address"
                  className="form-control"
                  value={operationvalue}
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