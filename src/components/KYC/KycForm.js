import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import BankDetails from "./BankDetails";
import BusinessDetails from "./BusinessDetails";
import BusinessOverview from "./BusinessOverview";
import ContactInfo from "./ContactInfo";
import DocumentsUploadNew from "./DocumentsUploadNew";
import SubmitKyc from "./SubmitKyc";
import {
  kycUserList,
  kycDocumentUploadList,
  GetKycTabsStatus,
} from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import NavBar from "../dashboard/NavBar/NavBar";
import RegisteredAddress from "./RegisteredAddress";
import cross from "../../assets/images/Multiply.png";
import { History } from "history";
function KycForm() {
  const dispatch = useDispatch();

  const search = useLocation().search;
  // kycid as login id
  const kycid = new URLSearchParams(search).get("kycid");

  const [tab, SetTab] = useState(1);
  const [title, setTitle] = useState("CONTACT INFO");
  const [status, setStatus] = useState(false);
  const { auth } = useSelector((state) => state);
  const [kycPopUp,setKycPopUp] = useState(true)
  const { user } = auth;

  const { loginId } = user;

  const roles = roleBasedAccess();

  let merchantloginMasterId = loginId;

  if (roles.approver || roles.verifier || roles.bank) {
    merchantloginMasterId = kycid;
  } else if (roles.merchant) {
    merchantloginMasterId = loginId;
  }

  // const BusinessOverviewStatus = useSelector(
  //   (state) => state.kyc.BusiOverviewwStatus.submitStatus.status
  // );
  const BusinessOverviewStatus = useSelector(
    (state) => state.kyc.allTabsValidate.BusiOverviewwStatus.submitStatus.status
  );

  const BusinessDetailsStatus = useSelector(
    (state) =>
      state.kyc.allTabsValidate.BusinessDetailsStatus.submitStatus.status
  );

  const bankDetails = useSelector(
    (state) => state.kyc.allTabsValidate.BankDetails.submitStatus.status
  );

  const contactInfo = useSelector(
    (state) => state.kyc.allTabsValidate.merchantContactInfo.submitStatus.status
  );

  const uploadDocuments = useSelector(
    (state) => state.kyc.allTabsValidate.UploadDoc.submitStatus.status
  );

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
    );
  }, [kycUserList, merchantloginMasterId]);

  //-----------------------------------------//

  //-----------Kyc Document Upload List ------//

  useEffect(() => {
    dispatch(kycDocumentUploadList({ login_id: merchantloginMasterId })).then(
      (res) => {
        // console.log(res)
      }
    );
  }, [kycDocumentUploadList, merchantloginMasterId]);

  //--------------------------------------//

  //API Integrated For Verification Of All Tabs ------------//

  useEffect(() => {
    dispatch(
      GetKycTabsStatus({
        login_id: merchantloginMasterId,
      })
    );
  }, [kycDocumentUploadList, merchantloginMasterId]);

  const redirect = () => {
    history.push("/dashboard");
  };

  // useEffect(() => {
  //   if(window.location.reload === true) {
  //     console.log("Hello")
  //     redirect()
  //   }
  // },[])

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <div
        className={
          "modal fade mymodals" +
          (kycPopUp === true ? " show d-block" : " d-none")
        }
        tabIndex="-1"
        role="dialog"
        style={{overflow:"scroll"}}
      >
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content kyc-modal_form">
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="modal-body" style={{ display: "contents" }}>
              <div class="card-group Satoshi-Medium">
                <div class="row">
                  <div class="col-lg-3">
                    <div
                      class="card"
                      style={{
                        width: "67rem",
                        height: "711px",
                        marginTop: "0rem",
                      }}
                    >
                      <h1 className="m-b-sm gx-float-left paymentHeader">
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
                            }}
                          >
                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={
                                  tab === 1 ? (
                                    " nav-link activepaylink-kyc text-font"
                                  ) : "inactive text-font" ? (
                                    contactInfo === true ? (
                                      "inactive text-font-ForStatusChange text-success p-3"
                                    ) : (
                                      "nav-link inactive text-font"
                                    )
                                  ) : (
                                    <></>
                                  )
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
                                  tab === 2 ? (
                                    " nav-link activepaylink-kyc text-font"
                                  ) : "inactive text-font" ? (
                                    BusinessOverviewStatus === true ? (
                                      "inactive text-font-ForStatusChange text-success p-3"
                                    ) : (
                                      "nav-link inactive text-font"
                                    )
                                  ) : (
                                    <></>
                                  )
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
                                  tab === 3 ? (
                                    " nav-link activepaylink-kyc text-font"
                                  ) : "inactive text-font" ? (
                                    BusinessDetailsStatus === true ? (
                                      "inactive text-font-ForStatusChange text-success p-3"
                                    ) : (
                                      "nav-link inactive text-font"
                                    )
                                  ) : (
                                    <></>
                                  )
                                }
                                onClick={() => {
                                  SetTab(3);
                                  setTitle("BUSINESS DETAILS");
                                }}
                              >
                                Business Details
                              </a>
                            </li>

                            {/* <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={
                                  "nav-link " +
                                  (tab === 4
                                    ? "activepaylink-kyc text-font"
                                    : "inactive text-font")
                                }
                                onClick={() => {
                                  SetTab(4);
                                  setTitle("Registered Address");
                                }}
                              >
                                Registered Address
                              </a>
                            </li> */}

                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={
                                  tab === 4 ? (
                                    " nav-link activepaylink-kyc text-font"
                                  ) : "inactive text-font" ? (
                                    bankDetails === true ? (
                                      "inactive text-font-ForStatusChange text-success p-3"
                                    ) : (
                                      "nav-link inactive text-font"
                                    )
                                  ) : (
                                    <></>
                                  )
                                }
                                onClick={() => {
                                  SetTab(4);
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
                                  tab === 5 ? (
                                    " nav-link activepaylink-kyc text-font"
                                  ) : "inactive text-font" ? (
                                    uploadDocuments === true ? (
                                      "inactive text-font-ForStatusChange text-success p-3"
                                    ) : (
                                      "nav-link inactive text-font"
                                    )
                                  ) : (
                                    <></>
                                  )
                                }
                                onClick={() => {
                                  SetTab(5);
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
                                  (tab === 6
                                    ? "activepaylink-kyc text-font"
                                    : "inactive text-font")
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

                  <div class="col-lg-9">
                    <div
                      className="card"
                      style={{
                        backgroundColor: "#F2F2F2",
                        // width: "55rem",
                        height: "711px",
                        marginTop: "0rem",
                        width: "797px",
                        boxShadow: "0px 4px 14px 4px rgba(0, 0, 0, 0.25)",
                        borderRadius: "0px",
                        overflowY: "scroll",
                      }}
                    >
                      <div class="card-body">
                        <h1 class="card-title text-kyc-header mb-5">
                          {title}
                          <button
                            onClick={() => redirect()}
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span
                              aria-hidden="true"
                              style={{ fontSize: "38px" }}
                            >
                              &times;
                            </span>
                          </button>
                        </h1>

                        {/* role={roles} kycid={kycid} */}
                        {(tab === 1 && (
                          <ContactInfo
                            role={roles}
                            kycid={kycid}
                            tab={SetTab}
                            title={setTitle}
                          />
                        )) ||
                          (tab === 2 && (
                            <BusinessOverview
                              role={roles}
                              kycid={kycid}
                              tab={SetTab}
                              title={setTitle}
                            />
                          )) ||
                          (tab === 3 && (
                            <BusinessDetails
                              role={roles}
                              kycid={kycid}
                              tab={SetTab}
                              title={setTitle}
                            />
                          )) ||
                          /* (tab === 4 && (
                            <RegisteredAddress
                              role={roles}
                              kycid={kycid}
                              tab={SetTab}
                            />
                          )) || */
                          (tab === 4 && (
                            <BankDetails
                              role={roles}
                              kycid={kycid}
                              tab={SetTab}
                              title={setTitle}
                            />
                          )) ||
                          (tab === 5 && (
                            <DocumentsUploadNew
                              role={roles}
                              kycid={kycid}
                              tab={SetTab}
                              title={setTitle}
                            />
                          )) ||
                          (tab === 6 && (
                            <SubmitKyc role={roles} kycid={kycid} />
                          )) || <ContactInfo role={roles} kycid={kycid} />}
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
