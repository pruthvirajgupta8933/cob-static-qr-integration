import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getEmailToSendOtpSlice } from "../../slices/auth";
import { useDispatch, useSelector } from "react-redux";



const EnterUserID = (props) => {
  const { handleFormSubmit } = props;
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
  });

  const handleSubmit = (data) => {
    console.log("You clicked");
     props.props("a2",data);
     dispatch(getEmailToSendOtpSlice(data));
  };

  const initialValues = {
    username: "",
  };

  // console.log(initialValues.username);
  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Forget Password</div>
            <div className="card-body">
              <h5 className="card-title">Please Enter the detatils. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  console.log(values);
                  resetForm();
                }}
              >
                {({ resetForm }) => (
                  <>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Email address / Username
                        </label>
                        <Field
                          name="username"
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Enter email"
                        />
                        {
                          <ErrorMessage name="username">
                            {(msg) => (
                              <div
                                className="abhitest"
                                style={{
                                  color: "red",
                                  position: "absolute",
                                  zIndex: " 999",
                                  marginTop: "15px",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        }
                        <small id="emailHelp" className="form-text text-muted">
                          We'll never share your email with anyone else.
                        </small>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Submit
                      </button>
                    </Form>
                  </>
                )}
              </Formik>
              <p className="card-text" style={{ display: "none" }}>
                With supporting text below as a natural lead-in to additional
                content.
              </p>
            </div>
            <div className="card-footer text-muted text-center">
              Sabpaisa.in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterUserID;
