import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BasicDetails from "./BasicDetails";
import BankDetails from "./BankDetails";
import UploadDocuments from "./UploadDocuments";
import ViewDocuments from "./ViewDocuments";
import AddressDetails from "./AddressDetails";
import Submit from "./Submit";
import { clearKYCDocumentList } from "../../../../slices/kycSlice";

const Referral = ({ type, zoneCode, edit }) => {
  let tabs = [];

  const dispatch = useDispatch()

  if (type === "individual") {
    tabs = [
      { id: "basic", name: "Basic Details" },
      { id: "address", name: "Address Details" },
      { id: "bank", name: "Bank Details" },
      { id: "upload_doc", name: "Upload Document" },
      { id: "view_doc", name: "View Document" },
      { id: "submit", name: "Submit" },
    ];
  } else if (type === "company") {
    tabs = [{ id: "basic", name: "Basic Details" }];
  }

  const basicDetailsResponse = useSelector(
    (state) => state.referralOnboard.basicDetailsResponse?.data
  );


  const kycData = useSelector((state) => state.kyc?.kycUserList);
  const [currentTab, setCurrentTab] = useState("basic");
  const [infoModal, setInfoModal] = useState();
  const handleTabClick = (tabId) => setCurrentTab(tabId);


  useEffect(() => {
    // clear kyc state when unmount the component
    return () => {
      dispatch(clearKYCDocumentList())
    }
  }, [])


  const renderTabContent = () => {
    switch (currentTab) {
      case "basic":
        return (
          <BasicDetails
            setCurrentTab={setCurrentTab}
            type={type}
            zoneCode={zoneCode}
            edit={edit}
            disableForm={["Verified", "Approved"].includes(kycData.status)}
            setInfoModal={setInfoModal}
          />
        );
      case "address":
        return (
          <AddressDetails
            setCurrentTab={setCurrentTab}
            disableForm={["Verified", "Approved"].includes(kycData.status)}
            setInfoModal={setInfoModal}
          />
        );
      case "bank":
        return (
          <BankDetails
            setCurrentTab={setCurrentTab}
            disableForm={["Verified", "Approved"].includes(kycData.status)}
            setInfoModal={setInfoModal}
          />
        );
      case "upload_doc":
        return (
          <UploadDocuments
            setCurrentTab={setCurrentTab}
            disableForm={["Verified", "Approved"].includes(kycData.status)}
            setInfoModal={setInfoModal}
          />
        );
      case "view_doc":
        return <ViewDocuments setCurrentTab={setCurrentTab} />;
      default:
        return (
          <Submit
            setInfoModal={setInfoModal}
            disableForm={["Verified", "Approved"].includes(kycData.status)}
          />
        );
    }
  };
  return (
    <section className="container-fluid">
      <div className="row">
        {(basicDetailsResponse || edit) && (
          <>
            <div className="d-flex bg-light justify-content-between px-0 my-2">
              <div>
                <p className="p-2 m-0">
                  Session Start : {basicDetailsResponse?.name ?? kycData?.name}
                </p>
                <p className="p-2 m-0">KYC Status : {kycData?.status}</p>
              </div>
              <div>
                <p className="p-2 m-0">
                  Merchant Onboard Login ID :{" "}
                  {basicDetailsResponse?.loginMasterId ??
                    kycData?.loginMasterId}
                </p>
              </div>
            </div>
            {!edit && (
              <p className="text-danger">
                Important Note: A verification link has been sent to the
                registered email associated with your merchant account. Please
                verify the link to proceed to the next step.
              </p>
            )}
          </>
        )}
        <div className="col-2 bg-light p-1">
          <div
            className="nav flex-column nav-pills text-start "
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical"
          >
            {tabs?.map((tab) => (
              <a
                className={`nav-link cursor_pointer px-2 ${currentTab === tab.id && "active-secondary"
                  } ${tab.id === "basic"
                    ? "pe-auto"
                    : basicDetailsResponse?.loginMasterId ||
                      (edit && kycData?.loginMasterId)
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
        <div className="col-8">
          <div className="tab-content" id="v-pills-tabContent">
            {renderTabContent()}
          </div>
        </div>
        <div
          className={
            "modal fade mymodals" + (infoModal ? " show d-block" : " d-none")
          }
        >
          <div className="modal-dialog modal-dialog-centered " role="document">
            <div className="modal-content">
              <div className="modal-header border-0 py-0">
                <h5 className="text-danger pt-2">Important Note !</h5>
                <button
                  type="button"
                  onClick={() => {
                    setInfoModal(!infoModal);
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body fs-6">
                A verification link has been sent to the registered email
                associated with your merchant account. Please verify the link to
                proceed to the next step.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referral;
