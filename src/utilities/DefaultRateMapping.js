import React, { useState, useEffect } from "react"
import API_URL from "../config"
import { axiosInstance } from "./axiosInstance"
import { axiosInstanceJWT } from "../../src/utilities/axiosInstance"
import { kycUserList } from "../slices/kycSlice"
import { useDispatch, useSelector } from "react-redux"


export const DefaultRateMapping = ({ setFlag, merchantLoginId }) => {
    // console.log("merchantLoginId", merchantLoginId)
    const dispatch = useDispatch()
    const { kyc } = useSelector(state => state)

    const [loader, setLoader] = useState(false)
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        setLoader(true)
        dispatch(kycUserList({ login_id: merchantLoginId, password_required: true }));
    }, [dispatch]);


    useEffect(() => {

        setLoader(true)

        async function callAPI(url, method, isJwtAxiosRequired, body = {}) {
            let response = {}
            if (isJwtAxiosRequired) {
                response = await axiosInstanceJWT.post(url, body)
            } else {
                response = method === "post" ? await axiosInstance.post(url, body) : await axiosInstance.get(url);
            }

            return response?.data;
        }

        // let loader = false
        async function rateMapping(merchantLoginId) {
            try {
                // loader = true
                // Call the APIs one by one
                if (kyc?.kycUserList?.clientCode && kyc?.kycUserList?.secret_key!=="") {
                    // const result1 = await callAPI(API_URL.Kyc_User_List, "post", true, { login_id: merchantLoginId, password_required: true });
                    const merchantData = kyc?.kycUserList

                    // console.log("merchantData ==", merchantData)
                    const result2 = await callAPI(API_URL.GET_PLATFORM_BY_ID, "post", true, { platform_id: merchantData?.platformId });
                    // console.log("result2",result2)
                    // required parameter for the ratemapping
                    const api_version = await result2?.api_version

                    // console.log("api_version",api_version)
                    const clientCode = merchantData?.clientCode
                    const clientId = merchantData?.clientId
                    const contactNumber = merchantData?.contactNumber
                    const emailId = merchantData?.emailId
                    const name = merchantData?.name
                    const secret_key = merchantData?.secret_key
                    const isDirect = merchantData?.isDirect
                    const address = merchantData?.merchant_address_details?.address
                    const stateId = merchantData?.stateId
                    const bankName = merchantData?.bankName
                    const rr_amount = merchantData?.rolling_reserve
                    const business_cat_type = merchantData?.business_category_type ?? ""
                    const refer_by = merchantData?.refer_by ?? ""

                    //  Check the client code
                    const result3 = await callAPI(`${API_URL.isClientCodeMapped}/${clientCode}`, "get", false);
                    console.log("result3", result3)
                    if (result3?.length === 0) {
                        console.log("under the condition")
                        const inputData = {
                            clientId: clientId,
                            clientCode: clientCode,
                            clientContact: contactNumber,
                            clientEmail: emailId,
                            address: address,
                            clientLogoPath: "client/logopath",
                            clientName: name,
                            clientLink: "cltLink",
                            stateId: stateId,
                            bid: "19", // tbd
                            stateName: "DELHI",
                            bankName: bankName,
                            client_username: emailId,
                            client_password: secret_key,
                            appId: "10", // tbd
                            status: "Activate", // tbd
                            client_type: "normal Client",
                            successUrl: "https://sabpaisa.in/",
                            failedUrl: "https://sabpaisa.in/",
                            subscriptionstatus: "Subscribed",
                            businessType: 2,
                            businessctgcode: business_cat_type,
                            referralcode: refer_by
                        };

                        // step 3 - Post date for the ratemapping
                        const result4 = await callAPI(API_URL.RATE_MAPPING_GenerateClientFormForCob, "post", false, inputData)

                        //2 - rate map clone   // parent client code / new client code / login id
                        const result5 = await callAPI(`${API_URL.RATE_MAPPING_CLONE}/COBED/${clientCode}/${merchantLoginId}`, "get", false)

                        //  console.log("step 7 -  updating the apiVersion ", apiVersion)
                        const result6 = await callAPI(`${API_URL.UPDATE_VERSION_RATEMAPPING}/${clientCode}/apiversion/${api_version}/${merchantLoginId}`, "get", false)
                    }
                }
                // Process the results
                // ...
            } catch (error) {
                // loader = false
                setLoader(false)
                // alert(`Error occurred: ${error}`)
                setError(true)
                setErrorMsg(error)
                console.log('Error occurred:', error);
            }
        }

        rateMapping(merchantLoginId)

        return ()=>{
            setLoader(false)
            setError(false)
            setErrorMsg("")
        }
    }, [kyc, merchantLoginId])


    return (
        <React.Fragment>
            {loader &&
                <div className="text-center">
                    <div className="h-100">
                        <p>Do Not Close the Tab/ Browser. Please Wait ...</p>
                        <p className="spinner-border-loading" role="status">
                            {/* <span className="sr-only">Loading...</span> */}
                        </p>
                        <p>Rate mapping in Processing</p>
                    </div>
                </div>}

            {error &&
                <div className="text-center text-danger">
                    <div className="h-100">
                        <h5>Kindly contact with the support team.</h5>
                        <h5>Rate Mapping - {errorMsg.toString()}</h5>
                    </div>
                </div>}
        </React.Fragment>


    )
}

