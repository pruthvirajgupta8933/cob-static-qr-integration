import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"

function DocumentsUpload() {

const [docTypeList, setDocTypeList] = useState([])
const [fieldValue, setFieldValue] = useState(null);
const [isFilePicked, setIsFilePicked] = useState(false);



useEffect(() => {
  axios.get("http://192.168.34.21:8000/cob/document-type/").then((resp)=>{
    const data = convertToFormikSelectJson('id','name', resp.data.results);
    setDocTypeList(data)
  }).catch(err=>console.log(err))
}, [])



const changeHandler = (event) => {
  console.log(event)
  // setSelectedFile(event.target.files[0]);
  // setIsFilePicked(true);
};

const choices = [
  { key: "choice a", value: "choicea" },
  { key: "choice b", value: "choiceb" },
]


const initialValues = {
  // docType: "",
  docFile:""

}
const validationSchema = Yup.object({
  // docType: Yup.string().required("Required"),
  docFile: Yup.mixed().required('File is required')
})




const onSubmit = values => {
  

  const bodyFormData = new FormData();
  bodyFormData.append('file',fieldValue);
  bodyFormData.append('type', 1); 
  bodyFormData.append('modifiedBy', 1); 
  bodyFormData.append('merchant', 53); 


  axios({
    method: "post",
    url: "http://192.168.34.21:8000/cob/upload-merchant-document/",
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
                      <FormikController
                          control="file"
                          type="file"                      
                          label="Select Document"
                          name="docFile"
                          className="form-control-file"
                          onChange={(event)=>{setFieldValue(event.target.files[0])}}
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