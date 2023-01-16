import React, { useState, useEffect } from "react";
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

const CommentModal = (props) => {

  const [commentsList, setCommentsList] = useState([]);

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
    ).then((resp) => {
        setCommentsList(resp?.payload?.Data);
      }).catch((err) => {console.error(err) });
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

    commentUpdate()

  }, [props]);


  const validationSchema = Yup.object({
    comments: Yup.string()
      .min(1, "Please enter , more than 1 character")
      .max(100, "Please do not  enter more than 100 characters")
      .required("Required")
      .nullable(),
  });



  const handleSubmit = async (values) => {
    dispatch(
      forSavingComments({
        login_id: loginId,
        client_code: props?.commentData?.clientCode,
        comments: values.comments,
        merchant_tab:props?.tabName
      })
    )
      .then((resp) => {
        toast.success(resp?.payload?.message);
        commentUpdate();
        // return setTimeout(
        //   props && props?.handleApi
        //     ? props?.handleApi()
        //     : props?.handleForVerified(),
        //   2000
        // );
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };

  const dateManipulate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY HH:mm:ss");
    return date;
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
                  props?.setModalState(false)
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
                      </div>
                      <div className="col-sm" style={{ marginTop: "52px" }}>
                        <button
                          type="submit"
                          className="btn approve text-white  btn-xs"
                        >
                          Submit
                        </button>
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
                                      <td>
                                        {remark?.merchant_tab}
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
                              props?.setModalState(false)
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
