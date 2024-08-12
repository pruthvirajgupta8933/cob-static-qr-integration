/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  kycDocumentUploadList,
  documentsUpload,
  GetKycTabsStatus,
  kycUserList,
  clearKycState,
} from "../../../../slices/kycSlice";
import {
  clearRatemapping,
} from "../../../../slices/approver-dashboard/rateMappingSlice";
import {
  convertToFormikSelectJson
} from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import {
  roleBasedAccess
} from "../../../../_components/reuseable_components/roleBasedAccess";
import MerchantContactInfo from "./MerchantContactInfo";
import BusinessOverview from "./BusinessOverview";
import BusinessDetails from "./BusinessDetails";
import BankDetails from "./BankDetails";
import MerchantDocument from "./MerchantDocument";
import CompleteVerification from "./CompleteVerification";
import CustomModal from "../../../../_components/custom_modal";
import GeneralForm from "./GeneralForm";
import SaveLocation from "./SaveLocation";
import ViewZoneModal from "../../ViewZoneModal";
import { DefaultRateMapping } from "../../../../utilities/DefaultRateMapping";
import API_URL, { APP_ENV } from "../../../../config";
import { merchantSubscribedPlanData } from "../../../../slices/merchant-slice/productCatalogueSlice";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";
import SubscribeProductList from "./SubscribeProductList";

