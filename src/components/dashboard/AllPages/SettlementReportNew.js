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
  fetchSettlementReportSlice,
} from "../../../slices/dashboardSlice";
import { exportToSpreadsheet } from "../../../utilities/exportToSpreadsheet";
import DropDownCountPerPage from "../../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../../_components/reuseable_components/convertToFormikSelectJson";
import NavBar from "../NavBar/NavBar";
import moment from "moment";

const SettlementReportNew= () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, dashboard } = useSelector((state) => state);
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
  const [pageCount, setPageCount] = useState(0);
  const [dataFound, setDataFound] = useState(false);
  const [buttonClicked, isButtonClicked] = useState(false);

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

  const tempClientList = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList
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
    dispatch(fetchSettlementReportSlice(values)).then((res) => {
     
      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;
      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
      }
      if (ApiPayload?.length < 1 && ApiStatus === "fulfilled") {
        toast.error("No Data Found");
      }
    });
  };

  useEffect(() => {
    // Remove initiated from transaction history response
    const TxnListArrUpdated = dashboard.settlementReport;
   

    setUpdateTxnList(TxnListArrUpdated);
    setShowData(TxnListArrUpdated);
    SetTxnList(TxnListArrUpdated);
    setPaginatedData(
      _(TxnListArrUpdated)
        .slice(0)
        .take(pageSize)
        .value()
    );
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
      'SRNO',
      'TXN ID',
      'CLIENT TXN ID',
      'CHALLAN NO',
      // 'PG PAY MODE',
      'PAYEE AMOUNT',
      'TRANS DATE',
      'TRANS COMPLETE DATE',
      'STATUS',
      'PAYEE FIRST NAME',
      'PAYEE LST NAME',
      'PAYEE MOB',
      'PAYEE EMAIL',
      'CLIENT CODE',
      'PAYMENT MODE',
      'PAYEE ADDRESS',
     
      'CLIENT NAME',
      'GR NUMBER',
      // 'PAID AMOUNT',
      // 'ACT AMOUNT',
      // 'PAG RESPONSE CODE',
      // 'RESP MSG',
      'BANK MESSAGE',
      'FEE FORWARD',
      'IFSC CODE',
      'PAYER ACOUNT NUMBER',
      'BANK TXN ID',
      // 'PG RETURN AMOUNT',
      // 'P CONVCHARGES',
      // 'P EP CHARGES',
      // 'P GST',
      'SETTLEMENT DATE',
      'SETTLEMENT AMOUNT',
      'SETTLEMENT STATUS',
      // 'SETTLEMENT BY',
      'SETTLEMENT BANK REF',
      'SETTLEMENT REMARKS',
      'SETTLEMENT UTR',
    
      'UDF1',
      'UDF2',
      'UDF3',
      'UDF4',
      'UDF5',
      'UDF6',
      'UDF7',
      'UDF8',
      'UDF9',
      'UDF10',
      'UDF11',
      'UDF12',
      'UDF13',
      'UDF14',
      'UDF15',
      'UDF16',
      'UDF17',
      'UDF18',
      'UDF19',
      'UDF20'
       ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
     
      const allowDataToShow = {
        'srNo': item.srNo === null ? "" : index + 1,
        'txn_id' : item.txn_id === null ? "" : item.txn_id,
        'client_txn_id' : item.client_txn_id === null ? "" : item.client_txn_id,
        'challan_no': item.challan_no === null ? "" : item.challan_no,
        // 'pg_pay_mode': item.pg_pay_mode === null ? "" : item.pg_pay_mode,
        'payee_amount': item.payee_amount === null ? "" : Number.parseFloat(item.payee_amount),
        'trans_date': item.trans_date === null ? "" : item.trans_date,
        'trans_complete_date': item.trans_complete_date === null ? "" : item.trans_complete_date,
        'status': item.status === null ? "" : item.status,
        'payee_first_name': item.payee_first_name === null ? "" : item.payee_first_name,
        'payee_lst_name': item.payee_lst_name === null ? "" : item.payee_lst_name,
        'payee_mob': item.payee_mob === null ? "" : item.payee_mob,
        'payee_email': item.payee_email === null ? "" : item.payee_email,
        'client_code': item.client_code === null ? "" : item.client_code,
        'payment_mode': item.payment_mode === null ? "" : item.payment_mode,
        'payee_address': item.payee_address === null ? "" : item.payee_address,
        
        'client_name': item.client_name === null ? "" : item.client_name,
        'gr_number': item.gr_number === null ? "" : item.gr_number,
        // 'paid_amount': item.paid_amount === null ? "" : Number.parseFloat(item.paid_amount),
        // 'act_amount': item.act_amount === null ? "" : Number.parseFloat(item.act_amount),
        // 'pag_response_code': item.pag_response_code === null ? "" : item.pag_response_code,
        // 'resp_msg': item.resp_msg === null ? "" : item.resp_msg,
        'bank_message': item.bank_message === null ? "" : item.bank_message,
        'fee_forward': item.fee_forward === null ? "" : item.fee_forward,
        'ifsc_code': item.ifsc_code === null ? "" : item.ifsc_code,
        'payer_acount_number': item.payer_acount_number === null ? "" : item.payer_acount_number,
        'bank_txn_id': item.bank_txn_id === null ? "" : item.bank_txn_id,
        // 'pg_return_amount': item.pg_return_amount === null ? "" : Number.parseFloat(item.pg_return_amount),
        // 'p_convcharges': item.p_convcharges === null ? "" : item.p_convcharges,
        // 'p_ep_charges': item.p_ep_charges === null ? "" : item.p_ep_charges,
        // 'p_gst': item.p_gst === null ? "" : item.p_gst,
        'settlement_date': item.settlement_date === null ? "" : item.settlement_date,
        'settlement_amount': item.settlement_amount === null ? "" : Number.parseFloat(item.settlement_amount),
        'settlement_status': item.settlement_status === null ? "" : item.settlement_status,
        // 'settlement_by': item.settlement_by === null ? "" : item.settlement_by,
        'settlement_bank_ref': item.settlement_bank_ref === null ? "" : item.settlement_bank_ref,
        'settlement_remarks': item.settlement_remarks === null ? "" : item.settlement_remarks,
        'settlement_utr': item.settlement_utr === null ? "" : item.settlement_utr,
      
        'udf1': item.udf1 === null ? "" : item.udf1,
        'udf2': item.udf2 === null ? "" : item.udf2,
        'udf3': item.udf3 === null ? "" : item.udf3,
        'udf4': item.udf4 === null ? "" : item.udf4,
        'udf5': item.udf5 === null ? "" : item.udf5,
        'udf6': item.udf6 === null ? "" : item.udf6,
        'udf7': item.udf7 === null ? "" : item.udf7,
        'udf8': item.udf8 === null ? "" : item.udf8,
        'udf9': item.udf9 === null ? "" : item.udf9,
        'udf10': item.udf10 === null ? "" : item.udf10,
        'udf11': item.udf11 === null ? "" : item.udf11,
        'udf12': item.udf12 === null ? "" : item.udf12,
        'udf13': item.udf13 === null ? "" : item.udf13,
        'udf14': item.udf14 === null ? "" : item.udf14,
        'udf15': item.udf15 === null ? "" : item.udf15,
        'udf16': item.udf16 === null ? "" : item.udf16,
        'udf17': item.udf17 === null ? "" : item.udf17,
        'udf18': item.udf18 === null ? "" : item.udf18,
        'udf19': item.udf19 === null ? "" : item.udf19,
        'udf20': item.udf20 === null ? "" : item.udf20
        
       };

      excelArr.push(Object.values(allowDataToShow));
    });
    
    const fileName = "Settlement-Report";
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
                    <div className="form-row">
                      <div className="form-group col-md-1">
                        <button
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
                        <th> Client Code </th>
                        <th> Client Name </th>
                        <th> SP Transaction ID </th>
                        <th> GR Number </th>
                        <th> Client Transaction ID </th>
                        <th> Amount </th>
                        <th> Settlement Amount </th>
                        <th> Settlement Date </th>
                        <th> Settlement Bank Ref </th>
                        <th> Settlement UTR </th>
                        <th> Settlement Remarks </th>
                        {/* <th> Settlement By </th> */}
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
                            <td>{item?.gr_number}</td>
                            <td>{item.client_txn_id}</td>
                            <td>
                              {Number.parseFloat(item.payee_amount).toFixed(2)}
                            </td>
                            <td>
                              {Number.parseFloat(
                                item.settlement_amount
                              ).toFixed(2)}
                            </td>
                            <td>{item.settlement_date}</td>
                            <td>{item.settlement_bank_ref}</td>
                            <td>{item.settlement_utr}</td>
                            <td>{item.settlement_remarks}</td>
                            {/* <td>{item.settlement_by}</td> */}
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
    </section>
  );
}

export default SettlementReportNew;
