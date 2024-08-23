import React from 'react'

function SubscribeProductList({ SubscribedPlanData }) {

    


    const filterSubscibedData  = SubscribedPlanData
    ?.filter(
        (item) =>
            item?.status?.toLowerCase() === 'verified' &&
            item?.subscription_status?.toLowerCase() === 'subscribed'
    )



    return (
        <div className="row mb-4 border p-1">
            <h5>Subscribed Product List</h5>
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

                        {filterSubscibedData
                            .map((item, index) => {
                                // console.log("item", item.mandateStatus);
                                return (item?.mandateStatus?.toLowerCase() === 'success' && item?.plan_code == '005') || item?.plan_code != '005' ? (
                                    <tr key={index}>
                                        <td>{item?.applicationName}</td>
                                        <td>{item?.planName}</td>
                                        <td>{item?.subscription_status}</td>
                                    </tr>
                                ) : <></>;
                            })}

                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SubscribeProductList