import React, { useState } from "react";
import FrmVerification from "./FrmVerification";
import GstinAdditionalKyc from "./GstinAdditionalKyc";
import BankAccountList from "./BankAccountList";
import AdditionalKycForPan from "./AdditionalKycForPan";
import UdyamRegistrationList from "./UdyamRegistrationList";
import AadharVerify from "./aadhar-attestr/AadharVerify";
import KycCin from "./KycCin";
import ValidateCredReport from "./cred-report-validate";
import ValidateVoterCard from "./voter-card-validate";
import ValidateDrivingLicense from "./dl-validate";
import ValidateCIN from "./cin-validate";
import AdvancePanValidate from "./advance-pan-validate";

const AdditionalKYC = () => {
  const [selectedDocType, setSelectedDocType] = useState("");
  const documentTypeList = [
    { documentType: "PAN", value: "1" },
    { documentType: "GSTIN", value: "2" },
    { documentType: "BANK ACCOUNT", value: "3" },
    { documentType: "UDYAM", value: "4" },
    { documentType: "FRM", value: "5" },
    { documentType: "AADHAAR VERIFICATION", value: "6" },
    // { documentType: "CIN", value: "7" },
    { documentType: "CRED REPORT VALIDATION", value: "8" },
    { documentType: "DRIVING LICENSE VALIDATION", value: "9" },
    { documentType: "VOTER CARD VALIDATION", value: "10" },
    { documentType: "CIN VALIDATION", value: "11" },
    { documentType: "ADVANCE PAN VALIDATION", value: "12" },
  ];

  // Helper functions
  const handleChange = (event) => {
    setSelectedDocType(event.target.value);
  };

  const renderKycVerification = () => {
    switch (selectedDocType) {
      case "1":
        return <AdditionalKycForPan selectedDocType={selectedDocType} />;
      case "2":
        return <GstinAdditionalKyc selectedDocType={selectedDocType} />;
      case "3":
        return <BankAccountList selectedDocType={selectedDocType} />;
      case "4":
        return <UdyamRegistrationList selectedDocType={selectedDocType} />;
      case "5":
        return <FrmVerification />;
      case "6":
        return <AadharVerify />;
      case "7":
        return <KycCin />;
      case "8":
        return <ValidateCredReport />;
      case "9":
        return <ValidateDrivingLicense />;
      case "10":
        return <ValidateVoterCard />;
      case "11":
        return <ValidateCIN selectedDocType={selectedDocType} />;
      case "12":
        return <AdvancePanValidate selectedDocType={selectedDocType} />;
      default:
        return;
    }
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
              {renderKycVerification()}
              {/* {selectedDocType === "1" && (
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
              )} */}
            </div>
            {/* {selectedDocType === "5" && (
              <FrmVerification />
            )}
            {selectedDocType === "6" && (
              <AadharVerify />
            )}

            {selectedDocType === "7" && (
              <KycCin />
            )} */}
          </div>
        </div>
      </main>
    </section>
  );
};

export default AdditionalKYC;
