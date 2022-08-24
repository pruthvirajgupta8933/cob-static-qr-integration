import axios from "axios";
import React from "react";
import FormikWrapper from "../../_components/formik/FormikWrapper";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";

function Test() {
  return (
    <div className="container bg-white">
   <div className="dropdown show">
  <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown link
  </a>
  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <a className="dropdown-item" href="#">Action</a>
    <a className="dropdown-item" href="#">Another action</a>
    <a className="dropdown-item" href="#">Something else here</a>
  </div>
</div>



    </div>
  );
}

export default Test;
