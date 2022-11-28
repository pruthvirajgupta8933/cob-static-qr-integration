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
  verifyKycEachTab,
} from "../../slices/kycSlice";
import plus from "../../assets/images/plus.png";
import "../../assets/css/kyc-document.css";
import $ from "jquery";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";

function DocumentsUpload(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role, kycid } = props;
  const roles = roleBasedAccess();

  const dispatch = useDispatch();

  function readURL(input, id) {
    if (input.files && input.files[0]) {
      let reader = new FileReader();
      reader.onload = function(e) {
        $(".imagepre_sub_" + id).attr("src", e.target.result);
        $(".imagepre_" + id).show();
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  const [docTypeList, setDocTypeList] = useState([]);
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileAadhaar, setSelectedFileAadhaar] = useState(null);
  const [savedData, setSavedData] = useState([]);
  const [requiredDocList, setRequiredDocList] = useState([1, 2, 5, 6, 11]);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Upload Document");
  const [typeOfDoc, setTypeOfDoc] = useState("");

  const { auth, kyc } = useSelector((state) => state);

  const { allTabsValidate } = kyc;
  const BusinessOverviewStatus =
    allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;

  // console.log("Busi Status ===>",BusinessOverviewStatus)

  const KycList = kyc?.kycUserList;
  const kyc_status = KycList?.status;
  const businessType = KycList.businessType;
  const { user } = auth;
  let clientMerchantDetailsList = {};
  if (
    user?.clientMerchantDetailsList &&
    user?.clientMerchantDetailsList?.length > 0
  ) {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const KycTabStatusStore = kyc?.KycTabStatusStore;

  // const { businessType } = clientMerchantDetailsList[0];
  // console.log(businessType,"myisssssssssssssssssssssssss")

  const { loginId } = user;
  const { KycDocUpload } = kyc;

  useEffect(() => {
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);

  const initialValues = {
    docType: savedData[0]?.type ? savedData[0]?.type : "",
    aadhaar_front: "",
    aadhaar_back: "",
    document_img: "",
  };

  const validationSchema = Yup.object({
    docType: Yup.string()
      .required("Document Required")
      .nullable(),
    aadhaar_front: Yup.mixed().nullable(),
    aadhaar_back: Yup.mixed().nullable(),
    document_img: Yup.mixed().nullable(),
  });

  useEffect(() => {
    dispatch(documentsUpload({ businessType }))
      .then((resp) => {
        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        // console.log(data,"complete data here resolved")
        setDocTypeList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const Array1 = docTypeList.map((a) => a.key);
  const Array2 = savedData.map((r) => r.type);

  // console.log(Array1, "Array 1 -===>")
  // console.log(Array2, "Saved Data -===>")
  // console.log(savedData, "Saved Data -===>")

  const myFilter = (elm) => {
    return elm != null && elm !== false && elm !== "";
  };

  var array1filtered = Array1.filter(myFilter);
  // console.log("Filtered Array 1 ===>", array1filtered)
  // console.log("Array Check ===>", array1filtered.every(elem => Array2.includes(elem)));

  const handleChange = function(e, id) {
    console.log();
    // if (id === 2) {
    //   setSelectedFileAadhaar(e.target.files[0]);
    // } else {
    setSelectedFile(e.target.files[0]);

    // }
    readURL(e.target, id);
  };

  const onSubmit = (values, action) => {
    if (role.merchant) {
      const bodyFormData = new FormData();
      let docType = values.docType;
      if (docType === "1") {
        bodyFormData.append("aadhar_front", selectedFile);
        bodyFormData.append("aadhar_back", selectedFileAadhaar);
      } else {
        bodyFormData.append("files", selectedFile);
      }

      bodyFormData.append("login_id", loginId);
      bodyFormData.append("modified_by", loginId);
      bodyFormData.append("type", values.docType);

      const kycData = { bodyFormData, docType };
      dispatch(merchantInfo(kycData))
        .then(function(response) {
          if (response?.payload?.status) {
            setTitle("SUBMIT KYC");
            toast.success(response?.payload?.message);

            // if (typeOfDocs === '1' && typeOfDocs === '2' && typeOfDocs ==='5' && typeOfDocs ==='6') {

            // setTab(6);
            // }
          } else {
            const message =
              response?.payload?.message ||
              response?.payload?.aadhar_back[0] ||
              response?.payload?.aadhar_front[0] ||
              response?.payload?.message?.toString() ||
              response?.payload?.aadhar_front[0]?.toString() ||
              response?.payload?.aadhar_back[0]?.toString();
            toast.error(message);
          }
        })
        .catch(function(error) {
          console.error("Error:", error);
          toast.error("Something went wrong while saving the document");
        });
    } else if (role.verifier) {
      const veriferDetails = {
        login_id: kycid,
        settlement_info_verified_by: loginId,
      };
      dispatch(verifyKycEachTab(veriferDetails))
        .then((resp) => {
          resp?.payload?.settlement_info_status &&
            toast.success(resp?.payload?.settlement_info_status);
          resp?.payload?.detail && toast.error(resp?.payload?.detail);
        })
        .catch((e) => {
          toast.error("Try Again Network Error");
        });
    }

    setTimeout(() => {
      dispatch(
        kycDocumentUploadList({
          login_id: role?.verifier || role?.approver ? kycid : loginId,
        })
      );
    }, 2000);
  };
  useEffect(() => {
    dispatch(
      kycDocumentUploadList({
        login_id: role?.verifier || role?.approver ? kycid : loginId,
      })
    );
  }, []);

  const verifyApproveDoc = (doc_id) => {
    let postData = {};
    if (role?.verifier) {
      postData = {
        document_id: doc_id,
        verified_by: loginId,
      };

      dispatch(verifyKycDocumentTab(postData)).then((resp) => {
        resp?.payload?.status
          ? toast.success(resp?.payload?.message)
          : toast.error(resp?.payload?.message);
      });

      dispatch(
        kycDocumentUploadList({
          login_id: role?.verifier || role?.approver ? kycid : loginId,
        })
      ).catch((e) => {
        toast.error("Try Again Network Error");
      });
    }

    if (role?.approver) {
      const approverDocDetails = {
        approved_by: loginId,
        document_id: doc_id,
      };
      dispatch(approveDoc(approverDocDetails)).then((resp) => {
        resp?.payload?.status
          ? toast.success(resp?.payload?.message)
          : toast.error(resp?.payload?.message);
      });
      dispatch(
        kycDocumentUploadList({
          login_id: role?.verifier || role?.approver ? kycid : loginId,
        })
      ).catch((e) => {
        toast.error("Try Again Network Error");
      });
    }
  };

  const rejectDoc = (doc_id) => {
    const rejectDetails = {
      document_id: doc_id,
      rejected_by: loginId,
      comment: "Document Rejected",
    };
    dispatch(verifyKycDocumentTab(rejectDetails))
      .then((resp) => {
        resp?.payload?.status
          ? toast.success(resp?.payload?.message)
          : toast.error(resp?.payload?.message);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };

  const removeDoc = (doc_id) => {
    const rejectDetails = {
      document_id: doc_id,
      removed_by: loginId,
    };
    dispatch(removeDocument(rejectDetails))
      .then((resp) => {
        setTimeout(() => {
          dispatch(
            kycDocumentUploadList({
              login_id: role?.verifier || role?.approver ? kycid : loginId,
            })
          );
        }, 1300);

        resp?.payload?.status
          ? toast.success(resp?.payload?.message)
          : toast.error(resp?.payload?.message);
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
      setButtonText("Approve");
    } else if (role.verifier) {
      setReadOnly(true);
      setButtonText("Verify");
    }
  }, [role]);

  let submitAction = undefined;

  const enableBtnByStatus = (imgStatus, role) => {
    const imageStatus = imgStatus?.toString()?.toLowerCase();
    const loggedInRole = role;
    let enableBtn = false;

    if (loggedInRole?.verifier) {
      if (imageStatus === "verified") {
        enableBtn = false;
      }

      if (imageStatus !== "verified") {
        enableBtn = true;
      }

      if (imageStatus === "approved") {
        enableBtn = false;
      }
    }

    if (loggedInRole?.approver) {
      if (imageStatus === "verified") {
        enableBtn = true;
      }
      if (imageStatus === "approved") {
        enableBtn = false;
      }
    }

    return enableBtn;
  };

  // console.log("<=== Type Id of Saved Images ====>",typeOfDocs)
  let btn = false;
  requiredDocList?.map((i) => {
    if (array1filtered.every((elem) => Array2.includes(elem.toString()))) {
      // console.log("Enable Save & Next")
      btn = true;
    } else {
      // console.log("Disable Save & Next")
      btn = false;
    }
  });

  const getDocTypeName = (id) => {
    // console.log("id",id);
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };

  console.log("KYC USER LIST ====>", KycList);

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
                      {array1filtered.every((elem) =>
                        Array2.includes(elem.toString())
                      ) === true
                        ? ""
                        : "* All Documents are mandatory"}
                    </span>
                  </div>

                  {role?.merchant ? (
                    KycList?.status !== "Approved" &&
                    KycList?.status !== "Verified" ? (
                      // docTypeIdDropdown === "1" ? (
                      //   <div class="row">
                      //     <div class="col-lg-6 width">
                      //       <div className="file-upload border-dotted">
                      //         <div className="image-upload-wrap ">
                      //           <FormikController
                      //             control="file"
                      //             type="file"
                      //             name="aadhaar_front"
                      //             className="file-upload-input"
                      //             id="1"
                      //             onChange={(e) => handleChange(e, 1)}
                      //           />

                      //           <div className="drag-text">
                      //             <h3 class="p-2 font-16">
                      //               Add Front Aadhaar Card
                      //             </h3>
                      //             <img
                      //               alt="Doc"
                      //               src={plus}
                      //               style={{ width: 30 }}
                      //               className="mb-4"
                      //             />
                      //             <p class="card-text">Upto 2 MB file size</p>
                      //           </div>
                      //         </div>
                      //       </div>
                      //       {/* uploaded document preview */}
                      //       <div className="file-upload-content imagepre_1">
                      //         <img
                      //           className="file-upload-image imagepre_sub_1"
                      //           src="#"
                      //           alt="Document"
                      //         />
                      //       </div>
                      //     </div>
                      //     <div class="col-lg-6 width">
                      //       <div className="file-upload  border-dotted">
                      //         <div className="image-upload-wrap ">
                      //           <FormikController
                      //             control="file"
                      //             type="file"
                      //             name="aadhaar_back"
                      //             className="file-upload-input"
                      //             id="2"
                      //             onChange={(e) => handleChange(e, 2)}
                      //           />
                      //           <div className="drag-text">
                      //             <h3 class="p-2 font-16">
                      //               Add Back Aadhaar Card
                      //             </h3>
                      //             <img
                      //               alt="Doc"
                      //               src={plus}
                      //               style={{ width: 30 }}
                      //               className="mb-4"
                      //             />
                      //             <p class="card-text">Upto 2 MB file size</p>
                      //           </div>
                      //         </div>
                      //       </div>

                      //       {/* uploaded document preview */}
                      //       <div className="file-upload-content imagepre_2">
                      //         <img
                      //           className="file-upload-image imagepre_sub_2"
                      //           src="#"
                      //           alt="Document"
                      //         />
                      //       </div>
                      //     </div>
                      //   </div>
                      // ) : docTypeIdDropdown !== "1" &&
                      docTypeIdDropdown !== "" ? (
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
                              />
                              <div className="drag-text">
                                <h3 class="p-2 font-16">
                                  Add the selected docuement
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
                          {/* uploaded document preview */}
                          <div className="file-upload-content imagepre_3">
                            <img
                              className="file-upload-image imagepre_sub_3"
                              src="#"
                              alt="Document"
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}

                  {savedData?.length > 0 ? (
                    savedData.map((img, i) =>
                      img?.status === "Rejected" ? (
                        <div className="col-lg-6 mt-4 test">
                          <p className="text-danger"> {img?.comment}</p>
                          <img
                            className="file-upload"
                            src={img?.filePath}
                            alt="kyc docuement"
                          />
                        </div>
                      ) : (
                        <></>
                      )
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
                  {true ? (
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
                              <th>S No.</th>
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

                              {!role?.merchant ? <th>Action</th> : <></>}
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
                                    {doc.name}
                                  </a>
                                </td>
                                <td>{doc.status}</td>
                                {role?.merchant &&
                                KycList?.status !== "Approved" &&
                                KycList?.status !== "Verified" ? (
                                  <td>
                                    <button
                                      type="button"
                                      class="btn btn-sm btn-warning"
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

                                {roles.verifier === true &&
                                enableBtnByStatus(doc?.status, role) ? (
                                  <td>
                                    <a
                                      href={() => false}
                                      className="btn btn-sm btn-primary m-3"
                                      onClick={() => {
                                        verifyApproveDoc(doc?.documentId);
                                      }}
                                    >
                                      {buttonText}
                                    </a>
                                    <a
                                      href={() => false}
                                      className="btn btn-sm btn-warning m-3"
                                      onClick={() => {
                                        rejectDoc(doc?.documentId);
                                      }}
                                    >
                                      Reject
                                    </a>
                                  </td>
                                ) : roles.verifier === true &&
                                  roles.approver === true ? (
                                  <td>No Action Needed</td>
                                ) : (
                                  ""
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
        <span className="text-danger mb-4">
          * Please fill the Business Overview form for uploading the document,
          before submitting the KYC form.
        </span>
      )}
    </>
  );
}

export default DocumentsUpload;
