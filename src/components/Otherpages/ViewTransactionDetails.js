import React from 'react'
import TransactionEnqMultiParam from '../dashboard/AllPages/TransactionEnqMultiParam'
import Header from '../mainComponent/header/Header'


function ViewTransactionDetails() {
  return (
    <div >
      <Header display_bg_color={true} />
      <TransactionEnqMultiParam />
    </div>
  )
}

export default ViewTransactionDetails