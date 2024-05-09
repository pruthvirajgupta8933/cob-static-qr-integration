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
import { v4 as uuidv4 } from 'uuid';

const ViewDocumentModal = (props) => {
  const [commentsList, setCommentsList] = useState([]);
  const [attachCommentFile, setattachCommentFile] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false)


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
      login_id: props?.documentData?.loginMasterId
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
        if (resp?.payload?.status) {
          commentUpdate();
          toast.success(resp?.payload?.message)
        }
        else {
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
      <div className="container-fluid">

        <h6 className="">
          Merchant Name: {props?.documentData?.clientName}
        </h6>
        <h6 className="">
          Client Code: {props?.documentData?.clientCode}
        </h6>
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
                <div className="col-md-6">
                  <FormikController
                    control="textArea"
                    name="comments"
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <div className="file-input">
                    <h6 className="">Attachments</h6>

                    <div className="d-flex">
                      <div>
                        <label for="file-upload" className="btn btn-sm cob-btn-primary">
                          <i className="fa fa-cloud-upload"></i> Upload
                        </label>
                        <input id="file-upload" type="file" className="d-none" onChange={(e) => handleUploadAttachments(e)} ref={aRef} />

                      </div>
                      <div className="ml-3">
                        <button
                          type="submit"
                          className="submit-btn approve text-white  cob-btn-primary  btn-sm"
                          disabled={btnDisable}
                        >
                          Submit
                        </button>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      {uploadStatus && (
                        <>
                          <div>{attachCommentFile?.name}</div>
                          <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={resetUploadFile}
                          >
                            <span ariaHidden="true">&times;</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </Formik>
        </div>
        <div className="row">
          <div className="container">
            <div className="row">
              <div
                className="col-lg-5"
              >
                <h6 className="font-weight-bold">
                  View Documents
                </h6>
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
                        <tr key={uuidv4()}>
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
                              aria-label="button"
                              type="button"
                              onClick={() => {
                                removeDocument(remark?.document_id);
                              }}
                            >
                              <i className="fa fa-trash-o"ariaHidden="true"></i>
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
    )
  }

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
    )
  }

  return (
    <>
      <CustomModal modalBody={modalBody} headerTitle={"Upload Agreement"} modalFooter={modalFooter} modalToggle={props?.isModalOpen} fnSetModalToggle={props?.setModalState} />
    </>

  );
};

export default ViewDocumentModal;
