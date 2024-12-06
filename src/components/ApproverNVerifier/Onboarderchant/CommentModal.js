import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
// import * as Yup from "yup";
import FormikController from "../../../_components/formik/FormikController";
import {
  forSavingComments,
  forGettingCommentList,
} from "../../../slices/merchantZoneMappingSlice";
import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import _ from "lodash";
import CustomModal from "../../../_components/custom_modal";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../../_components/formik/Yup";
import DocViewerComponent from "../../../utilities/DocViewerComponent";


const CommentModal = (props) => {
  // console.log(props)

  const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [docPreviewToggle, setDocPreviewToggle] = useState(false)
  const [selectViewDoc, setSelectedViewDoc] = useState("#")

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
      .max(500, "Please do not  enter more than 500 characters")
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
          setattachCommentFile([]);
        } else {
          toast.error(resp?.payload?.message.message);
          resetUploadFile();
          commentUpdate();
          setattachCommentFile([]);
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

  const docModalToggle = (docData) => {
    setDocPreviewToggle(true)
    setSelectedViewDoc(docData)
  }


  const modalbody = () => {

    return (
      <div className="container-fluid">
        {docPreviewToggle && <DocViewerComponent modalToggle={docPreviewToggle} fnSetModalToggle={setDocPreviewToggle} selectViewDoc={{ documentUrl: selectViewDoc?.file_path, documentName: selectViewDoc?.file_name }} />}
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
            onSubmit={(values, { resetForm }) => {
              handleSubmit(values);
              resetForm();
            }}
            enableReinitialize={true}
          >
            <Form>
              <div className="form-row mt-4">
                {attachCommentFile['name'] && <p className="text-default m-0"><i className="fa fa-paperclip" /> {attachCommentFile['name']}</p>}
                <div className="input-group ">
                  <Field
                    control="input"
                    name="comments"
                    className="form-control p-2"
                    placeholder="Enter Comments"

                  />
                  <div>
                    <label for="file-upload" className="custom-file-upload btn btn-outline-primary m-auto h-full rounded-0 border border-2 border-primary-subtle" style={{ height: "39px" }}>
                      <i className="fa fa-paperclip"></i>
                    </label>
                    <input id="file-upload" type="file" className="d-none" onChange={(e) => handleUploadAttachments(e)} ref={aRef} />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn approve text-white btn-sm cob-btn-primary"
                  >
                    Submit
                  </button>
                </div>
                <ErrorMessage name="comments">{msg => <p className="text-danger m-0">{msg}</p>}</ErrorMessage>
              </div>


              <div className="row g-3 mt-4">

                <div className="col hoz-scroll">
                  {/* <h6>Previous Comments</h6> */}
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Commented By</th>
                        <th>Comments</th>
                        <th>Date of Comments</th>
                        <th>Comments from tab</th>
                        <th>View Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(commentsList?.length === undefined ||
                        commentsList?.length === 0) && (
                          <tr>
                            <td colSpan="5">
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
                          <tr key={uuidv4()}>
                            {console.log(commentData)}
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
                                  <p
                                    className="text-primary cursor_pointer text-decoration-underline"
                                    rel="noreferrer"
                                    onClick={() => docModalToggle(commentData)}
                                  >
                                    View Document
                                  </p>
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

    );
  };





  return (
    <>
      <CustomModal modalBody={modalbody} headerTitle={"Add your comments"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default CommentModal;
