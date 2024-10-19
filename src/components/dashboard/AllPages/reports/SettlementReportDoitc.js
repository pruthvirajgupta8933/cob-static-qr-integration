/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
import { saveAs } from 'file-saver';
import FormikController from "../../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
// import NavBar from "../../NavBar/NavBar";
import moment from "moment";
import { clearSettledTransactionHistory, settledTransactionHistoryDoitc } from "../../../../slices/merchant-slice/reportSlice";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../../../_components/formik/Yup";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { fetchChildDataList } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import ReactPaginate from "react-paginate";


const SettlementReportDoitc = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();
  const { auth, merchantReportSlice, merchantReferralOnboardReducer } = useSelector((state) => state);
  const { refrerChiledList } = merchantReferralOnboardReducer
  const clientCodeData = refrerChiledList?.resp?.results ?? []
  console.log("clientCodeData", clientCodeData)
  const { user } = auth;

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


  let isExtraDataRequired = false;
  let extraDataObj = {};
  if (user.roleId === 3 || user.roleId === 13) {
    isExtraDataRequired = true;
    extraDataObj = { key: "All", value: "All" };
  }

  const forClientCode = true;
  let fnKey, fnVal = ""
  let clientCodeListArr = []
  if (roles?.merchant === true) {
    fnKey = "clientCode"
    fnVal = "clientName"
    clientCodeListArr = clientMerchantDetailsList
  } else {
    fnKey = "client_code"
    fnVal = "name"
    clientCodeListArr = clientCodeData
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

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });


  const fetchData = () => {
    const roleType = roles
    const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
    if (type !== "default") {
      let postObj = {
        type: type,  // Set the type based on roleType
        login_id: auth?.user?.loginId
      }
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

  const onSubmitHandler = (values) => {
    let strClientCode, clientCodeArrLength = "";
    if (values.clientCode === "All") {
      const allClientCode = [];
      clientCodeListArr?.map((item) => {
        allClientCode.push(item.client_code);
      });
      clientCodeArrLength = allClientCode.length.toString();
      strClientCode = allClientCode.join()?.toString();
    } else {
      strClientCode = values.clientCode;
      clientCodeArrLength = "1";
    }

    const paramData = {
      clientCode: strClientCode,
      fromDate: moment(values.fromDate).startOf('day').format('YYYY-MM-DD'),
      endDate: moment(values.endDate).startOf('day').format('YYYY-MM-DD'),
      clientCount: clientCodeArrLength,
      rpttype: values.rpttype,
    };


    setIsDisable(true)
    dispatch(settledTransactionHistoryDoitc(paramData)).then((res) => {

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
      dispatch(clearSettledTransactionHistory());
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

  const convertDate = (yourDate) => {
    return yourDate ? moment(yourDate).format("YYYY-MM-DD HH:mm:ss") : "N/A";
  };

  const exportToExcelFn = (exportType) => {
    const excelHeaderRow = [
      "Sr. No.",
      "Trans ID",
      "Client Trans ID",
      "Challan Number / VAN",
      "Amount",
      "Transaction Date",
      "Payment Status",
      "Payer First Name",
      "Client Code",
      "Payment Mode",
      "Client Name",

      "Settlement Status",
      "Settlement Date",
      "Settlement Amount",
      "Refund Status",
      "Refunded Date",

      "Refunded Amount",
      "Track Id",
      "Chargeback Status",
      "Charged Date",
      "Charged Amount",
      "Remarks",

    ];
    const excelArr = [excelHeaderRow];
    // console.log("txnList",txnList)
    // eslint-disable-next-line array-callback-return
    merchantReportSlice?.settledTransactionHistoryDoitc?.data?.map((item, index) => {

      const allowDataToShow = {
        'srNo': item.srNo === null ? "null" : item.srNo,
        'txn_id': item.txn_id === null ? "null" : item.txn_id,
        'client_txn_id': item.client_txn_id === null ? "null" : item.client_txn_id,
        'challan_no': item.challan_no === null ? "null" : item.challan_no,
        'payee_amount': item.payee_amount === null ? "null" : Number.parseFloat(item.payee_amount),
        'trans_date': item.trans_date === null ? "null" : convertDate(item.trans_date),
        'status': item.status === null ? "null" : item.status,
        'payee_first_name': item.payee_first_name === null ? "null" : item.payee_first_name,
        'client_code': item.client_code === null ? "null" : item.client_code,
        'payment_mode': item.payment_mode === null ? "null" : item.payment_mode,
        'client_name': item.client_name === null ? "null" : item.client_name,
        'settlement_status': item.settlement_status === null ? "null" : item.settlement_status,
        'settlement_date': item.settlement_date === null ? "null" : item.settlement_date,
        'settlement_amount': item.settlement_amount === null ? "null" : Number.parseFloat(item.settlement_amount),
        'refund_status': item.settlement_bank_ref === null ? "null" : item.refund_status,
        'refund_process_on': item.refund_process_on === null ? "null" : item.refund_process_on,
        'refunded_amount': item.refunded_amount === null ? "null" : item.refunded_amount,
        'refund_track_id': item.refund_track_id === null ? "null" : item.refund_track_id,
        'chargeback_status': item.chargeback_status === null ? "null" : item.chargeback_status,
        'charge_back_date': item.charge_back_date === null ? "null" : item.charge_back_date,
        'charge_back_amount': item.charge_back_amount === null ? "null" : Number.parseFloat(item.charge_back_amount),

        'refund_reason': item.refund_reason === null ? "null" : item.refund_reason,
      };

      excelArr.push(Object.values(allowDataToShow));
    });

    // Function to convert data to CSV format
    //exportType = csv/ csv-ms-excel
    function arrayToCSV(data, exportType) {
      const csv = data.map(row => row.map(val => {
        if (typeof val === 'number') {
          if (val?.toString().length >= 14) {
            return `${val?.toString()};`
          }
          return val?.toString()
        } else {
          return `"${val?.toString()}"`;
        }

      })
        .join(exportType === 'csv' ? ',' : ';')).join('\n');
      return csv;
    }

    // Function to download CSV file
    function downloadCSV(data, filename, exportType) {
      const csv = arrayToCSV(data, exportType);
      const blob = new Blob([csv], {
        type: "text/plain;charset=utf-8;"
      });
      saveAs(blob, filename)
    }

    const fileName = "Settlement-Report";
    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...")
      }
      // dispatch(exportTxnLoadingState(state))
      return state
    }

    if (exportType === "xlxs") {
      exportToSpreadsheet(excelArr, fileName + "-xlxs", handleExportLoading);
    } else if (exportType === "csv") {
      downloadCSV(excelArr, fileName + "-csv.csv", exportType);
    } else if (exportType === "csv-ms-excel") {
      downloadCSV(excelArr, fileName + "-csv-xlxs.csv", exportType);
    }



  };



  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Settlement Report</h5>
          </div>
          <section className="">
            <div className="container-fluid mt-5 p-0">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {(formik) => (
                  <Form>
                    <div className="form-row">
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
                          control="input"
                          type="date"
                          label="From Date"
                          name="fromDate"
                          className="form-control rounded-0"
                        />
                      </div>

                      <div className="form-group col-md-3">
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
                          className=" btn cob-btn-primary btn-sm"
                          type="submit"
                        >
                          Search{" "}
                        </button>
                      </div>
                      {txnList?.length > 0 ? (
                        <div className="form-group col-md-1">
                          <div className="dropdown form-group">
                            <button className="btn btn-primary btn-sm dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              Export
                            </button>
                            <div className="dropdown-menu bg-light p-2" aria-labelledby="dropdownMenu2">
                              <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("csv")}>CSV</button>
                              <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("csv-ms-excel")}>CSV for MS-Excel</button>
                              <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("xlxs")}>Excel</button>
                            </div>
                          </div>
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
                      className="form-select rounded-0"
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

          <section className="">
            <div className="container-fluid mt-5">
              {txnList.length > 0 ? (
                <h6>Total Record : {txnList.length} </h6>
              ) : (
                <></>
              )}

              <div className="overflow-auto">
                <table className="table table-bordered">
                  <thead>
                    {txnList.length > 0 ? (
                      <tr>
                        <th> Sr. No. </th>
                        <th> Trans ID</th>
                        <th> Client Trans ID </th>
                        <th> Challan Number / VAN </th>
                        <th> Amount </th>
                        <th> Transaction Date </th>
                        <th> Payment Status </th>
                        <th> Payer First Name</th>
                        <th> Client Code </th>
                        <th> Payment Mode </th>
                        <th> Client Name </th>
                        <th> Settlement Status </th>
                        <th> Settlement Date </th>
                        <th> Settlement Amount</th>
                        <th> Refund Status</th>
                        <th> Refunded Date</th>
                        <th> Refunded Amount</th>
                        <th> Track Id</th>
                        <th> Chargeback Status</th>
                        <th> Charged Date</th>
                        <th> Charged Amount</th>
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
                          <tr key={uuidv4()}>
                            <td>{item.srNo}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{item.challan_no}</td>
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{convertDate(item?.trans_date)}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_first_name}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.client_name}</td>
                            <td>{item.settlement_status}</td>
                            <td>{item.settlement_date}</td>
                            <td>{Number.parseFloat(item.settlement_amount).toFixed(2)}</td>
                            <td>{item.refund_status}</td>
                            <td>{item.refund_process_on}</td>
                            <td>{Number.parseFloat(item.refunded_amount).toFixed(2)}</td>
                            <td>{item.refund_track_id}</td>
                            <td>{item.chargeback_status}</td>
                            <td>{item.charge_back_date}</td>
                            <td>{Number.parseFloat(item.charge_back_amount).toFixed(2)}</td>
                            <td>{item.refund_reason}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <div>

                {txnList.length > 0 ? (
                  <div className="d-flex justify-content-center mt-2">
                    <ReactPaginate
                      previousLabel={'Previous'}
                      nextLabel={'Next'}
                      breakLabel={'...'}
                      pageCount={pageCount}
                      marginPagesDisplayed={2} // using this we can set how many number we can show after ...
                      pageRangeDisplayed={5}
                      onPageChange={(selectedItem) => setCurrentPage(selectedItem.selected + 1)}
                      containerClassName={'pagination justify-content-center'}
                      activeClassName={'active'}
                      previousLinkClassName={'page-link'}
                      nextLinkClassName={'page-link'}
                      disabledClassName={'disabled'}
                      breakClassName={'page-item'}
                      breakLinkClassName={'page-link'}
                      pageClassName={'page-item'}
                      pageLinkClassName={'page-link'}
                    />
                  </div>

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
