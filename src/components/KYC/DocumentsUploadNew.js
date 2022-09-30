import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"
import API_URL from '../../config';
import { documentsUpload, merchantInfo } from "../../slices/kycSlice"
import plus from "../../assets/images/plus.png"
import { set } from 'lodash';
// import { readURL, removeUpload } from '../../assets/js/ImageUpload';
// import UploadDocTest from './UploadDocTest';

import  "../../assets/css/kyc-document.css"

import $ from 'jquery';

// import $ from "jquery"

function DocumentsUpload() {

  function readURL(input,id) {  
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $('.imagepre_sub_'+id).attr('src', e.target.result);
          $('.imagepre_'+id).show();
        };
    
        reader.readAsDataURL(input.files[0]);
    
      } 
    }

  const [docTypeList, setDocTypeList] = useState([])
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  // const [fieldValue, setFieldValue] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileAadhaar, setSelectedFileAadhaar] = useState(null);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  
  const dispatch = useDispatch();

  const initialValues = {
    docType: "",
    aadhaar_front: "",
    aadhaar_back: "",
    pan_card: ""
  }

  const validationSchema = Yup.object({
    docType: Yup.string().required("Required").nullable(),
    aadhaar_front: Yup.mixed().nullable(),
    aadhaar_back: Yup.mixed().nullable(),
    pan_card: Yup.mixed().nullable(),
  })

  useEffect(() => {
    dispatch(documentsUpload()).then((resp) => {
      const data = convertToFormikSelectJson('id', 'name', resp.payload.results);
      setDocTypeList(data)
    }).catch(err => console.log(err))


  }, [])
 

  const handleChange = function (e,id) {
    if(id===2){
      setSelectedFileAadhaar(e.target.files[0])
    }else{
      setSelectedFile(e.target.files[0])
    }
    readURL(e.target,id)
  }


  const onSubmit = (values, action) => {
  
    const bodyFormData = new FormData();
    let docType = values.docType;
    if(docType==='1'){
      console.log(3333)
      bodyFormData.append('aadhar_front', selectedFile);
      bodyFormData.append('aadhar_back', selectedFileAadhaar);
    }else{
      console.log(5555)
      bodyFormData.append('files', selectedFile);
    }

    bodyFormData.append('login_id', loginId);
    bodyFormData.append('modified_by', 270);
    bodyFormData.append('type', values.docType);
    
   

    // for (var pair of bodyFormData.entries()) {
    //   console.log(pair[0] + ", " + pair[1]);
    // }

    // console.log("call submit")
    
    const kycData = {bodyFormData,docType}
    dispatch(merchantInfo(kycData))
      .then(function (response) {
        toast.success("Merchant document saved successfully")
        console.log(response);
      })
      .catch(function (error) {
        console.error("Error:", error);
        toast.error('Something went wrong while saving the document')
      });
  }
  let submitAction = undefined;

  return (
    <>
      {/* <UploadDocTest /> */}
      <div className="col-md-12">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            // console.log("trigger")
            onSubmit(values, submitAction);
          }}
          enableReinitialize={true}
        >
          {(formik) => (

            <Form>
              {/* {console.log(formik)} */}
              <div className="form-row">
                <div className="col-lg-7">
                  <div style={{width:"310px"}}>
                  <FormikController
                    control="select"
                    label="Document Type"
                    name="docType"
                    className="form-control"
                    options={docTypeList}
                  />
                  {formik.handleChange("docType", setDocTypeIdDropdown(formik.values.docType))}
                  </div>
                </div>
             
                {docTypeIdDropdown === "1" ?
                  <div class="row">
                    <div class="col-lg-6 width">
                      <div className="file-upload border-dotted">
                        <div className="image-upload-wrap ">
                        <FormikController
                            control="file"
                            type="file"
                            name="aadhaar_front"
                            className="file-upload-input"
                            id="1"
                            onChange={(e)=>handleChange(e,1)}
                            // disabled={VerifyKycStatus === "Verified" ? true : false}
                            // readOnly={readOnly}
                          />

                          <div className="drag-text">
                            <h3 class="p-2 font-16">Add Front Aadhaar Card</h3>
                            <img alt="Doc" src={plus} style={{ width: 30 }} className="mb-4" />
                            <p class="card-text">Upto 2 MB file size</p>
                          </div>
                        </div>
                      </div>
                      {/* uploaded document preview */}
                      <div className="file-upload-content imagepre_1">
                        <img className="file-upload-image imagepre_sub_1" src="#" alt="Document" />
                      </div>
                    </div>
                    <div class="col-lg-6 width">
                      <div className="file-upload  border-dotted">
                        <div className="image-upload-wrap ">
                        <FormikController
                            control="file"
                            type="file"
                            name="aadhaar_back"
                            className="file-upload-input"
                            id="2"
                            onChange={(e)=>handleChange(e,2)}
                            // disabled={VerifyKycStatus === "Verified" ? true : false}
                            // readOnly={readOnly}
                          />
                          <div className="drag-text">
                            <h3 class="p-2 font-16">Add Back Aadhaar Card</h3>
                            <img alt="Doc" src={plus} style={{ width: 30 }} className="mb-4" />
                            <p class="card-text">Upto 2 MB file size</p>
                          </div>
                        </div>
                      </div>

                      {/* uploaded document preview */}
                      <div className="file-upload-content imagepre_2">
                        <img className="file-upload-image imagepre_sub_2" src="#" alt="Document" />
                      </div>
                    </div>
                  </div>
                  : docTypeIdDropdown === "2" ?
                    <>
                      <div class="col-lg-6 ">
                        <div className="file-upload  border-dotted">
                          <div className="image-upload-wrap ">
                          <FormikController
                            control="file"
                            type="file"
                            name="pan_card"
                            className="file-upload-input"
                            id="3"
                            onChange={(e)=>handleChange(e,3)}
                            // disabled={VerifyKycStatus === "Verified" ? true : false}
                            // readOnly={readOnly}
                          />
                            <div className="drag-text">
                              <h3 class="p-2 font-16">Add PAN Card</h3>
                              <img alt="Doc" src={plus} style={{ width: 30 }} className="mb-4"  />
                              <p class="card-text">Upto 2 MB file size</p>
                            </div>
                          </div>
                        </div>
                        {/* uploaded document preview */}
                        <div className="file-upload-content imagepre_3">
                          <img className="file-upload-image imagepre_sub_3" src="#" alt="Document" />
                        </div>
                      </div>
                    </>
                    : <></>
                }
             
              <hr
                style={{
                  borderColor: "#D9D9D9",
                  textShadow: "2px 2px 5px grey",
                  width: "100%",
                  padding:"4px",
                  marginTop:"102px"
                  
                }}
              />
            

                   
                  <div class="col-12">
                    <button
                      className="btn float-lg-right"
                      style={{ backgroundColor: "#0156B3" }}
                      type="button"
                       onClick={() => {
                      formik.handleSubmit();
                    }}
                    >
                      <h4 className="text-white"> &nbsp; &nbsp; Save & Next &nbsp; &nbsp;</h4>
                    </button>
                  </div>
                </div>
            
            </Form>
          )}
        </Formik>
      </div>
    </>

  )
}

export default DocumentsUpload