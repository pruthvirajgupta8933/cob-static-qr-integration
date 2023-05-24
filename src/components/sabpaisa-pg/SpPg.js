import React, { useState, useEffect } from 'react'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import NavBar from '../dashboard/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux'
import { productPlanData, updateSubscribeDetails } from '../../slices/merchant-slice/productCatalogueSlice'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { createClientTxnId } from '../../services/merchant-service/prouduct-catalogue.service'
import { toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom'
import {  isNull } from 'lodash'
import payment_default_gif from "../../assets/images/image_processing20201113-8803-s9v2bo.gif"
import payment_response_gif from "../../assets/images/image_processing20210906-19522-9n3ter.gif"

function SpPg() {

    const [selectedPlan, setSelectedPlan] = useState({})
    const [selectedPlanCode, setSelectedPlanCode] = useState("")

    const [responseData, setResponseData] = useState({})
    const [reponseFromServerFlag, setRespFromServerFlag] = useState(false)
    const [isOpenPg, setIsOpenPg] = useState(false)
    const [newClientTxnId, setNewClientTxnId] = useState("")


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

            if (queryStringData?.statusCode === "0000") {
                // if payment successful
                const updatePostData = {
                    "clientSubscribedPlanDetailsId": subscribeId,
                    "clientxnId": queryStringData?.clientTxnId,
                    "clientCode": queryStringData?.udf12, // get logined client code
                }
                // update the sucscription data as per the payment status
                dispatch(updateSubscribeDetails(updatePostData));
                toast.success("Your Transaction is completed")

            }else{
                toast.error("Your Transaction is not completed")
            }

        }else{

            if(unPaidProduct?.length>0){
                // console.log("continue")
                setSelectedPlanCode(unPaidProduct[0]?.plan_code)
                const postBody = {"app_id": unPaidProduct[0]?.applicationId}
                dispatch(productPlanData(postBody))
            }else{
                history.push("/dashboard")
                // console.log("redirect to dashboard")
            }
        }

        return () => {
            setRespFromServerFlag(false)
        }

    }, [])

    useEffect(() => {
        if(productCatalogueSlice?.productPlanData?.length>0){
            setSelectedPlan(productCatalogueSlice?.productPlanData?.filter((pd)=> (pd?.plan_code === selectedPlanCode)))
        }
    }, [productCatalogueSlice])




    const getClientTxnId = async (selectedPlan, userData)=>{
        const postBody = {
            "clientSubscribedPlanDetailsId": subscribeId,
            "appId": selectedPlan[0]?.app_id,
            "planId": selectedPlan[0]?.plan_id,
            "clientCode": userData?.clientMerchantDetailsList[0]?.clientCode,
            "clientName": userData?.clientMerchantDetailsList[0]?.clientName,
            "clientId": userData?.clientMerchantDetailsList[0]?.clientId,
            "purchaseAmount": selectedPlan[0]?.actual_price
        }

        let data = await createClientTxnId(postBody)
        if(data?.status===200){
            if(data?.data?.status===200){
                setNewClientTxnId(data?.data?.data)
                setIsOpenPg(true)
            }else{
                setIsOpenPg(false)
                console.log("erro")
            }
        }else{
            setIsOpenPg(false)
            console.log("error")
        }
    }


    return (
        <React.Fragment>
            <section className="ant-layout">
                
                <SabpaisaPaymentGateway planData={selectedPlan} clientTxnId={newClientTxnId} openPg={isOpenPg} clientData={auth?.user} subscribeId={subscribeId} />
                <main className="gx-layout-content ant-layout-content">
                    <div className="gx-main-content-wrapper">
                        <div className="right_layout my_account_wrapper right_side_heading">
                            <h1 className="m-b-sm gx-float-left">Payment</h1>
                        </div>
                        <section className="features8 cid-sg6XYTl25a" id="features08-3-">
                            <div className="container">
                            <div className="row">
                                <div className="col-lg-6">
                                    <img src={reponseFromServerFlag ? payment_default_gif: payment_response_gif} alt="payment" />
                                </div>
                                <div className="col-lg-6">
                                    <div className="card">
                                        <div className="card-header">
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
                                                <Link className="btn btn-primary" to="/dashboard">Back to Dashboard</Link>
                                            </div>
                                            :
                                            <div className="card-body">
                                                <h3 className="card-title">Make payment to activate the selected plan.</h3>
                                                <h4 className="card-title">Amount : {selectedPlan[0]?.actual_price} INR</h4>
                                                <h4 className="card-title">Plan Name : {selectedPlan[0]?.plan_name}</h4>
                                                {/* <h5 className="card-title">Amount : {selectedPlan[0]?.planPrice}</h5> */}
                                                {/* <p className="card-text">With supporting text below as a natural lead-in to additional content.</p> */}
                                                <button onClick={() => { getClientTxnId(selectedPlan, auth?.user) }} className="btn btn-primary">Pay Now</button>
                                            </div>
                                        }

                                    </div>
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