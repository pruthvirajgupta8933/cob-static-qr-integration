import React from "react";
import { useSelector } from "react-redux";

const EmandateSummary = () => {
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
  // console.log("EEEEEEEEmandate Summary Object", mergedForm );

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-sm"><p className="text-strong">Mandate Variant</p><span><p className="text-secondary" >Online E-Mandate</p></span></div>
          <div className="col-sm"><p className="text-strong">Name</p><p className="text-secondary">{mergedForm?.payerName}</p></div>
          <div className="col-sm"><p className="text-strong">Bank Name</p><p className="text-secondary">{mergedForm?.payerBank}</p></div>
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default EmandateSummary;
