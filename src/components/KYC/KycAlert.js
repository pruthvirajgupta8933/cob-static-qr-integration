import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function KycAlert() {

  const kyc = useSelector(state => state.kyc)
  // console.log("kyc",kyc)
  const [kycTabRejectionStatus, setKycTabRejectionStatus] = useState(null)

  const KycTabStatusStore = kyc.KycTabStatusStore
  // console.log("KycTabStatusStore")
  // console.log(KycTabStatusStore,"KycTabStatusStore")

  useEffect(() => {

    const statusVal = "Rejected";
    let allStatus = []
    // console.log("alert KycTabStatusStore",KycTabStatusStore)
    if (KycTabStatusStore?.general_info_status === statusVal) {

      allStatus.push({
        "tab": "Merchant Contact Info",
        "comment": KycTabStatusStore?.general_info_reject_comments
      })

    }

    if (KycTabStatusStore?.business_info_status === statusVal) {
      allStatus.push({
        "tab": "Business Overview",
        "comment": KycTabStatusStore?.business_info_reject_comments
      })
    }

    if (KycTabStatusStore?.merchant_info_status === statusVal) {
      allStatus.push({
        "tab": "Business Details",
        "comment": KycTabStatusStore?.merchant_info_reject_comments
      })
    }
    if (KycTabStatusStore?.settlement_info_status === statusVal) {
      allStatus.push({
        "tab": "Bank Details",
        "comment": KycTabStatusStore?.settlement_info_reject_comments
      })
    }

    if (KycTabStatusStore?.document_status === statusVal) {
      allStatus.push({
        "tab": "KYC Documents",
        "comment": "Your Documents are rejected. Kindly check it."
      })
    }

    if (KycTabStatusStore?.status === statusVal) {
      allStatus.push({
        "tab": "Reason Of Rejection",
        "comment": KycTabStatusStore?.comments
      })
    }
    setKycTabRejectionStatus(allStatus)
  }, [KycTabStatusStore])

  // console.log("kycTabRejectionStatus",kycTabRejectionStatus)
  return (
    kycTabRejectionStatus?.length > 0 &&
    <div className="alert alert-danger NunitoSans-Regular" role="alert" >
      <h4 className="alert-heading" data-tip="Kindly Update your KYC">KYC Alert!</h4>
      {kycTabRejectionStatus && kycTabRejectionStatus?.map((kycTabStatus, i) => (
        <p key={i}><span>{kycTabStatus?.tab} : {kycTabStatus?.comment}</span> </p>)
      )}
      <hr />
      <Link className="submit-btn btnbackground btn-primary  text-white" to="dashboard/kyc">Go to KYC the Form</Link>
    </div>

  )
}

export default KycAlert