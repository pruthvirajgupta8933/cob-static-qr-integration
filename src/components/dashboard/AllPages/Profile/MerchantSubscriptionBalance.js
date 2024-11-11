import React, { useEffect, useState } from 'react'
import { subscriptionBalance } from '../../../../services/approver-dashboard/subscription-balance/subscription-balance.service';
import Table from '../../../../_components/table_components/table/Table';
import CustomLoader from '../../../../_components/loader';
import { useSelector } from 'react-redux';

function MerchantSubscriptionBalance() {
    const [balData, setBalData] = useState([]);
    const [loading, setLoading] = useState(false)
    const { auth } = useSelector((state) => state);
    const { user } = auth
    const clientCode = user.clientMerchantDetailsList[0]?.clientCode



    const fetchWalletBal = async () => {
        try {
            const respData = await subscriptionBalance({ clientCode: clientCode })
            setBalData(respData?.data?.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }

    }

    useEffect(() => {
        fetchWalletBal()
        return () => {
            setBalData([])
        }
    }, [])


    const rowHeader = [
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row.client_code
        },
        {
            id: "4",
            name: "Client Name",
            selector: (row) => row.clientName,
        },

        {
            id: "3",
            name: "Charges",
            selector: (row) => parseFloat(row.charges).toFixed(2),
        },


        {
            id: "5",
            name: "Initial Subscription Amount",
            selector: (row) => parseFloat(row.initial_subscription_amount).toFixed(2),
            width: "200px",
        },

        {
            id: "6",
            name: "Updated Subscription Amount",
            selector: (row) => parseFloat(row.updated_subscription_amount).toFixed(2),
            width: "200px",
        },

    ];

    return (
        <div className="container p-0">
            <div className="scroll overflow-auto">
                {!loading && (
                    <>
                        {balData?.length > 0 && <h6>Total Balance : INR {parseFloat(balData[0]?.updated_subscription_amount).toFixed(2)}</h6>}
                        <Table
                            row={rowHeader}
                            data={balData}

                        />
                    </>
                )}
            </div>
            <CustomLoader loadingState={loading} />
        </div>
    )
}

export default MerchantSubscriptionBalance