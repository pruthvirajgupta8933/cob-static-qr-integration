import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { isArray, isNull } from 'lodash'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import API_URL from '../../config'
import { axiosInstance, axiosInstanceAuth } from '../../utilities/axiosInstance'
import NavBar from '../dashboard/NavBar/NavBar'
import toastConfig from '../../utilities/toastTypes'
import { stringDec } from '../../utilities/encodeDecode'


function SpPg() {

    const history = useHistory()
    const [selectedPlan, setSelectedPlan] = useState({})
    const [planPrice, setPlanPrice] = useState(9999)
    const [clientData, setClientData] = useState({})
    const [responseData, setResponseData] = useState({})
    const [reponseFromServerFlag, setRespFromServerFlag] = useState(true)
    const [isOpenPg, setIsOpenPg] = useState(false)

    const [rateCloneStatus, setRateCloneStatus] = useState("")





    useEffect(() => {
        const sessionData = JSON.parse(sessionStorage.getItem("tempProductPlanData"))
        const user = JSON.parse(localStorage.getItem("user"))
      
        if (isNull(sessionData) || isNull(user)) {
            history.push("/dashboard")
            // console.log("redirect to dashboard")
        } else {
            // console.log("session storage", sessionData)
            fetchDataByProductId(sessionData?.applicationId, sessionData?.planId)
            setSelectedPlan(sessionData)
        }

        if (isArray(user?.clientMerchantDetailsList)) {
            setClientData(user?.clientMerchantDetailsList)
        }
        return () => {
            // setIsOpenPg(false)
            setSelectedPlan({})
        }
    }, [])




    const fetchDataByProductId = (applicationId, planid) => {
        let url = API_URL.PRODUCT_SUB_DETAILS + "/" + applicationId;
        axiosInstanceAuth
            .get(url)
            .then((resp) => {
                const data = resp.data.ProductDetail;
                const plan = data?.filter(p => p.plan_id === planid)
                plan && setPlanPrice(plan[0]?.actual_price)
            })
    }

    // check rate mapping status before rate mapping
    const checkRateMappingStatus = (clientCodeF, clientCodeT, loginId) => {
        axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/${clientCodeF}/${clientCodeT}/${loginId}`)
            .then((resp) => {
                const data = resp.data;
                setRateCloneStatus(data[0].ID)
                localStorage.setItem('RATE_MAPPING_CLONE', data[0].ID);
            })
            .catch((err) => { console.log(err) })
    }


    useEffect(() => {
        if ((rateCloneStatus === 3 || rateCloneStatus === 0) && (selectedPlan?.applicationId === "10" && selectedPlan?.planId !== 1 && selectedPlan?.planId !== "")) {
            console.log("cond true")
            if (clientData?.clientMerchantDetailsList !== null) {
                console.log("33")
                const clientMerchantDetailsList = clientData?.clientMerchantDetailsList;
                const clientCode = clientMerchantDetailsList[0]?.clientCode;
                const clientId = clientMerchantDetailsList[0]?.clientId;
                const clientContact = clientData?.clientMobileNo;
                const clientEmail = clientData?.userName;
                const clientName = clientMerchantDetailsList[0]?.clientName;
                const clientUserName = clientData?.userName;
                const passwrod = stringDec(sessionStorage.getItem('prog_id'));

                const inputData = {
                    clientId: clientId,
                    clientCode: clientCode,
                    clientContact: clientContact,
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
                    businessType: 2
                };

                // console.log("inputData",inputData);
                // 1 - run RATE_MAPPING_GenerateClientFormForCob 

                axiosInstance.post(API_URL.RATE_MAPPING_GenerateClientFormForCob, inputData).then(res => {

                    console.log("run RATE_MAPPING_GenerateClientFormForCob");
                    localStorage.setItem('RATE_MAPPING_GenerateClientFormForCob', "api trigger");
                    localStorage.setItem('resp_RATE_MAPPING_GenerateClientFormForCob', res?.toString());
                    //2 - rate map clone   // parent client code / new client code / login id
                    axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/'COBED'/${clientCode}/${clientData?.loginId}`).then(res => {
                        console.log("run RATE_MAPPING_CLONE");
                        localStorage.setItem('RATE_MAPPING_CLONE', "api trigger");
                        localStorage.setItem('resp_RATE_MAPPING_CLONE', res?.toString());
                        // 3- enable pay link
                        //    axiosInstance.get(API_URL.RATE_ENABLE_PAYLINK + '/' + clientCode).then(res => {
                        //       localStorage.setItem('enablePaylink', "api trigger");
                        //       // console.log("3 api run")
                        //       dispatch(checkPermissionSlice(clientCode));
                        //   })
                    }).catch(err => { console.log(err) })
                }).catch(err => { console.log(err) })


            }
        }


    }, [rateCloneStatus])

    useEffect(() => {
        const searchParam = window.location.search.slice(1)
        const params = new URLSearchParams(searchParam?.toString());
        const paramsData = Object.fromEntries(params.entries());
        if (Object.values(paramsData)?.length > 0) {
            setRespFromServerFlag(true)
            setResponseData(paramsData)
            if (paramsData?.statusCode === "0000") {
                // if payment successful
                const res = axiosInstanceAuth.post(
                    API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
                    selectedPlan
                );


                if (res?.status === 200) {
                    console.log("1")
                    // only PG product without subscription plan check rate mapping status
                    if (selectedPlan?.applicationId === "10" && selectedPlan?.planId !== 1) {
                        console.log("2")
                        // only for payment gateway we have to check rate mapping status
                        checkRateMappingStatus("COBED", clientData?.clientMerchantDetailsList[0]?.clientCode, clientData?.loginId)
                    }

                    toastConfig.successToast(res?.data?.message);
                } else {
                    toastConfig.errorToast("Something went wrong");
                }

            }
            // sessionStorage.removeItem("tempProductPlanData")
        } else {
            setRespFromServerFlag(false)

        }

        return () => {
            setRespFromServerFlag(false)

        }
    }, [])


    // console.log("clientData", clientData)

    return (
        <React.Fragment>
            <section className="ant-layout">
                <NavBar />

                <SabpaisaPaymentGateway planData={selectedPlan} planPrice={planPrice} openPg={isOpenPg} clientData={clientData} />

                <main className="gx-layout-content ant-layout-content">
                    <div className="gx-main-content-wrapper">
                        <div className="right_layout my_account_wrapper right_side_heading">
                            <h1 className="m-b-sm gx-float-left">Payment</h1>
                        </div>
                        <section className="features8 cid-sg6XYTl25a" id="features08-3-">
                            <div className="container">
                                <div className="row">
                                    <div className="card">
                                        <div className="card-header">
                                            {`${selectedPlan?.applicationName ?? responseData?.udf16} / ${selectedPlan?.planName ?? responseData?.udf14}`}
                                        </div>
                                        {reponseFromServerFlag ?
                                            <div className="card-body">
                                                {/* <h5 className="card-title">Payment Status</h5> */}
                                                <p className="card-text">SP Txn. ID : {responseData?.sabpaisaTxnId}</p>
                                                <p className="card-text">Payer Name : {responseData?.payerName}</p>
                                                <p className="card-text">Payer Email : {responseData?.payerEmail}</p>
                                                <p className="card-text">Paid Amount : {responseData?.paidAmount}</p>
                                                <p className="card-text">Payment Status : {responseData?.status}</p>
                                                <p className="card-text">Transaction Date : {responseData?.transDate}</p>
                                                <p className="card-text">{responseData?.sabpaisaMessage}</p>
                                                <Link className="btn btn-primary" to="/dashboard">Bank to Dashboard</Link>
                                            </div>
                                            :
                                            <div className="card-body">
                                                <h5 className="card-title">Make payment for activate the selected plan.</h5>
                                                <h5 className="card-title">Amount : {planPrice} INR</h5>
                                                {/* <p className="card-text">With supporting text below as a natural lead-in to additional content.</p> */}
                                                <button onClick={() => { setIsOpenPg(true) }} className="btn btn-primary">Pay Now</button>
                                            </div>
                                        }

                                    </div>

                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </section>
        </React.Fragment>
    )
}

export default SpPg