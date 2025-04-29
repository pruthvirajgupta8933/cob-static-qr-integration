// All existing imports remain the same
import React, { useState, useEffect } from "react";
import moment from "moment";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
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
    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1].length === 1) splitDate[1] = "0" + splitDate[1];
    if (splitDate[2].length === 1) splitDate[2] = "0" + splitDate[2];
    splitDate = splitDate.join("-");



    const handlePageChange = (selectedItem) => setCurrentPage(selectedItem.selected + 1);

    useEffect(() => {
        setPageCount(Math.ceil(dataCount / pageSize));
    }, [dataCount, pageSize]);



    useEffect(() => {
        const postDataS = {
            page: currentPage,
            page_size: pageSize,
        };

        dispatch(scheduleTransactionData(postDataS))
            .then((resp) => {
                if (resp?.meta?.requestStatus === "fulfilled") {
                    setFilteredMandates(resp.payload.data.results);
                    setShowAllCreatedMandateApi(resp.payload.data.results);
                    setDataCount(resp?.payload?.data?.count);
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            })
            .catch(() => setIsLoading(false));
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
        "S.NO", "Email", "Mobile", "Customer Name", "Registration ID",
        "Bank Message", "Registration Status", "Consumer ID", "Account Holder Name",
        "Account Number", "IFSC", "Account Type", "Next Transaction Date",
        "Mandate start Date", "Mandate End Date", "Frequency", "Max Amount",
        "Purpose", "Amount Type", "EMI Amount", "Transaction Schedule",
    ];

    const renderRow = (mandate, index) => {
        return (
            <tr key={index} className="text-nowrap">
                <td>{index + 1}</td>
                <td>{mandate?.customer_email_id}</td>
                <td>{mandate?.customer_mobile}</td>
                <td>{mandate?.customer_name}</td>
                <td>{mandate?.registration_id}</td>
                <td>{mandate?.bank_status_message}</td>
                <td>{mandate?.registration_status}</td>
                <td>{mandate?.consumer_id}</td>
                <td>{mandate?.account_holder_name}</td>
                <td>{mandate?.account_number}</td>
                <td>{mandate?.ifsc_code}</td>
                <td>{mandate?.account_type}</td>
                <td>{mandate?.actual_next_transaction_date}</td>
                <td>{mandate?.start_date}</td>
                <td>{mandate?.end_date}</td>
                <td>{mandate?.frequency}</td>
                <td>{mandate?.max_amount}</td>
                <td>{mandate?.purpose}</td>
                <td>{mandate?.amount_type}</td>
                <td>{mandate?.emi_amount}</td>
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



    const handleSubmit = (values, { setSubmitting }) => {
        const payload = {
            mandate_registration_id: selectedMandate?.registration_id,
            trans_amount: parseFloat(values.trans_amount),
        };

        dispatch(mandateTransactionSchedule(payload)).then((resp) => {

            setSubmitting(false);
            if (resp?.meta?.requestStatus === "fulfilled") {
                toast.success(resp?.payload?.data?.message);
                setModalToggle(false);
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
            trans_amount: Yup.number().required("Transaction Amount is required"),
        });

        return (
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Registration ID</label>
                                <p className="form-control-plaintext">{selectedMandate?.registration_id}</p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Next Transaction Date</label>
                                <p className="form-control-plaintext">{selectedMandate?.actual_next_transaction_date}</p>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="font-weight-bold">Max Amount</label>
                                <p className="form-control-plaintext">{selectedMandate?.max_amount}</p>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Amount Type</label>
                                <p className="form-control-plaintext">{selectedMandate?.amount_type}</p>
                            </div>


                            <div className="col-md-6 mb-3">
                                <label className="font-weight-bold">Transaction Amount</label>
                                <FormikController
                                    type="test"
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
                                    className="btn cob-btn-primary btn-sm"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Schedule Transaction
                                </button>
                            </div>
                        </div>

                    </Form>
                )}
            </Formik>

        );
    };



    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom mb-4">
                <h5>Schedule Transaction</h5>
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
