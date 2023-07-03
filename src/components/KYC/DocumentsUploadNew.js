import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import "../KYC/kyc-style.css";
import {
  
  documentsUpload,
  GetKycTabsStatus,
  kycDocumentUploadList,
  merchantInfo,
  removeDocument,
 
} from "../../slices/kycSlice";
import plus from "../../assets/images/plus.png";
import "../../assets/css/kyc-document.css";
// import $ from "jquery";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
// import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { isNull } from "lodash";
import { isUndefined } from "lodash";
import {
  KYC_STATUS_APPROVED,
  KYC_STATUS_VERIFIED,
} from "../../utilities/enums";

function DocumentsUpload(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role, kycid } = props;

  const roles = roleBasedAccess();

  const dispatch = useDispatch();

  const [docTypeList, setDocTypeList] = useState([]);
  const[isRequiredData,setIsRequiredData]=useState([])
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [requiredDocList, setRequiredDocList] = useState([1, 2, 5, 6, 11]);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Upload Document");
  const [imgAttr, setImgAttr] = useState("#");

 

 
  // Log docTypeList before filtering
  const filteredList = isRequiredData?.filter((r) => r?.is_required === true);
 
  const dropDownDocList = filteredList.map((r) => r?.id?.toString());  /// dropdown array
  
  // console.log("Dropdown array",dropDownDocList);


  const uploadedDocList = Object.values(savedData)?.map((r) => r?.type)
  const optionalArray = isRequiredData?.filter((r) => r?.is_required === false);
  const dropoptionalArray = optionalArray.map((r) => r?.id?.toString());
 

  const finalArray = uploadedDocList.filter((value) => !dropoptionalArray.includes(value));
  // console.log("finalArray",finalArray)

  const { auth, kyc } = useSelector((state) => state);
  const { allTabsValidate, KycTabStatusStore } = kyc;
  const BusinessOverviewStatus =
    allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  const KycList = kyc?.kycUserList;
  const kyc_status = KycList?.status;
  const businessType = KycList?.businessType;

  const documentStatus = KycTabStatusStore?.document_status;

  const { user } = auth;
  const { loginId } = user;
  const { KycDocUpload } = kyc;

  const documentListData = savedData?.filter((data)=>((data?.status).toLowerCase())!=="rejected")?.map((data) => data?.type);
  const dropdownListData = docTypeList?.map((data) => data?.key);
  const alreadyUploadedData = dropdownListData?.filter((elem) =>
    documentListData?.includes(elem?.toString())
  );
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
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);

  const initialValues = {
    docType: savedData[0]?.type ? savedData[0]?.type : "",
    document_img: "",
  };

  const validationSchema = Yup.object({
    docType: Yup.string().required("Document Required").nullable(),
    document_img: Yup.mixed().nullable(),
  });

  useEffect(() => {
    dispatch(documentsUpload({ businessType }))
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
 


  // const requiredData=required.every((elem)=>isrequired.includes(elem.toString()))
  // console.log(requiredData,"requiredData")

  
const isrequired = savedData?.map((r) => r.type);
 
  // const myFilter = (elm) => {
  //   return elm != null && elm !== false && elm !== "";
  // };
  // let array1filtered = Array1.filter(myFilter);
  const handleChange = function (e, id) {
    // console.log("handle change")
    setSelectedFile(e.target.files[0]);
    // console.log(e.target)
    readURL(e.target, id);
  };
  const [disable, setDisable] = useState(false);
  const onSubmit = (values, action) => {
    // If merchant logged in

    setDisable(true);
    if (role.merchant) {
      // console.log("selectedFile",selectedFile)
      if (!isNull(selectedFile) && !isUndefined(selectedFile)) {
        const bodyFormData = new FormData();
        let docType = values?.docType;
        bodyFormData.append("files", selectedFile);
        bodyFormData.append("login_id", loginId);
        bodyFormData.append("modified_by", loginId);
        bodyFormData.append("type", values?.docType);

        const kycData = { bodyFormData, docType };

        dispatch(merchantInfo(kycData))
          .then(function (response) {
            if (response?.payload?.status) {
              setTitle("SUBMIT KYC");
              dispatch(GetKycTabsStatus({ login_id: loginId }));

              toast.success(response?.payload?.message);
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
    }

    // update doc list after the upload the document
    setTimeout(() => {
      getKycDocList(role);
    }, 2000);
  };

  const removeDoc = (doc_id) => {
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
            getKycDocList(role);
          }, 1300);

          resp?.payload?.status
            ? toast.success(resp?.payload?.message)
            : toast.error(resp?.payload?.message);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }
  };

  const getKycDocList = (role) => {
    dispatch(
      kycDocumentUploadList({
        login_id: loginId,
      })
    );
  };

  useEffect(() => {
    getKycDocList(role);
  }, []);

  let submitAction = undefined;

  let btn = false;
  requiredDocList?.map((i) => {
    if (required.every((elem) => isrequired.includes(elem.toString()))) {
      btn = true;
    } else {
      btn = false;
    }
  });

  const getDocTypeName = (id) => {
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };

  useEffect(() => {
    setImgAttr("#");
    setSelectedFile(null);
  }, [docTypeIdDropdown]);

  const stringManulate = (str) => {
    let str1 = str.substring(0, 15);
    return `${str1}...`;
  };

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
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* {console.log("kyc_status",kyc_status)} */}
                    <FormikController
                      control="select"
                      name="docType"
                      className="form-select"
                      options={newDocumentedOption}
                      readOnly={readOnly}
                      disabled={
                        documentStatus === KYC_STATUS_VERIFIED ||
                        documentStatus === KYC_STATUS_APPROVED
                          ? true
                          : false
                      }
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
              </div>

              <div className="row">
              {role?.merchant ? (
                    documentStatus !== "Approved" &&
                    documentStatus !== "Verified" ? (
                      docTypeIdDropdown !== "" ? (
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
                                  // onChange={(e) => console.log(e, 3)}
                                />
                                <div className="drag-text">
                                  <p className="p-2 font-9">
                                    Add the selected document
                                  </p>
                                  <img
                                    alt="Doc"
                                    src={plus}
                                    style={{ width: 15 }}
                                    className="mb-1 pb-3"
                                  />
                                  <p className="card-text">
                                    Upto 2 MB file size
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-6 ">
                            {/* uploaded document preview */}
                            {/* {console.log("imgAttr",imgAttr)} */}
                            {imgAttr !== "#" &&
                            imgAttr.startsWith("data:application/pdf") ? (
                              <iframe
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
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
              </div>

              <div className="row">
              {documentStatus !== "Approved" &&
                  documentStatus !== "Verified" &&
                  role?.merchant ? (
                    <div className="col-lg-6  mt-4">
                      <button
                        className="btn btn-sm cob-btn-primary  text-white m-1"
                        type="button"
                        disabled={disable}
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                      >
                        {buttonText}
                      </button>

                      {/* add function go to the next step */}
                      {documentStatus !== "Approved" &&
                      documentStatus !== "Verified" &&
                      role?.merchant &&
                      btn ? (
                        <button
                          className="btn btn-sm cob-btn-primary  text-white m-1"
                          type="button"
                          onClick={() => {
                            if (dropDownDocList.length === finalArray.length) {
                              setTab(6);
                            } else {
                              alert("Kindly remove the extra document that does not required");
                            }
                          }}
                        >
                          Save & Next
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
              </div>
                <div className="form-row">
                
                  {savedData?.length ? (
                    <>
                      <hr />
                      {/* {savedData?.length > 0 ? (
                        <div className="container">
                          <div className="row">
                            <div className="col p-0 mt-2">
                              <h3
                                style={{
                                  fontWeight: "500",
                                  textDecoration: "underline",
                                }}
                              >
                                Preview Documents
                              </h3>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )} */}
                      <div className="col-lg-12 mt-4">
                      <h5>Preview Documents</h5>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.No.</th>
                              <th>Document Type</th>
                              <th>Document Name</th>
                              <th>Document Status</th>
                              {role?.merchant &&
                              documentStatus !== "Approved" &&
                              documentStatus !== "Verified" ? (
                                <th>Remove Item</th>
                              ) : (
                                <></>
                              )}

                              {/* {!role?.merchant ? <th>Action</th> : <></>} */}
                            </tr>
                          </thead>
                          <tbody>
                            {savedData?.map((doc, i) => (
                              <tr key={i}>
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
                                  <p className="text-danger"> {doc?.comment}</p>
                                </td>
                                <td>{doc?.status}</td>
                                {role?.merchant &&
                                documentStatus !== "Approved" &&
                                documentStatus !== "Verified" ? (
                                  <td>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        removeDoc(doc?.documentId);
                                      }}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </td>
                                ) : (
                                  <></>
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
        <h4 className="text-danger mb-4">
          * Please fill the Business Overview form for uploading the document,
          before submitting the KYC form.
        </h4>
      )}
    </>
  );
}

export default DocumentsUpload;
