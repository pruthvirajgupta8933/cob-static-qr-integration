/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _, { set } from "lodash";
import { Formik, Form } from "formik";
import Table from "../../../_components/table_components/table/Table";
import FormikController from "../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  clearSettlementReport,
  fetchSettlementReportSlice,
  fetchSettlementSummary,
} from "../../../slices/dashboardSlice";
import Notification from "../../../_components/reuseable_components/Notification";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
// import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { fetchChildDataList } from "../../../slices/persist-slice/persistSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { v4 as uuidv4 } from "uuid";
import Yup from "../../../_components/formik/Yup";
import CustomModal from "../../../_components/custom_modal";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import CustomLoader from "../../../_components/loader";
import ReportLayout from "../../../_components/report_component/ReportLayout";
import { axiosInstanceJWT } from "../../../utilities/axiosInstance";
import API_URL from "../../../config";
import toastConfig from "../../../utilities/toastTypes";
import { Callbacks } from "jquery";
import { Dashboardservice } from "../../../services/dashboard.service";


const SettlementReportNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFound, setDataFound] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterState, setFilterState] = useState(null);
  const [exportReportLoader, setExportReportLoader] = useState(false);
  const [exportDisable, setExportDisable] = useState(false);
  const [dataCount, setDataCount] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [runapi, setRunApi] = useState(false);
  const [totalSettlementAmount, setSettlementAmount] = useState(0);

  const { auth, dashboard, commonPersistReducer } = useSelector(
    (state) => state
  );
  const { user } = auth;
  const { isLoadingTxnHistory, settlementSummaryReport } = dashboard;
  const { refrerChiledList } = commonPersistReducer;

  const roles = roleBasedAccess();
  const clientCodeData = refrerChiledList?.resp?.results ?? [];

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1]?.length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2]?.length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };

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

  let isExtraDataRequired = false;
  let extraDataObj = {};
  if (user.roleId === 3 || user.roleId === 13) {
    isExtraDataRequired = true;
    extraDataObj = { key: "All", value: "All" };
  }

  const forClientCode = true;

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
  const [todayDate, setTodayDate] = useState(splitDate);
  const initialValues = {
    clientCode: "",
    fromDate: todayDate,
    endDate: todayDate,
    noOfClient: "1",
    rpttype: "0",
  };
  if (
    roles.merchant === true &&
    clientCodeListArr &&
    clientCodeListArr?.length > 0 &&
    clientCodeListArr[0] &&
    clientCodeListArr[0][fnKey]
  ) {
    initialValues.clientCode = clientCodeListArr[0][fnKey];
  }

  const rowData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.SrNo,
      sortable: true,
      width: "95px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.client_code,
      cell: (row) => <div className="removeWhiteSpace">{row?.client_code}</div>,
      width: "120px",
    },
    {
      id: "3",
      name: "Client Name",
      selector: (row) => row.client_name,
      cell: (row) => <div className="removeWhiteSpace">{row.client_name}</div>,
      width: "120px",
    },
    {
      id: "4",
      name: "SP Transaction ID",
      selector: (row) => row.txn_id,
      cell: (row) => <div className="removeWhiteSpace">{row.txn_id}</div>,
      width: "120px",
    },
    {
      id: "5",
      name: "Client Transaction ID",
      selector: (row) => row.client_txn_id,
      cell: (row) => (
        <div className="removeWhiteSpace">{row.client_txn_id}</div>
      ),
      width: "120px",
    },
    {
      id: "6",
      name: "Amount",
      selector: (row) => Number.parseFloat(row.payee_amount).toFixed(2),
      sortable: true,
      width: "120px",
    },
    {
      id: "7",
      name: "Settlement Amount",
      selector: (row) => Number.parseFloat(row.settlement_amount).toFixed(2),
      sortable: true,
      width: "130px",
    },
    {
      id: "8",
      name: "Transaction Date",
      selector: (row) => row.trans_date,
      cell: (row) => <div>{dateFormatBasic(row.trans_date)}</div>,
      sortable: true,
      width: "135px",
    },
    {
      id: "9",
      name: "Transaction Complete Date",
      selector: (row) => row.trans_complete_date,
      cell: (row) => <div>{dateFormatBasic(row.trans_complete_date)}</div>,
      sortable: true,
      width: "135px",
    },
    {
      id: "10",
      name: "Settlement Date",
      selector: (row) => row.settlement_date,
      cell: (row) => <div>{dateFormatBasic(row.settlement_date)}</div>,
      sortable: true,
      width: "130px",
    },
    {
      id: "11",
      name: "Settlement Bank Ref",
      selector: (row) => row.settlement_bank_ref,
      width: "130px",
    },
    {
      id: "11",
      name: "Settlement UTR",
      selector: (row) => row.settlement_utr,
      sortable: true,
      width: "130px",
    },
    {
      id: "11",
      name: "Settlement Remarks",
      selector: (row) => row.settlement_remarks,
      width: "130px",
    },
  ];

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });

  useEffect(() => {

    setDataFound(txnList?.length === 0);
  }, [txnList]);


  useEffect(() => {
    if (runapi) {
      setLoadingState(true);
      dispatch(fetchSettlementReportSlice(filterState)).then((resp) => {
        setLoadingState(false);

      });
    }
  }, [pageSize, currentPage, dispatch]);

  const onSubmitHandler = async (values) => {
    setLoadingState(true)
    let strClientCode,
      clientCodeArrLength = "";
    if (values.clientCode === "All") {
      const allClientCode = [];
      clientCodeListArr?.map((item) => {
        allClientCode.push(item.client_code);
      });
      clientCodeArrLength = allClientCode?.length?.toString();
      strClientCode = allClientCode.join()?.toString();
    } else {
      strClientCode = values.clientCode;
      clientCodeArrLength = "1";
    }

    const newFilterState = {
      clientCode: strClientCode,
      fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
      endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
      noOfClient: clientCodeArrLength,
      rpttype: values.rpttype,
      page: currentPage,
      length: pageSize,
    };

    setFilterState(newFilterState);
    setCurrentPage(1)


    isButtonClicked(true);
    setIsDisable(true);

    try {
      const res = await dispatch(fetchSettlementReportSlice(newFilterState));
      const ApiStatus = res?.meta?.requestStatus;
      setRunApi(true)

      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
      }
      setLoadingState(false)
    } catch (error) {
      toast.error("An error occurred");
      setLoadingState(false)
    } finally {
      setIsDisable(false);
    }
  };

  // console.log(filterState, "filterState");

  useEffect(() => {
    const TxnListArrUpdated = dashboard?.settlementReport?.results;
    SetTxnList(TxnListArrUpdated);
    setDataCount(dashboard?.settlementReport?.count);
    setSettlementAmount(dashboard?.settlementReport?.total_settlement_amount);
    // When search text changes, filter the current txnList
    if (searchText !== "") {
      const filteredData = TxnListArrUpdated?.filter((txnItem) =>
        Object.values(txnItem)
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLocaleLowerCase())
      );
      SetTxnList(filteredData);
    } else {
      SetTxnList(TxnListArrUpdated);
    }
  }, [dashboard, searchText]);


  const changeCurrentPage = (page) => {
    setCurrentPage(page);

    if (filterState) {
      setFilterState((prev) => ({ ...prev, page: page }));
    }
  };


  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes

    if (filterState) {
      setFilterState((prev) => ({ ...prev, length: size, page: 1 }));
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearSettlementReport());
    };
  }, []);

  const exportToExcelFn = async () => {
    // console.log(1)
    if (!filterState) {
      toast.info("Please perform a search first to export data.");
      return;
    }

    setExportDisable(true);
    // console.log({
    //   client_code: filterState.clientCode,
    //   start_date: filterState.fromDate,
    //   end_date: filterState.endDate,
    //   // transaction_status: filterState.transaction_status,
    // })
    try {
      const res = await Dashboardservice.exportSettlementReportNew(
        {
          clientCode: filterState.clientCode,
          fromDate: filterState.fromDate,
          endDate: filterState.endDate,
          noOfClient: filterState.noOfClient,
          rpttype: filterState.rpttype,
          // transaction_status: filterState.transaction_status,
        },
        {
          responseType: "blob", // important for downloading file
        }
      );

      if (res.status === 200) {
        const disposition = res.headers["content-disposition"];
        const filenameMatch = disposition && disposition.match(/filename="?([^"]+)"?/);
        const filename = filenameMatch ? filenameMatch[1] : "Transaction-History-Report.xlsx";

        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);

        toast.success("Report exported successfully!");
      } else {
        toast.error("Failed to download report.");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errorBlob = new Blob([err.response.data], { type: "application/json" });
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const errorData = JSON.parse(reader.result);
            toast.error(errorData.message || "Something went wrong.");
          } catch (e) {
            toast.error("Something went wrong.");
          }
        };
        reader.readAsText(errorBlob);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setExportDisable(false);
    }
  };

  const settlementAmount = txnList?.reduce((prevVal, currVal) => {
    return prevVal + parseFloat(currVal.settlement_amount || 0);
  }, 0);

  const getTransactionSummary = (values) => {
    setShowModal(!showModal);
    let strClientCode;
    if (values.clientCode === "All") {
      const allClientCode = clientCodeListArr?.map((item) => item.client_code);
      strClientCode = allClientCode.join()?.toString();
    } else {
      strClientCode = values.clientCode;
    }
    dispatch(
      fetchSettlementSummary({
        clientCode: strClientCode,
        fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
        endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
        paymentStatus: "ALL",
        paymentMode: "ALL",
        page: 0,
        length: 0,
      })
    );
  };

  const exportSummaryToExcel = () => {
    if (!settlementSummaryReport?.data || settlementSummaryReport.data.length === 0) {
      toast.info("No summary data to export.");
      return;
    }

    const excelHeaderRow = [
      "SR NO",
      "CLIENT CODE",
      "CLIENT NAME",
      "SETTLEMENT AMOUNT",
      "CHARGE BACK AMOUNT",
      "REFUNDED AMOUNT",
      "SETTLEMENT DATE",
      "SETTLEMENT BY",
      "TRANSACTION COUNT",
    ];
    if (user?.loginId === 31706) excelHeaderRow.push("UDF13");
    const excelArr = [excelHeaderRow];

    settlementSummaryReport.data?.map((item, index) => {
      const allowDataToShow = {
        srNo: index + 1, // Ensure sequential numbering for SR NO
        client_code: item.client_code || "",
        client_name: item.client_name || "",
        settlement_amount: item.settlement_amount || "",
        charge_back_amount: item.charge_back_amount || "",
        refunded_amount: item.refunded_amount || "",
        settlement_date: item.settlement_date
          ? dateFormatBasic(item.settlement_date)
          : "",
        settlement_by: item.settlement_by || "",
        txn_count: item.txn_count || "",
      };
      if (user?.loginId === 31706) allowDataToShow.udf13 = item.udf13 || "";
      excelArr.push(Object.values(allowDataToShow));
    });
    let handleExportLoading = (state) => {
      if (state) {
        alert("Exporting Excel File, Please wait...")
      }
      return state
    }
    const fileName = "Settlement-Txn-Summary-Report";
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
  };

  const modalBody = () => {
    if (settlementSummaryReport?.loading)
      return <CustomLoader loadingState={settlementSummaryReport?.loading} />;
    else if (settlementSummaryReport?.data?.length === 0)
      return <h6>No data found for the summary.</h6>;
    return (
      <>
        <h6 className="d-flex align-items-center flex-wrap gap-2 m-0">
          <p className="mb-0 me-3">Total Record: {settlementSummaryReport.data?.length}</p>
          <p className="mb-0 me-3">|</p>
          <p className="mb-0">
            Total Settlement Amount (INR):{" "}
            {settlementSummaryReport.data
              ?.reduce((amt, data) => amt + (data.settlement_amount || 0), 0)
              .toFixed(2)}
          </p>
        </h6>

        <div className="table-responsive mt-2"> {/* Added responsive class for better modal table display */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.R. No.</th>
                <th>Client Code</th>
                <th>Client Name</th>
                <th>Settlement Amount</th>
                <th>Charge Back Amount</th>
                <th>Refunded Amount</th>
                <th>Settlement Date</th>
                <th>Settlement By</th>
                <th>Transaction Count</th>
                {user?.loginId === 31706 && <th>UDF13</th>}
              </tr>
            </thead>
            <tbody>
              {settlementSummaryReport.data?.map((item, index) => (
                <tr key={index}> {/* Added key for list items */}
                  <td>{index + 1}</td> {/* Corrected S.R. No. */}
                  <td>{item.client_code}</td>
                  <td>{item.client_name}</td>
                  <td>{Number(item.settlement_amount).toFixed(2)}</td>
                  <td>{Number(item.charge_back_amount).toFixed(2)}</td>
                  <td>{Number(item.refunded_amount).toFixed(2)}</td>
                  <td>{dateFormatBasic(item.settlement_date)}</td>
                  <td>{item.settlement_by}</td>
                  <td>{item.txn_count}</td>
                  {user?.loginId === 31706 && <td>{item.udf13}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };
  const form = (

    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >

      {(formik) => (

        <Form>
          <div className="form-row">
            <div className="form-group col-lg-3">
              <FormikController
                control="select"
                label="Client Code"
                name="clientCode"
                className="form-select rounded-0 mt-0"
                options={clientCodeOption}

              />
            </div>
            <div className="form-group col-lg-3">
              <FormikController
                control="date"
                label="From Date"
                id="fromDate"
                name="fromDate"
                value={
                  formik.values.fromDate
                    ? new Date(formik.values.fromDate)
                    : null
                }
                onChange={(date) => formik.setFieldValue("fromDate", date)}
                format="dd-MM-y"
                clearIcon={null}
                className="form-control rounded-0 p-0"
                required={true}
                errorMsg={formik.errors["fromDate"]}

              />

            </div>

            <div className="form-group col-lg-3">
              <FormikController
                control="date"
                label="End Date"
                id="endDate"
                name="endDate"
                value={
                  formik.values.endDate ? new Date(formik.values.endDate) : null
                }
                onChange={(date) => formik.setFieldValue("endDate", date)}
                format="dd-MM-y"
                clearIcon={null}
                className="form-control rounded-0 p-0"
                required={true}
                errorMsg={formik.errors["endDate"]}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-1 mr-2">
              <button
                disabled={disable}
                className="btn cob-btn-primary text-white btn-sm"
                type="submit"

              >
                {disable && (
                  <span
                    className="spinner-border spinner-border-sm mr-1"
                    role="status"
                    ariaHidden="true"

                  ></span>

                )}{" "}
                Search{" "}
              </button>
            </div>

            {txnList?.length > 0 ? (

              <>

                <div className="form-group col-md-1 ml-1">
                  <button
                    className="btn cob-btn-primary text-white btn-sm"
                    style={{ backgroundColor: "rgb(1, 86, 179)" }}
                    type="button"
                    onClick={() => exportToExcelFn()}
                    disabled={exportReportLoader}
                  >
                    <i className="fa fa-download"></i>
                    {exportReportLoader ? " Loading..." : " Export"}
                  </button>
                </div>
                <div className="form-group col-md-1 ml-2">
                  <button
                    className="btn cob-btn-primary text-white btn-sm"
                    style={{ backgroundColor: "rgb(1, 86, 179)" }}
                    type="button"

                    onClick={() => getTransactionSummary(formik.values)}

                  >

                    Settlement Summary

                  </button>

                </div>

              </>

            ) : (

              <></>

            )}

          </div>

        </Form>

      )}

    </Formik>

  );
  return (
    <section className="ant-layout">

      <main>
        <div>
          <ReportLayout
            type="settlement"
            title="Settlement Report"
            data={txnList}
            rowData={rowData}
            form={form}
            dataCount={dataCount}
            dataSummary={[
              {
                name: "Settlement Amount (INR)",
                value: totalSettlementAmount?.toFixed(2),
              }
            ]}
            showSearch
            showCountPerPage
            dynamicPagination={true}
            page_size={pageSize}
            current_page={currentPage}
            change_currentPage={changeCurrentPage}
            change_pageSize={changePageSize}
            loadingState={loadingState}
          // totalSettlementAmount={totalSettlementAmount}
          />

          {showModal && (
            <CustomModal
              modalBody={modalBody}
              headerTitle={
                <>
                  Settlement Summary
                  {settlementSummaryReport?.data?.length > 0 && (
                    <button
                      className="btn cob-btn-primary text-white btn-sm ml-5"
                      style={{ backgroundColor: "rgb(1, 86, 179)" }}
                      type="button"
                      onClick={exportSummaryToExcel}
                    >
                      Export
                    </button>
                  )}
                </>
              }
              modalToggle={showModal}
              fnSetModalToggle={setShowModal}
            />
          )}
        </div>
      </main>
    </section>
  );
}

export default SettlementReportNew;