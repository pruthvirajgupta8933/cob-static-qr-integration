/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import Yup from "../../../../_components/formik/Yup";
import ReportLayout from "../../../../_components/report_component/ReportLayout";
import FormikController from "../../../../_components/formik/FormikController";
import _ from "lodash";
import {
  clearTransactionHistory,
  // exportTxnHistory,
  exportTxnLoadingState,
  fetchTransactionHistoryDetailSlice,
  fetchTransactionHistorySlice,
} from "../../../../slices/dashboardSlice";
import API_URL from "../../../../config";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";

import Notification from "../../../../_components/reuseable_components/Notification";
// import exportToSpreadsheet from "../../../../utilities/exportToSpreadsheet"
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import moment from "moment";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import classes from "../allpage.module.css";
import { fetchChildDataList } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import TransactionRefund from "./TransactionRefund";
import ExportTransactionHistory from "./ExportTransactionHistory";
import TransactionDetailModal from "./TransactionDetailModal";
import { dateFormatBasic } from "../../../../utilities/DateConvert";
import toastConfig from "../../../../utilities/toastTypes";
import { Dashboardservice } from "../../../../services/dashboard.service";
import {
  fetchPayModeList,
  fetchPayStatusList,
} from "../../../../slices/dashboardSlice";
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";

