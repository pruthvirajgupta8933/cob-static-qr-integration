import React from 'react'
import Table from '../../../../_components/table_components/table/Table'
import { subscriptionWalletTableCol } from '../../../../utilities/tableData'

function WalletDetail({ isLoading, walletDisplayData, walletCommission }) {
    // console.log("walletDisplayData", walletDisplayData)
    const purchaseAmt = walletDisplayData?.reduce((accumulator, currentValue) => accumulator + currentValue.purchaseAmount, 0);

    return (
        <div className="row">
            {/* {walletDisplayData */}
            <div className="col-lg-12 my-2">
                <span className="font-size-14">
                    Total Purchase Amount: {purchaseAmt.toFixed(2)} |
                    Commission: {parseFloat(walletCommission).toFixed(2)} |
                    Wallet Balance: {(purchaseAmt - parseFloat(walletCommission)).toFixed(2)}
                </span>           </div>
            <div className="col-lg-12">

                <Table
                    row={subscriptionWalletTableCol}
                    dataCount={0}
                    data={walletDisplayData}
                />
            </div>

            {isLoading && <h6 className='text-center'>Loading...</h6>}
        </div>
    )
}

export default WalletDetail