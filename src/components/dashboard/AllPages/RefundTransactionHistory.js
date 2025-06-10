/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
import Table from "../../../_components/table_components/table/Table";
import FormikController from "../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  clearSettlementReport,
  fetchRefundTransactionHistory,
} from "../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { v4 as uuidv4 } from "uuid";
import Yup from "../../../_components/formik/Yup";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import ReportLayout from "../../../_components/report_component/ReportLayout";

const RefundTransactionHistory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [dataFound, setDataFound] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const roles = roleBasedAccess();
  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { user } = auth;
  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];
  const { isLoadingTxnHistory } = dashboard;
  var clientMerchantDetailsList = [];
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

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const [todayDate, setTodayDate] = useState(splitDate);

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
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
      width: "110px",
    },
    {
      id: "7",
      name: "Amount Adjusted On",
      selector: (row) => dateFormatBasic(row.amount_adjust_on),
      sortable: true,
      width: "150px",
    },
    {
      id: "8",
      name: "Amount Available To Adjust",
      selector: (row) => row.amount_available_to_adjust,
      width: "120px",
    },
    {
      id: "9",
      name: "Bank Name",
      selector: (row) => row.bank_name,
      cell: (row) => <div>{row.bank_name}</div>,
      sortable: true,
      width: "120px",
    },
    {
      id: "10",
      name: "Money Asked From Merchant",
      selector: (row) => row.money_asked_from_merchant,
      cell: (row) => <div>{row.money_asked_from_merchant}</div>,
      width: "120px",
    },
    {
      id: "11",
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      width: "120px",
    },
    {
      id: "12",
      name: "Refund Initiated On",
      selector: (row) => dateFormatBasic(row.refund_initiated_on),
      sortable: true,
      width: "150px",
    },
    {
      id: "13",
      name: "Refund Reason",
      selector: (row) => row.refund_reason,
      cell: (row) => <div>{row.refund_reason}</div>,
      width: "130px",
    },
    {
      id: "14",
      name: "Refund Process On",
      selector: (row) => dateFormatBasic(row.refund_process_on),
      width: "150px",
    },
    {
      id: "15",
      name: "Refund Track Id",
      selector: (row) => row.refund_track_id,
      cell: (row) => <div>{row.refund_track_id}</div>,
      width: "120px",
    },
    {
      id: "16",
      name: "Refunded Amount",
      selector: (row) => row.refunded_amount,
      width: "110px",
    },
    {
      id: "17",
      name: "Transaction Date",
      selector: (row) => dateFormatBasic(row.trans_date),
      width: "150px",
    },
  ];
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
      noOfClient: values.noOfClient,
      rpttype: clientCodeArrLength,
    };

    setLoading(true);
    isButtonClicked(true);
    setIsDisable(true);

    try {
      const res = await dispatch(fetchRefundTransactionHistory(paramData));
      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;

      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
      }

      if (ApiStatus === "fulfilled" && ApiPayload?.length < 1) {
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
      setIsDisable(false);
    }
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
      "S. No.",
      "txn_id",
      "client_txn_id",
      "trans_date",
      "payee_amount",
      "client_code",
      "client_name",
      "payment_mode",
      "bank_name",
      "amount_available_to_adjust",
      "amount_adjust_on",
      "money_asked_from_merchant",
      "refund_initiated_on",
      "refund_process_on",
      "refund_reason",
      "refunded_amount",
      "refund_track_id",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        txn_id: item.txn_id === null ? "" : item.txn_id,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        trans_date:
          item.trans_date === null ? "" : dateFormatBasic(item.trans_date),
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        client_code: item.client_code === null ? "" : item.client_code,
        client_name: item.client_name === null ? "" : item.client_name,
        payment_mode: item.payment_mode === null ? "" : item.payment_mode,
        bank_name: item.bank_name === null ? "" : item.bank_name,
        amount_available_to_adjust:
          item.amount_available_to_adjust === null
            ? ""
            : item.amount_available_to_adjust,
        amount_adjust_on:
          item.amount_adjust_on === null
            ? ""
            : dateFormatBasic(item.amount_adjust_on),
        money_asked_from_merchant:
          item.money_asked_from_merchant === null
            ? ""
            : item.money_asked_from_merchant,
        refund_initiated_on:
          item.refund_initiated_on === null
            ? ""
            : dateFormatBasic(item.refund_initiated_on),
        refund_process_on:
          item.refund_process_on === null
            ? ""
            : dateFormatBasic(item.refund_process_on),
        refund_reason: item.refund_reason === null ? "" : item.refund_reason,
        refunded_amount:
          item.refunded_amount === null
            ? ""
            : Number.parseFloat(item.refunded_amount),
        refund_track_id:
          item.refund_track_id === null ? "" : item.refund_track_id,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Refund-Txn-Report";
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >
      {(formik) => (
        <Form>
          <div className="form-row mt-4">
            <div className="form-group col-md-3">
              <FormikController
                control="select"
                label="Client Code"
                name="clientCode"
                className="form-select rounded-0 mt-0"
                options={clientCodeOption}
              />
            </div>

            <div className="form-group col-md-3">
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

            <div className="form-group col-md-3">
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
            <div className="form-group col-lg-1">
              <button
                disabled={disable}
                className="btn cob-btn-primary text-white btn-sm"
                type="submit"
              >
                {" "}
                {loading ? "Loading..." : "Search"}{" "}
              </button>
            </div>

            {txnList?.length > 0 && (
              <div className="form-group col-lg-1">
                <button
                  className="btn btn-sm text-white cob-btn-primary"
                  type=""
                  onClick={() => {
                    exportToExcelFn();
                  }}
                >
                  <i className="fa fa-download"></i> Export
                </button>
              </div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
  return (
    <section className="ant-layout">
      <main>
        <ReportLayout
          type="refundHistory"
          title="Refund Transaction History"
          form={form}
          rowData={rowData}
          data={txnList}
          showSearch
          showCountPerPage
          loadingState={loading}
        />
      </main>
    </section>
  );
};

export default RefundTransactionHistory;