const KycDetailsModal = (props) => {
  const {
    handleModal: closeVerification,
    renderPendingApproval,
    renderPendingVerification,
    renderApprovedTable,
    renderToPendingKyc,
    kycId: merchantKycId,
    isOpenModal,
  } = props;

  const [docTypeList, setDocTypeList] = useState([]);
  const [openZoneModal, setOpenModal] = useState(false);
  const [modalDisplayData, setModalDisplayData] = useState({});

  const roles = roleBasedAccess();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { kyc, rateMappingSlice, approverDashboard, verifierApproverTab, productCatalogueSlice } = state;
  const { KycTabStatusStore, KycDocUpload } = kyc;
  const { SubscribedPlanData } = productCatalogueSlice
  const { generalFormData } = approverDashboard;

  const currenTab = parseInt(verifierApproverTab?.currenTab);
  const merchantLoginLogin = useMemo(() => merchantKycId?.loginMasterId, [merchantKycId]);
  const selectedUserData = useMemo(() => kyc.kycUserList, [kyc.kycUserList]);
  const [productData, setProductData] = useState([])

  useEffect(() => {
    if (merchantLoginLogin) {
      dispatch(kycUserList({ login_id: merchantKycId?.loginMasterId }));
    }
  }, [merchantLoginLogin, dispatch]);

  useEffect(async () => {

    // fetch subscribe product by merchant
    if (selectedUserData?.clientCode) {
      const postData = {
        clientCode: selectedUserData?.clientCode
      };
      dispatch(merchantSubscribedPlanData(postData));


      axiosInstanceJWT.get(API_URL.PRODUCT_DETAILS).then(resp => {
        setProductData(resp.data?.ProductDetail)
      })


    }



    if (selectedUserData?.loginMasterId) {
      dispatch(kycDocumentUploadList({ login_id: selectedUserData?.loginMasterId }));
      dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }));

      const businessType = selectedUserData?.businessType;
      if (businessType) {
        dispatch(documentsUpload({ businessType, is_udyam: selectedUserData?.is_udyam })).then((resp) => {
          const data = convertToFormikSelectJson("id", "name", resp?.payload);
          setDocTypeList(data);
        });
      }
    }
  }, [selectedUserData, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearRatemapping());
      dispatch(clearKycState());
    };
  }, [dispatch]);


  // console.log("SubscribedPlanData", SubscribedPlanData)
  const memoSelectedProduct = useMemo(() => SubscribedPlanData?.map(data => data.applicationId), [SubscribedPlanData])

  const memoRestrictRateMapProduct = useMemo(() => {
    return productData?.reduce((prevVal, current, i) => {
      if (current.is_ratemap === false && current.active === true) {
        prevVal.push(current.application_id);
      }
      return prevVal
    }, [])
  }, [productData])

  const memoAllowedRateMapProduct = useMemo(() => {
    return productData?.reduce((prevVal, current, i) => {
      if (current.is_ratemap === true && current.active === true) {
        prevVal.push(current.application_id);
      }
      return prevVal
    }, [])
  }, [productData])




  // restrict rate mapping for the product and user
  let isProductRateMapRestrict = useMemo(() => memoSelectedProduct.some(product => memoRestrictRateMapProduct.includes(product)), [memoSelectedProduct, memoRestrictRateMapProduct])

  let rateMappingAllowedProduct = useMemo(() => memoSelectedProduct.some(product => memoAllowedRateMapProduct.includes(product)), [memoSelectedProduct, memoAllowedRateMapProduct])
  const restrictUsers = [13, 3]
  const isUserRateMapRestrict = restrictUsers.includes(selectedUserData.roleId)

  if (isProductRateMapRestrict) {
    // if product has ratemapping allowed, then update the isProductRateMapRestrict = false / else true
    isProductRateMapRestrict = rateMappingAllowedProduct ? false : true
  }

  // console.log("----------------------------------------------")
  // console.log("memoSelectedProduct", memoSelectedProduct)
  // console.log("rateMappingAllowedProduct", rateMappingAllowedProduct)
  // console.log("memoAllowedRateMapProduct", memoAllowedRateMapProduct)
  // console.log("memoRestrictRateMapProduct", memoRestrictRateMapProduct)
  // console.log("isProductRateMapRestrict", isProductRateMapRestrict)
  // console.log("isUserRateMapRestrict", isUserRateMapRestrict)



  const modalBody = useCallback(() => (
    <>
      {!rateMappingSlice?.flag && (
        <div className="container">
          <MerchantContactInfo
            selectedUserData={selectedUserData}
            KycTabStatus={KycTabStatusStore}
          />
          <BusinessOverview
            selectedUserData={selectedUserData}
            KycTabStatus={KycTabStatusStore}
          />
          <BusinessDetails
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />
          <BankDetails
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />
          <MerchantDocument
            docList={KycDocUpload}
            docTypeList={docTypeList}
            role={roles}
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />

          <SaveLocation role={roles} />

          {(currenTab === 3 || currenTab === 4) && (roles.approver || roles.verifier) && (
            <div className="row mb-4 border p-1">
              <h5>Set Risk Category</h5>
              <div className="form-row g-3 m-1">
                <button
                  type="button"
                  className="approve text-white cob-btn-primary btn-sm"
                  onClick={() => {
                    setModalDisplayData(selectedUserData);
                    setOpenModal(true);
                  }}
                >
                  Set Risk
                </button>
              </div>
              {openZoneModal && (
                <ViewZoneModal
                  userData={modalDisplayData}
                  openZoneModal={openZoneModal}
                  setOpenZoneModal={setOpenModal}
                />
              )}
            </div>
          )}


          <SubscribeProductList SubscribedPlanData={SubscribedPlanData} />
          {/* allow this component for types of user role */}
          {!isProductRateMapRestrict && !isUserRateMapRestrict &&
            <GeneralForm
              selectedUserData={selectedUserData}
              merchantKycId={merchantKycId}
              role={roles}
            />}

          <CompleteVerification
            isRateMappingRestrticted={{ isProductRateMapRestrict, isUserRateMapRestrict }}
            merchantKycId={merchantKycId}
            selectedUserData={selectedUserData}
            KycTabStatus={KycTabStatusStore}
            renderApprovalTable={renderPendingApproval}
            renderPendingVerificationData={renderPendingVerification}
            renderApprovedTable={renderApprovedTable}
            closeVerification={closeVerification}
            renderToPendingKyc={renderToPendingKyc}
          />
        </div>
      )}
      {rateMappingSlice?.flag && rateMappingSlice?.merhcantLoginId && !isProductRateMapRestrict && !isUserRateMapRestrict && APP_ENV && (
        <div className="container">
          <DefaultRateMapping
            merchantLoginId={rateMappingSlice?.merhcantLoginId}
            generalFormData={generalFormData?.parent_client_code}
          />
        </div>
      )}
    </>
  ), [
    rateMappingSlice,
    merchantKycId,
    selectedUserData,
    roles,
    KycTabStatusStore,
    KycDocUpload,
    docTypeList,
    closeVerification,
    renderPendingApproval,
    renderPendingVerification,
    renderApprovedTable,
    renderToPendingKyc,
  ]);

  const modalFooter = useCallback(() => (
    <div>
      <button
        type="button"
        className="btn btn-secondary text-white btn-sm"
        data-dismiss="modal"
        onClick={() => {
          props?.handleModal(false);
        }}
      >
        Close
      </button>
    </div>
  ), [props]);


  return (
    <div>
      <CustomModal
        modalBody={modalBody}
        headerTitle={"Merchant KYC Details"}
        modalFooter={modalFooter}
        modalToggle={isOpenModal}
        fnSetModalToggle={closeVerification}
      />
    </div>
  );
};

export default KycDetailsModal;
