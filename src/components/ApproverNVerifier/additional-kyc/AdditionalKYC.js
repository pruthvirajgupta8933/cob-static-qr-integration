import React, { useState } from "react";
import FrmVerification from "./FrmVerification";
import GstinAdditionalKyc from "./GstinAdditionalKyc";
import BankAccountList from "./BankAccountList";
import AdditionalKycForPan from "./AdditionalKycForPan";
import UdyamRegistrationList from "./UdyamRegistrationList";
import AadharVerify from "./aadhar-attestr/AadharVerify";
import KycCin from "./KycCin";

const AdditionalKYC = () => {
  const [selectedDocType, setSelectedDocType] = useState("");
  const documentTypeList = [
    { documentType: "PAN", value: "1" },
    { documentType: "GSTIN", value: "2" },
    { documentType: "BANK ACCOUNT", value: "3" },
    { documentType: "UDYAM", value: "4" },
    { documentType: "FRM", value: "5" },
    { documentType: "AADHAR VERIFICATION", value: "6" },
    { documentType: "CIN", value: "7" }
  ];

  // Helper functions
  const handleChange = (event) => {
    setSelectedDocType(event.target.value);
  };

  return (
    <section className="">
      <main className="">
        <div className="">
          <h5>Additional KYC</h5>
        </div>
        <div className="container-fluid mt-5 p-0">
          <div className="row">
            <div className="col-lg-3 col-md-4">
              <div className="form-group">
                <label className="form-label">Document Type</label>
                <select
                  className="form-select"
                  documentType={selectedDocType}
                  onChange={handleChange}
                >
                  <option value="Select a Document">Select a Document</option>
                  {documentTypeList.map((data) => (
                    <option value={data.value} key={data.value}>
                      {data.documentType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              {selectedDocType === "1" && (
                <AdditionalKycForPan selectedDocType={selectedDocType} />
              )}

              {selectedDocType === "2" && (
                <GstinAdditionalKyc selectedDocType={selectedDocType} />
              )}

              {selectedDocType === "3" && (
                <BankAccountList selectedDocType={selectedDocType} />
              )}

              {selectedDocType === "4" && (
                <UdyamRegistrationList selectedDocType={selectedDocType} />
              )}
            </div>
            {selectedDocType === "5" && (
              <FrmVerification />
            )}
            {selectedDocType === "6" && (
              <AadharVerify />
            )}

            {selectedDocType === "7" && (
              <KycCin />
            )}
          </div>

        </div>

      </main>
    </section>
  );
};




export default AdditionalKYC;
