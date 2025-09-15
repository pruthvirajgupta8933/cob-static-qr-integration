/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { successTxnSummary } from "../../../slices/dashboardSlice";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import classes from "./allpage.module.css";
import toastConfig from "../../../utilities/toastTypes";
import ReportLayout from "../../../_components/report_component/ReportLayout";
import { Dashboardservice } from "../../../services/dashboard.service";
import moment from "moment";
import { saveAs } from "file-saver";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";

function TransactionSummery() {
  const dispatch = useDispatch();
  const userRole = roleBasedAccess();
  const [dttype, setDttype] = useState("1");
  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState(moment().toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [localIsLoading, setLocalIsLoading] = useState(true);

  const { auth, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];
  const { successTxnsumry } = useSelector(state => state.dashboard);
  const { user } = auth;

  const [strClientCode, setStrClientCode] = useState("");
  const [clientCodeArrLength, setClientCodeArrLength] = useState("");

  useEffect(() => {
    if (userRole.merchant !== true) {
      const allClientCode = clientCodeData
        .filter((item) => item.client_code)
        .map((item) => item.client_code);
      setClientCodeArrLength(allClientCode.length?.toString());
      setStrClientCode(allClientCode.join()?.toString());
    } else {
      setStrClientCode(user?.clientMerchantDetailsList[0]?.clientCode);
      setClientCodeArrLength("1");
    }
  }, [userRole.merchant, clientCodeData, user]);

  const fetchTransactionSummary = useCallback(() => {
    if (strClientCode) {
      setLocalIsLoading(true);
      const objParam = {
        fromdate: moment(fromDate).format("YYYY-MM-DD"),
        todate: moment(toDate).format("YYYY-MM-DD"),
        dttype,
        clientcodelst: strClientCode,
        clientNo: clientCodeArrLength,
        page: currentPage,
        length: pageSize,
      };
      dispatch(successTxnSummary(objParam));
    }
  }, [
    dispatch,
    strClientCode,
    clientCodeArrLength,
    fromDate,
    toDate,
    dttype,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    fetchTransactionSummary();
  }, [fetchTransactionSummary]);

  useEffect(() => {
    if (!successTxnsumry?.loading) {
      setLocalIsLoading(false);
    }
  }, [successTxnsumry]);

  const handleDropdownChange = (e) => {
    const value = e.currentTarget.value;
    setDttype(value);
    setCurrentPage(1);

    const today = moment();
    let newFromDate, newToDate;

    switch (value) {
      case "1":
        newFromDate = today.clone();
        newToDate = today.clone();
        break;
      case "2":
        newFromDate = today.clone().subtract(1, "days");
        newToDate = today.clone().subtract(1, "days");
        break;
      case "3":
        newFromDate = today.clone().subtract(6, "days");
        newToDate = today.clone();
        break;
      case "4":
        newFromDate = today.clone().startOf("month");
        newToDate = today.clone().endOf("month");
        break;
      case "5":
        newFromDate = today.clone().subtract(1, "month").startOf("month");
        newToDate = today.clone().subtract(1, "month").endOf("month");
        break;
      case "6":
        newFromDate = fromDate;
        newToDate = toDate;
        break;
      default:
        break;
    }
    setFromDate(newFromDate.toDate());
    setToDate(newToDate.toDate());
  };

  const handleCustomDateChange = (update) => {
    const [start, end] = update;
    setFromDate(start);
    setToDate(end);
    if (start && end) {
      setCurrentPage(1);
      const diffDays = moment(end).diff(moment(start), "days");
      if (diffDays > 30) {
        toastConfig.errorToast("Maximum 31 days allowed");
      }
    }
  };

  useEffect(() => {
    const type = userRole.bank
      ? "bank"
      : userRole.referral
        ? "referrer"
        : "default";
    if (type !== "default") {
      let postObj = {
        type: type,
        login_id: auth?.user?.loginId,
      };
      dispatch(fetchChildDataList(postObj));
    }
  }, [dispatch, userRole.bank, userRole.referral, auth?.user?.loginId]);

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (successTxnsumry?.results?.length > 0) {
      SetTxnList(successTxnsumry?.results);
      SetShowData(successTxnsumry?.results);
    } else {
      SetTxnList([]);
      SetShowData([]);
    }
  }, [successTxnsumry]);

  useEffect(() => {
    search !== ""
      ? SetShowData(
        txnList.filter((txnItme) =>
          Object.values(txnItme)
            .join(" ")
            .toLowerCase()
            .includes(search.toLocaleLowerCase())
        )
      )
      : SetShowData(txnList);
  }, [search, txnList]);

  const handleChange = (e) => {
    SetSearch(e);
  };

  let totalSuccessTxn = 0;
  let totalAmt = 0;
  showData.forEach((item) => {
    totalSuccessTxn += item.no_of_transaction;
    totalAmt += item.payeeamount;
  });

  const exportToExcelFn = async () => {
    const objParam = {
      fromdate: moment(fromDate).format("YYYY-MM-DD"),
      todate: moment(toDate).format("YYYY-MM-DD"),
      dttype,
      clientcodelst: strClientCode,
      clientNo: clientCodeArrLength,
    };

    try {
      const response = await Dashboardservice.exportTxnSummaryData(objParam);
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Transaction_Summary_${moment().format("YYYY-MM-DD")}.xlsx`);
      }
    } catch (error) {
      console.error("Error exporting transaction summary:", error);
      toastConfig.errorToast("Failed to export data");
    }
  };

  const form = (
    <div className="row">
      <div className={`form-group col-md-3 ${dttype === "6" && "mt-4"}`}>
        <select
          className="form-select"
          value={dttype}
          onChange={handleDropdownChange}
        >
          <option value="1">Today</option>
          <option value="2">Yesterday</option>
          <option value="3">Last 7 Days</option>
          <option value="4">Current Month</option>
          <option value="5">Last Month</option>
          <option value="6">Custom</option>
        </select>
      </div>
      {dttype === "6" && (
        <div className="col-md-3">
          <label htmlFor="dateRange" className="form-label">
            Start Date - End Date
          </label>
          <div
            className={`input-group mb-3 d-flex justify-content-between bg-white ${classes.calendar_border}`}
          >
            <DatePicker
              id="dateRange"
              selectsRange={true}
              startDate={fromDate}
              endDate={toDate}
              onChange={handleCustomDateChange}
              dateFormat="dd-MM-yyyy"
              maxDate={new Date()}
              placeholderText="Select Date Range"
              className={`form-control rounded-0 p-0 date_picker ${classes.calendar} ${classes.calendar_input_border}`}
              showPopperArrow={false}
              popperClassName={classes.custom_datepicker_popper}
            />
          </div>
        </div>
      )}
      {userRole.merchant !== true && (
        <div className={`col-lg-3 ${dttype === "6" && "mt-4"}`}>
          <input
            type="text"
            className="form-control"
            onChange={(e) => {
              handleChange(e.currentTarget.value);
            }}
            placeholder="Search from here"
          />
        </div>
      )}
      {txnList.length > 0 && !localIsLoading ? (
        <div className={`col-md-3 ${dttype === "6" && "mt-4"}`}>
          <button
            className="btn cob-btn-primary text-white btn-sm"
            style={{ backgroundColor: "rgb(1, 86, 179)" }}
            type="button"
            onClick={() => exportToExcelFn()}
          >
            Export
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
  const rowData = [
    {
      id: "1",
      name: "S.No",
      selector: (row, index) => row.SrNo || index + 1,
      sortable: true,
    },
    {
      id: "2",
      name: "Client ID",
      selector: (row) => row.client_id,
      cell: (row) => <div className="removeWhiteSpace">{row?.client_id}</div>,
    },
    {
      id: "8",
      name: "Client Code",
      selector: (row) => row.client_code,
      cell: (row) => <div className="removeWhiteSpace">{row?.client_code}</div>,
    },
    {
      id: "3",
      name: "Client Name",
      selector: (row) => row.client_name,
      cell: (row) => <div className="removeWhiteSpace">{row.client_name}</div>,
    },
    {
      id: "4",
      name: "Transactions",
      selector: (row) => row.no_of_transaction,
      cell: (row) => (
        <div className="removeWhiteSpace">{row.no_of_transaction}</div>
      ),
    },
    {
      id: "5",
      name: "Amount",
      cell: (row) => <div>Rs {Number.parseFloat(row.payeeamount).toFixed(2)}</div>,
      sortable: true,
    },
  ];
  return (
    <section className="">
      <main>
        {
          <ReportLayout
            type="txnSummary"
            title="Transaction Summary"
            data={showData}
            rowData={rowData}
            form={form}
            dataSummary={[
              {
                name: "Total Settlement Amount (INR)",
                value: successTxnsumry?.total_settlement_amount,
              },
              {
                name: "Total GMV ",
                value: successTxnsumry?.total_gmv,
              },
            ]}
            loadingState={localIsLoading}
            dynamicPagination={true}
            page_size={pageSize}
            dataCount={successTxnsumry?.count}
            current_page={currentPage}
            change_currentPage={changeCurrentPage}
            change_pageSize={changePageSize}
          />
        }
      </main>
    </section>
  );
}
export default TransactionSummery;