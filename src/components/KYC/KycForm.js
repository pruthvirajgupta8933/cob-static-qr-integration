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
import { isUndefined } from "lodash";

function KycForm() {
  const dispatch = useDispatch();

  const search = useLocation().search;

  // kycid as login id
  const kycid = new URLSearchParams(search).get("kycid");
  const [tab, SetTab] = useState(1);
  const [title, setTitle] = useState("CONTACT INFO");

  const [kycPopUp, setKycPopUp] = useState(true);

  const { auth, kyc } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;
  const roles = roleBasedAccess();

  let merchantloginMasterId = loginId;
  if (roles.approver || roles.verifier || roles.bank) {
    merchantloginMasterId = kycid;
  } else if (roles.merchant) {
    merchantloginMasterId = loginId;
  }

  const { allTabsValidate, KycTabStatusStore } = kyc;
  const merchant_consent = kyc?.kycUserList?.merchant_consent;
  const BusinessOverviewStatus =
    allTabsValidate?.BusiOverviewwStatus?.submitStatus?.status;
  const BusinessDetailsStatus =
    allTabsValidate?.BusinessDetailsStatus?.submitStatus?.status;
  const bankDetails = allTabsValidate?.BankDetails?.submitStatus?.status;
  const contactInfo =
    allTabsValidate?.merchantContactInfo?.submitStatus?.status;
  const uploadDocuments = allTabsValidate?.UploadDoc?.submitStatus?.status;


  let history = useHistory();

  //------------- Kyc  User List ------------//
  useEffect(() => {
    dispatch(kycUserList({ login_id: merchantloginMasterId }));
  }, [merchantloginMasterId]);

  //-----------Kyc Document Upload List ------//
  useEffect(() => {
    dispatch(kycDocumentUploadList({ login_id: merchantloginMasterId }));
  }, [merchantloginMasterId]);

  //--------------------------------------//

  //API Integrated For Verification Of All Tabs ------------//

  useEffect(() => {
    dispatch(
      GetKycTabsStatus({
        login_id: merchantloginMasterId,
      })
    );
  }, [merchantloginMasterId]);

  const redirect = () => {
    history.push("/dashboard");
  };

  let IsGeneralInfoTabFilled,
    isBusinessInfoStatus,
    IsDocumentTabFilled,
    IsMerchantInfoFilled,
    IsSettlementInfoFilled = false;
  // let IsDocumentTabFilled = false

  // Now Check the tab status / accordingly change the UI

  if (
    contactInfo === true ||
    (KycTabStatusStore?.general_info_status !== "Not-Filled" &&
      !isUndefined(KycTabStatusStore?.general_info_status))
  ) {
    IsGeneralInfoTabFilled = true;
  }

  if (
    BusinessOverviewStatus === true ||
    (KycTabStatusStore?.business_info_status !== "Not-Filled" &&
      !isUndefined(KycTabStatusStore?.business_info_status))
  ) {
    isBusinessInfoStatus = true;
  }

  if (
    BusinessDetailsStatus === true ||
    (KycTabStatusStore?.merchant_info_status !== "Not-Filled" &&
      !isUndefined(KycTabStatusStore?.merchant_info_status))
  ) {
    IsMerchantInfoFilled = true;
  }


  if(
    bankDetails === true ||
    (KycTabStatusStore?.settlement_info_status!=="Not-Filled" &&
    !isUndefined(KycTabStatusStore?.settlement_info_status))){
      IsSettlementInfoFilled = true
        }

  if (
    uploadDocuments === true ||
    (KycTabStatusStore?.document_status !== "Not-Submitted" &&
      !isUndefined(KycTabStatusStore?.document_status))
  ) {
    IsDocumentTabFilled = true;
  }

  // console.log({IsGeneralInfoTabFilled,
  //   isBusinessInfoStatus,
  //   IsDocumentTabFilled,
  //   IsMerchantInfoFilled,
  //   IsSettlementInfoFilled})

  return (
    <section className="ant-layout Satoshi-Medium">
      <div>
        <NavBar />
      </div>
      <div
        className={
          "modal fade mymodals" +
          (kycPopUp === true ? " show d-block" : " d-none")
        }
        role="dialog"
        style={{ overflow: "scroll" }}
      >
        <div
          className="modal-dialog modal-dialog-center container- ml-280-"
          role="document"
        >
          <div className="modal-content kyc-modal_form ">
            <div className="modal-body" style={{ display: "contents" }}>
              <div className="card-group Satoshi-Medium">
                <div className="row kycnomar kycnopad">
                  <div className="col-lg-3 col-xsm-12 col-sm-12 col-md-12 kycnomar kycnopad">
                    <div className="card kycnomar kycnopad toppad noborder">
                      <h1 className="m-b-sm gx-float-left paymentHeader text-left">
                        KYC Form
                        <span>
                          <h6 className="paymentSubHeader mr-2 mt-2">
                            Complete KYC to start accepting payments
                          </h6>
                        </span>
                      </h1>

                      <div className="card-body">
                        <div>
                          <ul>
                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={
                                  tab === 1 ? (
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    IsGeneralInfoTabFilled ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
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
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    isBusinessInfoStatus ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
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
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    IsMerchantInfoFilled ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
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
                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={
                                  tab === 4 ? (
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    IsSettlementInfoFilled ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
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
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    IsDocumentTabFilled ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
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
                                  tab === 6 ? (
                                    " nav-link activepaylink-kyc text-font d-flex"
                                  ) : "inactive text-font d-flex" ? (
                                    uploadDocuments === true ||
                                    merchant_consent?.term_condition ===
                                      true ? (
                                      "inactive text-font-ForStatusChange text-success p-2 d-flex"
                                    ) : (
                                      "nav-link inactive text-font d-flex"
                                    )
                                  ) : (
                                    <></>
                                  )
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

                  <div className="col-lg-9 col-xsm-12 col-sm-12 col-md-12 kycnopad">
                    <div className="card cardsection">
                      <div className="card-body">
                        <h1 className="card-title text-kyc-header mb-2 NunitoSans-Regular">
                          {title}
                          <button
                            onClick={() => redirect()}
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                          >
                            <span
                              aria-hidden="true"
                              // style={{ fontSize: "38px" }}
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
