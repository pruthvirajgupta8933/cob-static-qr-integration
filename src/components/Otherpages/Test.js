import axios from "axios";
import React from "react";
import FormikWrapper from "../../_components/formik/FormikWrapper";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";

function Test() {

  // a local state to store the currently selected file.
  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData();
    formData.append("files", selectedFile);
    formData.append("login_id", 10439);
    formData.append("modified_by", 10439);
    formData.append("type", 2);
    try {
      //Request URL: https://stgcobkyc.sabpaisa.in/kyc/upload-merchant-document/
     axios({
        method: "post",
        url: "https://stgcobkyc.sabpaisa.in/kyc/upload-merchant-document/",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch(error) {
      console.log(error)
    }
  }

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0])
  }


  return (
    <div className="container bg-white">

<FormikWrapper />
<form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileSelect}/>
      <input type="submit" value="Upload File" />
    </form>
    </div>
  );
}

export default Test;
