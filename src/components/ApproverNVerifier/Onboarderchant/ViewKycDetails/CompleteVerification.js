import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { completeVerification, completeVerificationRejectKyc } from "../../../../slices/kycOperationSlice"
import { approvekyc, GetKycTabsStatus } from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import VerifyRejectBtn from './VerifyRejectBtn';


const CompleteVerification = (props) => {
  
let closeVerificationModal=props?.closeVerification;
  

  let pendingApporvalTable = props?.renderApprovalTable
  let pendingVerfyTable = props?.renderPendingVerificationData

  const KycTabStatus = props.KycTabStatus;
  let isapproved = KycTabStatus.is_approved;
  let isverified = KycTabStatus.is_verified
  // console.log("",pendingVerfyTable)
  const { merchantKycId } = props;
  const status = merchantKycId?.status

  const dispatch = useDispatch()
  const [enableBtnApprover, setEnableBtnApprover] = useState(false)
  const [enableBtnVerifier, setEnableBtnVerifier] = useState(false)
  const [disable, setDisable] = useState(false)

  const { auth } = useSelector((state) => state);

  const { user } = auth;
  const { loginId } = user;

  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details
  const [buttonText, setButtonText] = useState("Complete Verification");
  const handleVerifyClick = () => {

    const veriferDetails = {
      login_id: merchantKycId?.loginMasterId,
      verified_by: loginId,

    };
    setDisable(true)

    if (currenTab === 3) {
      if (isverified === false) {
        if ((roles?.approver === true && Allow_To_Do_Verify_Kyc_details === true) || roles?.verifier === true) {
          dispatch(completeVerification(veriferDetails))
            .then((resp) => {
              
              resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload)
              if(resp?.payload?.status_code === 200){
                dispatch(GetKycTabsStatus({login_id: merchantKycId?.loginMasterId}))
                pendingVerfyTable()
                closeVerificationModal(false)

              }
              setDisable(false)
              
            })
            .catch((e) => {
              setDisable(false)
              toast.error("Something went wrong, Please Try Again later")
            });

        }
      }
    }


    const dataAppr = {
      login_id: merchantKycId.loginMasterId,
      approved_by: loginId,
    };



    if (currenTab === 4) {
      if (isverified === true && isapproved === false) {
        if (roles?.approver === true) {
          dispatch(approvekyc(dataAppr))
            .then((resp) => {
              resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
              dispatch(GetKycTabsStatus({login_id: merchantKycId?.loginMasterId}))
              pendingApporvalTable()
              closeVerificationModal(false)
            })
            .catch((e) => {
              toast.error("Something went wrong, Please Try Again later")

            });

        }
      }
    }

  }

  const handleRejectClick = () => {
    const rejectDetails = {
      login_id: merchantKycId.loginMasterId,
      rejected_by: loginId,
    };
    dispatch(completeVerificationRejectKyc(rejectDetails))
      .then((resp) => {
        resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : resp?.payload?.detail && toast.error(resp?.payload?.detail)
        dispatch(GetKycTabsStatus({login_id: merchantKycId?.loginMasterId}))
        return currenTab === 4 ? pendingApporvalTable() : currenTab === 3 ? pendingVerfyTable() : <></>
      })
      .catch((e) => {
        toast.error("Something went wrong, Please Try Again later")
      });

     
  
    // .then((resp) => {
    //   resp?.payload?.message &&
    //     toast.success(resp?.payload?.message);
    //   resp?.payload?.detail && toast.error(resp?.payload?.detail);
    // })
    // .catch((e) => {
    //   toast.error("Try Again Network Error");
    // });

  }



  useEffect(() => {

    
  ////////////////////////////////////////////////////// Button enable for approver
  const approver = () => {
    let enableBtn = false;
    if (currenTab === 4) {
      if (roles.approver === true)
        //  if ( status === "Verified")
        if (isverified === true && isapproved === false) {
          enableBtn = true;

        }
    }
     setEnableBtnApprover(enableBtn);
  };


  //////////////////////////////////////////////////// for verifier

  const verifier = () => {
    let enableBtn = false;
    if (currenTab === 3) {
      if (isverified === false){
      if ( Allow_To_Do_Verify_Kyc_details === true || roles.verifier) {
        enableBtn = true;
      }
    }
    }

    setEnableBtnVerifier(enableBtn);
  };
  approver();
  verifier();

    
// console.log("currenTab",currenTab)
// console.log("isverified",isverified)
// console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
// console.log("roles",roles)
    


    if(currenTab === 3){
      setButtonText("Verify KYC")
      // console.log("The Button Name is verify kyc",buttonText)
    }
    if(currenTab === 4){
      setButtonText("Approve KYC")
      // console.log("The Button Name is Approve kyc",buttonText)

    }

    //  console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
    //  console.log("isverified",isverified)

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
    

  return (
    <div className="row">
      <div className="col-lg-6"></div>
      <div className="col-lg-6">
        {enableBtnVerifier || enableBtnApprover ?
          <><button type="button"  disabled={disable} onClick={() => {handleVerifyClick()
          }} className="btn btn-info btn-sm text-white">{buttonText}</button>


          <button type="button" onClick={() => handleRejectClick()} className="btn btn-danger btn-sm text-white">Reject KYC</button></>
          : <></>
        }


      </div>
    </div>
  )
}

export default CompleteVerification
