
import React, { useEffect, useReducer, useState, useRef } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import CustomLoader from "../../../../../_components/loader";
import moment from "moment";
import Table from "../../../../../_components/table_components/table/Table";
import Yup from "../../../../../_components/formik/Yup";
import { DateFormatAlphaNumeric } from "../../../../../utilities/DateConvert";
import { useDispatch } from "react-redux";
import CountPerPageFilter from "../../../../../_components/table_components/filters/CountPerPage"
import toast from "react-hot-toast";
import { getPayMentLink } from '../paylink-solution-slice/paylinkSolutionSlice'
import ActionButtons from "../ActionButtons";
import FilterModal from "../FilterModal";
import SearchBar from "../searchBar/SearchBar";






const TotalLinkGenrated = () => {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [saveData, setSaveData] = useState()
    const [displayList, setDisplayList] = useState([]);
    const [filterData, setFilterData] = useState([])
    const [loadingState, setLoadingState] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [buttonClicked, isButtonClicked] = useState(false);
    const { user } = useSelector((state) => state.auth);
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const { clientCode } = clientMerchantDetailsList[0];
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
    const [showAddPayerModal, setShowAddPayerModal] = useState(false);


    const [copied, setCopied] = useState(false);

    const [disable, setDisable] = useState(false);
    const [dataCount, setDataCount] = useState('')
    const dispatch = useDispatch()
    const dateFilterValue = useSelector(
        (state) => state.dateFilterSliceReducer
    );

    const validationSchema = Yup.object({
        fromDate: Yup.date().required("Required").nullable(),
        toDate: Yup.date()
            .min(Yup.ref("fromDate"), "End date can't be before Start date")
            .required("Required"),
    });

    const handleCopyToClipboard = (link) => {
        if (!link) {
            toast.error("Link not generated");
            return;
        }

        navigator.clipboard.writeText(link);
        setCopied(true);
        toast.success("Copied!");

        setTimeout(() => {
            setCopied(false);
        }, 1000);
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








    const initialState = {
        paylinkData: {
            openModal: false
        }
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'generatePaymentLink':
                return {
                    ...state,
                    paylinkData: action.payload
                }
            case 'reset':
                return {
                    ...state,
                    paylinkData: {}
                }
            default:
                return state
        }
    }

    const [state, reducerDispatch] = useReducer(reducer, initialState)




    const rowData = [
        {
            id: "1",
            name: "S No.",
            selector: (row) => row.serial_number,
            sortable: true,
            width: "80px"
        },
        {
            id: "2",
            name: "Payer Name",
            selector: (row) => row.payer_name,
            sortable: true,
            width: "150px"
        },
        {
            id: "3",
            name: "Mobile No.",
            selector: (row) => row.payer_mobile,
            sortable: true,
            width: "120px"
        },
        {
            id: "5",
            name: "Payer Email",
            selector: (row) => row.payer_email,
            sortable: true,
            width: "200px"
        },
        {
            id: "4",
            name: "Amount",
            selector: (row) => row.total_amount,
            sortable: true,
            width: "90px"
        },

        {
            id: "6",
            name: "Created Date, Time",
            selector: (row) => DateFormatAlphaNumeric(row?.created_on, true),
            sortable: true,
            width: "170px"

        },
        {
            id: "6",
            name: "Purpose",
            selector: (row) => row?.purpose,
            sortable: true,

        },
        {
            id: "8",
            name: "Payment Link",
            selector: (row) => (
                <div id={`link_${row.id}`} className="d-flex align-items-center">
                    <span
                        className="input-group-text"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleCopyToClipboard(row?.link)}
                        data-tip={copied ? "Copied!" : "Copy"}
                        data-for={`tooltip-${row.id}`}
                    >
                        <i className="fa fa-copy ml-2 text-primary align-middle"></i>
                    </span>
                </div>
            )
        },

    ];



    const loadData = async (data) => {
        setLoadingState(true)

        const postData = {
            client_code: clientCode,
            start_date: dateFilterValue?.fromDate,
            end_date: dateFilterValue?.toDate,
            order_by: "-id",
            page: currentPage,
            page_size: pageSize
        };

        if (data?.clearSearchState !== true) {
            if (searchTerm !== "") {
                postData["search"] = searchTerm
            }
        }

        dispatch(getPayMentLink(postData))
            .then((resp) => {
                setData(resp?.payload?.results)
                setDataCount(resp?.payload?.count)
                setFilterData(resp?.payload?.results)
                setLoadingState(false)
            })
            .catch((error) => {
                setLoadingState(false);
            });

    };

    useEffect(() => {
        loadData();
        // getDrop();
        // setEditModalToggle(false)
    }, [pageSize, currentPage]);





    const handleSubmit = async (values) => {

        setLoadingState(true);
        setData([]);
        setDisplayList([]);




        const postData = {
            client_code: clientCode,
            start_date: values?.fromDate || dateFilterValue?.fromDate,
            end_date: values?.toDate || dateFilterValue?.toDate,
            order_by: "-id",
            page: searchTerm ? "1" : currentPage,
            page_size: pageSize
        }

        if (searchTerm !== "") {
            postData["search"] = searchTerm
        }
        setSaveData(values);

        setLoadingState(true)
        dispatch(getPayMentLink(postData))
            .then((resp) => {
                // setPayerData(resp?.payload?.results)
                setData(resp?.payload?.results)
                setDataCount(resp?.payload?.count)
                setFilterData(resp?.payload?.results)
                isButtonClicked(true)

                setLoadingState(false);
                // setDisable(false)

            })
            .catch((error) => {
                setLoadingState(false);
                // setDisable(false)

            });
    };












    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };



    return (
        <section >
            <div className="container-fluid p-0">
                <ActionButtons filterRef={filterRef} setShowFilter={setShowFilter} showFilter={showFilter} setShowCreatePaymentModal={setShowCreatePaymentModal} showCreatePaymentModal={showCreatePaymentModal} setShowAddPayerModal={setShowAddPayerModal} showAddPayerModal={showAddPayerModal} onBackClick={() => window.history.back()}
                    showBackLink={true} />
                <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} onApply={handleSubmit} />
            </div>

            <section className="">
                <div className="container-fluid mt-3 p-0">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <h6 className="mb-0">Total Links Generated</h6>
                                </div>
                                {filterData?.length !== 0 && (
                                    <div className="col-md-6 d-flex justify-content-end gap-3 ">
                                        <div className="d-flex align-items-center mt-4">
                                            <SearchBar
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                onSearch={handleSubmit}
                                                placeholder="Name, Email, Mobile"
                                                loadData={loadData}

                                            />
                                        </div>
                                        <CountPerPageFilter
                                            pageSize={pageSize}
                                            dataCount={dataCount}
                                            currentPage={currentPage}
                                            changePageSize={changePageSize}
                                            changeCurrentPage={changeCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="card-body">
                                <div className="scroll overflow-auto">
                                    {/* {!loadingState && data?.length === 0 && (
                                        <h5 className="text-center font-weight-bold mt-5">No Data Found</h5>
                                    )} */}
                                    {!loadingState && (
                                        <Table
                                            row={rowData}
                                            data={data}
                                            dataCount={dataCount}
                                            pageSize={pageSize}
                                            currentPage={currentPage}
                                            changeCurrentPage={changeCurrentPage}
                                        />
                                    )}
                                </div>
                                <CustomLoader loadingState={loadingState} />
                            </div>

                        </div>
                    </div>

                </div>
            </section>

        </section>
    );
};

export default TotalLinkGenrated;
