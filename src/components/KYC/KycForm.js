import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BankDetails from "./BankDetails";
import BusinessDetails from "./BusinessDetails";
import BusinessOverview from "./BusinessOverview";
import ContactInfo from "./ContactInfo";
import DocumentsUploadNew from "./DocumentsUploadNew";
import SubmitKyc from "./SubmitKyc"; 
import {
  kycUserList,
  kycDocumentUploadList,
  kycVerificationForTabs,
} from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import NavBar from "../dashboard/NavBar/NavBar";
import RegisteredAddress from "./RegisteredAddress";
import cross from "../../assets/images/Multiply.png" 
import { History } from "history";
function KycForm() {
  
  const dispatch = useDispatch();

  const search = useLocation().search;
  // kycid as login id
  const kycid = new URLSearchParams(search).get('kycid');


  const [tab, SetTab] = useState(1);
  const [title, setTitle] = useState("CONTACT INFO");
  const { auth } = useSelector((state) => state);
  const { user } = auth;

  const { loginId } = user;

  const roles = roleBasedAccess();

  let merchantloginMasterId = loginId

  if(roles.approver || roles.verifier || roles.bank){
     merchantloginMasterId = kycid
  }else if(roles.merchant){
     merchantloginMasterId = loginId
  }








  let history = useHistory();

  const merchantList = user.clientMerchantDetailsList;
  //  console.log(merchantList, "<=====Merchant List =======>")

 

  // console.log(MerchantClietCode, "============>")

  if (user.roleId !== 3 && user.roleId !== 13) {
    if (user.clientMerchantDetailsList === null) {
      history.push("/dashboard/profile");
    }
  }

  //------------------------------------------------------------------

  //------------- Kyc  User List ------------//
  useEffect(() => {
// console.log("kycuserlist")
    dispatch(
      kycUserList({
        login_id: merchantloginMasterId,
      })
    )
  }, [kycUserList ,merchantloginMasterId]);

  //-----------------------------------------//

  //-----------Kyc Document Upload List ------//

  useEffect(() => {
    dispatch(
      kycDocumentUploadList({
        login_id: merchantloginMasterId,
      })
    ).then((res) => {
      // console.log(res)
    });
  }, [kycDocumentUploadList,merchantloginMasterId]);

  //--------------------------------------//

  //API Integrated For Verification Of All Tabs ------------//

  useEffect(() => {
    dispatch(
      kycVerificationForTabs({
        login_id: merchantloginMasterId,
      })
    )
  }, [kycDocumentUploadList,merchantloginMasterId]);

  const redirect = () => {
    history.push("/dashboard");
  };



  return (
    <section className="ant-layout">
    <div><NavBar /></div>
    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content kyc-modal_form">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      <div class="modal-body" style={{display:"contents"}}>
    <div class="card-group">
   
    <div class="row">
    <div class="col-lg-3">
            <div class="card" style={{
                width: "67rem",
                height: "711px",
                marginTop:"0rem",

              }}>
              
              
             
                  <h1
                    className="m-b-sm gx-float-left paymentHeader">
                    KYC Form
                    <span>
                      <h6 class="paymentSubHeader">
                      Complete KYC to start accepting payments
                      </h6>
                    </span>
                  </h1>
                  
                
            

                <div class="card-body">
                  <div>
                    <ul
                      style={{
                        color: "black",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 1 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(1);
                            setTitle("CONTACT INFO");
                          }}
                        >
                          Merchant Contact Info 
                       
                        </a>
                        
                      </li>
                    

                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 2 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(2);
                            setTitle("BUSINESS OVERVIEW");
                          }}
                        >
                          Business Overview 
                        </a>
                      </li>
                    

                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 3 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(3);
                            setTitle("BUSINESS DETAILS");
                          }}
                        >
                          Business Details
                        </a>
                      </li>
                    

                 


                  <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 4 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(4);
                            setTitle("Registered Address");
                          }}
                        >
                          Registered Address
                        </a>
                      </li>
                      

                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 5 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(5);
                            setTitle("BANK DETAILS");
                          }}
                        >
                          Bank Details
                        </a>
                      </li>
                  

                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 6 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(6);
                            setTitle("DOCUMENTS UPLOAD");
                          }}
                        >
                          Upload Document 
                        </a>
                      </li>
                    

                      <li className="nav-item p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 7 ? "activepaylink-kyc text-font" : "inactive text-font")
                          }
                          onClick={() => {
                            SetTab(7);
                            setTitle("SUBMIT KYC");
                          }}
                        >
                          Submit KYC 
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              </div>
        
        
      
      
               <div class="col-lg-9">

            <div
              className="card"
              style={{
                backgroundColor: "#F2F2F2",
                // width: "55rem",
                height: "711px",
                marginTop:"0rem",
                width:"797px",
                boxShadow: '0px 4px 14px 4px rgba(0, 0, 0, 0.25)',
                borderRadius: '0px'

              }}
            >
              <div class="card-body">
                <h1 class="card-title text-kyc-header mb-5">{title}
                <button onClick = {() => redirect()} type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
    
        </button></h1>
               

             
                    
                  {/* role={roles} kycid={kycid} */}
                        {(tab === 1 && <ContactInfo role={roles} kycid={kycid} />) ||
                        (tab === 2 && <BusinessOverview role={roles} kycid={kycid} />) ||
                        (tab === 3 && <BusinessDetails role={roles} kycid={kycid} />) ||
                        (tab === 4 && <RegisteredAddress role={roles} kycid={kycid}  />) ||
                        (tab === 5 && <BankDetails role={roles} kycid={kycid} />) ||
                        (tab === 6 && <DocumentsUploadNew  role={roles} kycid={kycid} />) ||
                        (tab === 7 && <SubmitKyc role={roles} kycid={kycid} />) ||
                         <ContactInfo role={roles}  kycid={kycid} />}
                  </div>
                  
               
              </div>
              </div>
            </div>
            </div>
            </div>
            </div>
  </div>
</div>
          
  
      
    
    </section>
        
    
  );
}

export default KycForm;
