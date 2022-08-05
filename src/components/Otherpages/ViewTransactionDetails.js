import React from 'react'
import sabpaisalogo from "../../assets/images/sabpaisalogo.png"
import TransactionEnqMultiParam from '../dashboard/AllPages/TransactionEnqMultiParam'


function ViewTransactionDetails() {
  return (
    <div className="container-fluid">
    <nav className="navbar navbar-light bg-light">
    <img className="navbar-brand" style={{width:"140px"}} src={sabpaisalogo} alt="sabpaisa"  />
    </nav>
        <TransactionEnqMultiParam />
    </div> 
  )
}

export default ViewTransactionDetails