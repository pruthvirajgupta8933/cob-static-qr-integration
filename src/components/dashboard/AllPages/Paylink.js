import React, { useState } from 'react';
import PayerDetails from './createpaymentlink/PayerDetails';
import PaymentLinkDetail from './createpaymentlink/PaymentLinkDetail';
import BulkPayer from './createpaymentlink/BulkPayer';
import Reports from './createpaymentlink/Reports';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function Paylink() {
    const [tab,SetTab] = useState(1);

    const {auth} = useSelector((state)=>state);
    const {user} = auth;
    let history = useHistory();

  
if(user.roleId!==3 && user.roleId!==13){
    if(user.clientMerchantDetailsList===null){
      // console.log("paylink");
      history.push('/dashboard/profile');

    }
  } 
    
   
  return (
<section className="">
<main className="">
  <div className="">
    <div className="">
      <h5 className="">Create Payment Link</h5>
    </div>
    <section className="">
      <div className="container-fluid">
        <div className="row">
        <div className="col-lg-12 mb-4 pl-0">
                <ul className="nav nav-tabs pl-3 pt-1">
                    <li className="nav-item" onClick={()=>SetTab(1)}>
                      <a href={()=>false} id="navpad" className={"nav-link btn rounded-0 " +  (tab===1? "active":"inactive") }  >Payment Detail</a>
                    </li>
                    <li className="nav-item" onClick={()=>SetTab(2)} >
                      <a href={()=>false} id="navpad" className={"nav-link btn rounded-0 " +  (tab===2? "active":"inactive") } >Payment Link Detail</a>
                    </li>
                    <li className="nav-item" onClick={()=>SetTab(4)}>
                      <a href={()=>false} id="navpad" className={"nav-link btn rounded-0 " +  (tab===4? "active":"inactive") } >Reports</a>
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
