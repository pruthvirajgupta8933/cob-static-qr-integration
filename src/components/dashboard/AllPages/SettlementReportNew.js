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
      "S.No",
      "Client Code",
      "Client Name",
      "SP Transaction ID",
      "GR Number",
      "Client Transaction ID",
      "Amount",
      "Settlement Amount",
      "Settlement Date",
      "Settlement Bank Ref",
      "Settlement UTR",
      "Settlement Remarks",
      // "Settlement By",
    ];
    const excelArr = [excelHeaderRow];
    // eslint-disable-next-line array-callback-return
    txnList.map((item, index) => {
     
      const allowDataToShow = {
        srNo: item.srNo === null ? "" : index + 1,
        client_code: item.client_code === null ? "" : item.client_code,
        client_name: item.client_name === null ? "" : item.client_name,
        txn_id: item.txn_id === null ? "" : item.txn_id,
        gr_number: item.gr_number === null ? "" : item.gr_number,
        client_txn_id: item.client_txn_id === null ? "" : item.client_txn_id,
        payee_amount:
          item.payee_amount === null
            ? ""
            : Number.parseFloat(item.payee_amount),
        settlement_amount:
          item.settlement_amount === null
            ? ""
            : Number.parseFloat(item.settlement_amount),
        settlement_date:
          item.settlement_date === null ? "" : item.settlement_date,
        settlement_bank_ref:
          item.settlement_bank_ref === null ? "" : item.settlement_bank_ref,
        settlement_utr: item.settlement_utr === null ? "" : item.settlement_utr,
        settlement_remarks:
          item.settlement_remarks === null ? "" : item.settlement_remarks,
        // settlement_by: item.settlement_by === null ? "" : item.settlement_by,
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
