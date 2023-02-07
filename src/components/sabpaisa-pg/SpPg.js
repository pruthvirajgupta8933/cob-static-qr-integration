import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { isArray, isNull } from 'lodash'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import API_URL from '../../config'
import { axiosInstanceAuth } from '../../utilities/axiosInstance'
import NavBar from '../dashboard/NavBar/NavBar'
import toastConfig from '../../utilities/toastTypes'
import { useDispatch, useSelector } from 'react-redux'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material'
import { merchantSubscribedPlanData, productPlanData } from '../../slices/merchant-slice/productCatalogueSlice'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


function SpPg() {

    const [selectedPlan, setSelectedPlan] = useState({})
    const [selectedPlanCode, setSelectedPlanCode] = useState("")

    const [responseData, setResponseData] = useState({})
    const [reponseFromServerFlag, setRespFromServerFlag] = useState(false)
    const [isOpenPg, setIsOpenPg] = useState(false)


    const dispatch = useDispatch()
    const history = useHistory()

    const { auth, productCatalogueSlice } = useSelector((state) => state);
    const { SubscribedPlanData,   } = productCatalogueSlice
    const { subscribeId } = useParams();

    // console.log("SubscribedPlanData",SubscribedPlanData)
    useEffect(() => {

        const unPaidProduct = SubscribedPlanData?.filter((d) => (
            (isNull(d?.mandateStatus) || d?.mandateStatus==="pending") &&   
            (d?.clientSubscribedPlanDetailsId.toString() === subscribeId.toString())))

        const searchParam = window.location.search.slice(1)
        const queryString = new URLSearchParams(searchParam?.toString());
        const queryStringData = Object.fromEntries(queryString.entries());
        // console.log("paramsData", paramsData)

        if (Object.values(queryStringData)?.length > 0) {
            setRespFromServerFlag(true)
            setResponseData(queryStringData)
            console.log("queryStringData",queryStringData)
            if (queryStringData?.statusCode === "0000") {
                // if payment successful
                const updatePostData = {
                    "bankRef": queryStringData?.bankTxnId,
                    "clientSubscribedPlanDetailsId": subscribeId,
                    "mandateBankName": queryStringData?.bankName,
                    "clientTxnId": queryStringData?.clientTxnId,
                    "mandateStatus": queryStringData?.status,
                    "paymentMode": queryStringData?.paymentMode,
                    "purchaseAmount": queryStringData?.amount,
                    "umrn": queryStringData?.sabpaisaTxnId
                }
                axiosInstanceAuth.post(
                    API_URL.UPDATE_SUBSCRIBED_PLAN_DETAILS,
                    updatePostData
                ).then(res=>{
                dispatch(merchantSubscribedPlanData({ "clientId": auth?.user?.clientMerchantDetailsList[0]?.clientId }))

                    toastConfig.successToast(res?.data?.message);
                }).catch(err=>{
                    toastConfig.errorToast("Something went wrong");
                })
          
            }
            // sessionStorage.removeItem("tempProductPlanData")
        }else{
         
            // console.log("unPaidProduct",unPaidProduct)
            if(unPaidProduct?.length>0){
                console.log("continue")
                setSelectedPlanCode(unPaidProduct[0]?.plan_code)
                const postBody = {"app_id": unPaidProduct[0]?.applicationId}
                dispatch(productPlanData(postBody))
            }else{
                // history.push("/dashboard")
                console.log("redirect to dashboard")
            }
        }

        return () => {
            setRespFromServerFlag(false)

        }

    }, [])



    


// console.log("responseData",responseData)
    useEffect(() => {
        // console.log("productCatalogueSlice",productCatalogueSlice)
        if(productCatalogueSlice?.productPlanData?.length>0){
            setSelectedPlan(productCatalogueSlice?.productPlanData?.filter((pd)=> (pd?.plan_code === selectedPlanCode)))
        }
    }, [productCatalogueSlice])






    // check rate mapping status before rate mapping
    // const checkRateMappingStatus = (clientCodeF, clientCodeT, loginId) => {
    //     axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/${clientCodeF}/${clientCodeT}/${loginId}`)
    //         .then((resp) => {
    //             const data = resp.data;
    //             setRateCloneStatus(data[0].ID)
    //             localStorage.setItem('RATE_MAPPING_CLONE', data[0].ID);
    //         })
    //         .catch((err) => { console.log(err) })
    // }


    // useEffect(() => {

    //     // console.log("rateCloneStatus",rateCloneStatus)
    //     // console.log("tempPlanId",tempPlanId)
    //     // console.log("param?.id",param?.id)

    //     if ((rateCloneStatus === 3 || rateCloneStatus === 0) && (selectedPlan?.applicationId === "10" && selectedPlan?.planId !== 1 && selectedPlan?.planId !== "")) {
    //         console.log("cond true")
    //         if (clientData?.clientMerchantDetailsList !== null) {
    //             console.log("33")
    //             const clientMerchantDetailsList = clientData?.clientMerchantDetailsList;
    //             const clientCode = clientMerchantDetailsList[0]?.clientCode;
    //             const clientId = clientMerchantDetailsList[0]?.clientId;
    //             const clientContact = clientData?.clientMobileNo;
    //             const clientEmail = clientData?.userName;
    //             const clientName = clientMerchantDetailsList[0]?.clientName;
    //             const clientUserName = clientData?.userName;
    //             const passwrod = stringDec(sessionStorage.getItem('prog_id'));

    //             const inputData = {
    //                 clientId: clientId,
    //                 clientCode: clientCode,
    //                 clientContact: clientContact, // need to fix
    //                 clientEmail: clientEmail,
    //                 address: "Delhi",
    //                 clientLogoPath: "client/logopath",
    //                 clientName: clientName,
    //                 clientLink: "cltLink",
    //                 stateId: 9,
    //                 bid: "19", // ask
    //                 stateName: "DELHI",
    //                 bankName: "SBI",
    //                 client_username: clientUserName,
    //                 client_password: passwrod,
    //                 appId: "10", // ask
    //                 status: "Activate", // ask
    //                 client_type: "normal Client",
    //                 successUrl: "https://sabpaisa.in/",
    //                 failedUrl: "https://sabpaisa.in/",
    //                 subscriptionstatus: "Subscribed",
    //                 businessType: 2
    //             };

    //             // console.log("inputData",inputData);
    //             // 1 - run RATE_MAPPING_GenerateClientFormForCob 

    //             axiosInstance.post(API_URL.RATE_MAPPING_GenerateClientFormForCob, inputData).then(res => {

    //                 console.log("run RATE_MAPPING_GenerateClientFormForCob");
    //                 localStorage.setItem('RATE_MAPPING_GenerateClientFormForCob', "api trigger");
    //                 localStorage.setItem('resp_RATE_MAPPING_GenerateClientFormForCob', res?.toString());
    //                 //2 - rate map clone   // parent client code / new client code / login id
    //                 axiosInstance.get(`${API_URL.RATE_MAPPING_CLONE}/'COBED'/${clientCode}/${clientData?.loginId}`).then(res => {
    //                     console.log("run RATE_MAPPING_CLONE");
    //                     localStorage.setItem('RATE_MAPPING_CLONE', "api trigger");
    //                     localStorage.setItem('resp_RATE_MAPPING_CLONE', res?.toString());
    //                     // 3- enable pay link
    //                     //    axiosInstance.get(API_URL.RATE_ENABLE_PAYLINK + '/' + clientCode).then(res => {
    //                     //       localStorage.setItem('enablePaylink', "api trigger");
    //                     //       // console.log("3 api run")
    //                     //       dispatch(checkPermissionSlice(clientCode));
    //                     //   })
    //                 }).catch(err => { console.log(err) })
    //             }).catch(err => { console.log(err) })


    //         }
    //     }


    // }, [rateCloneStatus])

    // useEffect(() => {
    //     const searchParam = window.location.search.slice(1)
    //     const queryString = new URLSearchParams(searchParam?.toString());
    //     const queryStringData = Object.fromEntries(queryString.entries());
    //     // console.log("paramsData", paramsData)

    //     if (Object.values(queryStringData)?.length > 0) {
    //         setRespFromServerFlag(true)
    //         setResponseData(queryStringData)
    //         if (queryStringData?.statusCode === "0000") {
    //             // if payment successful
    //             // const res = axiosInstanceAuth.post(
    //             //     API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
    //             //     selectedPlan
    //             // );


    //             // if (res?.status === 200) {
    //             //     console.log("1")
    //             //     // only PG product without subscription plan check rate mapping status
 

    //             //     // getSubscribedPlan(plan_id);
    //             //     toastConfig.successToast(res?.data?.message);
    //             // } else {
    //             //     toastConfig.errorToast("Something went wrong");
    //             // }
    //         }
    //         // sessionStorage.removeItem("tempProductPlanData")
    //     }

    //     return () => {
    //         setRespFromServerFlag(false)

    //     }
    // }, [])


    console.log("selectedPlan", selectedPlan[0]?.actual_price)

    return (
        <React.Fragment>
            <section className="ant-layout">
                <NavBar />
                <SabpaisaPaymentGateway planData={selectedPlan}  openPg={isOpenPg} clientData={auth?.user} />

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
                                            {/* {`${selectedPlan?.applicationName ?? responseData?.udf16} / ${ selectedPlan[0]?.planName ?? responseData?.udf14}`} */}
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
                                                <h5 className="card-title">Make payment to activate the selected plan.</h5>
                                                <h5 className="card-title">Amount : {selectedPlan[0]?.actual_price} INR</h5>
                                                <h5 className="card-title">Plan Name : {selectedPlan[0]?.plan_name}</h5>
                                                {/* <h5 className="card-title">Amount : {selectedPlan[0]?.planPrice}</h5> */}
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