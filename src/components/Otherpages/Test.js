import axios from "axios";
import React from "react";
import FormikWrapper from "../../_components/formik/FormikWrapper";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";

function Test() {
  return (
    <div className="container bg-white">

      <select id="basic" className="form-control" onMouseLeave={(e)=>console.log(e)} onMouseMove={(e)=>console.log(e)}>
        <option value={0} title="Finding your IMEI number">One</option>
        <option value={1} title="Next title">Two</option>
        <option value={2} title="Next ssds">Three</option>
        <option value={3} title="Next dfsdf">Four</option>
        <option value={4} title="Next drter">Five</option>
        <option value={5} title="Next grete">Six</option>
      </select>

    </div>
  );
}

export default Test;
