import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { completeVerification, completeVerificationRejectKyc } from "../../../../slices/kycOperationSlice"
import { approvekyc, GetKycTabsStatus } from "../../../../slices/kycSlice"
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import VerifyRejectBtn from './VerifyRejectBtn';
import { checkedDocumentReject,kycDocumentUploadList,verifyKycDocumentTab,approveDoc} from '../../../../slices/kycSlice';

const CompleteVerifyAndRejectBtn = (props) => {
    const dispatch = useDispatch();

    const {roles,roleBasePermissions,merchantKycId,documentsIdList,docList,setCheckedClicked} = props;
    console.log("status is ",merchantKycId)
    const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
    const currenTab = parseInt(verifierApproverTab?.currenTab)
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const { loginId } = user;

const newstatus=merchantKycId

  console.log( newstatus,"Doc ")
  

    const [buttonText, setButtonText] = useState("Complete Verify");
    const[buttonClick,setButtonClick]=useState(false)
    const[commetText,setCommetText]=useState()
    const[disable,setDisable]=useState(false)
    const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details
    // console.log(roles)
    console.log(Allow_To_Do_Verify_Kyc_details)
    const getKycDocList = (role) => {
        dispatch(
          kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
    
        );
      };




  

    useEffect(() => {

    
        ////////////////////////////////////////////////////// Button enable for approver
     
      
      // For current tab 5
      
      
        //////////////////////////////////////////////////// for verifier
      
      
      
          
      // console.log("currenTab",currenTab)
      // console.log("isverified",isverified)
      // console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
      // console.log("roles",roles)
          
      
      
          if(currenTab === 3){
            setButtonText("Verify Selected")
            // console.log("The Button Name is verify kyc",buttonText)
          }
          if(currenTab === 4){
            setButtonText("Approve KYC")
            // console.log("The Button Name is Approve kyc",buttonText)
      
          }
      
          //  console.log("Allow_To_Do_Verify_Kyc_details",Allow_To_Do_Verify_Kyc_details)
          //  console.log("isverified",isverified)
      
        }, [roles, Allow_To_Do_Verify_Kyc_details]);


        const rejectDoc = () => {
            const rejectDetails = {
              document_id: documentsIdList,
              rejected_by: loginId,
              comment: commetText === undefined || commetText === "" ? "Document Rejected" : commetText,
            };
            setDisable(true)
            dispatch( checkedDocumentReject(rejectDetails))
              .then((resp) => {
                resp?.payload?.status && toast.success(resp?.payload?.message);
                 setButtonClick(null)
                // setCloseModal(false)
                 setCommetText("")
                 setDisable(false)
                if (typeof resp?.payload?.status === "undefined") {
                  toast.error("Please Try After Sometimes");
                }
        
                getKycDocList(roles);
              })
              .catch((e) => {
                toast.error("Try Again Network Error");
              });
          };



          const verifyApproveDoc = (doc_id, status) => {
            const postData = {
            document_id: documentsIdList,
            verified_by: loginId,
            comment:"Document Verified"
            };

            if ((roles?.verifier || roles?.approver) && currenTab === 3) {
            dispatch(verifyKycDocumentTab(postData)).then((resp) => {
                  if (resp?.payload?.status) {
                    getKycDocList(roles);
                    toast.success(resp?.payload?.message)
                    setCheckedClicked(false)
                  } else {
                    toast.error(resp?.payload?.message)
                   
                  
                  }
        
                })
              }

              if (roles?.approver) {
                const approverDocDetails = {
                  approved_by: loginId,
                  document_id: documentsIdList,
                };
          
                if ((roles?.approver === true && currenTab === 4))
                  if (currenTab === 4) {
                    dispatch(approveDoc(approverDocDetails)).then((resp) => {
                      resp?.payload?.status
                        ? toast.success(resp?.payload?.message)
                        : toast.error(resp?.payload?.message);
          
                      getKycDocList(roles);
                    });
                  }
              }


        
              
        
        
            //   const approverDocDetails = {
            //     approved_by: loginId,
            //     document_id: doc_id,
            //   };
       
                
            //       dispatch(approveDoc(approverDocDetails)).then((resp) => {
            //         resp?.payload?.status
            //           ? toast.success(resp?.payload?.message)
            //           : toast.error(resp?.payload?.message);
        
            //         getKycDocList(role);
            //       });
             
            
        
        
          };

        
          








  return (

<div className="container">
  <div className="row">
    
    <div  className="col-lg-3-">
    <button type="button"
     onClick={() =>  verifyApproveDoc()}
          className="btn btn-info btn-sm text-white">{buttonText}</button>
    
    <button type="button"
    onClick={()=>setButtonClick(true)}
         className="btn btn-danger btn-sm text-white">Reject Selected</button>
    </div>
  </div>
  {buttonClick===true ?
 
 <div style={{float:"left"}}>
 <textarea id="comments" name="reject_commet" placeholder="Reason for rejection" rows="4" cols="40" onChange={(e)=>setCommetText(e.target.value)}>
</textarea>
<div>
<button type="button" 
   onClick={() => rejectDoc()}
   disabled={disable}
   className="btn btn-danger btn-sm text-white">Submit</button></div></div> : <></>}


</div>


  )
}

export default CompleteVerifyAndRejectBtn
