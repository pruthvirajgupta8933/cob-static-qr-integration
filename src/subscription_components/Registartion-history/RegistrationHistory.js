import React, { useState, useEffect } from "react";
import moment from "moment";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import {
  registrationHistoryData,
  registrationHistoryReport,
} from "../../slices/subscription-slice/registrationHistorySlice";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import DateFormatter from "../../utilities/DateConvert";

import CustomLoader from "../../_components/loader";
// import TableWithPagination from '../../utilities/tableWithPagination/TableWithPagination';
import TableWithPagination from "../../utilities/tableWithPagination/TableWithPagination";
import { E_NACH_URL } from "../../config";

const RegistrationHistory = () => {
  const dispatch = useDispatch();
  const [showAllCreatedMandateApi, setShowAllCreatedMandateApi] = useState([]);
  const [filteredMandates, setFilteredMandates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataCount, setDataCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(Math.ceil(dataCount / pageSize));
  const [currentPage, setCurrentPage] = useState(1);
  const [savedValues, setSavedValues] = useState();
  const { user } = useSelector((state) => state.auth);
  const { clientCode } = user.clientMerchantDetailsList[0];
  const [viewDataLoader, setViewDataLoader] = useState(false);
  const [isExporting, setExporting] = useState(false);

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const [todayDate, setTodayDate] = useState(splitDate);
  const initialValues = {
    from_date: todayDate,
    end_date: todayDate,

    registration_status: "ALL",
  };
  const validationSchema = Yup.object({
    from_date: Yup.date().required("Required").nullable(),
    end_date: Yup.date()
      .min(Yup.ref("from_date"), "End date can't be before Start date")
      .required("Required")
      .nullable(),

    registration_status: Yup.string().required("Required").nullable(),
  });

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  useEffect(() => {
    setPageCount(Math.ceil(dataCount / pageSize));
  }, [dataCount, pageSize]);

  useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage]);

  const handlePageClick = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    changeCurrentPage(newPage);
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  useEffect(() => {
    setIsLoading(true)
    let postDataS = {
      start_date: moment(savedValues?.from_date)
        .startOf("day")
        .format("YYYY-MM-DD"),
      end_date: moment(savedValues?.end_date)
        .startOf("day")
        .format("YYYY-MM-DD"),
      registration_status:
        savedValues?.registration_status.toLowerCase() === "all"
          ? ""
          : savedValues?.registration_status,
      page: currentPage,
      page_size: pageSize,
      client_code: clientCode,
    };

    dispatch(registrationHistoryData(postDataS))
      .then((resp) => {
        if (resp?.meta?.requestStatus === "fulfilled") {
          setShowAllCreatedMandateApi(resp.payload.data.results);
          setFilteredMandates(resp.payload.data.results);
          setDataCount(resp?.payload?.data?.count);
          setIsLoading(false);
        } else {
          toast.error(resp.payload?.detail || "Failed to fetch data");
          setIsLoading(false);
        }
        // setDisableView(false);
        // setViewLoader(false);
      })
      .catch(() => {
        setIsLoading(false);
        // setDisableView(false);
        // setViewLoader(false);
        // toast.error("Something went wrong");
      });
  }, [pageSize, currentPage]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim() === "") {
      setFilteredMandates(showAllCreatedMandateApi);
    } else {
      const filteredData = showAllCreatedMandateApi.filter((mandate) =>
        Object.values(mandate).some((field) =>
          field?.toString().toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredMandates(filteredData);
    }
  };

  const dropdownOptions = [
    { key: "All", value: "ALL" },
    { key: "Success", value: "SUCCESS" },
    { key: "Pending", value: "PENDING" },
    { key: "Failed", value: "FAILED" },
    // { key: "Initiated", value: "INITIATED" }
  ];

  const handleViewSubmit = (values) => {
    setSavedValues(values);
    setViewDataLoader(true);
    setIsLoading(true);
    setCurrentPage(1);

    let postDataS = {
      start_date: moment(values?.from_date).startOf("day").format("YYYY-MM-DD"),
      end_date: moment(values?.end_date).startOf("day").format("YYYY-MM-DD"),
      registration_status:
        values.registration_status.toLowerCase() === "all"
          ? ""
          : values.registration_status,

      page: currentPage,
      page_size: pageSize,
      client_code: clientCode,
    };

    dispatch(registrationHistoryData(postDataS))
      .then((resp) => {
        if (resp?.meta?.requestStatus === "fulfilled") {
          setShowAllCreatedMandateApi(resp.payload.data.results);
          setFilteredMandates(resp.payload.data.results);
          setDataCount(resp?.payload?.data?.count);
          setViewDataLoader(false);
          setIsLoading(false);
        } else {
          toast.error(resp.payload?.detail || "Failed to fetch data");
          setViewDataLoader(false);
        }
        // setDisableView(false);
        // setViewLoader(false);
      })
      .catch(() => {
        // setDisableView(false);
        // setViewLoader(false);
        // toast.error("Something went wrong");
      });
  };

  const handleExport = () => {
    let postDataS = {
      start_date: moment(savedValues?.from_date).startOf("day").format("YYYY-MM-DD"),
      end_date: moment(savedValues?.end_date).startOf("day").format("YYYY-MM-DD"),
      registration_status:
        savedValues.registration_status.toLowerCase() === "all"
          ? ""
          : savedValues.registration_status,
    };
    setExporting(true);
    dispatch(registrationHistoryReport(postDataS))
      .then((resp) => {
        if (resp?.meta?.requestStatus === "fulfilled") {
          const blob = new Blob([resp?.payload?.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          saveAs(
            blob,
            `E-mandate_Registration_REPORT_${clientCode}_${splitDate}.csv`
          );
          toast.success("Downloaded successfully");
        } else {
          toast.error(resp.payload?.detail || "Failed to fetch data");
        }
        setExporting(false);
      })
      .catch(() => {
        setExporting(false);
        toast.error("Something went wrong");
      });
  };

  const headers = [
    "S.NO",
    "Email",
    "Mobile",
    "Customer Name",
    "Registration ID",
    "Bank Message",
    "Registration Status",
    "Consumer ID",
    "Account Holder Name",
    "Account Number",
    "IFSC",
    "Account Type",
    "Mandate Registration Date",
    "Mandate Start Date",
    "Mandate End Date",
    "Frequency",
    "Max Amount",
    "Purpose",
    "Amount Type",
    "Registration Link",
  ];

  const renderRow = (mandate, index) => {
    const mandateRegisterdLink = `${E_NACH_URL.BASE_URL_E_NACH}api/mandate/bank-details/?registration_id=${mandate.registration_id}`;

    const copyToClipboard = (link) => {
      navigator.clipboard
        .writeText(link)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    };

    return (
      <tr key={index} className="text-nowrap">
        <td>{index + 1}</td>
        <td>{mandate.customer_email_id}</td>
        <td>{mandate.customer_mobile}</td>
        <td>{mandate.customer_name}</td>
        <td>{mandate.registration_id}</td>
        <td>{mandate.bank_status_message}</td>
        <td>{mandate.registration_status}</td>
        <td>{mandate.consumer_id}</td>
        <td>{mandate.account_holder_name}</td>
        <td>{mandate.account_number}</td>
        <td>{mandate.ifsc_code}</td>
        <td>{mandate.account_type}</td>
        <td>{DateFormatter(mandate.created_on)}</td>
        <td>{mandate.start_date}</td>
        <td>{mandate.end_date}</td>
        <td>{mandate.frequency}</td>
        <td>{mandate.max_amount}</td>
        <td>{mandate.purpose}</td>
        <td>{mandate.amount_type}</td>
        <td>
          <button
            className="btn cob-btn-primary  approve  text-white btn-sm"
            onClick={() => copyToClipboard(mandateRegisterdLink)}
          >
            <i className="fa fa-clone me-1"></i>
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
        <h5>Registration History</h5>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleViewSubmit}
          >
            {(formik) => (
              <Form>
                <div className="row">
                  <div className="col-lg-3">
                    <FormikController
                      control="date"
                      label="From Date"
                      id="from_date"
                      name="from_date"
                      value={
                        formik.values.from_date
                          ? new Date(formik.values.from_date)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue("from_date", date)
                      }
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-datepicker p-2 zindex_DateCalender"
                      required={true}
                      errorMsg={formik.errors["from_date"]}
                      popperPlacement="top-end"
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikController
                      control="date"
                      label="End Date"
                      id="end_date"
                      name="end_date"
                      value={
                        formik.values.end_date
                          ? new Date(formik.values.end_date)
                          : null
                      }
                      onChange={(date) =>
                        formik.setFieldValue("end_date", date)
                      }
                      format="dd-MM-y"
                      clearIcon={null}
                      className="form-control rounded-datepicker p-2 zindex_DateCalender"
                      required={true}
                      errorMsg={formik.errors["end_date"]}
                    />
                  </div>

                  <div className="col-lg-3">
                    <FormikController
                      control="select"
                      label="Current Status"
                      name="registration_status"
                      className="form-select"
                      options={dropdownOptions}
                    />
                  </div>
                  <div className="col-lg-1">
                    <button
                      className="btn cob-btn-primary approve text-white mt-4 "
                      type="submit"
                      disabled={viewDataLoader}
                    >
                      {viewDataLoader ? (
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                      View
                    </button>
                  </div>
                  {/* {dataCount > 0 && (
                    <div className="col-lg-1">
                      <button
                        className="btn cob-btn-primary approve text-white mt-4 "
                        type="button"
                        disabled={isExporting}
                        onClick={() => handleExport(formik.values)}
                      >
                        {isExporting && (
                          <span
                            className="spinner-border spinner-border-sm mr-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        Export
                      </button>
                    </div>
                  )} */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {isLoading ? (
        <CustomLoader loadingState={isLoading} />
      ) : (
        <TableWithPagination
          headers={headers}
          data={filteredMandates}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          renderRow={renderRow}
          dataCount={dataCount}
          pageSize={pageSize}
          changePageSize={setPageSize}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          disable={isExporting}
          onClickExport={handleExport}
          isExport={true}
        />
      )}
    </div>
  );
};

export default RegistrationHistory;
