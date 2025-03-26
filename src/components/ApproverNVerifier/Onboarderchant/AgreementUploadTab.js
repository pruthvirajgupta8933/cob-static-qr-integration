import React, { useState } from "react";
import CustomModal from "../../../_components/custom_modal";
import AgreementDocModal from "./AgreementDocModal";
import BgvReport from "./BgvReport";

const AgreementUploadTab = (props) => {
    const [activeTab, setActiveTab] = useState("agreement");

    return (
        <CustomModal
            headerTitle="Upload Agreement"
            modalToggle={props?.isModalOpen}
            fnSetModalToggle={props?.setModalState}
            modalBody={() => (
                <div className="container-fluid">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "agreement" ? "active" : ""}`}
                                onClick={() => setActiveTab("agreement")}
                            >
                                Agreement Upload
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === "bgv" ? "active" : ""}`}
                                onClick={() => setActiveTab("bgv")}
                            >
                                BGV Report
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content mt-5">
                        {activeTab === "agreement" && <AgreementDocModal documentData={props} />}

                        {activeTab === "bgv" && <BgvReport documentData={props} />}
                    </div>
                </div>
            )}
            modalFooter={() => (
                <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => props?.setModalState(false)}
                >
                    Close
                </button>
            )}
        />
    );
};

export default AgreementUploadTab;
