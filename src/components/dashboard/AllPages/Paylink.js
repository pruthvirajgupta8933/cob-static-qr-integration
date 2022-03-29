import React, { useState,useEffect } from 'react';
import PayerDetails from './createpaymentlink/PayerDetails';
import PaymentLinkDetail from './createpaymentlink/PaymentLinkDetail';
import BulkPayer from './createpaymentlink/BulkPayer';
import Reports from './createpaymentlink/Reports';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function Paylink() {
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
        {/*  <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
                                
                        <div className="container">
                        <h2 style={{marginLeft: 30}}>Create Payment Link</h2>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                            <a className={"nav-link " +  (tab===1? "activepaylink":"inactive") } onClick={()=>SetTab(1)} >Payment Detail</a>
                            </li>
                            <li className="nav-item">
                            <a className={"nav-link " +  (tab===2? "activepaylink":"inactive") } onClick={()=>SetTab(2)} >Payment Link Detail</a>
                            </li>
                            <li className="nav-item">
                            <a className={"nav-link " +  (tab===3? "activepaylink":"inactive") }  onClick={()=>SetTab(3)}>Import Bulk Payer</a>
                            </li>
                            <li className="nav-item">
                            <a className={"nav-link " +  (tab===4? "activepaylink":"inactive") } onClick={()=>SetTab(4)}>Reports</a>
                            </li>
                        </ul>
                        </div>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

                    {(tab === 1 &&
                        <PayerDetails />)
                    || (tab === 2 &&
                        <PaymentLinkDetail />)                        
                   
                    ||  (tab === 3 &&
                        <BulkPayer/>)
                    ||  (tab === 4 &&
                        <Reports/>)
                    ||
                       <PayerDetails />
                    }
                
              </div>
            </div></section>
        </div>
        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
        </footer>
      </main>
    </section>
   

  )
}

export default Paylink;
