import React, { useState,useEffect} from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch,useSelector } from 'react-redux';
import FormikController from '../../../_components/formik/FormikController';
import classes from "./editkycDetails.module.css"
import { uploadDocument } from '../../../slices/editKycSlice';

import { toast } from "react-toastify";
import { GetKycTabsStatus,kycDocumentUploadList,documentsUpload} from '../../../slices/kycSlice';

const DocumentUploadNewEdtKyc = (props) => {
  const selectedId=props?.selectedId
  // Handler to add new input field
  const handleAddField = (values, setFieldValue) => {
    setFieldValue('inputs', [...values.inputs, { name: '', file: null }]);
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [docTypeList, setDocTypeList] = useState([]);
  const [typeId, setTypeId] = useState("")
  const { auth, kyc } = useSelector((state) => state);
  const dispatch=useDispatch()
  const { user } = auth;
  const { loginId } = user;
  
  const KycList = kyc?.kycUserList;
  const businessType = KycList?.businessType;


  // Handler to remove an input field
  const handleRemoveField = (index, values, setFieldValue) => {
    console.log("indexx", index)
    console.log("values", values)

    const newInputFields = [
      ...values.inputs.slice(0, index),
      ...values.inputs.slice(index + 1)
    ];
    setFieldValue('inputs', newInputFields);
  };

  const radioBtnOptions = [
    { value: 'A', key: 'Document List' },
    { value: 'B', key: 'Other' }
  ];

  const handleChange = function (e, id) {
    setSelectedFile(e.target.files[0]);
    readURL(e.target, id);
  };

  useEffect(() => {
    dispatch(documentsUpload({ businessType, is_udyam: KycList?.is_udyam }))
      .then((resp) => {
        // setIsRequiredData(resp?.payload)

       const data=resp?.payload
        setDocTypeList(data);
        
      })
      .catch((err) => {
        
      });
  }, []);
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

  

  const handleUpload = (index, setFieldValue) => {
    // Logic for uploading the file can go here
    console.log(`Uploading file at index: ${index}`);
    // Example: setFieldValue(`files[${index}]`, null); // To clear the file after upload
  };

  const handleDelete = (index, setFieldValue) => {
    setFieldValue(`files[${index}]`, null);
  };


  const onSubmit = (values, action) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", selectedFile);
    bodyFormData.append("login_id", selectedId);
    bodyFormData.append("modified_by", loginId);
    bodyFormData.append("type", typeId);

    // Dispatch the form data directly
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
      initialValues={{ option: 'A', dropdown: '', inputs: [{ name: '', file: null }] }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <div>
            <label>Choose</label>
            <div className="d-flex justify-content-between w-50 mt-3">
              {radioBtnOptions.map((option) => (
                <label key={option.value}>
                  <Field
                    type="radio"
                    name="option"
                    value={option.value}
                    checked={values.option === option.value}
                    onChange={() => setFieldValue('option', option.value)}
                  />
                  {option.key}
                </label>
              ))}
            </div>
          </div>
          {values.option === 'A' && (
            <div className="mt-4">
              {docTypeList.map((doc, index) => (
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
                    {/* {errors.files?.[index] && touched.files?.[index] && (
                    <div className="invalid-feedback">{errors.files[index]}</div>
                  )} */}
                  </div>
                  <div className="col-2">
                    <button
                      type="submit"
                      className="btn btn-sm cob-btn-primary  text-white ml-5"
                      onClick={() => setTypeId(doc?.id)}
                    >
                      Upload
                    </button>
                  </div>
                  <div className="col-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(index, setFieldValue)}
                      className={`${classes.btn_circle} btn btn-danger`}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>)}

          {values.option === 'B' && (
            <div className="mt-4">
              {values.inputs.map((inputField, index) => (
                <div key={index} className="row mt-3 mb-3">
                  <div className="col-md-4">
                    <Field
                      type="text"
                      name={`inputs[${index}].name`}
                      placeholder="Description"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="file"
                      name={`inputs[${index}].file`}
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue(`inputs[${index}].file`, file);
                      }}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-2">
                    <button
                      type="button"
                      // onClick={() => handleRemoveField(index, values, setFieldValue)}
                      className="btn btn-sm cob-btn-primary  text-white"
                    >
                      Upload Document
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index, values, setFieldValue)}
                      className="btn btn-danger btn-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="">
                <div className="">
                  <button
                    type="button"
                    onClick={() => handleAddField(values, setFieldValue)}
                    className="btn btn-sm cob-btn-primary  text-white mt-3"
                  >
                    Add More File
                  </button>
                </div>
              </div>
            </div>
          )}

        </Form>
      )}
    </Formik>
  );
};

export default DocumentUploadNewEdtKyc;
