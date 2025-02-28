
import React, { useState, useRef, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomLoader from "../../../../../_components/loader";
import _ from "lodash";
import Yup from "../../../../../_components/formik/Yup";
import moment from "moment";
import paymentLinkService from "../../../../../services/create-payment-link/paymentLink.service";
import Table from "../../../../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../../../_components/table_components/filters/CountPerPage"
import { useDispatch } from "react-redux";
import ActionButtons from "../ActionButtons";
import FilterModal from "../FilterModal";
import { getTxnData } from '../paylink-solution-slice/paylinkSolutionSlice'
import DateFormatter, { DateFormatAlphaNumeric } from "../../../../../utilities/DateConvert";
import SearchBar from "../searchBar/SearchBar";
import { paymodeColorArr, transactionStatusColorArr } from "../../../../../utilities/colourArr";
import SelectFilter from "../transaction-filter/SelectFilter";
import { axiosInstance } from "../../../../../utilities/axiosInstance";
import API_URL from "../../../../../config";





const RecentTransaction = () => {
    let history = useHistory();
    const dispatch = useDispatch()
    const [editform, setEditForm] = useState({
        myname: "",
        email: "",
        phone: "",
        editCustomerTypeId: "",
        id: "",
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [saveData, setSaveData] = useState()
    const { user } = useSelector((state) => state.auth);
    const [loadingState, setLoadingState] = useState(false)
    const [payerData, setPayerData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [buttonClicked, isButtonClicked] = useState(false);
    const [dataCount, setDataCount] = useState(0)
    const [filterData, setFilterData] = useState([])
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
    const [showAddPayerModal, setShowAddPayerModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [payerName, setPayerName] = useState('');
    const [payerId, setPayerId] = useState('');
    const [paymentModeList, SetPaymentModeList] = useState([]);
    const [paymentStatusList, SetPaymentStatusList] = useState([]);

    const [paymentStatus, setPaymentStatus] = useState("All")
    const [transactionMode, setTransactionMode] = useState("All")

    const { fromDate, toDate } = useSelector(
        (state) => state.dateFilterSliceReducer
    );

    const dateFilterValue = useSelector(
        (state) => state.dateFilterSliceReducer
    );


    const initialState = {
        addPayerModal: false,
        editPayerModal: {
            isEditable: false
        },
        paylinkData: {
            openModal: false
        }
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'addPayer':
                return {
                    ...state,
                    addPayerModal: action.payload
                };
            case 'editPayer':
                return {
                    ...state,
                    addPayerModal: true,
                    editPayerModal: action.payload
                }
            case 'generatePaymentLink':
                return {
                    ...state,
                    paylinkData: action.payload
                }
            case 'reset':
                return {
                    ...state,
                    addPayerModal: false,
                    generatePaylinkModal: false,
                    paylinkData: {}
                }
            default:
                return state
        }
    }

    const deleteUser = (id, name) => {
        setPayerName(name);
        setPayerId(id);
        setShowModal(true);
    };

    const handleDelete = async () => {

        await paymentLinkService.deletePayer({ id: payerId });
        loadData(initialValues);
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
    };



    const rowData = [
        {
            id: "0",
            name: "S No.",
            selector: (row) => row.serial_number,
            sortable: true,
            width: "70px"
        },

        {
            id: "2",
            name: "Payer Name",
            selector: (row) => row.payer_name,
            sortable: true,
            width: "120px"
        },
        {
            id: "2",
            name: "Transaction ID",
            selector: (row) => row.sabpaisa_trans_id,
            sortable: true,
            width: "200px"
        },
        {
            id: "3",
            name: "Mobile No.",
            selector: (row) => row.payer_mobile,
            width: "100px",
            sortable: true

        },
        {
            id: "4",
            name: "Email ID",
            selector: (row) => row.payer_email,
            sortable: true,
            width: "180px"
        },
        {
            id: "41",
            name: "Amount",
            sortable: true,
            selector: (row) => row.trans_amount,
        },

        {
            id: "6",
            name: "Transaction Date",
            selector: (row) => DateFormatAlphaNumeric(row.trans_complete_date),
            sortable: true,
            width: "150px"
        },
        {
            id: "5",
            name: "Payment Mode",
            selector: (row) => row.trans_mode,
            sortable: true,
            width: "120px"
        },
        {
            id: "7",
            name: "Status",
            selector: (row) => (
                <p className="p-1 m-0 rounded-1"
                    style={{
                        backgroundColor: transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.background,
                        color: transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.color,
                        border: `1px ${transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.color} solid`
                    }}>
                    {row.trans_status}

                </p>
            ),
            sortable: true,
        }
    ];

    // console.log(transactionStatusColorArr["ABORTED"])
    const [state, reducerDispatch] = useReducer(reducer, initialState)


    // console.log(state)

    // const validationSchemaa = Yup.object({
    //     fromDate: Yup.date().required("Required").nullable(),
    //     toDate: Yup.date()
    //         .min(Yup.ref("fromDate"), "End date can't be before Start date")
    //         .required("Required"),
    // });

    let now = moment().format("YYYY-M-D");
    let splitDate = now.split("-");
    if (splitDate[1]?.length === 1) {
        splitDate[1] = "0" + splitDate[1];
    }
    if (splitDate[2]?.length === 1) {
        splitDate[2] = "0" + splitDate[2];
    }
    splitDate = splitDate.join("-");
    const initialValues = {
        fromDate: splitDate,
        toDate: splitDate,
    };

    let clientMerchantDetailsList = [];
    let clientCode = "";

    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;

    // console.log("searchTerm", searchTerm)

    const loadData = async (data) => {
        // console.log(1, data)
        setLoadingState(true)

        const postData = {
            start_date: dateFilterValue?.fromDate,
            end_date: dateFilterValue?.toDate,
            page: currentPage,
            page_size: pageSize,
            client_code: clientCode,
            order_by: "-id",
        };
        if (transactionMode !== "All") {
            postData["payment_mode"] = transactionMode
        }

        if (paymentStatus !== "All") {
            postData["status"] = paymentStatus
        }

        if (data?.clearSearchState !== true) {
            if (searchTerm !== "") {
                postData["search"] = searchTerm
            }
        }

        dispatch(getTxnData(postData))
            .then((resp) => {
                setPayerData(resp?.payload?.results)
                setDataCount(resp?.payload?.count)
                setFilterData(resp?.payload?.results)
                setLoadingState(false)
            })
            .catch((error) => {
                setLoadingState(false);
                // setDisable(false)

            });

    };

    useEffect(() => {
        loadData();
        // getDrop();
        // setEditModalToggle(false)
    }, [pageSize, currentPage, paymentStatus, transactionMode]);


    useEffect(() => {
        getPaymentStatusList()
        paymodeList()
    }, [])

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };


    const formSubmit = (values) => {
        // console.log("formsubmit-1", values);
        const postData = {
            start_date: values?.fromDate || dateFilterValue?.fromDate,
            end_date: values?.toDate || dateFilterValue?.toDate,
            page: searchTerm ? "1" : currentPage,
            page_size: pageSize,
            client_code: clientCode,
            order_by: "-id",
        };
        // console.log("f-postData", postData);
        if (searchTerm !== "") {
            postData["search"] = searchTerm
        }
        if (transactionMode !== "All") {
            postData["payment_mode"] = transactionMode
        }

        if (paymentStatus !== "All") {
            postData["status"] = paymentStatus
        }


        // setSaveData(values);
        setLoadingState(true)
        dispatch(getTxnData(postData))
            .then((resp) => {
                setPayerData(resp?.payload?.results)
                setFilterData(resp?.payload?.results)
                setDataCount(resp?.payload?.count)
                isButtonClicked(true)
                setLoadingState(false);
                // setDisable(false)

            })
            .catch((error) => {
                setLoadingState(false);
                // setDisable(false)

            });


    };
    const handleAddPayerButtonClick = () => {
        // getDrop();
        reducerDispatch({ type: "addPayer", payload: true })

    };




    // USE FOR EDIT FORM
    const editHandler = (data) => {
        setShowAddPayerModal(true)

        reducerDispatch({
            type: "editPayer", payload: { ...data, isEditable: true }
        })
    };

    // USE FOR GENERETE LINK
    const generatelink = (data) => {
        setShowCreatePaymentModal(true)

        reducerDispatch({
            type: "generatePaymentLink", payload: {
                ...data,
                openModal: true
            }
        })
    };

    // const deleteUser = async (id) => {
    //     let iscConfirm = window.confirm("Are you sure you want to delete it ?");
    //     if (iscConfirm) {
    //         await paymentLinkService.deletePayer({ id: id })
    //         loadData(initialValues);
    //     }
    // };



    const edit = () => {
        loadData(initialValues);
    };



    const getSearchTerm = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term) {
            const filteredData = filterData.filter((item) =>
                Object.values(item).some((value) =>
                    value?.toString().toLowerCase().includes(term.toLowerCase())
                )
            );
            setPayerData(filteredData);
        } else {
            setPayerData(filterData);
        }
    };



    const getPaymentStatusList = async () => {
        await axiosInstance
            .get(API_URL.GET_PAYMENT_STATUS_LIST)
            .then((res) => {
                SetPaymentStatusList(res.data);
            })
            .catch((err) => { });
    };

    const paymodeList = async () => {
        await axiosInstance
            .get(API_URL.PAY_MODE_LIST)
            .then((res) => {
                SetPaymentModeList(res.data);
            })
            .catch((err) => { });
    };

    const tempPayStatus = [{ key: "All", value: "All" }];

    paymentStatusList.map((item) => {
        if (item !== "CHALLAN_ENQUIRED" && item !== "INITIATED") {
            tempPayStatus.push({ key: item, value: item });
        }
    });

    const tempPaymode = [{ key: "All", value: "All" }];
    paymentModeList.map((item) => {
        tempPaymode.push({ key: item.paymodeId, value: item.paymodeName });
    });



    const getFilterData = (data, filterBy) => {
        if (filterBy === 'payment_status') {
            setPaymentStatus(data)
        }
        if (filterBy === 'transaction_status') {
            setTransactionMode(data)
        }
    }

    return (
        <React.Fragment>
            <section>
                <div className="container-fluid">
                    <ActionButtons
                        filterRef={filterRef}
                        setShowFilter={setShowFilter}
                        showFilter={showFilter}
                        setShowCreatePaymentModal={setShowCreatePaymentModal}
                        setShowAddPayerModal={setShowAddPayerModal}
                        showAddPayerModal={showAddPayerModal}
                        showCreatePaymentModal={showCreatePaymentModal}
                        componentState={state}
                        loadDataFn={edit}
                        onBackClick={() => window.history.back()}
                        showBackLink={true}
                    />
                    <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} onApply={formSubmit} />

                </div>
            </section>

            <section className="mt-3">
                <div className="container-fluid">
                    <div className="card shadow-sm">
                        <div className="px-3 py-3">
                            <div className="row align-items-center">
                                <div className="col-md-4">
                                    <h5 className="mb-0">Recent Transaction</h5>
                                </div>
                                <div className="col-md-8 d-flex justify-content-end">
                                    <div className="me-3 mt-4">
                                        <SearchBar
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            onSearch={formSubmit}
                                            placeholder="Search by Name, Email, Mobile"
                                            loadData={loadData}
                                        />
                                    </div>
                                    <div className="me-3 mt-4">
                                        <SelectFilter
                                            onChange={getFilterData}
                                            options={tempPayStatus}
                                            filterBy={"payment_status"}
                                            value={paymentStatus}
                                        />
                                    </div>
                                    <div className="me-3 mt-4">
                                        <SelectFilter
                                            onChange={getFilterData}
                                            options={tempPaymode}
                                            filterBy={"transaction_status"}
                                            value={transactionMode}
                                        />
                                    </div>

                                    <div className="me-3 mt-4">
                                        <CountPerPageFilter
                                            pageSize={pageSize}
                                            dataCount={dataCount}
                                            currentPage={currentPage}
                                            changePageSize={changePageSize}
                                            changeCurrentPage={changeCurrentPage}
                                            enableLable={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="scroll overflow-auto">
                                {buttonClicked && payerData?.length === 0 && (
                                    <h5 className="text-center font-weight-bold mt-5">No Data Found</h5>
                                )}
                                {!loadingState && filterData?.length !== 0 && (
                                    <Table
                                        row={rowData}
                                        data={payerData}
                                        dataCount={dataCount}
                                        pageSize={pageSize}
                                        currentPage={currentPage}
                                        changeCurrentPage={changeCurrentPage}
                                        fixedHeader={true}
                                        fixedHeaderScrollHeight="400px"

                                    />
                                )}
                            </div>
                            <CustomLoader loadingState={loadingState} />
                        </div>
                    </div>
                </div>
            </section>



        </React.Fragment>

    );
};

export default RecentTransaction;
