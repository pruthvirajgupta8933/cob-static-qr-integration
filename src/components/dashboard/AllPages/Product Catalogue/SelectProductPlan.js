
import React, { useEffect, useMemo, useState } from 'react'
import { fetchProductPlan } from '../../../../services/merchant-service/prouduct-catalogue.service'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { axiosInstanceJWT } from '../../../../utilities/axiosInstance'
import API_URL from '../../../../config'
import toastConfig from '../../../../utilities/toastTypes'
import { v4 as uuidv4 } from 'uuid';

// import { } from 'react-router-dom/cjs/react-router-dom.min'
// import { useHistory } from "react-router-dom";


function SelectProductPlan(props) {
    const { plans } = props
    const history = useHistory()
    const [productPlanData, setProductPlanData] = useState([])
    const [buttonLoader, setButtonLoader] = useState(false)
    const [radioSelectPlan, setRadioSelectPlan] = useState({})
    const { auth } = useSelector(state => state)
    const { path } = useRouteMatch();
    const clientId = auth?.user?.clientMerchantDetailsList[0]?.clientId

    const selectProductPlan = useMemo(() => {
        return plans
    }, [plans])

    useEffect(() => {
        // console.log("selectProductPlan", selectProductPlan)
        fetchProductPlan({ app_id: selectProductPlan.applicationId }).then(resp => {
            const subscriptionPlanCode = resp?.data?.ProductDetail.filter((data) => data.plan_code === "005")
            setProductPlanData(subscriptionPlanCode)
        }).catch(err => console.log("err", err))
        // console.log("selectProductPlan", selectProductPlan)
        setRadioSelectPlan({ applicationId: selectProductPlan?.applicationId, applicationName: selectProductPlan?.applicationName, planId: selectProductPlan?.planId, planName: selectProductPlan?.planName, clientId })

    }, [selectProductPlan])


    const radioHandler = (obj) => {
        const data = { applicationId: obj?.app_id, applicationName: "app name", planId: obj?.plan_id, planName: obj?.plan_name, clientId, purchaseAmount: parseFloat(obj?.actual_price) }
        // console.log("data", data)
        axiosInstanceJWT.post(
            API_URL.SUBSCRIBE_FETCHAPPAND_PLAN,
            data
        ).then(res => {
            if (res?.status === 200) {
                setRadioSelectPlan(data)
                //   getSubscribedPlan(param?.id);
                //   setModalToggle(true)
            }

        }).catch(error => toastConfig.errorToast(error.response?.data?.detail))
    }

    // console.log("radioSelectPlan", radioSelectPlan)
    const getSubscribedPlan = (appId) => {
        setButtonLoader(true)
        // console.log({ "clientId": clientId, "applicationId": appId })
        axiosInstanceJWT
            .post(API_URL.Get_Subscribed_Plan_Detail_By_ClientId, { "clientId": clientId, "applicationId": appId })
            .then((resp) => {
                // console.log(resp?.data?.data[0])
                // setSelectedPlan(resp?.data?.data[0])
                setButtonLoader(false)
                history.push(`${path}/sabpaisa-pg/${resp?.data?.data[0].clientSubscribedPlanDetailsId}/${appId}`)
                // return <Redirect to={} />;
            }).catch(err => setButtonLoader(false))


    }

    return (
        <div>
            <div className='d-flex justify-content-start'>
                {productPlanData?.map((item, i) => (
                    <div className="form-check mx-2" key={uuidv4()}>
                        {/* {console.log("item", item)} */}
                        <input className="form-check-input"
                            type="radio"
                            name={`plan_${item?.app_id}`}
                            value={item?.plan_id}
                            onChange={() => radioHandler(item)}
                            checked={radioSelectPlan?.planId === item?.plan_id}
                        />

                        <label className="form-check-label" htmlFor="">
                            {item.plan_price}
                        </label>
                    </div>
                ))}
            </div>
            <hr />
            <button className="btn cob-btn-primary text-white btn-sm" disabled={buttonLoader} onClick={() => getSubscribedPlan(radioSelectPlan?.applicationId)}>
                Make Payment {buttonLoader && <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span className="sr-only">Loading...</span>
                </>}
            </button>
        </div>
    )
}

export default SelectProductPlan