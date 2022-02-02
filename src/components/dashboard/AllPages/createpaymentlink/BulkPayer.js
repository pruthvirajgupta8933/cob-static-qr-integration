import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BulkPayer = () => {
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  console.log("clientCode", clientCode);

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
      .post("https://paybylink.sabpaisa.in/paymentlink/smartupload", formData, {
        headers: { ContentType: "application/json" },
      })

      .then((res) => {
        alert("File Upload success");
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log(formData);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <h2 style={{ marginLeft: 110 }}>
          <b>Bulk Payer</b>
        </h2>
        <input
          type="file"
          class="form-control"
          id="customFile"
          onChange={changeHandler}
          style={{ position: "absolute", top: 220, width: 700, left: 100 }}
        />
        <div>
          <button
            type="submit"
            class="btn btn-primary"
            style={{ position: "absolute", top: 220, left: 820 }}
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
