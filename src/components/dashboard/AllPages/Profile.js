import React, { useState,useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Formik, Field, Form, ErrorMessage} from "formik";
import * as Yup from 'yup'
import "yup-phone"
import axios from 'axios';
import {createClientProfile, updateClientProfile} from '../../../slices/dashboardSlice' 



function Profile() {
  const dispatch= useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { clientSuperMasterList ,
          loginId,
          clientContactPersonName,
          clientEmail,
          clientMobileNo,
          state,
          accountHolderName,
          accountNumber,
          bankName,
          ifscCode,
          pan,
        } = user;
  
  const [message,setMessage]  = useState('');

  const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);
  const [clientId,setClientId] = useState(clientSuperMasterList?.clientId)
  const [createProfileResponse , setCreateProfileResponse]  = useState('');
  const [retrievedProfileResponse , setRetrivedProfileResponse] = useState('');



  
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
console.log(clientSuperMasterList?.address)
const INITIAL_FORM_STATE = {
  loginId:loginId,
  clientName:clientContactPersonName,
  phone:clientMobileNo,
  state:state,
  email:clientEmail,
  ...(isCreateorUpdate && {clientCode:''}),
  address:clientSuperMasterList?.address,
  accountHolderName:accountHolderName,
  bankName:bankName,
  accountNumber:accountNumber,
  ifscCode:ifscCode,
  pan:pan 
};

console.log("INITIAL_FORM_STATE----",INITIAL_FORM_STATE);

