import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

function KycAlert() {
  const [kycStatus, setKycStatus] = useState("")

  const kyc = useSelector(state => state.kyc)
  const KycTabStatusStore = kyc.KycTabStatusStore

  console.log(KycTabStatusStore);

  const status = KycTabStatusStore?.status;

  useEffect(() => {
    if (status === "Pending") {
      setKycStatus(status)
    } else if (status === "Verified") {
      setKycStatus(status)
    } else if (status === "Approved") {
      setKycStatus(status)
    } else {
      setKycStatus(status)
    }


  }, [status])




  return (
    <div className="alert alert-warning" role="alert"> Your KYC is {status}</div>

  )
}

export default KycAlert