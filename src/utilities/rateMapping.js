import API_URL from "../config";
// import { createUpdater } from "../custom-hooks/updateGetValue";

import { axiosInstance, axiosInstanceJWT } from "./axiosInstance";

export const rateMappingFn = (loginId, parentClientCode) => {

    let loader = true

    // const initialValue = {
    //     loader : true,
    //     isError : false
    // }
    // const rateMappingState = createUpdater(initialValue)
    // console.log(rateMappingState.getValue())


    async function callAPI(url, method, isJwtAxiosRequired, body = {}) {
        let response = {}
        response = method === "post" ? await axiosInstance.post(url, body) : await axiosInstance.get(url);
        return response?.data;
    }

    async function callApiJwt(url, body = {}) {
        let response = await axiosInstanceJWT.post(url, body)
        return response?.data
    }



    async function rateMapping(merchantLoginId) {
        try {
            const merchantData = await callApiJwt(API_URL.Kyc_User_List, { login_id: merchantLoginId, password_required: true })
            console.log("fetch Merchant data with secret key--", merchantData)
            loader = true

            // Call the APIs one by one
            if (merchantData?.clientCode && merchantData?.secret_key !== "") {
                // console.log("merchantData ==", merchantData)
                console.log("Run2- get platform details by id", { platform_id: merchantData?.platformId })
                const result2 = await callApiJwt(API_URL.GET_PLATFORM_BY_ID, { platform_id: merchantData?.platformId });
                // console.log("result2",result2)
                // required parameter for the ratemapping
                const api_version = await result2?.api_version
                console.log("Run3- Get API version", api_version)
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
                const merchant_parent_id = merchantData?.merchant_parent_id ?? ""

                //  Check the client code
                console.log("Run4- check is client code mapped", clientCode)
                const result3 = await callAPI(`${API_URL.isClientCodeMapped}/${clientCode}`, "get", false);

                console.log("Run5- length of the array should be 0 for the starting next process - response->", result3)
                loader = false
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
                        referralcode: merchant_parent_id,
                        mesaagebypassflag: '1',
                        forcesuccessflag: '1'
                    };
                    console.log("Run6- Call api with the Post Data for the rate mapping", inputData)
                    // step 3 - Post date for the ratemapping
                    const result4 = await callAPI(API_URL.RATE_MAPPING_GenerateClientFormForCob, "post", false, inputData)

                    console.log("Run7-  // parent client code / new client code / login id", inputData)
                    //2 - rate map clone   // parent client code / new client code / login id
                    const result5 = await callAPI(`${API_URL.RATE_MAPPING_CLONE}/${parentClientCode}/${clientCode}/${merchantLoginId}`, "get", false)

                    console.log("Run8- updating the apiVersion", api_version)
                    //  console.log("step 7 -  updating the apiVersion ", apiVersion)
                    const result6 = await callAPI(`${API_URL.UPDATE_VERSION_RATEMAPPING}/${clientCode}/apiversion/${api_version}/${merchantLoginId}`, "get", false)
                    loader = false
                    // console.log(rateMappingState.updateValue({loader:false,isError:false}))

                }
            }

        } catch (error) {
            loader = false
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
