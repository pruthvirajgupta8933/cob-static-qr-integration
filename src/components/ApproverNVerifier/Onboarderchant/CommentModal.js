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
import _ from "lodash";
import CustomModal from "../../../_components/custom_modal";

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
      .max(200, "Please do not  enter more than 200 characters")
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
    dispatch(forSavingComments(formData))
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
    let htmlType = _.includes(formats, `${ext}`);
    if (!htmlType) {
      return false;
    } else {
      return true;
    }
  };

  const headerTitle = () => {
    return (
      <>

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
      </>
    );
  };

  const modalbody = () => {
    return (
      <div className="container-fluid">
        <div>
          <h6>
            Merchant Name: {props?.commentData?.clientName}
          </h6>
          <h6>
            Client Code: {props?.commentData?.clientCode}
          </h6>

        </div>

        <div className="row">
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
              <div className="form-row">
                <div className="col">
                  <FormikController
                    control="textArea"
                    name="comments"
                    className="form-control"
                  />
                </div>

                <div className="col">
                  <label for="file-upload" class="custom-file-upload">
                    <i class="fa fa-cloud-upload"></i> Upload File
                  </label>
                  <input id="file-upload" type="file" className="d-none" onChange={(e) => handleUploadAttachments(e)} ref={aRef} />
                  <div className="mt-2 ml-3">
                    <button
                      type="submit"
                      className="submit-btn approve text-white btn-sm cob-btn-primary"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>


              <div className="row g-3">

                <div className="col hoz-scroll-">
                  <h6 className="">
                    Previous Comments
                  </h6>
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
                              <h6 className="text-center">
                                No Data found
                              </h6>
                            </td>
                          </tr>
                        )}

                      {(commentsList?.length !== undefined ||
                        commentsList?.length > 0) &&
                        Array.isArray(commentsList)
                        ? commentsList?.map((commentData, i) => (
                          <tr key={i}>
                            <td>
                              {commentData?.comment_by_user_name.toUpperCase()}
                            </td>
                            <td
                              style={{ overflowWrap: "anywhere" }}
                            >
                              {commentData?.comments}
                            </td>
                            <td>
                              {dateManipulate(commentData?.comment_on)}
                            </td>
                            <td>{commentData?.merchant_tab ?? commentData?.comment_type}</td>
                            <td>
                              {commentData?.file_path !== null &&
                                isUrlValid(commentData?.file_path) &&
                                fileTypeCheck(commentData?.file_path) && (
                                  <a
                                    href={commentData?.file_path}
                                    target={"_blank"}
                                    download
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={downloadIcon}
                                      style={{
                                        height: "20px",
                                        width: "20px",
                                        margin: "auto",
                                      }}
                                      alt=""
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
            </Form>
          </Formik>
        </div>

      </div>)
  };

  const modalFooter = () => {
    return (
      <>
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
      </>
    );
  };





  return (
    <>
      <CustomModal modalBody={modalbody} headerTitle={"Add your comments"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default CommentModal;
