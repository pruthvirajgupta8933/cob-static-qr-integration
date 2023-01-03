import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getEmailToSendOtpSlice } from "../../slices/auth";
import { useDispatch, useSelector } from "react-redux";
import toastConfig from "../../utilities/toastTypes";
import { toast } from "react-toastify";
import { Regex, RegexMsg } from ".././../_components/formik/ValidationRegex";

const EnterUserID = (props) => {
  // const { handleFormSubmit } = props;
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Required"),
  });

  const handleSubmit = (data) => {
    // console.log("You clicked");
    // toastConfig.successToast("OTP Sent Succesfully")

    dispatch(
      getEmailToSendOtpSlice({
        email: data.email,
        otp_type: "both",
        otp_for: "Forgot Password",
      })
    ).then((res) => {
      // console.log("This is the response", res);
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.status === true) {
          props.props("a2", data);
          toast.success("OTP Sent Successfully");
        }
      } else {
        toast.error("Email is Incorrect");
      }
    });
  };

  const initialValues = {
    email: "",
  };

  // console.log(initialValues.username);
  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Forgot Password</div>
            <div className="card-body Satoshi-Medium">
              <h5 className="card-title">Please Enter the details. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(values);
                  resetForm();
                }}
              >
                {({ resetForm }) => (
                  <>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">
                          Email address / User name
                        </label>
                        <Field
                          name="email"
                          type="text"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Enter email"
                        />
                        {
                          <ErrorMessage name="email">
                            {(msg) => (
                              <div
                                className="abhitest "
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
                      <button type="submit" className="userIdbutton text-white">
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