const FORM_VALIDATION = Yup.object().shape({
  loginId:Yup.string().required("Required"),
  clientName: Yup.string().required("Required"),
  phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  state: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  ...(isCreateorUpdate && {clientCode: Yup.string().min(6,"Client Code should be 6 digit").required("Required")}),
  address: Yup.string().required("Required"),
  accountHolderName: Yup.string().required("Required"),
  bankName: Yup.string().required("Required"),
  accountNumber: Yup.string().required("Required"),
  ifscCode: Yup.string().required("Required"),
  pan: Yup.string().required("Required"),
});

  const CREATE_PROFILE_URL = "https://cobtest.sabpaisa.in/auth-service/client/create";
  const UPDATE_PROFILE_URL = "https://cobtest.sabpaisa.in/auth-service/client/update/${clientCode}";
  const PROFILE_GET_URL = "";



  useEffect(() => {
    setIsCreateorUpdate(clientSuperMasterList && clientSuperMasterList!==null ? false : true);
  }, [])

 
  const createorUpdateProfile = (data) => {
    console.log(isCreateorUpdate)
    console.log("send client id",clientId);
    isCreateorUpdate ? dispatch(createClientProfile(data)) : delete data.clientCode; dispatch(updateClientProfile({data,clientId}))
  };

    return (
        <section className="ant-layout">
        <div className="profileBarStatus">
          {/* {message} */}
        </div>
        <main className="gx-layout-content ant-layout-content">
          <div className="gx-main-content-wrapper">
            <div className="right_layout my_account_wrapper">
              <h1 className="right_side_heading">My Profile<button type="button" className="ant-btn change_password pull-right"><i className="icon icon-reset-password" /><span>Change Password</span></button></h1>
              <div className="ant-tabs ant-tabs-top ant-tabs-line">
                <div role="tablist" className="ant-tabs-bar ant-tabs-top-bar" tabIndex={0}>
                  <div className="ant-tabs-nav-container">
                    <div className="ant-tabs-nav-wrap">
                      <div className="ant-tabs-nav-scroll">
                        <div className="ant-tabs-nav- ant-tabs-nav-animated">
                          <div>
                          <h4 style={{background: "#ffa2a2",padding: "14px",margin:" auto",textAlign: "center"}}>{message}</h4>
                            <div role="tab" aria-disabled="false" aria-selected="true" className="ant-tabs-tab-active ant-tabs-tab">Basic Details</div>
                          </div>
                          <div className="ant-tabs-ink-bar ant-tabs-ink-bar-animated" style={{display: 'block', transform: 'translate3d(0px, 0px, 0px)', width: '116px'}}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
                <div className="ant-tabs-content ant-tabs-content-animated ant-tabs-top-content" style={{marginLeft: '0%'}}>
                  <div role="tabpanel" aria-hidden="false" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}}>
                    </div>
                    <div className="panel">
                      <Formik
                            initialValues={{
                            ...INITIAL_FORM_STATE
                        }}
                            validationSchema={FORM_VALIDATION}
                            onSubmit={createorUpdateProfile}
                        >
                      <Form>
                      <h4 className="text-left m-b-lg m-b-20">Basic Details</h4>
                      <div className="merchant-detail-container">
                      Login ID : 
                        <Field
                          type="text"
                          name="loginId"
                          disabled
                        />
                      </div>

                      <div className="merchant-detail-container">
                      Client Name : 
                        <Field
                          type="text"
                          name="clientName" 
                          placeholder="Enter Client Name" 
                        />
                        <ErrorMessage name="clientName">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>                      
                      </div>
                      <div className="merchant-detail-container">
                      Phone : 
                        <Field
                          type="text"
                          name="phone"
                          placeholder="Enter Phone Number" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                        <ErrorMessage name="phone">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      <div className="merchant-detail-container">
                      State : 
                        <Field
                          type="text"
                          name="state" 
                          placeholder="Enter State" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                          <ErrorMessage name="state">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>


                      <div className="merchant-detail-container">
                      Email-ID : 
                        <Field
                          type="text"
                          name="email" 
                          placeholder="Enter Email ID" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                          <ErrorMessage name="email">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      {/* Client Code Hide if already client created */}
                      {isCreateorUpdate ? <div className="merchant-detail-container">
                      Client Code : 
                        <Field
                          type="text"
                          name="clientCode" 
                          placeholder="Enter Client Code" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                          <ErrorMessage name="clientCode">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div> : <></> }
                      <div className="merchant-detail-container">
                      Address : 
                        <Field
                          type="text"
                          name="address" 
                          placeholder="Enter Address" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                          <ErrorMessage name="address">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      {/* start bank details field */}
                      <h4 className="text-left m-b-lg m-b-20">Bank Details</h4>

                      <div className="merchant-detail-container">
                      Name in Bank Account : 
                        <Field
                          type="text"
                          name="accountHolderName" 
                          placeholder="Enter Name in Bank Account" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                          <ErrorMessage name="accountHolderName">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>
                      <div className="merchant-detail-container">
                      Bank Name : 
                        <Field
                          type="text"
                          name="bankName"  
                          placeholder="Enter Bank Name" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                        <ErrorMessage name="bankName">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      <div className="merchant-detail-container">
                      Bank Account Number : 
                        <Field
                          type="text"
                          name="accountNumber" 
                          placeholder="Enter Bank Account Number" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                           <ErrorMessage name="accountNumber">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      <div className="merchant-detail-container">
                      IFSC Code : 
                        <Field
                          type="text"
                          name="ifscCode" 
                          placeholder="Enter IFSC Code"
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                         <ErrorMessage name="ifscCode">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>

                      <div className="merchant-detail-container">
                      PAN :
                        <Field
                          type="text"
                          name="pan"  
                          placeholder="PAN Number" 
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                         <ErrorMessage name="pan">
                            { msg => <div className="error_msg_display" >{msg}</div> }
                        </ErrorMessage>  
                      </div>
                 
                      <button type="sumbit" style={{margin: '10px', float: "right", width: '25%'}} className="btn btn-primary" >{isCreateorUpdate? "Create Profile" : "Update Profile"}</button>
                      
                          <br />
                        </Form>
                       </Formik>
                    </div>

                    </div>
                    <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}}>
                    </div>
                  </div>
                </div>
                <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
              </div>
            </div>
          <footer className="ant-layout-footer">
            <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
          </footer>
        </main>
      </section>
    )
}

export default Profile
