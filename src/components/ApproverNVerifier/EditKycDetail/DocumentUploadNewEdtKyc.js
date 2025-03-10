import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import classes from "./editkycDetails.module.css";
import { uploadDocument } from '../../../slices/editKycSlice';
import { toast } from "react-toastify";
import { GetKycTabsStatus, kycDocumentUploadList, documentsUpload } from '../../../slices/kycSlice';

const DocumentUploadNewEdtKyc = (props) => {
  const selectedId = props?.selectedId;
  const [selectedFile, setSelectedFile] = useState(null);
  const [docTypeList, setDocTypeList] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [otherDocTypeId, setOtherDocTypeId] = useState(null);
  const [typeId, setTypeId] = useState("");
  const { auth, kyc } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;
  const KycList = kyc?.kycUserList;
  const businessType = KycList?.businessType;

  const handleAddField = (values, setFieldValue) => {
    setFieldValue('inputs', [...values.inputs, { description: '', file: null }]);
  };

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

  const handleChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      const allowedFormats = ["pdf", "jpg", "jpeg", "png"];
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      if (file.size > maxSize) {
        toast.error("File size exceeds maximum limit of 5MB");
        e.target.value = ''; // Clear the file input
        setSelectedFile(null);
      } else if (!allowedFormats.includes(ext)) {
        toast.error("Invalid file type. Please upload a PDF, JPG, JPEG, or PNG file.");
        e.target.value = ''; // Clear the file input
        setSelectedFile(null);
      } else {
        setSelectedFile(file);
        readURL(e.target, id);
      }
    }
  };




  useEffect(() => {
    dispatch(documentsUpload({ businessType, is_udyam: KycList?.is_udyam }))
      .then((resp) => {
        setDocTypeList(resp?.payload);
      })
      .catch((err) => { });
  }, [dispatch, businessType, KycList?.is_udyam]);

  useEffect(() => {
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);

  const getKycDocList = () => {
    if (selectedId != undefined && selectedId !== "") {
      dispatch(kycDocumentUploadList({ login_id: selectedId }));
    }
  };

  const readURL = (input, id) => {
    if (input?.files && input?.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) { };
      reader.readAsDataURL(input.files[0]);
    }
  };

  const onSubmit = (values, action) => {
    if (!selectedFile) {
      alert("Please choose the relevant file to upload");
      return;
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

    dispatch(uploadDocument(bodyFormData))
      .then((response) => {

        if (response?.payload?.status) {
          dispatch(GetKycTabsStatus({ login_id: selectedId }));
          toast.success(response?.payload?.message);
          setSelectedFile(null);
          setTimeout(() => {
            getKycDocList();
          }, 2000);
        } else {
          console.log("res.payload", response.payload)
          const message = response?.payload?.message || response?.payload;
          toast.error(message);
        }
      })
      .catch((error) => {
        toast.error("Something went wrong while saving the document");
      });
  };

  return (
    <Formik
      initialValues={{ option: 'A', dropdown: '', inputs: [{ description: '', file: null }] }}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, }) => (
        <Form>
          <div>
            <div className="d-flex justify-content-between w-50 mt-3">
              {radioBtnOptions.map((option) => (
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
              <div className="overflow-auto" style={{ maxHeight: '250px' }}>
                {docTypeList.map((doc, index) => (
                  <div className="row mb-3 align-items-center font-weight-bold" key={index}>
                    <div className="col-4">
                      <label>{doc?.name}</label>
                    </div>
                    <div className="col-3">
                      <Field name={`files[${index}]`}>
                        {({ meta }) => (
                          <input
                            type="file"
                            className={`form-control ${meta.error && meta.touched ? 'is-invalid' : ''}`}
                            id="3"
                            onChange={(e) => handleChange(e, 3)}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="col-3">
                      <button
                        type="submit"
                        className={` ${classes.custom_button} btn btn-outline-primary text-white ml-5`}
                        onClick={() => setTypeId(doc?.id)}
                      >
                        <i

                          className={`${classes.upload_icon} fa fa-cloud-upload`}

                          aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {docTypeList.some(doc => doc?.name?.toLowerCase().split(" ").includes("others")) && (
                <div className="row mb-3 align-items-center font-weight-bold mt-3">
                  <div onClick={() => {
                    setFieldValue('option', "B");
                    const otherDoc = docTypeList.find(doc => doc?.name?.toLowerCase().split(" ").includes("others"));
                    setOtherDocTypeId(otherDoc?.id);
                  }}>
                    <label className='text-primary btn cob-btn-primary'>
                      Click here to upload other documents
                      <i className="fa fa-arrow-right ml-2"></i>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {values.option === 'B' && (
            <div className="mt-4">
              {values.inputs.map((inputField, index) => (
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
                      name={`inputs[${index}].file`}
                      onChange={(e) => handleChange(e, 3)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="submit"
                      className={` ${classes.custom_button} btn btn-outline-primary text-white ml-5`}
                    >
                      <i

                        className={`${classes.upload_icon} fa fa-cloud-upload`}

                        aria-hidden="true"></i>
                    </button>
                  </div>


                  <div className="col-md-2">

                    <button
                      type="button"
                      className={` ${classes.custom_button} btn btn-outline-primary text-white ml-5`}
                      onClick={() => handleRemoveField(index, values, setFieldValue)}
                    >

                      <i className={`${classes.icon_large} fa fa-trash`}></i>

                    </button>
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
