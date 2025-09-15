import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import FormikController from "../../_components/formik/FormikController";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import moment from "moment";
import { fetchChildDataList } from '../../slices/persist-slice/persistSlice';
import Yup from "../../_components/formik/Yup";
import { fetchBankMerchantDetailList } from "../../slices/bank-dashboard-slice/bankDashboardSlice";
import Table from "../../_components/table_components/table/Table";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
import DateFormatter from "../../utilities/DateConvert";
import ReportLayout from "../../utilities/CardLayout";
import { bankDashboardService } from "../../services/bank/bank.service";
import { kycUserList } from "../../slices/kycSlice";
import CustomModal from "../../_components/custom_modal";

function MerchantDetailList() {
    const dispatch = useDispatch();
    const [searchText, SetSearchText] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [showData, setShowData] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [modalToggle, setModalToggle] = useState(false);
    const [modalContactData, setModalContactData] = useState(null); // New state for modal data

    const [searchType, setSearchType] = useState('clientCode');
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [shouldFetchChildData, setShouldFetchChildData] = useState(true);

    const { auth, bankDashboardReducer, commonPersistReducer, kyc } = useSelector((state) => state);
    const kycData = kyc?.kycUserList;

    const { refrerChiledList } = commonPersistReducer;
    const { merhcantDetailsList, reportLoading } = bankDashboardReducer;

    const clientCodeData = refrerChiledList?.resp?.results ?? [];

    let now = moment().format("YYYY-M-D");
    let todayDate = now.split("-");
    if (todayDate[1].length === 1) {
        todayDate[1] = "0" + todayDate[1];
    }
    if (todayDate[2].length === 1) {
        todayDate[2] = "0" + todayDate[2];
    }
    todayDate = todayDate.join("-");

    const validationSchema = Yup.object().shape({
        clientCode: Yup.string().when('searchType', {
            is: 'clientCode',
            then: Yup.string().required("Required")
        }),
        fromDate: Yup.date().when('searchType', {
            is: 'dateWise',
            then: Yup.date().required("Required")
        }),
        endDate: Yup.date().when('searchType', {
            is: 'dateWise',
            then: Yup.date().min(Yup.ref("fromDate"), "End date can't be before Start date").required("Required")
        }),
    });

    const isExtraDataRequired = true;
    const extraDataObj = { key: "All", value: "All" };
    const forClientCode = true;
    const fnKey = "client_code";
    const fnVal = "name";
    const clientCodeOption = convertToFormikSelectJson(
        fnKey,
        fnVal,
        clientCodeData,
        extraDataObj,
        isExtraDataRequired,
        forClientCode
    );

    const initialValues = {
        clientCode: "",
        fromDate: todayDate,
        endDate: todayDate,
        paymentStatus: "all",
        length: 10,
        page: 1,
        searchType: 'clientCode'
    };

    const FIVE_MINUTES = 5 * 60 * 1000;

    useEffect(() => {
        if (!auth?.user?.loginId || !shouldFetchChildData) return;

        const fetchData = () => {
            dispatch(fetchChildDataList({
                type: "bank",
                login_id: auth.user.loginId,
            }));
        };

        if (clientCodeData.length === 0) {
            fetchData();
            const interval = setInterval(() => {
                if (clientCodeData.length === 0) {
                    fetchData();
                } else {
                    clearInterval(interval);
                    setShouldFetchChildData(false);
                }
            }, FIVE_MINUTES);

            return () => clearInterval(interval);
        } else {
            setShouldFetchChildData(false);
        }
    }, [dispatch, auth?.user?.loginId, clientCodeData.length, shouldFetchChildData]);

    const fetchReportData = async (objData, page, size) => {
        let paramData = {};
        if (objData.searchType === 'clientCode') {
            paramData = {
                clientCode: objData.clientCode === 'All' ? '' : objData.clientCode,
                page: page,
                length: size,
            };
        } else { // 'dateWise'
            paramData = {
                fromDate: moment(objData.fromDate).startOf('day').format('YYYY-MM-DD'),
                endDate: moment(objData.endDate).startOf('day').format('YYYY-MM-DD'),
                page: page,
                length: size,
            };
        }
        dispatch(fetchBankMerchantDetailList(paramData));
    };

    const onSubmitHandler = async (values, { setFieldValue }) => {
        setFormValues(values);
        setPageSize(10);
        setCurrentPage(1);
        setSearchTrigger(prev => prev + 1);
    };

    useEffect(() => {
        if (formValues && Object.keys(formValues).length !== 0) {
            fetchReportData(formValues, currentPage, pageSize);
        }
    }, [pageSize, currentPage, searchTrigger, formValues]);

    useEffect(() => {
        if (searchText !== "") {
            setShowData(
                merhcantDetailsList?.results?.filter((txnItme) =>
                    Object.values(txnItme)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                )
            );
        } else {
            setShowData(merhcantDetailsList?.results);
        }
    }, [searchText, merhcantDetailsList]);

    const exportToExcelFn = async (formikValues) => {
        const payload = {
            client_code: formikValues.clientCode === 'All' ? '' : formikValues.clientCode,
            start_date: moment(formikValues.fromDate).startOf('day').format('YYYY-MM-DD'),
            end_date: moment(formikValues.endDate).startOf('day').format('YYYY-MM-DD'),
        };
        try {
            const response = await bankDashboardService.exportMerchantSummary(payload);
            if (response && response.data) {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bank-Merchant-Summary-${moment().format('YYYY-MM-DD')}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('No data received for export.');
            }
        } catch (error) {
            console.error('Error during file export:', error);
        }
    };

    const countPageHandler = (val) => {
        setPageSize(val);
    };

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const docListModal = (row) => {
        setSelectedId(row?.login_id);
        // Dispatch kycUserList only if it's necessary for other parts of the modal
        dispatch(kycUserList({ login_id: row?.login_id, }));

        // Set the contact data from the row to the new state
        setModalContactData({
            contactPersonName: row?.contact_person_name || 'N/A', // Assuming a contact_person_name field exists
            contactNumber: row?.contact_number || 'N/A', // Assuming a contact_number field exists
            emailId: row?.email_id || 'N/A', // Assuming an email_id field exists
        });

        setModalToggle(true);
    };

    const tableRow = [
        { id: "1", name: "S.No", selector: (row) => row.sno, sortable: true, width: "100px" },
        { id: "2", name: "Client ID", selector: (row) => row.sub_merchant_id, sortable: true },
        { id: "45", name: "Client Code", selector: (row) => row.client_code, sortable: true },
        { id: "3", name: "Merchant Name", selector: (row) => row.merchant_name, cell: (row) => <div className="removeWhiteSpace">{row?.merchant_name}</div> },
        { id: "4", name: "Settlement Account", selector: (row) => row.settlement_account },
        { id: "5", name: "Date Of Onboarding", selector: (row) => DateFormatter(row.date_of_onboarding, false) },
        {
            id: "10",
            name: "Action",
            cell: (row) => (
                <div>
                    <button
                        type="button"
                        className="approve text-white cob-btn-primary btn-sm"
                        onClick={() => docListModal(row)}
                    >
                        View Status
                    </button>
                </div>
            ),
        }
    ];

    const modalBody = () => {
        if (!modalContactData) {
            return <div className="kyc-modal-body">No contact data available.</div>;
        }

        return (
            <div className="kyc-modal-body">

                <h6>Merchant Contact Info</h6>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Contact Person Name</th>
                                <th>Contact Number</th>
                                <th>Email ID</th>
                                <th>Developer Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{kycData.name}</td>
                                <td>{kycData.contactNumber}</td>
                                <td>{kycData.emailId}</td>
                                <td>{kycData?.developer_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <h6>Business Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Business PAN</th>
                                <th>Business PAN DOB/DOI</th>
                                <th>Authorized Signatory PAN</th>
                                <th>Auth Signatory  DOB/DOI</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{kycData.panCard || 'N/A'}</td>
                                <td>{kycData.pan_dob_or_doi || 'N/A'}</td>
                                <td>{kycData.signatoryPAN || 'N/A'}</td>
                                <td>{kycData.authorized_person_dob || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <h6>Bank Details</h6>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>IFSC Code</th>
                                <th>Business Account Number</th>
                                <th>Account Holder Name</th>
                                <th>Account Type</th>
                                <th>Bank Name</th>
                                <th>Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{kycData.merchant_account_details?.ifsc_code || 'N/A'}</td>
                                <td>{kycData.merchant_account_details?.account_number || 'N/A'}</td>
                                <td>{kycData.merchant_account_details?.account_holder_name || 'N/A'}</td>
                                <td>{kycData.merchant_account_details?.accountType || 'N/A'}</td>
                                <td>{kycData.merchant_account_details?.bankName || 'N/A'}</td>
                                <td>{kycData.merchant_account_details?.branch || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* You can add more sections here if needed */}
            </div>
        );
    };

    return (
        <ReportLayout title="Merchant Detail List">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitHandler}
            >
                {(formik) => (
                    <Form>
                        <div className="form-row mt-4">
                            <div className="form-group col-md-12 mb-3">
                                <label className="form-label">Select Search Type</label>
                                <div className="d-flex align-items-center gap-4">
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="searchType"
                                            id="clientCodeRadio"
                                            value="clientCode"
                                            checked={formik.values.searchType === 'clientCode'}
                                            onChange={() => {
                                                setSearchType('clientCode');
                                                formik.setFieldValue('searchType', 'clientCode');
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="clientCodeRadio">
                                            Client Code
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="searchType"
                                            id="dateWiseRadio"
                                            value="dateWise"
                                            checked={formik.values.searchType === 'dateWise'}
                                            onChange={() => {
                                                setSearchType('dateWise');
                                                formik.setFieldValue('searchType', 'dateWise');
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="dateWiseRadio">
                                            Date Wise
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            {searchType === 'clientCode' && (
                                <div className="form-group col-md-3">
                                    <FormikController
                                        control="select"
                                        label="Client Code"
                                        name="clientCode"
                                        className="form-select rounded-0 mt-0"
                                        options={clientCodeOption}
                                    />
                                </div>
                            )}

                            {searchType === 'dateWise' && (
                                <>
                                    <div className="form-group col-md-3">
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
                                            tooltipText="Onboarded Date"
                                        />
                                    </div>
                                    <div className="form-group col-md-3">
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
                                            tooltipText="Onboarded Date"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="form-row">
                            <div className="form-group col-lg-1">
                                <button
                                    disabled={reportLoading}
                                    className="btn cob-btn-primary text-white btn-sm"
                                    type="submit"
                                >Search
                                </button>
                            </div>
                            {merhcantDetailsList?.count > 0 && (
                                <div className="form-group col-lg-1">
                                    <button
                                        className="btn btn-sm text-white cob-btn-primary"
                                        type="button"
                                        onClick={() => {
                                            exportToExcelFn(formik.values);
                                        }}
                                    >
                                        <i className="fa fa-download"></i> Export
                                    </button>
                                </div>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
            <hr className="hr" />
            {merhcantDetailsList?.count > 0 && (
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
                            className="form-select"
                            onChange={(e) => countPageHandler(parseInt(e.target.value))}
                        >
                            <DropDownCountPerPage datalength={merhcantDetailsList?.count} />
                        </select>
                    </div>
                </div>
            )}
            <section className="">
                <div className="scroll overflow-auto">
                    {!reportLoading && merhcantDetailsList?.count > 0 && (
                        <>
                            <h6>Total Count : {merhcantDetailsList?.count}</h6>
                            <Table
                                row={tableRow}
                                data={showData}
                                dataCount={merhcantDetailsList?.count}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                changeCurrentPage={changeCurrentPage}
                            />
                        </>
                    )}
                </div>
                {reportLoading && <SkeletonTable />}
                {merhcantDetailsList?.count === 0 && !reportLoading && (
                    <h6 className="text-center ">No Data Found</h6>
                )}
            </section>

            <CustomModal
                headerTitle={"KYC Details"}
                modalBody={modalBody}
                modalToggle={modalToggle}
                fnSetModalToggle={() => setModalToggle(false)}
            />
        </ReportLayout>
    );
}

export default MerchantDetailList;