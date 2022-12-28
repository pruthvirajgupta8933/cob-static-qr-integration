import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import "../KYC/kyc-style.css";
import {
  approveDoc,
  documentsUpload,
  kycDocumentUploadList,
  merchantInfo,
  removeDocument,
  verifyKycDocumentTab,
} from "../../slices/kycSlice";
import plus from "../../assets/images/plus.png";
import "../../assets/css/kyc-document.css";
// import $ from "jquery";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
// import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { isNull } from "lodash";
import { isUndefined } from "lodash";

function DocumentsUpload(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role, kycid } = props;


  const roles = roleBasedAccess();

  const dispatch = useDispatch();

  const [docTypeList, setDocTypeList] = useState([]);
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  // const [selectedFileAadhaar, setSelectedFileAadhaar] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [requiredDocList, setRequiredDocList] = useState([1, 2, 5, 6, 11]);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Upload Document");
  const [imgAttr, setImgAttr] = useState("#");

  const { auth, kyc } = useSelector((state) => state);
  const { allTabsValidate } = kyc;
  const BusinessOverviewStatus = allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  const KycList = kyc?.kycUserList;
  const kyc_status = KycList?.status;
  const businessType = KycList?.businessType;



  const { user } = auth;
  // let clientMerchantDetailsList = {};
  // if (
  //   user?.clientMerchantDetailsList &&
  //   user?.clientMerchantDetailsList?.length > 0
  // ) {
  //   clientMerchantDetailsList = user?.clientMerchantDetailsList;
  // }

  const { loginId } = user;
  const { KycDocUpload } = kyc;



  function readURL(input, id) {
    if (input?.files && input?.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        setImgAttr(e.target.result)
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
    docType: Yup.string()
      .required("Document Required")
      .nullable(),
    document_img: Yup.mixed().nullable(),
  });

  useEffect(() => {
    dispatch(documentsUpload({ businessType }))
      .then((resp) => {
        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        setDocTypeList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const required = []
  docTypeList?.filter((a) => {
    if (a.optional1) {
      let val = a.key
      required.push(val)
    }

  })



  const isrequired = savedData?.map((r) => r.type);
  // const Array1 = docTypeList?.map((a) => a.key);
  // const Array2 = savedData?.map((r) => r.type);

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
  const [disable, setDisable] = useState(false)
  const onSubmit = (values, action) => {
    // If merchant logged in

    setDisable(true)
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
              toast.success(response?.payload?.message);
            } else {
              const message =
                response?.payload?.message ||
                response?.payload?.message?.toString();
              toast.error(message);
            }
            setDisable(false)
          })
          .catch(function (error) {
            console.error("Error:", error);
            toast.error("Something went wrong while saving the document");
            setDisable(false)
          });
      } else {
        toast.error("Please select a document to upload");
        setDisable(false)
      }

    }

    // update doc list after the upload the document
    setTimeout(() => {
      getKycDocList(role);
    }, 2000);
  };

  const verifyApproveDoc = (doc_id) => {
    // let postData = {};
    // if (role?.verifier) {
    //   postData = {
    //     document_id: doc_id,
    //     verified_by: loginId,
    //   };

    //   dispatch(verifyKycDocumentTab(postData)).then((resp) => {
    //     resp?.payload?.status
    //       ? toast.success(resp?.payload?.message)
    //       : toast.error(resp?.payload?.message);

    //     getKycDocList(role);
    //   });
    // }

    // if (role?.approver) {
    //   const approverDocDetails = {
    //     approved_by: loginId,
    //     document_id: doc_id,
    //   };
    //   dispatch(approveDoc(approverDocDetails)).then((resp) => {
    //     resp?.payload?.status
    //       ? toast.success(resp?.payload?.message)
    //       : toast.error(resp?.payload?.message);

    //     getKycDocList(role);
    //   });
    // }
  };

  const rejectDoc = (doc_id) => {
    // const rejectDetails = {
    //   document_id: doc_id,
    //   rejected_by: loginId,
    //   comment: "Document Rejected",
    // };
    // dispatch(verifyKycDocumentTab(rejectDetails))
    //   .then((resp) => {
    //     resp?.payload?.status && toast.success(resp?.payload?.message);
    //     if (typeof resp?.payload?.status === "undefined") {
    //       toast.error("Please Try After Sometimes");
    //     }

    //     getKycDocList(role);
    //   })
    //   .catch((e) => {
    //     toast.error("Try Again Network Error");
    //   });
  };

  const removeDoc = (doc_id) => {
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
  };

  const getKycDocList = (role) => {
    dispatch(
      kycDocumentUploadList({
        login_id: role?.verifier || role?.approver ? kycid : loginId,
      })
    );
  };

  useEffect(() => {
    getKycDocList(role);
  }, []);

  // useEffect(() => {
  //   if (role.approver) {
  //     setReadOnly(true);
  //     setButtonText("Approve");
  //   } else if (role.verifier) {
  //     setReadOnly(true);
  //     setButtonText("Verify");
  //   }
  // }, [role]);

  let submitAction = undefined;

  // const enableBtnByStatus = (imgStatus, role) => {
  //   const imageStatus = imgStatus?.toString()?.toLowerCase();
  //   const loggedInRole = role;
  //   let enableBtn = false;

  //   if (loggedInRole?.verifier) {
  //     if (imageStatus === "verified") {
  //       enableBtn = false;
  //     }

  //     if (imageStatus !== "verified") {
  //       enableBtn = true;
  //     }

  //     if (imageStatus === "approved") {
  //       enableBtn = false;
  //     }
  //   }

  //   if (loggedInRole?.approver) {
  //     if (imageStatus === "verified") {
  //       enableBtn = true;
  //     }
  //     if (imageStatus === "approved") {
  //       enableBtn = false;
  //     }
  //   }

  //   return enableBtn;
  // };

  // console.log(enableBtnByStatus());
  // console.log("<=== Type Id of Saved Images ====>",typeOfDocs)
  let btn = false;
  requiredDocList?.map((i) => {
    // console.log("bhuvan", i)
    if (required.every((elem) => isrequired.includes(elem.toString()))) {
      // console.log("Enable Save & Next")
      btn = true;
    } else {
      // console.log("Disable Save & Next")
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
    setImgAttr("#")
    setSelectedFile(null)

  }, [docTypeIdDropdown]);


  const stringManulate = (str) => {
    let str1 = str.substring(0, 15)
    return `${str1}...`

  }


  return (
    <>
      {BusinessOverviewStatus === true ||
        (KycList?.businessType !== null &&
          KycList?.businessType !== undefined) ? (
        <div className="col-md-12">
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
                <div className="form-row">
                  <div class="col-sm-12 col-md-12 col-lg-12 mb-2">
                    <label class=" col-form-label mt-0 p-2">
                      Select Document Type
                      <span style={{ color: "red" }}>*</span>
                    </label>

                    <FormikController
                      control="select"
                      name="docType"
                      className="form-control"
                      options={docTypeList}
                      readOnly={readOnly}
                      disabled={
                        kyc_status === "Verified" || kyc_status === "Approved"
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
                      document name should be unique."
                    </span>
                  </div>

                  {role?.merchant ? (
                    KycList?.status !== "Approved" &&
                      KycList?.status !== "Verified" ? (
                      docTypeIdDropdown !== "" ? (
                        <>
                          <div class="col-lg-6 ">
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
                                  <h3 class="p-2 font-16">
                                    Add the selected document
                                  </h3>
                                  <img
                                    alt="Doc"
                                    src={plus}
                                    style={{ width: 30 }}
                                    className="mb-4"
                                  />
                                  <p class="card-text">Upto 2 MB file size</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div class="col-lg-6 ">
                            {/* uploaded document preview */}
                            {/* {console.log("imgAttr",imgAttr)} */}
                            {imgAttr === "#" ? <></> :
                              <div className="file-upload-content imagepre_3">
                                <img
                                  className="file-upload-image imagepre_sub_3"
                                  src={imgAttr}
                                  alt="Document"
                                />
                              </div>}
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

                  {KycList?.status !== "Approved" &&
                    KycList?.status !== "Verified" &&
                    role?.merchant ? (
                    <div class="col-12">
                      <button
                        className="btn btnbackground text-white mt-5"
                        type="button"
                        disabled={disable}
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                      >
                        {buttonText}
                      </button>

                      {/* add function go to the next step */}
                      {KycList?.status !== "Approved" &&
                        KycList?.status !== "Verified" &&
                        role?.merchant &&
                        btn ? (
                        <button
                          className="btn btnbackground text-white mt-5"
                          type="button"
                          onClick={() => setTab(6)}
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
                  {savedData?.length ? (
                    <>
                      <hr />
                      {savedData?.length > 0 ? (
                        <div class="container">
                          <div class="row">
                            <div class="col-sm">
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
                      )}
                      {/* button visible for the verifier */}

                      <div className="col-lg-12 border mt-4 m-2 test">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>S.No.</th>
                              <th>Document Type</th>
                              <th>Document Name</th>
                              <th>Document Status</th>
                              {role?.merchant &&
                                KycList?.status !== "Approved" &&
                                KycList?.status !== "Verified" ? (
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
                                <td>{doc.status}</td>
                                {role?.merchant &&
                                  KycList?.status !== "Approved" &&
                                  KycList?.status !== "Verified" ? (
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

                                {/* {enableBtnByStatus(doc?.status, role) ? (
                                  <td>
                                    <div style={{ display: "flex" }}>
                                      <a
                                        className = "text-success"
                                        onClick={() => {
                                          verifyApproveDoc(doc?.documentId);
                                        }}
                                      >
                                        <h4>{buttonText}</h4>
                                      </a>
                                      &nbsp;
                                      &nbsp;
                                      &nbsp;
                                      &nbsp;
   
                                    
                                      <a
                                        className="text-danger"
                                        onClick={() => {
                                          rejectDoc(doc?.documentId);
                                        }}
                                      >
                                        <h4>Reject</h4>
                                      </a>
                                      </div>
                                  </td>
                                ) : roles.verifier === true ||
                                  roles.approver === true ? (
                                  <td>
                                    <a
                                      href={() => false}
                                      className="text-danger"
                                      onClick={() => {
                                        rejectDoc(doc?.documentId);
                                      }}
                                    >
                                      Reject
                                    </a>
                                  </td>
                                ) : (
                                  <></>
                                )} */}
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
