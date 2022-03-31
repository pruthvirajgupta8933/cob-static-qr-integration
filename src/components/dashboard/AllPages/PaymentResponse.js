import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {useLocation} from "react-router-dom"



function PaymentResponse() {

    const {user} = useSelector(state=>state.auth)
    const {clientMerchantDetailsList} = user;


    const search = useLocation().search;
    const urlParam = new URLSearchParams(search);
    const SabPaisaTxId = urlParam.get('SabPaisaTxId');
    const name = urlParam.get('name');
    const payMode = urlParam.get('payMode');
    const transDate = urlParam.get('transDate');
    const spRespStatus = urlParam.get('spRespStatus');
    const reMsg = urlParam.get('reMsg');
    const clientCode = urlParam.get('clientCode');
    const [verifyClientCode, setVerifyClientCode] = useState(false)


  
  useEffect(() => {
    if(clientCode !== clientMerchantDetailsList[0].clientCode){
      console.log("Client details does not match!")
    }else{
      console.log("match code")
      setVerifyClientCode(true)
    }
  

  }, [clientCode])
  
  if(verifyClientCode){
    const selectedPlan = JSON.parse(localStorage?.getItem("selectedPlan"));
    
  }
  
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