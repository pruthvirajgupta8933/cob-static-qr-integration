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
  let merchantKycId = props?.kycId;
  console.log(merchantKycId)
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
    if (merchantKycId !== null) {
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

  const stringManulate = (str) => {
    let str1 = str.substring(0, 15)
    return `${str1}...`

  }


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

          <div className="modal-body">
            <div className="container">
              {/* contact info section */}
              <div className="row mb-4 border">
                <div className="col-lg-12">
                  <h3 className="font-weight-bold">Merchant Contact Info</h3>
                </div>

                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Contact Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.name}
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
                    value={merchantKycId?.aadharNumber}
                  />
                </div>


                <div class="col-sm-6 col-md-6 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    Contact Number<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.contactNumber}
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
                    value={merchantKycId?.emailId}
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

              {/* business overview section */}
              <div className="row mb-4 border">
                <div class="col-lg-12">
                  <h3 className="font-weight-bold">Business Overview</h3>
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Business Type<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    disabled="true"
                    value={businessTypeResponse}
                  />
                </div>

                <div class="col-sm-6 col-md-6 col-lg-6">
                  <label class="p-2 mt-0">
                    Business Category<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    disabled="true"
                    value={businessCategoryResponse}
                  />
                </div>


                <div class="col-sm-6 col-md-6 col-lg-6">
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
                    }
                  />
                </div>

                <div class="col-sm-6 col-md-6 col-lg-6">
                  <label class="col-form-label p-2 mt-0">
                    {merchantKycId?.is_website_url === true ?
                      <p className="font-weight-bold"> Merchant wish to accept payments on (Web/App URL) {merchantKycId?.website_app_url}</p> :
                      `Merchant has accepted payments without any web/app `}
                  </label>
                </div>


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
                    }
                  />
                </div>

                <div class="col-sm-4 col-md-4 col-lg-4">
                  <label
                    class="col-form-label p-0"
                    style={{ marginTop: "15px" }}
                  >
                    Expected Transactions/Year{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.expectedTransactions
                    }
                  />
                </div>

                <div class="col-sm-4 col-md-4 col-lg-4">
                  <label class="col-form-label p-2 mt-0">
                    Avg Ticket Amount<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={
                      merchantKycId?.avg_ticket_size
                    }
                  />
                </div>
              </div>

              {/* business details */}
              <div className="row mb-4 border">
                <div class="col-lg-12">
                  <h3 className="font-weight-bold">Business Details</h3>
                </div>

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
                      merchantKycId?.gstNumber
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Business PAN<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.panCard}
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
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-6 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
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
                    }
                  />
                </div>

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
                    value={merchantKycId?.cityId}
                  />
                </div>

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
                      merchantKycId?.state_name
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
                    value={merchantKycId?.pinCode}
                  />
                </div>

              </div>

              {/* Bank details */}
              <div className="row mb-4 border">
                <div class="col-lg-12">
                  <h3 className="font-weight-bold">Bank Details</h3>
                </div>

                <div class="col-sm-12 col-md-12 col-lg-6 ">
                  <label class="col-form-label mt-0 p-2">
                    IFSC Code<span style={{ color: "red" }}>*</span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.ifscCode}
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
                    }
                  />
                </div>

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
                      merchantKycId?.accountType
                    }
                  />
                </div>

                <div class="col-sm-12 col-md-12 col-lg-6">
                  <label class="col-form-label mt-0 p-2">
                    Bank Name<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPassword3"
                    disabled="true"
                    value={merchantKycId?.bankName}
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
                    value={merchantKycId?.branch}
                  />
                </div>
              </div>

              {/* Merchant Documents */}
              <div className="row mb-4 border">
                <div class="col-lg-12">
                  <h3 className="font-weight-bold">Merchant Docuemnts</h3>
                </div>

                <div className="col-lg-12 mt-4 m-2">
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
                                {stringManulate(doc?.name)}
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
