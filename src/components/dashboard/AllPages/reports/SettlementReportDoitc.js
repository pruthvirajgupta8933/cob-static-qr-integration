import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { saveAs } from "file-saver";
import FormikController from "../../../../_components/formik/FormikController";
import { toast } from "react-toastify";
import { convertToFormikSelectJson } from "../../../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
import {
  clearSettledTransactionHistory,
  settledTransactionHistoryDoitc,
} from "../../../../slices/merchant-slice/reportSlice";
import Yup from "../../../../_components/formik/Yup";
import { roleBasedAccess } from "../../../../_components/reuseable_components/roleBasedAccess";
import { fetchChildDataList } from "../../../../slices/approver-dashboard/merchantReferralOnboardSlice";
import { dateFormatBasic } from "../../../../utilities/DateConvert";
import CardLayout from "../../../../utilities/CardLayout";
import Table from '../../../../_components/table_components/table/Table';
import { fetchExportDsoitcData } from "../../../../services/merchant-service/reports.service";
import CountPerPageFilter from "../../../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../../../_components/table_components/filters/SearchFilter";

export const SettlementReportDoitc = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const roles = roleBasedAccess();

  const { auth, merchantReportSlice, merchantReferralOnboardReducer } =
    useSelector((state) => state);

  const { refrerChiledList } = merchantReferralOnboardReducer;
  const clientCodeData = refrerChiledList?.resp?.results ?? [];

  const { user } = auth;
  const [txnList, SetTxnList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showData, setShowData] = useState([]);
  const [updateTxnList, setUpdateTxnList] = useState([]);
  // const [dataCount, setDatacount] = useState(0);
  const [saveValues, setSaveValues] = useState(null);
  const [strClientCode, setStrClientCode] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [clientCodeArrLength, setClientCodeArrLength] = useState("");
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [disable, setIsDisable] = useState(false);
  const [dataCount, setDatacount] = useState(0);


  // Get current date for initial form values
  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1]?.length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");
  const [todayDate] = useState(splitDate);


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
  let fnKey, fnVal = "";
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
    clientCode: "",
    fromDate: todayDate,
    endDate: todayDate,
    noOfClient: "1",
    rpttype: "0",
  };

  const validationSchema = Yup.object({
    clientCode: Yup.string().required("Client Code is Required"),
    fromDate: Yup.date().required("From Date is Required"),
    endDate: Yup.date()
      .min(Yup.ref("fromDate"), "End date can't be before Start date")
      .required("End Date is Required"),
  });

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const searchByText = () => {
    setShowData(
      updateTxnList?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
    if (updateTxnList.length === 0) {
      setPageSize(0);
    }
  };

  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const fetchData = () => {
    const roleType = roles;
    const type = roleType.bank
      ? "bank"
      : roleType.referral
        ? "referrer"
        : "default";
    if (type !== "default") {
      let postObj = {
        type: type,
        login_id: auth?.user?.loginId,
      };
      dispatch(fetchChildDataList(postObj));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const callSettlementHistoryAPI = (page, length, values) => {
    if (!values) return;

    let currentClientCode = strClientCode;
    let currentClientCountLength = clientCodeArrLength;

    if (values.clientCode === "All") {
      const allClientCode = [];
      if (Array.isArray(clientCodeListArr)) {
        clientCodeListArr.forEach((item) => {
          if (item?.client_code) {
            allClientCode.push(item.client_code);
          }
        });
        currentClientCountLength = allClientCode.length.toString();
        currentClientCode = allClientCode.join(",");
      } else {
        toast.error("Client list not available for 'All' selection.");
        return;
      }
    } else {
      currentClientCode = values.clientCode || "";
      currentClientCountLength = "1";
    }

    const paramData = {
      clientCode: currentClientCode,
      fromDate: moment(values.fromDate).startOf("day").format("YYYY-MM-DD"),
      endDate: moment(values.endDate).startOf("day").format("YYYY-MM-DD"),
      clientCount: currentClientCountLength,
      rpttype: values.rpttype,
      page: page,
      length: length,
    };

    setIsDisable(true);

    dispatch(settledTransactionHistoryDoitc(paramData)).then((res) => {
      const ApiStatus = res?.meta?.requestStatus;
      const ApiPayload = res?.payload;

      if (ApiStatus === "rejected") {
        toast.error("Request Rejected");
        setIsDisable(false);
        // isButtonClicked(false); // Reset buttonClicked on error
      }

      if (ApiStatus === "fulfilled") {
        setIsDisable(false);
      }

      if (ApiPayload?.length < 1 && ApiStatus === "fulfilled") {
        toast.error("No Data Found");
        setIsDisable(false);
        // isButtonClicked(false); // Reset buttonClicked if no data found
      }
    });
  };

  useEffect(() => {
    if (saveValues) {
      callSettlementHistoryAPI(currentPage, pageSize, saveValues);
    }
  }, [pageSize, currentPage, saveValues]);

  const onSubmitHandler = (values) => {
    setCurrentPage(1);
    setSaveValues(values);

    let localStrClientCode = "";
    let localClientCodeArrLength = "";

    if (values.clientCode === "All") {
      const allClientCode = [];
      if (Array.isArray(clientCodeListArr)) {
        clientCodeListArr.forEach((item) => {
          if (item?.client_code) {
            allClientCode.push(item.client_code);
          }
        });
        localClientCodeArrLength = allClientCode.length.toString();
        localStrClientCode = allClientCode.join(",");
      } else {
        toast.error("Client list not available");
        return;
      }
    } else {
      localStrClientCode = values.clientCode || "";
      localClientCodeArrLength = "1";
    }

    setStrClientCode(localStrClientCode);
    setClientCodeArrLength(localClientCodeArrLength);

    callSettlementHistoryAPI(1, pageSize, values);
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const TxnListArrUpdated = merchantReportSlice?.settledTransactionHistoryDoitc?.data;
    if (TxnListArrUpdated) {
      SetTxnList(TxnListArrUpdated.results || []);
      setUpdateTxnList(TxnListArrUpdated.results || []);
      setShowData(TxnListArrUpdated.results || []);
      setDatacount(TxnListArrUpdated?.count || 0);
    }
  }, [merchantReportSlice.settledTransactionHistoryDoitc.data]);

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
  }, [searchText, updateTxnList]);

  const exportToExcelFn = async (exportType) => {
    const fileName = "Settlement-Report";

    if (!saveValues) {
      toast.error("Please perform a search first to export data.");
      return;
    }

    const payload = {
      clientCode: strClientCode,
      fromDate: moment(saveValues.fromDate).startOf("day").format("YYYY-MM-DD"),
      endDate: moment(saveValues.endDate).startOf("day").format("YYYY-MM-DD"),
      clientCount: clientCodeArrLength,
      rpttype: saveValues.rpttype,
      exportType: exportType,
    };

    try {
      setExportLoading(true);
      const response = await fetchExportDsoitcData(payload);

      const contentDisposition = response.headers['content-disposition'];
      let fileExtension = exportType === "xlxs" ? "xlsx" : "csv";
      let finalFileName = `${fileName}.${fileExtension}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          finalFileName = match[1];
        }
      }

      const blob = new Blob([response.data], { type: response.headers["content-type"] });
      saveAs(blob, finalFileName);

    } catch (error) {

      toast.error("Failed to export file. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const SettlementReportData = [
    {
      id: "1",
      name: "Sr. No.",
      selector: (row) => row.SrNo,
      sortable: true,
      width: "90px",
    },
    {
      id: "2",
      name: "Trans ID",
      selector: (row) => row.txn_id,
      sortable: true,
      width: "180px",
    },
    {
      id: "3",
      name: "Client Trans ID",
      selector: (row) => row.client_txn_id,
      sortable: true,
    },
    {
      id: "4",
      name: "Amount",
      selector: (row) => row.payee_amount,
      cell: (row) =>
        Number.parseFloat(row.payee_amount).toFixed(2),
      sortable: true,
    },
    {
      id: "5",
      name: "Transaction Date",
      selector: (row) => row.trans_date,
      cell: (row) => dateFormatBasic(row?.trans_date),
      sortable: true,
      width: "160px",
    },
    {
      id: "6",
      name: "Payment Status",
      selector: (row) => row.status,
    },
    {
      id: "7",
      name: "Payer First Name",
      selector: (row) => row.payee_first_name,
    },
    {
      id: "8",
      name: "Client Code",
      selector: (row) => row.client_code,
    },
    {
      id: "9",
      name: "Payment Mode",
      selector: (row) => row.paymode_name,
    },
    {
      id: "10",
      name: "Client Name",
      selector: (row) => row.client_name,
    },
    {
      id: "11",
      name: "Settlement Status",
      selector: (row) => row.settlement_status,
    },
    {
      id: "12",
      name: "Settlement Date",
      selector: (row) => row.settlement_date,
      cell: (row) => dateFormatBasic(row.settlement_date),
      sortable: true,
      width: "160px",
    },
    {
      id: "13",
      name: "Settlement Amount",
      selector: (row) => row.settlement_amount,
      cell: (row) =>
        Number.parseFloat(row.settlement_amount).toFixed(2),
    },
    {
      id: "14",
      name: "Refund Status",
      selector: (row) => row.refund_status,
    },
    {
      id: "15",
      name: "Refunded Date",
      selector: (row) => row.refund_process_on,
    },
    {
      id: "16",
      name: "Refunded Amount",
      selector: (row) => row.refunded_amount,
      cell: (row) =>
        Number.parseFloat(row.refunded_amount).toFixed(
          2
        ),
    },
    {
      id: "17",
      name: "Track Id",
      selector: (row) => row.refund_track_id,
    },
    {
      id: "18",
      name: "Chargeback Status",
      selector: (row) => row.chargeback_status,
    },
    {
      id: "19",
      name: "Charged Date",
      selector: (row) => row.charge_back_date,
    },
    {
      id: "20",
      name: "Charged Amount",
      selector: (row) => row.charge_back_amount,
      cell: (row) =>
        row.charge_back_amount
          ? Number.parseFloat(row.charge_back_amount).toFixed(2)
          : "",
    },
    {
      id: "21",
      name: "Remarks",
      selector: (row) => row.refund_reason,
    },
  ];

  return (
    <CardLayout title="Settlement Report">
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
              {txnList?.length > 0 && saveValues ? (
                <div className="form-group col-md-1">
                  <div className="dropdown form-group">
                    <button
                      className="btn btn-primary btn-sm dropdown-toggle"
                      type="button"
                      id="dropdownMenu2"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      disabled={exportLoading}
                    >
                      {exportLoading && (
                        <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                      )}
                      Export
                    </button>
                    <div
                      className="dropdown-menu bg-light p-2"
                      aria-labelledby="dropdownMenu2"
                    >
                      <button
                        className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left"
                        type="button"
                        onClick={() => exportToExcelFn("csv")}
                        disabled={exportLoading}
                      >
                        {exportLoading && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )}
                        CSV
                      </button>
                      <button
                        className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left"
                        type="button"
                        onClick={() => exportToExcelFn("csv-ms-excel")}
                        disabled={exportLoading}
                      >
                        {exportLoading && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )}
                        CSV for MS-Excel
                      </button>
                      <button
                        className="dropdown-item m-0 p-0 btn btn-sm btn-secondary text-left"
                        type="button"
                        onClick={() => exportToExcelFn("xlxs")}
                        disabled={exportLoading}
                      >
                        {exportLoading && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )}
                        Excel
                      </button>
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
            <SearchFilter
              kycSearch={kycSearch}
              searchText={searchText}
              searchByText={searchByText}
              setSearchByDropDown={setSearchByDropDown}
            />
          </div>
          <div className="form-group col-md-3">
            <CountPerPageFilter
              pageSize={pageSize}
              dataCount={dataCount}
              changePageSize={changePageSize}
              changeCurrentPage={changeCurrentPage}
            />
          </div>
        </div>
      ) : (
        <> </>
      )}

      <div className="container p-0 ">
        <div className="scroll overflow-auto">
          {showData.length === 0 ? "" : <h6>Total Count : {dataCount}</h6>}

          <Table
            row={SettlementReportData}
            data={showData}
            dataCount={dataCount}
            pageSize={pageSize}
            currentPage={currentPage}
            loadingState={merchantReportSlice.settledTransactionHistoryDoitc.loading}
            changeCurrentPage={changeCurrentPage}
          />
        </div>
      </div>
    </CardLayout>
  );
};

export default SettlementReportDoitc;