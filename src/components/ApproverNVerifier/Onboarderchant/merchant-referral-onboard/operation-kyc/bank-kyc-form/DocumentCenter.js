import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveDocumentDetails } from "../../../../../../services/approver-dashboard/merchantReferralOnboard.service";
import { kycDocumentUploadList } from "../../../../../../slices/kycSlice";
import FileUpload from "../../../../../../_components/reuseable_components/react-dropzone/FileUpload";

function DocumentCenter({ setCurrentTab, isEditableInput, editKyc }) {
  const { auth, merchantReferralOnboardReducer, kyc } = useSelector(
    (state) => state
  );
  const merchantLoginId =
    merchantReferralOnboardReducer?.merchantOnboardingProcess?.merchantLoginId;

  const dispatch = useDispatch();
  const { KycDocUpload, kycUserList: kycData } = kyc;

  const fetchDocList = () => {
    dispatch(
      kycDocumentUploadList({
        login_id: kycData?.loginMasterId ?? merchantLoginId,
      })
    );
  };

  useEffect(() => {
    fetchDocList(kycData?.loginMasterId ?? merchantLoginId);
  }, []);

  const handleUpload = async (formData) => {
    formData.append("login_id", kycData?.loginMasterId ?? merchantLoginId);
    formData.append("modified_by", auth?.user?.loginId);
    await saveDocumentDetails(formData);
    fetchDocList(merchantLoginId);
  };
  return (
    <div
      className="tab-pane fade show active"
      id="v-pills-link1"
      role="tabpanel"
      aria-labelledby="v-pills-link1-tab"
    >
      Document center
      <FileUpload
        setCurrentTab={setCurrentTab}
        isEditableInput={isEditableInput}
        editKyc={editKyc}
        docList={KycDocUpload}
        handleUpload={handleUpload}
      />
    </div>
  );
}

export default DocumentCenter;
