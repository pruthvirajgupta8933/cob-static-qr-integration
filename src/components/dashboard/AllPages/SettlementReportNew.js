/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
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
import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { v4 as uuidv4 } from "uuid";
import Yup from "../../../_components/formik/Yup";
import CustomModal from "../../../_components/custom_modal";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import CustomLoader from "../../../_components/loader";
import ReportLayout from "../../../_components/report_component/ReportLayout";

const SettlementReportNew = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [dataFound, setDataFound] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { user } = auth;
  const { isLoadingTxnHistory, settlementSummaryReport } = dashboard;
  const { refrerChiledList } = merchantReferralOnboardReducer;
  // console.log("refrerChiledList", refrerChiledList)
  const roles = roleBasedAccess();
  const clientCodeData = refrerChiledList?.resp?.results ?? [];

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
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
  // let clientCodeListArr = roles?.merchant ===true ? clientMerchantDetailsList : clientCodeData
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
    clientCodeListArr.length > 0 &&
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
    setTimeout(() => {
      if (
        showData.length < 1 &&
        (updateTxnList.length > 0 || updateTxnList.length === 0)
      ) {
        setDataFound(true);
      } else {
        setDataFound(false);
      }
    });
  }, [showData, updateTxnList]);

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const onSubmitHandler = async (values) => {
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
    const paramData = {
      clientCode: strClientCode,
      fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
      endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
      noOfClient: clientCodeArrLength,
      rpttype: values.rpttype,
    };

    isButtonClicked(true);
    setIsDisable(true);

    try {
      const res = await dispatch(fetchSettlementReportSlice(paramData));

      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;

      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
      }

      // if (ApiStatus === "fulfilled" && ApiPayload?.length < 1) {
      //     toast.info("No data found");
      // }
    } catch (error) {
      toast.error("An error occurred");
    }

    setIsDisable(false);
  };

  useEffect(() => {
    // Remove initiated from transaction history response
    const TxnListArrUpdated = dashboard.settlementReport;
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(_(TxnListArrUpdated).slice(0).take(pageSize).value());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return () => {
      dispatch(clearSettlementReport());
    };
  }, []);

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

  const pages = _.range(1, pageCount + 1);

  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "SR NO",
      "TRANSACTION ID",
      "CLIENT TRANSACTION ID",
      "CHALLAN NO",
      // 'PG PAY MODE',
      "PAYEE AMOUNT",
      "TRANSACTION DATE",
      "TRANSACTION COMPLETE DATE",
      "STATUS",
      "PAYEE FIRST NAME",
      "PAYEE LAST NAME",
      "PAYEE MOBILE",
      "PAYEE EMAIL",
      "CLIENT CODE",
      "PAYMENT MODE",
      "PAYEE ADDRESS",

      "CLIENT NAME",
      "GR NUMBER",
      // 'PAID AMOUNT',
      // 'ACT AMOUNT',
      // 'PAG RESPONSE CODE',
      // 'RESP MSG',
      "BANK MESSAGE",
      "FEE FORWARD",
      "IFSC CODE",
      "PAYER ACOUNT NUMBER",
      "BANK TXN ID",
      // 'PG RETURN AMOUNT',
      // 'P CONVCHARGES',
      // 'P EP CHARGES',
      // 'P GST',
      "SETTLEMENT DATE",
      "SETTLEMENT AMOUNT",
      "SETTLEMENT STATUS",
      // 'SETTLEMENT BY',
      "SETTLEMENT BANK REF",
      "SETTLEMENT REMARKS",
      "SETTLEMENT UTR",

      "UDF1",
      "UDF2",
      "UDF3",
      "UDF4",
      "UDF5",
      "UDF6",
      "UDF7",
      "UDF8",
      "UDF9",
      "UDF10",
      "UDF11",
      "UDF12",
      "UDF13",
      "UDF14",
      "UDF15",
      "UDF16",
      "UDF17",
      "UDF18",
      "UDF19",
      "UDF20",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        txn_id: item.txn_id === null ? "" : item.txn_id,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        challan_no: item.challan_no === null ? "" : item.challan_no,
        // 'pg_pay_mode': item.pg_pay_mode === null ? "" : item.pg_pay_mode,
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        trans_date:
          item.trans_date === null ? "" : dateFormatBasic(item.trans_date),
        trans_complete_date:
          item.trans_complete_date === null
            ? ""
            : dateFormatBasic(item.trans_complete_date),
        status: item.status === null ? "" : item.status,
        payee_first_name:
          item.payee_first_name === null ? "" : item.payee_first_name,
        payee_lst_name: item.payee_lst_name === null ? "" : item.payee_lst_name,
        payee_mob: item.payee_mob === null ? "" : item.payee_mob,
        payee_email: item.payee_email === null ? "" : item.payee_email,
        client_code: item.client_code === null ? "" : item.client_code,
        payment_mode: item.payment_mode === null ? "" : item.payment_mode,
        payee_address: item.payee_address === null ? "" : item.payee_address,

        client_name: item.client_name === null ? "" : item.client_name,
        gr_number: item.gr_number === null ? "" : item.gr_number,

        bank_message: item.bank_message === null ? "" : item.bank_message,
        fee_forward: item.fee_forward === null ? "" : item.fee_forward,
        ifsc_code: item.ifsc_code === null ? "" : item.ifsc_code,
        payer_acount_number:
          item.payer_acount_number === null ? "" : item.payer_acount_number,
        bank_txn_id: item.bank_txn_id === null ? "" : item.bank_txn_id,

        settlement_date:
          item.settlement_date === null
            ? ""
            : dateFormatBasic(item.settlement_date),
        settlement_amount:
          item.settlement_amount === null
            ? ""
            : Number.parseFloat(item.settlement_amount),
        settlement_status:
          item.settlement_status === null ? "" : item.settlement_status,
        // 'settlement_by': item.settlement_by === null ? "" : item.settlement_by,
        settlement_bank_ref:
          item.settlement_bank_ref === null ? "" : item.settlement_bank_ref,
        settlement_remarks:
          item.settlement_remarks === null ? "" : item.settlement_remarks,
        settlement_utr: item.settlement_utr === null ? "" : item.settlement_utr,

        udf1: item.udf1 === null ? "" : item.udf1,
        udf2: item.udf2 === null ? "" : item.udf2,
        udf3: item.udf3 === null ? "" : item.udf3,
        udf4: item.udf4 === null ? "" : item.udf4,
        udf5: item.udf5 === null ? "" : item.udf5,
        udf6: item.udf6 === null ? "" : item.udf6,
        udf7: item.udf7 === null ? "" : item.udf7,
        udf8: item.udf8 === null ? "" : item.udf8,
        udf9: item.udf9 === null ? "" : item.udf9,
        udf10: item.udf10 === null ? "" : item.udf10,
        udf11: item.udf11 === null ? "" : item.udf11,
        udf12: item.udf12 === null ? "" : item.udf12,
        udf13: item.udf13 === null ? "" : item.udf13,
        udf14: item.udf14 === null ? "" : item.udf14,
        udf15: item.udf15 === null ? "" : item.udf15,
        udf16: item.udf16 === null ? "" : item.udf16,
        udf17: item.udf17 === null ? "" : item.udf17,
        udf18: item.udf18 === null ? "" : item.udf18,
        udf19: item.udf19 === null ? "" : item.udf19,
        udf20: item.udf20 === null ? "" : item.udf20,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const totalRow = [];
    totalRow[22] = "Total Settlement Amount";
    totalRow[23] = txnList.reduce(
      (sum, item) => item.settlement_amount + sum,
      0
    );
    excelArr.push([]);
    excelArr.push(totalRow);

    const fileName = "Settlement-Report";

    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...");
      }
      return state;
    };
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
  };

  const settlementAmount = txnList?.reduce((prevVal, currVal) => {
    return prevVal + parseFloat(currVal.settlement_amount, 2);
  }, 0);

  const getTransactionSummary = (values) => {
    setShowModal(!showModal);
    let strClientCode;
    if (values.clientCode === "All") {
      const allClientCode = clientCodeListArr?.map((item) => item.client_code);
      strClientCode = allClientCode.join().toString();
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
    const excelHeaderRow = [
      "SR NO",
      "CLIENT CODE",
      "CLIENT NAME",
      "SETTLEMENT AMOUNT",
      "SETTLEMENT DATE",
      "SETTLEMENT BY",
      "TRANSACTION COUNT",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    settlementSummaryReport.data?.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        client_code: item.client_code === null ? "" : item.client_code,
        client_name: item.client_name === null ? "" : item.client_name,
        settlement_amount:
          item.settlement_amount === null ? "" : item.settlement_amount,
        // 'pg_pay_mode': item.pg_pay_mode === null ? "" : item.pg_pay_mode,
        settlement_date:
          item.settlement_date === null
            ? ""
            : dateFormatBasic(item.settlement_date),
        settlement_by: item.settlement_by === null ? "" : item.settlement_by,
        txn_count: item.txn_count === null ? "" : item.txn_count,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Settlement-Txn-Summary-Report";
    // console.log(fileName);

    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...");
      }
      return state;
    };
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
  };
  const modalBody = () => {
    if (settlementSummaryReport?.loading)
      return <CustomLoader loadingState={settlementSummaryReport?.loading} />;
    else if (settlementSummaryReport?.data?.length === 0)
      return <h6>Data not found</h6>;
    return (
      <>
        <h6>
          <span>
            <strong>Total Record</strong> :&nbsp;
            {settlementSummaryReport.data?.length} |
            <strong> Total Settlement Amount</strong> :&nbsp;
            {settlementSummaryReport.data?.reduce(
              (amt, data) => (amt += data.settlement_amount),
              0
            )}
          </span>
        </h6>
        <table className="table table-bordered">
          <thead>
            <th>S.R. No.</th>
            <th>Client Code</th>
            <th>Client Name</th>
            <th>Settlement Amount</th>
            <th>Settlement Date</th>
            <th>Settlement By</th>
            <th>Transaction Count</th>
          </thead>
          {settlementSummaryReport.data?.map((item) => (
            <tr>
              <td>{item.SrNo}</td>
              <td>{item.client_code}</td>
              <td>{item.client_name}</td>
              <td>{item.settlement_amount}</td>
              <td>{dateFormatBasic(item.settlement_date)}</td>
              <td>{item.settlement_by}</td>
              <td>{item.txn_count}</td>
            </tr>
          ))}
        </table>
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
                {/* Show spinner if disabled */}
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
                  >
                    Export{" "}
                  </button>
                </div>
                <div className="form-group col-md-1 ml-1">
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
      <div className="profileBarStatus">
        <Notification />
      </div>

      <main>
        <div>
          <ReportLayout
            type="settlement"
            title="Settlement Report"
            data={txnList}
            rowData={rowData}
            form={form}
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
};

export default SettlementReportNew;
