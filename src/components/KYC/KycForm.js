import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import BankDetails from "./BankDetails";
import BusinessDetails from "./BusinessDetails";
import BusinessOverview from "./BusinessOverview";
import ContactInfo from "./ContactInfo";
import DocumentsUploadNew from "./DocumentsUploadNew";
import SubmitKyc from "./SubmitKyc";
import {
  kycUserList, kycDocumentUploadList, GetKycTabsStatus} from "../../slices/kycSlice";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import NavBar from "../dashboard/NavBar/NavBar";

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

    if (tabStatus  && merchantConsent === false && isLastAction) {
      return <i class={`fa kyc-form-status-icon fa-exclamation`} aria-hidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_REJECTED) {
      return <i class={`fa kyc-form-status-icon fa-exclamation`} aria-hidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_PENDING || tabStatus === KYC_STATUS_PROCESSING) {
      return <i class={`fa kyc-form-status-icon fa-check`} aria-hidden="true"></i>
    }
    if (tabStatus === KYC_STATUS_VERIFIED || tabStatus === KYC_STATUS_APPROVED) {
      return <i class={`fa kyc-form-status-icon fa-check-square-o`} aria-hidden="true"></i>
    }

  }

  const kycTabColorClassByStatus = (tabStatus, merchantConsent) => {
    if (merchantConsent === false) {
      return "kyc_active_tab_warning"
    } else if (tabStatus === KYC_STATUS_REJECTED) {
      return "kyc_active_tab_error"
    } else if (tabStatus === KYC_STATUS_VERIFIED  || tabStatus === KYC_STATUS_APPROVED) {
      return "kyc_active_tab_success"
    } else {
      return "kyc_active_tab_default"
    }
  }


  return (
    <section className="ant-layout NunitoSans-Regular">
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
              <div className="card-group NunitoSans-Regular">
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
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex ${tab === 1 ? kycTabColorClassByStatus(KycTabStatusStore?.general_info_status) : `inactive`}`}
                                onClick={() => {
                                  SetTab(1);
                                  setTitle("CONTACT INFO");
                                }}
                              >
                                {/* kyc status icon as per the status */}
                                {kycStatusIcon(KycTabStatusStore?.general_info_status)}
                                Merchant Contact Info
                              </a>
                            </li>

                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex 
                                  ${tab === 2 ? kycTabColorClassByStatus(KycTabStatusStore?.business_info_status) : `inactive`}`}
                                onClick={() => {
                                  SetTab(2);
                                  setTitle("BUSINESS OVERVIEW");
                                }}
                              >
                                {kycStatusIcon(KycTabStatusStore?.business_info_status)}
                                Business Overview
                              </a>
                            </li>

                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex ${tab === 3 ? kycTabColorClassByStatus(KycTabStatusStore?.merchant_info_status) : `inactive`}`}
                                onClick={() => {
                                  SetTab(3);
                                  setTitle("BUSINESS DETAILS");
                                }}
                              >
                                {/* kyc status icon as per the status */}
                                {kycStatusIcon(KycTabStatusStore?.merchant_info_status)}
                                Business Details
                              </a>
                            </li>
                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex ${tab === 4 ? kycTabColorClassByStatus(KycTabStatusStore?.settlement_info_status) : `inactive`}`}
                                onClick={() => {
                                  SetTab(4);
                                  setTitle("BANK DETAILS");
                                }}
                              >
                                {/* kyc status icon as per the status */}
                                {kycStatusIcon(KycTabStatusStore?.settlement_info_status)}
                                Bank Details
                              </a>
                            </li>

                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex ${tab === 5 ? kycTabColorClassByStatus(KycTabStatusStore?.document_status) : `inactive`}`}
                                onClick={() => {
                                  SetTab(5);
                                  setTitle("DOCUMENTS UPLOAD");
                                }}
                              >
                                {/* kyc status icon as per the status */}
                                {kycStatusIcon(KycTabStatusStore?.document_status)}
                                Upload Document
                              </a>
                            </li>

                            <li className="nav-item p-2">
                              <a
                                href={() => false}
                                className={`nav-link text-font text-font-ForStatusChange p-2 d-flex ${tab === 6 ? kycTabColorClassByStatus(KycTabStatusStore?.status, merchant_consent?.term_condition) : `inactive`}`}
                                onClick={() => {
                                  SetTab(6);
                                  setTitle("SUBMIT KYC");
                                }}
                              >
                                {/* warning icon required/  */}
                                {kycStatusIcon(KycTabStatusStore?.status, tab, merchant_consent?.term_condition, true)}
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
                            <span aria-hidden="true">
                              &times;
                            </span>
                          </button>
                        </h1>

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
