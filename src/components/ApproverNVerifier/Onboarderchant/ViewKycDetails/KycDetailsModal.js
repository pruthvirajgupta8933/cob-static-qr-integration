/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  kycDocumentUploadList,
  businessCategoryById,
  businessTypeById,
  documentsUpload,
  GetKycTabsStatus,
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
  // console.log(props)

  let closeVerification = props?.handleModal;

  let renderPendingApprovel = props.renderPendingApproval;
  let renderPendingVerificationTable = props?.renderPendingVerification;
  let renderApprovedTable = props?.renderApprovedTable;
  let renderToPendingKyc = props?.renderToPendingKyc;

  let merchantKycId = props?.kycId;



  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  const [platform, setPlatform] = useState("");
  const roles = roleBasedAccess();

  //   console.log(props?.kycId, "Props =======>");

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { kyc, rateMappingSlice } = state;

  const { KycTabStatusStore, KycDocUpload } = kyc;
  // console.log(KycTabStatusStore)
  //------------------------------------------------------------------

  //------------- Kyc  Document List ------------//

  useEffect(() => {
    if (merchantKycId !== null && merchantKycId?.loginMasterId !== "") {
      dispatch(
        kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
      )
      // console.log(merchantKycId?.loginMasterId)
      dispatch(
        GetKycTabsStatus({
          login_id: merchantKycId?.loginMasterId,
        })
      );

      
      const businessType = merchantKycId?.businessType;
      if (businessType !== "" && businessType !== null && businessType !== undefined) {
        // console.log(busiType,"Business TYPE==========>")
        dispatch(documentsUpload({ businessType, is_udyam: merchantKycId?.is_udyam })).then((resp) => {
          const data = convertToFormikSelectJson("id", "name", resp?.payload);
          setDocTypeList(data);
        });


        dispatch(
          businessTypeById({ business_type_id: merchantKycId?.businessType })
        ).then((resp) => {
          setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
        });
  

      }


  



      const busnCatId = parseInt(merchantKycId?.businessCategory);
      if (isNumber(busnCatId) && busnCatId !== "" && busnCatId !== null && busnCatId !== undefined) {
        dispatch(
          businessCategoryById({ category_id: merchantKycId?.businessCategory })
        ).then((resp) => {
          // console.log(resp,"response")
          setBusinessCategoryResponse(resp?.payload[0]?.category_name);
        });
      }

      approverDashboardService.getPlatformById(merchantKycId?.platformId).then(resp => {
        setPlatform(resp.data.platformName)
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, merchantKycId]);



  useEffect(() => {
    setDocList(KycDocUpload)
  }, [KycDocUpload])


  useEffect(() => {

    return () => {
      dispatch(clearRatemapping())
    }
  }, [])


  const modalBody = () => {
    return (
      <>
        {/* if rate mapping trigger , hide the all coloum */}
        {!rateMappingSlice?.flag && <div className="container">

          {/* contact info section */}
          <MerchantContactInfo
            merchantKycId={merchantKycId}
            role={roles}
            KycTabStatus={KycTabStatusStore}
          />

          {/* business overview */}
          <BusinessOverview
            businessTypeResponse={businessTypeResponse}
            businessCategoryResponse={businessCategoryResponse}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
            platform={platform}
          />

          {/* business details */}
          <BusinessDetails
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />

          {/* Bank details */}
          <BankDetails
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />

          {/* Merchant Documents */}
          <MerchantDocument
            docList={KycDocUpload}
            setDocList={setDocList}
            docTypeList={docTypeList}
            role={roles}
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
          />

          {/* Extra field required when merhcant goes to approved */}
          <GeneralForm
            merchantKycId={merchantKycId}
            role={roles}

          />

          <CompleteVerification
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
            renderApprovalTable={renderPendingApprovel}
            renderPendingVerificationData={renderPendingVerificationTable}
            renderApprovedTable={renderApprovedTable}
            closeVerification={closeVerification}
            renderToPendingKyc={renderToPendingKyc}
          />
        </div>}

        {/* if ratemapping all parameters full-fill , then call the function of the ratemapping */}
        {(rateMappingSlice?.flag && rateMappingSlice?.merhcantLoginId !== null) && <div className="container">
          <DefaultRateMapping merchantLoginId={rateMappingSlice?.merhcantLoginId} />
        </div>}
      </>
    )


  }

  const modalFooter = () => {
    return (
      <>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary text-white"
            data-dismiss="modal"
            onClick={() => {
              props?.handleModal(false);
            }}
          >
            Close
          </button>

        </div>
      </>
    )
  }


  return (
    <CustomModal modalBody={modalBody} headerTitle={"Merchant KYC Details"} modalFooter={modalFooter} modalToggle={props?.isOpenModal} fnSetModalToggle={props?.handleModal} />
  );
};

export default KycDetailsModal;
