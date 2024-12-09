/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { successTxnSummary } from "../../../slices/dashboardSlice";
import ProgressBar from "../../../_components/reuseable_components/ProgressBar";
// import { useRouteMatch, Redirect } from "react-router-dom";
import "../css/Home.css";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { v4 as uuidv4 } from "uuid";
import classes from "./allpage.module.css";
import toastConfig from "../../../utilities/toastTypes";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import ReportLayout from "../../../_components/report_component/ReportLayout";
import DateFormatter from "../../../utilities/DateConvert";
import moment from "moment";

function TransactionSummery() {
  const dispatch = useDispatch();
  // const { path } = useRouteMatch();
  const userRole = roleBasedAccess();

  let currentDate = new Date().toLocaleDateString();

  const [dttype, setDttype] = useState("1");
  const [search, SetSearch] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [showData, SetShowData] = useState([]);
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
    // console.log("clientCodeData",clientCodeData)
    clientCodeData?.map((item) => {
      allClientCode.push(item.client_code);
    });

    clientCodeArrLength = allClientCode.length.toString();
    strClientCode = allClientCode.join().toString();
  } else {
    strClientCode = user?.clientMerchantDetailsList[0]?.clientCode;
    clientCodeArrLength = "1";
  }
  // dispatch action when client code change
  useEffect(() => {
    // console.log("user", user)
    const objParam = {
      fromdate: moment(fromDate).format("YYYY-MM-DD"),
      todate: moment(toDate).format("YYYY-MM-DD"),
      dttype,
      clientcodelst: strClientCode,
      clientNo: clientCodeArrLength,
    };

    if (dttype !== "6") dispatch(successTxnSummary(objParam));
  }, [dttype]);

  //make client code array
  if (clientCodeData !== null && clientCodeData?.length > 0) {
    clientCodeArr = clientCodeData.map((item) => {
      return item.client_code;
    });
  } else {
    clientCodeArr = [user?.clientMerchantDetailsList[0]?.clientCode];
  }

  const fetchData = () => {
    // const roleType = roles
    const type = userRole.bank
      ? "bank"
      : userRole.referral
        ? "referrer"
        : "default";
    if (type !== "default") {
      let postObj = {
        type: type, // Set the type based on roleType
        login_id: auth?.user?.loginId,
      };
      dispatch(fetchChildDataList(postObj));
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // filter api response data with client code
  useEffect(() => {
    if (successTxnsumry?.length > 0) {
      let filterData = successTxnsumry?.filter((txnsummery) => {
        if (clientCodeArr.includes(txnsummery.client_code)) {
          return clientCodeArr.includes(txnsummery.client_code);
        }
      });
      SetTxnList(filterData);
      SetShowData(filterData);
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
  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "Sr. No.",
      "Client Name",
      "Client Code",
      "Transactions",
      "Amount",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    showData.map((item, i) => {
      const allowDataToShow = {
        sr_no: i + 1,
        client_name: item.client_name,
        client_code: item.client_code,
        no_of_txn: item.no_of_transaction,
        amt: `Rs. ${item.payeeamount}`,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = `Txn-Summary-Report ${fromDate
      .toString()
      ?.substring(4, 15)}-${toDate.toString()?.substring(4, 15)}`;

    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...");
      }
      return state;
    };
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
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
      <div className={`col-lg-3 ${dttype === "6" && "mt-4"}`}>
        {/* <label>Search</label> */}
        <input
          type="text"
          className="form-control "
          onChange={(e) => {
            handleChange(e.currentTarget.value);
          }}
          placeholder="Search from here"
        />
      </div>
      {txnList.length > 0 ? (
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
        <ReportLayout
          type="txnSummary"
          title="Transaction Summary"
          data={showData}
          rowData={rowData}
          form={form}
          dataSummary={[
            {
              name: "Total Amount (INR)",
              value: showData
                ?.reduce((prevVal, currVal) => {
                  return prevVal + parseFloat(currVal.payeeamount, 2);
                }, 0)
                .toFixed(2),
            },
          ]}
        />
        {/* <section className="">
          <div className="container-fluid p-0"> */}
        {/* <div className="row mt-4">
              {" "}
              <div className="">
                {showData.length !== 0 && (
                  <h5 className="my-4">
                    Total Successful Transactions: {totalSuccessTxn} | Total
                    Amount {`(INR)`}: {totalAmt.toFixed()}
                  </h5>
                )}
              </div>
              <div>
                <table
                  cellPadding={10}
                  border={0}
                  width="100%"
                  className="tables"
                >
                  <tbody>
                    {showData.length !== 0 && isLoading === false && (
                      <tr>
                        <th>Sr. No.</th>
                        <th>Client Name</th>
                        <th>Client Code</th>
                        <th>Transactions</th>
                        <th>Amount</th>
                      </tr>
                    )}
                    {showData &&
                      !isLoading &&
                      showData.map((item, i) => {
                        return (
                          <tr key={uuidv4()}>
                            <td>{i + 1}</td>
                            <td>{item.client_name}</td>
                            <td>{item.client_code}</td>
                            <td>{item.no_of_transaction}</td>
                            <td>
                              Rs{" "}
                              {Number.parseFloat(item.payeeamount).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div> */}
        {/* {showData.length <= 0 && isLoading === false && (
                <div className="text-center p-4 m-4">
                  <h6>
                    I can't find the result for you with the given search, I'm
                    sorry, could you try it once again.
                  </h6>
                </div>
              )} */}
        {isLoading ? <ProgressBar /> : <></>}
        {/* </div>
          </div>
        </section> */}
      </main>
    </section>
  );
}

export default TransactionSummery;
