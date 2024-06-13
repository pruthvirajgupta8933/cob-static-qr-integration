/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  kycDocumentUploadList,
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
// import { isNumber } from "lodash";
import CustomModal from "../../../../_components/custom_modal";
import GeneralForm from "./GeneralForm";
// import approverDashboardService from "../../../../services/approver-dashboard/approverDashboard.service";
import { DefaultRateMapping } from "../../../../utilities/DefaultRateMapping";
import { clearRatemapping } from "../../../../slices/approver-dashboard/rateMappingSlice";
import { APP_ENV } from "../../../../config";
import SaveLocation from "./SaveLocation";
import ViewZoneModal from "../../ViewZoneModal";



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
  const [openZoneModal, setOpenModal] = useState(false);
  const [modalDisplayData, setModalDisplayData] = useState({});
  // const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  // const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  // const [platform, setPlatform] = useState("");
  const roles = roleBasedAccess();
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { kyc, rateMappingSlice, approverDashboard, verifierApproverTab } = state;
  const { KycTabStatusStore, KycDocUpload } = kyc;
  const { generalFormData } = approverDashboard

  const currenTab = parseInt(verifierApproverTab?.currenTab)

  const merchantLoginLogin = useMemo(() => merchantKycId?.loginMasterId, [merchantKycId])
  const selectedUserData = useMemo(() => kyc.kycUserList, [kyc.kycUserList])
  // console.log("selectedUserData", selectedUserData)
  // 10974
  useEffect(() => {
    if (merchantLoginLogin !== null && merchantLoginLogin !== undefined && merchantLoginLogin !== "") {
      dispatch(kycUserList({ login_id: merchantKycId?.loginMasterId }))
    }
  }, [merchantLoginLogin])


  useEffect(() => {
    if (selectedUserData?.loginMasterId !== undefined && selectedUserData?.loginMasterId !== "") {
      dispatch(
        kycDocumentUploadList({ login_id: selectedUserData?.loginMasterId })
      )
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

      }



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
            selectedUserData={selectedUserData}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
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

          <SaveLocation
            role={roles}
          />

          <div className="row mb-4 border p-1">
            <h5>Set Risk Category</h5>
            <div className="form-row g-3">
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


            {openZoneModal === true && (
              <ViewZoneModal userData={modalDisplayData} openZoneModal={openZoneModal}
                setOpenZoneModal={setOpenModal} />
            )}

          </div>

          {/* Extra field required when merhcant goes to approved */}


          {selectedUserData?.roleId !== 13 &&
            <GeneralForm
              selectedUserData={selectedUserData}
              merchantKycId={merchantKycId}
              role={roles}
            />}

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
        {/* {console.log(APP_ENV)} */}
        {(rateMappingSlice?.flag && rateMappingSlice?.merhcantLoginId !== null && selectedUserData?.roleId !== 13 && APP_ENV === true) &&
          <div className="container">
            <DefaultRateMapping merchantLoginId={rateMappingSlice?.merhcantLoginId} generalFormData={generalFormData?.parent_client_code} />
          </div>}
      </>
    )
  }, [rateMappingSlice, merchantKycId, selectedUserData, roles, KycTabStatusStore, KycDocUpload, setDocList, docTypeList])

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
