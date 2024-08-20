import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import toastConfig from '../../../utilities/toastTypes';
import { axiosInstance } from '../../../utilities/axiosInstance';


function AadharResponse() {
    const search = useLocation().search;
    const searchParams = new URLSearchParams(search);
    const [data, setData] = useState({})

    const status = searchParams.get('status');
    const code = searchParams.get('code');
    const httpStatusCode = searchParams.get('httpStatusCode');
    const message = searchParams.get('message');
    const auth = searchParams.get('auth');

    const verifyAuth = async (status) => {

        try {
            const header = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic T1gwdU01S3l4eDdSekJ2anNjLjUwMGQ0MDE1M2EwMDI1OWM1NWM1YmUxYWM0YjgwNTZkOjE0ZjNhNTIzN2Y5NDFiZTk1MDRlMjAxNDRlYmRhZDUyNjEzZDI1YTI1OTBlNTQ2Zg=="
                }
            }
            const response = await axiosInstance.post("https://api.attestr.com/api/v1/public/checkx/digilocker/eaadhaar", { "auth": auth }, header)
            console.log(response)
            setData(response)
        } catch (error) {
            console.log(error)
            toastConfig.errorToast(error?.response?.data?.message)
        }


        if (status?.toLocaleLowerCase() === 'success') {

        } else {
            toastConfig.errorToast(message)
        }
    }


    useEffect(() => {
        console.log(status, code, httpStatusCode, message, auth);
        if (status?.toLocaleLowerCase() === 'success') {
            verifyAuth(status)
        } else {
            toastConfig.errorToast(message)
        }


    }, [status])

    console.log(data?.data)
    const base64String = `data:image/png;base64,${data?.data?.photo}`;



    return (
        <div>
            <h5>AadharResponse</h5>
            <img src={base64String} alt="Decoded" width={100} height={100} />
            <pre>{JSON.stringify(data?.data, null, 2)}</pre>

        </div>
    )
}

export default AadharResponse