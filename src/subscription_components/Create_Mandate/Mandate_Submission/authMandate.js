import React from "react";
import EmandateSummary from "./mandateDetails/emandateSummary";
import MandateSummary from "./mandateDetails/mandateSummary";
import PersonalDetails from "./mandateDetails/personalDetails";
import MandateBankDetails from "./mandateDetails/mandateBankDetails";
import "./mandateDetails/mandateSubmission.css"
import { Formik, Form } from "formik";


const AuthMandate = ({updatedData}) => {


  const initialValues = {

  }

  const validationSchema = {


  }

  
  return (
    <div class="row">
    <div class="col-lg-6">
    <div id="accordion" style={{marginTop:"50px"}}>

    <div class="card-header mandateCard" id="headingOne" style={{borderRadius:"20px"}}>
      <h5 class="mb-0">
        <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
         E-Mandate Summary 
          <i class="fa fa-chevron-down downMandate" aria-hidden="true"></i>
        </button>
      </h5>
    </div>

    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
      <div class="card-body">
     <EmandateSummary updatedData={updatedData} />
      </div>
    </div>
 
 
    <div class="card-header mandateCard" id="headingTwo">
      <h5 class="mb-0">
        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
         Mandate Summary 
          <i class="fa fa-chevron-down downMandate" aria-hidden="true"></i>
        </button>
      </h5>
    </div>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
      <div class="card-body">
     <MandateSummary updatedData={updatedData}/>
      </div>
    </div>

    <div class="card-header mandateCard" id="headingThree">
      <h5 class="mb-0">
        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
      Personal Details
        <i class="fa fa-chevron-down downMandate" aria-hidden="true"></i>
        </button>
      </h5>
    </div>
    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordion">
      <div class="card-body">
     <PersonalDetails updatedData={updatedData}/>
      </div>
    </div>
    <div class="card-header mandateCard" id="headingFour">
      <h5 class="mb-0">
        <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
   Bank Details
        <i class="fa fa-chevron-down downMandate" aria-hidden="true"></i>
        </button>
      </h5>
    </div>
    <div id="collapseFour" class="collapse" aria-labelledby="headingFour" data-parent="#accordion">
      <div class="card-body">
     <MandateBankDetails updatedData={updatedData}/>
      </div>
    </div>
    
    
  
</div>
    </div>
    <div class="col-lg-6">
    <div class="card">
  <div class="card-header text-center font-weight-bold">
   Mandate Authorization
  </div>
  <div class="card-body">
    <div>
  1. I confirm that the contents have been carefully read, understood and correct in all respects.
  </div>
  <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked"/> 2. I agree for the debit of mandate processing charges by the bank as per the latest schedule of charges of the bank.
<div>
3. I am authorizing the user entity to debit my account based on the instructions as agreed.
</div>
<div>
4. I am authorized to cancel/amend this mandate communicating the request to the user entity/corporate or the bank where I have authorized the debit.
</div>
<div class="container">
  <div class="row mt-3">
    <div class="col-sm">
    <button type="button" class="btn btn-danger btn-sm text-white">Cancel</button>
    </div>
    
    <div class="col-sm" style={{display:"contents"}}>
    <button type="button" class="btn btn-success btn-sm text-white">Proceed</button>
    </div>
  </div>
</div>
<div class="container">
  <div class="row mt-3">
    <div class="col-sm">
    <h4 className="font-weight-bold text-decoration-underline text-center">Disclaimer</h4>
    </div>
    <div>
      <p>I further agree that SabPaisa Pvt. Ltd. is only a Third Party Technology Service Provider and does not have any liability towards the transaction mandate or any subsequent action which arises. Any dispute/differences or issues to the solely between the user entity Corporate or the bank and me.</p>
    </div>
    
  
  </div>
</div>
  </div>
</div>
   
    </div>
  </div>
  );
};

export default AuthMandate;
