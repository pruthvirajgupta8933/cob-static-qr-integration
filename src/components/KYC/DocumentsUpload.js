import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"
import { useSelector } from 'react-redux'

function DocumentsUpload() {

const [docTypeList, setDocTypeList] = useState([])
const [fieldValue, setFieldValue] = useState(null);

const { user } = useSelector((state) => state.auth);
console.log(user)
const client_code = user?.clientMerchantDetailsList && user.clientMerchantDetailsList[0]?.clientCode
const {loginId} = user


useEffect(() => {
  axios.get("http://13.126.165.212:8000/cob/document-type/").then((resp)=>{
    const data = convertToFormikSelectJson('id','name', resp.data.results);
    setDocTypeList(data)
  }).catch(err=>console.log(err))
}, [])





const initialValues = {
  docType: "",
  docFile:""

}


const validationSchema = Yup.object({
  docType: Yup.string().required("Required"),
  docFile: Yup.mixed()
  .nullable()
  .required('Required file format PNG/JPEG/JPG/PDF')
})




const onSubmit = values => {
  

  const bodyFormData = new FormData();
  bodyFormData.append('files',fieldValue);
  bodyFormData.append('type', values.docType); 
  bodyFormData.append('login_id', loginId); 
  bodyFormData.append('client_code', client_code); 


  axios({
    method: "post",
    url: "http://13.126.165.212:8000/cob/upload-merchant-document/",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
}




  return (
    <div className="col-md-12 col-md-offset-4">
        <div className="">
            <p> Note : Please complete Business Overview Section to view the list of applicable documents!</p>
        </div>
<Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
{formik => (
            <Form>
            <ul className="list-inline  align-items-center ">
            <li className="list-inline-item align-middle  w-25" >
                <div className="form-group col-md-12">
                      <FormikController
                          control="select"  
                          label="Document Type"
                          name="docType"
                          className="form-control"
                          options={docTypeList}
                      />
                </div>
            </li>
            <li className="list-inline-item align-middle   w-25" > 
             <div className="form-group col-md-12">
             {console.log(formik)}
                      <FormikController
                          control="file"
                          type="file"                      
                          label="Select Document"
                          name="docFile"
                          className="form-control-file"
                          onChange={(event)=>{
                            setFieldValue(event.target.files[0])
                            formik.setFieldValue("docFile",event.target.files[0].name)
                            
                          }}

                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                      />
                </div>
              </li>
            <li className="list-inline-item align-middle w-25" >
            <button className="btn btn-primary mb-0" type="submit">upload</button>
            </li>
            {/* <li className="list-inline-item align-middle   w-25" > Download</li> */}
          </ul>
            </Form>
          )}
          </Formik>

    </div>
  )
}

export default DocumentsUpload