/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../../../_components/formik/FormikController";
import _ from "lodash";
import {
  clearTransactionHistory
} from "../../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import API_URL from "../../../../config";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import NavBar from "../../../dashboard/NavBar/NavBar";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import Notification from "../../../../_components/reuseable_components/Notification";
import moment from "moment";
import { clearTransactionHistoryDoitc, transactionHistoryDoitc } from "../../../../slices/merchant-slice/reportSlice";
import { CSVLink } from "react-csv";


const TransactionHistoryDoitc = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();

  const { auth, dashboard, merchantReportSlice } = useSelector((state) => state);
  const { user } = auth;


  const { isLoadingTxnHistory } = dashboard;
  // const { transactionHistoryDoitc } = merchantReportSlice;
  

  const [paymentStatusList, SetPaymentStatusList] = useState([]);
  const [paymentModeList, SetPaymentModeList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [show, setShow] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [dataFound, setDataFound] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);
  const [exportToCsv, setExportToCsv] = useState({});

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

  const clientcode_rolebased = roles.bank
    ? "All"
    : roles.merchant
      ? clientMerchantDetailsList[0]?.clientCode
      : "";

  const [clientCode, SetClientCode] = useState(clientcode_rolebased);
  const [todayDate, setTodayDate] = useState(splitDate);


  const initialValues = {
    clientCode:clientCode,
    fromDate: todayDate,
    endDate: todayDate,
    transaction_status: "All",
    payment_mode: "All",
  };

  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required"),
    clientCode: Yup.string().required("Client code not found").nullable(),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
    transaction_status: Yup.string().required("Required"),
    payment_mode: Yup.string().required("Required"),
  });

  const getPaymentStatusList = async () => {
    await axiosInstance
      .get(API_URL.GET_PAYMENT_STATUS_LIST)
      .then((res) => {

        SetPaymentStatusList(res.data);
      })
      .catch((err) => {

      });
  };

  const paymodeList = async () => {
    await axiosInstance
      .get(API_URL.PAY_MODE_LIST)
      .then((res) => {

        SetPaymentModeList(res.data);
      })
      .catch((err) => {

      });
  };

  let isExtraDataRequired = false;
  let extraDataObj = {};
  if (user.roleId === 3 || user.roleId === 13) {
    isExtraDataRequired = true;
    extraDataObj = { key: "All", value: "All" };
  }

  const forClientCode=true;
  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    extraDataObj,
    isExtraDataRequired,
    forClientCode
  );


  const tempPayStatus = [{ key: "All", value: "All" }];

  paymentStatusList.map((item) => {
    if (item !== "CHALLAN_ENQUIRED" && item !== "INITIATED") {
      tempPayStatus.push({ key: item, value: item });
    }
  });

  const tempPaymode = [{ key: "All", value: "All" }];
  paymentModeList.map((item) => {
    tempPaymode.push({ key: item.paymodeId, value: item.paymodeName });
  });

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const submitHandler = (values) => {
    // console.log("values",values)


    isButtonClicked(true);

    const { fromDate, endDate, transaction_status, payment_mode } = values;
    const dateRangeValid = checkValidation(fromDate, endDate);

    if (dateRangeValid) {

      let strClientCode,
        clientCodeArrLength = "";
// console.log("clientCode",clientCode);
      if (values.clientCode === "All") {

        const allClientCode = [];
        clientMerchantDetailsList?.map((item) => {
          allClientCode.push(item.clientCode);
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
        fromDate: fromDate,
        endDate: endDate,
    
      };
      console.log("ddfdf")
      dispatch(transactionHistoryDoitc(paramData));
    }
  };
  const checkValidation = (fromDate = "", toDate = "") => {
    let flag = true;
    if (fromDate === 0 || toDate === "") {
      alert("Please select the date.");
      flag = false;
    } else if (fromDate !== "" || toDate !== "") {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0 || diffDays > 90) {
        flag = false;
        alert("The date range should be under 3 months");
      }
    } else {
      flag = true;
    }

    return flag;
  };

  useEffect(() => {
    // Remove initiated from transaction history response
    let TxnListArrUpdated = merchantReportSlice?.transactionHistoryDoitc?.data;
    console.log("TxnListArrUpdated",TxnListArrUpdated)
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(
      _(TxnListArrUpdated)
        .slice(0)
        .take(pageSize)
        .value()
    );
    exportToExcelFn();
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
    getPaymentStatusList();
    paymodeList();
    SetTxnList([]);
    return () => {
      // dispatch(clearTransactionHistoryDoitc());
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

  const pages = _.range(1, pageCount + 1);

  const getSearchTerm = (e) => {
    SetSearchText(e.target.value);
  };

  const exportToExcelFn = () => {
    const excelHeaderRow = [
      "S.No",
      "Trans ID",
      "Client Trans ID",
      "Challan Number / VAN",
      "Amount",
      "Transaction Date",
      "Payment Status	",
      "Payee First Name",
      "Payee Last Name",
      "Payee Mob number",
      "Payee Email",
      "Client Code",
      "Payment Mode",
      "Payee Address",
      "Encrypted PAN",
      "Udf1",
      "Udf2",
      "Udf3",
      "Udf4",
      "Udf5",
      "Udf6",
      "Udf7",
      "Udf8",
      "Udf9",
      "Udf10",
      "Udf11",
      "Udf20",
      "Gr.No",
      "Bank Response",
      "IFSC Code",
      "Payer Account No",
      "Bank Txn Id",
    ];
    let excelArr = [];
    // eslint-disable-next-line array-callback-return
    merchantReportSlice?.transactionHistoryDoitc?.data?.map((item, index) => {

      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        txn_id: item.txn_id === null ? "" : item.txn_id,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        challan_no: item.challan_no === null ? "" : item.challan_no,
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        trans_date: item.trans_date === null ? "" : item.trans_date,
        status: item.status === null ? "" : item.status,
        payee_first_name:
          item.payee_first_name === null ? "" : item.payee_first_name,
        payee_lst_name: item.payee_lst_name === null ? "" : item.payee_lst_name,
        payee_mob: item.payee_mob === null ? "" : item.payee_mob,
        payee_email: item.payee_email === null ? "" : item.payee_email,
        client_code: item.client_code === null ? "" : item.client_code,
        payment_mode: item.payment_mode === null ? "" : item.payment_mode,
        payee_address: item.payee_address === null ? "" : item.payee_address,
        encrypted_pan: item.encrypted_pan === null ? "" : item.encrypted_pan,
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
        udf20: item.udf20 === null ? "" : item.udf20,
        gr_number: item.gr_number === null ? "" : item.gr_number,
        bank_message: item.bank_message === null ? "" : item.bank_message,
        ifsc_code: item.ifsc_code === null ? "" : item.ifsc_code,
        payer_acount_number:
          item.payer_acount_number === null ? "" : item.payer_acount_number,
        bank_txn_id: item.bank_txn_id === null ? "" : item.bank_txn_id,
      };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Transactions-Report";
    const csvReport = {
      data: excelArr,
      headers: excelHeaderRow,
      filename: 'Transactions-Report'
    };

    setExportToCsv(csvReport)
    // exportToSpreadsheet(excelArr, fileName);
  };

  const today = new Date();
  const lastThreeMonth = new Date(today);
  lastThreeMonth.setDate(lastThreeMonth.getDate() - 90);
  lastThreeMonth.toLocaleDateString("en-ca");
  let month = lastThreeMonth.getUTCMonth() + 1; //months from 1-12
  let day = lastThreeMonth.getUTCDate();
  let year = lastThreeMonth.getUTCFullYear();
  const finalDate = year + "-" + month + "-" + day;

  // console.log("clientCodeOption",clientCodeOption)


  return (
    <section className="ant-layout NunitoSans-Regular">

      <div>
        <NavBar />
      </div>
      {/* <div className="profileBarStatus">
      <Notification/>
      </div> */}
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Transactions History</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={submitHandler}
              >
                {(formik) => (
                  <Form>
                    <div className="form-row">
                      {roles?.merchant === true ? (
                        <></>
                      ) : (
                        <div className="form-group col-md-2 mx-4">
                          <FormikController
                            control="select"
                            label="Client Code"
                            name="clientCode"
                            className="form-control rounded-0"
                            options={clientCodeOption}
                          />
                          
                        </div>
                      )}

                      <div className="form-group col-md-2 mx-4">
                        <FormikController
                          control="input"
                          type="date"
                          label="From Date"
                          name="fromDate"
                          className="form-control rounded-0"
                        // value={startDate}
                        // onChange={(e)=>setStartDate(e.target.value)}
                        />
                      </div>

                      <div className="form-group col-md-2 mx-4">
                        <FormikController
                          control="input"
                          type="date"
                          label="End Date"
                          name="endDate"
                          className="form-control rounded-0"
                        />
                      </div>

                      <div className="form-group col-md-2 mx-4">
                        <FormikController
                          control="select"
                          label="Transactions Status"
                          name="transaction_status"
                          className="form-control rounded-0 mt-0"
                          options={tempPayStatus}
                        />
                      </div>

                      <div className="form-group col-md-2 mx-4">
                        <FormikController
                          control="select"
                          label="Payment Mode"
                          name="payment_mode"
                          className="form-control rounded-0 mt-0"
                          options={tempPaymode}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-1 ml-3">
                        <button
                          className="btn btn-sm text-white"
                          type="submit"
                          style={{ backgroundColor: "rgb(1, 86, 179)" }}
                        >
                          Search
                        </button>
                        <p className="text-danger">{formik?.errors?.clientCode}</p>
                      </div>
                      {txnList?.length > 0 ? (
                        <>
                          <div className="form-row">
                            <div className="form-group col-md-1 ml-4">
                              {/* <button
                                className="btn btn-sm text-white"
                                type="button"
                                onClick={() => exportToExcelFn()}
                                style={{ backgroundColor: "rgb(1, 86, 179)" }}
                              >
                                Export
                              </button> */}
                          <CSVLink {...exportToCsv}>Export To CSV</CSVLink>

                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Form>
                )}
              </Formik>
             
            </div>
          </section>

          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid  p-3 my-3 ">
              {txnList.length > 0 ? (
                <>
                  <div className="row">
                    <div className="form-group col-md-3 mt-2">
                      <label>Search Transaction ID</label>
                      <input
                        className="form-control mt-0"
                        onChange={getSearchTerm}
                        type="text"
                        placeholder="Search Here"
                      />
                    </div>

                    <div className="form-group col-md-3  mt-2">
                      <label>Count Per Page</label>
                      <select
                        value={pageSize}
                        rel={pageSize}
                        className="ant-input"
                        onChange={(e) => setPageSize(parseInt(e.target.value))}
                      >
                        <DropDownCountPerPage datalength={txnList.length} />
                      </select>
                    </div>
                  </div>
                  <h4>Total Record : {txnList.length} </h4>
                </>
              ) : (
                <></>
              )}

              <div className="overflow-auto">
                <table className="table table-bordered">
                  <thead>
                    {txnList.length > 0 ? (
                      <tr>
                        <th> S.No </th>
                        <th> Trans ID </th>
                        <th> Client Trans ID </th>
                        <th> Challan Number / VAN </th>
                        <th> Amount </th>
                        <th> Transaction Date </th>
                        <th> Payment Status </th>
                        <th> Payer First Name </th>
                        <th> Payer Last Name </th>
                        <th> Payer Mob number </th>
                        <th> Payer Email </th>
                        <th> Client Code </th>
                        <th> Payment Mode </th>
                        <th> Payer Address </th>
                        <th> Encrypted PAN </th>
                        <th> Udf1 </th>
                        <th> Udf2 </th>
                        <th> Udf3 </th>
                        <th> Udf4 </th>
                        <th> Udf5 </th>
                        <th> Udf6 </th>
                        <th> Udf7 </th>
                        <th> Udf8 </th>
                        <th> Udf9 </th>
                        <th> Udf10 </th>
                        <th> Udf11 </th>
                        <th> Udf20 </th>
                        <th> Gr.No </th>
                        <th> Bank Response </th>
                        <th> IFSC Code </th>
                        <th> Payer Account No </th>
                        <th> Bank Txn Id </th>
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
                            <td>
                              {Number.parseFloat(item.payee_amount).toFixed(2)}
                            </td>
                            <td>{item.trans_date}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_first_name}</td>
                            <td>{item.payee_lst_name}</td>
                            <td>{item.payee_mob}</td>
                            <td>{item.payee_email}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.payee_address}</td>
                            <td>{item.encrypted_pan}</td>
                            <td>{item.udf1}</td>
                            <td>{item.udf2}</td>
                            <td>{item.udf3}</td>
                            <td>{item.udf4}</td>
                            <td>{item.udf5}</td>
                            <td>{item.udf6}</td>
                            <td>{item.udf7}</td>
                            <td>{item.udf8}</td>
                            <td>{item.udf9}</td>
                            <td>{item.udf10}</td>
                            <td>{item.udf11}</td>
                            <td>{item.udf20}</td>
                            <td>{item.gr_number}</td>
                            <td>{item.bank_message}</td>
                            <td>{item.ifsc_code}</td>
                            <td>{item.payer_acount_number}</td>
                            <td>{item.bank_txn_id}</td>
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
                              nex === pages.length > 9 ? nex : nex + 1
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
                {merchantReportSlice?.transactionHistoryDoitc?.loading ? (
                  <div className="col-lg-12 col-md-12">
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : buttonClicked === true && txnList.length === 0 ? (
                  <div className="showMsg">
                    <h1 className="float-centre mr-5">Data Not Found</h1>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default TransactionHistoryDoitc;
