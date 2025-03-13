import React, { useState, useRef, useEffect } from "react";
import Charts from "./Charts";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import ActionButtons from "./ActionButtons";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import transactionCardIcon from "../../../../assets/images/paylink/icon (2).svg";
import payerCardIcon from "../../../../assets/images/paylink/icon (3).svg";
import generateLinkCardIcon from "../../../../assets/images/paylink/icon (1).svg";
import moment from "moment";
import customStyle from "./paymentLinkSolution.module.css"

// import {
//   getDashboardData,
//   getTxnData,
//   getTxnGraphData,
// } from "../../../../slices/paymentLink/paymentLinkSlice";

import { getDashboardData, getTxnData, getTxnGraphData } from "./paylink-solution-slice/paylinkSolutionSlice";
import { Link } from "react-router-dom/cjs/react-router-dom";
import RecentTransaction from "./recent-transaction/RecentTransaction";

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
        start_date: fromDate,
        end_date: toDate,
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
        <div className="col-12 d-flex justify-content-between align-items-center ">
          <p className="border border-default bg-white rounded p-2 shadow" >
            Date Range: {moment(fromDate).format("ll")} to {moment(toDate).format("ll")}
          </p>


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
              <div className="col-12 col-md-4">
                <div className="card shadow p-3 rounded border-0 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-1">Total Transaction</h6>
                    <span className={`${customStyle.card_icon_1} ${customStyle.card_icon}`}>
                      <img src={transactionCardIcon} alt="Icon" width={"22px"} /></span>
                  </div>
                  <h5 className="">
                    {dashboardData?.transaction_data?.value}
                  </h5>
                  <div className="position-absolute bottom-0 end-0 p-3 top-50">
                    <Link to={`${path}/recent-transaction`} className="text-decoration-none">
                      <span className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}  >
                        <i className="fa fa-arrow-right text-primary"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="card shadow p-3 rounded border-0 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-1">Total Link Generated</h6>
                    <span className={`${customStyle.card_icon_2} ${customStyle.card_icon}`}><img src={generateLinkCardIcon} alt="Icon" /></span>
                  </div>
                  <h5 className="">
                    {dashboardData?.payment_link_data?.value}
                  </h5>
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <Link to={`${path}/total-link-generated`} className="text-decoration-none">
                      <span className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}  >
                        <i className="fa fa-arrow-right text-primary"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>


              <div className="col-12 col-md-4">
                <div className="card shadow p-3 rounded border-0 position-relative">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-1">Total Payers</h6>
                    <span className={`${customStyle.card_icon_3} ${customStyle.card_icon}`}><img src={payerCardIcon} alt="Icon" /></span>
                  </div>
                  <h5 className="">
                    {dashboardData?.payer_data?.value}
                  </h5>
                  <div className="position-absolute bottom-0 end-0 p-3">
                    <Link to={`${path}/total-payers`} className="text-decoration-none">
                      <span className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}  >
                        <i className="fa fa-arrow-right text-primary"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-12">
                <div className="card shadow p-3">
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

          <div className="col-12 col-md-4 p-0">
            <div className="card shadow border-1 rounded-1">
              <div className="card-header border-0 bg-white">
                <h6 className="card-title mt-3">
                  Transactions Payment Mode
                </h6>
              </div>
              <Charts
                chartType="donut"
                data={dashboardData?.transaction_mode_data}
              />
            </div>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-12">
            {/* <RecentTransaction /> */}
            <TransactionTable data={txnTableData?.results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaylinkDashboard;
