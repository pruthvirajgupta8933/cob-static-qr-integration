/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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
import { saveAs } from 'file-saver';
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";

function TransactionSummery() {
  const dispatch = useDispatch();
  const userRole = roleBasedAccess();
  let currentDate = new Date().toLocaleDateString();
  const [dttype, setDttype] = useState("1");
  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState(null);
  const [fromDate, setFromDate] = useState(currentDate);
  const [toDate, setToDate] = useState(currentDate);
  const { dashboard, auth, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];

  const { isLoading, successTxnsumry } = dashboard;

  const { user } = auth;
  let clientCodeArr = [];


  let totalSuccessTxn = 0;
  let totalAmt = 0;
  let strClientCode,
    clientCodeArrLength = "";

  if (userRole.merchant !== true) {
    const allClientCode = [];
    clientCodeData
      .filter(item => item.client_code)
      .map((item) => {
        allClientCode.push(item.client_code);
      });
    clientCodeArrLength = allClientCode.length?.toString();
    strClientCode = allClientCode.join()?.toString();
  } else {
    strClientCode = user?.clientMerchantDetailsList[0]?.clientCode;
    clientCodeArrLength = "1";
  }

  useEffect(() => {
    if (strClientCode) {
      const objParam = {
        fromdate: moment(fromDate).format("YYYY-MM-DD"),
        todate: moment(toDate).format("YYYY-MM-DD"),
        dttype,
        clientcodelst: strClientCode,
        clientNo: clientCodeArrLength,
        page: currentPage,
        length: pageSize,
      };
      setFilterState(objParam);
      if (dttype !== "6") dispatch(successTxnSummary(objParam));
    }
  }, [dttype, strClientCode, currentPage, pageSize]);

  if (clientCodeData !== null && clientCodeData?.length > 0) {
    clientCodeArr = clientCodeData.map((item) => {
      return item.client_code;
    });
  } else {
    clientCodeArr = [user?.clientMerchantDetailsList[0]?.clientCode];
  }

  const fetchData = () => {
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
    if (filterState) {
      setFilterState((prev) => ({ ...prev, page: page }));
    }
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
    if (filterState) {
      setFilterState((prev) => ({ ...prev, length: size, page: 1 }));
    }
  };

  useEffect(() => {
    if (successTxnsumry?.results?.length > 0) {
      // let filterData = successTxnsumry?.results?.filter((txnsummery) => {
      //   if (clientCodeArr.includes(txnsummery.client_code)) {

      //     return clientCodeArr.includes(txnsummery.client_code);
      //   }
      // });
      SetTxnList(successTxnsumry?.results);
      SetShowData(successTxnsumry?.results);
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
  }, [search]);

  useEffect(() => {
    if (dttype === "6" && fromDate && toDate) {
      if ((toDate - fromDate) / (24 * 3600 * 1000) > 31)
        toastConfig.errorToast("Maximum 31 days allowed");
      else {
        const objParam = {
          fromdate: moment(fromDate).format("YYYY-MM-DD"),
          todate: moment(toDate).format("YYYY-MM-DD"),
          dttype,
          clientcodelst: strClientCode,
          clientNo: clientCodeArrLength,
        };
        dispatch(successTxnSummary(objParam));
      }
    }
  }, [fromDate, toDate]);

  const handleChange = (e) => {
    SetSearch(e);
  };

  showData.map((item) => {
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
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `Transaction_Summary_${moment().format('YYYY-MM-DD')}.xlsx`);
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
          onChange={(e) => setDttype(e.currentTarget.value)}
        >
          <option defaultValue="selected" value="1">
            Today
          </option>
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
              onChange={(update) => {
                const [start, end] = update;
                setFromDate(start);
                setToDate(end);
              }}
              dateFormat="dd-MM-yyyy"
              maxDate={currentDate}
              placeholderText="Select Date Range"
              className={`form-control rounded-0 p-0 date_picker ${classes.calendar} ${classes.calendar_input_border}`}
              showPopperArrow={false}
              popperClassName={classes.custom_datepicker_popper}
            />
          </div>
        </div>
      )}
      {userRole.merchant !== true && <div className={`col-lg-3 ${dttype === "6" && "mt-4"}`}>
        <input
          type="text"
          className="form-control "
          onChange={(e) => {
            handleChange(e.currentTarget.value);
          }}
          placeholder="Search from here"
        />
      </div>}
      {txnList.length > 0 && !isLoading ? (
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
      id: "3",
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
      cell: (row) => (
        <div>Rs {Number.parseFloat(row.payeeamount).toFixed(2)}</div>
      ),
      sortable: true,
    },
  ];
  return (
    <section className="">
      <main>
        {<ReportLayout
          type="txnSummary"
          title="Transaction Summary"
          data={showData}
          rowData={rowData}
          form={form}
          dataSummary={[
            {
              name: "Total Settlement Amount (INR)",
              value: successTxnsumry?.total_settlement_amount
            },
            {
              name: "Total GMV ",
              value: successTxnsumry?.total_gmv
            },
          ]}
          loadingState={isLoading}
          dynamicPagination={true}
          page_size={pageSize}
          dataCount={successTxnsumry?.count}
          current_page={currentPage}
          change_currentPage={changeCurrentPage}
          change_pageSize={changePageSize}
        />}
      </main>
    </section>
  );
}
export default TransactionSummery;