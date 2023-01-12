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

const KycDetailsModal = (props) => {
  let closeVerification = props?.handleModal;

  let renderPendingApprovel = props.renderPendingApproval;
  let renderPendingVerificationTable = props?.renderPendingVerification;

  let merchantKycId = props?.kycId;

  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  const roles = roleBasedAccess();

  //   console.log(props?.kycId, "Props =======>");

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const { kyc } = state;

  const { KycTabStatusStore } = kyc;
  // console.log(KycTabStatusStore)
  //------------------------------------------------------------------

  //------------- Kyc  Document List ------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
      ).then((resp) => {
        setDocList(resp?.payload);
      })
      // console.log(merchantKycId?.loginMasterId)
      dispatch(
        GetKycTabsStatus({
          login_id: merchantKycId?.loginMasterId,
        })
      );
    }
  }, [dispatch,merchantKycId?.loginMasterId]);

  useEffect(() => {
    if (merchantKycId !== null) {
      const businessType = merchantKycId?.businessType;

      // console.log(busiType,"Business TYPE==========>")
      dispatch(documentsUpload({ businessType })).then((resp) => {
        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        setDocTypeList(data);
      });
    }
  }, [dispatch,merchantKycId?.businessType]);

  //--------------------------------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        businessTypeById({ business_type_id: merchantKycId?.businessType })
      ).then((resp) => {
        setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
      });
    }
  }, [dispatch,merchantKycId?.businessType]);

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
  }, [dispatch,merchantKycId?.businessCategory]);



  return (
    <div
      tabIndex="-1"
      role="dialog"
      className={
        "modal fade mymodals" +
        (props?.isOpenModal ? " show d-block" : " d-none")
      }
      aria-hidden="true"
      style={{ overflow: "scroll" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title font-weight-bold" id="kycmodaldetail">
              Merchant KYC Details
            </h3>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                props?.handleModal(false);
              }}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
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
                docList={docList}
                docTypeList={docTypeList}
                role={roles}
                merchantKycId={merchantKycId}
                KycTabStatus={KycTabStatusStore}
              />
            </div>
            <CompleteVerification
              merchantKycId={merchantKycId}
              KycTabStatus={KycTabStatusStore}
              renderApprovalTable={renderPendingApprovel}
              renderPendingVerificationData={renderPendingVerificationTable}
              closeVerification={closeVerification}
            />
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
