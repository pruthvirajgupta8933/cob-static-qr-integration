import React, { useEffect, useState } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import {
  fetchPayoutLedgerReportSlice,
  fetchClientCode,
} from "../slices/payoutSlice";
import { useSelector, useStore, useDispatch } from "react-redux";
import moment from "moment";
import Spinner from "../_components/reuseable_components/ProgressBar";
import LedgerCards from "./ledgerCards";
import DropDownCountPerPage from "../_components/reuseable_components/DropDownCountPerPage";
import Table from "../_components/table_components/table/Table";
import { TransactionRowData } from "../utilities/tableData";
import Paginataion from "../_components/table_components/pagination/Pagination";
import CountPerPageFilter from "../_components/table_components/filters/CountPerPage";

const PayoutLedger = (props) => {
  const dispatch = useDispatch();
  const payoutState = useSelector((state) => state.payout);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [startDate, setStartDate] = useState("all");
  const [endDate, setEndDate] = useState("all");
  const [transStatus, setTransStatus] = useState("all");
  const [transferType, setTransferType] = useState("all");

  useEffect(() => {
    dispatch(fetchClientCode()).then((res) => {
      fetchledgerMerchants();
    });
  }, [currentPage, pageSize]);

  const TotalData = payoutState?.ledgerDetails?.count;
  const ledgerData = payoutState?.ledgerDetails?.results;
  const transactionsCount = payoutState?.ledgerDetails?.count;
  const loadingState = useSelector((state) => state.payout.isLoading);

  const fetchledgerMerchants = () => {
    const param = {
      end: endDate == "all" ? endDate : `${endDate} 23:59:59`,
      start: startDate == "all" ? startDate : `${startDate} 00:00:00`,
      trans_status: transStatus,
      transfer_type: transferType,
    };
    const data = {
      pageSize: pageSize,
      pageNumber: currentPage,
    };
    dispatch(fetchPayoutLedgerReportSlice({ param, data }));
  };
  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY hh:mm a");
    return date;
  };
  const makeFirstLetterCapital = (str) => {
    let resultString = str.charAt(0).toUpperCase() + str.substring(1);
    return resultString;
  };

  const handleSubmitDate = (e) => {
    e.preventDefault();
    fetchledgerMerchants();
  };
  const resetTable = (e) => {
    setStartDate("all");
    setEndDate("all");
    setTransStatus((e.target.value = "all"));
    setTransferType("all");
    fetchledgerMerchants();
  };

  //Map the table data
  const colData = () => {
    return (
      <>
        {ledgerData == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No data found </div>
          </td>
        ) : (
          ledgerData?.map((data, key) => (
            <tr>
              <td>{data.id}</td>
              <td>{data.client_username}</td>
              <td>{`₹ ${data.amount}.00`}</td>
              <td>{data.type_status}</td>
              <td>{data.trans_status}</td>
              <td>{data.trans_type.toUpperCase()}</td>
              <td>{makeFirstLetterCapital(data.trans_amount_type)}</td>
              <td>{data.customer_ref_no}</td>
              <td>{convertDate(data.trans_completed_time)}</td>
              <td>{convertDate(data.trans_init_time)}</td>
              <td>{`₹ ${data.charge}.00`}</td>
              <td>{data.payment_mode}</td>
              <td>{data.bene_account_name}</td>
              <td>{data.bene_account_number}</td>
              <td>{data.bene_ifsc}</td>
              <td>{data.payout_trans_id}</td>
              <td>{data.opening_balance}</td>
              <td>{data.remarks}</td>
              <td>{convertDate(data.created_at)}</td>
                          <td>{convertDate(data.updated_at)}</td>
                          <td>
                            {data.deleted_at
                              ? convertDate(data.deleted_at)
                              : ""}
                          </td>
            </tr>
          ))
        )}
      </>
    );
  };
  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };
  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  return (
    <>
      <section className="ant-layout">
        <div>{props.navBar == undefined && <NavBar />}</div>
        {payoutState.isLoading && <Spinner />}

        <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Transactions</h1>
          </div>
          {/* <LedgerCards /> */}
          <div className="container">
            <form onSubmit={handleSubmitDate}>
              <div className="row">
                <div className="form-group col-lg-2">
                  <label>Start Date</label>
                  <input
                    control="input"
                    type="date"
                    label="From Date"
                    name="from_date"
                    bookTimedate={false}
                    className="form-control rounded-0"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group  col-lg-2 ">
                  <label>End Date</label>
                  <input
                    control="input"
                    type="date"
                    aria-label=".form-select-sm example"
                    name="to_date"
                    className="form-control rounded-0"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="form-group col-lg-2">
                  <label>Transaction Status</label>
                  <select
                    onChange={(e) => setTransStatus(e.target.value)}
                    className="form-control rounded-0"
                    // aria-label=".form-select-sm example"
                    value={transStatus}
                    style={{ height: "35px" }}
                  >
                    <option selected value="all">
                      All
                    </option>
                    <option value="Failed">Failed</option>
                    <option value="Success">Success</option>
                  </select>
                </div>
                <div className="form-group col-lg-2">
                  <label>Transaction Type</label>
                  <select
                    onChange={(e) => setTransferType(e.target.value)}
                    className="form-control rounded-0"
                    aria-label=".form-select-sm example"
                    value={transferType}
                    style={{ height: "34px" }}
                  >
                    <option selected value="all">
                      All
                    </option>
                    <option value="PAYIN">PAYIN</option>
                    <option value="PAYOUT">PAYOUT</option>
                  </select>
                </div>
                <div className="form-group col-lg-2">
                  <CountPerPageFilter
                    pageSize={pageSize}
                    dataCount={TotalData}
                    changePageSize={changePageSize}
                  />
                </div>
                <div className="form-group col-lg-2 mt-4">
                  <label></label>
                  <button className="btn btn-sm btn-primary mt-2" type="submit">
                    Search{" "}
                  </button>
                </div>
                {/* <div className="form-group col-lg-1 ml-3 mt-3 ">
                  <label></label>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={resetTable}
                  >
                    Reset{" "}
                  </button>s
                </div> */}
              </div>
            </form>
          </div>
          <div className="col-md-12 ml-4 col-md-offset-4">
            <div className="scroll overflow-auto">
              {loadingState ? (
                <p className="text-center spinner-roll">{<Spinner />}</p>
              ) : (
                <Table row={TransactionRowData} col={colData} />
              )}
            </div>
            <div className="mt-2">
              <Paginataion
                dataCount={TotalData}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={changeCurrentPage}
              />
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
export default PayoutLedger;
