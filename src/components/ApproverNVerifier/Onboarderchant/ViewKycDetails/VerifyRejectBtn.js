import React from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import { useDispatch, useSelector } from "react-redux";


function VerifyRejectBtn(props) {
  const status=props.KycTabStatus;
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const verifierApproverTab =  useSelector((state) => state.verifierApproverTab)
  const currenTab =  parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details= roleBasePermissions?.permission?.Allow_To_Do_Verify_Kyc_details
  const isVerified = props?.KycVerifyStatus?.isVerified
  const isRejected = props?.KycVerifyStatus?.isRejected

  // function 
  const enableBtn = () => {
    let enableBtn = false;
     if (currenTab===3 || currenTab===4) {
       if (roles.verifier===true || Allow_To_Do_Verify_Kyc_details===true) {
        enableBtn = true;
      }
    }
return enableBtn;
  };
let enableDisable=enableBtn();


const enableBtnByStatus = () => {
  let enableBtn = false;
  if ( status === "Pending" && currenTab===3) {
    enableBtn = true;
}
return enableBtn;
}

let enableBtnStatus = enableBtnByStatus()
console.log("============start=verify btn each tab-----")
console.log("KycTabStatus",status)
console.log("enableDisable",enableDisable)
console.log("enableBtnStatus",enableBtnStatus)
console.log("---------end verify btn each tab-----")
  
return (
   <React.Fragment>
          { enableDisable && enableBtnStatus  ? 
            <button type="button" 
            onClick={()=>props?.KycVerifyStatus?.handleVerifyClick()} 
            class="btn btn-info btn-sm text-white">{props?.btnText?.verify}</button>
          : <></> 
          }

          { enableDisable && enableBtnStatus ? 
            <button type="button" onClick={()=>props?.KycRejectStatus?.handleRejectClick()} class="btn btn-danger btn-sm text-white">{props?.btnText?.Reject}</button>
          : <></> 
          }
          
   </React.Fragment>
  )
}

export default VerifyRejectBtn