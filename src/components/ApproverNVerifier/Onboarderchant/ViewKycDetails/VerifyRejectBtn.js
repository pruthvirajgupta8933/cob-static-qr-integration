import React from 'react'
import { roleBasedAccess } from '../../../../_components/reuseable_components/roleBasedAccess'


function VerifyRejectBtn(props) {
  // console.log(props?)
  const roleBasePermissions = roleBasedAccess()
  console.log(roleBasePermissions)
  const isVerified = props?.KycVerifyStatus?.isVerified
  const isRejected = props?.KycVerifyStatus?.isRejected


  // function 

  return (

   <React.Fragment>
          {!props?.KycVerifyStatus?.isVerified ? 
            <button type="button" onClick={()=>props?.KycVerifyStatus?.handleVerifyClick()} class="btn btn-info btn-sm text-white">{props?.btnText?.verify}</button>
          : <></> 
          }

          {!props?.KycRejectStatus?.isRejected ? 
            <button type="button" onClick={()=>props?.KycRejectStatus?.handleRejectClick()} class="btn btn-danger btn-sm text-white">{props?.btnText?.Reject}</button>
          : <></> 
          }
          
   </React.Fragment>
  )
}

export default VerifyRejectBtn