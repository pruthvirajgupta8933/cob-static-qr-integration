import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import NewRegistraion from './NewRegistraion';
import VerifiedMerchant from './VerifiedMerchant';
import ApprovedMerchant from './ApprovedMerchant';
import NavBar from "../../components/dashboard/NavBar/NavBar"
import PendindKyc from './PendindKyc';
import NotFilledKYC from './NotFilledKYC';
import RejectedKYC from './RejectedKYC';

// import SingleDocument from './SingleDocument';
// import DocumentsUpload from './DocumentsUpload';
// import SubmitKyc from './SubmitKyc';


function Approver() {
    const [tab,SetTab] = useState(1);

    const { auth} = useSelector((state)=>state);
    const {user} = auth;
    let history = useHistory();

    // if(user && user.clientMerchantDetailsList===null){
    //       history.push('/dashboard/profile');
    // } 
     
  if(user.roleId!==3 && user.roleId!==13){
    if(user.clientMerchantDetailsList===null){
      // console.log("paylink");
      history.push('/dashboard/profile');

    }
  } 
    
   

  return (
    <section className="ant-layout">
   <div>
     <NavBar />
   </div>
    <main className="gx-layout-content ant-layout-content">
      <div className="gx-main-content-wrapper">
        <div className="right_layout my_account_wrapper right_side_heading">
          <h1 className="m-b-sm gx-float-left">Merchant List</h1>
        </div>
        <section className="features8 cid-sg6XYTl25a flleft-" id="features08-3-">
          <div className="container-fluid">
            <div className="row bgcolor">
              <div className="col-lg-12 mb-4 bgcolor-">
              <ul className="nav nav-tabs">
              <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===1? "activepaylink":"inactive") } onClick={()=>SetTab(1)} >Not Filled KYC</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===2? "activepaylink":"inactive") } onClick={()=>SetTab(2)} >Pending KYC</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===3? "activepaylink":"inactive") } onClick={()=>SetTab(3)} >Pending Verification</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===4? "activepaylink":"inactive") } onClick={()=>SetTab(4)} >Pending Approval</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===5? "activepaylink":"inactive") }  onClick={()=>SetTab(5)}>Approved</a>
                          </li>
                          <li className="nav-item">
                          <a href={()=>false} className={"nav-link " +  (tab===6? "activepaylink":"inactive") } onClick={()=>SetTab(6)} >Rejected</a>
                          </li>
                      </ul>
              </div>

              <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
          <div className="container-fluid">
            <div className="row">
              {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                lazy dog.The quick brown fox jumps over the lazy dog.</p> */}

                  {(tab === 1 && 
                  <NotFilledKYC />)
                  ||
                  (tab === 2 && 
                  <PendindKyc />)
                  ||
                  (tab === 3 &&
                      <NewRegistraion />)
                  || (tab === 4 &&
                      <VerifiedMerchant />)                        
                  ||  (tab === 5 &&
                      <ApprovedMerchant/>)
                  ||
                  (tab === 6 &&
                    <RejectedKYC />)
                    ||
                      <NewRegistraion />
                  }
            </div>
          </div></section>
            </div>
          </div>
        </section>
      </div>
    </main>
  </section>
  )
}

export default Approver