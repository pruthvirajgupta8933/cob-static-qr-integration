import React from 'react'
import { axiosInstance } from '../../../utilities/axiosInstance'
import toastConfig from '../../../utilities/toastTypes'

function AadharVerify() {
    const [isLoading, setIsLoading] = React.useState(false)


    const addharVerficationHandler = async () => {
        setIsLoading(true)
        const header = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic T1gwdU01S3l4eDdSekJ2anNjLjUwMGQ0MDE1M2EwMDI1OWM1NWM1YmUxYWM0YjgwNTZkOjE0ZjNhNTIzN2Y5NDFiZTk1MDRlMjAxNDRlYmRhZDUyNjEzZDI1YTI1OTBlNTQ2Zg=="
            }
        }
        try {
            const signature = await axiosInstance.post("https://api.attestr.com/api/v1/public/checkx/digilocker/auth", {}, header)
            // console.log("signature", signature)
            const clientKey = '500d40153a00259c55c5be1ac4b8056d'
            const signatureKey = signature.data.signature
            const callBackUrl = `${window.location.origin}/dashboard/aadhar-response`
            const redirectUrl = `https://app.attestr.com/dlauth#web?cl=${clientKey}&digest=${signatureKey}&rurl=${callBackUrl}`
            setIsLoading(false)
            window.location.replace(redirectUrl)

        } catch (error) {
            setIsLoading(false)
            toastConfig.errorToast("Something went wrong, Please try again")

        }
    }

    return (
        <div className="form-inline">
            <div className="form-group">
                <input
                    type="text"
                    name="aadhar_number"
                    className="form-control mr-4"
                    placeholder="Enter Aadhar Number"
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
        </div>)
}

export default AadharVerify