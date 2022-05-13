import { CatchingPokemonSharp } from '@mui/icons-material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import {useLocation} from "react-router-dom"
import API_URL from '../../../config';
import { UtcDateToIsoDate } from '../../../utilities/emandateDateFormat';




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

// console.log(clientMerchantDetailsList);
  
  useEffect(() => {
    if(clientCode !== clientMerchantDetailsList[0].clientCode){
      console.log("Client details does not match!")
    }else{
      console.log("match code")
      setVerifyClientCode(true)
    }

    
  }, [clientCode])

  useEffect(() => {
  
    // console.log("verifyClientCode",verifyClientCode)
    if(verifyClientCode){
   

      const selectedPlan = JSON.parse(localStorage?.getItem("selectedPlan"));
      const subscriptionData = JSON.parse(localStorage?.getItem("subscriptionData"));
      var newArray = subscriptionData.filter( (el)=>
      {
        return el.applicationId ===selectedPlan.applicationId;
      }
    );
  
    var subcribePlan =  newArray[0].planMaster.filter((sp)=>{
      return sp.planId===selectedPlan.planId
    });
  
  
    const {planPrice,planValidityDays} = subcribePlan[0];
    const ed = new Date();
    var mandateStartDate = '';
    mandateStartDate = new Date(ed).toISOString();
    var mandateEndDate = ed.setDate(ed.getDate()+ planValidityDays);
    mandateEndDate = new Date(mandateEndDate).toISOString();
    
      
    console.log(mandateStartDate)
      
    const postData = {
      clientCode:"70",
      mandateRegistrationId: SabPaisaTxId,
      umrn:"0",
      paymentMode:payMode,
      mandateBankName:"null",
      mandateFrequency:"ADHO",
      mandateStatus: spRespStatus.toLowerCase(),
      purchasAmount: parseFloat(planPrice,2),
      clientId:clientMerchantDetailsList[0].clientId.toString(),
      clientName:clientMerchantDetailsList[0].clientName,
      applicationId:selectedPlan.applicationId,
      applicationName: selectedPlan.applicationName,
      planId: selectedPlan.planId,
      planName: selectedPlan.planName,
      bankRef: "null",
      clientTxnId : SabPaisaTxId,
      mandateRegTime: UtcDateToIsoDate(transDate+ ' UTC'),
      mandateStartTime : mandateStartDate,
      mandateEndTime  : mandateEndDate,
  };
  console.log(postData)
  axios.post(API_URL.SUBSCRIBE_FETCH_APP_AND_PLAN,postData).then((response)=>{
    // console.log(response)
}).catch(error=>console.log(error))

  
    }
  

  }, [verifyClientCode])
  
  
  
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