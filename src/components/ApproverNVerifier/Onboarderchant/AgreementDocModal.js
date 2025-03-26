import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";

import {
  forSavingDocument,
  forGettingDocumentList,
  removeDocumentSlice,
} from "../../../slices/merchantZoneMappingSlice";
import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import { v4 as uuidv4 } from "uuid";
import Yup from "../../../_components/formik/Yup";
import DocViewerComponent from "../../../utilities/DocViewerComponent";
import { dateFormatBasic } from "../../../utilities/DateConvert";


const AgreementDocModal = (props) => {

  const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [docPreviewToggle, setDocPreviewToggle] = useState(false);
  const [selectViewDoc, setSelectedViewDoc] = useState("#");

  const initialValues = {
    comments: "",
  };

  const { user } = useSelector((state) => state?.auth);
  const { loginId } = user;

  // 1)GET API
  const dispatch = useDispatch();
  const commentUpdate = () => {
    dispatch(
      forGettingDocumentList({
        login_id: props?.documentData.documentData?.loginMasterId,
      })
    )
      .then((resp) => {
        setCommentsList(resp.payload);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    commentUpdate();
  }, [props]);

  const aRef = useRef(null);

  //function for resetupload file
  const resetUploadFile = () => {
    aRef.current.value = null;
    setUploadStatus(false);
  };

  const validationSchema = Yup.object({
    comments: Yup.string()
      .min(1, "Please enter , more than 1 character")
      .max(200, "Please do not enter more than 200 characters")
      .required("Add the comment and attached the file, Required")
      .nullable(),
  });

  const handleSubmit = async (values, setSubmitting) => {
    setSubmitting(true); // Start loader

    let formData = new FormData();
    formData.append("type", "22");
    formData.append("approver_id", loginId);
    formData.append("login_id", props?.documentData.documentData?.loginMasterId);
    formData.append("modified_by", loginId);
    formData.append("files", attachCommentFile);
    formData.append("comment", values.comments);

    try {
      const resp = await dispatch(forSavingDocument(formData));

      if (resp?.payload?.status) {
        toast.success(resp?.payload?.message);
        setSubmitting(false);
      } else {
        toast.error(resp?.payload?.message);
        setSubmitting(false);
      }

      commentUpdate();
      resetUploadFile();
    } catch (err) {
      toastConfig.errorToast("Data not loaded");
    } finally {
      setSubmitting(false); // Stop loader
    }
  };


  const dateManipulate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY HH:mm:ss");
    return date;
  };

  // function for handle upload files
  const handleUploadAttachments = (e) => {
    if (e.target.files) {
      setattachCommentFile(e.target.files[0]);
      setUploadStatus(true);
    }
  };



  const removeDocument = (id) => {
    const rejectDetails = {
      document_id: id,
      removed_by: loginId,
    };
    dispatch(removeDocumentSlice(rejectDetails))
      .then((resp) => {
        setTimeout(() => {
          getKycDocList();
        }, 1300);
        if (resp?.payload?.status) {
          commentUpdate();
          toast.success(resp?.payload?.message);
        } else {
          toast.error(resp?.payload?.message);
        }
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };

  const getKycDocList = (role) => {
    dispatch(
      forSavingDocument({
        login_id: loginId,
      })
    );
  };

  // document modal
  const docModalToggle = (docData) => {
    // console.log(docData)
    setDocPreviewToggle(true);
    setSelectedViewDoc(docData);
  };
  return (
    <>
      <div className="container-fluid">
        {docPreviewToggle && (
          <DocViewerComponent
            modalToggle={docPreviewToggle}
            fnSetModalToggle={setDocPreviewToggle}
            selectViewDoc={{
              documentUrl: selectViewDoc?.file_path,
              documentName: "Agreement",
            }}
          />
        )}
        <div className="row">
          <div className="d-flex justify-content-between">
            <p>
              <span className="fw-bold">Merchant Name : </span>{" "}
              {props?.documentData.documentData?.clientName}
            </p>
            <p>
              <span className="fw-bold"> Client Code : </span>
              {props?.documentData.documentData?.clientCode}
            </p>
          </div>
        </div>

        <div className="row">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values, actions.setSubmitting, actions.resetForm);
            }}

            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="form-row">
                  {attachCommentFile["name"] && (
                    <p className="text-default m-0">
                      <i className="fa fa-paperclip" />{" "}
                      {attachCommentFile["name"]}
                    </p>
                  )}
                  <div className="input-group ">
                    <Field
                      control="input"
                      name="comments"
                      className="form-control p-2"
                      placeholder="Enter Comments"
                    />
                    <div>
                      <label
                        for="file-upload"
                        className="custom-file-upload btn btn-outline-primary m-auto h-full rounded-0 border border-2 border-primary-subtle"
                        style={{ height: "39px" }}
                      >
                        <i className="fa fa-paperclip"></i>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        className="d-none"
                        onChange={(e) => handleUploadAttachments(e)}
                        ref={aRef}
                      />
                    </div>

                    <button
                      type="submit"
                      className="submit-btn approve text-white btn-sm cob-btn-primary"
                    >
                      {isSubmitting ? (
                        <span
                          className="spinner-border spinner-border-sm mr-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="comments">
                    {(msg) => <p className="text-danger m-0">{msg}</p>}
                  </ErrorMessage>


                </div>
              </Form>
            )}
          </Formik>
        </div>

        <hr />
        <div className="row">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <h6 className="font-weight-bold">Document</h6>
              </div>
            </div>
            <div className="row">
              <div className="col hoz-scroll-">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Remark</th>
                      <th>Uploaded Date</th>
                      <th>View Attachments</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(commentsList?.length === undefined ||
                      commentsList?.length === 0) && (
                        <tr>
                          <td colSpan="4">
                            <h6 className="font-weight-bold text-center">
                              No Data found
                            </h6>
                          </td>
                        </tr>
                      )}

                    {(commentsList?.length !== undefined ||
                      commentsList?.length > 0) &&
                      Array.isArray(commentsList)
                      ? commentsList?.map((remark, i) => (
                        <tr key={uuidv4()}>
                          <td style={{ overflowWrap: "anywhere" }}>
                            {remark?.comment}
                          </td>
                          <td>{dateFormatBasic(remark?.created_date)}</td>
                          <td>
                            <p
                              className="text-decoration-underline text-primary cursor_pointer"
                              onClick={() => docModalToggle(remark)}
                            >
                              View Document
                            </p>
                          </td>
                          <td>
                            <button
                              aria-label="button"
                              type="button"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete it?"
                                  )
                                ) {
                                  removeDocument(remark?.document_id);
                                }
                              }}
                            >
                              <i
                                className="fa fa-trash-o"
                                ariaHidden="true"
                              ></i>
                            </button>
                          </td>
                        </tr>
                      ))
                      : []}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AgreementDocModal
