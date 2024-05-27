/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import FormikController from "../../../../_components/formik/FormikController";
import _ from "lodash";
import { exportToSpreadsheet } from "../../../../utilities/exportToSpreadsheet";
import API_URL from "../../../../config";
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import moment from "moment";
import { clearTransactionHistoryDoitc, transactionHistoryDoitc } from "../../../../slices/merchant-slice/reportSlice";
import { v4 as uuidv4 } from 'uuid';
import Yup from "../../../../_components/formik/Yup";
import { fetchChiledDataList } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";


const TransactionHistoryDoitc = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();

  const { auth, merchantReportSlice, merchantReferralOnboardReducer } = useSelector((state) => state);
  const { refrerChiledList } = merchantReferralOnboardReducer
  const clientCodeData = refrerChiledList?.resp?.results ?? []
  // console.log("clientCodeData", clientCodeData)
  const { user } = auth;

  const [paymentStatusList, SetPaymentStatusList] = useState([]);
  const [paymentModeList, SetPaymentModeList] = useState([]);
  const [txnList, SetTxnList] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [show, setShow] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [buttonClicked, isButtonClicked] = useState(false);


  // Date split
  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");



  // client code list
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



  // formik initial values
  const initialValues = {
    clientCode: clientcode_rolebased,
    fromDate: splitDate,
    endDate: splitDate,
    transaction_status: "All",
    payment_mode: "All",
  };


  // formik validation
  const validationSchema = Yup.object({
    fromDate: Yup.date().required("Required"),
    clientCode: Yup.string().required("Select the client code").nullable(),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
    transaction_status: Yup.string().required("Required"),
    payment_mode: Yup.string().required("Required"),
  });


  // get payment status list
  const getPaymentStatusList = async () => {
    await axiosInstance
      .get(API_URL.GET_PAYMENT_STATUS_LIST)
      .then((res) => {
        SetPaymentStatusList(res.data);
      })
      .catch((err) => {

      });
  };

  // get paymode status list
  const paymodeList = async () => {
    await axiosInstance
      .get(API_URL.PAY_MODE_LIST)
      .then((res) => {

        SetPaymentModeList(res.data);
      })
      .catch((err) => {
      });
  };


  // fetch child client data
  const fetchData = () => {
    const roleType = roles
    const type = roleType.bank ? "bank" : roleType.referral ? "referrer" : "default";
    if (type !== "default") {
      let postObj = {
        type: type,  // Set the type based on roleType
        login_id: auth?.user?.loginId
      }
      dispatch(fetchChiledDataList(postObj));
    }

  };

  useEffect(() => {
    fetchData();
  }, []);



  // formik field opitons client code
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
  // console.log(clientCodeOption)


  // formik field opitons payment status
  const tempPayStatus = [{ key: "All", value: "All" }];
  paymentStatusList.map((item) => {
    if (item !== "CHALLAN_ENQUIRED" && item !== "INITIATED") {
      tempPayStatus.push({ key: item, value: item });
    }
  });

  // formik field opitons payment mode
  const tempPaymode = [{ key: "All", value: "All" }];
  paymentModeList.map((item) => {
    tempPaymode.push({ key: item.paymodeId, value: item.paymodeName });
  });


  // table pagination
  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  };


  // submit handler
  const submitHandler = (values) => {
    isButtonClicked(true);

    const { fromDate, endDate, transaction_status, payment_mode } = values;
    const dateRangeValid = checkValidation(fromDate, endDate);

    if (dateRangeValid) {
      let strClientCode,
        clientCodeArrLength = "";
      // console.log("clientCode", clientCode);
      if (values.clientCode === "All") {

        const allClientCode = [];
        clientCodeListArr?.map((item) => {
          allClientCode.push(item.client_code);
        });
        // console.log("allClientCode", allClientCode)
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
        noOfClient: clientCodeArrLength

      };

      dispatch(transactionHistoryDoitc(paramData));
    }
  };


  // data validation
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
      if (diffDays < 0 || diffDays > 31) {
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
    // console.log("TxnListArrUpdated", TxnListArrUpdated)
    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(
      _(TxnListArrUpdated)
        .slice(0)
        .take(pageSize)
        .value()
    );
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
      dispatch(clearTransactionHistoryDoitc());
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


  // export to excel
  const exportToExcelFn = (exportType) => {
    const excelHeaderRow = [
      "S.No",
      "Trans ID",
      "Client Trans ID",
      "Challan Number / VAN",
      "Amount",
      "Conv. Charges",
      "EP Charges",
      "GST",
      "Total Amount",
      "Transaction Date",
      "Payment Status",
      "Payee First Name",
      "Payee Mob. Number",
      "Payee Email",
      "Client Code",
      "Payment Mode",
      "Payee Address",
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
    let excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    merchantReportSlice?.transactionHistoryDoitc?.data?.map((item, index) => {
      const allowDataToShow = {
        srNo: item.srNo === null ? "null" : index + 1,
        txn_id: item.txn_id === null ? "null" : item?.txn_id.toString(),
        client_txn_id: item.client_txn_id === null ? "null" : item.client_txn_id,
        challan_no: item.challan_no === null ? "null" : item.challan_no,
        payee_amount: item.payee_amount === null ? "null" : Number.parseFloat(item.payee_amount),
        p_convcharges: item.p_convcharges === null ? "null" : Number.parseFloat(item.p_convcharges),
        p_ep_charges: item.p_ep_charges === null ? "null" : Number.parseFloat(item.p_ep_charges),
        p_gst: item.p_gst === null ? "null" : item.p_gst,
        total_amount: item.total_amount === null ? "null" : Number.parseFloat(item.total_amount),
        trans_date: item.trans_date === null ? "null" : item.trans_date,
        status: item.status === null ? "null" : item.status,
        payee_first_name: item.payee_first_name === null ? "null" : item.payee_first_name,
        payee_mob: item.payee_mob === null ? "null" : item.payee_mob,
        payee_email: item.payee_email === null ? "null" : item.payee_email,
        client_code: item.client_code === null ? "null" : item.client_code,
        payment_mode: item.payment_mode === null ? "null" : item.payment_mode,
        payee_address: item.payee_address === null ? "null" : item.payee_address,
        udf1: item.udf1 === null ? "null" : item.udf1,
        udf2: item.udf2 === null ? "null" : item.udf2,
        udf3: item.udf3 === null ? "null" : item.udf3,
        udf4: item.udf4 === null ? "null" : item.udf4,
        udf5: item.udf5 === null ? "null" : item.udf5,
        udf6: item.udf6 === null ? "null" : item.udf6,
        udf7: item.udf7 === null ? "null" : item.udf7,
        udf8: item.udf8 === null ? "null" : item.udf8,
        udf9: item.udf9 === null ? "null" : item.udf9,
        udf10: item.udf10 === null ? "null" : item.udf10,
        udf11: item.udf11 === null ? "null" : item.udf11,
        udf20: item.udf20 === null ? "null" : item.udf20,
        gr_number: item.gr_number === null ? "null" : item.gr_number,
        bank_message: item.bank_message === null ? "null" : item.bank_message,
        ifsc_code: item.ifsc_code === null ? "null" : item.ifsc_code,
        payer_acount_number: item.payer_acount_number === null ? "null" : item.payer_acount_number,
        bank_txn_id: item.bank_txn_id === null ? "null" : item.bank_txn_id,
      };
      excelArr.push(Object.values(allowDataToShow));
    });



    // Function to convert data to CSV format
    //exportType = csv/ csv-ms-excel
    function arrayToCSV(data, exportType) {
      const csv = data.map(row => row.map(val => {
        if (typeof val === 'number') {
          if (val.toString().length >= 14) {
            return `${val.toString()};`
          }
          return val.toString()
        } else {
          return `"${val.toString()}"`;
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
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...")
      }
      // dispatch(exportTxnLoadingState(state))
      return state
    }

    const fileName = "Transactions-Report";
    if (exportType === "xlxs") {
      exportToSpreadsheet(excelArr, fileName, handleExportLoading);
    } else if (exportType === "csv") {
      downloadCSV(excelArr, fileName + "-csv.csv", exportType);
    } else if (exportType === "csv-ms-excel") {
      downloadCSV(excelArr, fileName + "-csv-xlxs.csv", exportType);
    }


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
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Transactions History</h5>
          </div>
          <section className="">
            <div className="container-fluid mt-5">
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
                        <div className="form-group col-md-2">
                          <FormikController
                            control="select"
                            label="Client Code"
                            name="clientCode"
                            className="form-select rounded-0"
                            options={clientCodeOption}
                          />

                        </div>
                      )}

                      <div className="form-group col-md-2">
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

                      <div className="form-group col-md-2">
                        <FormikController
                          control="input"
                          type="date"
                          label="End Date"
                          name="endDate"
                          className="form-control rounded-0"
                        />
                      </div>

                      <div className="form-group col-md-2">
                        <FormikController
                          control="select"
                          label="Transactions Status"
                          name="transaction_status"
                          className="form-select rounded-0 mt-0"
                          options={tempPayStatus}
                        />
                      </div>

                      <div className="form-group col-md-2">
                        <FormikController
                          control="select"
                          label="Payment Mode"
                          name="payment_mode"
                          className="form-select rounded-0 mt-0"
                          options={tempPaymode}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-1">
                        <button
                          className="btn btn-sm text-white cob-btn-primary"
                          type="submit"
                        >
                          Search
                        </button>

                      </div>
                      {txnList?.length > 0 ? (
                        <>
                          <div className="form-row">
                            <div className="dropdown form-group col-md-1 ml-1">
                              <button className="btn cob-btn-primary text-white dropdown-toggle btn-sm" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Export
                              </button>
                              <div className="dropdown-menu bg-light p-2" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("csv")}>CSV</button>
                                <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("csv-ms-excel")}>CSV for MS-Excel</button>
                                <button className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left" type="button" onClick={() => exportToExcelFn("xlxs")}>Excel</button>
                              </div>
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
                        className="form-select"
                        onChange={(e) => setPageSize(parseInt(e.target.value))}
                      >
                        <DropDownCountPerPage datalength={txnList.length} />
                      </select>
                    </div>
                  </div>
                  <h6>Total Record : {txnList.length} </h6>
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
                        <th> Conv. Charges</th>
                        <th> EP. Charges </th>
                        <th> GST </th>
                        <th> Total Amount </th>
                        <th> Transaction Date </th>
                        <th> Payment Status </th>
                        <th> Payer First Name </th>
                        <th> Payer Mob. Number </th>
                        <th> Payer Email </th>
                        <th> Client Code </th>
                        <th> Payment Mode </th>
                        <th> Payer Address </th>
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
                          <tr key={uuidv4()}>
                            <td>{i + 1}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{item.challan_no}</td>
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{Number.parseFloat(item.p_convcharges).toFixed(2)}</td>
                            <td>{Number.parseFloat(item.p_ep_charges).toFixed(2)}</td>
                            <td>{item.p_gst}</td>
                            <td>{Number.parseFloat(item.total_amount).toFixed(2)}</td>
                            <td>{item.trans_date}</td>
                            <td>{item.status}</td>
                            <td>{item.payee_first_name}</td>
                            <td>{item.payee_mob}</td>
                            <td>{item.payee_email}</td>
                            <td>{item.client_code}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.payee_address}</td>
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
                            key={uuidv4()}
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
                  <div className="showMsg text-center">
                    <h5>Data Not Found</h5>
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
