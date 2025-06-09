/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
// import * as Yup from "yup";

import FormikController from "../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  clearSettlementReport,
  fetchChargebackTxnHistory,
} from "../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import Yup from "../../../_components/formik/Yup";
import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import ReportLayout from "../../../_components/report_component/ReportLayout";

const ChargeBackTxnHistory = () => {
  const dispatch = useDispatch();
  const roles = roleBasedAccess();
  const history = useHistory();
  const { auth, dashboard, merchantReferralOnboardReducer } = useSelector(
    (state) => state
  );
  const { user } = auth;
  const { isLoadingTxnHistory } = dashboard;

  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];

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

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");



  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });

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
    clientCode: roles.merchant
      ? clientMerchantDetailsList && clientMerchantDetailsList.length > 0
        ? clientMerchantDetailsList[0].clientCode
        : ""
      : "",
    fromDate: splitDate,
    endDate: splitDate,
    noOfClient: "1",
    rpttype: "0",
  };

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

  const onSubmitHandler = (values) => {
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

    setIsDisable(true);
    isButtonClicked(true);
    dispatch(fetchChargebackTxnHistory(paramData)).then((res) => {
      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;
      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
        setIsDisable(false);
      }
      if (ApiStatus === "fulfilled") {
        setIsDisable(false);
      }
      if (ApiPayload?.length < 1 && ApiStatus === "fulfilled") {
        setIsDisable(false);
      }
    });
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
      "ARN",
      "Bank cb fee",
      "cb credit date txn reject",
      "Chargeback amount",
      "Chargeback credit_date_to_merchant",
      "Chargeback date",
      "Chargeback debit_amount",
      "Chargeback remarks",
      "Chargeback status",
      "Clientcode",
      "Client name",
      "Client txn id",
      "Merchant cb status",
      "Payee_amount",
      "Payment mode",
      "prearb date",
      "Status",
      "Txn_id",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        arn: item.arn === null ? "" : item.arn,
        bank_cb_fee: item.bank_cb_fee === null ? "" : item.bank_cb_fee,
        cb_credit_date_txn_reject:
          item.cb_credit_date_txn_reject === null
            ? ""
            : item.cb_credit_date_txn_reject,
        charge_back_amount:
          item.charge_back_amount === null
            ? ""
            : Number.parseFloat(item.charge_back_amount),
        charge_back_credit_date_to_merchant:
          item.charge_back_credit_date_to_merchant === null
            ? ""
            : dateFormatBasic(item.charge_back_credit_date_to_merchant),
        charge_back_date:
          item.charge_back_date === null
            ? ""
            : dateFormatBasic(item.charge_back_date),
        charge_back_debit_amount:
          item.charge_back_debit_amount === null
            ? ""
            : item.charge_back_debit_amount,
        charge_back_remarks:
          item.charge_back_remarks === null ? "" : item.charge_back_remarks,
        charge_back_status:
          item.charge_back_status === null ? "" : item.charge_back_status,
        client_code: item.client_code === null ? "" : item.client_code,
        client_name: item.client_name === null ? "" : item.client_name,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        merchant_cb_status:
          item.merchant_cb_status === null ? "" : item.merchant_cb_status,
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        payment_mode: item.payment_mode === null ? "" : item.payment_mode,
        prearb_date:
          item.prearb_date === null ? "" : dateFormatBasic(item.prearb_date),
        status: item.status === null ? "" : item.status,
        txn_id: item.txn_id === null ? "" : item.txn_id,
      };

      excelArr.push(Object.values(allowDataToShow));
    });

    const fileName = "ChargeBackTxn-Report";
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
            <div className="form-group col-md-1">
              <button
                disabled={disable}
                className="btn btn-sm cob-btn-primary  text-white"
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
                Search
              </button>
            </div>
            {txnList?.length > 0 ? (
              <div className="form-group col-md-1">
                <button
                  className="btn btn-sm text-white  cob-btn-primary "
                  style={{ backgroundColor: "rgb(1, 86, 179)" }}
                  type="button"
                  onClick={() => exportToExcelFn()}
                >
                  Export{" "}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );

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
      name: "ARN",
      selector: (row) => row.arn,
      sortable: true,
      width: "130px",
    },
    {
      id: "8",
      name: "Bank CB Fee",
      selector: (row) => row.bank_cb_fee,
      sortable: true,
      width: "135px",
    },
    {
      id: "9",
      name: "CB Credit Date Txn Reject",
      selector: (row) => row.cb_credit_date_txn_reject,
      sortable: true,
      width: "135px",
    },
    {
      id: "10",
      name: "Charge Back Amount",
      selector: (row) => row.charge_back_amount,
      sortable: true,
      width: "130px",
    },
    {
      id: "11",
      name: "Charge Back Credit Date To Merchant",
      selector: (row) => {
        dateFormatBasic(row.charge_back_credit_date_to_merchant);
      },
      width: "130px",
    },
    {
      id: "12",
      name: "Charge Back Date",
      selector: (row) => {
        dateFormatBasic(row.charge_back_date);
      },
      sortable: true,
      width: "130px",
    },
    {
      id: "13",
      name: "Charge Back Debit Amount",
      selector: (row) => row.charge_back_debit_amount,
      width: "130px",
    },
    {
      id: "14",
      name: "Charge Back Remarks",
      selector: (row) => row.charge_back_remarks,
      width: "130px",
    },
    {
      id: "15",
      name: "Charge Back Status",
      selector: (row) => row.charge_back_status,
      sortable: true,
      width: "130px",
    },
    {
      id: "16",
      name: "Merchant CB Status",
      selector: (row) => row.merchant_cb_status,
      width: "130px",
    },
    {
      id: "17",
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      sortable: true,
      width: "130px",
    },
    {
      id: "18",
      name: "PreARB Date",
      selector: (row) => dateFormatBasic(row.prearb_date),
      width: "130px",
    },
    {
      id: "19",
      name: "Status",
      selector: (row) => row.status,
      width: "130px",
    },
  ];

  return (
    <section className="">
      <main className="">
        <div className="">
          <ReportLayout
            type="cbHistory"
            title="Chargeback Transaction History"
            data={txnList}
            rowData={rowData}
            form={form}
            loadingState={isLoadingTxnHistory}
          />

          <section className="">
            <div className="container-fluid p-3 my-3 ">

            </div>
          </section>
        </div>
      </main>
    </section>
  );
};

export default ChargeBackTxnHistory;
