import { useState } from "react";
import { useSelector } from "react-redux";
import BasicDetails from "./BasicDetails";
import BankDetails from "./BankDetails";
import UploadDocuments from "./UploadDocuments";
import ViewDocuments from "./ViewDocuments";
import BusinessOverview from "./BusinessOverview";
import BusinessDetails from "./BusinessDetails";
import AddressDetails from "./AddressDetails";
import ReferralId from "./ReferralId";
import Submit from "./Submit";

const Referral = ({ type }) => {
  let tabs = [];
  if (type === "individual") {
    tabs = [
      { id: "basic", name: "Basic Details" },
      { id: "address", name: "Address Details" },
      // { id: "referral_id", name: "Referral ID" },
      { id: "bank", name: "Bank Details" },
      { id: "upload_doc", name: "Upload Document" },
      { id: "view_doc", name: "View Document" },
      { id: "submit", name: "Submit" },
    ];
  } else if (type === "company") {
    tabs = [
      { id: "basic", name: "Basic Details" },
      // { id: "biz_overview", name: "Business Overview" },
      // { id: "biz_details", name: "Business Details" },
      // { id: "bank", name: "Bank Details" },
      // { id: "upload_doc", name: "Upload Document" },
      // { id: "view_doc", name: "View Document" },
    ];
  }
  const [currentTab, setCurrentTab] = useState("basic");

  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );
  const handleTabClick = (tabId) => setCurrentTab(tabId);

  const renderTabContent = () => {
    // console.log(basicDetailsResponse);
    switch (currentTab) {
      case "basic":
        return <BasicDetails setCurrentTab={setCurrentTab} type={type} />;
      case "address":
        return <AddressDetails setCurrentTab={setCurrentTab} />;
      case "referral_id":
        return <ReferralId setCurrentTab={setCurrentTab} />;
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
        return <Submit />;
    }
  };
  return (
    <section className="container-fluid">
      <div className="row">
        {basicDetailsResponse && (
          <div className="d-flex bg-light justify-content-between px-0 my-2">
            <div>
              <p className="p-2 m-0">
                Session Start : {basicDetailsResponse?.name}
              </p>
              <p className="p-2 m-0">
                KYC Status : {basicDetailsResponse?.status}
              </p>
            </div>
            <div>
              <p className="p-2 m-0">
                Merchant Onboard Login ID :{" "}
                {basicDetailsResponse?.loginMasterId}
              </p>
            </div>
          </div>
        )}
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
                } ${
                  tab.id === "basic"
                    ? "pe-auto"
                    : basicDetailsResponse?.loginMasterId
                    ? "pe-auto"
                    : "pe-none"
                }`}
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
