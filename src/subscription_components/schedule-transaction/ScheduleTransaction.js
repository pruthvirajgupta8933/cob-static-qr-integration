import React, { useState, useEffect } from "react";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CustomLoader from "../../_components/loader";
import TableWithPagination from "../../utilities/tableWithPagination/TableWithPagination";
import CustomModal from "../../_components/custom_modal";
import {
    mandateTransactionSchedule,
    scheduleTransactionData,
} from "../../slices/subscription-slice/scheduleTransactionSlice";
import { ErrorMessage, Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";

const SchedulueTransaction = () => {
    const dispatch = useDispatch();
    const [showAllCreatedMandateApi, setShowAllCreatedMandateApi] = useState([]);
    const [filteredMandates, setFilteredMandates] = useState([]);
    const [modalToggle, setModalToggle] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [dataCount, setDataCount] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageCount, setPageCount] = useState(Math.ceil(dataCount / pageSize));
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMandate, setSelectedMandate] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { clientCode } = user.clientMerchantDetailsList[0];

    const [filterFromDate, setFilterFromDate] = useState("");
    const [isScheduling, setIsScheduling] = useState(false);
    const [isDateFilterSubmitting, setIsDateFilterSubmitting] = useState(false);

    const handlePageChange = (selectedItem) => setCurrentPage(selectedItem.selected + 1);

    useEffect(() => {
        setPageCount(Math.ceil(dataCount / pageSize));
    }, [dataCount, pageSize]);

    const fetchData = (page, size, fromDate = "") => {
        setIsLoading(true);
        const queryParams = {
            page: page,
            page_size: size,
        };
        const payloadData = {
            client_code: clientCode,
            is_admin: false
        };

        if (fromDate) {
            queryParams.from_date = new Date(fromDate).toISOString().split("T")[0];
        }

        dispatch(scheduleTransactionData({ queryParams, payloadData }))
            .then((resp) => {
                if (resp?.meta?.requestStatus === "fulfilled") {
                    setFilteredMandates(resp.payload.data.results);
                    setShowAllCreatedMandateApi(resp.payload.data.results);
                    setDataCount(resp?.payload?.data?.count);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    toast.error(resp.error?.message || "Failed to fetch data.");
                }
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData(currentPage, pageSize, filterFromDate);
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

    const headers = [
        "Customer Name",
        "Mobile",
        "Email",
        "Account Number",
        "Account Type",
        "IFSC",
        "Registration ID",
        "Registration Status",
        "Consumer ID",
        "Max Amount",
        "Amount Type",
        "Purpose",
        "Mode",
        "Frequency",
        "Bank Reference Number",
        "Transaction Schedule",
    ];

    const renderRow = (mandate, index) => {
        const showValue = (value) => value ? value : "NA";

        return (
            <tr key={index} className="text-nowrap">
                <td>{showValue(mandate?.customer_name)}</td>
                <td>{showValue(mandate?.customer_mobile)}</td>
                <td>{showValue(mandate?.customer_email_id)}</td>
                <td>{showValue(mandate?.account_number)}</td>
                <td>{showValue(mandate?.account_type)}</td>
                <td>{showValue(mandate?.ifsc_code)}</td>
                <td>{showValue(mandate?.registration_id)}</td>
                <td>{showValue(mandate?.registration_status)}</td>
                <td>{showValue(mandate?.consumer_id)}</td>
                <td>{showValue(mandate?.max_amount)}</td>
                <td>{showValue(mandate?.amount_type)}</td>
                <td>{showValue(mandate?.purpose)}</td>
                <td>{showValue(mandate?.mode)}</td>
                <td>{showValue(mandate?.frequency)}</td>
                <td>{showValue(mandate?.bank_reference_number)}</td>
                <td>
                    <button
                        className="btn cob-btn-primary approve text-white btn-sm"
                        onClick={() => {
                            setSelectedMandate(mandate);
                            setModalToggle(true);
                        }}
                    >
                        Schedule Transaction
                    </button>
                </td>
            </tr>
        );
    };

    const handleSubmit = (values) => {
        setIsScheduling(true);
        const payload = {
            mandate_registration_id: selectedMandate?.registration_id,
            trans_amount: parseFloat(values.trans_amount),
        };

        dispatch(mandateTransactionSchedule(payload)).then((resp) => {
            setIsScheduling(false);
            if (resp?.meta?.requestStatus === "fulfilled") {
                toast.success(resp?.payload?.data?.message);
                setModalToggle(false);
                fetchData(currentPage, pageSize, filterFromDate);
            } else {
                toast.error(resp.payload || "Transaction scheduling failed.");
            }
        });
    };

    const modalbody = () => {
        if (!selectedMandate) return null;
        const isFixed = selectedMandate?.amount_type?.toLowerCase() === "fixed";
        const emiAmount = selectedMandate?.emi_amount || 0;
        const initialValues = {
            trans_amount: emiAmount,
        };
        const validationSchema = Yup.object({
            trans_amount: Yup.number().required("Transaction Amount is required").typeError("Amount must be a number"),
        });

        return (
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {() => (
                    <Form>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Registration ID</label>
                                <p className="form-control-plaintext">
                                    {selectedMandate?.registration_id}
                                </p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Next Transaction Date</label>
                                <p className="form-control-plaintext">
                                    {selectedMandate?.actual_next_transaction_date}
                                </p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Max Amount</label>
                                <p className="form-control-plaintext">
                                    {selectedMandate?.max_amount}
                                </p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Amount Type</label>
                                <p className="form-control-plaintext">
                                    {selectedMandate?.amount_type}
                                </p>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Transaction Amount</label>
                                <FormikController
                                    type="text"
                                    name="trans_amount"
                                    className="form-control"
                                    control="input"
                                    disabled={isFixed}
                                />
                                <ErrorMessage name="trans_amount">
                                    {(msg) => <p className="text-danger mt-1">{msg}</p>}
                                </ErrorMessage>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="d-flex justify-content-end">
                                <button
                                    className="btn btn-primary btn-sm"
                                    type="submit"
                                    disabled={isScheduling}
                                >
                                    {isScheduling ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        "Schedule Transaction"
                                    )}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        );
    };

    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2].length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");

    const [todayDate] = useState(splitDate)

    const initialDateFilterValues = {
        from_date: todayDate,
    };

    const validationDateFilterSchema = Yup.object({
        from_date: Yup.date().nullable().notRequired(),
    });

    const handleDateFilterSubmit = (values) => {
        setIsDateFilterSubmitting(true);
        setCurrentPage(1);
        setFilterFromDate(values.from_date || "");

        const queryParams = {
            page: 1,
            page_size: pageSize,
        };
        const payloadData = {
            client_code: clientCode,
            is_admin: false
        };


        if (values.from_date) {
            const dateObj = new Date(values.from_date);
            const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            queryParams.from_date = formattedDate;
        }

        dispatch(scheduleTransactionData({ queryParams, payloadData }))
            .then((resp) => {
                if (resp?.meta?.requestStatus === "fulfilled") {
                    setFilteredMandates(resp.payload.data.results);
                    setShowAllCreatedMandateApi(resp.payload.data.results);
                    setDataCount(resp?.payload?.data?.count);
                    setIsDateFilterSubmitting(false);
                } else {
                    toast.error(resp.error?.message || "Failed to fetch data.");
                    setIsDateFilterSubmitting(false);
                }
            })
            .catch(() => setIsDateFilterSubmitting(false));
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                <h5>Schedule Transactionn</h5>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <Formik
                        initialValues={initialDateFilterValues}
                        validationSchema={validationDateFilterSchema}
                        onSubmit={handleDateFilterSubmit}
                        enableReinitialize={true}
                    >
                        {(formik) => (
                            <Form>
                                <div className="row">
                                    <div className="col-md-3">
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
                                    <div className="col-md-3 mt-3">
                                        <button
                                            type="submit"
                                            className="btn cob-btn-primary approve text-white btn-sm mt-2 "
                                            disabled={isDateFilterSubmitting}
                                        >
                                            {isDateFilterSubmitting ? (
                                                <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                                            ) : (
                                                "View"
                                            )}
                                        </button>
                                    </div>
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
                />
            )}

            <CustomModal
                modalBody={modalbody}
                headerTitle={"Schedule Transaction"}
                modalFooter={""}
                modalToggle={modalToggle}
                fnSetModalToggle={setModalToggle}
            />
        </div>
    );
};

export default SchedulueTransaction;