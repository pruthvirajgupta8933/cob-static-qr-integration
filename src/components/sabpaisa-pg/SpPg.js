import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { isNull } from 'lodash'
import SabpaisaPaymentGateway from './SabpaisaPaymentGateway'
import API_URL from '../../config'
import { axiosInstanceAuth } from '../../utilities/axiosInstance'

function SpPg() {
    const history = useHistory()
    const [selectedPlan, setSelectedPlan] = useState({})
    const [planPrice, setPlanPrice] = useState(9999)
    const [clientData, setClientData] = useState({})
    const [isOpenPg, setIsOpenPg] = useState(false)



    useEffect(() => {

        const sessionData = JSON.parse(sessionStorage.getItem("tempProductPlanData"))
        const user = JSON.parse(localStorage.getItem("user"))

        
        setClientData(user?.clientMerchantDetailsList[0]?.clientName)

        if (isNull(sessionData) || isNull(user)) {
            history.push("/dashboard")
        }

        console.log("session storage",sessionData)
        fetchDataByProductId(sessionData?.applicationId, sessionData?.planId)
        setSelectedPlan(sessionData)
        setIsOpenPg(true)

        return () => {
            setIsOpenPg(false)
            setSelectedPlan({})
        }
    }, [])




    const fetchDataByProductId = (applicationId, planid) =>{
        
        let url = API_URL.PRODUCT_SUB_DETAILS + "/" + applicationId;
        axiosInstanceAuth
          .get(url)
          .then((resp) => {
            const data = resp.data.ProductDetail;
            const plan = data?.filter(p => p.plan_id===planid)
            // setPlanPrice(plan?.actual_price)
            console.log("take price from it",plan)

          })
    
    }


    return (
        <SabpaisaPaymentGateway planData={selectedPlan} planPrice={planPrice} openPg={isOpenPg} />
    )
}

export default SpPg