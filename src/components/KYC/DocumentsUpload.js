import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import "../KYC/kyc-style.css";
import API_URL from "../../config";
import {
  approveDoc,
  documentsUpload,
  merchantInfo,
  verifyKycDocumentTab,
  // verifyKycEachTab,
} from "../../slices/kycSlice";

function DocumentsUpload(props) {
  const { role } = props;
  const [docTypeList, setDocTypeList] = useState([]);
  const [fieldValue, setFieldValue] = useState(null);
  
  const [selectedFile, setSelectedFile] = React.useState(null);
  // const [visibility, setVisibility] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [buttonText, setButtonText] = useState("Save and Next");

  // const [photos, setPhotos] = useState([]);
  const { user } = useSelector((state) => state.auth);
  // var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const dispatch = useDispatch();

  const KycDocList = useSelector((state) => state.kyc.KycDocUpload);

  const VerifyKycStatus = useSelector(
    (state) => state.kyc.KycDocUpload[0]?.status
  );

  console.log(KycDocList);

  const initialValues = {
    docType: KycDocList[0]?.type ? KycDocList[0]?.type : "",
    docFile: KycDocList[0]?.filePath ? KycDocList[0]?.filePath : "",
    isRejected: false,
  };

  console.log(initialValues);

  const documentId = useSelector(
    (state) => state.kyc.KycDocUpload[0]?.documentId
  );

  console.log(documentId);
  const ImgUrl = `${API_URL.Image_Preview}/?document_id=${documentId}`;
  // console.log(ImgUrl,"<===========KYC DOC Id===========>")
  // console.log(KycDocList,"<===========KYC DOC List===========>")

  useEffect(() => {
    dispatch(documentsUpload())
      .then((resp) => {
        const data = convertToFormikSelectJson(
          "id",
          "name",
          resp?.payload?.results
        );
        setDocTypeList(data);
      })
      .catch((err) => console.log(err));
  }, []);



  const validationSchema = Yup.object({
    docType: Yup.string()
      .required("Required")
      .nullable(),
    docFile: Yup.mixed().nullable(),
  });

  // const displayImages = () => {
  //   return photos.map((photo) => {
  //     return <img src={photo} alt="" />;
  //   });
  // };

  //----------------------------------------------------------------------
  // console.log(fieldValue);
  //-------------------------------------------------------------------------
  const onSubmit = (values, action) => {
    if (role.merchant) {
      // console.log("eee");
      const bodyFormData = new FormData();
      bodyFormData.append("files", selectedFile);
      bodyFormData.append("login_id", loginId);
      bodyFormData.append("modified_by", loginId);
      bodyFormData.append("type", values.docType);

      // console.log("body",bodyFormData);
      for (var pair of bodyFormData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }


   

      dispatch(merchantInfo(bodyFormData)).then((res) => {
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.status === true
        ) {
          toast.success(res.payload.message);
        } else {
          toast.error("Something Went Wrong! Please try again.");
        }
      });
    } else if (role.verifier) {
      if (action === "submit") {
        const veriferDetails = {
          verified_by: loginId,
          document_id: documentId,
        };
        dispatch(verifyKycDocumentTab(veriferDetails))
          .then((resp) => {
            resp?.payload?.status
              ? toast.success(resp?.payload?.message)
              : toast.error(resp?.payload?.message);
          })
          .catch((e) => {
            toast.error("Try Again Network Error");
          });
      }

      if (action === "reject") {
        const rejectDetails = {
          document_id: documentId,
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
      }
    } else if (role.approver) {
      if (action === "approve") {
        const approverDocDetails = {
          approved_by: loginId,
          document_id: documentId,
        };
        dispatch(approveDoc(approverDocDetails))
          .then((resp) => {
            resp?.payload?.status
              ? toast.success(resp?.payload?.message)
              : toast.error(resp?.payload?.message);
          })
          .catch((e) => {
            toast.error("Try Again Network Error");
          });
      }
    }
  };

  useEffect(() => {
    if (role.approver) {
      setReadOnly(true);
      setButtonText("Approve Document");
    } else if (role.verifier) {
      setReadOnly(true);
      setButtonText("Verify and Next");
    }
  }, [role]);


  const handleFileSelect = (event) => {
    console.log(event.target.files)
    setSelectedFile(event.target.files[0])
  }

  let submitAction = undefined;

  console.log(role)
  return (
    <div className="col-md-12 col-md-offset-4">
      <div className="">
        <p>
          Note : Please complete Business Overview Section to view the list of
          applicable documents!
        </p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          onSubmit(values, submitAction);
        }}
        enableReinitialize={true}
      >
        {(formik) => (
          <Form>
            {/* {console.log(formik)} */}
            <ul className="list-inline  align-items-center ">
              <li className="list-inline-item align-middle  w-25">
                <div className="form-group col-md-12">
                  <FormikController
                    control="select"
                    label="Document Type"
                    name="docType"
                    className="form-control"
                    options={docTypeList}
                    // disabled={VerifyKycStatus === "Verified" ? true : false}
                    readOnly={readOnly}
                  />
                </div>
              </li>
              <li className="list-inline-item align-middle   w-50">
                {role.merchant ? (
                  <div className="form-group col-lg-12">
                    <FormikController
                      control="file"
                      type="file"
                      label="Select Document"
                      name="docFile"
                      className="form-control-file"
                      onChange={(event) => {
                        handleFileSelect(event);
                        setFieldValue("docFile", event.target.files[0].name);
                        
                      }}
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      disabled={VerifyKycStatus === "Verified" ? true : false}
                      readOnly={readOnly}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </li>
              <li className="list-inline-item align-middle w-25">
                {role.merchant ? (
                  <button
                    className="btn text-white mb-0"
                    type="button"
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    style={{backgroundColor: "rgb(1, 86, 179)"}}
                  >
                    {buttonText}
                  </button>
                ) : (
                  <></>
                )}

                {(role.approver === true || role.verifier === true) &&
                  VerifyKycStatus !== "Approved" && (
                    <>
                      {role.verifier === true ? (
                        <button
                          className="btn text-white mb-0"
                          type="button"
                          style={{backgroundColor: "rgb(1, 86, 179)"}}
                          onClick={() => {
                            submitAction = "submit";
                            formik.handleSubmit();
                          }}
                        >
                          {buttonText}
                        </button>
                      ) : (
                        <button
                          className="btn text-white mb-0"
                          type="button"
                          style={{backgroundColor: "rgb(1, 86, 179)"}}
                          onClick={() => {
                            submitAction = "approve";
                            formik.handleSubmit();
                          }}
                        >
                          {buttonText}
                        </button>
                      )}

                      <button
                        className="btn btn-danger mb-0 text-white"
                        type="button"
                        style={{backgroundColor: "rgb(1, 86, 179)"}}
                        onClick={() => {
                          submitAction = "reject";
                          formik.handleSubmit();
                        }}
                      >
                        Reject Document
                      </button>
                    </>
                  )}
              </li>
              {/* <li className="list-inline-item align-middle   w-25" > Download</li> */}
            </ul>
            {/* {console.log(formik)} */}
          </Form>
        )}
      </Formik>
      <div></div>
      {/* {console.log(documentId)} */}
      {user?.roleId === 3 && user?.roleId === 13 ? (
        <></>
      ) : documentId === null ? (
        <></>
      ) : typeof documentId !== "undefined" ? (
        <div class="mt-md-4">
          <h4 class="font-weight-bold mt-xl-4">ImagePreview</h4>
          <a href={ImgUrl} target="_blank" rel="noreferrer">
            <img src={ImgUrl} alt="" width="150px" height="150px" />
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DocumentsUpload;
