import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../../../_components/formik/FormikController";
import _ from "lodash";
import {
  clearTransactionHistory,
  fetchTransactionHistoryDetailSlice,
  fetchTransactionHistorySlice,
  fetchPayModeList,
  fetchPayStatusList,
} from "../../../../slices/dashboardSlice";
import API_URL from "../../../../config";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
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
import { axiosInstanceJWT } from "../../../../utilities/axiosInstance";
import Table from "../../../../_components/table_components/table/Table";
import CardLayout from "../../../../utilities/CardLayout";
import SearchByApiPayload from "../../../../_components/table_components/filters/SearchByApiPayload";
import CountPerPageFilter from "../../../../_components/table_components/filters/CountPerPage";

const TransactionHistory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();

  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { paymode, payStatus, transactionHistory } = dashboard;
  const { user } = auth;
  const { refrerChiledList } = merchantReferralOnboardReducer;

  const clientCodeData = refrerChiledList?.resp?.results ?? [];

  const [transactionList, setTransactionList] = useState([]);
  const [payloadSearchText, setPayloadSearchText] = useState("");
  const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalGmv, setTotalGmv] = useState(0)

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactionData, setFilteredTransactionData] = useState([]);
  const [selectedClientCodeList, setSelectedClientCodeList] = useState([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedRefundTransaction, setSelectedRefundTransaction] = useState({});
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFilterData, setExportFilterData] = useState({});
  const [showTransactionDetailModal, setShowTransactionDetailModal] =
    useState(false);
  const [selectedTransactionDetail, setSelectedTransactionDetail] = useState({});
  const [currentFilterState, setCurrentFilterState] = useState(null);
  const [duration, setDuration] = useState("today");
  const [isExportReportLoading, setIsExportReportLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [loadingState, setLoadingState] = useState(false);

  const durationOptions = [
    { key: "today", value: "Today" },
    { key: "yesterday", value: "Yesterday" },
    { key: "last7Days", value: "Last 7 days" },
    { key: "currentMonth", value: "Current Month" },
    { key: "lastMonth", value: "Last Month" },
    { key: "last3Month", value: "Last 90 days" },
    { key: "last6Month", value: "Last 180 days" },
    { key: "custom", value: "Custom Date" },
  ];

  const fetchClientData = useCallback(() => {
    const roleType = roles.bank
      ? "bank"
      : roles.referral
        ? "referrer"
        : "default";
    if (roleType !== "default") {
      dispatch(fetchChildDataList({ type: roleType, login_id: user?.loginId }));
    }
  }, [dispatch, roles, user?.loginId]);

  useEffect(() => {
    fetchClientData();
  }, []);

  useEffect(() => {
    if (
      user &&
      user?.clientMerchantDetailsList === null &&
      user?.roleId !== 3 &&
      user?.roleId !== 13
    ) {
      history.push("/dashboard/profile");
    }
  }, [user, history]);

  const clientCodeRoleBased = useMemo(() => {
    if (roles.bank) return "All";
    if (roles.merchant) return user?.clientMerchantDetailsList?.[0]?.clientCode;
    return "";
  }, [roles, user?.clientMerchantDetailsList]);

  const initialValues = {
    clientCode: clientCodeRoleBased,
    fromDate: new Date(),
    endDate: new Date(),
    transaction_status: "All",
    payment_mode: "All",
    duration: "today",
  };

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Client code not found"),
    transaction_status: Yup.string().required("Required"),
    payment_mode: Yup.string().required("Required"),
  });

  const { clientCodeOption, processedClientCodeList } = useMemo(() => {
    let isExtraDataRequired = false;
    let extraDataObj = {};
    if (user.roleId === 3 || user.roleId === 13) {
      isExtraDataRequired = true;
      extraDataObj = { key: "All", value: "All" };
    }

    let fnKey, fnVal;
    let clientCodeListForConversion = [];

    if (roles?.merchant === true) {
      fnKey = "clientCode";
      fnVal = "clientName";
      clientCodeListForConversion = user?.clientMerchantDetailsList;
    } else {
      fnKey = "client_code";
      fnVal = "name";
      clientCodeListForConversion = clientCodeData;
    }
    const convertedOptions = convertToFormikSelectJson(
      fnKey,
      fnVal,
      clientCodeListForConversion,
      extraDataObj,
      isExtraDataRequired,
      true
    );
    return {
      clientCodeOption: convertedOptions,
      processedClientCodeList: clientCodeListForConversion,
    };
  }, [clientCodeData, roles, user]);

  useEffect(() => {
    setSelectedClientCodeList(processedClientCodeList);
  }, [processedClientCodeList]);

  const memoizedPayStatusOptions = useMemo(() => {
    const tempPayStatus = [{ key: "All", value: "All" }];
    payStatus.forEach((item) => {
      if (
        item?.payment_status_name !== "CHALLAN_ENQUIRED" &&
        item?.payment_status_name !== "INITIATED" &&
        item?.is_active
      ) {
        tempPayStatus.push({
          key: item?.payment_status_name,
          value: item?.payment_status_name,
        });
      }
    });
    return tempPayStatus;
  }, [payStatus]);

  const memoizedPaymodeOptions = useMemo(() => {
    const tempPaymode = [{ key: "All", value: "All" }];
    paymode.forEach((item) => {
      tempPaymode.push({ key: item.paymode_id, value: item.paymode_name });
    });
    return tempPaymode;
  }, [paymode]);

  const validateDateRange = useCallback((fromDate, toDate) => {
    if (!fromDate || !toDate) {
      toastConfig.errorToast("Please select both start and end dates.");
      return false;
    }

    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);

    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const allowedTxnViewDays = 180;

    if (diffDays < 0 || diffDays > allowedTxnViewDays) {
      toastConfig.errorToast(
        `Please choose a maximum duration of ${allowedTxnViewDays} days.`
      );
      setIsFormDisabled(false);
      return false;
    }
    return true;
  }, []);

  const fetchTransactions = useCallback(
    (payload) => {
      setIsSearchButtonClicked(true);
      setIsFormDisabled(true);
      setLoadingState(true);
      setTransactionList([]);
      setFilteredTransactionData([]);
      setTransactionCount(0);

      const dateRangeValid = validateDateRange(moment(payload.fromDate).toDate(), moment(payload.endDate).toDate());
      if (dateRangeValid) {
        let clientCodeString;
        let numberOfClients;
        if (payload.clientCode === "All") {
          const allClientCodes = selectedClientCodeList.map(
            (item) => item.client_code
          );
          numberOfClients = allClientCodes.length.toString();
          clientCodeString = allClientCodes.join(",");
        } else {
          clientCodeString = payload.clientCode;
          numberOfClients = "1";
        }

        const finalParamData = {
          clientCode: clientCodeString,
          paymentStatus: payload.paymentStatus,
          paymentMode: payload.paymentMode,
          fromDate: payload.fromDate,
          endDate: payload.endDate,
          length: payload.length,
          page: payload.page,
          noOfClient: numberOfClients,
          search: payload.search,
        };

        setCurrentFilterState(finalParamData);
        setExportFilterData(finalParamData);

        dispatch(fetchTransactionHistorySlice(finalParamData)).then(() => {
          setIsFormDisabled(false);
          setShowRefundModal(false);
          setSelectedRefundTransaction({});
          setLoadingState(false);
        });
      } else {
        setIsFormDisabled(false);
        setLoadingState(false);
      }
    },
    [
      validateDateRange,
      selectedClientCodeList,
      dispatch,
    ]
  );

  const submitHandler = useCallback(
    (values) => {
      setDuration(values.duration);
      setStartDate(values.fromDate);
      setEndDate(values.endDate);
      setPayloadSearchText("");
      setCurrentPage(1);

      let fromDateCalculated = moment(values.fromDate);
      let endDateCalculated = moment(values.endDate);

      switch (values.duration) {
        case "yesterday": {
          fromDateCalculated = moment().subtract(1, "days");
          endDateCalculated = moment().subtract(1, "days");
          break;
        }
        case "last7Days": {
          fromDateCalculated = moment().subtract(6, "days");
          endDateCalculated = moment();
          break;
        }
        case "currentMonth": {
          fromDateCalculated = moment().startOf("month");
          endDateCalculated = moment();
          break;
        }
        case "lastMonth": {
          fromDateCalculated = moment().subtract(1, "month").startOf("month");
          endDateCalculated = moment().subtract(1, "month").endOf("month");
          break;
        }
        case "last3Month": {
          fromDateCalculated = moment().subtract(89, "days");
          endDateCalculated = moment();
          break;
        }
        case "last6Month": {
          fromDateCalculated = moment().subtract(179, "days");
          endDateCalculated = moment();
          break;
        }
        case "today":
        case "custom":
        default:
          break;
      }

      const fullFormPayload = {
        clientCode: values.clientCode,
        paymentStatus: values.transaction_status,
        paymentMode: values.payment_mode,
        fromDate: fromDateCalculated.startOf("day").format("YYYY-MM-DD"),
        endDate: endDateCalculated.endOf("day").format("YYYY-MM-DD"),
        duration: values.duration,
        length: pageSize,
        page: 1,
        search: "",
      };

      fetchTransactions(fullFormPayload);
    },
    [fetchTransactions, pageSize]
  );

  const handlePayloadSearchSubmit = useCallback(
    (searchQuery) => {
      if (!currentFilterState) {
        toastConfig.errorToast("Please perform a main search first.");
        return;
      }
      setPayloadSearchText(searchQuery);

      const payloadForSearch = {
        ...currentFilterState,
        search: searchQuery,
        page: 1,
      };

      fetchTransactions(payloadForSearch);
    },
    [currentFilterState, fetchTransactions]
  );

  const handleClearPayloadFilter = useCallback(() => {
    setPayloadSearchText("");
    if (!currentFilterState) {
      return;
    }

    const payloadForClear = {
      ...currentFilterState,
      search: "",
      page: 1,
    };

    fetchTransactions(payloadForClear);
  }, [currentFilterState, fetchTransactions]);

  useEffect(() => {
    const transactionListUpdated = transactionHistory?.results;
    setTransactionList(transactionListUpdated);
    setTransactionCount(transactionHistory?.count);
    setTotalGmv(transactionHistory?.
      total_gmv
    )
    setFilteredTransactionData(transactionListUpdated);
  }, [transactionHistory]);

  useEffect(() => {
    if (!payStatus.length) dispatch(fetchPayStatusList());
    if (!paymode.length) dispatch(fetchPayModeList());
    setTransactionList([]);
    setSelectedRefundTransaction({});
    return () => {
      dispatch(clearTransactionHistory());
    };
  }, [dispatch, payStatus.length, paymode.length]);

  const handleRefundModalOpen = useCallback((e) => {
    e.preventDefault();
    setShowRefundModal(true);
  }, []);

  const exportToExcel = useCallback(async () => {
    if (!currentFilterState) {
      toastConfig.infoToast("Please perform a search first to export data.");
      return;
    }
    setIsExportReportLoading(true);
    try {
      const response = await axiosInstanceJWT.post(
        API_URL?.getMerchantTransactionExcelHistory,
        { ...currentFilterState, page: 0, length: 0 },
        {
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const disposition = response.headers["content-disposition"];
        const filenameMatch =
          disposition && disposition.match(/filename="(.+)"/);
        const filename = filenameMatch
          ? filenameMatch[1]
          : "Transaction-History.xlsx";

        const blob = new Blob([response.data], { type: "text/xlsx" });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
        toastConfig.successToast("Report exported successfully!");
      } else {
        toastConfig.errorToast("Failed to download");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorBlob = new Blob([err.response.data], {
          type: "application/json",
        });
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
      setIsExportReportLoading(false);
      setIsFormDisabled(false);
    }
  }, [currentFilterState]);

  const handleTransactionDetailModal = useCallback(
    (transactionData) => {
      dispatch(
        fetchTransactionHistoryDetailSlice({ txn_id: transactionData.txn_id })
      )
        .then((res) => setSelectedTransactionDetail(res?.payload))
        .catch(() => toastConfig.errorToast("Error occurred while fetching details"));
      setShowTransactionDetailModal(true);
    },
    [dispatch]
  );

  const handleDurationChange = useCallback(
    ({ value, setFieldValue }) => {
      setDuration(value);
      setFieldValue("duration", value);
      if (value === "today" || value === "custom") {
        setStartDate(new Date());
        setEndDate(new Date());
        setFieldValue("fromDate", new Date());
        setFieldValue("endDate", new Date());
      } else {
        setStartDate(null);
        setEndDate(null);
        setFieldValue("fromDate", null);
        setFieldValue("endDate", null);
      }
    },
    []
  );

  const handleChangeCurrentPage = useCallback(
    (page) => {
      if (!currentFilterState) {
        toastConfig.errorToast("Please perform a main search first.");
        return;
      }
      setCurrentPage(page);
      setLoadingState(true);
      setIsFormDisabled(true);
      const payloadForPagination = {
        ...currentFilterState,
        page: page,
        length: pageSize,
      };
      fetchTransactions(payloadForPagination);
    },
    [currentFilterState, pageSize, fetchTransactions]
  );

  const handleChangePageSize = useCallback(
    (size) => {
      if (!currentFilterState) {
        toastConfig.errorToast("Please perform a main search first.");
        return;
      }
      setPageSize(size);
      setCurrentPage(1);
      setLoadingState(true);
      setIsFormDisabled(true);
      const payloadForPageSize = {
        ...currentFilterState,
        length: size,
        page: 1,
      };
      fetchTransactions(payloadForPageSize);
    },
    [currentFilterState, fetchTransactions]
  );

  const rowData = [
    {
      id: "1",
      name: selectedRefundTransaction?.status ? (
        <p className="text-primary m-0 user_info" onClick={() => setSelectedRefundTransaction({})}>
          Unselect
        </p>
      ) : (
        <span className="m-0 user_info">Select</span>
      ),
      cell: (row) =>
        (row?.status?.toLocaleLowerCase() === "success" ||
          row?.status?.toLocaleLowerCase() === "settled") && (
          <input
            name="refund_request"
            value={row.txn_id}
            type="radio"
            onClick={() => setSelectedRefundTransaction(row)}
            checked={row.txn_id === selectedRefundTransaction?.txn_id}
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
          className="custom_hover_primary"
          onClick={() => handleTransactionDetailModal(row)}
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
          onClick={() => handleTransactionDetailModal(row)}
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
          onClick={() => handleTransactionDetailModal(row)}
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
      width: "200px",
    },
    {
      id: "11",
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      width: "130px",
    },
  ];

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <CardLayout title="Transaction History">
      <section className="">
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
                    options={durationOptions}
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
                    options={memoizedPayStatusOptions}
                  />
                </div>

                <div className="form-group col-md-3 col-lg-2 col-sm-12">
                  <FormikController
                    control="select"
                    label="Payment Mode"
                    name="payment_mode"
                    className="form-select rounded mt-0"
                    options={memoizedPaymodeOptions}
                  />
                </div>
              </div>
              <div className="row d-flex justify-content-between">
                <div className="form-group col-md-6 col-lg-6">
                  <button
                    className="btn btn-sm cob-btn-primary text-white"
                    type="submit"
                    disabled={isFormDisabled}
                  >
                    {isFormDisabled && (
                      <span
                        className="spinner-border spinner-border-sm mr-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Search
                  </button>
                  {transactionList?.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-sm text-white cob-btn-primary mx-2"
                      onClick={exportToExcel}
                      disabled={isExportReportLoading}
                    >
                      <i className="fa fa-download"></i>
                      {isExportReportLoading ? " Loading..." : " Export"}
                    </button>
                  )}
                </div>
                <div className="form-group col-md-1 col-lg-1">
                  {user?.clientMerchantDetailsList?.[0].clientCode !==
                    "Utta89" && (
                      <button
                        className="btn cob-btn-primary btn-sm"
                        onClick={handleRefundModalOpen}
                        disabled={
                          selectedRefundTransaction?.status?.toLocaleLowerCase() !==
                          "success" &&
                          selectedRefundTransaction?.status?.toLocaleLowerCase() !==
                          "settled"
                        }
                      >
                        Refund
                      </button>
                    )}
                </div>
              </div>
            </Form>
          )}
        </Formik>

        {((isSearchButtonClicked && transactionCount > 0) || payloadSearchText) && (
          <div className="row my-4">
            <div className="col-lg-3">
              <SearchByApiPayload
                onSubmitSearch={handlePayloadSearchSubmit}
                clearFilter={handleClearPayloadFilter}
                value={payloadSearchText}
              />
            </div>
            <div className="col-lg-3">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={transactionCount}
                changePageSize={handleChangePageSize}
                changeCurrentPage={changeCurrentPage}
              />
            </div>
          </div>
        )}

        <div className="profileBarStatus">
          {showRefundModal && (
            <TransactionRefund
              refundModal={showRefundModal}
              setRefundModal={setShowRefundModal}
              radioInputVal={selectedRefundTransaction}
            />
          )}
          {showTransactionDetailModal && (
            <TransactionDetailModal
              fnSetModalToggle={() => setShowTransactionDetailModal(false)}
              transactionData={selectedTransactionDetail}
            />
          )}
        </div>
        <main>
          <div className="container p-0 ">
            <div className="scroll overflow-auto">

              {transactionCount > 0 && (
                <p className="mt-2 d-inline me-2">
                  Total Count : {transactionCount}
                </p>
              )}
              {transactionCount > 0 && totalGmv > 0 && (
                <span className="mx-2">|</span>
              )}
              {totalGmv > 0 && (
                <p className="mt-2 d-inline ms-2">
                  Total GMV : {totalGmv}
                </p>
              )}


              <Table
                row={rowData}
                data={filteredTransactionData}
                dataCount={transactionCount}
                pageSize={pageSize}
                currentPage={currentPage}
                changeCurrentPage={handleChangeCurrentPage}
                changePageSize={handleChangePageSize}
                loadingState={loadingState}
              />
            </div>

          </div>
          <ExportTransactionHistory
            openModal={showExportModal}
            setOpenModal={setShowExportModal}
            downloadData={exportFilterData}
            checkValidation={validateDateRange}
            clientCodeListArr={selectedClientCodeList}
          />
        </main>
      </section>
    </CardLayout>
  );
};

export default TransactionHistory;