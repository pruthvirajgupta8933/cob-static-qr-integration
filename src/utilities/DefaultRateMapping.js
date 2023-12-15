import React, { useState, useEffect } from "react"
import { rateMappingFn } from "./rateMapping"
import { useDispatch } from "react-redux"
import { clearApproveKyc } from "../slices/kycSlice"
import { generalFormData } from "../slices/approver-dashboard/approverDashboardSlice"



// rateMappingFn


// console.log("uperr trigger")
export const DefaultRateMapping = (props) => {
    const { setFlag, merchantLoginId } = props
    // const param = useParams();
    const dispatch = useDispatch()
    const [errorRm, setErrorRm] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const [isRateMappingSuccess, setRateMappingSuccess] = useState(false)

    const loginid = merchantLoginId
    // console.log(typeof (generalFormData))
    const parentClientCode = props.generalFormData == '' ? 'COBED' : props.generalFormData
    // console.log("parent client code for ratemapping--", parentClientCode)

    useEffect(() => {
        console.log("component Mounted")
        rateMappingFn(loginid, parentClientCode).then(
            function (value) {
                console.log("success-found")
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
            dispatch(clearApproveKyc())
            const saveGenD = {
                isFinalSubmit: false
            }
            dispatch(generalFormData(saveGenD))
        }
    }, [])
    return (
        <div>
            {isRateMappingSuccess ? <h5>Rate Mapping Done</h5> : <h5>Rate Mapping in processing ...</h5>}
            {errorRm && <h5 className="text-danger">Error occurred : Please contact with the support team.</h5>}
            {errorRm && <h5 className="text-danger">{errorMsg}</h5>}
        </div>
    )
}

