import React from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import API_URL from '../../config';
import * as Yup from "yup";
import {  useSelector } from "react-redux";

const CreatePassword = (props) => {
    const {auth} = useSelector(state=>state);
  const verification_token=auth.forgotPassword.otpResponse.verification_token;
    const validationSchema = Yup.object().shape({

password:Yup.string().required("password is required")

    })


    const initialValues = {
        password: "",
       
      };


    const onSubmit = async(values)=>{
        console.log(values,"here is the response")
        const res = await axios.put(API_URL.AUTH_CREATE_NEW_PASSWORD, {
          email: "textbhuvi@gmail.com",
          verification_token:verification_token,
          password: values.password,
        
      }).then(res => {
          console.log(res)
         })
          .catch(error => {
            console.error('There was an error!', error);
          });
    
    
        props.props('a4')
        // console.log("You clicked submit.");
      };
    
    
        
    
  return (
    <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">Create Password</div>
            <div className="card-body">
              <h5 className="card-title">Please Enter the detatils. </h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
             
              >
                {({ formik }) => (
                  <>
                    <Form>
                      <div className="form-group">
                    
                        <label htmlFor="exampleInputPassword1">
                          New Password
                        </label>
                        <Field
                          name="password"
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          aria-describedby="PasswordHelp"
                          placeholder="Enter New Password"
                        />
                      
                          <ErrorMessage name="password">
                            {(msg) => (
                              <div
                                className="abhitest"
                                style={{
                                  color: "red",
                                  position: "absolute",
                                  zIndex: " 999",
                                }}
                              >
                                {msg}
                              </div>
                            )}
                          </ErrorMessage>
                        
                      </div>
                    
                     
                      <button
                        type="submit"
                        className="btn btn-primary"
                          // onClick={() => props.props("a4")}
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

  )
}

export default CreatePassword