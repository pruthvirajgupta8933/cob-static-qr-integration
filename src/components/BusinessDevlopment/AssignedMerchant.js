import React, { useEffect, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedMerchantData } from "./businessDevelopmentSlice/BusinessDevelopmentSlice";
import { assignmentTypeApi } from "../../slices/assign-accountmanager-slice/assignAccountMangerSlice";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";
const AssignedMerchant = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const loginId = user?.loginId;
    const roleId = user?.roleId;

    const assigneMerchantList = useSelector(
        (state) => state.merchantAssignedReducer.assignedMerchantList
    );

    const [data, setData] = useState([]);

    const [dataCount, setDataCount] = useState(0);
    const [searchText, setSearchText] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [searchFilterData, setSearchFilterData] = useState([])

    const [pageSize, setPageSize] = useState(10);
    const [isSearchByDropDown, setSearchByDropDown] = useState(false);

    useEffect(() => {
        if (assigneMerchantList?.results) {
            setData(assigneMerchantList.results);
            setDataCount(assigneMerchantList.count || 0);
            setSearchFilterData(assigneMerchantList.results);
        }
    }, [assigneMerchantList]);

    const loadingState = useSelector((state) => state.merchantAssignedReducer.isLoading);

    const kycSearch = (e, fieldType) => {
        fieldType === "text"
            ? setSearchByDropDown(false)
            : setSearchByDropDown(true);
        setSearchText(e);
    };



    const searchByText = (text) => {
        setData(
            searchFilterData?.filter((item) =>
                Object.values(item)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchText?.toLocaleLowerCase())
            )
        );
    };
    useEffect(() => {
        dispatch(assignmentTypeApi()).then((response) => {
            const assignmentTypes = response?.payload?.assignment_type || [];
            const filteredAssignment = assignmentTypes.find(
                (item) => item.role_id === roleId
            );

            if (filteredAssignment) {
                const payload = {
                    assigned_login_id: loginId,
                    assignment_type: filteredAssignment.value,
                    page: currentPage,
                    page_size: pageSize,
                    search_query: searchText,
                };

                dispatch(getAssignedMerchantData(payload));
            }
        });
    }, [dispatch, loginId, roleId, currentPage, pageSize, searchText]);

    const changeCurrentPage = (page) => {
        setCurrentPage(page);
    };

    const changePageSize = (size) => {
        setPageSize(size);
    };

    const AssinedMerchantData = [
        { id: "1", name: "S.No", selector: (row) => row.s_no, sortable: true, width: "95px" },
        { id: "2", name: "Name", selector: (row) => row.login_id?.name, width: "130px" },
        { id: "3", name: "Email", selector: (row) => row.login_id?.email, sortable: true, width: "200px" },
        { id: "4", name: "UserName", selector: (row) => row.login_id?.username, width: "220px" },
        { id: "5", name: "Status", selector: (row) => row.status, width: "150px" },
        { id: "6", name: "Created Date", selector: (row) => DateFormatter(row.login_id?.createdDate) },
        { id: "7", name: "Onboard Type", selector: (row) => row.login_id?.onboard_type },
    ];

    return (
        <section>
            <main>
                <div>
                    <h5>Assigned Merchant</h5>
                    <div className="row mt-5">
                        <div className="form-group col-lg-3 col-md-12 mt-2">
                            <SearchFilter
                                kycSearch={kycSearch}
                                searchText={searchText}
                                // searchByText={filteredData}
                                searchByText={searchByText}
                                setSearchByDropDown={setSearchByDropDown}
                                searchTextByApiCall={true}
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
                    </div>
                    <div>
                        <div className="scroll overflow-auto">
                            <h6>Total Count : {dataCount}</h6>
                            {!loadingState && data.length > 0 && (
                                <Table
                                    row={AssinedMerchantData}
                                    data={data}
                                    dataCount={dataCount}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    changeCurrentPage={changeCurrentPage}
                                />
                            )}
                        </div>
                        {loadingState && <SkeletonTable />}
                        {data.length === 0 && !loadingState && (
                            <h6 className="text-center font-weight-bold">No Data Found</h6>
                        )}
                    </div>
                </div>
            </main>
        </section>
    );
};

export default AssignedMerchant;
