import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BankDetails from "./BankDetails";
import BusinessDetails from "./BusinessDetails";
import BusinessOverview from "./BusinessOverview";
import ContactInfo from "./ContactInfo";
import DocumentsUpload from "./DocumentsUpload";
import DocumentsUploadNew from "./DocumentsUploadNew";
import SubmitKyc from "./SubmitKyc"; 
import {
  kycUserList,
  kycDocumentUploadList,
  kycVerificationForTabs,
} from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import NavBar from "../dashboard/NavBar/NavBar";

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

  const MerchantClietCode = merchantList.map((merchants) => {
    return merchants.clientCode;
  });

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

  // const handleSubmit = (e) => {
  //   console.log("Login Id ============>");
  // };

  return (
    <section className="ant-layout">
    <div><NavBar /></div>
    <div class="card-group" style={{ height: "100%" }}>
        <div class="row">
          <div class="col-sm-4">
            <div class="card" style={{ height: "100%" }}>
              <div className="gx-main-content-wrapper">
                <div className="right_layout my_account_wrapper right_side_heading">
                  <h1
                    className="m-b-sm gx-float-left font-weight-bold"
                    style={{ color: "#0C090A" }}
                  >
                    KYC Form
                    <span>
                      <h6 class="font-weight-bold">
                        Complete the KYC to onboard Merchant. 
                      </h6>
                    </span>
                  </h1>
                </div>
                <br />
                <br />
                <br />
                <br />

                <div class="card-body">
                  <div>
                    <ul
                      style={{
                        color: "#4BB543",
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 1 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(1);
                            setTitle("CONTACT INFO");
                          }}
                        >
                          Merchant Contact Info
                        </a>
                      </li>
                    

                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 2 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(2);
                            setTitle("BUISINESS OVERVIEW");
                          }}
                        >
                          Business Overview 
                        </a>
                      </li>
                    

                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 3 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(3);
                            setTitle("BUSINESS DETAILS");
                          }}
                        >
                          Business Details
                        </a>
                      </li>
                    

                      {/* <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 4 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(4);
                            setTitle("REGISTERED ADDRESS");
                          }}
                        >
                          Registered Address
                        </a>
                      </li> */}
                      

                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 4 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(4);
                            setTitle("BANK DETAILS");
                          }}
                        >
                          Bank Details
                        </a>
                      </li>
                  

                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 5 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(5);
                            setTitle("DOCUMENTS UPLOAD");
                          }}
                        >
                          Upload Document 
                        </a>
                      </li>
                    

                      <li className="nav-item font-weight-bold p-2">
                        <a
                          href={() => false}
                          className={
                            "nav-link " +
                            (tab === 6 ? "activepaylink-kyc" : "inactive")
                          }
                          onClick={() => {
                            SetTab(6);
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
          </div>


             
          <div class="col-sm-7 col-lg-7">
            <div
              className="card"
              style={{
                backgroundColor: "#F2F2F2",
                height: "100%",
              }}
            >
              <div class="card-body">
                <h1 class="card-title font-weight-bold">{title}</h1>

                <div className="container-fluid">
                  <div className="row">
                  {(tab === 1 && <ContactInfo role={roles} kycid={kycid} />) ||
                        (tab === 2 && <BusinessOverview role={roles} kycid={kycid} />) ||
                        (tab === 3 && <BusinessDetails role={roles} kycid={kycid} />) ||
                        (tab === 4 && <BankDetails role={roles} kycid={kycid} />) ||
                        (tab === 5 && <DocumentsUpload  role={roles} kycid={kycid} />) ||
                        (tab === 6 && <SubmitKyc role={roles} kycid={kycid} />) ||
                         <ContactInfo role={roles}  kycid={kycid} />}
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
