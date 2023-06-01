import React,{useState} from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'
import { useSelector } from "react-redux";


function VerifyRejectBtn(props) {
  // console.log("here pass props",props)
const[buttonClick,setButtonClick]=useState(false)
const[commetText,setCommetText]=useState()

// console.log("This is clicked value",commetText)
  
  const status=props.KycTabStatus;
  const roleBasePermissions = roleBasedAccess()
  const roles = roleBasedAccess();
  const verifierApproverTab =  useSelector((state) => state.verifierApproverTab)
  const currenTab =  parseInt(verifierApproverTab?.currenTab)
  const Allow_To_Do_Verify_Kyc_details= roleBasePermissions?.permission?.Allow_To_Do_Verify_Kyc_details
 
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
// console.log("============start=verify btn each tab-----")
// console.log("KycTabStatus",status)
// console.log("enableDisable",enableDisable)
// console.log("enableBtnStatus",enableBtnStatus)
// console.log("---------end verify btn each tab-----")
  

const handleForReject = ()=>{
 props?.KycRejectStatus?.handleRejectClick(commetText)
  setButtonClick(false)

}
return (
   <React.Fragment>
          { enableDisable && enableBtnStatus  ? 
            <><button type="button" 
            onClick={()=>props?.KycVerifyStatus?.handleVerifyClick()} 
            className="btn btn-info btn-sm text-white m-2">{props?.btnText?.verify}</button>

            <button type="button" 
             onClick={()=>setButtonClick(true)} 
            className="btn btn-danger btn-sm text-white m-2">{props?.btnText?.Reject}</button></>
          : <></> 
          }
          {buttonClick===true ?
          <>
          <label for="comments">Reject Comments</label>

    <textarea id="comments" name="reject_commet" rows="4" cols="40" onChange={(e)=>setCommetText(e.target.value)}>
    </textarea>
        <button type="button" 
            onClick={()=>handleForReject()}
            className="btn btn-danger btn-sm text-white">Submit</button></> : <></>}
   </React.Fragment>
  )
}

export default VerifyRejectBtn