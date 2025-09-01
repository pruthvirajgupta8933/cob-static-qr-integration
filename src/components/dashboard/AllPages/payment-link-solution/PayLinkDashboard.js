import React, { useState, useRef, useEffect } from "react";
import Charts from "./Charts";
import TransactionTable from "./TransactionTable";
import FilterModal from "./FilterModal";
import ActionButtons from "./ActionButtons";
import { useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TransactionFilter from "./transaction-filter/TransactionFilter";
import transactionCardIcon from "../../../../assets/images/paylink/icon (2).svg";
import payerCardIcon from "../../../../assets/images/paylink/icon (3).svg";
import generateLinkCardIcon from "../../../../assets/images/paylink/icon (1).svg";
import customStyle from "./paymentLinkSolution.module.css";
import {
  getDashboardData,
  getTxnData,
  getTxnGraphData,
} from "./paylink-solution-slice/paylinkSolutionSlice";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { durationFilter } from "./durationFilter";
import {
  setGraphFilterOption,
  setSeletedGraphOption,
} from "../../../../slices/date-filter-slice/DateFilterSlice";

const PaylinkDashboard = () => {
  const { graphSelectedCurrentOption } = useSelector(
    (state) => state.dateFilterSliceReducer
  );
  const [showFilter, setShowFilter] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showAddPayerModal, setShowAddPayerModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    graphSelectedCurrentOption || "hourly"
  );
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

  useEffect(() => {
    dispatch(
      getDashboardData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
      })
    );

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

    // setDashboardTxnData([]);
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
      .catch((err) => { });
  }, []);

  const filterOptionHandler = ({ fromDate, toDate }) => {
    const durationRange = durationFilter({ fromDate, toDate });

    dispatch(setGraphFilterOption({ duration: durationRange }));
    dispatch(setSeletedGraphOption({ currentFilter: durationRange[0] }));

    dispatch(
      getDashboardData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
      })
    );

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

    setDashboardTxnData([]);
    dispatch(
      getTxnGraphData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
        transaction_data_span: durationRange[0],
      })
    )
      .then((res) => {
        if (res.payload?.transaction_graph_data) {
          setDashboardTxnData(res.payload.transaction_graph_data);
        }
      })
      .catch((err) => { });
  };

  const lineChartGraphHandler = (currentSelectionOption) => {
    // fromDate
    // toDate
    // lineChartGraphHandler
    setDashboardTxnData([]);
    dispatch(
      getTxnGraphData({
        start_date: fromDate,
        end_date: toDate,
        client_code: user.clientMerchantDetailsList?.[0]?.clientCode,
        transaction_data_span: currentSelectionOption,
      })
    )
      .then((res) => {
        if (res.payload?.transaction_graph_data) {
          setDashboardTxnData(res.payload.transaction_graph_data);
        }
      })
      .catch((err) => { });
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex gap-2 ">
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
          onApply={filterOptionHandler}
        />
      </div>

      <div className="row mt-4 ">
        <div className="col-12 col-md-12 col-lg-8">
          <div className="row gap-2 gap-lg-0 d-flex flex-row">
            <div className="col-12 col-md-12 col-lg-4">
              <div className="card shadow p-3 rounded border-0 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-1">Total Transaction</h6>
                  <span
                    className={`${customStyle.card_icon_1} ${customStyle.card_icon}`}
                  >
                    <img src={transactionCardIcon} alt="Icon" width={"22px"} />
                  </span>
                </div>
                <h5 className="">
                  ₹ {dashboardData?.transaction_data?.value || 0}
                </h5>
                <div className="position-absolute bottom-0 end-0 p-3 top-50">
                  <Link
                    to={`${path}/recent-transaction`}
                    className="text-decoration-none"
                  >
                    <span
                      className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}
                    >
                      <i className="fa fa-arrow-right text-primary"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4">
              <div className="card shadow p-3 rounded border-0 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-1">Total Link Generated</h6>
                  <span
                    className={`${customStyle.card_icon_2} ${customStyle.card_icon}`}
                  >
                    <img src={generateLinkCardIcon} alt="Icon" />
                  </span>
                </div>
                <h5 className="">
                  {dashboardData?.payment_link_data?.value || 0}
                </h5>
                <div className="position-absolute bottom-0 end-0 p-3">
                  <Link
                    to={`${path}/total-link-generated`}
                    className="text-decoration-none"
                  >
                    <span
                      className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}
                    >
                      <i className="fa fa-arrow-right text-primary"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 col-lg-4">
              <div className="card shadow p-3 rounded border-0 position-relative">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-1">Total Payers</h6>
                  <span
                    className={`${customStyle.card_icon_3} ${customStyle.card_icon}`}
                  >
                    <img src={payerCardIcon} alt="Icon" />
                  </span>
                </div>
                <h5 className="">{dashboardData?.payer_data?.value || 0}</h5>
                <div className="position-absolute bottom-0 end-0 p-3">
                  <Link
                    to={`${path}/total-payers`}
                    className="text-decoration-none"
                  >
                    <span
                      className={`${customStyle.card_link_icon_arrow} ${customStyle.shadow_icon} bg-light`}
                    >
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
                  onApply={lineChartGraphHandler}
                />

                <Charts chartType="line" data={dashboardTxnData} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-12 col-lg-4">
          <div className="card shadow border-1 rounded-1 h-100">
            <div className="card-header border-0 bg-white">
              <h6 className="card-title mt-3">Transactions Payment Mode</h6>
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
  );
};

export default PaylinkDashboard;
