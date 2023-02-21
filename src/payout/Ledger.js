import React, { useEffect, useState } from "react";
import NavBar from "../components/dashboard/NavBar/NavBar";
import {
  fetchPayoutLedgerReportSlice,
  fetchClientCode
} from "../slices/payoutSlice";
import { useSelector, useStore, useDispatch } from "react-redux";
import moment from "moment";
import Spinner from "../_components/reuseable_components/ProgressBar";
import LedgerCards from "./ledgerCards";
import DropDownCountPerPage from "../_components/reuseable_components/DropDownCountPerPage";


const PayoutLedger = (props) => {
  const dispatch = useDispatch();
  const payoutState = useSelector((state) => state.payout);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [startDate, setStartDate] = useState("all");
  const [endDate, setEndDate] = useState("all");
  const [transStatus, setTransStatus] = useState("all");
  const [transferType, setTransferType] = useState("all");

  useEffect(() => {
    fetchledgerMerchants();
    dispatch(fetchClientCode());
  }, [currentPage, pageSize]);

  const TotalData = payoutState?.ledgerDetails?.count;
  const ledgerData = payoutState?.ledgerDetails?.results;
  const transactionsCount = payoutState?.ledgerDetails?.count;

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
  const  resetTable = (e) => {
    setStartDate("all");
    setEndDate("all");
    setTransStatus((e.target.value = "all"));
    setTransferType("all");
    fetchledgerMerchants();
  };

  //Pagination
  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const totalPages = Math.ceil(TotalData / pageSize);
  let pageNumbers = [];
  if (!Number.isNaN(totalPages)) {
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }
  useEffect(() => {
    let lastSevenPage = totalPages - 7;
    if (pageNumbers?.length > 0) {
      let start = 0;
      let end = currentPage + 6;
      if (totalPages > 6) {
        start = currentPage - 1;

        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage;
        }
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      });
      setDisplayPageNumber(pageNumber);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <section className="ant-layout">
        <div>{props.navBar == undefined && <NavBar />}</div>
        {payoutState.isLoading && <Spinner />}

        <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
        <div className="right_layout my_account_wrapper right_side_heading">
              <h1 className="m-b-sm gx-float-left">Ledger</h1>
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
                <div className="form-group  col-lg-2 mx-4">
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
                    style={{height:"35px"}}
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
                    style={{height:"34px"}}
                  >
                    <option selected value="all">
                      All
                    </option>
                    <option value="PAYIN">PAYIN</option>
                    <option value="PAYOUT">PAYOUT</option>
                  </select>
                </div>
                <div className="form-group col-lg-1 mt-3">
                  <label></label>
                  <button className="btn btn-sm btn-primary" type="submit">
                    Search{" "}
                  </button>
                </div>
                <div className="form-group col-lg-1 ml-3 mt-3 ">
                  <label></label>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={resetTable}
                  >
                    Reset{" "}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="gx-main-content-wrapper">
            <div className="gap ml-4">
              {/* <p>{`Last ${transactionsCount} Transactions`}</p> */}
            </div>
            <div class="table-responsive">
              <table
                cellspaccing={0}
                cellPadding={10}
                border={0}
                width="100%"
                className="tables ml-4 table-bordered"
              >
                <tbody>
                  <tr>
                    <th>Id</th>
                    <th>Client's Username</th>
                    <th>Amount</th>
                    <th>Status Type</th>
                    <th>Txn Status</th>
                    <th>Txn Type</th>
                    <th>Txn Amt Type</th>
                    <th>Customer Ref No/Order Id</th>
                    <th>Txn Completed time</th>
                    <th>Txn Initiated time</th>
                    <th>Charge</th>
                    <th>Payment Mode</th>
                    <th>Beneficiary Acc Name</th>
                    <th>Beneficiary Acc No</th>
                    <th>Beneficiary IFSC</th>
                    <th>Payout Txn Id</th>
                    <th>Opening Balance</th>
                    <th>Remarks</th>
                    <th>Created On</th>
                  </tr>
                  {ledgerData?.length == 0 ? (
                    <tr>
                      <td colSpan={"11"}>
                        <div className="nodatafound text-center">
                          No data found{" "}
                        </div>
                        <br />
                        <br />
                        {/* <p className="text-center">{spinner && <Spinner />}</p> */}
                      </td>
                    </tr>
                  ) : (
                    ledgerData?.map((data) => {
                      return (
                        <tr>
                          <td>{data.id}</td>
                          <td>{data.client_username}</td>
                          <td>{`₹ ${data.amount}.00`}</td>
                          <td>{data.type_status}</td>
                          <td>{data.trans_status}</td>
                          <td>{data.trans_type.toUpperCase()}</td>
                          <td>
                            {makeFirstLetterCapital(data.trans_amount_type)}
                          </td>
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
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <ul className="pagination justify-content-center mt-2">
            <div className="form-group mr-2 ">
              {/* <label>Count Per Page</label> */}
              <select
                value={pageSize}
                rel={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="ant-input"
              >
                <DropDownCountPerPage datalength={TotalData} />
              </select>
            </div>
            <li className="page-item">
              <button className="page-link" onClick={prevPage}>
                Previous
              </button>
            </li>

            {displayPageNumber?.map((pgNumber, i) => (
              <li
                key={i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }
                onClick={() => setCurrentPage(pgNumber)}
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span>{pgNumber}</span>
                </a>
              </li>
            ))}

            <li className="page-item">
              <button
                className="page-link"
                onClick={nextPage}
                disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
              >
                Next
              </button>
            </li>
          </ul>
        </main>
      </section>
    </>
  );
};
export default PayoutLedger;
