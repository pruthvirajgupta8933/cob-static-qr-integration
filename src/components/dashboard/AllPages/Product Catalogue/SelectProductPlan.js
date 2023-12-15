
import React, { useEffect, useMemo, useState } from 'react'
import { fetchProductPlan } from '../../../../services/merchant-service/prouduct-catalogue.service'
import { Link } from 'react-router-dom'


function SelectProductPlan(props) {
    const { plans } = props
    const [productPlanData, setProductPlanData] = useState([])
    const [radioSelectPlan, setRadioSelectPlan] = useState({})

    console.log("productPlanData", productPlanData)

    const selectProductPlan = useMemo(() => {
        return plans
    }, [plans])

    useEffect(() => {
        // console.log("selectProductPlan", selectProductPlan)
        fetchProductPlan({ app_id: selectProductPlan.applicationId }).then(resp => {
            const subscriptionPlanCode = resp?.data?.ProductDetail.filter((data) => data.plan_code === "005")
            setProductPlanData(subscriptionPlanCode)
        }).catch(err => console.log("err", err))

        setRadioSelectPlan({ planId: selectProductPlan?.planId })

    }, [selectProductPlan])


    const radioHandler = (obj) => {
        setRadioSelectPlan({ planId: obj?.plan_id })

    }

    return (
        <div>
            <div>
                {productPlanData?.map((item, i) => (
                    <div className="form-check">
                        {/* {console.log(radioSelectPlan?.planId, item?.plan_id)} */}
                        <input className="form-check-input"
                            type="radio"
                            name={`plan_${item?.app_id}`}
                            value={item?.plan_id}
                            onChange={() => radioHandler({ plan_id: item?.plan_id })}
                            checked={radioSelectPlan?.planId === item?.plan_id}
                        />

                        <label className="form-check-label" htmlFor="">
                            {item.plan_price}
                        </label>
                    </div>
                ))}
            </div>
            <hr />
            <Link className="btn cob-btn-primary text-white btn-sm" to={`dashboard/sabpaisa-pg/`}>Make Payment</Link>
        </div>
    )
}

export default SelectProductPlan