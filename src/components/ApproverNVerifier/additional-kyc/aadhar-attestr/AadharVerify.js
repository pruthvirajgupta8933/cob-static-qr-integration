import React from 'react'
import { kycValidatorAuth } from '../../../../utilities/axiosInstance'
import toastConfig from '../../../../utilities/toastTypes'
import API_URL from '../../../../config'

function AadharVerify() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [aadharNumber, setAadharNumber] = React.useState('')
    const [disable, setDisable] = React.useState(false)
    const [aadharOtpResp, setAadharOtpResp] = React.useState({})
    const [otpDigit, setOtpDigit] = React.useState('')
    const [aadharJsonResponse, setAadharJsonResponse] = React.useState('')
   
    const [adharOtpDisable, setAdharOtpDisable] = React.useState(false)
    const [otpVerified, setOtpVerified] = React.useState(false)

    const addharVerficationHandler = async () => {
        setIsLoading(true)
        setDisable(true)
        try {
            const resp = await kycValidatorAuth.post(API_URL.Aadhar_number, { "aadhar_number": aadharNumber })
            setAadharOtpResp(resp.data)
            setIsLoading(false)
            toastConfig.successToast(resp.data.message)
        } catch (error) {
            setIsLoading(false)
            setDisable(false)
            toastConfig.errorToast("Something went wrong, Please try again")
        }
    }

    const aadharOtpVerification = async () => {
        setAdharOtpDisable(true)
        try {
            const resp = await kycValidatorAuth.post(API_URL.Aadhar_otp_verify, { "referenceId": aadharOtpResp?.referenceId, "otp": otpDigit })
            setAadharJsonResponse(JSON.stringify(resp.data))
            setOtpVerified(true)
            setAdharOtpDisable(false)
            toastConfig.successToast(resp.data.message)
        } catch (error) {
            setAdharOtpDisable(false)
            toastConfig.errorToast("Something went wrong, Please try again")
        }
    }

    const handleAadharNumberChange = (e) => {
        setAadharNumber(e.target.value)
        setAadharJsonResponse('') // Reset the Aadhar details when number changes
    }

    const resetHandler = () => {
        setAadharNumber('')
        setAadharOtpResp({})
        setOtpDigit('')
        setAadharJsonResponse('')
        setDisable(false)
        setOtpVerified(false)
        setAdharOtpDisable(false)
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
                            onChange={handleAadharNumberChange}
                            disabled={disable}
                        />
                    </div>
                    <div className="form-group">
                        <button
                            type="button"
                            className="btn cob-btn-primary text-white btn-sm"
                            onClick={addharVerficationHandler}
                            disabled={isLoading || disable}
                        >
                            {isLoading ? (
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                    ariaHidden="true"
                                ></span>
                            ) : "Send OTP"}
                        </button>
                    </div>
                    {(isLoading || disable) &&
                    <div className="form-group ml-2">
                        <button
                            type="button"
                            className="btn cob-btn-primary text-white btn-sm"
                            onClick={resetHandler}
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                    </div>}
                </div>

                {/* Enter otp */}
                {aadharOtpResp && aadharOtpResp.status && (
                    <div className="form-inline mt-3">
                        <div className="form-group">
                            <input
                                type="text"
                                name="otp"
                                className="form-control mr-4"
                                placeholder="Enter OTP"
                                value={otpDigit}
                                onChange={(e) => setOtpDigit(e.target.value)}
                                disabled={otpVerified || adharOtpDisable}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn cob-btn-primary text-white btn-sm"
                                onClick={aadharOtpVerification}
                                disabled={otpVerified || adharOtpDisable}
                            >
                                {adharOtpDisable ? (
                                    <span
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                        ariaHidden="true"
                                    ></span>
                                ) : "Verify OTP"}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {aadharJsonResponse && (
                <div className="card mt-4" style={{ maxWidth: '600px', margin: 'auto' }}>
                    <div className="row no-gutters">

                        <div className="col-md-4 d-flex justify-content-center align-items-center">
                            <img
                                className="card-img"
                                src={`data:image/png;base64,${JSON.parse(aadharJsonResponse)?.image}`}
                                alt="Aadhar"
                            />
                        </div>

                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{`${JSON.parse(aadharJsonResponse)?.first_name} ${JSON.parse(aadharJsonResponse)?.last_name}`}</h5>

                                {/* Masked Aadhar Number */}
                                <p className="card-text">
                                    <strong>{JSON.parse(aadharJsonResponse)?.masked_aadhar_number}</strong>
                                </p>

                                <p className="card-text">
                                    <strong>DOB:</strong> {JSON.parse(aadharJsonResponse)?.dob}<br />
                                    <strong>C/O:</strong> {JSON.parse(aadharJsonResponse)?.father_name}<br />
                                    <strong>Address:</strong>
                                    {[
                                        JSON.parse(aadharJsonResponse)?.split_address?.house,
                                        JSON.parse(aadharJsonResponse)?.split_address?.street,
                                        JSON.parse(aadharJsonResponse)?.split_address?.landmark,
                                        JSON.parse(aadharJsonResponse)?.split_address?.loc,
                                        JSON.parse(aadharJsonResponse)?.split_address?.vtc,
                                        JSON.parse(aadharJsonResponse)?.split_address?.po,
                                        JSON.parse(aadharJsonResponse)?.split_address?.subdist,
                                        JSON.parse(aadharJsonResponse)?.split_address?.dist,
                                        JSON.parse(aadharJsonResponse)?.split_address?.state,
                                        JSON.parse(aadharJsonResponse)?.split_address?.country
                                    ]
                                        .filter(Boolean) // Remove empty or null values
                                        .join(', ')      // Join the remaining values with commas
                                    }<br />
                                    <strong>PIN Code:</strong> {JSON.parse(aadharJsonResponse)?.pincode}<br />
                                    <strong>Status:</strong> {JSON.parse(aadharJsonResponse)?.status === true && 'True'}<br />
                                    <strong>Valid:</strong> {JSON.parse(aadharJsonResponse)?.valid === true && 'True'}<br />

                                </p>
                                <p className="card-text">
                                    <a href={JSON.parse(aadharJsonResponse)?.xml_file} download>
                                        Download XML
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AadharVerify
