import React from 'react'

function SubscribeProductList({ SubscribedPlanData }) {
    return (
        <div className="row mb-4 border p-1">
            <h5>Subscribe Product List</h5>
            <div>
                <table class="table mt-3">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Plan</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>

                        {SubscribedPlanData?.filter((item) => item?.status?.toLowerCase() === 'verified' && item?.subscription_status?.toLowerCase() === 'subscribed').map((item, index) => {
                            return (
                                <tr>
                                    <td >{item?.applicationName}</td>
                                    <td>{item?.planName}</td>
                                    <td>{item?.subscription_status}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SubscribeProductList