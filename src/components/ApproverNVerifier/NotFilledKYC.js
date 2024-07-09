/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForNotFilled } from "../../slices/kycSlice";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import { NotFilledKYCData } from "../../utilities/tableData";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import SkeletonTable from "../../_components/table_components/table/skeleton-table";

const rowData = NotFilledKYCData;
const NotFilledKYC = () => {
  const loadingState = useSelector((state) => state.kyc.isLoading);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  const [onboardType, setOnboardType] = useState("")
  const dispatch = useDispatch();
  const { results: notFilledKycData, count: dataCount } = useSelector(
    (state) => state.kyc.notFilledUserList

  );
  const [notFilledData, setNotFilledData] = useState(notFilledKycData);
  const [data, setData] = useState(notFilledKycData);


  const kycSearch = (e, fieldType) => {
    if (fieldType === "text") {
      setSearchByDropDown(false)
      setSearchText(e);
    }
    if (fieldType === "dropdown") {
      setSearchByDropDown(true)
      setOnboardType(e)
    }


  };

  const mappedData = useMemo(() => {
    return notFilledKycData?.map((item) => {
      return {
        sno: item.sno,
        name: item.name,
        clientCode: item.clientCode,
        emailId: item.emailId,
        contactNumber: item.contactNumber,
        status: item.status,
        signUpDate: item.signUpDate,
        isDirect: item.isDirect,
        zoneName: item.zoneName
      };
    });
  }, [notFilledKycData]);


  const searchByText = () => {


    const filterData = setData(
      notFilledData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
    setNotFilledData(filterData)
  };



  const fetchData = useCallback((startingSerialNumber) => {
    dispatch(
      kycForNotFilled({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Not-Filled",
        isDirect: onboardType
      })
    );
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);




  useEffect(() => {
    fetchData();
  }, [fetchData]);
  //function for change current page
  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };
  //function for change page size
  const changePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  //options for search dropdown filter
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



  return (
    <div className="container-fluid flleft">
      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
            searchByText={searchByText}
            searchTextByApiCall={true}
            setSearchByDropDown={setSearchByDropDown}
            searchData={notFilledData}
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
            notFilledData={notFilledData}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>

        <div className="">
          {!loadingState &&
            <MerchnatListExportToxl
              URL={`export-excel/?search=Not-Filled&isDirect=${onboardType}`}
              filename={"Not-Filled-KYC"}
            />
          }
        </div>
      </div>

      <div>

        <div className="scroll overflow-auto">
          <h6>Total Count : {dataCount}</h6>
          {!loadingState && data?.length !== 0 && (
            <Table
              row={rowData}
              dataCount={dataCount}
              pageSize={pageSize}
              currentPage={currentPage}
              changeCurrentPage={changeCurrentPage}
              data={mappedData}
            />
          )}
        </div>

        {loadingState &&
          <SkeletonTable />
        }
        {data?.length == 0 && !loadingState && (
          <h6 className="text-center">No data Found</h6>
        )}
      </div>
    </div>
  );
};

export default NotFilledKYC;
