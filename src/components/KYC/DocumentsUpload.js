import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
 import { Zoom } from "react-toastify";
import { useSelector } from 'react-redux';
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"
import API_URL from '../../config';


function DocumentsUpload() {

const [docTypeList, setDocTypeList] = useState([])
const [selectedFile, setSelectedFile] = useState();
const [fieldValue, setFieldValue] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode} = clientMerchantDetailsList[0];
  const { loginId} = user;
  // const url = API_URL


//  console.log(loginId,"my clientCode")

useEffect(() => {
  axios.get(API_URL.DocumentsUpload).then((resp)=>{
    const data = convertToFormikSelectJson('id','name', resp.data.results);
    console.log(resp,"my all dattaaa")
   
    setDocTypeList(data)
  }).catch(err=>console.log(err))
}, [])

const HandleChange = (event) => {
  setSelectedFile(event.target.files[0]);
  setIsFilePicked(true);
};

// const handleSubmission = () => {

//   const formData = new FormData();

// 		formData.append('file', selectedFile);
    
//     // fetch(
// 		// 	'http://13.126.165.212:8000/cob/upload-merchant-document/',
// 		// 	{
// 		// 		method: 'POST',
// 		// 		body: formData,
// 		// 	}
// 		// )
// 		// 	.then((response) => response.json())
// 		// 	.then((result) => 
//     //   { alert("File Upload success");
				
// 		// 	})
// 		// 	.catch((error) => {
//     //     alert("File Upload Error");
// 		// 	});
	


// };

// const choices = [
//   { key: "choice a", value: "choicea" },
//   { key: "choice b", value: "choiceb" },
// ]


const initialValues = {
  docType: "",
  docFile:""

}
const validationSchema = Yup.object({
  docFile: Yup.mixed()
  .test('fileType', 'Unsupported File Format', function (value) {
    const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
    return SUPPORTED_FORMATS.includes(value.type)
  })
  .test('fileSize', "File Size is too large", value => {
    const sizeInBytes = 500000;//0.5MB
    return value.size <= sizeInBytes;
  }),
  docType :  Yup.string().required("Required"),
     
})




const onSubmit = values => {
const bodyFormData = new FormData();
  bodyFormData.append('files',selectedFile);
  bodyFormData.append("client_code", [clientCode]);
  bodyFormData.append('login_id',loginId);
   bodyFormData.append('type',values.docType); 
 axios({
    method: "post",
     url: API_URL.Upload_Merchant_document,

    data:  bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      // alert("File Upload success");
        toast.success("File Upload Successfull",
        {
          position: "top-center",
          autoClose: 2000,
          transition: Zoom,
          limit: 2,
        })
      console.log(response);
    })
    .catch(function (error) {
      console.error("Error:", error);
      toast.error('File Upload Unsuccessfull',
      {
        position: "top-center",
        autoClose: 1000,
        transition: Zoom,
        limit: 2,
      })
     
     
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
                            {/* {(
   values,
   errors,
   touched
  
)} */}
                
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
                          onChange={HandleChange}
                          
                          // onChange={(event)=>{setFieldValue(event.target.files[0])}}
                      />
                     {/* {
  errors.docFile && touched.docFile
    ? <p className="errors">{errors.docFile}</p>
    : null
} */}

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