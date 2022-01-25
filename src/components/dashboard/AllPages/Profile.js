import React, { useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';


function Profile() {
  const [message,setMessage]  = useState('');
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    var clientMerchantDetailsList =[];
    if(user && user.clientMerchantDetailsList===null){
      setMessage("Please update your profile to access the dashbaord");
    }else{
      clientMerchantDetailsList = user.clientMerchantDetailsList;
    }
  }, [])
 
  

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
                        <label>ID</label><label>hkiWYmgbg</label></div>
                      <div className="merchant-detail-container"><label>User Name</label><label>VISHAL
                          ANAND</label></div>
                      <div className="merchant-detail-container"><label>Login
                          Email</label><label>visi.bhatt@gmail.com</label></div>
                      <div className="merchant-detail-container"><label>Phone Number</label><label>+91
                          9899660338</label></div>
                      <div className="merchant-detail-container"><label>State</label><label>Uttar
                          Pradesh</label></div>
                          <br />
                          <h4 className="text-left m-b-lg m-b-20">Bank Details</h4>
                      <div className="merchant-detail-container"><label>Bank Name</label><label>
                      Bank Of Baroda</label></div>
                      <div className="merchant-detail-container"><label>Account Type
                          </label><label>Savings Account</label></div>
                      <div className="merchant-detail-container"><label>Account Number</label><label>
                      4012888888881881</label></div>
                      <div className="merchant-detail-container"><label>IFSC Code </label><label>BARB0INDELX
                          </label></div>
                    </div>
                    <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}}>
                    </div>
                  </div>
                </div>
                <div tabIndex={0} role="presentation" style={{width: '0px', height: '0px', overflow: 'hidden', position: 'absolute'}} />
              </div>
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
