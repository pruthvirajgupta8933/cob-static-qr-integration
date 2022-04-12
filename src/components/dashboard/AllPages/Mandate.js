import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import { saveSubscribedPlan } from "../../../slices/dashboardSlice";

function Emandate(props) {
  
  const {user} = useSelector((state)=>state.auth);
  console.log(user)
  const { clientId,clientName,clientCode,clientEmail,address } =user.clientMerchantDetailsList[0];
  const { register, handleSubmit } = useForm();
  const [formData, setFormData] = useState({});
  const [makePayment,setMakePayment]= useState(false);
  const [spinnerOfPayment,setSpinnerOfPayment] = useState(false)

  const [displayMsg,setDisplayMsg]=useState("none" );
  // console.log("isModelClosed",formData.isModelClosed);
  useEffect(() => {
    setDisplayMsg(formData.isModelClosed ? 'block':'none');
  }, [formData])
  

  // console.log("displayMsg",displayMsg);
  const saveTrialPlanData = (data)=>{

    const postData = {
      clientCode:data.clientCode,
      mandateRegistrationId: (Math.floor(Math.random()*999999)*969685).toString() ,
      umrn: '0',
      paymentMode:data.authenticationMode,
      mandateBankName:data.payerBank,
      mandateFrequency:data.frequency,
      mandateStatus:'success',
      purchasAmount:data.mandateMaxAmount,
      clientId:clientId.toString(),
      clientName:clientName,
      applicationId:data.applicationId,
      applicationName: data.applicationName,
      planId: data.planId,
      planName: data.planName,
      bankRef: 'null',
      clientTxnId : data.clientRegistrationId.toString(),
      mandateRegTime: new Date().toISOString(),
      mandateStartTime : data.mandateStartDate,
      mandateEndTime  : data.mandateEndDate,
  };
  axios.post("https://spl.sabpaisa.in/client-subscription-service/subscribeFetchAppAndPlan",postData).then((response)=>{
            // console.log(response);
            setDisplayMsg('block');
            setTimeout(function() {
              window.location.reload();
            }, 3000);
        }).catch(error=>alert("Subscribe Unsuccessful. Please contact to our support team."))
  // console.log("post data trial",postData);
  }

  const onSubmit = (data) => {

    //formData has all the selected plan values
    if(formData.termAndCnd){
      
      const planData = {
        applicationId:formData.applicationId,
        applicationName:formData.applicationName,
        planId:formData.planId,
        planName:formData.planName,
      }
      localStorage.setItem("selectedPlan",JSON.stringify(planData))

      if(typeof formData.planId==='undefined'){
        alert("please Select the valid plan");
      }else{
        // console.log("formData",formData);
        if(formData.planType.toLowerCase() ==='trial'){
          saveTrialPlanData(formData);
        }else if(makePayment){
         
            setSpinnerOfPayment(true);
                  // http://localhost:5000/api
                  // https://node-server-test-2.herokuapp.com/api
                  var arrClientName = user.clientContactPersonName.split(" ")
                  var firstName = arrClientName[0];
                  var lastName = arrClientName[1];
                  if(typeof(arrClientName[1]) === 'undefined'){
                     lastName = "N/A";
                  }

                  // var firstName = arrClientName[0];
                  // var lastName = arrClientName[1];
            fetch("https://cob-node-server.herokuapp.com/getPg/pg-url/",{
              // Adding method type
              method: "POST",
              // Adding body or contents to send
              body: JSON.stringify({
                "payerFirstName": firstName,
                "payerLastName":lastName,
                "payerContact":user.clientMobileNo,
                "payerAddress":address,
                "payerEmail":clientEmail,
                "clientCode":clientCode,
                "tnxAmt":parseInt(formData.mandateMaxAmount)
            }),
               
              // Adding headers to the request
              headers: {
                  "Content-type": "application/json; charset=UTF-8"
              }
          }).then( 
              response => response.json()
            )
            .then(
              data =>{
                
                // setPaymentGatewayUrl(data)
                window.location.href = data.RedirectUrl;
              }
            )
        }else{
          setSpinnerOfPayment(false);
          // document.getElementById("mandateRegForm").submit()
        }
      }      
    }else{
      alert("Please Agree Term and Condition")
    }  //   prompt('copy post data',JSON.stringify(data));
  };

// const formData = props.bodyData;
useEffect(() => {
  setFormData(props.bodyData)
}, [props.bodyData]);


useEffect(() => {
    handleSubmit(onSubmit);
},[])

const thank_msg = {
  position: "absolute",
    width: "100%",
    background: "aquamarine",
    zIndex: "999",
    textAalign:" center",
    padding: "14px",
    margin: "14px",
    top: "5%",
    right: "0",
    left: "-15px",
    height: "92%",
    display:displayMsg
};

const subscribe_msg_content = {
  border: "3px solid #f4f4f4",
  padding: "50px",
  margin: "20px",
  fontSize: "16px",
  fontWeight: "700",
};



  return (
    <React.Fragment>
     <div className="thank_msg" style={thank_msg}  >
      <div className="subscribe_msg_content" style={subscribe_msg_content}>
      <p>Thank you for showing interest in SabPaisa.</p> 
      <p> Our team will get in touch with you soon!</p>
      <p> Meanwhile you can reach out to us at</p>
      <p> +91 - 9875515119</p>
      </div>
     
    </div>
    <div>
    <form 
		onSubmit={handleSubmit(onSubmit)}
		id="mandateRegForm"
		action="https://subscription.sabpaisa.in/subscription/mandateRegistration"
		method="POST"
	>
		<div style={{ display: "none" }}>
		<input {...register("authenticationMode")} name="authenticationMode" value={formData.authenticationMode}/>
        <input {...register("clientCode")} type="text" name="clientCode" value={formData.clientCode}/>
        <input {...register("clientRegistrationId")} type="text" name="clientRegistrationId" value={formData.clientRegistrationId}/>
        <input {...register("consumerReferenceNumber")} type="text" name="consumerReferenceNumber" value={formData.consumerReferenceNumber}/>
        <input {...register("emiamount")} type="text" name="emiamount" value={formData.emiamount}/>
        <input {...register("frequency")} type="text" name="frequency" value={formData.frequency}/>
        <input {...register("mandateCategory")} type="text" name="mandateCategory" value={formData.mandateCategory}/>
        <input {...register("mandateEndDate")} type="text" name="mandateEndDate" value={formData.mandateEndDate}/>
        <input {...register("mandateMaxAmount")} type="text" name="mandateMaxAmount" value={formData.mandateMaxAmount}/>
        <input {...register("mandatePurpose")} type="text" name="mandatePurpose" value={formData.mandatePurpose}/>
        <input {...register("mandateStartDate")} type="text" name="mandateStartDate" value={formData.mandateStartDate}/>
        <input {...register("mandateType")} type="text" name="mandateType" value={formData.mandateType}/>
        <input {...register("npciPaymentBankCode")} type="text" name="npciPaymentBankCode" value={formData.npciPaymentBankCode}/>
        <input {...register("panNo")} type="text" name="panNo" value={formData.panNo}/>
        <input {...register("payerAccountNumber")} type="text" name="payerAccountNumber" value={formData.payerAccountNumber}/>
        <input {...register("payerAccountType")} type="text" name="payerAccountType" value={formData.payerAccountType}/>
        <input {...register("payerBank")} type="text" name="payerBank" value={formData.payerBank}/>
        <input {...register("payerBankIfscCode")} type="text" name="payerBankIfscCode" value={formData.payerBankIfscCode}/>
        <input {...register("payerEmail")} type="text" name="payerEmail" value={formData.payerEmail}/>
        <input {...register("payerMobile")} type="text" name="payerMobile" value={formData.payerMobile}/>
        <input {...register("payerName")} type="text" name="payerName" value={formData.payerName}/>
        <input {...register("payerUtilitityCode")} type="text" name="payerUtilitityCode" value={formData.payerUtilitityCode}/>
        <input {...register("requestType")} type="text" name="requestType" value={formData.requestType}/>
        <input {...register("schemeReferenceNumber")} type="text" name="schemeReferenceNumber" value={formData.schemeReferenceNumber}/>
        <input {...register("telePhone")} type="text" name="telePhone" value={formData.telePhone}/>
        <input {...register("untilCancelled")} type="text" name="untilCancelled" value={formData.untilCancelled}/>
        <input {...register("userType")} type="text" name="userType" value={formData.userType}/>
		</div>
       
        <button className="Click-here ant-btn ant-btn-primary float-right" type="submit" onClick={()=>{setMakePayment(false)}}>  {formData.planType ==='trial' ? 'Subscribe' : ' Create E-Mandate'} </button>

        {formData.planType !=='trial'? <button  className="Click-here ant-btn ant-btn-primary float-right" type="submit" onClick={()=>{setMakePayment(true)}}>  {spinnerOfPayment ? <span class="spinner-border spinner-border-sm"></span> : <></> } Make Payment </button> : <></>}
    </form>
    </div>
   
   
    </React.Fragment>
  );
}

export default Emandate