// import API_URL from "../"

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();
  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { paymode, payStatus } = dashboard;
  const { user } = auth;

  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];
  // const { isLoadingTxnHistory, isExportData } = dashboard;
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [show, setShow] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [clientCodeList, setClientCodeList] = useState([]);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setDisable] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [radioInputVal, setRadioInputVal] = useState({});
  const [refundModal, setRefundModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [downloadData, setDownloadData] = useState({});
  const [transactionDetailModal, setTransactionDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [filterState, setFilterState] = useState([]);
  const [duration, setDuration] = useState("today");
  const [exportReportLoader, setExportReportLoader] = useState(false);

  const durations = [
    { key: "today", value: "Today" },
    { key: "yesterday", value: "Yesterday" },
    { key: "last7Days", value: "Last 7 days" },
    { key: "currentMonth", value: "Current Month" },
    { key: "lastMonth", value: "Last Month" },
    { key: "last3Month", value: "Last 90 days" },
    { key: "last6Month", value: "Last 180 days" },
    { key: "custom", value: "Custom Date" },
  ];

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const fetchData = () => {
    const roleType = roles;
    const type = roleType.bank
      ? "bank"
      : roleType.referral
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

  let clientMerchantDetailsList = [];
  if (
    user &&
    user?.clientMerchantDetailsList === null &&
    user?.roleId !== 3 &&
    user?.roleId !== 13
  ) {
    history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user?.clientMerchantDetailsList;
  }

  const clientcode_rolebased = roles.bank
    ? "All"
    : roles.merchant
      ? clientMerchantDetailsList[0]?.clientCode
      : "";

  const clientCode = clientcode_rolebased;
  const todayDate = splitDate;

  // const indexMemo = useMemo(() => (currentPage - 1) * pageSize, [pageSize, currentPage])

  const initialValues = {
    clientCode: clientCode,
    fromDate: todayDate,
    endDate: todayDate,
    transaction_status: "All",
    payment_mode: "All",
  };

  const validationSchema = Yup.object({
    // fromDate: Yup.date().required("Required"), //not needed since we already provide values from code
    clientCode: Yup.string().required("Client code not found"),
    endDate: Yup.date().required("Required"),
    transaction_status: Yup.string().required("Required"),
    payment_mode: Yup.string().required("Required"),
  });

  let isExtraDataRequired = false;
  let extraDataObj = {};
  if (user.roleId === 3 || user.roleId === 13) {
    isExtraDataRequired = true;
    extraDataObj = { key: "All", value: "All" };
  }

  const forClientCode = true;

  let fnKey,
    fnVal = "";
  let clientCodeListArr = [];
  if (roles?.merchant === true) {
    fnKey = "clientCode";
    fnVal = "clientName";
    clientCodeListArr = clientMerchantDetailsList;
  } else {
    fnKey = "client_code";
    fnVal = "name";
    clientCodeListArr = clientCodeData;
  }
  const clientCodeOption = convertToFormikSelectJson(
    fnKey,
    fnVal,
    clientCodeListArr,
    extraDataObj,
    isExtraDataRequired,
    forClientCode
  );

  useEffect(() => {
    setClientCodeList(clientCodeListArr);
  }, [clientCodeListArr]);

  const tempPayStatus = [{ key: "All", value: "All" }];
  payStatus.map((item) => {
    if (
      item?.payment_status_name !== "CHALLAN_ENQUIRED" &&
      item?.payment_status_name !== "INITIATED"
    ) {
      if (item?.is_active) {
        tempPayStatus.push({
          key: item?.payment_status_name,
          value: item?.payment_status_name,
        });
      }
    }
  });

  const tempPaymode = [{ key: "All", value: "All" }];
  paymode.map((item) => {
    tempPaymode.push({ key: item.paymode_id, value: item.paymode_name });
  });

  // const pagination = (pageNo) => {
  //    setCurrentPage(pageNo);
  // };

  const submitHandler = (values) => {
    setDownloadData(values);
    const currDate = new Date();
    const getLastMonthDays = (month) => {
      let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (currDate.getFullYear() % 4 === 0) {
        if (
          currDate.getFullYear() % 100 === 0 &&
          currDate.getFullYear() % 400 !== 0
        )
          days[1] = 28;
        else days[1] = 29;
      }
      return days[month];
    };
    switch (duration) {
      case "yesterday": {
        values.fromDate = currDate.setDate(currDate.getDate() - 1);
        values.endDate = new Date().setDate(new Date().getDate() - 1);
        break;
      }
      case "last7Days": {
        values.fromDate = currDate.setDate(currDate.getDate() - 6);
        break;
      }
      case "currentMonth": {
        values.fromDate = currDate.setDate(1);
        break;
      }
      case "lastMonth": {
        values.fromDate = new Date(
          currDate.getFullYear(),
          currDate.getMonth() - 1,
          1
        );
        values.endDate = new Date(
          currDate.getFullYear(),
          currDate.getMonth() - 1,
          getLastMonthDays(currDate.getMonth() - 1)
        );
        break;
      }
      case "last3Month": {
        values.fromDate = currDate.setDate(currDate.getDate() - 89);
        break;
      }
      case "last6Month": {
        values.fromDate = currDate.setDate(currDate.getDate() - 179);
        break;
      }
      case "today":
      case "custom":
      case "default":
        break;
    }
    setRefundModal(false);
    setRadioInputVal({});

    isButtonClicked(true);
    setDisable(true);
    const { fromDate, endDate, transaction_status, payment_mode } = values;

    const dateRangeValid = checkValidation(fromDate, endDate);
    if (dateRangeValid) {
      let strClientCode,
        clientCodeArrLength = "";
      if (values.clientCode === "All") {
        const allClientCode = [];
        clientCodeListArr?.map((item) => {
          allClientCode.push(item.client_code);
        });
        clientCodeArrLength = allClientCode.length.toString();
        strClientCode = allClientCode.join().toString();
      } else {
        strClientCode = values.clientCode;
        clientCodeArrLength = "1";
      }

      let paramData = {
        clientCode: strClientCode,
        paymentStatus: transaction_status,
        paymentMode: payment_mode,
        fromDate: moment(fromDate).startOf("day").format("YYYY-MM-DD"),
        endDate: moment(endDate).startOf("day").format("YYYY-MM-DD"),
        length: "0",
        page: "0",
        noOfClient: clientCodeArrLength,
      };

      // console.log(paramData,"this is paramdata value")
      setFilterState(paramData);
      dispatch(fetchTransactionHistorySlice(paramData)).then((res) => {
        setDisable(false);
      });
    }
  };
  const checkValidation = (fromDate, toDate) => {
    let flag = true;

    if (!fromDate || !toDate) {
      alert("Please select both start and end dates.");
      flag = false;
    } else {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);

      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let allowedTxnViewDays = 180;

      // if (user?.roleId === 3) {
      //   allowedTxnViewDays = 92;
      //   monthAllowed = 3;
      // }

      if (diffDays < 0 || diffDays > allowedTxnViewDays) {
        flag = false;
        alert(`Please choose a maximum duration of 180 days.`);
        setDisable(false);
      }
    }

    return flag;
  };

  useEffect(() => {

    let TxnListArrUpdated = dashboard.transactionHistory;
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(_(TxnListArrUpdated).slice(0).take(pageSize).value());
  }, [dashboard]);

  useEffect(() => {
    setPaginatedData(_(showData).slice(0).take(pageSize).value());
    setPageCount(
      showData.length > 0 ? Math.ceil(showData.length / pageSize) : 0
    );
  }, [pageSize, showData]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(showData).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    if (!payStatus.length > 0) dispatch(fetchPayStatusList());
    if (!paymode.length > 0) dispatch(fetchPayModeList());
    SetTxnList([]);
    setRadioInputVal({});
    return () => {
      dispatch(clearTransactionHistory());
    };
  }, []);

  useEffect(() => {
    txnList.length > 0 ? setShow(true) : setShow(false);
  }, [txnList]);

  useEffect(() => {
    if (searchText !== "") {
      setShowData(
        updateTxnList.filter((txnItme) =>
          Object.values(txnItme)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLocaleLowerCase())
        )
      );
    } else {
      setShowData(updateTxnList);
    }
  }, [searchText]);

  const getSearchTerm = (e) => {
    SetSearchText(e.target.value);
  };

  const today = new Date();
  const lastThreeMonth = new Date(today);
  lastThreeMonth.setDate(lastThreeMonth.getDate() - 90);
  lastThreeMonth.toLocaleDateString("en-IN");

  const refundModalHandler = (e) => {
    e.preventDefault();
    setRefundModal(true);
  };

  let handleExportLoading = (state) => {
    // console.log(state)
    if (state) {
      alert("Exporting Excel File, Please wait...");
    }
    dispatch(exportTxnLoadingState(state));
    return state;
  };


  const exportToExcelFn = async () => {
    setExportReportLoader(true);
    try {
      const res = await axiosInstanceJWT.post(API_URL?.getMerchantTransactionExcelHistory, filterState, {
        responseType: 'blob',
      });

      if (res.status === 200) {
        const disposition = res.headers['content-disposition'];
        const filenameMatch = disposition && disposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : 'Transaction-History.xlsx';

        const blob = new Blob([res.data], { type: 'text/xlsx' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);


      } else {
        toastConfig.errorToast("Failed to download");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorBlob = new Blob([err.response.data], { type: 'application/json' });
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const errorData = JSON.parse(reader.result);
            toastConfig.errorToast(errorData.message || "Something went wrong.");
          } catch (e) {
            toastConfig.errorToast("Something went wrong");
          }
        };
        reader.readAsText(errorBlob);
      } else {
        toastConfig.errorToast("Something went wrong. Please try again.");
      }
    } finally {
      setExportReportLoader(false);
      setDisable(false);
    }
  };




  // handle transaction detail modal and display the selected record
  const transactionDetailModalHandler = (transactionData) => {
    dispatch(
      fetchTransactionHistoryDetailSlice({
        txn_id: transactionData.txn_id,
      })
    )
      .then((res) => setSelectedTransaction(res?.payload))
      .catch((e) =>
        toastConfig.errorToast("Error occured while fetching details")
      );
    setTransactionDetailModal(true);
  };

  const handleDurationChange = ({ value, setFieldValue }) => {
    setDuration(value);
    setFieldValue("duration", value);
    setFieldValue("fromDate", new Date());
    setFieldValue("endDate", new Date());
  };
  const form = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={submitHandler}
    >
      {(formik) => (
        <Form>
          <div className="form-row mt-4">
            {(roles?.bank || roles?.referral) && (
              <div className="form-group col-md-4 col-lg-2 col-sm-12">
                <FormikController
                  control="select"
                  label="Client Code"
                  name="clientCode"
                  className="form-select rounded"
                  options={clientCodeOption}
                />
              </div>
            )}
            <div className="form-group col-md-3 col-lg-2 col-sm-12">
              <FormikController
                control="select"
                label="Select Duration"
                name="duration"
                className="form-select rounded"
                options={durations}
                onChange={(e) =>
                  handleDurationChange({
                    value: e.target.value,
                    setFieldValue: formik.setFieldValue,
                  })
                }
              />
            </div>
            {duration === "custom" && (
              <div className="form-group col-md-6 col-lg-4 col-xl-3 col-sm-12 ">
                <label htmlFor="dateRange" className="form-label">
                  Start Date - End Date
                </label>
                <div
                  className={`input-group mb-3 d-flex justify-content-between bg-white ${classes.calendar_border}`}
                >
                  <DatePicker
                    id="dateRange"
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartDate(start);
                      setEndDate(end);
                      formik.setFieldValue("fromDate", start);
                      formik.setFieldValue("endDate", end);
                    }}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date Range"
                    className={`form-control rounded p-0 date_picker ${classes.calendar} ${classes.calendar_input_border}`}
                    showPopperArrow={false}
                    popperClassName={classes.custom_datepicker_popper}
                  />
                  <div
                    className="input-group-append"
                    onClick={() => {
                      document.getElementById("dateRange").click();
                    }}
                  >
                    <span
                      className={`input-group-text ${classes.calendar_input_border}`}
                    >
                      {" "}
                      <FaCalendarAlt />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group col-md-3 col-lg-2 col-sm-12">
              <FormikController
                control="select"
                label="Transactions Status"
                name="transaction_status"
                className="form-select rounded mt-0"
                options={tempPayStatus}
              />
            </div>

            <div className="form-group col-md-3 col-lg-2 col-sm-12">
              <FormikController
                control="select"
                label="Payment Mode"
                name="payment_mode"
                className="form-select rounded mt-0"
                options={tempPaymode}
              />
            </div>
          </div>
          <div className="row d-flex justify-content-between">
            <div className="form-group col-md-6 col-lg-6">
              <button
                className="btn btn-sm cob-btn-primary text-white"
                type="submit"
                disabled={disable}
              >
                {disable && (
                  <span
                    className="spinner-border spinner-border-sm mr-1"
                    role="status"
                    ariaHidden="true"
                  ></span>
                )}
                Search
              </button>
              {txnList?.length > 0 && (
                <button
                  type="button"
                  className="btn btn-sm text-white cob-btn-primary mx-2"
                  onClick={() => exportToExcelFn()}
                  disabled={exportReportLoader}
                >
                  <i className="fa fa-download"></i>
                  {exportReportLoader ? " Loading..." : " Export"}
                </button>
              )}
            </div>
            <div className="form-group col-md-1 col-lg-1">
              {/* hide refund button for the selected client code on production */}
              {user?.clientMerchantDetailsList?.[0].clientCode !== "Utta89" &&
                <button
                  className="btn cob-btn-primary btn-sm"
                  onClick={refundModalHandler}
                  disabled={
                    radioInputVal?.status?.toLocaleLowerCase() !== "success" &&
                    radioInputVal?.status?.toLocaleLowerCase() !== "settled"
                  }
                >
                  Refund
                </button>
              }
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
  const rowData = [
    {
      id: "1",
      name: radioInputVal?.status ? (
        <p
          className="text-primary m-0 user_info"
          onClick={() => setRadioInputVal({})}
        >
          Unselect
        </p>
      ) : (
        <span className="font-weight-bold m-0 user_info">Select</span>
      ),
      cell: (row) =>
        (row?.status?.toLocaleLowerCase() === "success" ||
          row?.status?.toLocaleLowerCase() === "settled") && (
          <input
            name="refund_request"
            value={row.txn_id}
            type="radio"
            onClick={(e) => setRadioInputVal(row)}
            checked={row.txn_id === radioInputVal?.txn_id}
          />
        ),
      width: "95px",
    },
    {
      id: "1232",
      name: "RRN / UTR",
      selector: (row) => row.pg_txn_id,
      cell: (row) => (
        <div
          // className="text-primary"
          // style={{ cursor: "pointer" }}
          className="custom_hover_primary"
          onClick={() => transactionDetailModalHandler(row)}
        >
          {row.pg_txn_id}
        </div>
      ),
      width: "150px",
    },
    {
      id: "2",
      name: "Transaction ID",
      selector: (row) => row.txn_id,
      cell: (row) => (
        <div
          className="custom_hover_primary"
          onClick={() => transactionDetailModalHandler(row)}
        >
          {row.txn_id}
        </div>
      ),
      width: "150px",
    },
    {
      id: "3",
      name: "Client Transaction ID",
      selector: (row) => row.client_txn_id,
      cell: (row) => (
        <div
          className="custom_hover_primary"

          onClick={() => transactionDetailModalHandler(row)}
        >
          {row.client_txn_id}
        </div>
      ),
      width: "200px",
    },
    {
      id: "4",
      name: "Amount",
      selector: (row) => Number.parseFloat(row.payee_amount).toFixed(2),
      sortable: true,
      width: "120px",
    },
    {
      id: "122",
      name: "Currency Type",
      selector: (row) => row.amount_type,
      width: "120px",
    },
    {
      id: "5",
      name: "Payment Status",
      selector: (row) => row.status,
      sortable: true,
      width: "130px",
    },
    {
      id: "6",
      name: "Transaction Date",
      selector: (row) => row.trans_date,
      cell: (row) => <div>{dateFormatBasic(row.trans_date)}</div>,
      sortable: true,
      width: "135px",
    },
    {
      id: "7",
      name: "Transaction Complete Date",
      selector: (row) => row.trans_complete_date,
      cell: (row) => <div>{dateFormatBasic(row.trans_complete_date)}</div>,
      sortable: true,
      width: "135px",
    },
    {
      id: "8",
      name: "Payer First Name",
      selector: (row) => row.payee_first_name,
      sortable: true,
      width: "130px",
    },
    {
      id: "9",
      name: "Payer Mob. Number",
      selector: (row) => row.payee_mob,
      width: "130px",
    },
    {
      id: "10",
      name: "Payer Email",
      selector: (row) => row.payee_email,
      sortable: true,
      width: "130px",
    },
    {
      id: "11",
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      width: "130px",
    },
  ];
  return (
    <section className="">
      <div className="profileBarStatus">
        {refundModal && (
          <TransactionRefund
            refundModal={refundModal}
            setRefundModal={setRefundModal}
            radioInputVal={radioInputVal}
          />
        )}
        {transactionDetailModal && (
          <TransactionDetailModal
            fnSetModalToggle={() => setTransactionDetailModal(false)}
            transactionData={selectedTransaction}
          />
        )}
      </div>
      <main>
        <ReportLayout
          type="transaction_history"
          title="Transaction History"
          data={txnList}
          rowData={rowData}
          form={form}

          // onRowClick={transactionDetailModalHandler}
          showSearch
          showCountPerPage
        />
        <ExportTransactionHistory
          openModal={openModal}
          setOpenModal={setOpenModal}
          downloadData={downloadData}
          checkValidation={checkValidation}
          clientCodeListArr={clientCodeListArr}
        />
      </main>
    </section>
  );
};

export default TransactionHistory;