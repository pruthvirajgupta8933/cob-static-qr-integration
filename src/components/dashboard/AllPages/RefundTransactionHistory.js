/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikController from "../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import {
  clearSettlementReport,
  fetchRefundTransactionHistory,
  
} from "../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import NavBar from "../NavBar/NavBar";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import moment from "moment";

const RefundTransactionHistory = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, dashboard } = useSelector((state) => state);
  const { user } = auth;

  const { isLoadingTxnHistory } = dashboard;
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

  const tempClientList = convertToFormikSelectJson("clientCode", "clientName", clientMerchantDetailsList);


  const initialValues = {
    clientCode: "",
    fromDate: "",
    endDate: "",
    noOfClient: "1",
    rpttype: "0"
  }
  

  
  

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date().min(
      Yup.ref('fromDate'),
      "End date can't be before Start date"
    ).required("Required")
  })

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList
    // extraDataObj,
    // isExtraDataRequired
  );
  

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
    setLoading(true)
    dispatch(fetchRefundTransactionHistory(values))
      .then(res => {
        setLoading(false)
        const ApiStatus = res?.meta?.requestStatus;
        const ApiPayload = res?.payload;
        if (ApiStatus === "rejected") {
          toast.error("Request Rejected");
        }
        if (ApiPayload?.length < 1 && ApiStatus === "fulfilled") {
          toast.error("No Data Found");
        }
      })
  }

  

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
      'S. No.',
      'txn_id',
      'client_txn_id',
      'trans_date',
      'payee_amount',
      'client_code',
      'client_name',
      'payment_mode',
      'bank_name',
      'amount_available_to_adjust',
      'amount_adjust_on',
      'money_asked_from_merchant',
      'refund_initiated_on',
      'refund_process_on',
      'refund_reason',
      'refunded_amount',
      'refund_track_id'
       ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
      const allowDataToShow = {
        'srNo': item.srNo === null ? "" : index + 1,
        'txn_id': item.txn_id === null ? "" : item.txn_id,
        'client_txn_id': item.client_txn_id === null ? "" : item.client_txn_id,
        'trans_date' : item.trans_date === null ? "" : item.trans_date,
        'payee_amount': item.payee_amount === null ? "" : Number.parseFloat(item.payee_amount),
        'client_code': item.client_code === null ? "" : item.client_code,
        'client_name': item.client_name === null ? "" : item.client_name,
        'payment_mode': item.payment_mode === null ? "" : item.payment_mode,
        'bank_name' : item.bank_name === null ? "" : item.bank_name,
        'amount_available_to_adjust' : item.amount_available_to_adjust === null ? "" : item.amount_available_to_adjust,
        'amount_adjust_on': item.amount_adjust_on === null ? "" : item.amount_adjust_on,
        'money_asked_from_merchant': item.money_asked_from_merchant === null ? "" : item.money_asked_from_merchant,
        'refund_initiated_on': item.refund_initiated_on === null ? "" : item.refund_initiated_on,
        'refund_process_on': item.refund_process_on === null ? "" : item.refund_process_on,
        'refund_reason': item.refund_reason === null ? "" : item.refund_reason,
        'refunded_amount': item.refunded_amount === null ? "" : Number.parseFloat(item.refunded_amount),
        'refund_track_id': item.refund_track_id === null ? "" : item.refund_track_id
     };

      excelArr.push(Object.values(allowDataToShow));
    });
    const fileName = "Refund-Txn-Report";
    exportToSpreadsheet(excelArr, fileName);
  };

 

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content Satoshi-Medium">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Refund Transaction History</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a flleft w-100">
            <div className="container-fluid">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
              >
                {formik => (
                  <Form>
                    <div className="form-row">
                      <div className="form-group col-md-4">
                        <FormikController
                          control="select"
                          label="Client Code"
                          name="clientCode"
                          className="form-control rounded-0 mt-0"
                          options={tempClientList}
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
                    <div className="form-row" >
                      <div className="form-group col-md-1">
                        <button className="btn btn-sm btn-primary" type="submit"> {loading ? "Loading..." : "Search"} </button>
                      </div>
                      {txnList?.length > 0 ?
                        <div className="form-group col-md-1">
                          <button className="btn btn-sm  btn-success text-white" type="" onClick={() => { exportToExcelFn() }}>Export </button>
                        </div>
                        : <></>}
                    </div>

                  </Form>
                )}
              </Formik>
              <hr className="hr" />
              {txnList?.length > 0 ? <div className="form-row">
                <div className="form-group col-md-3">
                  <label>Search</label>
                  <input
                    type="text"
                    label="Search"
                    name="search"
                    placeholder="Search Here"
                    className="form-control rounded-0"
                    onChange={(e) => { SetSearchText(e.target.value) }}
                  />
                </div>
                <div className="form-group col-md-3">
                  <label>Count Per Page</label>
                  <select value={pageSize} rel={pageSize} className="form-control rounded-0" onChange={(e) => setPageSize(parseInt(e.target.value))} >
                    <DropDownCountPerPage datalength={txnList.length} />
                  </select>
                </div>
              </div> : <> </>}
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
                        <th> Client Code </th>
                        <th> Client Name </th>
                        <th> SP Transaction ID </th>
                        <th> Client Transaction ID </th>
                        <th> Amount </th>
                        <th> amount_adjust_on </th>
                        <th> amount_available_to_adjust </th>
                        <th> bank_name </th>
                        <th> money_asked_from_merchant </th>
                        <th> Payment Mode </th>
                        <th> refund_initiated_on </th>
                        <th> refund_process_on </th>
                        <th> refund_reason </th>
                        <th> refund_track_id </th>
                        <th> refunded_amount </th>
                        <th> trans_date </th>
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
                            <td>{item.client_code}</td>
                            <td>{item.client_name}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{item.amount_adjust_on}</td>
                            <td>{item.amount_available_to_adjust}</td>
                            <td>{item.bank_name}</td>
                            <td>{item.money_asked_from_merchant}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.refund_initiated_on}</td>
                            <td>{item.refund_process_on}</td>
                            <td>{item.refund_reason}</td>
                            <td>{item.refund_track_id}</td>
                            <td>{Number.parseFloat(item.refunded_amount)}</td>
                            <td>{item.trans_date}</td>
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
                {isLoadingTxnHistory ? (
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
    </section>  );
}

export default RefundTransactionHistory;
