import React, { useState, useEffect } from "react"
import API_URL from "../config"
import { axiosInstance } from "./axiosInstance"
import { stringDec } from "./encodeDecode"

export const DefaultRateMapping = ({ setFlag }) => {

    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setFlag(false)
        // console.log("step 0")
        const userData = JSON.parse(sessionStorage.getItem("user"))
        if ((userData?.clientMerchantDetailsList !== null && userData?.clientMerchantDetailsList[0]?.clientCode !== undefined && userData?.clientMerchantDetailsList[0]?.clientCode !== "") && userData?.isDirect) {
            // console.log("step 1 ", userData?.clientMerchantDetailsList[0]?.clientCode)
            axiosInstance.get(`${API_URL.isClientCodeMapped}/${userData?.clientMerchantDetailsList[0]?.clientCode}`).then(res => {
                if (res?.data.length === 0) {
                    // console.log("step 2 - not found rate mapping ",res)
                    setLoader(true)
                    setFlag(true)
                    const clientMerchantDetailsList = userData?.clientMerchantDetailsList;
                    const clientCode = clientMerchantDetailsList[0]?.clientCode;
                    const clientId = clientMerchantDetailsList[0]?.clientId;
                    const clientContact = userData?.clientMobileNo;
                    const clientEmail = userData?.userName;
                    const clientName = clientMerchantDetailsList[0]?.clientName;
                    const clientUserName = userData?.userName;
                    const passwrod = stringDec(sessionStorage.getItem('prog_id'));

                    const inputData = {
                        clientId: clientId,
                        clientCode: clientCode,
                        clientContact: clientContact, // need to fix
                        clientEmail: clientEmail,
                        address: "Delhi",
                        clientLogoPath: "client/logopath",
                        clientName: clientName,
                        clientLink: "cltLink",
                        stateId: 9,
                        bid: "19", // ask
                        stateName: "DELHI",
                        bankName: "SBI",
                        client_username: clientUserName,
                        client_password: passwrod,
                        appId: "10", // ask
                        status: "Activate", // ask
                        client_type: "normal Client",
                        successUrl: "https://sabpaisa.in/",
                        failedUrl: "https://sabpaisa.in/",
                        subscriptionstatus: "Subscribed",
                        businessType: 2,
                        businessctgcode:"3",
                        referralcode : userData?.loginId // merchant login id
                    };

                    // console.log("inputData",inputData);
                    // 1 - run RATE_MAPPING_GenerateClientFormForCob 

                    axiosInstance.post(API_URL.RATE_MAPPING_GenerateClientFormForCob, inputData).then(res => {
                        setFlag(true)

                        // console.log("step 3 run RATE_MAPPING_GenerateClientFormForCob",API_URL.RATE_MAPPING_GenerateClientFormForCob);
                        //2 - rate map clone   // parent client code / new client code / login id
                        axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/COBED/${clientCode}/${userData?.loginId}`).then(res => {
                            //    update api version
                            axiosInstance.get(`${API_URL.UPDATE_VERSION_RATEMAPPING}/${clientCode}/apiversion/1/${userData?.loginId}`).then(res => {
                                console.log("update api version")
                                setFlag(false)
                                setLoader(false)
                            }).catch(err => {
                                setFlag(false)
                                setLoader(false)
                                console(err)
                            })
                        }).catch(err => {
                            setFlag(false)
                            setLoader(false)
                            console.log(err)
                        })
                    }).catch(err => {
                        setFlag(false)
                        setLoader(false)
                        console.log(err)
                    })

                } else {
                    sessionStorage.removeItem('prog_id')
                }

            }).catch(err => {
                setFlag(false)
                setLoader(false)
                console.log(err)
            })
        }


    }, [])




    return (
        <React.Fragment>
            {loader &&
                <div className="text-center">
                    <div className="h-100">
                        <p>Please Wait ...</p>
                        <p className="spinner-border-loading" role="status">
                            {/* <span className="sr-only">Loading...</span> */}
                        </p>
                        <p>Creating your dashboard</p>
                    </div>
                </div>}
        </React.Fragment>


    )
}