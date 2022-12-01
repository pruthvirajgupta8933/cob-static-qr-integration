import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import API_URL from "../../../config";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormikController from "../../../_components/formik/FormikController";
import { axiosInstanceAuth } from "../../../utilities/axiosInstance";
import { kycForPending } from "../../../slices/kycSlice";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

const CommentModal = (props) => {
  const {updateFlag} = props

  // console.log("updateFlag",updateFlag)
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const initialValues = {
    comments: "",
  };



  const validationSchema = Yup.object({
    comments: Yup.string()
      .required("Required")
      .nullable(),
  });

  console.log(props.handleForVerified, "============>");

  const handleSubmit = (values) => {
    const postData = {
      client_code: props.commentData.clientCode,
      comments: values.comments,
    };
    axiosInstanceAuth
      .post(API_URL.COMMENTS_BOX, postData)
      .then((resp) => {
        props.handleApi()
        props.handleForVerified()
        toast.success(resp?.data?.Message);
      })
      .catch(() => {});
  };

  // useEffect(() => {
  //   return () => {
  //     updateFlag(true)
  //   }
  // }, [])
  

  return (
    <div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title bolding text-black"
                id="exampleModalLongTitle"
              >
               Add your comments
              </h5>

              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h5 className="font-weight-bold">
                Merchant Name: {props?.commentData?.clientName}
              </h5>
              <h5 className="font-weight-bold">
                Client Code: {props?.commentData?.clientCode}
              </h5>
            </div>
            <div class="container">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // onSubmit={(values)=>handleSubmit(values)}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  resetForm();
                }}
                enableReinitialize={true}
              >
                <Form>
                  <div className="input full- optional">
                    <label
                      className="string optional text-bold"
                      htmlFor="comments"
                    >
                      Comments
                    </label>
                    <FormikController
                      control="textArea"
                      name="comments"
                      className="form-control"
                    />
                  </div>
                  <div class="modal-footer">
                    '
                    <button
                      type="submit"
                      class="btn approve text-white  btn-xs"
                    >
                      Submit
                    </button>
                    '
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
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
