
import React from 'react';

import { useState, useEffect } from "react";
import {useParams,useLocation} from "react-router-dom"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ArrayToDate } from '../../../utilities/emandateDateFormat';
import { ceil } from 'lodash';


// import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';


const Emandate = () => {
    const {user} = useSelector((state)=>state.auth);
    const { clientId,clientName } =user.clientMerchantDetailsList[0];
    const search = useLocation().search;
    const mendateRegIdParam = new URLSearchParams(search).get('mendateRegId');


  //  console.log(mendateRegIdParam);

  const [details,setDetails] = useState([]);
    const baseUrl = "https://subscription.sabpaisa.in/subscription/npci/registration/status/";
    const mandateRegId = mendateRegIdParam;
    const getManteDetails = (mandateRegId)=>{
    const mandateDetails = axios.get(baseUrl+mandateRegId).then((response)=>{
            
            setDetails(response.data);
    }).catch(error => console.log(error,"error"));
  }

  useEffect(()=>{
    getManteDetails(mandateRegId);
},[]);

useEffect(() => {
    
    
    if(Object.values(details).length>0){
        // console.log(details.mandateStartDate)
        const selectedPlan = JSON.parse(localStorage?.getItem("selectedPlan"));
        const postData = {
            clientCode:details.clientCode.toString(),
            mandateRegistrationId:details.mandateRegistrationId +'22' ,
            umrn:details.umrnNumber,
            paymentMode:details.authenticationMode,
            mandateBankName:details.bankName,
            mandateFrequency:details.frequency,
            mandateStatus:details.regestrationStatus,
            purchasAmount:details.mandateMaxAmount,
            clientId:clientId.toString(),
            clientName:clientName,
            applicationId:selectedPlan.applicationId,
            applicationName: selectedPlan.applicationName,
            planId: selectedPlan.planId,
            planName: selectedPlan.planName,
            bankRef: details.regestrationNpciRefId,
            clientTxnId : details.clientRegistrationId,
            mandateRegTime: ArrayToDate(details.mandateRegTime),
            mandateStartTime : ArrayToDate(details.mandateStartDate),
            mandateEndTime  : ArrayToDate(details.mandateEndDate),
        };
        // console.log(postData)

        axios.post("https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",postData).then((response)=>{
            // console.log(response)
        }).catch(error=>console.log(error))
    }

}, [details]);



const detailsVal =Object.values(details);
const detailsKey =Object.keys(details);


const detailList = detailsKey.map((item,i)=>{
  return (
        <tr>
            <td>{item}</td>
            <td> {detailsVal[i]}</td>
         </tr>
       );
});



  return (    <section className="ant-layout">
  <div className="profileBarStatus">
    {/*  <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span class="btn">Upload Here</span></span></div>*/}
  </div>
  <main className="gx-layout-content ant-layout-content">
    <div className="gx-main-content-wrapper">
      <div className="right_layout my_account_wrapper right_side_heading">
        <h1 className="m-b-sm gx-float-left">E Mandate Details</h1>
      </div>
      <section className="features8 cid-sg6XYTl25a" id="features08-3-">
        <div className="container-fluid">
          <div className="row" style={{justifyContent: "center"}}>
            <div> 
            <table class="table">
                <tbody>
                    {detailList}
                </tbody>
            </table>
            </div>
       
          </div>
        </div></section>
    </div>
    <footer className="ant-layout-footer">
      <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
    </footer>
  </main>
</section>
  
  )
}

export default Emandate;
