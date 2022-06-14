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
</div>
<main className="gx-layout-content ant-layout-content">
  <div className="gx-main-content-wrapper">
    <div className="right_layout my_account_wrapper right_side_heading">
      <h1 className="m-b-sm gx-float-left">Create Payment Link</h1>
    </div>
    <section className="features8 cid-sg6XYTl25a flleft w-100" id="features08-3-">
      <div className="container-fluid">
        <div className="row">
        <div className="col-lg-12 mb-4 bgcolor-">
                <ul className="nav nav-tabs">
                    <li className="nav-item" onClick={()=>SetTab(1)}>
                      <a className={"nav-link " +  (tab===1? "activepaylink":"inactive") }  >Payment Detail</a>
                    </li>
                    <li className="nav-item" onClick={()=>SetTab(2)} >
                      <a className={"nav-link " +  (tab===2? "activepaylink":"inactive") } >Payment Link Detail</a>
                    </li>
                    <li className="nav-item"  onClick={()=>SetTab(3)}>
                      <a className={"nav-link " +  (tab===3? "activepaylink":"inactive") } >Import Bulk Payer</a>
                    </li>
                    <li className="nav-item" onClick={()=>SetTab(4)}>
                      <a className={"nav-link " +  (tab===4? "activepaylink":"inactive") } >Reports</a>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </section>

    <React.Fragment>
    {   (tab === 1 &&
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
    </React.Fragment>
  </div>

</main>
</section>
  )
}

export default Paylink;
