import React, { useState, useEffect } from "react";
import {
  kycDocumentUploadList,
  businessCategoryById,
  businessTypeById,
  documentsUpload
} from "../../../../slices/kycSlice";
import { useDispatch } from "react-redux";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";



const KycDetailsModal = (props) => {
  let merchantKycId = props.kycId;
  const [docList, setDocList] = useState([]);
  const [docTypeList, setDocTypeList] = useState([]);
  const [businessTypeResponse, setBusinessTypeResponse] = useState([]);
  const [businessCategoryResponse, setBusinessCategoryResponse] = useState([]);

//   console.log(props?.kycId, "Props =======>");

  const dispatch = useDispatch();

  //------------------------------------------------------------------

  //------------- Kyc  Document List ------------//

  

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        kycDocumentUploadList({ login_id: merchantKycId?.loginMasterId })
      ).then((resp) => {
        //    console.log(resp?.payload,"Responseee")
        setDocList(resp?.payload);
      });
    }
  }, [merchantKycId?.loginMasterId]);


  useEffect(() => {
    if (merchantKycId !== null) {
    
    const businessType = merchantKycId?.businessType

    // console.log(busiType,"Business TYPE==========>")
    dispatch(documentsUpload({ businessType }))
      .then((resp) => {
        const data = convertToFormikSelectJson("id", "name", resp?.payload);
        setDocTypeList(data);
      })
    }
  }, [merchantKycId?.businessType]);

  //--------------------------------------//

  useEffect(() => {
    if (merchantKycId !== null) {
      dispatch(
        businessTypeById({ business_type_id: merchantKycId?.businessType })
      ).then((resp) => {
        setBusinessTypeResponse(resp?.payload[0]?.businessTypeText);
      });
    }
  }, [merchantKycId?.businessType]);

  useEffect(() => {
    if(merchantKycId !== null) {
    dispatch(
      businessCategoryById({ category_id: merchantKycId?.businessCategory })
    ).then((resp) => {
      // console.log(resp,"response")
      setBusinessCategoryResponse(resp?.payload[0]?.category_name);
    });
       }
  }, [merchantKycId?.businessCategory]);


  
  const getDocTypeName = (id) => {
    let data = docTypeList.filter((obj) => {
      if (obj?.key?.toString() === id?.toString()) {
        return obj;
      }
    });

    // console.log("data",data)
    return data[0]?.value;
  };

  return (
    <div
      class="modal fade"
      id="kycmodaldetail"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      style={{ overflow: "scroll" }}
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title font-weight-bold" id="kycmodaldetail">
              Merchant KYC Details
            </h3>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row">
                <div class="col-sm">
                  <h2
                    className="font-weight-bold"
                    style={{ textDecoration: "underline" }}
                  >
                    Merchant Contact Info
                  </h2>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Contact Name<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.name ? merchantKycId?.name : ""}
                  />
                </div>

                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Aadhaar Number <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.aadharNumber
                        ? merchantKycId?.aadharNumber
                        : ""
                    }
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Contact Number<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.contactNumber
                        ? merchantKycId?.contactNumber
                        : ""
                    }
                  />

                  <span>
                    {merchantKycId?.isContactNumberVerified === 1 ? (
                      <p className="text-success">Verified</p>
                    ) : (
                      <p className="text-danger"> Not Verified</p>
                    )}
                  </span>
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Email Id<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.emailId ? merchantKycId?.emailId : ""}
                  />
                  <span>
                    {merchantKycId?.isEmailVerified === 1 ? (
                      <p className="text-success">Verified</p>
                    ) : (
                      <p className="text-danger"> Not Verified</p>
                    )}
                  </span>
                </div>
              </div>
              <div class="row">
                <div class="col-sm">
                  <h2
                    className="font-weight-bold"
                    style={{ textDecoration: "underline" }}
                  >
                    Business Overview
                  </h2>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Business Type<span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                  >
                    <option selected>
                      {businessTypeResponse ? businessTypeResponse : ""}
                    </option>
                  </select>
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6">
                  <label class="p-2 mt-0">
                    Business Category<span style={{ color: "red" }}>*</span>
                  </label>

                  <select
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                  >
                    <option selected>
                      {businessCategoryResponse ? businessCategoryResponse : ""}
                    </option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="col-form-label p-2 mt-0">
                    Business Label <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.billingLabel
                        ? merchantKycId?.billingLabel
                        : ""
                    }
                  />
                  <div class="my-5- p-2- w-100 pull-left">
                    <hr
                      style={{
                        borderColor: "#D9D9D9",
                        textShadow: "2px 2px 5px grey",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-12 col-lg-12">
                  <label class="col-form-label p-2 mt-0">
                    How do you wish to accept payments?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.website_app_url !== null || undefined
                        ? merchantKycId?.website_app_url
                        : "Not Selected"
                    }
                  />
                  <span>
                    {merchantKycId?.is_website_url === true
                      ? "On my website/app"
                      : "Without Website/app"}
                  </span>
                  <div class="my-5- p-2- w-100 pull-left">
                    <hr
                      style={{
                        borderColor: "#D9D9D9",
                        textShadow: "2px 2px 5px grey",
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4 col-md-4 col-lg-4">
                  <label class="col-form-label p-2 mt-0">
                    Company Website<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.companyWebsite
                        ? merchantKycId?.companyWebsite
                        : ""
                    }
                  />
                </div>

                <div class="col-sm-4 col-md-4 col-lg-4">
                  <label
                    class="col-form-label p-0"
                    style={{ marginTop: "-4px" }}
                  >
                    Expected Transactions / Per Year{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.expectedTransactions
                        ? merchantKycId?.expectedTransactions
                        : ""
                    }
                  />
                </div>

                <div class="col-sm-4 col-md-4 col-lg-4">
                  <label class="col-form-label p-2 mt-0">
                    Avg Ticket Size<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.avg_ticket_size
                        ? merchantKycId?.avg_ticket_size
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div class="row p-3">
              <div class="col-sm">
                <h2
                  className="font-weight-bold"
                  style={{ textDecoration: "underline" }}
                >
                  Business Details
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 marg-b">
                <label class="col-form-label mt-0 p-2">
                  GSTIN<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.gstNumber ? merchantKycId?.gstNumber : ""
                  }
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Business PAN<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.panCard ? merchantKycId?.panCard : ""}
                />
              </div>

              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Authorized Signatory PAN{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.signatoryPAN
                      ? merchantKycId?.signatoryPAN
                      : ""
                  }
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  {" "}
                  Business Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.companyName ? merchantKycId?.companyName : ""
                  }
                />
              </div>

              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  PAN Owner's Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.nameOnPanCard
                      ? merchantKycId?.nameOnPanCard
                      : ""
                  }
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Address<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.operationalAddress
                      ? merchantKycId?.operationalAddress
                      : ""
                  }
                />
              </div>
              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  City<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.cityId ? merchantKycId?.cityId : ""}
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  State<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.state_name ? merchantKycId?.state_name : ""
                  }
                />
              </div>

              <div class="col-sm-12 col-md-6 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Pincode<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.pinCode ? merchantKycId?.pinCode : ""}
                />
              </div>
            </div>
            <div class="row p-4">
              <div class="col-sm">
                <h2
                  className="font-weight-bold"
                  style={{ textDecoration: "underline" }}
                >
                  Bank Details
                </h2>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 ">
                <label class="col-form-label mt-0 p-2">
                  IFSC Code<span style={{ color: "red" }}>*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.ifscCode ? merchantKycId?.ifscCode : ""}
                />
              </div>

              <div class="col-sm-12 col-md-12 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Business Account Number
                  <span style={{ color: "red" }}>*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.accountNumber
                      ? merchantKycId?.accountNumber
                      : ""
                  }
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Account Holder Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.accountHolderName
                      ? merchantKycId?.accountHolderName
                      : ""
                  }
                />
              </div>

              <div class="col-sm-12 col-md-12 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Account Type<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={
                    merchantKycId?.accountType ? merchantKycId?.accountType : ""
                  }
                />
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Bank Name<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.bankName ? merchantKycId?.bankName : ""}
                />
              </div>

              <div class="col-sm-12 col-md-12 col-lg-6">
                <label class="col-form-label mt-0 p-2">
                  Branch<span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPassword3"
                  disabled="true"
                  value={merchantKycId?.branch ? merchantKycId?.branch : ""}
                />
              </div>
            </div>
            <div class="row p-4">
              <div class="col-sm">
                <h2
                  className="font-weight-bold"
                  style={{ textDecoration: "underline" }}
                >
                  Merchant Documents
                </h2>
              </div>
            </div>
            <div className="col-lg-12 border mt-4 m-2 test">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Document Type</th>
                    <th>Document Name</th>
                    <th>Document Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docList?.length > 0 ? (
                    docList?.map((doc, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{getDocTypeName(doc?.type)}</td>
                        <td>
                          <a
                            href={doc?.filePath}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary"
                          >
                            {doc?.name}
                          </a>
                          <p className="text-danger"> {doc?.comment}</p>
                        </td>
                        <td>{doc?.status}</td>
                      </tr>
                    ))
                  ) : (
                    <></>
                  )}
                </tbody>
              </table>
              <div></div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary text-white"
              data-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycDetailsModal;
