import { useEffect } from "react";
import { kycUserList, verifyKycEachTab } from "../../../../slices/kycSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { rejectKycOperation } from "../../../../slices/kycOperationSlice";
import VerifyRejectBtn from "./VerifyRejectBtn";
import { GetKycTabsStatus, getKycIDList } from "../../../../slices/kycSlice";
import { v4 as uuidv4 } from "uuid";
import { maskedString } from "../../../../utilities/maskedString";
import {
  KYC_STATUS_REJECTED,
  KYC_STATUS_VERIFIED,
} from "../../../../utilities/enums";

function MerchantContactInfo(props) {
  const { KycTabStatus, selectedUserData } = props;
  // const [buttonText, setButtonText] = useState("Save and Next");

  let isVerified =
    KycTabStatus?.general_info_status?.toString()?.toLocaleLowerCase() ===
      KYC_STATUS_VERIFIED?.toString()?.toLocaleLowerCase()
      ? true
      : false;
  let isRejected =
    KycTabStatus?.general_info_status?.toString()?.toLocaleLowerCase() ===
      KYC_STATUS_REJECTED?.toString()?.toLocaleLowerCase()
      ? true
      : false;

  let commentsStatus = KycTabStatus.general_info_reject_comments;

  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state);
  const proofIdList = useSelector((state) => state.kyc.kycIdList);

  const { user } = auth;
  const { loginId } = user;
  useEffect(() => {
    dispatch(getKycIDList());
  }, []);

  const handleVerifyClick = async () => {
    try {
      const verifierDetails = {
        login_id: selectedUserData.loginMasterId,
        general_info_verified_by: loginId,
      };

      const resp = await dispatch(verifyKycEachTab(verifierDetails));

      if (resp?.payload?.general_info_status) {
        toast.success("Verified");
        dispatch(kycUserList({ login_id: selectedUserData.loginMasterId }));
      } else if (resp?.payload?.detail) {
        toast.error(resp.payload.detail);
      }
    } catch (error) {
      toast.error("Try Again Network Error");
    }
  };

  const idProofName = proofIdList.data?.find(
    (item) => item?.id === selectedUserData?.id_proof_type
  );
  const handleRejectClick = async (general_info_reject_comments = "") => {
    const rejectDetails = {
      login_id: selectedUserData.loginMasterId,
      general_info_rejected_by: loginId,
      general_info_reject_comments: general_info_reject_comments,
    };

    if (window.confirm("Reject Merchant Contact Info?")) {
      try {
        const resp = await dispatch(rejectKycOperation(rejectDetails));
        // console.log(resp)
        if (resp?.payload?.general_info_status) {
          toast.success("Rejected");
          dispatch(kycUserList({ login_id: selectedUserData.loginMasterId }));
        } else if (resp?.payload) {
          toast.error(resp.payload);
        }

        dispatch(
          GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })
        ); // Used to remove kyc button because updated in redux store
      } catch (error) {
        toast.error("Try Again Network Error");
      }
    }
  };

  const inputFields = [
    { label: "Contact Person Name", value: selectedUserData?.name },
    {
      label: `ID Proof (${idProofName ? idProofName.id_type : "Aadhaar"})`,
      value: maskedString(selectedUserData?.aadharNumber, 7),
    },
    {
      label: "Contact Number",
      value: selectedUserData?.contactNumber,
      verified: selectedUserData?.isContactNumberVerified,
    },
    {
      label: "Email Id",
      value: selectedUserData?.emailId,
      verified: selectedUserData?.isEmailVerified,
    },
    { label: "Developer Contact", value: selectedUserData?.developer_contact },
    { label: "Developer Name", value: selectedUserData?.developer_name }];

  return (
    <div className="row mb-4 p-1 border">
      <h6 className="">Merchant Contact Info</h6>
      <div className="form-row g-3">
        {inputFields?.map((field) => (
          <div className="col-sm-6 col-md-6 col-lg-6 mb-3" key={uuidv4()}>
            <label className="">{field.label}</label>
            {field.value !== undefined ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  disabled={true}
                  value={field.value}
                />
                <span>
                  {field.verified !== undefined && (
                    <p
                      className={
                        field.verified === 1 ? "text-success" : "text-danger"
                      }
                    >
                      {field.verified === 1 ? "Verified" : "Not Verified"}
                    </p>
                  )}
                </span>
              </>
            ) : (
              <p className="font-weight-bold">Loading...</p>
            )}
          </div>
        ))}
      </div>
      <div className="form-row g-3">
        <div className="col-lg-6 font-weight-bold">
          <p className="m-0">
            Status : <span>{KycTabStatus?.general_info_status}</span>
          </p>
          <p className="m-0">
            Comment : <span>{KycTabStatus?.general_info_reject_comments}</span>
          </p>
        </div>
        <div className="col-lg-6">
          <VerifyRejectBtn
            KycTabStatus={KycTabStatus?.general_info_status}
            KycVerifyStatus={{ handleVerifyClick, isVerified }}
            ContactComments={commentsStatus}
            KycRejectStatus={{ handleRejectClick, isRejected }}
            btnText={{ verify: "Verify", Reject: "Reject" }}
          />
        </div>
      </div>
    </div>
  );
}

export default MerchantContactInfo;
