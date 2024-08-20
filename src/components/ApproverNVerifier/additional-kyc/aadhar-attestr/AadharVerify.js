import React from 'react'
import { axiosInstance, kycValidatorAuth } from '../../../../utilities/axiosInstance'
import toastConfig from '../../../../utilities/toastTypes'
import API_URL from '../../../../config'

function AadharVerify() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [aadharNumber, setAadharNumber] = React.useState('')
    const [aadharOtpResp, setAadharOtpResp] = React.useState({})
    const [otpDigit, setOtpDigit] = React.useState('')
    const [aadharJsonResponse, setAadharJsonResponse] = React.useState('')




    const addharVerficationHandler = async () => {
        setIsLoading(true)
        // Aadhar_number
        console.log("dd")
        try {
            const resp = await kycValidatorAuth.post(API_URL.Aadhar_number, { "aadhar_number": aadharNumber })
            setAadharOtpResp(resp.data)
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            toastConfig.errorToast("Something went wrong, Please try again")
        }
    }


    const aadharOtpVerification = async () => {
        setIsLoading(true)
        try {
            const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, { "referenceId": aadharOtpResp?.referenceId, "otp": otpDigit })
            console.log("resp", resp)
            setAadharJsonResponse(JSON.stringify(resp.data))
            setIsLoading(false)
            toastConfig.successToast(resp.data.message)
        } catch (error) {
            setIsLoading(false)
            toastConfig.errorToast("Something went wrong, Please try again")
        }
    }

    return (
        <div className="row">
            <div className="">
                <div className="form-inline">
                    <div className="form-group">
                        <input
                            type="text"
                            name="aadhar_number"
                            className="form-control mr-4"
                            placeholder="Enter Aadhar Number"
                            value={aadharNumber}
                            onChange={(e) => setAadharNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="btn cob-btn-primary text-white btn-sm"
                            onClick={() => addharVerficationHandler()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    ariaHidden="true"
                                ></span>
                            ) : "Verify"}
                        </button>
                    </div>
                </div>
                {/* Enter otp */}
                {aadharOtpResp && aadharOtpResp.status && (
                    <div className="form-inline">
                        <div className="form-group">
                            <input
                                type="text"
                                name="otp"
                                className="form-control mr-4"
                                placeholder="Enter OTP"
                                value={otpDigit}
                                onChange={(e) => setOtpDigit(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn cob-btn-primary text-white btn-sm"
                                onClick={() => aadharOtpVerification()}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        ariaHidden="true"
                                    ></span>
                                ) : "Verify"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="col-10">
                <pre>{aadharJsonResponse}</pre>
            </div>
        </div>

    )
}

export default AadharVerify