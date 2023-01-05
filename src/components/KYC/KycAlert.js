import { random } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function KycAlert() {

  const kyc = useSelector(state => state.kyc)
  const [kycTabRejectionStatus, setKycTabRejectionStatus] = useState(null)

  const KycTabStatusStore = kyc.KycTabStatusStore

  useEffect(() => {
  
    const statusVal = "Rejected";
    let allStatus = []
    if(KycTabStatusStore?.general_info_status === statusVal){

      allStatus.push({
        "tab":"Merchant Contact Info",
        "comment":KycTabStatusStore?.general_info_reject_comments
      })

    }
    
    if(KycTabStatusStore?.business_info_status === statusVal){
      allStatus.push({
        "tab":"Business Overview",
        "comment":KycTabStatusStore?.business_info_reject_comments
      })
    }

    if(KycTabStatusStore?.merchant_info_status === statusVal){
      allStatus.push({
        "tab":"Business Details",
        "comment":KycTabStatusStore?.merchant_info_reject_comments
      })
    }
    if(KycTabStatusStore?.settlement_info_status === statusVal){
      allStatus.push({
        "tab":"Bank Details",
        "comment":KycTabStatusStore?.settlement_info_reject_comments
      })
    }

    if(KycTabStatusStore?.document_status === statusVal){
      allStatus.push({
        "tab":"KYC Documents",
        "comment":"Your Documents are rejected. Kindly check it."
      })
    }
    setKycTabRejectionStatus(allStatus)
  }, [KycTabStatusStore])
  
  return (
    <div className="alert alert-danger" role="alert">
      <h4 className="alert-heading">KYC Alert!</h4>
      {kycTabRejectionStatus && kycTabRejectionStatus?.map((kycTabStatus,i)=>(
         <p key={i}><span>{kycTabStatus?.tab} : {kycTabStatus?.comment}</span> </p>)
         )}
      <hr />
      <p className="mb-0"><Link className="btn btn-primary" to="dashboard/kyc">Go to KYC the Form</Link></p>
    </div>
  )
}

export default KycAlert