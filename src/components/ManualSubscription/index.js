import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import {
  deleteSubscriptionPlan,
  getSubscriptionPlans,
} from "../../slices/subscription";
import DateFormatter from "../../utilities/DateConvert";
import SubscriptionModal from "./SubscriptionModal";
import toastConfig from "../../utilities/toastTypes";

const ManualSubscription = () => {
  const subscriptionPlans = useSelector(
    (state) => state.subscription.manualSubscriptions
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [modalDisplayData, setModalDisplayData] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubscriptionPlans());
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
      name: "S. No.",
      selector: (row) => row.s_no,
      sortable: true,
      width: "80px",
    },
    {
      id: "2",
      name: "Client Name",
      selector: (row) => row.client_name,
      sortable: true,
      width: "150px",
    },
    {
      id: "3",
      name: "Email",
      selector: (row) => row.email,
      width: "180px",
    },
    {
      id: "4",
      name: "Client Id",
      selector: (row) => row.client_id,
    },
    {
      id: "5",
      name: "Application Name",
      selector: (row) => row.payment_gateway?.application_name,
      sortable: true,
      width: "135px",
    },
    {
      id: "6",
      name: "Subscription Status",
      selector: (row) => row.payment_gateway?.subscription_status,
      width: "120px",
    },
    {
      id: "7",
      name: "Plan Name",
      selector: (row) => row.payment_gateway?.plan_name,
    },
    {
      id: "8",
      name: "Mandate Start Date",
      selector: (row) =>
        DateFormatter(row.payment_gateway?.mandate_start_time, false),
    },
    {
      id: "10",
      name: "Mandate End Date",
      selector: (row) =>
        DateFormatter(row.payment_gateway?.mandate_end_time, false),
    },
    {
      id: "11",
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="submit"
            onClick={() => {
              setModalDisplayData(row);
              setOpenModal(true);
            }}
            className="approve cob-btn-primary btn-sm text-white mr-1"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Update
          </button>
          <button
            type="submit"
            onClick={() => {
              let isExecuted = window.confirm(
                "Are you sure to execute this action?"
              );
              if (isExecuted) {
                dispatch(deleteSubscriptionPlan({ id: 2 }))
                  .then((res) =>
                    res.payload.status === 200
                      ? toastConfig.successToast(res.payload.data?.message)
                      : toastConfig.errorToast(res.payload.data?.details)
                  )
                  .catch((err) => toastConfig.errorToast("Error occurred"));
              } else {
                console.log("Action canceled");
              }
            }}
            className="approve cob-btn-primary btn-sm text-white"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Delete
          </button>
        </>
      ),
      width: "140px",
    },
  ];
  return (
    <section className="">
      <main className="">
        <div className="">
          <h5>Manual Subscription</h5>
        </div>
        <div className="container-fluid p-0">
          <button
            onClick={() => {
              // setModalDisplayData(row);
              setOpenModal(true);
            }}
            className="approve cob-btn-primary btn-sm text-white my-4"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Create New Subscription
          </button>
          <div className="scroll overflow-auto">
            {subscriptionPlans?.count > 0 ? (
              <h6>Total Count : {subscriptionPlans.count}</h6>
            ) : (
              ""
            )}
            {subscriptionPlans?.count === 0 && (
              <h5 className="text-center font-weight-bold mt-5">
                No Data Found
              </h5>
            )}
            {!subscriptionPlans?.loading && subscriptionPlans?.count > 0 && (
              <Table
                row={rowData}
                data={subscriptionPlans?.results}
                dataCount={subscriptionPlans?.count}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
              />
            )}
          </div>
          <CustomLoader loadingState={subscriptionPlans?.loading} />
        </div>
        {openModal && (
          <SubscriptionModal
            setOpenModal={setOpenModal}
            data={modalDisplayData}
          />
        )}
      </main>
    </section>
  );
};
export default ManualSubscription;
