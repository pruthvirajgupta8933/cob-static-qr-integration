/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Table from "../../../_components/table_components/table/Table";
import FormikController from "../../../_components/formik/FormikController";
// import { toast } from "react-toastify";
import {
  // clearSettlementReport,
  // fetchRefundTransactionHistory,
} from "../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
// import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
// import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
// import { fetchChildDataList } from "../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
// import { v4 as uuidv4 } from "uuid";
import Yup from "../../../_components/formik/Yup";
import { dateFormatBasic } from "../../../utilities/DateConvert";
import ReportLayout from "../../../_components/report_component/ReportLayout";
import { brnachTransactionSlice } from "../../../slices/merchant-slice/reportSlice";

const BranchTransactionHistory = () => {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  // const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  // const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  // const [pageCount, setPageCount] = useState(0);
  // const [dataFound, setDataFound] = useState(false);
  // const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setIsDisable] = useState(false);
  // const roles = roleBasedAccess();
  const { merchantReportSlice } = useSelector(
    (state) => state
  );
  // const { user } = auth;
  // const { refrerChiledList } = merchantReferralOnboardReducer;
  const brnachTransactionData = merchantReportSlice.brnachTransactionSlice;
  const { loading } = brnachTransactionData

  // const clientCodeData = refrerChiledList?.resp?.results ?? [];


  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1]?.length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2]?.length === 1) {
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

  // let isExtraDataRequired = false;
  // let extraDataObj = {};
  // if (user.roleId === 3 || user.roleId === 13) {
  //   isExtraDataRequired = true;
  //   extraDataObj = { key: "All", value: "All" };
  // }

  // const forClientCode = true;




  const clientCodeOption = [
    { key: "", value: "Select" },
    { key: "CENT741", value: "CENT741" },
    { key: "CENT7410", value: "CENT7410" },
    { key: "CENT7411", value: "CENT7411" },
    { key: "CENT742", value: "CENT742" },
    { key: "CENT743", value: "CENT743" },
    { key: "CENT744", value: "CENT744" },
    { key: "CENT745", value: "CENT745" },
    { key: "CENT746", value: "CENT746" },
    { key: "CENT747", value: "CENT747" },
    { key: "CENT748", value: "CENT748" },
    { key: "CENT749", value: "CENT749" },
    { key: "CENT86", value: "CENT86" }
  ];

  const initialValues = {
    clientCode: "",
    fromDate: todayDate,
    endDate: todayDate
  };

  const rowData = [
    {
      id: "1",
      name: "S No",
      selector: (row) => row.srNo,
      width: "50px"
    },
    {
      id: "2",
      name: "Transaction ID",
      selector: (row) => row.txn_id,
      width: "150px",
    },
    {
      id: "3",
      name: "Client Transaction ID",
      selector: (row) => row.client_txn_id,
      width: "150px",
    },
    {
      id: "4",
      name: "Total Amount",
      selector: (row) => Number.parseFloat(row.payee_amount).toFixed(2),
      sortable: true,
      width: "120px",
    },
    {
      id: "139",
      name: "Branch Amount",
      selector: (row) => row.udf11,
      sortable: true,
      width: "140px"
    },
    {
      id: "140",
      name: "Branch Code",
      selector: (row) => row.udf12,
      sortable: true,
      width: "140px"
    },
    {
      id: "1090",
      name: "Currency Type",
      selector: (row) => row.amount_type,
      sortable: true
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
      id: "5",
      name: "Payment Status",
      selector: (row) => row.status,
      sortable: true,
      width: "130px",
    },
    {
      id: "8",
      name: "Payee First Name",
      selector: (row) => row.payee_first_name,
      sortable: true,
      width: "130px",
    },
    {
      id: "81",
      name: "Payee last Name",
      selector: (row) => row.payee_lst_name,
      sortable: true,
      width: "130px",
    },
    {
      id: "9",
      name: "Payee Mob Number",
      selector: (row) => row.payee_mob,
      width: "130px",
    },
    {
      id: "10",
      name: "Payee Email",
      selector: (row) => row.payee_email,
      sortable: true,
      width: "130px",
    },

    {
      id: "201",
      name: "Payment Mode",
      selector: (row) => row.payment_mode,
      width: "130px",
    },

    {
      id: "123",
      name: "Payee Address",
      selector: (row) => row.payee_address,
      sortable: true,
      width: "130px"
    },
    {
      id: "122",
      name: "Bank Response",
      selector: (row) => row.bank_message,
      sortable: true,
      width: "230px",
    },

    {
      id: "120",
      name: "Bank Txn ID",
      selector: (row) => row.bank_txn_id,
      sortable: true,
      width: "130px",
    }

  ];






  // useEffect(() => {
  //   setTimeout(() => {
  //     if (
  //       showData?.length < 1 &&
  //       (updateTxnList?.length > 0 || updateTxnList?.length === 0)
  //     ) {
  //       setDataFound(true);
  //     } else {
  //       setDataFound(false);
  //     }
  //   });
  // }, [showData, updateTxnList]);

  // const pagination = (pageNo) => {
  //   setCurrentPage(pageNo);
  // };

  const onSubmitHandler = async (values) => {

    // const paramData = {
    //   clientCode: strClientCode,
    //   fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
    //   endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
    //   noOfClient: values.noOfClient,
    //   rpttype: clientCodeArrLength,
    // };


    const paramData = {
      fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
      endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
      "udf12": values.clientCode
    }
    // setLoading(true);
    // isButtonClicked(true);
    // setIsDisable(true);


    dispatch(brnachTransactionSlice(paramData));

  };

  useEffect(() => {

    const TxnListArrUpdated = brnachTransactionData?.data;
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    // setPaginatedData(_(TxnListArrUpdated).slice(0).take(pageSize).value());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brnachTransactionData]);

  // useEffect(() => {
  //   setPaginatedData(_(showData).slice(0).take(pageSize).value());
  //   setPageCount(
  //     showData?.length > 0 ? Math.ceil(showData?.length / pageSize) : 0
  //   );
  // }, [pageSize, showData]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(showData).slice(startIndex).take(pageSize).value();
    // setPaginatedData(paginatedPost);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);



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

  // const pages  = _.range(1, pageCount + 1);

  const exportToExcelFn = (e) => {
    e.preventDefault()
    const excelHeaderRow = [
      "S. No.",
      "txn_id",
      "client_txn_id",
      "pg_pay_mode",
      "status",
      "payee_first_name",
      "payee_lst_name",
      "payee_mob",
      "payee_email",
      "client_code",
      "payment_mode",
      "bank_txn_id",
      "payment_mode_id",
      "payee_amount",
      "paid_amount",
      "currency type",
      "resp_msg",
      "bank_message",
      "payee_address",
      "udf1",
      "udf2",
      "udf3",
      "udf4",
      "udf5",
      "udf6",
      "udf7",
      "udf8",
      "udf9",
      "udf10",
      "Branch Amount",
      "Branch Code",
      "udf13",
      "udf14",
      "udf15",
      "udf16",
      "udf17",
      "udf18",
      "udf19",
      "udf20",
      "trans_date",
      "trans_complete_date"
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {

      const allowDataToShow = {

        srNo: item.srNo === null ? "" : index + 1,
        txn_id: item.txn_id === null ? "" : item.txn_id,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        pg_pay_mode: item.pg_pay_mode === null ? "" : item.pg_pay_mode,
        status: item.status === null ? "" : item.status,
        payee_first_name:
          item.payee_first_name === null ? "" : item.payee_first_name,
        payee_lst_name: item.payee_lst_name === null ? "" : item.payee_lst_name,
        payee_mob: item.payee_mob === null ? "" : item.payee_mob,
        payee_email: item.payee_email === null ? "" : item.payee_email,
        client_code: item.client_code === null ? "" : item.client_code,
        payment_mode: item.payment_mode === null ? "" : item.payment_mode,
        bank_txn_id: item.bank_txn_id === null ? "" : item.bank_txn_id,
        payment_mode_id:
          item.payment_mode_id === null ? "" : item.payment_mode_id,
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        paid_amount:
          item.paid_amount === null
            ? ""
            : Number.parseFloat(item.paid_amount),
        amount_type: item.amount_type === null ? "" : item.amount_type,
        resp_msg: item.resp_msg === null ? "" : item.resp_msg,
        bank_message: item.bank_message === null ? "" : item.bank_message,
        payee_address: item.payee_address === null ? "" : item.payee_address,
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
        trans_date:
          item.trans_date === null ? "" : dateFormatBasic(item.trans_date),
        trans_complete_date:
          item.trans_complete_date === null
            ? ""
            : dateFormatBasic(item.trans_complete_date)

      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Branch-Txn-Report";
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
                  onClick={(e) => {
                    exportToExcelFn(e);
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
          type="branchHis"
          title="Branch Transaction"
          form={form}
          rowData={rowData}
          data={txnList}
          showSearch
          showCountPerPage
        />
      </main>
    </section>
  );
};

export default BranchTransactionHistory;
