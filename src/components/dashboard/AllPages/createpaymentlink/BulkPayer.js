import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { Zoom } from "react-toastify";
import API_URL from "../../../../config";

const BulkPayer = () => {
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  // console.log("clientCode", clientCode);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("Client_Code", [clientCode]);


    axios
      .post(API_URL.SMART_UPLOAD, formData, {
        headers: { ContentType: "application/json" },
      })

      .then((res) => {
        alert("File Upload success");
        toast.success("File Upload Successfull",
        {
          position: "top-center",
          autoClose: 2000,
          transition: Zoom,
          limit: 2,
        })
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error('File Upload Unsuccessfull',
        {
          position: "top-center",
          autoClose: 1000,
          transition: Zoom,
          limit: 2,
        })
      });

    // console.log(formData);
  };

  return (
    <div className="col-lg-12">
      <form onSubmit={submitHandler}>
      <div className="col-lg-4">
        <h2>
          Upload Bulk Payer
        </h2>
        <input
          type="file"
          className="form-control"
          id="customFile"
          onChange={changeHandler}
          
        />
       </div>
       <div className="col-lg-4">
          <button
            type="submit"
            className="btn btn-primary martop"
            
          >
            Submit
          </button>
          </div>
      </form>
      {/* <Link
        style={{ position: "absolute", top: 230, left: 1200 }}
        value="Download"
      >
        Download Import Format Excel
      </Link> */}
    </div>
  );
};

export default BulkPayer;
