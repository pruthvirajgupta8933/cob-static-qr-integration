import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"
import API_URL from '../../config';

function DocumentsUpload() {
 const [docTypeList, setDocTypeList] = useState([])
  const [fieldValue, setFieldValue] = useState(null);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const initialValues = {
    docType: "",
    docFile: ""

  }
  const validationSchema = Yup.object({
    docType: Yup.string().required("Required"),
    docFile: Yup.mixed()
      .nullable()
      .required('Required file format PNG/JPEG/JPG/PDF')
  })

  useEffect(() => {
    axios.get(API_URL.DocumentsUpload).then((resp) => {
      const data = convertToFormikSelectJson('id', 'name', resp.data.results);
      console.log(resp, "my all dattaaa")

      setDocTypeList(data)
    }).catch(err => console.log(err))
  }, [])
  const onSubmit = values => {
    const bodyFormData = new FormData();
    bodyFormData.append('files', fieldValue);
    // bodyFormData.append("client_code", [clientCode]);
    bodyFormData.append('login_id', loginId);
    bodyFormData.append('modified_by', 270);           
    bodyFormData.append('type', values.docType);
    axios({
      method: "post",
      url: API_URL.Upload_Merchant_document,

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
                    onChange={(event) => {
                      setFieldValue(event.target.files[0])
                      formik.setFieldValue("docFile", event.target.files[0].name)
 }}

                    accept="image/jpeg,image/jpg,image/png,application/pdf"

                  // onChange={(event)=>{setFieldValue(event.target.files[0])}}
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