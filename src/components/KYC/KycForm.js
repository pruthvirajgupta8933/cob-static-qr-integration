import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import BankDetails from './BankDetails';
import BusinessDetails from './BusinessDetails';
import BusinessOverview from './BusinessOverview';
import ContactInfo from './ContactInfo';
import DocumentsUpload from './DocumentsUpload';
import SubmitKyc from './SubmitKyc';


function KycForm() {
    const [tab,SetTab] = useState(1);

    const {dashboard,auth} = useSelector((state)=>state);
    const {user} = auth;
    let history = useHistory();

    // if(user && user.clientMerchantDetailsList===null){
    //       history.push('/dashboard/profile');
    // } 
     
  if(user.roleId!==3 && user.roleId!==13){
    if(user.clientMerchantDetailsList===null){
      console.log("paylink");
      history.push('/dashboard/profile');

    }
  } 
    
   

  return (
    <section className="ant-layout">
    <div className="profileBarStatus">
    </div>
    <main className="gx-layout-content ant-layout-content">
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h1 className="m-b-sm gx-float-left">KYC</h1>
        </div>
        <section className="features8 cid-sg6XYTl25a flleft" id="features08-3-">
          <div className="container-fluid">
            <div className="row bgcolor">
              <div className="col-lg-12 mb-4 bgcolor-">
              <ul className="nav nav-tabs">
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===1? "activepaylink":"inactive") } onClick={()=>SetTab(1)} >Contact Info</a>
                          </li>
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===2? "activepaylink":"inactive") } onClick={()=>SetTab(2)} >Business Overview</a>
                          </li>
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===3? "activepaylink":"inactive") }  onClick={()=>SetTab(3)}>Business Details</a>
                          </li>
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===4? "activepaylink":"inactive") } onClick={()=>SetTab(4)}>Bank Details</a>
                          </li>
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===5? "activepaylink":"inactive") } onClick={()=>SetTab(5)}>Documents Upload</a>
                          </li>
                          <li className="nav-item">
                          <a className={"nav-link " +  (tab===6? "activepaylink":"inactive") } onClick={()=>SetTab(6)}>Submit KYC</a>
                          </li>
                      </ul>
              </div>

              <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
          <div className="container-fluid">
            <div className="row">
              {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

                  {(tab === 1 &&
                      <ContactInfo />)
                  || (tab === 2 &&
                      <BusinessOverview />)                        
                  ||  (tab === 3 &&
                      <BusinessDetails/>)
                  ||  (tab === 4 &&
                      <BankDetails/>)
                  ||  (tab === 5 &&
                      <DocumentsUpload/>)
                  ||  (tab === 6 &&
                      <SubmitKyc/>)
                  ||
                      <ContactInfo />
                  }
            </div>
          </div></section>
            </div>
          </div>
        </section>
      </div>
      <footer className="ant-layout-footer">
        <div className="gx-layout-footer-content">
          © 2021 Ippopay. All Rights Reserved.{" "}
          <span className="pull-right">
            Ippopay's GST Number : 33AADCF9175D1ZP
          </span>
        </div>
      </footer>
    </main>
  </section>
  )
}

export default KycForm