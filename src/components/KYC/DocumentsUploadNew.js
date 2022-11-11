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

function DocumentsUpload(props) {
  const setTab = props.tab;
  const setTitle = props.title;
  const { role, kycid } = props;

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
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  const { auth, kyc } = useSelector((state) => state);
  const KycList = kyc?.kycUserList;
  const kyc_status = KycList?.status;
  const { user } = auth;

  const { loginId } = user;
  const { KycDocUpload } = kyc;

  useEffect(() => {
    setSavedData(KycDocUpload);
  }, [KycDocUpload]);

  const initialValues = {
    docType: savedData[0]?.type ?? "",
    aadhaar_front: "",
    aadhaar_back: "",
    pan_card: "",
  };

  const validationSchema = Yup.object({
    docType: Yup.string()
      .required("Required")
      .nullable(),
    aadhaar_front: Yup.mixed().nullable(),
    aadhaar_back: Yup.mixed().nullable(),
    pan_card: Yup.mixed().nullable(),
  });

  useEffect(() => {
    dispatch(documentsUpload())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "id",
          "name",
          resp.payload.results
        );
        setDocTypeList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = function(e, id) {
    if (id === 2) {
      setSelectedFileAadhaar(e.target.files[0]);
    } else {
      setSelectedFile(e.target.files[0]);
    }
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
            setTab(6);
            toast.success(response?.payload?.message);
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
    }, 1300);
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

  return (
    <>
      {/* <UploadDocTest /> */}
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
                <div class="form-group row">
                  <label class="col-sm-5 col-md-5 col-lg-5 col-form-label mt-0 p-2">
                    <h4 class="text-kyc-label text-nowrap">
                      Select Document Type
                      <span style={{ color: "red" }}>*</span>
                    </h4>
                  </label>
                  <div className="col-lg-7">
                    <div style={{ width: "310px" }}>
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
                    </div>
                  </div>
                </div>

                {role?.merchant ? (
                  KycList?.status !== "Approved" &&
                  KycList?.status !== "Verified" ? (
                    docTypeIdDropdown === "1" ? (
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
                                onChange={(e) => handleChange(e, 1)}
                              />

                              <div className="drag-text">
                                <h3 class="p-2 font-16">
                                  Add Front Aadhaar Card
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
                          <div className="file-upload-content imagepre_1">
                            <img
                              className="file-upload-image imagepre_sub_1"
                              src="#"
                              alt="Document"
                            />
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
                                onChange={(e) => handleChange(e, 2)}
                                // disabled={VerifyKycStatus === "Verified" ? true : false}
                                // readOnly={readOnly}
                              />
                              <div className="drag-text">
                                <h3 class="p-2 font-16">
                                  Add Back Aadhaar Card
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
                          <div className="file-upload-content imagepre_2">
                            <img
                              className="file-upload-image imagepre_sub_2"
                              src="#"
                              alt="Document"
                            />
                          </div>
                        </div>
                      </div>
                    ) : docTypeIdDropdown !== "1" &&
                      docTypeIdDropdown !== "" ? (
                      <div class="col-lg-6 ">
                        <div className="file-upload  border-dotted">
                          <div className="image-upload-wrap ">
                            <FormikController
                              control="file"
                              type="file"
                              name="pan_card"
                              className="file-upload-input"
                              id="3"
                              onChange={(e) => handleChange(e, 3)}
                            />
                            <div className="drag-text">
                              <h3 class="p-2 font-16">
                                Add {docTypeList[docTypeIdDropdown]?.value}
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

                {true ? (
                  <>
                    <hr
                      style={{
                        borderColor: "#D9D9D9",
                        textShadow: "2px 2px 5px grey",
                        width: "100%",
                        padding: "4px",
                        marginTop: "102px",
                      }}
                    />

                    {/* button visible for the verifier */}
                    {savedData?.length > 0 ? (
                      savedData?.map((img, i) => (
                        <div className="col-lg-6 mt-4 test">
                          {/* add image preview link */}
                          {img?.filePath?.includes(".pdf") ? (
                            <p>
                              <a
                                href={img?.filePath}
                                alt="preview document"
                                target="_blank"
                                rel="noreferrer"
                              >
                                {img?.name}
                              </a>
                            </p>
                          ) : (
                            <img
                              className="file-upload"
                              src={img?.filePath}
                              alt="kyc docuement"
                            />
                          )}

                          <div>
                            <p className="m-3">
                              Document Status : {img?.status}
                            </p>
                            {enableBtnByStatus(img?.status, role) ? (
                              <>
                                <a
                                  href={() => false}
                                  className="btn btn-sm btn-primary m-3"
                                  onClick={() => {
                                    verifyApproveDoc(img?.documentId);
                                  }}
                                >
                                  {" "}
                                  {buttonText}{" "}
                                </a>
                                <a
                                  href={() => false}
                                  className="btn btn-sm btn-warning m-3"
                                  onClick={() => {
                                    rejectDoc(img?.documentId);
                                  }}
                                >
                                  {" "}
                                  Reject{" "}
                                </a>
                              </>
                            ) : (
                              <></>
                            )}

                            {role?.merchant &&
                            KycList?.status !== "Approved" &&
                            KycList?.status !== "Verified" ? (
                              <a
                                href={() => false}
                                className="btn btn-sm btn-warning m-3"
                                onClick={() => {
                                  removeDoc(img?.documentId);
                                }}
                              >
                                {" "}
                                <i className="fa fa-trash"></i>{" "}
                              </a>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                    {KycList?.status !== "Approved" &&
                    KycList?.status !== "Verified" &&
                    role?.merchant ? (
                      <div class="col-12">
                        <button
                          className="btn float-lg-right"
                          style={{ backgroundColor: "#0156B3" }}
                          type="button"
                          onClick={() => {
                            formik.handleSubmit();
                          }}
                        >
                          <h4 className="text-white text-kyc-sumit">
                            &nbsp; &nbsp;{buttonText} &nbsp; &nbsp;
                          </h4>
                        </button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export default DocumentsUpload;
