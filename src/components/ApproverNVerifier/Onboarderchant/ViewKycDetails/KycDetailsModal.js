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

const KycDetailsModal = (props) => {
  // console.log(props)

  let closeVerification = props?.handleModal;

  let renderPendingApprovel = props.renderPendingApproval;
  let renderPendingVerificationTable = props?.renderPendingVerification;
  let renderApprovedTable = props?.renderApprovedTable;
  let renderToPendingKyc = props?.renderToPendingKyc;

  let merchantKycId = props?.kycId;
  // console.log(props,'test');

  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  const roles = roleBasedAccess();

  //   console.log(props?.kycId, "Props =======>");

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { kyc } = state;

  const { KycTabStatusStore, KycDocUpload } = kyc;
  // console.log(KycTabStatusStore)
  //------------------------------------------------------------------

  //------------- Kyc  Document List ------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
      )
      // console.log(merchantKycId?.loginMasterId)
      dispatch(
        GetKycTabsStatus({
          login_id: merchantKycId?.loginMasterId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, merchantKycId?.loginMasterId]);

  useEffect(() => {
    if (merchantKycId !== null) {
      const businessType = merchantKycId?.businessType;

      // console.log(busiType,"Business TYPE==========>")
      dispatch(documentsUpload({ businessType })).then((resp) => {
        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        setDocTypeList(data);
      });
    }
  }, [dispatch, merchantKycId?.businessType]);

  //--------------------------------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        businessTypeById({ business_type_id: merchantKycId?.businessType })
      ).then((resp) => {
        setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
      });
    }
  }, [dispatch, merchantKycId?.businessType]);

  useEffect(() => {
    if (merchantKycId !== null) {
      const busnCatId = parseInt(merchantKycId?.businessCategory);
      if (isNumber(busnCatId)) {
        dispatch(
          businessCategoryById({ category_id: merchantKycId?.businessCategory })
        ).then((resp) => {
          // console.log(resp,"response")
          setBusinessCategoryResponse(resp?.payload[0]?.category_name);
        });
      }
    }
  }, [dispatch, merchantKycId?.businessCategory]);


  useEffect(() => {
    setDocList(KycDocUpload)
  }, [KycDocUpload])


  const modalBody = () => {
    return (
      <>
        <div className="container">

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
          <CompleteVerification
            merchantKycId={merchantKycId}
            KycTabStatus={KycTabStatusStore}
            renderApprovalTable={renderPendingApprovel}
            renderPendingVerificationData={renderPendingVerificationTable}
            renderApprovedTable={renderApprovedTable}
            closeVerification={closeVerification}
            renderToPendingKyc={renderToPendingKyc}
          />
        </div>


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
