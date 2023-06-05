import React from 'react'
import sabpaisalogo from "../../assets/images/sabpaisalogo.png"
import TransactionEnqMultiParam from '../dashboard/AllPages/TransactionEnqMultiParam'


function ViewTransactionDetails() {
  return (
    <div className="container-fluid">
    <nav className="navbar navbar-light bg-light mb-5">
    <img className="navbar-brand" style={{width:"120px"}} src={sabpaisalogo} alt="sabpaisa"  />
    </nav>
        <TransactionEnqMultiParam />
    </div> 
  )
}

export default ViewTransactionDetails