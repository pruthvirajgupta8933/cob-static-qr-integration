import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../../_components/table_components/table/Table";
import SkeletonTable from "../../../_components/table_components/table/skeleton-table";
import SearchFilter from "../../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../../_components/table_components/filters/Searchbydropdown";
import CountPerPageFilter from "../../../_components/table_components/filters/CountPerPage";
// import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
const ListLayout = ({
  loadingState,
  data,
  rowData,
  setData,
  dataCount,
  merchantStatus,
  fetchDataCb,
}) => {
  // const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("");
  const dispatch = useDispatch();
  const searchByText = () => {
    // Set data with the memoized filteredData
    setData(filteredData);
  };

  const optionSearchData = [
    {
      name: "Select Onboard Type",
      value: "",
    },
    {
      name: "All",
      value: "",
    },
    {
      name: "Online",
      value: "online",
    },
    {
      name: "Offline",
      value: "offline",
    },
  ];

  const filteredData = useMemo(() => {
    return data?.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(searchText?.toLocaleLowerCase())
    );
  }, [data, searchText]);




  const fetchData = useCallback(
    (startingSerialNumber) => {
      dispatch(
        fetchDataCb({
          page: currentPage,
          page_size: pageSize,
          searchquery: searchText,
          merchantStatus,
          isDirect: onboardType,
        })
      );
    },
    [currentPage, pageSize, searchText, dispatch, onboardType]
  );

  useEffect(() => {
    if (typeof fetchDataCb === "function") fetchData();
  }, [fetchData]);



  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };



  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };

  const kycSearch = (e, fieldType) => {
    if (fieldType === "text") {
      setSearchByDropDown(false);
      setSearchText(e);
    }
    if (fieldType === "dropdown") {
      setSearchByDropDown(true);
      setOnboardType(e);
    }
  };

  return (
    <>
      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            searchTextByApiCall={true}
            setSearchByDropDown={setSearchByDropDown}
            searchData={data}
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

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={data}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>

        <div className="">
          {!loadingState && (
            <MerchnatListExportToxl
              URL={`export-excel/?search=${merchantStatus}&isDirect=${onboardType}`}
              filename={merchantStatus}
            />
          )}
        </div>
      </div>
      <div className="scroll overflow-auto">
        <div>
          <h6>Total Count : {dataCount}</h6>
          {!loadingState && data?.length !== 0 && (
            <Table
              row={rowData}
              dataCount={dataCount}
              pageSize={pageSize}
              currentPage={currentPage}
              changeCurrentPage={changeCurrentPage}
              data={data}
            />
          )}
        </div>

        {loadingState && <SkeletonTable />}
        {data?.length === 0 && !loadingState && (
          <h6 className="text-center">No data Found</h6>
        )}
      </div>
    </>
  );
};
export default ListLayout;
