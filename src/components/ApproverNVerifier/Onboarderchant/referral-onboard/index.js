import { useState } from "react";
import BasicDetails from "./BasicDetails";
import BankDetails from "./BankDetails";
import UploadDocuments from "./UploadDocuments";
import ViewDocuments from "./ViewDocuments";
import BusinessOverview from "./BusinessOverview";
import BusinessDetails from "./BusinessDetails";

const Referral = ({ type }) => {
  let tabs = [];
  if (type === "individual") {
    tabs = [
      { id: "basic", name: "Basic Details" },
      { id: "bank", name: "Bank Details" },
      { id: "upload_doc", name: "Upload Document" },
      { id: "view_doc", name: "View Document" },
    ];
  } else if (type === "company") {
    tabs = [
      { id: "basic", name: "Basic Details" },
      { id: "biz_overview", name: "Business Overview" },
      { id: "biz_details", name: "Business Details" },
      { id: "bank", name: "Bank Details" },
      { id: "upload_doc", name: "Upload Document" },
      { id: "view_doc", name: "View Document" },
    ];
  }
  const [currentTab, setCurrentTab] = useState("basic");

  const handleTabClick = (tabId) => setCurrentTab(tabId);
  const handleSubmit = () => {};

  const renderTabContent = () => {
    switch (currentTab) {
      case "basic":
        return <BasicDetails setCurrentTab={setCurrentTab} type={type} />;
      case "bank":
        return <BankDetails setCurrentTab={setCurrentTab} />;
      case "upload_doc":
        return <UploadDocuments setCurrentTab={setCurrentTab} />;
      case "view_doc":
        return <ViewDocuments setCurrentTab={setCurrentTab} />;
      case "biz_overview":
        return <BusinessOverview setCurrentTab={setCurrentTab} />;
      case "biz_details":
        return <BusinessDetails setCurrentTab={setCurrentTab} />;
      default:
        return <BasicDetails setCurrentTab={setCurrentTab} />;
    }
  };
  return (
    <section className="container-fluid">
      <div className="row">
        <div className="col-2 bg-light p-1">
          {/* Tab navs */}
          <div
            className="nav flex-column nav-pills text-start "
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            {tabs?.map((tab) => (
              <a
                className={`nav-link cursor_pointer px-2 ${
                  currentTab === tab.id && "active-secondary"
                } pe-none`}
                onClick={() => handleTabClick(tab.id)}
                id={`v-pills-link${tab.id}-tab`}
                data-mdb-toggle="pill"
                href={() => false}
                role="tab"
                aria-controls="v-pills-link1"
                aria-selected="true"
              >
                {tab.name}
              </a>
            ))}
          </div>
        </div>
        {/* Tab navs */}
        <div className="col-8">
          {/* Tab content */}

          <div className="tab-content" id="v-pills-tabContent">
            {renderTabContent()}
          </div>
          {/* Tab content */}
        </div>
      </div>
    </section>
  );
};

export default Referral;
