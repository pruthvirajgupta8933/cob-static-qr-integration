import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { rateMappingFn } from '../../utilities/rateMapping';

function ManualRateMapping() {
  const param = useParams();
  const [errorRm, setErrorRm] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [isRateMappingSuccess, setRateMappingSuccess] = useState(false)

  const { loginid } = param

  useEffect(() => {
    // console.log("component Mounted")
    rateMappingFn(loginid).then(
      function (value) {
        // console.log("success-found")
        setRateMappingSuccess(true)
        setErrorRm(false)
  
      },
      function (error) {
        setRateMappingSuccess(false)
        setErrorRm(true)
        setErrorMsg(error?.message)
        console.log("error-found")
      })

    return () => {
      setErrorRm(false)
      setRateMappingSuccess(false)
      setErrorMsg("")
      console.log("component unmounted")
    }
  }, [])
  return (
    <div>
      {isRateMappingSuccess ?  <h5>Rate Mapping Done</h5> : <h5>Rate Mapping in processing ...</h5>}
      {errorRm && <h5 className="text-danger">Error occurred : Please contact with the support team.</h5>}
      {errorRm && <h5 className="text-danger">{errorMsg}</h5>}
    </div>
  )
}

export default ManualRateMapping