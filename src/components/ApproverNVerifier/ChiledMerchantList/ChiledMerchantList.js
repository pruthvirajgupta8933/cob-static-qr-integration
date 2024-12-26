import React, { useState, useEffect, useMemo } from 'react';
import FormikController from '../../../_components/formik/FormikController';
import { Formik, Form } from "formik";
import { getCLientCodeByRoleSlice } from '../../../slices/approver-dashboard/approverDashboardSlice';
import { useDispatch } from "react-redux";
import ReactSelect, { createFilter } from 'react-select';
import { fetchChildDataList } from '../../../slices/approver-dashboard/merchantReferralOnboardSlice';
import Table from '../../../_components/table_components/table/Table';
import CustomLoader from '../../../_components/loader';
import { dateFormatBasic } from '../../../utilities/DateConvert';
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage"
import SearchFilter from '../../../_components/table_components/filters/SearchFilter';

const ChiledMerchantList = () => {
    const [clientCodeByRole, setClientCodeByRole] = useState([]);
    const [data, setData] = useState([])
    const [dataCount, setDataCount] = useState([])
    const [searchFilterData, setSearchFilterData] = useState([])
    const [role, setRole] = useState("");
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loadingState, setLoadingState] = useState(false)
    const dispatch = useDispatch();
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);


    const chiledMerchantListData = [
        {
            id: "1",
            name: "S.No",
            selector: (row) => row.s_no,
            sortable: true,
            width: "95px",
        },
        {
            id: "2",
            name: "Client Code",
            selector: (row) => row.client_code,
            width: "130px",
        },

        {
            id: "3",
            name: "Email",
            selector: (row) => row.email,
            width: "220px",
        },
        {
            id: "4",
            name: "Name",
            selector: (row) => row.name,

        },
        {
            id: "5",
            name: "UserName",
            selector: (row) => row.username,

        },

        {
            id: '5',
            name: "Mobile Number",
            selector: (row) => row.mobileNumber,
        },
        {
            id: '5',
            name: "Registration Date",
            selector: (row) => dateFormatBasic(row.createdDate),

        },
        {
            id: "6",
            name: "Status",
            selector: (row) => row.status,

        },



    ];

    const initialValues = {
        referrer_type: "",
    };

    const filteredData = useMemo(() => {
        return searchFilterData?.filter((item) =>
            Object.values(item)
                .join(' ')
                .toLowerCase()
                .includes(searchText?.toLocaleLowerCase())
        );
    }, [searchFilterData, searchText]);

    const kycSearch = (e, fieldType) => {
        fieldType === "text"
            ? setSearchByDropDown(false)
            : setSearchByDropDown(true);
        setSearchText(e);
    };

    const searchByText = () => {
        if (searchText) {
            const filteredResults = filteredData;
            setData(filteredResults);
        } else {

            setData(searchFilterData);
        }
    };


    const referrerType = [
        { key: "", value: "Select" },
        { key: "bank", value: "Bank" },
        { key: "reseller", value: "Referrer" },
    ];

    useEffect(() => {
        if (role) {
            dispatch(getCLientCodeByRoleSlice({ role }))
                .then(response => {
                    const data = response?.payload?.result || [];
                    const formattedData = data.map((item) => ({
                        value: item.loginMasterId,
                        label: `${item.clientCode} - ${item.name}`
                    }));
                    setClientCodeByRole(formattedData);
                })
                .catch(error => {
                    console.error('Error fetching merchant data:', error);
                });
        }
    }, [role, dispatch]);

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };



    //function for change page size
    const changePageSize = (pageSize) => {
        setPageSize(pageSize);
    };

    useEffect(() => {
        if (selectedClientId) {
            setLoadingState(true);
            dispatch(
                fetchChildDataList({
                    page: currentPage,
                    page_size: pageSize,
                    type: role === "reseller" ? "referrer" : role,
                    login_id: selectedClientId,
                })
            )
                .then((res) => {
                    setData(res.payload.results);
                    setSearchFilterData(res.payload.results);
                    setDataCount(res?.payload?.count);
                })
                .catch((error) => {
                    console.error("Error fetching child data:", error);
                })
                .finally(() => setLoadingState(false));
        }

    }, [currentPage, pageSize, selectedClientId, role, dispatch]);



    const fetchData = (clientId) => {
        setLoadingState(true)
        const postObj = {
            type: role === "reseller" ? "referrer" : role,
            login_id: clientId,
            page_size: pageSize,
            page: currentPage

        };
        dispatch(fetchChildDataList(postObj))
            .then((res) => {
                setData(res.payload.results)
                setDataCount(res?.payload?.count)
                setSearchFilterData(res.payload.results)
                setLoadingState(false)
            })
            .catch(error => {
                console.error('Error fetching child data:', error);
                setLoadingState(false)
            });
    };

    const handleSelectChange = (selectedOption) => {
        const clientId = selectedOption ? selectedOption.value : null;
        setSelectedClientId(clientId);
        if (clientId) {
            fetchData(clientId);
        }
    };

    return (
        <section className="">
            <main className="">
                <div className="">
                    <div className="">
                        <h5 className="">Chiled Merchant List</h5>
                    </div>



                    <div className="container-fluid p-0">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={(values) => {
                                console.log("Form Submitted", values);
                            }}
                            enableReinitialize={true}
                        >
                            {(formik) => (
                                <Form className="mt-5">
                                    <div className="row">
                                        <div className="col-lg-3">
                                            <FormikController
                                                control="select"
                                                label="Onboard Type"
                                                name="referrer_type"
                                                className="form-select"
                                                options={referrerType}
                                                onChange={(e) => {
                                                    const selectedValue = e.target.value;
                                                    formik.setFieldValue("referrer_type", selectedValue);
                                                    setRole(selectedValue);
                                                    setClientCodeByRole([]);
                                                    setSelectedClientId(null);
                                                }}
                                            />
                                        </div>

                                        {role && clientCodeByRole.length > 0 && (
                                            <div className="col-lg-3">
                                                <label className="form-label">{`Select ${role === 'bank' ? 'Bank' : 'Referrer'}`}</label>
                                                <ReactSelect
                                                    className="zindexforDropdown"
                                                    onChange={handleSelectChange}
                                                    value={
                                                        selectedClientId
                                                            ? clientCodeByRole.find(option => option.value === selectedClientId)
                                                            : null
                                                    }
                                                    options={clientCodeByRole}
                                                    placeholder="Select Client Code"
                                                    filterOption={createFilter({ ignoreAccents: false })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>



                </div>
                {data?.length > 0 &&
                    <div className="row mt-5">

                        <div className="form-group col-lg-3 col-md-12 mt-2">
                            <SearchFilter
                                kycSearch={kycSearch}
                                searchText={searchText}
                                searchByText={searchByText}
                                setSearchByDropDown={setSearchByDropDown}
                                searchTextByApiCall={false}
                            />
                        </div>
                        <div className="form-group col-lg-3 col-md-12 mt-2">
                            <CountPerPageFilter
                                pageSize={pageSize}
                                dataCount={dataCount}
                                currentPage={currentPage}
                                changePageSize={changePageSize}
                                changeCurrentPage={changeCurrentPage}
                            />
                        </div>


                    </div>}
                <div className="mt-5">
                    <div className="scroll overflow-auto">
                        {data?.length > 0 && <h6>Total Count : {dataCount}</h6>}
                        {!loadingState && data?.length > 0 && (
                            <Table
                                row={chiledMerchantListData}
                                data={data}
                                dataCount={dataCount}
                                pageSize={pageSize}
                                currentPage={currentPage}
                                changeCurrentPage={changeCurrentPage}
                            />
                        )}
                    </div>
                    <CustomLoader loadingState={loadingState} />
                    {data?.length === 0 && !loadingState && (
                        <h6 className="text-center font-weight-bold">No Data Found</h6>
                    )}
                </div>
            </main>
        </section>
    );
};

export default ChiledMerchantList;
