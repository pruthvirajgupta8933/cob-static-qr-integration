import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { isNull, map } from 'lodash'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import API_URL from '../../config'
import { axiosInstanceAuth } from '../../utilities/axiosInstance'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material'


function SpPg() {

    const history = useHistory()
    const params = useParams()
    const [selectedPlan, setSelectedPlan] = useState({})
    const [planPrice, setPlanPrice] = useState(9999)
    const [clientData, setClientData] = useState({})
    const [responseData, setResponseData] = useState({})
    const [isOpenPg, setIsOpenPg] = useState(false)



    useEffect(() => {

        const sessionData = JSON.parse(sessionStorage.getItem("tempProductPlanData"))
        const user = JSON.parse(localStorage.getItem("user"))


        setClientData(user?.clientMerchantDetailsList[0]?.clientName)

        if (isNull(sessionData) || isNull(user)) {
            history.push("/dashboard")
        }

        console.log("session storage", sessionData)
        fetchDataByProductId(sessionData?.applicationId, sessionData?.planId)
        setSelectedPlan(sessionData)


        return () => {
            setIsOpenPg(false)
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
                // setPlanPrice(plan?.actual_price)
                console.log("take price from it", plan)

            })
    }


    useEffect(() => {

        const searchParam = window.location.search.slice(1)
        const params = new URLSearchParams(searchParam?.toString());
        
        const paramsData = Object.fromEntries(params.entries());
        if(paramsData!==""){
            setResponseData(paramsData)

        }

        
    }, [])
    
    // const Response  = Object.keys(responseData)?.map(d=>{
    //     console.log(d)
    //     // <span>{Object.keys(d)} : {responseData?.d}</span>
    // })

    // console.log(Response)


    return (
        <React.Fragment>
            <button onClick={() => { setIsOpenPg(true) }} className="btn btn-primary">Pay Now</button>

            <SabpaisaPaymentGateway planData={selectedPlan} planPrice={planPrice} openPg={isOpenPg} />

            <div>{JSON.stringify(responseData)}</div>


        </React.Fragment>
    )
}

export default SpPg