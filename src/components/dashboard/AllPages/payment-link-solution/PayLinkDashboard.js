import React, { useState, useRef, useEffect } from "react";
import Charts from "./Charts";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import ActionButtons from "./ActionButtons";
import { useHistory, useRouteMatch } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import {
  getDashboardData,
  getTxnData,
  getTxnGraphData,
} from "../../../../slices/paymentLink/paymentLinkSlice";

const PaylinkDashboard = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showAddPayerModal, setShowAddPayerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("hourly");
  const { fromDate, toDate } = useSelector(
    (state) => state.dateFilterSliceReducer
  );
  const user = useSelector((state) => state.auth.user);
  const dashboardData = useSelector(
    (state) =>
      state.paymentLinkSliceReducer.dashboardData?.[`${fromDate}-${toDate}`]
  );
  const txnTableData = useSelector(
    (state) => state.paymentLinkSliceReducer.txnTableData
  );
  const [dashboardTxnData, setDashboardTxnData] = useState([]);
  const dispatch = useDispatch();
  const filterRef = useRef(null);
  let { path } = useRouteMatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(
      getTxnData({
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
        order_by: "-id",
        page: 1,
        page_size: 10,
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getDashboardData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
      })
    );
  }, [fromDate, toDate]);
  useEffect(() => {
    dispatch(
      getTxnGraphData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
        transaction_data_span: selectedOption,
      })
    )
      .then((res) => {
        if (res.payload?.transaction_graph_data) {
          setDashboardTxnData(res.payload.transaction_graph_data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fromDate, toDate, selectedOption]);
  const handleCardClick = () => {
    history.push(`${path}/total-link-generated`);
  };

  const handleTotalPayerClick = () => {
    history.push(`${path}/total-payers`);
  };

  const handleTotalTransactionClick = () => {
    history.push(`${path}/recent-transaction`);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <h6 className="alert alert-info" role="alert">
            Date Range: {fromDate} to {toDate}
          </h6>
          {/* <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Date Range: {fromDate} to {toDate}</h6>
                        </div>
                    </div> */}

          <div className="d-flex gap-2">
            <ActionButtons
              filterRef={filterRef}
              setShowFilter={setShowFilter}
              showFilter={showFilter}
              setShowCreatePaymentModal={setShowCreatePaymentModal}
              setShowAddPayerModal={setShowAddPayerModal}
              showAddPayerModal={showAddPayerModal}
              showCreatePaymentModal={showCreatePaymentModal}
            />
            <FilterModal
              show={showFilter}
              onClose={() => setShowFilter(false)}
              filterRef={filterRef}
              onApply={() => { }}
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12 col-md-8">
            <div className="row">
              <div
                className="col-12 col-md-4"
                onClick={handleTotalTransactionClick}
              >
                <div className="card shadow-sm p-3 rounded border-0 position-relative">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-1">Total Transaction</h6>
                  </div>
                  <h5 className="text-success">
                    {dashboardData?.transaction_data?.value}
                  </h5>
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <span className="bg-light p-2 rounded-circle shadow">
                      <i className="fa fa-arrow-right text-primary"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4" onClick={handleCardClick}>
                <div className="card shadow-sm p-3">
                  <h6>Total Link Generated</h6>
                  <h5 className="text-warning">
                    {dashboardData?.payment_link_data?.value}
                  </h5>

                  <div className="position-absolute bottom-0 end-0 p-3">
                    <span className="bg-light p-2 rounded-circle shadow">
                      <i className="fa fa-arrow-right text-primary"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4" onClick={handleTotalPayerClick}>
                <div className="card shadow-sm p-3">
                  <h6>Total Payers</h6>
                  <h5 className="text-primary">
                    {dashboardData?.payer_data?.value}
                  </h5>
                  {/* <small className="text-muted">+20% from last month</small> */}
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <span className="bg-light p-2 rounded-circle shadow">
                      <i className="fa fa-arrow-right text-primary"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12">
                <div className="card shadow-sm p-3">
                  <h6>Transactions Overview</h6>
                  <TransactionFilter
                    fromDate={fromDate}
                    toDate={toDate}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                  />

                  <Charts chartType="line" data={dashboardTxnData} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card shadow-sm p-1 h-100">
              <h6 className="card-title text-center">
                Transactions Payment Mode
              </h6>
              <Charts
                chartType="donut"
                data={dashboardData?.transaction_mode_data}
              />
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            <TransactionTable data={txnTableData?.results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaylinkDashboard;
