import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Emandate(props) {
  const { register, handleSubmit } = useForm();
  const [formData, setFormData] = useState({});
  
  const onSubmit = (data) => {
    console.log(formData.termAndCnd)
    if(formData.termAndCnd){

      const planData = {
        applicationId:formData.applicationId,
        applicationName:formData.applicationName,
        planId:formData.planId,
        planName:formData.planName,
      }

      if(typeof formData.planId==='undefined'){
        alert("please Select the valid plan");
      }else{
        console.log("formData",formData);
        localStorage.setItem("selectedPlan",JSON.stringify(planData))
        document.getElementById("mandateRegForm").submit()
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

  return (
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

        <button className="Click-here ant-btn ant-btn-primary float-right" type="submit">Create e-mandate</button>
    </form>
  );
}

export default Emandate
