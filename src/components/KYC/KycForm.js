import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory, useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import BankDetails from "./BankDetails";
import BusinessDetails from "./BusinessDetails";
import BusinessOverview from "./BusinessOverview";
import ContactInfo from "./ContactInfo";
import DocumentsUploadNew from "./DocumentsUploadNew";
import SubmitKyc from "./SubmitKyc";
import {
  kycUserList, kycDocumentUploadList, GetKycTabsStatus
} from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import classes from "./kycForm.module.css"
// import NavBar from "../dashboard/NavBar/NavBar";

import { KYC_STATUS_APPROVED, KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_REJECTED, KYC_STATUS_VERIFIED } from "../../utilities/enums";

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

  const { KycTabStatusStore } = kyc;

  const merchant_consent = kyc?.kycUserList?.merchant_consent;


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
    dispatch(GetKycTabsStatus({ login_id: merchantloginMasterId }));
  }, [merchantloginMasterId]);

  const redirect = () => {
    history.push("/dashboard");
  };


  const kycStatusIcon = (tabStatus, currentTab, merchantConsent, isLastAction = false) => {
    // console.log("tabStatus",tabStatus)
    if (tabStatus && merchantConsent === false && isLastAction) {
      return <i className={`fa kyc-form-status-icon fa-exclamation`} ariaHidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_REJECTED) {
      return <i className={`fa kyc-form-status-icon fa-exclamation`} ariaHidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_PENDING || tabStatus === KYC_STATUS_PROCESSING) {
      return <i className={`fa kyc-form-status-icon fa-check`} ariaHidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_VERIFIED || tabStatus === KYC_STATUS_APPROVED) {
      return <i className={`fa kyc-form-status-icon fa-check-square-o`} ariaHidden="true"></i>
    }

  }

  const kycTabColorClassByStatus = (tabStatus, merchantConsent) => {
    // console.log("tabStatus",tabStatus)
    if (merchantConsent === false) {
      return "kyc_active_tab_warning"
    } else if (tabStatus === KYC_STATUS_REJECTED) {
      return "kyc_active_tab_error"
    } else if (tabStatus === KYC_STATUS_VERIFIED || tabStatus === KYC_STATUS_APPROVED) {
      return "kyc_active_tab_success"
    } else {
      return "kyc_active_tab_default"
    }
  }

  // console.log("KycTabStatusStore?.document_status",KycTabStatusStore?.document_status)

  return (
    <section className="ant-layout NunitoSans-Regular">
      <div
        className={
          "pt-5 modal fade mymodals" +
          (kycPopUp === true ? " show d-block" : " d-none")
        }
        style={{ overflow: "scroll" }}
      >
        <div className="modal-dialog modal-dialog-center modal-lg">
          <div className="modal-content kyc-modal_form rounded-0">
            <div className="modal-header py-1">

              <div>
                <h5 className="font-weight-bold mb-0"> KYC Form</h5>
                <p className="paymentSubHeader m-0 border-bottom">
                  Complete KYC to start accepting payments
                </p>
              </div>

              <button type="button" onClick={() => redirect()} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-0">
              <div className="d-lg-flex align-items-start">
                <div className={`${classes.kyc_tab_nav} nav flex-column nav-pills`} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${classes.kyc_tab_link} ${tab === 1 ? kycTabColorClassByStatus(KycTabStatusStore?.general_info_status) : 'inactive'}`} type="button" role="tab" onClick={() => {
                    SetTab(1);
                    setTitle("CONTACT INFO");
                  }} >{kycStatusIcon(KycTabStatusStore?.general_info_status)}
                    Merchant Contact Info</a>

                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${classes.kyc_tab_link} ${tab === 2 ? kycTabColorClassByStatus(KycTabStatusStore?.business_info_status) : 'inactive'}`} type="button" onClick={() => {
                    SetTab(2);
                    setTitle("BUSINESS OVERVIEW");
                  }}>{kycStatusIcon(KycTabStatusStore?.business_info_status)}
                    Business Overview</a>

                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${classes.kyc_tab_link}  ${tab === 3 ? kycTabColorClassByStatus(KycTabStatusStore?.merchant_info_status) : 'inactive'}`} type="button" onClick={() => {
                    SetTab(3);
                    setTitle("BUSINESS DETAILS");
                  }}> {kycStatusIcon(KycTabStatusStore?.merchant_info_status)}
                    Business Details</a>

                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0  ${classes.kyc_tab_link} ${tab === 4 ? kycTabColorClassByStatus(KycTabStatusStore?.settlement_info_status) : 'inactive'}`} type="button" onClick={() => {
                    SetTab(4);
                    setTitle("BANK DETAILS");
                  }}>  {kycStatusIcon(KycTabStatusStore?.settlement_info_status)}
                    Bank Details</a>

                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0  ${classes.kyc_tab_link}  ${tab === 5 ? kycTabColorClassByStatus(KycTabStatusStore?.document_status) : 'inactive'}`} type="button" onClick={() => {
                    SetTab(5);
                    setTitle("DOCUMENTS UPLOAD");
                  }} >
                    {kycStatusIcon(KycTabStatusStore?.document_status)}
                    Upload Document</a>

                  <a href={false} className={`nav-link text-font-ForStatusChange rounded-0  ${classes.kyc_tab_link} ${tab === 6 ? kycTabColorClassByStatus(KycTabStatusStore?.status) : 'inactive'}`} type="button" onClick={() => {
                    SetTab(6);
                    setTitle("SUBMIT KYC");
                  }}>
                    {/* warning icon required/  */}
                    {kycStatusIcon(KycTabStatusStore?.status, tab, merchant_consent?.term_condition, true)}
                    Submit KYC</a>

                </div>

                <div className="tab-content w-100 overflow-auto" id="v-pills-tabContent">
                  <div className="card m-0 p-0">
                    <div className="card-body">
                      <h6 className="mb-3 font-weight-bold">{title}</h6>
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
                            tabValue={tab}
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
    </section>
  );
}

export default KycForm;
