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
import { v4 as uuidv4 } from 'uuid';
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import Yup from "../../../_components/formik/Yup";

const ChargeBackTxnHistory = () => {
  const dispatch = useDispatch();
  const roles = roleBasedAccess();
  const roleType = roles

  const history = useHistory();
  const { auth, dashboard } = useSelector((state) => state);
  const { user } = auth;
  const { isLoadingTxnHistory } = dashboard;
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



  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Required"),
    fromDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("Required"),
  });

  const initialValues = {
    clientCode: roles.merchant ? (clientMerchantDetailsList && clientMerchantDetailsList.length > 0 ? clientMerchantDetailsList[0].clientCode : "") : "",
    fromDate: splitDate,
    endDate: splitDate,
    noOfClient: "1",
    rpttype: "0",
  };

  const clientCodeOption = convertToFormikSelectJson(
    "clientCode",
    "clientName",
    clientMerchantDetailsList,
    {},
    false,
    true
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
    const paramData = {
      clientCode: values.clientCode,
      fromDate: moment(values.fromDate).startOf('day').format('YYYY-MM-DD'),
      endDate: moment(values.endDate).startOf('day').format('YYYY-MM-DD'),
      noOfClient: values.noOfClient,
      rpttype: values.rpttype,
    }

    setIsDisable(true)
    isButtonClicked(true)
    dispatch(fetchChargebackTxnHistory(paramData)).then((res) => {
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

        setIsDisable(false)
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
      'S. No.',
      'arn',
      'bank_cb_fee',
      'cb_credit_date_txn_reject',
      'charge_back_amount',
      'charge_back_credit_date_to_merchant',
      'charge_back_date',
      'charge_back_debit_amount',
      'charge_back_remarks',
      'charge_back_status',
      'client_code',
      'client_name',
      'client_txn_id',
      'merchant_cb_status',
      'payee_amount',
      'payment_mode',
      'prearb_date',
      'status',
      'txn_id'
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
      const allowDataToShow = {
        'srNo': item.srNo === null ? "" : index + 1,
        'arn': item.arn === null ? "" : item.arn,
        'bank_cb_fee': item.bank_cb_fee === null ? "" : item.bank_cb_fee,
        'cb_credit_date_txn_reject': item.cb_credit_date_txn_reject === null ? "" : item.cb_credit_date_txn_reject,
        'charge_back_amount': item.charge_back_amount === null ? "" : Number.parseFloat(item.charge_back_amount),
        'charge_back_credit_date_to_merchant': item.charge_back_credit_date_to_merchant === null ? "" : item.charge_back_credit_date_to_merchant,
        'charge_back_date': item.charge_back_date === null ? "" : item.charge_back_date,
        'charge_back_debit_amount': item.charge_back_debit_amount === null ? "" : item.charge_back_debit_amount,
        'charge_back_remarks': item.charge_back_remarks === null ? "" : item.charge_back_remarks,
        'charge_back_status': item.charge_back_status === null ? "" : item.charge_back_status,
        'client_code': item.client_code === null ? "" : item.client_code,
        'client_name': item.client_name === null ? "" : item.client_name,
        'client_txn_id': item.client_txn_id === null ? "" : item.client_txn_id,
        'merchant_cb_status': item.merchant_cb_status === null ? "" : item.merchant_cb_status,
        'payee_amount': item.payee_amount === null ? "" : Number.parseFloat(item.payee_amount),
        'payment_mode': item.payment_mode === null ? "" : item.payment_mode,
        'prearb_date': item.prearb_date === null ? "" : item.prearb_date,
        'status': item.status === null ? "" : item.status,
        'txn_id': item.txn_id === null ? "" : item.txn_id

      };

      excelArr.push(Object.values(allowDataToShow));
    });

    const fileName = "ChargeBackTxn-Report";
    let handleExportLoading = (state) => {
      // console.log(state)
      if (state) {
        alert("Exporting Excel File, Please wait...")
      }
      return state
    }
    exportToSpreadsheet(excelArr, fileName, handleExportLoading);
  };



  return (
    <section className="">
      <main className="">
        <div className="">
          {/* <div className="right_layout my_account_wrapper right_side_heading"> */}
          <h5 className="">
            Chargeback Transaction History
          </h5>
          {/* </div> */}
          <section className="">
            <div className="container-fluid p-0">
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
                          value={formik.values.fromDate ? new Date(formik.values.fromDate) : null}
                          onChange={date => formik.setFieldValue('fromDate', date)}
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
                          value={formik.values.endDate ? new Date(formik.values.endDate) : null}
                          onChange={date => formik.setFieldValue('endDate', date)}
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
                            <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                          )} {/* Show spinner if disabled */}
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
            <div className="container-fluid p-3 my-3 ">
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
                        <th> S.No </th>
                        <th> Client Code </th>
                        <th> Client Name </th>
                        <th> SP Transaction ID </th>
                        <th> Client Transaction ID </th>
                        <th> Amount </th>
                        <th> ARN </th>
                        <th> Bank CB Fee </th>
                        <th> CB Credit Date Txn Reject </th>
                        <th> Charge Back Amount </th>
                        <th> Charge Back Credit Date To Merchant </th>
                        <th> Charge Back Date </th>
                        <th> Charge Back Debit Amount </th>
                        <th> Charge Back Remarks </th>
                        <th> Charge Back Status </th>
                        <th> Merchant CB Status </th>
                        <th> Payment Mode </th>
                        <th> Prearb Date </th>
                        <th> Status </th>
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
                            <td>{item.client_code}</td>
                            <td>{item.client_name}</td>
                            <td>{item.txn_id}</td>
                            <td>{item.client_txn_id}</td>
                            <td>{Number.parseFloat(item.payee_amount).toFixed(2)}</td>
                            <td>{item.arn}</td>
                            <td>{item.bank_cb_fee}</td>
                            <td>{item.cb_credit_date_txn_reject}</td>
                            <td>{item.charge_back_amount}</td>
                            <td>{item.charge_back_credit_date_to_merchant}</td>
                            <td>{item.charge_back_date}</td>
                            <td>{Number.parseFloat(item.charge_back_debit_amount).toFixed(2)}</td>
                            <td>{item.charge_back_remarks}</td>
                            <td>{item.charge_back_status}</td>
                            <td>{item.merchant_cb_status}</td>
                            <td>{item.payment_mode}</td>
                            <td>{item.prearb_date}</td>
                            <td>{item.status}</td>
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
                {isLoadingTxnHistory ? (
                  <div className="col-lg-12 col-md-12">
                    <div className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : buttonClicked && dataFound && txnList?.length === 0 ? (
                  <div>
                    <h5 className="d-flex justify-content-center align-items-center">Data Not Found</h5>
                  </div>
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

export default ChargeBackTxnHistory;
