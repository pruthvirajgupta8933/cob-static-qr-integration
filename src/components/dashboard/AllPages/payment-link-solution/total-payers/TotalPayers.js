
import React, { useState, useRef, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CustomLoader from "../../../../../_components/loader";
import _ from "lodash";
import Yup from "../../../../../_components/formik/Yup";
import moment from "moment";
// import paymentLinkService from "../../../../../services/create-payment-link/paymentLink.service";
import paymentLinkService from "../../../../../components/dashboard/AllPages/payment-link-solution/paylink-service/pamentLinkSolution.service";
import Table from "../../../../../_components/table_components/table/Table";
import CountPerPageFilter from "../../../../../_components/table_components/filters/CountPerPage"
// import { getPayerApi } from "../../../../../slices/paymentLink/paymentLinkSlice";
import { getPayerApi } from "../../../../../components/dashboard/AllPages/payment-link-solution/paylink-solution-slice/paylinkSolutionSlice";
import { useDispatch } from "react-redux";
import ActionButtons from "../ActionButtons";
import FilterModal from "../FilterModal";
import DeleteModal from "./DeleteModal";
import SearchBar from "../searchBar/SearchBar";




const TotalPayers = () => {

    const dispatch = useDispatch()


    const [searchTerm, setSearchTerm] = useState('');
    const [saveData, setSaveData] = useState()
    const { user } = useSelector((state) => state.auth);
    const [loadingState, setLoadingState] = useState(false)
    const [payerData, setPayerData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [buttonClicked, isButtonClicked] = useState(false);
    const [dataCount, setDataCount] = useState('')
    const [filterData, setFilterData] = useState([])
    const [showFilter, setShowFilter] = useState(false);
    const filterRef = useRef(null);
    const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
    const [showAddPayerModal, setShowAddPayerModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [payerName, setPayerName] = useState('');
    const [payerId, setPayerId] = useState('');


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
        loadUser(initialValues);
        setShowModal(false);
    };

    const handleClose = () => {
        setShowModal(false);
    };



    const rowData = [
        {
            id: "2",
            name: "Name of Payer",
            selector: (row) => row.payer_name,
            sortable: true,
            width: "150px"
        },
        {
            id: "3",
            name: "Mobile No.",
            selector: (row) => row.payer_mobile,
            width: "180px"
        },
        {
            id: "4",
            name: "Email ID",
            selector: (row) => row.payer_email,
            width: "200px"
        },
        {
            id: "5",
            name: "Payer Category",
            selector: (row) => row.payer_type_name,
            sortable: true,

        },

        {
            id: "6",
            name: "Create Link",
            cell: (row) => (
                <span style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "16px" }}>
                    <i
                        className="fa fa-link text-primary"
                        onClick={() => generatelink(row)}
                        style={{ fontSize: "20px", marginRight: "8px" }}
                    ></i>
                    <p onClick={() => generatelink(row)} className="text-primary mt-2">Create Link</p>
                </span>
            ),
            width: "150px",
            ignoreRowClick: true,
            allowOverflow: true
        },


        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex">

                    <i
                        className="fa fa-pencil-square-o text-dark"
                        onClick={() => editHandler(row)}
                        style={{ cursor: "pointer", fontSize: "20px", marginRight: "18px" }}
                    ></i>


                    <i
                        className="fa fa-trash cob-btn-danger text-danger"
                        onClick={() => deleteUser(row.id, row.payer_name)}  // Pass payer name to deleteUser
                        style={{ cursor: "pointer", fontSize: "20px" }}  // Increased size
                    ></i>
                </div>
            ),
            width: "140px",
            ignoreRowClick: true,
            allowOverflow: true
        }



    ];


    const [state, reducerDispatch] = useReducer(reducer, initialState)
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



    const loadUser = async (data) => {
        setLoadingState(true)

        const postData = {
            fromDate: moment(saveData?.fromDate).startOf('day').format('YYYY-MM-DD'),
            toDate: moment(saveData?.toDate).startOf('day').format('YYYY-MM-DD'),
            page: currentPage,
            page_size: pageSize,
            client_code: clientCode,
            // search: searchTerm
        };

        dispatch(getPayerApi(postData))
            .then((resp) => {
                setPayerData(resp?.payload?.results)
                setDataCount(resp?.payload?.count)
                setFilterData(resp?.payload?.results)
                setLoadingState(false)
                setShowAddPayerModal(false)


            })
            .catch((error) => {
                setLoadingState(false);
                // setDisable(false)

            });

    };

    useEffect(() => {
        loadUser();
        // getDrop();
        // setEditModalToggle(false)
    }, [pageSize, currentPage]);

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };


    const formSubmit = (values) => {
        const postData = {
            fromDate: moment(values?.fromDate).startOf('day').format('YYYY-MM-DD'),
            toDate: moment(values?.toDate).startOf('day').format('YYYY-MM-DD'),
            page: searchTerm ? "1" : currentPage,
            page_size: pageSize,
            client_code: clientCode,
            search: searchTerm
        };
        setSaveData(values);
        setLoadingState(true)
        dispatch(getPayerApi(postData))
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





    const edit = () => {
        loadUser(initialValues);
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
                        loadUserFn={edit}
                        onBackClick={() => window.history.back()}
                        showBackLink={true}
                    />
                    <FilterModal show={showFilter} onClose={() => setShowFilter(false)} filterRef={filterRef} onApply={formSubmit} />
                    <DeleteModal
                        showModal={showModal}
                        handleClose={handleClose}
                        handleDelete={handleDelete}
                        payerName={payerName}
                    />
                </div>
            </section>

            <section className="mt-3">
                <div className="container-fluid">
                    <div className="card shadow-sm">
                        <div className="px-3 py-3">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    <h5 className="mb-0">Total Payer</h5>
                                </div>
                                <div className="col-md-6 d-flex justify-content-end">

                                    {/* <div className="me-3 mt-4">
                                        <input
                                            className="form-control"
                                            onChange={getSearchTerm}
                                            value={searchTerm}
                                            type="text"
                                            placeholder="Search Here"
                                        />
                                    </div> */}

                                    <div className="me-3 mt-4 d-flex">
                                        {/* <input
                                            className="form-control"
                                            // onChange={handleSearchChange}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            value={searchTerm}
                                            type="text"
                                            placeholder="Search by Name, Email, Mobile"
                                        />
                                        <button className="btn btn-primary ms-2" onClick={formSubmit}>
                                            <i className="fa fa-search"></i>
                                        </button> */}

                                        <SearchBar
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            onSearch={formSubmit}
                                            placeholder="Search by Name, Email, Mobile"
                                            loadUser={loadUser}



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

export default TotalPayers;
