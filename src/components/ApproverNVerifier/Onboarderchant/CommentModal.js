import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikController from "../../../_components/formik/FormikController";
import {
  forSavingComments,
  forGettingCommentList,
} from "../../../slices/merchantZoneMappingSlice";
import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import downloadIcon from "../../../assets/images/download-icon.svg";

const CommentModal = (props) => {
  const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);

  // console.log(props,"Comment Modal Props")

  const initialValues = {
    comments: "",
  };

  const { user } = useSelector((state) => state?.auth);
  const { loginId } = user;

  const dispatch = useDispatch();
  const commentUpdate = () => {
    dispatch(
      forGettingCommentList({
        client_code: props?.commentData?.clientCode,
      })
    )
      .then((resp) => {
        setCommentsList(resp?.payload?.Data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // if (props && props?.commentData?.clientCode !== "") {
    //   dispatch(
    //     forGettingCommentList({
    //       client_code: props?.commentData?.clientCode,
    //     })
    //   ).then((resp) => {
    //       setCommentsList(resp?.payload?.Data);
    //     }).catch((err) => { });
    // }

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
      .max(100, "Please do not  enter more than 100 characters")
      .required("Required")
      .nullable(),
  });

  const handleSubmit = async (values) => {
    let formData = new FormData();
    formData.append("files", attachCommentFile);
    formData.append("login_id", loginId);
    formData.append("client_code", props?.commentData?.clientCode);
    formData.append("comments", values.comments);
    formData.append("merchant_tab", props?.tabName);
    dispatch(forSavingComments(formData)
    )
      .then((resp) => {
        if (resp?.payload?.message?.status && resp?.payload?.status) {
          toast.success(resp?.payload?.message.message);
          commentUpdate();
          resetUploadFile();
        } else {
          toast.error(resp?.payload?.message.message);
          resetUploadFile();
          commentUpdate();
        }
      })
      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };

  const dateManipulate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY HH:mm:ss");
    return date;
  };

  // function for handle upload files
  const handleUploadAttachments = (e) => {
    if (e.target.files) {
      setattachCommentFile(e.target.files[0]);
      setUploadStatus(true);
    }
  };

  return (
    <div>
      <div
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        className={
          "modal fade mymodals" +
          (props?.isModalOpen ? " show d-block" : " d-none")
        }
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title bolding text-black"
                id="exampleModalLongTitle"
              >
                Add your comments
              </h5>

              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setCommentsList([]);
                  props?.setModalState(false);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h5 className="font-weight-bold">
                Merchant Name: {props?.commentData?.clientName}
              </h5>
              <h5 className="font-weight-bold">
                Client Code: {props?.commentData?.clientCode}
              </h5>
            </div>
            <div className="container">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  resetForm();
                }}
                enableReinitialize={true}
              >
                <Form>
                  <div className="container">
                    <div className="row">
                      <div>
                        <div className="col-lg-12-" style={{ width: "315px" }}>
                          <FormikController
                            control="textArea"
                            name="comments"
                            className="form-control"
                          />
                          <div class="file-input">
                            <h5 className="font-weight-bold">Attachments</h5>
                            <input
                              ref={aRef}
                              type="file"
                              id="file"
                              class="file"
                              onChange={(e) => handleUploadAttachments(e)}
                            />
                            <div className="d-flex">
                              <div>
                                <label for="file">
                                  Upload Files{" "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-paperclip"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
                                  </svg>
                                  <p class="file-name"></p>
                                </label>
                              </div>
                              <div className="mt-2 ml-3">
                                <button
                                  type="submit"
                                  className="btn approve text-white  btn-xs"
                                >
                                  Submit
                                </button>
                              </div>

                              <div></div>
                            </div>

                            <div className="d-flex justify-content-between">
                              {uploadStatus && (
                                <>
                                  <div>{attachCommentFile?.name}</div>
                                  <button
                                    type="button"
                                    class="close"
                                    aria-label="Close"
                                    onClick={resetUploadFile}
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div
                            className="col-lg-5"
                            style={{
                              marginTop: "28px",
                              textDecoration: "underline",
                            }}
                          >
                            <h2 className="font-weight-bold">
                              Previous Comments
                            </h2>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Commented By</th>
                                  <th>Comments</th>
                                  <th>Date of Comments</th>
                                  <th>Comments from tab</th>
                                  <th>Download Attachments</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(commentsList?.length === undefined ||
                                  commentsList?.length === 0) && (
                                  <tr>
                                    <td colSpan="3">
                                      <h3 className="font-weight-bold text-center">
                                        No Data found
                                      </h3>
                                    </td>
                                  </tr>
                                )}

                                {(commentsList?.length !== undefined ||
                                  commentsList?.length > 0) &&
                                Array.isArray(commentsList)
                                  ? commentsList?.map((remark, i) => (
                                      <tr key={i}>
                                        <td>
                                          {remark?.comment_by_user_name.toUpperCase()}
                                        </td>
                                        <td>{remark?.comments}</td>
                                        <td>
                                          {dateManipulate(remark?.comment_on)}
                                        </td>
                                        <td>{remark?.merchant_tab}</td>
                                        <td>
                                          {remark?.file_path !== null && (
                                            <a
                                              href={remark?.file_path}
                                              target={"_blank"}
                                              download
                                            >
                                              <img
                                                src={downloadIcon}
                                                style={{
                                                  height: "20px",
                                                  width: "20px",
                                                  margin: "auto",
                                                }}
                                              />
                                            </a>
                                          )}
                                        </td>
                                      </tr>
                                    ))
                                  : []}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary text-white"
                            data-dismiss="modal"
                            onClick={() => {
                              setCommentsList([]);
                              props?.setModalState(false);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
