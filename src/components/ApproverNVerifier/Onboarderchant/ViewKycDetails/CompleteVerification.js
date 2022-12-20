import React,{useState,useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {completeVerification,completeVerificationRejectKyc} from "../../../../slices/kycOperationSlice"
import {approvekyc} from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import VerifyRejectBtn from './VerifyRejectBtn';


const CompleteVerification = (props) => {
    const KycTabStatus=props.KycTabStatus;
   
     let isapproved= KycTabStatus.is_approved;
     let isverified=KycTabStatus.is_verified
  



  const{merchantKycId}=props;
  const status=merchantKycId?.status
  const dispatch=useDispatch()
  const { auth } = useSelector((state) => state);
 
  const { user } = auth;
  const { loginId } = user;

  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const verifierApproverTab =  useSelector((state) => state.verifierApproverTab)
  const currenTab =  parseInt(verifierApproverTab?.currenTab)

 
  const Allow_To_Do_Verify_Kyc_details= roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  const [buttonText, setButtonText] = useState("Complete Verification");

  const handleVerifyClick= () =>{
    if (roles?.verifier) {
    const veriferDetails = {
      login_id: merchantKycId.loginMasterId,
      verified_by: loginId,
     
    };
    dispatch(completeVerification(veriferDetails))
    .then((resp) => {
      console.log("this one",resp)
        resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload)
      })
      .catch((e) => {
        toast.error("Something went wrong, Please Try Again later")
      });
    }
    if (roles.approver) {
      const dataAppr = {
        login_id: merchantKycId.loginMasterId,
        approved_by: loginId,
      };

      dispatch(approvekyc(dataAppr))
        .then((resp) => {
          resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : toast.error(resp?.payload?.message)
        })
        .catch((e) => {
          toast.error("Something went wrong, Please Try Again later")

        });
    }
    

}

const handleRejectClick = ()=>{
  const rejectDetails = {
    login_id: merchantKycId.loginMasterId,
    rejected_by: loginId,
  };
  dispatch(completeVerificationRejectKyc(rejectDetails))
  .then((resp) => {
    resp?.payload?.status_code === 200 ? toast.success(resp?.payload?.message) : resp?.payload?.detail &&  toast.error(resp?.payload?.detail)
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

////////////////////////////////////////////////////// Button enable for approver
const enableBtnApprover = () => {
    let enableBtn = false;
     if (currenTab===3 || currenTab===4) {
       if (roles.approver===true)
       if ( status === "Verified")
      if(isverified===true && isapproved===false)  {
        enableBtn = true;
        
      }
    }
return enableBtn;
  };
let enableApprover=enableBtnApprover();

//////////////////////////////////////////////////// for verifier

const enableBtn = () => {
    let enableBtn = false;
     if (currenTab===3 || currenTab===4) {
       if (roles.verifier===true || Allow_To_Do_Verify_Kyc_details===true)
       if ( status === "Processing")  {
        enableBtn = true;
        
        }
    }
return enableBtn;
  };
let enableVerifier=enableBtn(); 

useEffect(() => {
  if (roles.approver) {
    setButtonText("Approve Kyc");
  } else if (roles.verifier) {
     setButtonText("Verify Kyc");
  }
}, [roles]);


 
return (
    <div class="row">
       <div class="col-lg-6"></div>
        <div class="col-lg-6">
        { enableVerifier || enableApprover  ? 
            <button type="button" onClick={()=>handleVerifyClick()} class="btn btn-info btn-sm text-white">{buttonText}</button>
          : <></> 
          }

          { enableVerifier || enableApprover ? 
            <button type="button" onClick={()=>handleRejectClick()} class="btn btn-danger btn-sm text-white">Reject</button>
          : <></> 
          }
      
        </div>
    </div>
  )
}

export default CompleteVerification
