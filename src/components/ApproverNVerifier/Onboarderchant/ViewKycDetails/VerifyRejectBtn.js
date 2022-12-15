import React from 'react'

function VerifyRejectBtn(props) {
  return (
   <React.Fragment>
          <button type="button" onClick={()=>props?.handleVerifyClick()} class="btn btn-info btn-sm text-white">{props?.btnText?.verify}</button>
          <button type="button" onClick={()=>props?.handleRejectClick()} class="btn btn-danger btn-sm text-white">{props?.btnText?.Reject}</button>
   </React.Fragment>
  )
}

export default VerifyRejectBtn