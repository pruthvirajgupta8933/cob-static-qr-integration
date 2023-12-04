import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useEffect } from 'react';
import { merchantSubscribedPlanData } from '../../../../slices/merchant-slice/productCatalogueSlice';


function WalletDetail() {

    const dispatch = useDispatch();

    const { auth, productCatalogueSlice } = useSelector((state) => state);
    const { user } = auth
    const { SubscribedPlanData } = productCatalogueSlice

    const clientId = user.clientMerchantDetailsList[0]?.clientId
    useEffect(() => {

        // console.log(auth)
        const postData = {
            clientId: clientId
        }
        // console.log("postData", postData)
        dispatch(merchantSubscribedPlanData(postData))
    }, [clientId])




    return (
        <div className="row">
            {SubscribedPlanData?.map((data, i) => (
                data?.plan_code === "005" && data?.mandateStatus && (
                    <div className="col-lg-4 mx-3">
                        <div className="card" style={{ width: '18rem' }}>
                            <div className="card-body">
                                <h5 className="card-title">{data.applicationName}</h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">{data.planName}</h6>
                                <hr />
                                <p className="card-text">Purchased Amount : {data.purchaseAmount} INR</p>
                                <p className="card-text">Wallet Balance : {parseFloat(data.purchaseAmount) - parseFloat(data.commission)} INR</p>

                            </div>
                        </div>
                    </div>
                )


            ))}

            {SubscribedPlanData?.length === 0 && <h6>Checking subscribed products...</h6>}

        </div>

    )
}

export default WalletDetail