import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classes from "./editkycDetails.module.css"

import { uploadDocument } from '../../../slices/editKycSlice';

import { toast } from "react-toastify";
import { GetKycTabsStatus, kycDocumentUploadList, documentsUpload, removeDocument } from '../../../slices/kycSlice';

const DocumentUploadNewEdtKyc = (props) => {
  const selectedId = props?.selectedId
  // Handler to add new input field
  const handleAddField = (values, setFieldValue) => {
    setFieldValue('inputs', [...values.inputs, { name: '', file: null }]);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [docTypeList, setDocTypeList] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [otherDocTypeId, setOtherDocTypeId] = useState(null);
  const [disable, setIsDisable] = useState(false)
  const [typeId, setTypeId] = useState("")
  const { auth, kyc } = useSelector((state) => state);
  const dispatch = useDispatch()
  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;

  const KycList = kyc?.kycUserList;
  const businessType = KycList?.businessType;



  // Handler to remove an input field
  const handleRemoveField = (index, values, setFieldValue) => {


    const newInputFields = [
      ...values.inputs.slice(0, index),
      ...values.inputs.slice(index + 1)
    ];
    setFieldValue('inputs', newInputFields);
  };

  const radioBtnOptions = [
    { value: 'A', key: 'Document List' },
    { value: 'B', key: 'Other Document', disabled: true }
  ];

  const handleChange = function (e, id) {
    setSelectedFile(e.target.files[0]);
    readURL(e.target, id);
  };

  useEffect(() => {
    dispatch(documentsUpload({ businessType, is_udyam: KycList?.is_udyam }))
      .then((resp) => {
        // setIsRequiredData(resp?.payload)

        const data = resp?.payload
        setDocTypeList(data);

      })
      .catch((err) => {

      });
  }, []);

  useEffect(() => {
    // console.log('KycDocUpload', KycDocUpload)
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);
  const getKycDocList = () => {
    if (selectedId != undefined && selectedId !== "") {
      const postData = {
        login_id: selectedId,
      }

      dispatch(
        kycDocumentUploadList(postData)
      );
    }
  };

  function readURL(input, id) {
    if (input?.files && input?.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        // setImgAttr(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }






  const onSubmit = (values, action) => {
    // Check if the file is selected
    if (!selectedFile) {
      alert("Please choose the relevant file to upload");
      return; // Prevent further execution
    }

    const bodyFormData = new FormData();
    bodyFormData.append("files", selectedFile);
    bodyFormData.append("login_id", selectedId);
    bodyFormData.append("modified_by", loginId);

    if (values.option === "A") {
      bodyFormData.append("type", typeId);
    } else {
      bodyFormData.append("type", otherDocTypeId);

      const latestDescription = values.inputs[values.inputs.length - 1]?.description;
      if (latestDescription) {
        bodyFormData.append("description", latestDescription);
      }
    }

    // Dispatch the form data
    dispatch(uploadDocument(bodyFormData))
      .then(function (response) {
        if (response?.payload?.status) {
          dispatch(GetKycTabsStatus({ login_id: selectedId }));
          toast.success(response?.payload?.message);
          setSelectedFile(null);

          // Update the document list after the upload
          setTimeout(() => {
            getKycDocList();
          }, 2000);
        } else {
          const message = response?.payload?.message || response?.payload?.message?.toString();
          toast.error(message);
        }
      })
      .catch(function (error) {
        toast.error("Something went wrong while saving the document");
      });
  };



  return (
    <Formik
      initialValues={{ option: 'A', dropdown: '', inputs: [{ description: '', file: null }] }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <div>
            {/* <label>Choose</label> */}
            <div className="d-flex justify-content-between w-50 mt-3">
              {radioBtnOptions?.map((option) => (
                <label key={option.value}>
                  <Field
                    type="radio"
                    name="option"
                    value={option.value}
                    checked={values.option === option.value}
                    onChange={() => setFieldValue('option', option.value)}
                    disabled={option.disabled}
                  />
                  <span className='ml-1'>{option.key}</span>
                </label>
              ))}
            </div>
          </div>
          {values.option === 'A' && (
            <div className="mt-4">
              <div className="overflow-auto" style={{ maxHeight: '300px' }}>

                {docTypeList?.map((doc, index) => (


                  doc?.name?.toLowerCase().split(" ").includes("others") ?
                    <div className="row mb-3 align-items-center font-weight-bold" key={index}>
                      <div onClick={() => {
                        setFieldValue('option', "B")
                        setOtherDocTypeId(doc.id)
                      }}> <label className='text-primary btn cob-btn-primary'>Click here to upload other documents</label> </div>
                    </div> :



                    <div className="row mb-3 align-items-center font-weight-bold" key={index}>
                      <div className="col-4">
                        <label>{doc?.name}</label>
                      </div>
                      <div className="col-3">
                        <Field
                          name={`files[${index}]`}
                          render={({ field }) => (
                            <input
                              type="file"
                              className={`form-control ${errors.files?.[index] && touched.files?.[index] ? 'is-invalid' : ''}`}
                              id="3"
                              onChange={(e) => handleChange(e, 3)}
                            />
                          )}
                        />
                      </div>
                      <div className="col-3">
                        <button
                          type="submit"
                          className="btn btn-sm cob-btn-primary text-white ml-5"
                          onClick={() => setTypeId(doc?.id)}
                        >
                          Upload
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          )}


          {values.option === 'B' && (
           <div className="mt-4">
           {values?.inputs?.map((inputField, index) => (
             <div key={index} className="row mt-3 mb-3 align-items-center">
               <div className="col-md-3">
                 <Field
                   type="text"
                   name={`inputs[${index}].description`}
                   placeholder="Description"
                   className="form-control"
                 />
               </div>
               <div className="col-md-3">
                 <input
                   type="file"
                   name={`inputs[${index}].files`}
                   onChange={(e) => handleChange(e, 3)}
                   className="form-control"
                 />
               </div>
               <div className="col-md-2">
                 <button
                   type="submit"
                   // onClick={() => handleUpload(index, values)}
                   className="btn btn-sm cob-btn-primary text-white"
                 >
                   Upload
                 </button>
               </div>
               <div className="col-md-2">
                 <span onClick={() => handleRemoveField(index, values, setFieldValue)} className="cursor-pointer">
                   <i className={`${classes.icon_large} fa fa-trash`}></i>
                 </span>
               </div>
             </div>
           ))}
         
           <button
             type="button"
             onClick={() => handleAddField(values, setFieldValue)}
             className="btn btn-sm cob-btn-primary text-white d-flex align-items-center mt-3"
           >
             <i className="fa fa-plus text-white me-2"></i> 
             Add More File
           </button>
         </div>
         

          )}

        </Form>
      )}
    </Formik>
  );
};

export default DocumentUploadNewEdtKyc;
