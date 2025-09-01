
import React, { useState } from 'react'

import { useRouteMatch, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { axiosInstanceJWT } from '../../../../utilities/axiosInstance'
import API_URL from '../../../../config'


function SelectProductPlan(props) {
    const { plans } = props

    const history = useHistory()
    const [buttonLoader, setButtonLoader] = useState(false)
    const { auth } = useSelector(state => state)
    const { path } = useRouteMatch();
    const clientId = auth?.user?.clientMerchantDetailsList[0]?.clientId


    const getSubscribedPlan = (appId) => {
        setButtonLoader(true)

        axiosInstanceJWT
            .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": appId })
            .then((resp) => {
                setButtonLoader(false)
                history.push(`${path}/sabpaisa-pg/${plans.clientSubscribedPlanDetailsId}/${appId}/charge`)
            }).catch(err => setButtonLoader(false))
    }

    return (
        <div>
            <hr />
            <button className="btn cob-btn-primary text-white btn-sm" disabled={buttonLoader} onClick={() => getSubscribedPlan(plans?.applicationId)}>
                Make Payment {buttonLoader && <>
                    <span className="spinner-border spinner-border-sm" role="status" ariaHidden="true" />
                    <span className="sr-only">Loading...</span>
                </>}
            </button>
        </div>
    )
}

export default SelectProductPlan