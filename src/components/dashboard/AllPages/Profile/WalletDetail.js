import React from 'react'
function WalletDetail({ isLoading, walletDisplayData }) {
    return (
        <div className="row">
            {walletDisplayData}
            {isLoading && <h6 className='text-center'>Loading...</h6>}
        </div>
    )
}

export default WalletDetail