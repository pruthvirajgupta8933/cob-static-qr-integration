// import { isNull } from 'lodash';
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function WalletRecharge() {
    const { productCatalogueSlice } = useSelector(
        (state) => state
    );
    const history = useHistory()
    // const { path } = useRouteMatch();

    const { SubscribedPlanData } = productCatalogueSlice;

    const productList = useMemo(() => {

        const planFilter = SubscribedPlanData?.filter(
            (d) => d?.plan_code === "005"
        );

        const data = planFilter.reduce((preVal, curr) => {
            // If the applicationName key doesn't exist, initialize it with an array

            // using mandate status to check user has aleady plan. this feature is for recharge the existing plan
            if (!preVal[curr.applicationName]) {
                preVal[curr.applicationName] = [];
            }

            preVal[curr.applicationName].push(curr);
            // Push the current object to the corresponding applicationName array
            // if (curr.mandateStatus?.toLowerCase() === 'success') {
            //     preVal[curr.applicationName].push(curr);
            // }

            return preVal;

        }, {})

        return data
    }, [SubscribedPlanData]);


    const paymentHandler = (selectedProduct) => {
        history.push(`sabpaisa-pg/${selectedProduct.clientSubscribedPlanDetailsId}/${selectedProduct.applicationId}/recharge`)
    }


    return (
        <div className="row">
            {Object.keys(productList)?.map((item, i) => (
                <div className="col p-2 m-2 card" key={i}>
                    <h5 className="text-primary ">{productList[item][0].applicationName}</h5>
                    <h6 className="mb-4">Plan Name: {productList[item][0].planName}</h6>
                    <button className="btn cob-btn-primary btn-sm" onClick={() => paymentHandler(productList[item][0])}>Select</button>
                </div>
            ))}

        </div>
    )
}

export default WalletRecharge