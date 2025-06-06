import API_URL from "../config";
// import { createUpdater } from "../custom-hooks/updateGetValue";

import { axiosInstanceJWT } from "./axiosInstance";

export const rateMappingFn = (loginId, parentClientCode) => {
    // const initialValue = {
    //     loader : true,
    //     isError : false
    // }
    // const rateMappingState = createUpdater(initialValue)
    // console.log(rateMappingState.getValue())


    // async function callAPI(url, method, body = {}) {
    //     let response = {}
    //     response = method === "post" ? await axiosInstance.post(url, body) : await axiosInstance.get(url);
    //     return response?.data;
    // }

    async function callApiJwt(url, method, body = {}) {
        let response = method === "post" ? await axiosInstanceJWT.post(url, body) : await axiosInstanceJWT.get(url);
        return response?.data
    }



    async function rateMapping(merchantLoginId) {
        try {
            const merchantData = await callApiJwt(API_URL.Kyc_User_List, "post", { login_id: merchantLoginId, password_required: true, operation: "k" })
            console.log("fetch Merchant data with secret key--", merchantData)
            // loader = true

            // Call the APIs one by one
            if (merchantData?.clientCode && merchantData?.secret_key !== "") {
                // console.log("merchantData ==", merchantData)
                console.log("Run2- get platform details by id", { platform_id: merchantData?.platformId })
                const result2 = await callApiJwt(API_URL.GET_PLATFORM_BY_ID, "post", { platform_id: merchantData?.platformId });
                // console.log("result2",result2)
                // required parameter for the ratemapping
                const api_version = await result2?.api_version
                const auth_type = await result2?.auth_type
                console.log("Run3- Get API version", api_version, auth_type)
                // console.log("api_version",api_version)
                const clientCode = merchantData?.clientCode
                const clientId = merchantData?.clientId
                const contactNumber = merchantData?.contactNumber
                const emailId = merchantData?.emailId
                const name = merchantData?.name
                const secret_key = merchantData?.secret_key
                // const isDirect = merchantData?.isDirect
                const address = merchantData?.merchant_address_details?.address
                const stateId = merchantData?.stateId
                const bankName = merchantData?.bankName
                const zone_code = merchantData?.zone_code ?? 'IS001'
                const created_by_email = merchantData?.created_by_email ?? "NA"
                // const rr_amount = merchantData?.rolling_reserve
                const business_cat_type = merchantData?.business_category_type ?? ""

                const onboard_type = merchantData?.result?.loginMasterId?.onboard_type


                let parent_login_id, parent_name = "NA"
                if (onboard_type === "Bank Child" || onboard_type === "Bank Child Sub Merchant") {
                    // if the onboard type is bank child then we need to get the parent bank login id and parent bank name
                    parent_login_id = merchantData?.result?.loginMasterId?.parent_bank_login_id ?? ""
                    parent_name = merchantData?.result?.loginMasterId?.parent_bank_name ?? ""
                } else if (onboard_type === "Referrer Child" || onboard_type === "Referrer Child Sub Merchant") {
                    // if the onboard type is referrer child then we need to get the parent referral and parent referral name
                    parent_login_id = merchantData?.result?.loginMasterId?.parent_referral ?? ""
                    parent_name = merchantData?.result?.loginMasterId?.parent_referral_name ?? ""
                } else {
                    parent_login_id = merchantData?.result?.loginMasterId?.loginMasterId ?? ""
                    parent_name = merchantData?.result?.loginMasterId?.name ?? ""
                }

                console.log("Run3.1- parent bank login id and name", parent_login_id, parent_name, onboard_type)


                // const merchant_parent_id = merchantData?.merchant_parent_id ?? ""

                //  Check the client code
                console.log("Run4- check is client code mapped", clientCode)
                const result3 = await callApiJwt(`${API_URL.isClientCodeMapped}/${clientCode}`, "get", {});

                console.log("Run5- length of the array should be 0 for the starting next process - response->", result3)
                // loader = false
                // console.log(rateMappingState.updateValue({loader:false,isError:false}))

                if (result3?.length === 0) {
                    // console.log(rateMappingState.updateValue({loader:true,isError:false}))

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
                        bid: "19",
                        stateName: "DELHI",
                        bankName: bankName,
                        client_username: emailId,
                        client_password: secret_key,
                        appId: "10",
                        status: "Activate",
                        client_type: "normal Client",
                        successUrl: "https://sabpaisa.in/",
                        failedUrl: "https://sabpaisa.in/",
                        subscriptionstatus: "Subscribed",
                        businessType: 2,
                        businessctgcode: business_cat_type,
                        mesaagebypassflag: '1',
                        forcesuccessflag: '1',
                        referralcode: parent_login_id, // parent login id
                        masterName: parent_name  // parent name
                    };
                    console.log("Run6- Call api with the Post Data for the rate mapping", inputData)
                    // step 3 - Post date for the ratemapping
                    await callApiJwt(API_URL.RATE_MAPPING_GenerateClientFormForCob, "post", inputData)

                    console.log("Run7-  // parent client code / new client code / login id", inputData)
                    //2 - rate map clone   // parent client code / new client code / login id
                    await callApiJwt(`${API_URL.RATE_MAPPING_CLONE}/${parentClientCode}/${clientCode}/${merchantLoginId}`, "get", {})


                    //  console.log("step 7 -  updating the apiVersion ", apiVersion)

                    // https://adminapi.sabpaisa.in/SabPaisaAdmin/REST/ManageFalg/Flag/{clientcode}/zoneloginsetup/{X:Y:Z}/0
                    // X: version - api_version
                    // Y: zone - 
                    // Z: email(created by )

                    console.log("Run8- updating the apiVersion", `${api_version}:${zone_code}:${created_by_email}:${auth_type}`)

                    await callApiJwt(`${API_URL.UPDATE_VERSION_RATEMAPPING}/${clientCode}/zoneloginsetup/${api_version}:${zone_code}:${created_by_email}:${auth_type}/0`, "get", {})
                    // loader = false
                    // console.log(rateMappingState.updateValue({loader:false,isError:false}))

                }
            }
            // loader = false


        } catch (error) {
            // loader = false
            // setLoader(false)
            // alert(`Error occurred: ${error}`)
            // errorRm = true
            // console.log(rateMappingState.updateValue({loader:false,isError:true}))
            // console.log(rateMappingState.getValue())

            return Promise.reject(error)
        }
    }


    return rateMapping(loginId)



    // Usage
    //   const myVariable = createUpdater(initialValue);
    //   console.log(myVariable.getValue()); // Initial value

    //   myVariable.updateValue(newValue);
    //   console.log(myVariable.getValue());
    //     console.log("loader--", loader)
    //     console.log("errorRm--", errorRm)



}
