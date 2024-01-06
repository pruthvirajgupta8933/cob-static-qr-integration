import React, { useState, useEffect } from 'react'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import NavBar from '../dashboard/NavBar/NavBar'
import { useDispatch, useSelector } from 'react-redux'
import { productPlanData, updateSubscribeDetails } from '../../slices/merchant-slice/productCatalogueSlice'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { createClientTxnId } from '../../services/merchant-service/prouduct-catalogue.service'
import { toast } from "react-toastify";
import { Link, useParams } from 'react-router-dom'
import { isNull } from 'lodash'
import payment_default_gif from "../../assets/images/image_processing20201113-8803-s9v2bo.gif"
import payment_response_gif from "../../assets/images/image_processing20210906-19522-9n3ter.gif"
import classes from "./pg.module.css"
import { axiosInstanceJWT } from '../../utilities/axiosInstance'
import API_URL from '../../config'

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
    const { SubscribedPlanData } = productCatalogueSlice
    const { subscribeId, applicationid } = useParams();

    const clientId = auth?.user?.clientMerchantDetailsList[0]?.clientId


    const productPlans = productCatalogueSlice.productPlanData
    // console.log("selectedPlan", selectedPlan)
    // console.log("productPlans", productPlans)

    const planFilterData = productPlans?.filter((p) => p.plan_code === selectedPlan?.[0]?.plan_code && p?.plan_id === selectedPlan?.[0]?.planId)

    // console.log("planFilterData", planFilterData)
    useEffect(() => {
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

            } else {
                toast.error("Your Transaction is not completed")
            }

        } else {

            axiosInstanceJWT
                .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": applicationid })
                .then((resp) => {
                    // console.log("resp", resp)
                    const unPaidProduct = resp?.data?.data?.filter((d) => (
                        (isNull(d?.mandateStatus) || d?.mandateStatus === "pending") &&
                        (d?.clientSubscribedPlanDetailsId.toString() === subscribeId.toString())))
                    if (unPaidProduct?.length > 0) {
                        setSelectedPlanCode(unPaidProduct[0]?.plan_code)
                        setSelectedPlan(unPaidProduct)
                        // setSelectedPlan()
                        // const postBody = { "app_id": unPaidProduct[0]?.applicationId }
                        // console.log("postBody", postBody)
                        // dispatch(productPlanData(postBody))
                    } else {
                        history.push("/dashboard")
                        // console.log("redirect to dashboard")
                    }
                    // console.log(resp?.data?.data[0])
                    // setSelectedPlan(resp?.data?.data[0])
                    // setButtonLoader(false)
                    // history.push(`${path}/sabpaisa-pg/${resp?.data?.data[0].clientSubscribedPlanDetailsId}`)
                    // return <Redirect to={} />;
                }).catch(err => console.log(err))


        }

        return () => {
            setRespFromServerFlag(false)
            setIsOpenPg(false)
        }

    }, [])


    useEffect(() => {
        const postBody = { "app_id": applicationid }
        dispatch(productPlanData(postBody))

    }, [applicationid])


    const getClientTxnId = async (planFilterData, userData) => {

        if (planFilterData?.length <= 0 && planFilterData?.[0]?.actual_price === "") {
            history.push("/dashboard")
        }

        const postBody = {
            "clientSubscribedPlanDetailsId": subscribeId,
            "appId": planFilterData?.[0]?.app_id,
            "planId": planFilterData?.[0]?.plan_id,
            "clientCode": userData?.clientMerchantDetailsList[0]?.clientCode,
            "clientName": userData?.clientMerchantDetailsList[0]?.clientName,
            "clientId": userData?.clientMerchantDetailsList[0]?.clientId,
            "purchaseAmount": planFilterData?.[0]?.actual_price
        }

        let data = await createClientTxnId(postBody)
        if (data?.status === 200) {
            if (data?.data?.status === 200) {
                setNewClientTxnId(data?.data?.data)
                setIsOpenPg(true)
            } else {
                setIsOpenPg(false)
                // console.log("erro")
            }
        } else {
            setIsOpenPg(false)
            // console.log("error")
        }
    }

    // console.log("selectedPlan", selectedPlan)

    return (
        <React.Fragment>
            <section className="ant-layout">
                <SabpaisaPaymentGateway planData={planFilterData} clientTxnId={newClientTxnId} openPg={isOpenPg} clientData={auth?.user} subscribeId={subscribeId} />
                <main className="gx-layout-content ant-layout-content">
                    <div className="gx-main-content-wrapper">
                        <div className="right_layout my_account_wrapper right_side_heading">
                            <h5 className="m-b-sm gx-float-left">Payment</h5>
                        </div>
                        <section className="features8 cid-sg6XYTl25a" id="features08-3-">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <img src={reponseFromServerFlag ? payment_default_gif : payment_response_gif} alt="payment" className={`${classes.image}`} />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="card">
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
                                                    <Link className="btn  cob-btn-primary btn-sm" to="/dashboard">Back to Dashboard</Link>
                                                </div>
                                                :
                                                <div className="card-body">
                                                    <h5 className="card-title">Make payment to activate the selected plan.</h5>
                                                    <p className="card-title">Amount : {planFilterData?.[0]?.actual_price} INR</p>
                                                    <p className="card-title">Plan Name : {planFilterData?.[0]?.plan_name}</p>
                                                    <button onClick={() => { getClientTxnId(planFilterData, auth?.user) }} className="btn  cob-btn-primary btn-sm">Pay Now</button>
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