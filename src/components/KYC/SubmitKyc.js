
import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { approvekyc, verifyComplete } from '../../slices/kycSlice';

function SubmitKyc(props) {

  const { role, kycid } = props;

  const [check,setCheck] = useState(false);

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth);
  const { loginId } = user;



  const verifyApprove = (val) => {

    if(val==="verify") {

      const data = {
        "login_id": kycid,
        "verified_by": loginId
    }

    dispatch(verifyComplete(data)).then((resp) => {
      resp?.payload?.status_code===401 || resp?.payload?.status_code===404 ? toast.error(resp?.payload?.message) : toast.success(resp?.payload?.message);
    }).catch((e) => {console.log(e)})
    

    }

    if(val==="approve"){

      const dataAppr = {
        "login_id": kycid,
        "approved_by": loginId
    }

    dispatch(approvekyc(dataAppr)).then((resp) => {
      resp?.payload?.status_code===401 || resp?.payload?.status_code===404 ? toast.error(resp?.payload?.message) : toast.success(resp?.payload?.message);
    }).catch((e) => {console.log(e)})

    }

  }
  
  return (
    <div className="col-md-12 col-md-offset-4">   
    {role.merchant ? <form>
    <div className="form-row" >
      <p class="font-weight-bold" style={{"max-width": "900px"}}>
      <input class="form-check-input" type="checkbox" value={check} id="flexCheckDefault" />
       By accepting this Agreement, through one of the following means: (i) executing the Order Form that references this Agreement; or (ii) paying the Fees set out in the relevant Order Form, the Customer agrees to the terms of this Agreement.</p>
    </div>
    <div className="form-row"  class="font-weight-bold mt-xl-4" style={{"max-width": "900px"}} >
      <p>1.2  If the individual accepting this Agreement is accepting on behalf of a company or other legal entity, such individual represents that they have the authority to bind such entity and its Affiliates to these terms and conditions, in which case 
      the term “Customer” shall refer to such entity and its Affiliates. If the individual accepting this Agreement does not have such authority, or does not agree with these terms and conditions, such individual must not accept this Agreement and may not
      use the Solution or the Services.</p>
    </div>
    <button type="button" className="btn btn-primary">Submit KYC</button>
  </form> 
  :  role.verifer ?
  
  <div className="row">

  <div className="col-lg-12">
  <p>After Verify all the tab's , Kindly click on the <strong> complete verify</strong> button </p></div>
    
  <div className="col-lg-12">
  
  <button type="button" className="btn btn-sm btn-primary" onClick={()=>{verifyApprove("verify")}}>Verify Complete</button></div>

  
  </div> 
  :  role.approver ? 
  
  <div className="row">

<div className="col-lg-12">
<p>After Verify all the tab's , Kindly click on the <strong> Approve KYC</strong> button </p></div>
  
<div className="col-lg-12">

<button type="button" className="btn btn-sm btn-primary" onClick={()=>{verifyApprove("approve")}}>Approve KYC</button></div>


</div>  

: <></> 
  
  }
    
  </div>
  )
}

export default SubmitKyc