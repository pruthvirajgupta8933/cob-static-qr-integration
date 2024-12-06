import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect, { createFilter } from "react-select";
import CustomLoader from "../../_components/loader";
import Table from "../../_components/table_components/table/Table";
import SubscriptionModal from "./SubscriptionModal";
import {
  deleteSubscriptionPlan,
  getSubscriptionPlanByClientCode,
  getSubscriptionPlans,
} from "../../slices/subscription";
import { getAllCLientCodeSlice } from "../../slices/approver-dashboard/approverDashboardSlice";
import DateFormatter from "../../utilities/DateConvert";
import CustomModal from "../../_components/custom_modal";

const ManualSubscription = () => {
  const subscriptionPlans = useSelector(
    (state) => state.subscription.manualSubscriptions
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [clientCodeList, setCliencodeList] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [modalDisplayData, setModalDisplayData] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubscriptionPlans());
  }, []);
  useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setCliencodeList(resp?.payload?.result);
    });
  }, []);

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const rowData = [
    {
      id: "1",
      name: "Client Code",
      selector: (row) => row.clientCode,
      sortable: true,
      width: "120px",
    },
    {
      id: "2",
      name: "Client Name",
      selector: (row) => row.clientName,
      sortable: true,
      width: "140px",
    },
    {
      id: "3",
      name: "Client Id",
      selector: (row) => row.clientId,
    },
    {
      id: "4",
      name: "Application Id",
      selector: (row) => row.applicationId,
      width: "120px",
    },
    {
      id: "5",
      name: "Application Name",
      selector: (row) => row.applicationName,
      sortable: true,
      width: "135px",
    },
    {
      id: "6",
      name: "Subscription Status",
      selector: (row) => row.subscription_status,
      width: "120px",
    },
    {
      id: "7",
      name: "Plan Name",
      selector: (row) => row.planName,
    },
    {
      id: "8",
      name: "Purchase Amount",
      selector: (row) => row.purchaseAmount,
    },
    {
      id: "9",
      name: "Payment Mode",
      selector: (row) => row.paymentMode,
    },
    {
      id: "10",
      name: "Mandate Start Date",
      selector: (row) => DateFormatter(row.mandateStartTime, false),
    },
    {
      id: "11",
      name: "Mandate End Date",
      selector: (row) => DateFormatter(row.mandateEndTime, false),
    },
    // {
    //   id: "12",
    //   name: "Actions",
    //   cell: (row) => (
    //     <>
    //       <button
    //         type="submit"
    //         onClick={() => {
    //           setModalDisplayData(row);
    //           setOpenModal(true);
    //         }}
    //         className="approve cob-btn-primary btn-sm text-white mr-1"
    //         data-toggle="modal"
    //         data-target="#exampleModalCenter"
    //       >
    //         Update
    //       </button>
    //       <button
    //         type="submit"
    //         onClick={() => {
    //           let isExecuted = window.confirm(
    //             "Are you sure to execute this action?"
    //           );
    //           if (isExecuted) {
    //             dispatch(deleteSubscriptionPlan({ id: 2 }))
    //               .then((res) =>
    //                 res.payload.status === 200
    //                   ? toastConfig.successToast(res.payload.data?.message)
    //                   : toastConfig.errorToast(res.payload.data?.details)
    //               )
    //               .catch((err) => toastConfig.errorToast("Error occurred"));
    //           } else {
    //             console.log("Action canceled");
    //           }
    //         }}
    //         className="approve cob-btn-primary btn-sm text-white"
    //         data-toggle="modal"
    //         data-target="#exampleModalCenter"
    //       >
    //         Delete
    //       </button>
    //     </>
    //   ),
    //   width: "140px",
    // },
  ];
  const options = [
    { value: "", label: "Select Client Code" },
    ...clientCodeList.map((data) => ({
      value: data.clientCode,
      label: `${data.clientCode} - ${data.name}`,
    })),
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedClientId(selectedOption ? selectedOption.value : null);
    dispatch(
      getSubscriptionPlanByClientCode({ clientCode: selectedOption?.value })
    );
  };

  return (
    <section className="">
      <main className="">
        <div className="">
          <h5>Manual Subscription</h5>
        </div>
        <div className="container-fluid p-0">
          <div className="row my-4">
            <div className="col-3">
              <button
                onClick={() => {
                  setModalDisplayData();
                  setOpenModal(true);
                }}
                className="approve cob-btn-primary btn-sm text-white"
              >
                Create New Subscription
              </button>
            </div>
            <div className="col-4">
              <ReactSelect
                className="zindexforDropdown"
                onChange={handleSelectChange}
                value={
                  selectedClientId
                    ? { value: selectedClientId, label: selectedClientId }
                    : null
                }
                options={options}
                placeholder="Search by Client Code"
                filterOption={createFilter({ ignoreAccents: false })}
              />
            </div>
          </div>
          <div className="scroll overflow-auto">
            {subscriptionPlans?.result?.length > 0 ? (
              <h6>Total Count : {subscriptionPlans.result?.length}</h6>
            ) : (
              ""
            )}
            {subscriptionPlans?.result?.length === 0 && (
              <h5 className="text-center font-weight-bold mt-5">
                No Data Found
              </h5>
            )}
            {!subscriptionPlans?.loading &&
              subscriptionPlans?.result?.length > 0 && (
                <Table
                  row={rowData}
                  data={subscriptionPlans?.result}
                  dataCount={subscriptionPlans?.result?.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  changeCurrentPage={changeCurrentPage}
                />
              )}
          </div>
          <CustomLoader loadingState={subscriptionPlans?.loading} />
          {openModal && (
            <CustomModal
              modalBody={() => (
                <SubscriptionModal
                  data={modalDisplayData}
                  setOpenModal={setOpenModal}
                />
              )}
              headerTitle={`${
                modalDisplayData ? "Edit" : "Create"
              } Subscription`}
              modalToggle={openModal}
              fnSetModalToggle={setOpenModal}
            />
          )}
        </div>
      </main>
    </section>
  );
};
export default ManualSubscription;
