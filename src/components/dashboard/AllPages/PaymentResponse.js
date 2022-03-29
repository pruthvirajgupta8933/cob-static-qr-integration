import React from 'react'
import {useLocation} from "react-router-dom"


function PaymentResponse() {
    const search = useLocation().search;
    const urlParam = new URLSearchParams(search);
    const SabPaisaTxId = urlParam.get('SabPaisaTxId');
    const name = urlParam.get('name');
    const payMode = urlParam.get('payMode');
    const transDate = urlParam.get('transDate');
    const spRespStatus = urlParam.get('spRespStatus');
    const reMsg = urlParam.get('reMsg');
    const clientCode = urlParam.get('clientCode');

  
  return (
    <div className="card" style={{"width": "100%"}}>
    <div className="card-header">
    Payment Response
  </div>
        <ul className="list-group list-group-flush">
            <li className="list-group-item">SabPaisaTxId : {SabPaisaTxId}</li>
            <li className="list-group-item">Full Name : {name}</li>
            <li className="list-group-item">Payment Mode : {payMode}</li>
            <li className="list-group-item">Transaction Date : {transDate}</li>
            <li className="list-group-item">Payment Status : {spRespStatus}</li>
            <li className="list-group-item">Message : {reMsg}</li>
        </ul>
       
        </div>
  )
}

export default PaymentResponse