import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const EnterUserID = (props) => {
  const { handleFormSubmit } = props;

  const validationSchema = Yup.object().shape({
    Email: Yup.string().email("Enter valid email").required("Required"),
  });

  const handleSubmit = () => {
    console.log("You clicked");
  };

  const initialValues = {
    Email: "",
  };

  return (
    <div className="container-fluid bg-info">
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
                          Email address
                        </label>
                        <Field
                          name="Email"
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Enter email"
                        />
                        {
                          <ErrorMessage name="Email">
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
                        onClick={() => props.props("a2")}
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
