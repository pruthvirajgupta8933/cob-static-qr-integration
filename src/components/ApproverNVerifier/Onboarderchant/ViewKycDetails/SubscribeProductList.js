// import React from 'react'
function SubscribeProductList({ SubscribedPlanData }) {

    // const filterSubscibedData = SubscribedPlanData
    //     ?.filter(
    //         (item) =>
    //             item?.status?.toLowerCase() === 'verified' &&
    //             item?.subscription_status?.toLowerCase() === 'subscribed'
    //     )



    return (
        <div className="row mb-4 border p-1">
            <h6>Subscribed Product List</h6>
            <div>
                <table class="table mt-3">
                    <thead>
                        <tr>
                            <th>Sno.</th>
                            <th>Product</th>
                            <th>Plan</th>
                            <th>Purchased Amount (INR)</th>
                            <th>Status</th>
                            <th>Subscription Status</th>

                        </tr>
                    </thead>
                    <tbody>

                        {SubscribedPlanData?.length > 0 ? SubscribedPlanData
                            .map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.applicationName}</td>
                                        <td>{item?.planName}</td>
                                        <td>{item?.purchaseAmount}</td>
                                        <td>{item?.status}</td>
                                        <td>{item?.subscription_status}</td>

                                    </tr>
                                )
                            }) : <tr><td colSpan="3">No Subscribed Plans Found</td></tr>}
                        {/* {filterSubscibedData
                            .map((item, index) => {
                                // console.log("item", item.mandateStatus);
                                return (item?.mandateStatus?.toLowerCase() === 'success' && item?.plan_code == '005') || item?.plan_code != '005' ? (
                                    <tr key={index}>
                                        <td>{item?.applicationName}</td>
                                        <td>{item?.planName}</td>
                                        <td>{item?.subscription_status}</td>
                                    </tr>
                                ) : <></>;
                            })} */}

                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SubscribeProductList