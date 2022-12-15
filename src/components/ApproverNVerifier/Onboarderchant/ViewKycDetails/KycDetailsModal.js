import React, { useState, useEffect } from "react";
import {
  kycDocumentUploadList,
  businessCategoryById,
  businessTypeById,
  documentsUpload
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



const KycDetailsModal = (props) => {
  let merchantKycId = props?.kycId;
  
  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);
  const roles = roleBasedAccess();

  //   console.log(props?.kycId, "Props =======>");

  const dispatch = useDispatch();

  const state = useSelector((state) => state)

  console.log(state)
  //------------------------------------------------------------------

  //------------- Kyc  Document List ------------//



  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
      ).then((resp) => {
        //    console.log(resp?.payload,"Responseee")
        setDocList(resp?.payload);
      });
    }
  }, [merchantKycId?.loginMasterId]);


  useEffect(() => {
    if (merchantKycId !== null) {

      const businessType = merchantKycId?.businessType

      // console.log(busiType,"Business TYPE==========>")
      dispatch(documentsUpload({ businessType }))
        .then((resp) => {
          const data = convertToFormikSelectJson("id", "name", resp?.payload);
          setDocTypeList(data);
        })
    }
  }, [merchantKycId?.businessType]);

  //--------------------------------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        businessTypeById({ business_type_id: merchantKycId?.businessType })
      ).then((resp) => {

        setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
      });
    }
  }, [merchantKycId?.businessType]);

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        businessCategoryById({ category_id: merchantKycId?.businessCategory })
      ).then((resp) => {
        // console.log(resp,"response")
        setBusinessCategoryResponse(resp?.payload[0]?.category_name);
      });
    }
  }, [merchantKycId?.businessCategory]);



  const getDocTypeName = (id) => {
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };

  const stringManulate = (str) => {
    let str1 = str.substring(0, 15)
    return `${str1}...`

  }


  return (
    <div
      class="modal fade"
      id="kycmodaldetail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ overflow: "scroll" }}
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title font-weight-bold" id="kycmodaldetail">
              Merchant KYC Details
            </h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>

          </div>

          <div className="modal-body">
            <div className="container">
              {/* contact info section */}
              
              <MerchantContactInfo merchantKycId={merchantKycId} role={roles}/>

             {/* business overview */}
              <BusinessOverview 
              businessTypeResponse={businessTypeResponse} 
              businessCategoryResponse={businessCategoryResponse}  
              merchantKycId={ merchantKycId} />
            

              {/* business details */}
              <BusinessDetails merchantKycId={merchantKycId} />
            

              {/* Bank details */}
              <BankDetails merchantKycId={merchantKycId}/>
            

              {/* Merchant Documents */}
              <MerchantDocument docList={docList} docTypeList={docTypeList} role={roles}  merchantKycId={merchantKycId} />

            </div>
            <CompleteVerification merchantKycId={merchantKycId}/>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary text-white"
              data-dismiss="modal"
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
