// import { isNull } from 'lodash';
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { subscribeFetchAppAndPlan } from '../../../../slices/merchant-slice/productCatalogueSlice';
import toastConfig from '../../../../utilities/toastTypes';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function WalletRecharge() {

    const dispatch = useDispatch()
    const { productCatalogueSlice } = useSelector(
        (state) => state
    );
    const history = useHistory()
    // const { path } = useRouteMatch();

    const { SubscribedPlanData } = productCatalogueSlice;

    // this feature is for recharge the existing plan
    const productList = useMemo(() => {

        const planFilter = SubscribedPlanData?.filter(
            (d) => d?.plan_code === "005"
        );

        const data = planFilter.reduce((preVal, curr) => {
            // If the applicationName key doesn't exist, initialize it with an array
            if (!preVal[curr.applicationName]) {
                preVal[curr.applicationName] = [];
            }

            preVal[curr.applicationName].push(curr);
            return preVal;

        }, {})

        return data
    }, [SubscribedPlanData]);


    const paymentHandler = (selectedProduct) => {
        const { clientId, applicationName, planId, planName, applicationId } = selectedProduct
        const postData = {
            clientId: clientId,
            applicationName: applicationName,
            planId: planId,
            planName: planName,
            applicationId: applicationId,
        };


        dispatch(subscribeFetchAppAndPlan(postData))
            .then(res => {
                if (res?.meta.requestStatus === "fulfilled") {
                    history.push(`sabpaisa-pg/${res.payload?.subscription_id}/${applicationId}/charge`)
                }
            }).catch(error => toastConfig.errorToast(error.response?.data?.detail))
    }


    return (
        <div className="row">
            {Object.keys(productList)?.map((item, i) => (
                <div className="col p-2 m-2 card" key={i}>
                    <h6 className="text-primary ">{productList[item][0].applicationName}</h6>
                    <p className="mb-4">Plan Name: {productList[item][0].planName}</p>
                    <button className="btn cob-btn-primary btn-sm" onClick={() => paymentHandler(productList[item][0])}>Select</button>
                </div>
            ))}

        </div>
    )
}

export default WalletRecharge