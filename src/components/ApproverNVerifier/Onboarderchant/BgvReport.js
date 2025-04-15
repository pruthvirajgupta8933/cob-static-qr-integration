import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";

import {

    forSavingBgvReport,
    fetchBgvReport
} from "../../../slices/merchantZoneMappingSlice";
import toastConfig from "../../../utilities/toastTypes";
import moment from "moment";
import "./comment.css";
import Yup from "../../../_components/formik/Yup";
import DocViewerComponent from "../../../utilities/DocViewerComponent";
import { dateFormatBasic } from "../../../utilities/DateConvert";


const BgvReport = (props) => {

    const [commentsList, setCommentsList] = useState([]);
    const [attachCommentFile, setattachCommentFile] = useState([]);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [docPreviewToggle, setDocPreviewToggle] = useState(false);
    const [selectViewDoc, setSelectedViewDoc] = useState("#");


    const initialValues = {
        remarks: "",
    };

    const { user } = useSelector((state) => state?.auth);
    const { loginId } = user;

    // 1)GET API
    const dispatch = useDispatch();
    const commentUpdate = () => {
        dispatch(
            fetchBgvReport({
                login_id: props?.documentData.documentData?.loginMasterId,
            })
        )
            .then((resp) => {
                setCommentsList(resp.payload.data);
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
        remarks: Yup.string()
            .min(1, "Please enter , more than 1 character")
            .max(200, "Please do not enter more than 200 characters")
            .required("Add the Remarks and attached the file, Required")
            .nullable(),
    });

    const handleSubmit = async (values, setSubmitting) => {
        setSubmitting(true)
        let formData = new FormData();

        formData.append("login_id", props?.documentData.documentData?.loginMasterId);
        formData.append("file", attachCommentFile);
        formData.append("remarks", values.remarks);

        // 2)SAVE API
        dispatch(forSavingBgvReport(formData))
            .then((resp) => {
                if (resp?.payload?.status) {
                    toast.success(resp?.payload?.message);
                    commentUpdate();
                    setSubmitting(false)
                    resetUploadFile();

                } else {
                    toast.error(resp?.payload?.message);
                    resetUploadFile();
                    commentUpdate();
                    setSubmitting(false)
                }
            })
            .catch((err) => {
                toastConfig.errorToast("Data not loaded");
                setSubmitting(false)
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







    // document modal
    const docModalToggle = (docData) => {

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
                            documentUrl: selectViewDoc,
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
                                            name="remarks"
                                            className="form-control p-2"
                                            placeholder="Enter Remarks"
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
                                            disabled={isSubmitting}
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
                                    <ErrorMessage name="remarks">
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
                                            <th>Created By Name</th>
                                            <th>File Name</th>
                                            <th>Created On</th>
                                            <th>Updated On</th>
                                            <th>File</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {commentsList?.length === 0 || !commentsList ? (
                                            <tr>
                                                <td colSpan="3">
                                                    <h6 className="font-weight-bold text-center">No Data found</h6>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td style={{ overflowWrap: "anywhere" }}>
                                                    {commentsList?.created_by_name}
                                                </td>
                                                <td>{commentsList.file_name}</td>
                                                <td>{dateFormatBasic(commentsList?.created_on)}</td>

                                                <td>
                                                    {dateFormatBasic(commentsList.updated_on)}
                                                </td>
                                                <td>
                                                    <p
                                                        className="text-decoration-underline text-primary cursor_pointer"
                                                        onClick={() => docModalToggle(commentsList.file_url)}
                                                    >
                                                        View File
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
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

export default BgvReport
