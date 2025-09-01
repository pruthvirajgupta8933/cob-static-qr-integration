import React from 'react'
import { useSelector } from 'react-redux';

const MandateBankDetails = () => {

  const { createMandate } = useSelector((state) => state);
  // console.log(createMandate.createMandate
  //   ?.formData?.firstForm ,"this is createmen")
 

  // console.log("firstForm",firstForm)
  // console.log("secondForm",secondForm)
  // console.log("thirdForm",thirdForm)

  
        const { firstForm, secondForm, thirdForm } = createMandate.createMandate.formData;
        const mergedForm = {
          ...firstForm,
          ...secondForm,
          ...thirdForm
        };
        
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <p className="text-strong">Bank Name</p>
            <span>
              <p className="text-secondary">{mergedForm?.payerBank}</p>
            </span>
          </div>
          <div className="col-sm">
            <p className="text-strong">Account Number</p>
            <p className="text-secondary">{mergedForm?.payerAccountNumber}</p>
          </div>
          <div className="col-sm">
            <p className="text-strong">Account Type</p>
            <p className="text-secondary">{mergedForm?.payerAccountType}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <p className="text-strong">IFSC Code</p>
            <span>
              <p className="text-secondary">{mergedForm?.payerBankIfscCode}</p>
            </span>
          
           
          </div>
          <div className="col-md-4">
            <p className="text-strong">Authentication Mode</p>
            <span>
              <p className="text-secondary">{mergedForm?.authenticationMode}</p>
            </span>
            </div>
        </div>
        {/* <div className="row">
          <div className="col-sm">
            
          </div>
        </div> */}
        <div>
        </div>
      </div>
    </div>
  )
}

export default MandateBankDetails