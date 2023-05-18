import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikController from "../../../_components/formik/FormikController";
import { forSavingDocument, forGettingDocumentList, removeDocumentSlice } from "../../../slices/merchantZoneMappingSlice";
import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import downloadIcon from "../../../assets/images/download-icon.svg";
import _ from "lodash";
import CustomModal from "../../../_components/custom_modal";

const ViewDocumentModal = (props) => {
  // console.log("This is props ::",props);
  const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [btnDisable,setBtnDisable] = useState(false)


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
        // login_id: "5443"
        login_id: props?.documentData?.loginMasterId
      })
    )
      .then((resp) => {
        // console.log("This is muy respo", resp.payload);
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
      .required("Required")
      .nullable(),
  });


  const handleSubmit = async (values) => {
    // console.log("values ::", values);
    setBtnDisable(true)
    let formData = new FormData();
    formData.append("type", "22") 
    formData.append("approver_id", loginId);
    formData.append("login_id", props?.documentData?.loginMasterId);
    formData.append("modified_by", loginId);
    formData.append("files", attachCommentFile);
    formData.append("comment", values.comments);

    // 2)SAVE API
    dispatch(forSavingDocument(formData)
    )
      .then((resp) => {
        if (resp?.payload?.status) {
          toast.success(resp?.payload?.message);
          commentUpdate();
          resetUploadFile();
          setBtnDisable(false)
        } else {
          toast.error(resp?.payload?.message);
          resetUploadFile();
          commentUpdate();
          setBtnDisable(false)
        }
      })
      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
        setBtnDisable(false)
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
    let res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g);
    if (res == null)
      return false;
    else
      return true;
  }
  const fileTypeCheck = (file) => {
    let ext = file.split('.').pop();
    const formats = ["pdf", "jpg", "jpeg", "png"];
    let htmlType = _.includes(formats, `${ext}`);
    if (!htmlType) {
      return false;
    }
    else {
      return true;
    }
  }

  // API for delete button--------------------------------------------------------||
  // 3)REMOVE API
  // a)
  const removeDocument = (id) => {
    // console.log("this is id ::",id)

    const rejectDetails = {
      document_id: id,
      removed_by: loginId,
    };
    dispatch(removeDocumentSlice(rejectDetails))
      .then((resp) => {
        setTimeout(() => {
          getKycDocList();
        }, 1300);
          if(resp?.payload?.status)
          {
            commentUpdate();
            toast.success(resp?.payload?.message)
          }
          else{
            toast.error(resp?.payload?.message);
          }
      })
      .catch((e) => {
        toast.error("Try Again Network Error");
      });
  };

  // b)
  const getKycDocList = (role) => {
    dispatch(
      forSavingDocument({
        login_id: loginId,
      })
    );
  };

  // ---------------------------------------------------------------------------------||

const modalBody = () => {
  return (
    <>
     
              <h5 className="font-weight-bold">
                Merchant Name: {props?.documentData?.clientName}
              </h5>
              <h5 className="font-weight-bold">
                Client Code: {props?.documentData?.clientCode}
              </h5>
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
                      {/* <div> */}
                      {/* <div className="col-lg-12-" style={{ width: "315px" }}> */}

                      <div className="col-md-6 mt-4">
                        <FormikController
                          control="textArea"
                          name="comments"
                          className="form-control"
                        />
                      </div>

                      <div className="col-md-6">
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
                                className="submit-btn approve text-white  btn-xs"
                                disabled={btnDisable}
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
                              View Documents
                            </h2>
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
                                  <th>Remove</th>
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
                                      <td style={{ overflowWrap: "anywhere" }}>{remark?.comment}</td>
                                      <td>
                                        {dateManipulate(remark?.comment_on)}
                                      </td>
                                      <td>
                                        {remark?.file_path !== null && isUrlValid(remark?.file_path) && fileTypeCheck(remark?.file_path) && (
                                            <a
                                              href={remark?.file_path}
                                              target={"_blank"}
                                              rel="noreferrer"
                                              download
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
                                      <td>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            removeDocument(remark?.document_id);
                                          }}
                                        >
                                          <i class="fa fa-trash-o" aria-hidden="true"></i>
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
                </Form>
              </Formik>
            </div>
            

    </>
  )
}
  const modalFooter = () =>{
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
    )
  }




  return (
    <>
     <CustomModal modalBody={modalBody} headerTitle={"Upload Agreement"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>
   
  );
};

export default ViewDocumentModal;
