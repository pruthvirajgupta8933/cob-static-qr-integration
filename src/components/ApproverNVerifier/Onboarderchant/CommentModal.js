import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
// import * as Yup from "yup";
// import FormikController from "../../../_components/formik/FormikController";
import {
  forSavingComments,
  forGettingCommentList,
  updateComment,
} from "../../../slices/merchantZoneMappingSlice";
// import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import _ from "lodash";
import CustomModal from "../../../_components/custom_modal";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../../_components/formik/Yup";
import DocViewerComponent from "../../../utilities/DocViewerComponent";


const CommentModal = (props) => {
  // const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  // const [uploadStatus, setUploadStatus] = useState(false);
  const [docPreviewToggle, setDocPreviewToggle] = useState(false)
  const [editToggle, setEditToggle] = useState({ toggle: false, id: null })
  const [selectViewDoc, setSelectedViewDoc] = useState("#")
  const [updateData, setUpdateData] = useState({})
  const [errorMessage, setErrorMessage] = useState("")

  const dispatch = useDispatch();

  const { auth, zone } = useSelector((state) => state);
  const { user } = auth
  const { loginId } = user;
  const { commentData } = zone


  const initialValues = {
    comments: updateData?.comments || "",
  };

  const validationSchema = Yup.object({
    // comments: Yup.string()
    //   .min(1, "Please enter , more than 1 character")
    //   .max(500, "Please do not  enter more than 500 characters")
    //   .required("Required")
    //   .nullable(),
  });


  const commentUpdate = () => {
    dispatch(
      forGettingCommentList({
        client_code: props?.commentData?.clientCode,
      })
    )
    //   .then((resp) => {
    //     setCommentsList(resp?.payload?.Data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  };

  useEffect(() => {
    commentUpdate();
  }, []);

  const aRef = useRef(null);
  const editFormRef = useRef(null)


  //function for resetupload file
  const resetUploadFile = () => {
    aRef.current.value = null;
    // setUploadStatus(false);
  };





  const dateManipulate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY HH:mm:ss");
    return date;
  };

  // function for handle upload files
  const handleUploadAttachments = (e) => {
    if (e.target.files) {
      setattachCommentFile(e.target.files[0]);
      // setUploadStatus(true);
    }
  };
  const isUrlValid = (userInput) => {
    let res = userInput.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res == null) return false;
    else return true;
  };

  const fileTypeCheck = (file) => {
    let ext = file.split(".").pop();
    const formats = ["pdf", "jpg", "jpeg", "png"];
    ext = ext.toLowerCase();
    let htmlType = _.includes(formats, `${ext}`);
    if (!htmlType) {
      return false;
    } else {
      return true;
    }
  };


  const docModalToggle = (docData) => {
    setDocPreviewToggle(true)
    setSelectedViewDoc({ docData })
  }

  const editHandler = (rowData, enable = false) => {
    setUpdateData({ ...rowData, isEdit: enable })
    if (enable) {
      let form = editFormRef.current
      let textArea = form.querySelector("#comments")
      textArea.focus();

      setTimeout(() => {
        textArea.blur();
      }, 500);
    }


  }

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    setErrorMessage("");

    let formData = new FormData();

    if (updateData?.isEdit) {
      // update comment
      formData.append("files", attachCommentFile);
      formData.append("comment_id", updateData?.id);
      formData.append("comment", values.comments);

      try {
        await dispatch(updateComment(formData));
        setUpdateData({});
        resetUploadFile();
        setattachCommentFile([]);
        resetForm();
        commentUpdate();
      } catch (error) {
        toast.error(error?.payload?.message || "Something went wrong!");
      } finally {
        setSubmitting(false);
      }

    } else {
      // insert comment
      formData.append("files", attachCommentFile);
      formData.append("login_id", loginId);
      formData.append("client_code", props?.commentData?.clientCode);
      formData.append("comments", values.comments);
      formData.append("merchant_tab", props?.tabName);

      try {
        const resp = await dispatch(forSavingComments(formData));
        const responseData = resp?.payload;

        if (responseData?.message?.status === false) {
          toast.error(responseData?.message?.message || "Something went wrong!");
          setErrorMessage(responseData?.message?.message);
        } else {
          setUpdateData({});
          resetUploadFile();
          setattachCommentFile([]);
          resetForm();
          commentUpdate();
        }
      } catch (error) {
        toast.error(error?.payload?.message || "Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    }
  };




  const modalbody = () => {

    return (
      <div className="container-fluid">
        {docPreviewToggle && <DocViewerComponent modalToggle={docPreviewToggle} fnSetModalToggle={setDocPreviewToggle} selectViewDoc={{ documentUrl: selectViewDoc?.docData?.file_path, documentName: selectViewDoc?.docData?.file_name }} />}
        <div>
          <p className="m-auto">
            Merchant Name: {props?.commentData?.clientName}
          </p>
          <p className="m-auto">
            Client Code: {props?.commentData?.clientCode}
          </p>

        </div>

        <div className="row">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, formikFn) => {
              handleSubmit(values, { ...formikFn })
            }}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <>
                <Form ref={editFormRef}>
                  <div className="form-row mt-4">
                    {attachCommentFile['name'] && <p className="text-default m-0"><i className="fa fa-paperclip" /> {attachCommentFile['name']}</p>}
                    <div className="input-group">
                      <Field
                        control="input"
                        name="comments"
                        className="form-control p-2"
                        placeholder="Enter Comments"
                        id="comments"
                      />

                      <div>
                        <label for="file-upload" className="custom-file-upload btn btn-outline-primary m-auto h-full rounded-0 border border-2 border-primary-subtle" style={{ height: "39px" }}>
                          <i className="fa fa-paperclip"></i>
                        </label>
                        <input id="file-upload" type="file" className="d-none" onChange={(e) => handleUploadAttachments(e)} ref={aRef} disabled={isSubmitting} />
                      </div>

                      <button type="submit" className="btn cob-btn-primary approve text-white" disabled={isSubmitting}>
                        {isSubmitting && (
                          <span
                            className="spinner-border spinner-border-sm mr-1"
                            role="status"
                            ariaHidden="true"
                          ></span>
                        )}
                        {updateData?.isEdit ? 'Update' : 'Submit'}</button>
                    </div>
                    <div className="w-100">
                      <p className="text-danger mb-1">{errorMessage}</p>
                    </div>
                    <ErrorMessage name="comments">{msg => <p className="text-danger m-0">{msg}</p>}</ErrorMessage>
                  </div>

                </Form>
                <div className="row g-3 mt-4">

                  <div className="col hoz-scroll">
                    {/* <h6>Previous Comments</h6> */}
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Commented By</th>
                          <th>Date of Comments</th>
                          <th>Comments from tab</th>
                          <th>Comments</th>
                          <th>View Document</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(commentData?.data?.length === undefined ||
                          commentData?.data?.length === 0) && (
                            <tr>
                              <td colSpan="5">
                                <h6 className="text-center">
                                  No Data found
                                </h6>
                              </td>
                            </tr>
                          )}

                        {(commentData?.data?.length !== undefined || commentData?.data?.length > 0) && commentData?.data?.map((commentData, i) => (
                          <tr key={uuidv4()} >
                            <td>
                              <p>{commentData?.comment_by_user_name.toUpperCase()}</p>
                              {commentData?.is_edited && <span className="fw-light text-secondary text-decoration-underline">Edited</span>}

                            </td>

                            <td>
                              {dateManipulate(commentData?.comment_on)}
                            </td>
                            <td>{commentData?.merchant_tab ?? commentData?.comment_type}</td>
                            <td
                              style={{ overflowWrap: "anywhere" }}
                            >

                              {commentData?.comments}
                            </td>
                            <td>
                              {commentData?.file_path !== null &&
                                isUrlValid(commentData?.file_path) &&
                                fileTypeCheck(commentData?.file_path) && (
                                  <p
                                    className="text-primary cursor_pointer text-decoration-underline"
                                    rel="noreferrer"
                                    onClick={() => docModalToggle(commentData)}
                                  >
                                    View Document
                                  </p>
                                )}
                            </td>

                            <td>
                              {loginId?.toString() === commentData?.comment_by &&

                                (
                                  <>
                                    {updateData?.isEdit && updateData?.id === commentData?.id ?
                                      <button className="btn btn-sm" onClick={() => editHandler({}, false)} aria-label="Close"><i className="fa fa-close "></i><span className="sr-only">Close</span></button>
                                      :
                                      <button className={`btn btn-sm`} onClick={() => editHandler(commentData, true)} aria-label="Close"><i className="fa fa-pencil"></i></button>
                                    }
                                  </>
                                )
                              }

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>


            )}

          </Formik>
        </div>

      </div>)
  };

  const modalFooter = () => {
    return (
      <button
        type="button"
        className="btn btn-secondary text-white"
        data-dismiss="modal"
        onClick={() => {
          // setCommentsList([]);
          props?.setModalState(false);
        }}
      >
        Close
      </button>

    );
  };





  return (
    <>
      <CustomModal modalBody={modalbody} headerTitle={"Add your comments"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default CommentModal;
