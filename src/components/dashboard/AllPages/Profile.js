import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from "axios";

function Profile() {
  const [message,setMessage]  = useState('');

  const [loginID , setLoginID] = useState('');
  const [clientName , setClientName] = useState('');
  const [phoneNumber , setphoneNumber] = useState('');
  const [stateadd , setStateAdd] = useState('');
  const [emailID , setEmailID] = useState('');
  const [clientCode , setClientCode] = useState('');
  const [address , setAddress] = useState('');
  const [nameAsInBankAcc , setnameAsInBankAcc] = useState('');
  const [bankName , setBankName] = useState('');
  const [bankAccountNumber , setBankAccountNumber] = useState('');
  const [ifscCode , setIfscCode] = useState('');
  const [pan , setPAN] = useState('');
  const [clientAuthType , setClientAuthType] = useState('');
  const [isCreateorUpdate, setIsCreateorUpdate] = useState(true);

  const [createProfileResponse , setCreateProfileResponse]  = useState('');
  const [retrievedProfileResponse , setRetrivedProfileResponse] = useState('');

  const CREATE_PROFILE_URL = "https://cobtest.sabpaisa.in/auth-service/client/create";
  const UPDATE_PROFILE_URL = "https://cobtest.sabpaisa.in/auth-service/client/update/${clientCode}";
  const PROFILE_GET_URL = "";

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    retrieveProfileData();
  }, [])

  const retrieveProfileData = () => {
    return axios
      .get(PROFILE_GET_URL)
  .then(res => {
    if( res.data !== 0 )
    {
      setRetrivedProfileResponse(res.data);
      setLoginID();
      setClientName();
      setphoneNumber();
      setStateAdd();
      setEmailID();
      setClientCode();
      setAddress();
      setnameAsInBankAcc();
      setBankName();
      setBankAccountNumber();
      setIfscCode();
      setPAN();
      setClientAuthType();
    }
    else {
      setIsCreateorUpdate(false);
    }
  })  
  .catch(err => {  
    console.log(err)
  });
  }
 
  const createorUpdateProfile = () => {
    return axios
      .post(isCreateorUpdate ? CREATE_PROFILE_URL : UPDATE_PROFILE_URL, {
        "loginId": loginID,
        "clientName": clientName,
        "phone": phoneNumber,
        "state": stateadd,
        "email": emailID,
        ...(isCreateorUpdate && {"clientCode": clientCode}),
        "accountHolderName": nameAsInBankAcc,
        "bankName": bankName,
        "accountNumber": bankAccountNumber,
        "ifscCode": ifscCode,
        "pan": pan,
        "address": address,
        "clientAuthenticationType" : clientAuthType,
  })
  .then(res => {  
    setCreateProfileResponse(res.data);
  })  
  .catch(err => {  
    console.log(err)
  });
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
                      <h4 className="text-left m-b-lg m-b-20">Basic Details</h4>
 
                      <div className="merchant-detail-container">
                      Login ID : 
                        <input
                          type="text"
                          name="loginID" 
                          onChange={(e) => setLoginID(e.target.value)} 
                          placeholder="Enter Login ID" 
                          value={loginID}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Client Name : 
                        <input
                          type="text"
                          name="clientName" 
                          onChange={(e) => setClientName(e.target.value)} 
                          placeholder="Enter Client Name" 
                          value={clientName}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Phone : 
                        <input
                          type="text"
                          name="Phone" 
                          onChange={(e) => setphoneNumber(e.target.value)} 
                          placeholder="Enter Phone Number" 
                          value={phoneNumber}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      State : 
                        <input
                          type="text"
                          name="State" 
                          onChange={(e) => setStateAdd(e.target.value)} 
                          placeholder="Enter State" 
                          value={stateadd}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Email-ID : 
                        <input
                          type="text"
                          name="EmailID" 
                          onChange={(e) => setEmailID(e.target.value)} 
                          placeholder="Enter Email ID" 
                          value={emailID}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Client Code : 
                        <input
                          type="text"
                          name="ClientCode" 
                          onChange={(e) => setClientCode(e.target.value)} 
                          placeholder="Enter Client Code" 
                          value={clientCode}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Address : 
                        <input
                          type="text"
                          name="Address" 
                          onChange={(e) => setAddress(e.target.value)} 
                          placeholder="Enter Address" 
                          value={address}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <h4 className="text-left m-b-lg m-b-20">Bank Details</h4>

                      <div className="merchant-detail-container">
                      Name in Bank Account : 
                        <input
                          type="text"
                          name="BankAccountName" 
                          onChange={(e) => setnameAsInBankAcc(e.target.value)} 
                          placeholder="Enter Name in Bank Account" 
                          value={nameAsInBankAcc}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Bank Name : 
                        <input
                          type="text"
                          name="BankName" 
                          onChange={(e) => setBankName(e.target.value)} 
                          placeholder="Enter Bank Name" 
                          value={bankName}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Bank Account Number : 
                        <input
                          type="text"
                          name="BankAccountNumber" 
                          onChange={(e) => setBankAccountNumber(e.target.value)} 
                          placeholder="Enter Bank Account Number" 
                          value={bankAccountNumber}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      IFSC Code : 
                        <input
                          type="text"
                          name="IFSCCode" 
                          onChange={(e) => setIfscCode(e.target.value)} 
                          placeholder="Enter IFSC Code"
                          value={ifscCode}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      PAN :
                        <input
                          type="text"
                          name="PAN" 
                          onChange={(e) => setPAN(e.target.value)} 
                          placeholder="PAN" 
                          value={pan}
                          style={{marginLeft: '10px', width: "398px"}}
                        />
                      </div>
                      <div className="merchant-detail-container">
                      Client Authentication Type : 
                        <input
                          type="text"
                          name="authType" 
                          onChange={(e) => setClientAuthType(e.target.value)} 
                          placeholder="Enter CLient Auth Type" 
                          value={clientAuthType}
                          style={{marginLeft: '10px' , width: "398px"}}
                        />
                      </div>
                      <button style={{margin: '10px', float: "right", width: '25%'}} className='class="btn btn-primary' onClick={createorUpdateProfile}>{isCreateorUpdate? "Create Profile" : "Update Profile"}</button>
                      
                          <br />
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
