/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  kycDocumentUploadList,
  businessCategoryById,
  businessTypeById,
  documentsUpload,
  GetKycTabsStatus,
  kycUserList,
  clearKycState,
} from "../../../../slices/kycSlice";
import { useDispatch, useSelector } from "react-redux";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import MerchantContactInfo from "./MerchantContactInfo";
import BusinessOverview from "./BusinessOverview";
import BusinessDetails from "./BusinessDetails";
import BankDetails from "./BankDetails";
import MerchantDocument from "./MerchantDocument";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import CompleteVerification from "./CompleteVerification";
import { isNumber } from "lodash";
import CustomModal from "../../../../_components/custom_modal";
import GeneralForm from "./GeneralForm";
import approverDashboardService from "../../../../services/approver-dashboard/approverDashboard.service";
import { DefaultRateMapping } from "../../../../utilities/DefaultRateMapping";
import { clearRatemapping } from "../../../../slices/approver-dashboard/rateMappingSlice";



const KycDetailsModal = (props) => {
  // console.log("render")

  let closeVerification = props?.handleModal;
  let renderPendingApprovel = props.renderPendingApproval;
  let renderPendingVerificationTable = props?.renderPendingVerification;
  let renderApprovedTable = props?.renderApprovedTable;
  let renderToPendingKyc = props?.renderToPendingKyc;

  // console.log(props?.kycId)
  let merchantKycId = props?.kycId;



  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  const [platform, setPlatform] = useState("");
  const roles = roleBasedAccess();
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { kyc, rateMappingSlice, approverDashboard } = state;
  const { KycTabStatusStore, KycDocUpload } = kyc;
  const { generalFormData } = approverDashboard

  // const selectedUserData = kyc.kycUserList


  const merchantLoginLogin = useMemo(() => merchantKycId?.loginMasterId, [merchantKycId])
  const selectedUserData = useMemo(() => kyc.kycUserList, [kyc.kycUserList])
  // console.log("selectedUserData", selectedUserData)
  // 10974
  useEffect(() => {
    if (merchantLoginLogin !== null && merchantLoginLogin !== "") {
      dispatch(kycUserList({ login_id: merchantKycId?.loginMasterId }))
    }
  }, [merchantLoginLogin])


  useEffect(() => {
    if (selectedUserData !== null && selectedUserData?.loginMasterId !== "") {
      dispatch(
        kycDocumentUploadList({ login_id: selectedUserData?.loginMasterId })
      )
      // console.log(merchantKycId?.loginMasterId)
      dispatch(
        GetKycTabsStatus({
          login_id: selectedUserData?.loginMasterId,
        })
      );


      const businessType = selectedUserData?.businessType;
      if (businessType !== "" && businessType !== null && businessType !== undefined) {
        // console.log(busiType,"Business TYPE==========>")
        dispatch(documentsUpload({ businessType, is_udyam: selectedUserData?.is_udyam })).then((resp) => {
          const data = convertToFormikSelectJson("id", "name", resp?.payload);
          setDocTypeList(data);
        });


        dispatch(
          businessTypeById({ business_type_id: selectedUserData?.businessType })
        ).then((resp) => {
          setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
        });


      }

      const busnCatId = parseInt(selectedUserData?.businessCategory);
      if (isNumber(busnCatId) && busnCatId !== "" && busnCatId !== null && busnCatId !== undefined) {
        dispatch(
          businessCategoryById({ category_id: selectedUserData?.businessCategory })
        ).then((resp) => {
          // console.log(resp,"response")
          setBusinessCategoryResponse(resp?.payload[0]?.category_name);
        });
      }

      // console.log("selectedUserData?.platformId", selectedUserData?.platformId)

      selectedUserData?.platformId && approverDashboardService.getPlatformById(selectedUserData?.platformId).then(resp => {
        setPlatform(resp.data.platformName)
      })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedUserData]);



  useEffect(() => {
    setDocList(KycDocUpload)
  }, [KycDocUpload])


  useEffect(() => {

    return () => {
      dispatch(clearRatemapping())
      dispatch(clearKycState())
    }
  }, [])

  const modalBody = useCallback(() => {
    return (
      <>
        {/* if rate mapping trigger , hide the all coloum */}
        {!rateMappingSlice?.flag && <div className="container">

          {/* contact info section */}
          <MerchantContactInfo
            merchantKycId={merchantKycId}
            selectedUserData={selectedUserData}
            role={roles}
            KycTabStatus={KycTabStatusStore}
          />

          {/* business overview */}
          <BusinessOverview
            businessTypeResponse={businessTypeResponse}
            selectedUserData={selectedUserData}
            businessCategoryResponse={businessCategoryResponse}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
            platform={platform}
          />

          {/* business details */}
          <BusinessDetails
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />

          {/* Bank details */}
          <BankDetails
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />
          {/* Merchant Documents */}
          <MerchantDocument
            docList={KycDocUpload}
            setDocList={setDocList}
            docTypeList={docTypeList}
            role={roles}
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />



          {/* Extra field required when merhcant goes to approved */}
          <GeneralForm
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            role={roles}

          />

          <CompleteVerification
            merchantKycId={merchantKycId}
            selectedUserData={selectedUserData}
            KycTabStatus={KycTabStatusStore}
            renderApprovalTable={renderPendingApprovel}
            renderPendingVerificationData={renderPendingVerificationTable}
            renderApprovedTable={renderApprovedTable}
            closeVerification={closeVerification}
            renderToPendingKyc={renderToPendingKyc}
          />
        </div>}

        {/* if ratemapping all parameters full-fill , then call the function of the ratemapping */}
        {/* {console.log("generalFormData?.parent_client_code", generalFormData?.parent_client_code)} */}
        {(rateMappingSlice?.flag && rateMappingSlice?.merhcantLoginId !== null) &&
          <div className="container">
            <DefaultRateMapping merchantLoginId={rateMappingSlice?.merhcantLoginId} generalFormData={generalFormData?.parent_client_code} />
          </div>}
      </>
    )
  }, [rateMappingSlice, merchantKycId, selectedUserData, roles, KycTabStatusStore, businessTypeResponse, businessCategoryResponse, platform, KycDocUpload, setDocList, docTypeList])

  const modalFooter = useCallback(() => {
    return (
      <div className="modal-footer">
        <button
          type="button" className="btn btn-secondary text-white" data-dismiss="modal"
          onClick={() => {
            props?.handleModal(false);
          }}>
          Close
        </button>
      </div>
    )
  },
    [props]
  )



  return (
    <CustomModal modalBody={modalBody} headerTitle={"Merchant KYC Details"} modalFooter={modalFooter} modalToggle={props?.isOpenModal} fnSetModalToggle={props?.handleModal} />
  );
};

export default KycDetailsModal;
