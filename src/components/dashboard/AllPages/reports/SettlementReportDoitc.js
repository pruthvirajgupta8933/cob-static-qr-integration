/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  clearSettlementReport,
  fetchSettlementReportSlice,
} from "../../../../slices/dashboardSlice";
import Notification from "../../../../_components/reuseable_components/Notification";
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import NavBar from "../../NavBar/NavBar";
import moment from "moment";
import { settledTransactionHistoryDoitc, clearSettledTransactionHistory } from "../../../../slices/merchant-slice/reportSlice";
import { CSVLink } from "react-csv";

const SettlementReportDoitc = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, dashboard, merchantReportSlice } = useSelector((state) => state);
  const { user } = auth;

  const { isLoadingTxnHistory } = dashboard;
  const [txnList, SetTxnList] = useState([]);
  // const [filterList,SetFilterList] = useState([])
  const [searchText, SetSearchText] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [exportToCsv, setExportToCsv] = useState({});
  const [pageCount, setPageCount] = useState(0);
  const [dataFound, setDataFound] = useState(false);
  const [triggerForReport, setTriggerForReport] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [disable, setIsDisable] = useState(false)

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

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

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    {},
    false,
    true
  );

  const [todayDate, setTodayDate] = useState(splitDate);

  const initialValues = {
    clientCode: "",
    fromDate: todayDate,
    endDate: todayDate,
    noOfClient: "1",
    rpttype: "0",
  };

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

  const onSubmitHandler = (values) => {

    setIsDisable(true)
    dispatch(settledTransactionHistoryDoitc(values)).then((res) => {

      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;
      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
        setIsDisable(false)
      }
      if (ApiStatus === "fulfilled") {
        setIsDisable(false)
      }
      if (ApiPayload?.length < 1 && ApiStatus === "fulfilled") {
        toast.error("No Data Found");
        setIsDisable(false)
      }
    });
  };

  useEffect(() => {
    // Remove initiated from transaction history response
    const TxnListArrUpdated = merchantReportSlice.settledTransactionHistoryDoitc.data;
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(
      _(TxnListArrUpdated)
        .slice(0)
        .take(pageSize)
        .value()
    );
    // exportToExcelFn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantReportSlice]);

  useEffect(() => {

  }, [triggerForReport])
  

  console.log("exprot", exportToCsv)



  useEffect(() => {
    setPaginatedData(
      _(showData)
        .slice(0)
        .take(pageSize)
        .value()
    );
    setPageCount(
      showData.length > 0 ? Math.ceil(showData.length / pageSize) : 0
    );
  }, [pageSize, showData]);

  useEffect(() => {

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(showData)
      .slice(startIndex)
      .take(pageSize)
      .value();
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
      "Trans ID",
      "Client Trans ID",
      "Challan Number / VAN",
      "Amount",
      "Transaction Date",
      "Payment Status",
      "Payer First Name",
      "Client Code",
      "Payment Mode",
      "client name",
      "Current Status",
      "Processing date",
      "Processing amount",
      "Track id",
      "Remarks",
      "Settlement Amount",
      "Current Status",
      "Settlement Date",
      "Chargeback Amount",
      "Chargeback Date",
      "Settlement Status",

    ];
    const excelArr = [excelHeaderRow];
    // console.log("txnList",txnList)
    // eslint-disable-next-line array-callback-return
    merchantReportSlice?.settledTransactionHistoryDoitc?.data?.map((item, index) => {

      const allowDataToShow = {
        'txn_id': item.txn_id === null ? "" : item.txn_id,
        'client_txn_id': item.client_txn_id === null ? "" : item.client_txn_id,
        'challan_no': item.challan_no === null ? "" : item.challan_no,
        'payee_amount': item.payee_amount === null ? "" : Number.parseFloat(item.payee_amount),
        'trans_date': item.trans_date === null ? "" : item.trans_date,
        'status': item.status === null ? "" : item.status,
        'payee_first_name': item.payee_first_name === null ? "" : item.payee_first_name,
        'client_code': item.client_code === null ? "" : item.client_code,
        'payment_mode': item.payment_mode === null ? "" : item.payment_mode,
        'client_name': item.client_name === null ? "" : item.client_name,
        'refund_status': item.settlement_bank_ref === null ? "" : item.refund_status,
        'refund_process_on': item.refund_process_on === null ? "" : item.refund_process_on,
        'refunded_amount': item.refunded_amount === null ? "" : item.refunded_amount,
        'refund_track_id': item.refund_track_id === null ? "" : item.refund_track_id,
        'refund_reason': item.refund_reason === null ? "" : item.refund_reason,
        'settlement_amount': item.settlement_amount === null ? "" : Number.parseFloat(item.settlement_amount),
        'settlement_status': item.settlement_status === null ? "" : item.settlement_status,
        'settlement_date': item.settlement_date === null ? "" : item.settlement_date,
        'charge_back_amount': item.charge_back_amount === null ? "" : Number.parseFloat(item.charge_back_amount),
        'charge_back_date': item.charge_back_date === null ? "" : item.charge_back_date,
        'chargeback_status': item.chargeback_status === null ? "" : item.chargeback_status,
      };

      excelArr.push(Object.values(allowDataToShow));
    });

    // console.log("excelArr", excelArr)
    const fileName = "Settlement-Report";

    // const csvReport = {
    //   data: excelArr,
    //   headers: excelHeaderRow,
    //   filename: fileName
    // };

    // setExportToCsv(csvReport)
    exportToSpreadsheet(excelArr, fileName);


  };



  return (
    <section className="ant-layout NunitoSans-Regular">
      <div>
        <NavBar />
      </div>
      <div className="profileBarStatus">
        <Notification />
      </div>
      <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Settlement Report</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {(formik) => (
                  <Form>
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <FormikController
                          control="select"
                          label="Client Code"
                          name="clientCode"
                          className="form-control rounded-0 mt-0"
                          options={clientCodeOption}
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <FormikController
                          control="input"
                          type="date"
                          label="From Date"
                          name="fromDate"
                          className="form-control rounded-0"
                        />
                      </div>

                      <div className="form-group col-md-4">
                        <FormikController
                          control="input"
                          type="date"
                          label="End Date"
                          name="endDate"
                          className="form-control rounded-0"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-1">
                        <button
                          disabled={disable}
                          className=" btn bttn bttnbackgroundkyc"
                          type="submit"
                        >
                          Search{" "}
                        </button>
                      </div>
                      {txnList?.length > 0 ? (
                        <div className="form-group col-md-1">
                          <button
                            className="btn btn-sm text-white"
                            style={{ backgroundColor: "rgb(1, 86, 179)" }}
                            type="button"
                            onClick={() => exportToExcelFn()}
                          >
                            Export{" "}
                          </button>
                          {/* <CSVLink className="btn btn-sm text-white btn-primary" {...exportToCsv}>Export To CSV</CSVLink> */}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
              <hr className="hr" />
              {txnList?.length > 0 ? (
                <div className="form-row">
                  <div className="form-group col-md-3">
                    <label>Search</label>
                    <input
                      type="text"
                      label="Search"
                      name="search"
                      placeholder="Search Here"
                      className="form-control rounded-0"
                      onChange={(e) => {
                        SetSearchText(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group col-md-3">
                    <label>Count Per Page</label>
                    <select
                      value={pageSize}
                      rel={pageSize}
                      className="form-control rounded-0"
                      onChange={(e) => setPageSize(parseInt(e.target.value))}
                    >
                      <DropDownCountPerPage datalength={txnList.length} />
                    </select>
                  </div>
                </div>
              ) : (
                <> </>
              )}
            </div>
          </section>

          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid  p-3 my-3 ">
              {txnList.length > 0 ? (
                <h4>Total Record : {txnList.length} </h4>
              ) : (
                <></>
              )}

              <div className="overflow-auto">
                <table className="table table-bordered">
                  <thead>
                    {txnList.length > 0 ? (
                      <tr>
                        <th> S.No </th>
                        <th> Trans ID</th>
                        <th> Client Trans ID </th>
                        <th> Challan Number / VAN </th>
                        <th> Amount </th>
                        <th> Transaction Date </th>
                        <th> Payment Status </th>
                        <th> Payer First Name</th>
                        <th> Client Code </th>
                        <th> Payment Mode </th>
                        <th> client name </th>
                        <th> Current Status </th>
                        <th> Processing date </th>
                        <th> Processing amount</th>
                        <th> Track id</th>
                        <th> Remarks</th>
                      </tr>
                    ) : (
                      <></>
                    )}
                  </thead>
                  <tbody>
                    {txnList.length > 0 &&
                      paginatedata.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{item.challan_no}</td>
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{item?.trans_date}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_first_name}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.client_name}</td>
                            <td>{item.refund_status}</td>
                            <td>{item.refund_process_on}</td>
                            <td>{Number.parseFloat(item.refunded_amount).toFixed(2)}</td>
                            <td>{item.refund_track_id}</td>
                            <td>{item.refund_reason}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div>

                {txnList.length > 0 ? (
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      <a
                        className="page-link"
                        onClick={(prev) =>
                          setCurrentPage((prev) =>
                            prev === 1 ? prev : prev - 1
                          )
                        }
                        href={() => false}
                      >
                        Previous
                      </a>
                      {pages
                        .slice(currentPage - 1, currentPage + 6)
                        .map((page, i) => (
                          <li
                            key={i}
                            className={
                              page === currentPage
                                ? " page-item active"
                                : "page-item"
                            }
                          >

                            <a
                              className={`page-link data_${i}`}
                              href={() => false}
                            >
                              <p onClick={() => pagination(page)}>{page}</p>
                            </a>
                          </li>
                        ))}
                      {pages.length !== currentPage ? (
                        <a
                          className="page-link"
                          onClick={(nex) => {
                            setCurrentPage((nex) =>
                              nex === (pages.length > 9) ? nex : nex + 1
                            );
                          }}
                          href={() => false}
                        >
                          Next
                        </a>
                      ) : (
                        <></>
                      )}
                    </ul>
                  </nav>
                ) : (
                  <></>
                )}
              </div>
              <div className="container">
                {merchantReportSlice.settledTransactionHistoryDoitc.loading ? (
                  <div className="col-lg-12 col-md-12">
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : buttonClicked && dataFound ? (
                  <div className="showMsg">Data Not Found</div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default SettlementReportDoitc;
