import React, { useEffect, useState } from "react";
import BankDetailsOps from "./bank-kyc-form/BankDetailsOps";
import BusinessDetailsOps from "./bank-kyc-form/BusinessDetailsOps";
import DocumentCenter from "./bank-kyc-form/DocumentCenter";
import BasicDetailsOps from "./bank-kyc-form/BasicDetailsOps";
import SubmitKyc from "./bank-kyc-form/SubmitKyc";
import { useDispatch, useSelector } from "react-redux";
import { Prompt } from "react-router-dom";
import {
  clearKycDetailsByMerchantLoginId,
  clearKycState,
  kycDetailsByMerchantLoginId,
  kycUserList,
} from "../../../../../slices/kycSlice";
import {
  resetStateMfo,
  updateOnboardingStatus,
} from "../../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import {
  KYC_STATUS_APPROVED,
  KYC_STATUS_VERIFIED,
} from "../../../../../utilities/enums";
import classes from "./OperationKycModalForOnboard.module.css";
import { stringDec } from "../../../../../utilities/encodeDecode";

function OperationKycModalForOnboard({
  zoneCode,
  bankLoginId,
  heading,
  editKyc,
}) {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(1);
  const { merchantReferralOnboardReducer, kyc } = useSelector((state) => state);
  const { merchantKycData, kycUserList: kycData } = kyc;
  const { merchantOnboardingProcess } = merchantReferralOnboardReducer;

  const searchParams = new URLSearchParams(document.location.search);
  const merchantId = searchParams.get("merchantId");

  const handleTabClick = (currenTabVal) => {
    if (isOnboardStartM) {
      setCurrentTab(currenTabVal);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    if (merchantOnboardingProcess?.merchantLoginId && !kycData?.loginMasterId)
      dispatch(
        kycUserList({
          login_id: merchantOnboardingProcess?.merchantLoginId,
          password_required: true,
        })
      );
  }, []);
  useEffect(() => {
    let merchantLoginId = "";
    if (merchantId && merchantId !== "")
      merchantLoginId = stringDec(merchantId);

    if (merchantLoginId !== "") {
      // console.log("hell2")
      dispatch(
        kycUserList({
          login_id: merchantLoginId,
          password_required: true,
        })
      ).then((resp) => {
        dispatch(
          updateOnboardingStatus({ merchantLoginId, isOnboardStart: true })
        );
      });
    } else {
      setCurrentTab(1);
    }

    return () => {
      dispatch(resetStateMfo());
      dispatch(clearKycState());
      dispatch(clearKycDetailsByMerchantLoginId());
    };
  }, [merchantId]);

  const isOnboardStartM = merchantOnboardingProcess?.isOnboardStart || editKyc;

  const kycStatusArr = [KYC_STATUS_VERIFIED, KYC_STATUS_APPROVED]
    .toString()
    .toLowerCase()
    .split(",");

  const isEditableInput = kycStatusArr.includes(
    merchantKycData?.status?.toString().toLowerCase()
  );
  return (
    <div className="row">
      <Prompt
        message={() => {
          if (window.confirm("Are you sure you want to leave this page?")) {
            dispatch(resetStateMfo());
            dispatch(clearKycDetailsByMerchantLoginId());
            return true;
          } else return false;
        }}
      />
      {(editKyc || merchantOnboardingProcess?.isOnboardStart) && (
        <>
          <div className="bg-light text-danger px-0">
            <h6>
              {" "}
              Note : Once the KYC status is verified or approved, editing the
              merchant information will not be possible until the merchant's KYC
              is rejected.
            </h6>
          </div>
          <div className="d-flex bg-light justify-content-between px-0 my-2">
            <div>
              <p className="p-2 m-0">
                Session Start : {merchantKycData?.name ?? kycData?.name}
              </p>
              <p className="p-2 m-0">
                KYC Status : {merchantKycData?.status ?? kycData?.status}
              </p>
            </div>
            <div>
              <p className="p-2 m-0">
                Merchant Onboard Login ID :{" "}
                {editKyc
                  ? kycData?.loginMasterId
                  : merchantOnboardingProcess?.merchantLoginId}
              </p>
            </div>
          </div>
        </>
      )}
      <div className="col-2 bg-light p-1">
        {/* Tab navs */}
        <div
          className="nav flex-column nav-pills text-start "
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <a
            className={`nav-link cursor_pointer px-2 ${
              currentTab === 1 && "active-secondary"
            }  `}
            onClick={() => handleTabClick(1)}
            id="v-pills-link1-tab"
            data-mdb-toggle="pill"
            href={() => false}
            role="tab"
            aria-controls="v-pills-link1"
            aria-selected="true"
          >
            Basic Details
          </a>
          <a
            className={`nav-link cursor_pointer px-2 ${
              currentTab === 2 && "active-secondary"
            }  ${!isOnboardStartM && classes.not_allowed}`}
            onClick={() => handleTabClick(2)}
            id="v-pills-link2-tab"
            data-mdb-toggle="pill"
            href={() => false}
            role="tab"
            aria-controls="v-pills-link2"
            aria-selected="false"
          >
            Bank Details
          </a>
          <a
            className={`nav-link cursor_pointer px-2 ${
              currentTab === 3 && "active-secondary"
            } ${!isOnboardStartM && classes.not_allowed}`}
            onClick={() => handleTabClick(3)}
            id="v-pills-link3-tab"
            data-mdb-toggle="pill"
            href={() => false}
            role="tab"
            aria-controls="v-pills-link3"
            aria-selected="false"
          >
            Business Details
          </a>
          <a
            className={`nav-link cursor_pointer px-2 ${
              currentTab === 4 && "active-secondary"
            } ${!isOnboardStartM && classes.not_allowed}`}
            onClick={() => handleTabClick(4)}
            id="v-pills-link4-tab"
            data-mdb-toggle="pill"
            href={() => false}
            role="tab"
            aria-controls="v-pills-link4"
            aria-selected="false"
          >
            Document Center
          </a>
          <a
            className={`nav-link cursor_pointer px-2 ${
              currentTab === 5 && "active-secondary"
            } ${!isOnboardStartM && classes.not_allowed}`}
            onClick={() => handleTabClick(5)}
            id="v-pills-link4-tab"
            data-mdb-toggle="pill"
            href={() => false}
            role="tab"
            aria-controls="v-pills-link4"
            aria-selected="false"
          >
            Submit KYC
          </a>
        </div>
        {/* Tab navs */}
      </div>
      <div className="col-8">
        {/* Tab content */}

        <div className="tab-content" id="v-pills-tabContent">
          {currentTab === 1 && (
            <BasicDetailsOps
              setCurrentTab={setCurrentTab}
              isEditableInput={isEditableInput}
              zoneCode={zoneCode}
              bankLoginId={bankLoginId}
              editKyc={editKyc}
            />
          )}
          {currentTab === 2 && (
            <BankDetailsOps
              setCurrentTab={setCurrentTab}
              isEditableInput={isEditableInput}
              editKyc={editKyc}
            />
          )}
          {currentTab === 3 && (
            <BusinessDetailsOps
              setCurrentTab={setCurrentTab}
              isEditableInput={isEditableInput}
              editKyc={editKyc}
            />
          )}
          {currentTab === 4 && (
            <DocumentCenter
              setCurrentTab={setCurrentTab}
              isEditableInput={isEditableInput}
              editKyc={editKyc}
            />
          )}
          {currentTab === 5 && (
            <SubmitKyc
              setCurrentTab={setCurrentTab}
              isEditableInput={isEditableInput}
              editKyc={editKyc}
            />
          )}
        </div>
        {/* Tab content */}
      </div>
    </div>
  );
}

export default OperationKycModalForOnboard;
