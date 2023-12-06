import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useEffect } from 'react';
import { merchantSubscribedPlanData } from '../../../../slices/merchant-slice/productCatalogueSlice';
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import moment from 'moment';


function WalletDetail() {

    const dispatch = useDispatch();
    const { auth, productCatalogueSlice } = useSelector((state) => state);
    const { user } = auth
    const { SubscribedPlanData, isLoading } = productCatalogueSlice

    const clientId = user.clientMerchantDetailsList[0]?.clientId

    useEffect(() => {
        const postData = {
            clientId: clientId
        }
        // console.log("postData", postData)
        dispatch(merchantSubscribedPlanData(postData))
    }, [clientId])


    const balanceCalculate = (purchaseAmount, commission) => {
        const total = parseFloat(purchaseAmount) - parseFloat(commission)
        return isNaN(total) ? 0.00 : total.toFixed(2)
    }



    // const data = SubscribedPlanData?.filter((d, i) => d?.plan_code === "005" && d?.mandateStatus && (
    //     <div className="col-lg-4 mx-3 my-1" key={i}>
    //         <div className="card" style={{ width: '18rem' }}>
    //             <div className="card-body">
    //                 <h5 className="card-title">{d.applicationName}</h5>
    //                 <h6 className="card-subtitle mb-2 text-body-secondary">{d.planName}</h6>
    //                 <hr />
    //                 <p className="card-text">Purchased Amount : {d.purchaseAmount} INR</p>
    //                 <p className="card-text">Wallet Balance : {balanceCalculate(d.purchaseAmount, d.commission)} INR</p>

    //             </div>
    //         </div>
    //     </div>))

    // console.log(data)

    return (
        <div className="row">
            {SubscribedPlanData?.map((data, i) => (
                data?.mandateStatus === "SUCCESS" && (
                    <div className="col-lg-4 mx-3 my-1" key={i}>
                        <div className="card" style={{ width: '18rem' }}>
                            <div className="card-body">
                                <h5 className="card-title">{data.applicationName}</h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">{data.planName}</h6>
                                <hr />
                                {data?.plan_code === "005" && <>
                                    <p className="card-text">Subscribed Date : {moment(data.mandateStartTime).format('DD/MM/YYYY')} </p>
                                    <p className="card-text">Purchased Amount : {data.purchaseAmount} INR</p>
                                    <p className="card-text">Wallet Balance : {balanceCalculate(data.purchaseAmount, data.commission)} INR</p>
                                </>}


                            </div>
                        </div>
                    </div>
                )
            ))}
            {isLoading && <h6 className='text-center'>Loading...</h6>}


        </div>

    )
}

export default WalletDetail