import axios from "axios";
import React from "react";
import FormikWrapper from "../../_components/formik/FormikWrapper";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";

function Test() {

  axios.get("http://13.126.165.212:8000/kyc/get-all-collection-type").then(res=>console.log(res)).catch(err=>console.log(err))
  return (
    <div className="container bg-white">
      <FormikWrapper />
    </div>
  );
}

export default Test;
