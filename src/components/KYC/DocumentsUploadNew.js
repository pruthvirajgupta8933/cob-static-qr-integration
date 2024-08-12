/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
// import * as Yup from "yup";

import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import "../KYC/kyc-style.css";
import {
  documentsUpload,
  GetKycTabsStatus,
  kycDocumentUploadList,
  merchantInfo,
  removeDocument,
  saveDropDownAndFinalArray
} from "../../slices/kycSlice";
import plusIcon from "../../assets/images/plus.png";
import "../../assets/css/kyc-document.css";
import { isNull, isUndefined } from "lodash";
import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED, } from "../../utilities/enums";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../_components/formik/Yup";
import { KYC_STATUS_REJECTED } from "../../utilities/enums";

function DocumentsUpload(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const merchantloginMasterId = props.merchantloginMasterId;

  // const { role } = props;

  const dispatch = useDispatch();
  const { auth, kyc } = useSelector((state) => state);


  const [docTypeList, setDocTypeList] = useState([]);
  const [isRequiredData, setIsRequiredData] = useState([])
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [imgAttr, setImgAttr] = useState("#");
  const [isRequiredDocUpload, setIsRequiredDocUpload] = useState(true)
  const [disable, setDisable] = useState(false);


  const filteredRequirList = isRequiredData?.filter((r) => r?.is_required === true); // required list
  const filteredRequirListId = filteredRequirList?.map((r) => r?.id?.toString());  /// dropdown array
  const uploadedReqDocList = Object.values(savedData)?.map((r) => r?.type)


  const { allTabsValidate, KycTabStatusStore } = kyc;
  const BusinessOverviewStatus = allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  const KycList = kyc?.kycUserList;
  const businessType = KycList?.businessType;
  const documentStatus = KycTabStatusStore?.document_status;
  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;
  const documentListData = savedData?.filter((data) => (String((data?.status)).toLowerCase()) !== "rejected")?.map((data) => data?.type);
  const dropdownListData = docTypeList?.map((data) => data?.key);
  const alreadyUploadedData = dropdownListData?.filter((elem) => documentListData?.includes(elem?.toString()));

  let submitAction;

  // formik 
  const initialValues = {
    docType: savedData?.[0]?.type ? savedData?.[0]?.type : "",
    document_img: "",
  };

  const validationSchema = Yup.object({
    docType: Yup.string().required("Document Required").nullable(),
    document_img: Yup.mixed().nullable(),
  });


  const newDocumentedOption = docTypeList?.map((obj, key) => {
    if (alreadyUploadedData.includes(obj.key)) {
      return { ...obj, disabled: true };
    }
    return obj;
  });


  function readURL(input, id) {
    if (input?.files && input?.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImgAttr(e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  useEffect(() => {
    // console.log('KycDocUpload', KycDocUpload)
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);



  useEffect(() => {
    dispatch(documentsUpload({ businessType, is_udyam: KycList?.is_udyam }))
      .then((resp) => {
        setIsRequiredData(resp?.payload)

        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        setDocTypeList(data);
        setImgAttr("#");
      })
      .catch((err) => {
        setImgAttr("#");
      });
  }, []);

  const required = [];
  docTypeList?.filter((a) => {
    if (a.optional1) {
      let val = a.key;
      required.push(val);
    }
  });



  const isrequired = savedData?.map((r) => r.type);

  const handleChange = function (e, id) {
    setSelectedFile(e.target.files[0]);
    readURL(e.target, id);
  };


  const onSubmit = (values, action) => {
    setDisable(true);
    if (!isNull(selectedFile) && !isUndefined(selectedFile) && selectedFile !== null) {
      const bodyFormData = new FormData();
      let docType = values?.docType;
      bodyFormData.append("files", selectedFile);
      bodyFormData.append("login_id", merchantloginMasterId);
      bodyFormData.append("modified_by", loginId);
      bodyFormData.append("type", values?.docType);

      const kycData = { bodyFormData, docType };

      dispatch(merchantInfo(kycData))
        .then(function (response) {
          // dispatch(saveDropDownAndFinalArray(isRequiredDocUpload));

          if (response?.payload?.status) {
            setTitle("SUBMIT KYC");
            dispatch(GetKycTabsStatus({ login_id: merchantloginMasterId }));
            toast.success(response?.payload?.message);
            setImgAttr("#");
            setSelectedFile(null);

            // update doc list after the upload the document
            setTimeout(() => {
              getKycDocList();
            }, 2000);

          } else {
            const message =
              response?.payload?.message ||
              response?.payload?.message?.toString();
            toast.error(message);
          }
          setDisable(false);
        })
        .catch(function (error) {
          toast.error("Something went wrong while saving the document");
          setDisable(false);
        });
    } else {
      toast.error("Please select a document to upload");
      setDisable(false);
    }

  };

  const removeDoc = (doc_id, doc_type) => {
    const isConfirm = window.confirm(
      "Are you sure you want to remove this document"
    );
    if (isConfirm) {
      const rejectDetails = {
        document_id: doc_id,
        removed_by: loginId,
      };
      dispatch(removeDocument(rejectDetails))
        .then((resp) => {
          setTimeout(() => {
            getKycDocList();
          }, 1300);

          // finalArray = finalArray.filter((item) => item !== doc_type);
          // dispatch(saveDropDownAndFinalArray(isRequiredDocUpload));
          resp?.payload?.status
            ? toast.success(resp?.payload?.message)
            : toast.error(resp?.payload?.message);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  const getKycDocList = () => {
    if (merchantloginMasterId != undefined && merchantloginMasterId !== "") {
      const postData = {
        login_id: merchantloginMasterId,
      }

      dispatch(
        kycDocumentUploadList(postData)
      );
    }
  };

  useEffect(() => {
    if (KycList?.businessType !== null &&
      KycList?.businessType !== undefined) {
      getKycDocList()
    }
  }, []);



  const getDocTypeName = (id) => {
    let data = docTypeList?.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });
    return data[0]?.value;
  };


  useEffect(() => {
    setImgAttr("#");
    setSelectedFile(null);
  }, [docTypeIdDropdown]);


  // doc name shorting
  const stringManulate = (str) => {
    let str1 = str.substring(0, 15);
    return `${str1}...`;
  };



  useEffect(() => {
    filteredRequirListId?.forEach((v, i) => {
      if (!uploadedReqDocList.includes(v)) {
        setIsRequiredDocUpload(false)
      }
    })

    return () => {
      setIsRequiredDocUpload(true)
    }
  }, [uploadedReqDocList, KycDocUpload])



  useEffect(() => {
    if (isRequiredDocUpload) {
      dispatch(saveDropDownAndFinalArray(true));
    } else {
      dispatch(saveDropDownAndFinalArray(false));
    }
  }, [isRequiredDocUpload, KycDocUpload])



  return (
    <>
      {BusinessOverviewStatus === true ||
        (KycList?.businessType !== null &&
          KycList?.businessType !== undefined) ? (
        <div className="col-lg-12 p-0">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              onSubmit(values, submitAction);
            }}
            enableReinitialize={true}
          >
            {(formik) => (
              <Form>
                <div className="row">
                  <div className="col-sm-12 col-md-12 col-lg-6 mb-2">
                    <label className=" col-form-label mt-0">
                      Select Document Type
                      <span className="text-danger">*</span>
                    </label>
                    <FormikController
                      control="select"
                      name="docType"
                      className="form-select"
                      options={newDocumentedOption}
                      // readOnly={readOnly}
                      disabled={(documentStatus === KYC_STATUS_VERIFIED || documentStatus === KYC_STATUS_APPROVED)}
                    />
                    {formik.handleChange(
                      "docType",
                      setDocTypeIdDropdown(formik?.values?.docType)
                    )}
                    <span className="text-danger mb-4">
                      {required.every((elem) =>
                        isrequired.includes(elem.toString())
                      ) === true
                        ? ""
                        : "* All Documents are mandatory and "}
                      Document name should be unique.
                    </span>
                  </div>

                  {/*<MerchantKycDocument />*/}
                </div>

                <div className="row">
                  {documentStatus !== "Approved" &&
                    documentStatus !== "Verified" ? (
                    docTypeIdDropdown !== "" && (
                      <>
                        <div className="col-lg-6 ">
                          <div className="file-upload  border-dotted">
                            <div className="image-upload-wrap ">
                              <FormikController
                                control="file"
                                type="file"
                                name="document_img"
                                className="file-upload-input"
                                id="3"
                                onChange={(e) => handleChange(e, 3)}
                              />
                              <div className="drag-text">
                                <p className="p-2 font-9">
                                  Add the selected document
                                </p>
                                <img
                                  alt="Doc"
                                  src={plusIcon}
                                  style={{ width: 15 }}
                                  className="mb-1 pb-3"
                                />
                                <p className="card-text">
                                  Upto 5 MB file size
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 ">
                          {imgAttr !== "#" &&
                            imgAttr.startsWith("data:application/pdf") ? (
                            <iframe
                              title="document"
                              src={imgAttr + "#toolbar=0"}
                              height={155}
                              width={150}
                            />
                          ) : (
                            ""
                          )}
                          {imgAttr === "#" ||
                            imgAttr.startsWith("data:application/pdf") ? (
                            <></>
                          ) : (
                            <div className="file-upload-content imagepre_3">
                              <img
                                className="file-upload-image imagepre_sub_3"
                                src={imgAttr}
                                alt="Document"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    )
                  ) : (
                    <></>
                  )
                  }
                </div>

                <div className="row">
                  {documentStatus !== "Approved" &&
                    documentStatus !== "Verified" &&
                    <div className="col-lg-6  mt-4">
                      <button
                        className="btn btn-sm cob-btn-primary  text-white m-1"
                        type="button"
                        disabled={disable}
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                      >
                        {disable && <>
                          <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                          <span className="sr-only">Loading...</span>
                        </>}
                        Upload Document
                      </button>

                      {/* add function go to the next step */}
                      {documentStatus !== "Approved" &&
                        documentStatus !== "Verified" &&
                        isRequiredDocUpload && (
                          <button
                            className="btn btn-sm cob-btn-primary  text-white m-1"
                            type="button"
                            onClick={() => {
                              if (isRequiredDocUpload) {
                                setTab(6);
                              } else {
                                alert("Alert! Kindly check the list of the required documents");
                              }
                            }}
                          >
                            Save & Next
                          </button>
                        )}
                    </div>
                  }
                </div>

                <div className="form-row  overflow-auto">
                  {savedData && savedData?.length ? (
                    <>
                      <hr />
                      <div className="col-lg-12 mt-4">
                        <h5>Preview Documents</h5>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.No.</th>
                              <th>Document Type</th>
                              <th>Document Name</th>
                              <th>Document Status</th>
                              {
                                documentStatus !== "Approved" &&
                                documentStatus !== "Verified" && (
                                  <th>Remove Item</th>
                                )}
                            </tr>
                          </thead>
                          <tbody>
                            {savedData?.map((doc, i) => (
                              <tr key={uuidv4()}>
                                <td>{i + 1}</td>
                                <td>{getDocTypeName(doc?.type)}</td>
                                <td>
                                  <a
                                    href={doc?.filePath}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary"
                                  >
                                    {stringManulate(doc?.name)}
                                  </a>
                                  {doc?.status?.toLowerCase() === KYC_STATUS_REJECTED.toLowerCase() ? <p className="text-danger">{doc?.comment}</p> : null}
                                </td>
                                <td>{doc?.status}</td>
                                {
                                  documentStatus !== "Approved" &&
                                  documentStatus !== "Verified" && (
                                    <td>
                                      <button
                                        aria-label="remove-doc"
                                        type="button"
                                        onClick={() => {
                                          removeDoc(doc?.documentId, doc?.type);
                                        }}
                                      >
                                        <i className="fa fa-trash"></i>
                                      </button>
                                    </td>
                                  )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div></div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <h6 className="text-danger mb-4">
          * Kindly complete the Business Overview form to upload the document before proceeding with the submission of the KYC form.
        </h6>
      )}
    </>
  );
}

export default DocumentsUpload;
