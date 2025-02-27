
import React, { useEffect, useReducer, useState, useRef } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import CustomLoader from "../../../../../_components/loader";
import moment from "moment";
import Table from "../../../../../_components/table_components/table/Table";
import Yup from "../../../../../_components/formik/Yup";
import { dateFormatBasic } from "../../../../../utilities/DateConvert";
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
    const { fromDate, toDate } = useSelector(
        (state) => state.dateFilterSliceReducer
    );

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

    const initialValues = {
        fromDate: splitDate,
        toDate: splitDate,
    };







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
            width: "100px"
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
            name: "Phone No.",
            selector: (row) => row.payer_mobile,
            width: "180px"
        },
        {
            id: "4",
            name: "Amount",
            selector: (row) => row.total_amount,
            width: "200px"
        },
        {
            id: "5",
            name: "Payer Email",
            selector: (row) => row.payer_email,
            sortable: true,
            width: "200px"

        },

        {
            id: "6",
            name: "Created At",
            selector: (row) => dateFormatBasic(row?.created_on),
            sortable: true,

        },
        {
            id: "6",
            name: "Purpose",
            selector: (row) => row?.purpose
            ,
            sortable: true,

        },
        {
            id: "8",
            name: "Payment Link",
            selector: (row) => (
                <div id={`link_${row.id}`} className="d-flex align-items-center">
                    <span className="p-2 d-inline-block cursor_pointer copy_clipboard" title={row?.shorted_url}>
                        {/* {row?.shorted_url} */}
                    </span>
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
            ),
            width: "250px",
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


        // const fromDate = moment(values?.fromDate).format("YYYY-MM-DD");
        // const toDate = moment(values?.toDate).format("YYYY-MM-DD");
        // const dateRangeValid = checkValidation(fromDate, toDate);

        // if (dateRangeValid) {

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

    // }


    const checkValidation = (fromDate, toDate) => {
        let flag = true;

        if (!fromDate || !toDate) {
            alert("Please select both start and end dates.");
            flag = false;
        } else {
            const date1 = new Date(fromDate);
            const date2 = new Date(toDate);

            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let allowedTxnViewDays = 60; // Two months * 31 days per month
            let monthAllowed = 2; // Two months

            if (diffDays < 0 || diffDays > allowedTxnViewDays) {
                flag = false;
                alert(`Please choose a ${monthAllowed}-month date range.`);
                setDisable(false);
            }
        }

        return flag;
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
            setData(filteredData);
        } else {
            setData(filterData);
        }
    };



    const generatePaylinkHandler = () => {
        reducerDispatch({
            type: "generatePaymentLink", payload: {
                ...data,
                openModal: true
            }
        })
    }

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };


    // console.log(state)
    return (
        <section >
            <div className="container-fluid">
                <ActionButtons filterRef={filterRef} setShowFilter={setShowFilter} showFilter={showFilter} setShowCreatePaymentModal={setShowCreatePaymentModal} showCreatePaymentModal={showCreatePaymentModal} setShowAddPayerModal={setShowAddPayerModal} showAddPayerModal={showAddPayerModal} onBackClick={() => window.history.back()}
                    showBackLink={true} />
                <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} onApply={handleSubmit} />
            </div>

            <section className="">
                <div className="container-fluid mt-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="row align-items-center mb-3">
                                <div className="col-md-6">
                                    <h5 className="mb-0">Total Links Generated</h5>
                                </div>
                                {filterData?.length !== 0 && (
                                    <div className="col-md-6 d-flex justify-content-end gap-3 ">
                                        <div className="d-flex align-items-center mt-4">
                                            <SearchBar
                                                searchTerm={searchTerm}
                                                setSearchTerm={setSearchTerm}
                                                onSearch={handleSubmit}
                                                placeholder="Search by Name, Email, Mobile"
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
                                    {!loadingState && data?.length === 0 && (
                                        <h5 className="text-center font-weight-bold mt-5">No Data Found</h5>
                                    )}
                                    {!loadingState && filterData?.length !== 0 && (
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
