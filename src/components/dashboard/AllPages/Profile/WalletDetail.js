import React from 'react'
import Table from '../../../../_components/table_components/table/Table'
import { useSelector } from 'react-redux';

function WalletDetail() {
    const { subscription } = useSelector((state) => state);
    const { merchantSubscriptionList } = subscription

    const rowHeader = [
        {
            id: "2",
            name: "Application Name",
            selector: (row) => row.applicationName
        },
        {
            id: "4",
            name: "Plan Name",
            selector: (row) => row.planName,
        },

        {
            id: "3",
            name: "Purchase Amount",
            selector: (row) => parseFloat(row.purchaseAmount).toFixed(2),
        },

        {
            id: "5",
            name: "Subscription Status",
            selector: (row) => row.subscription_status,
        }
    ];



    return (
        <div className="row">
            <div className="scroll overflow-auto">
                <Table
                    row={rowHeader}
                    data={merchantSubscriptionList?.result}
                />
            </div>
        </div>
    )
}

export default WalletDetail