import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  completeVerification,
  completeVerificationRejectKyc
} from "../../../../slices/kycOperationSlice"
import { approvekyc, GetKycTabsStatus, kycUserList } from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import { generalFormData } from '../../../../slices/approver-dashboard/approverDashboardSlice';
import { ratemapping } from '../../../../slices/approver-dashboard/rateMappingSlice';
import toastConfig from '../../../../utilities/toastTypes';
import { KYC_STATUS_PENDING, KYC_STATUS_PROCESSING, KYC_STATUS_VERIFIED } from '../../../../utilities/enums';


const CompleteVerification = (props) => {
  let closeVerificationModal = props?.closeVerification;
  let pendingApporvalTable = props?.renderApprovalTable
  let pendingVerfyTable = props?.renderPendingVerificationData
  let approvedTable = props?.renderApprovedTable
  // let renderToPendingKyc = props?.renderToPendingKyc

  const KycTabStatus = props.KycTabStatus;
  let isapproved = KycTabStatus.is_approved;
  let isverified = KycTabStatus.is_verified

  const { selectedUserData } = props;
  // console.log("props", props)

  const dispatch = useDispatch()
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [enableBtnApprovedTab, setEnableBtnApprovedTab] = useState(false)
  const [disable, setDisable] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const [buttonLoader, setButtonLoader] = useState(false)
  const [commetText, setCommetText] = useState()
  const [buttonText, setButtonText] = useState("Complete Verification");


  const { auth, approverDashboard, kyc, verifierApproverTab } = useSelector((state) => state);
  // const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  // console.log("verifierApproverTab", verifierApproverTab)

  const { user } = auth;
  const { loginId } = user;
  const { approveKyc } = kyc

  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();

  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details



  useEffect(() => {
    dispatch(generalFormData({
      rr_amount: kyc.kycUserList?.rolling_reserve,
      business_cat_type: kyc.kycUserList?.business_category_type,
      refer_by: kyc.kycUserList?.refer_by
    }))

  }, [kyc])


  useEffect(() => {

    if (approveKyc.isApproved && !approveKyc.isError) {
      dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }))
      dispatch(ratemapping({ merchantLoginId: selectedUserData?.loginMasterId }))
      pendingApporvalTable()
    }

    if (approveKyc.isError) {
      toastConfig.errorToast("Something went wrong, Please Try Again later")
    }
  }, [approveKyc])



  const handleVerifyClick = async () => {
    const veriferDetails = {
      login_id: selectedUserData?.loginMasterId,
      verified_by: loginId,
    };
    setButtonLoader(true)

    if (currenTab === 3 && !isverified) {
      if ((roles?.approver && Allow_To_Do_Verify_Kyc_details) || roles?.verifier) {
        if (window.confirm("Verify kyc")) {
          try {
            const resp = await dispatch(completeVerification(veriferDetails));

            if (resp?.payload?.status_code === 200) {
              toast.success(resp.payload.message);
              dispatch(kycUserList({ login_id: selectedUserData?.loginMasterId }));
              dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }));
              pendingVerfyTable();
              closeVerificationModal(false);
              setButtonLoader(false)
            } else {
              toast.error(resp?.payload);
              setButtonLoader(false)
            }

            setDisable(false);
          } catch (error) {
            setDisable(false);
            setButtonLoader(false)
            toast.error("Something went wrong, Please Try Again later");
          }
        }
      }
    }





    if (currenTab === 4) {
      setButtonLoader(true)
      if (isverified === true && isapproved === false) {
        if (roles?.approver === true) {
          if (window.confirm("Approve kyc")) {
            // dataAppr = [...dataAppr]


            let dataAppr = {
              login_id: selectedUserData.loginMasterId,
              approved_by: loginId,
              rolling_reserve: parseFloat(approverDashboard?.generalFormData?.rr_amount),
              refer_by: approverDashboard?.generalFormData?.refer_by,
              business_category_type: approverDashboard?.generalFormData?.business_cat_type,
              rolling_reserve_type: approverDashboard?.generalFormData?.rolling_reserve_type

            };
            // console.log("dataAppr",dataAppr)

            // update the redux state - for the ratemapping

            GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId })
            dispatch(approvekyc(dataAppr))
              .then((resp) => {

                // resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
                // dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }))
                // dispatch(ratemapping({merchantLoginId : selectedUserData?.loginMasterId}))
                // pendingApporvalTable()
                // closeVerificationModal(false)
                setButtonLoader(false)
              })
              .catch((e) => {
                setButtonLoader(false)
                toast.error("Something went wrong, Please Try Again later")

              });
          }

        }
      }
    }

  }

  const handleRejectClick = async (commetText) => {
    const rejectDetails = {
      login_id: selectedUserData.loginMasterId,
      rejected_by: loginId,
      comments: commetText,
    };
    setButtonLoader(true)

    if (window.confirm("Reject kyc")) {
      try {
        const resp = await dispatch(completeVerificationRejectKyc(rejectDetails));

        if (resp?.payload?.status_code === 200) {
          toast.success(resp.payload.message);
          dispatch(GetKycTabsStatus({ login_id: selectedUserData?.loginMasterId }));
          dispatch(kycUserList({ login_id: selectedUserData?.loginMasterId }));
          setButtonClick(false);
          setCommetText("");
          setButtonLoader(false)

          if (currenTab === 4) {

            pendingApporvalTable();

          } else if (currenTab === 3) {
            pendingVerfyTable();
          } else if (currenTab === 5) {
            approvedTable();
          }

          closeVerificationModal(false)
        } else {
          setButtonLoader(false)
          toast.error(resp?.payload);
        }
      } catch (error) {
        setButtonLoader(false)
        toast.error("Something went wrong, Please Try Again later");
      }
    }
  };


  useEffect(() => {
    //  Button enable for approver
    const approver = () => {
      let enableBtn = false;
      if (currenTab === 4) {
        if (roles.approver === true)
          if (isverified === true && isapproved === false) {
            enableBtn = true;

          }
      }
      setEnableBtnApprover(enableBtn);
    };

    // For current tab 5
    const approvedtab = () => {
      let enableBtn = false;
      if (currenTab === 5) {
        if (roles.approver === true)
          if (Allow_To_Do_Verify_Kyc_details === true) {
            enableBtn = true;

          }
      }
      setEnableBtnApprovedTab(enableBtn);
    };


    //////////////////////////////////////////////////// for verifier

    const verifier = () => {
      let enableBtn = false;
      if (currenTab === 3) {
        if (isverified === false) {
          if (Allow_To_Do_Verify_Kyc_details === true || roles.verifier) {
            enableBtn = true;
          }
        }
      }

      setEnableBtnVerifier(enableBtn);
    };
    approver();
    verifier();
    approvedtab();




    if (currenTab === 3) {
      setButtonText("Verify KYC")
      // console.log("The Button Name is verify kyc",buttonText)
    }
    if (currenTab === 4) {
      setButtonText("Approve KYC")
      // console.log("The Button Name is Approve kyc",buttonText)

    }



    //  console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
    //  console.log("isverified",isverified)
    // return () => {
    //   setTriggerRateMapping(false)
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, isverified, Allow_To_Do_Verify_Kyc_details]);





  // console.log("---------start final btn-----")
  //    console.log("currenTab",currenTab)
  //    console.log("roles",roles)
  //    console.log("isverified",isverified)
  //    console.log("isapproved",isapproved)
  //    console.log("enableBtnVerifier",enableBtnVerifier)
  //    console.log("enableBtnApprover",enableBtnApprover)
  //    console.log("The button name show is here",buttonText)
  // console.log("---------end final btn-----")

  // console.log("KycTabStatus", KycTabStatus.status)


  return (
    <div className="row">

      <label className="font-weight-bold col-lg-12">Comments : <span>{KycTabStatus?.comments}</span></label>
      <div className="col-lg-12">
        {(enableBtnVerifier || enableBtnApprover) && (KycTabStatus.status === KYC_STATUS_PENDING || KycTabStatus.status === KYC_STATUS_PROCESSING || KycTabStatus.status === KYC_STATUS_VERIFIED) ?
          <><button type="button" disabled={disable} onClick={() => {
            handleVerifyClick()
          }} className="btn  cob-btn-primary  btn-sm text-white m-2">  {buttonLoader && <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
          </>} {buttonText}</button>

            <button type="button" onClick={() => setButtonClick(true)} className="btn btn-danger btn-sm text-white m-2">Reject KYC</button></>
          : enableBtnApprovedTab === true ? <button type="button"
            onClick={() => setButtonClick(true)} className="btn btn-danger btn-sm text-white m-2">Reject KYC</button> : <> </> // Reject kyc for currentab 4(Approved) 
        }
      </div>

      <div className="col-lg-12">
        {buttonClick === true ?
          <>
            <label for="comments col-lg-12">Reject Comments</label>
            <textarea id="comments" className="col-lg-12" name="reject_commet" rows="4" cols="40" onChange={(e) => setCommetText(e.target.value)}>
            </textarea>
            <button type="button"
              onClick={() => handleRejectClick(commetText)}
              className="btn btn-danger btn-sm text-white pull-left m-2"> {buttonLoader && <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                <span className="sr-only">Loading...</span>
              </>} Submit</button></> : <></>}
      </div>
    </div>
  )
}

export default CompleteVerification
