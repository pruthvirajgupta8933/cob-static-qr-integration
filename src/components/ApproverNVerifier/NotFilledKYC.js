import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForNotFilled } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import Table from "../../_components/table_components/table/Table";
import { NotFilledKYCData } from "../../utilities/tableData";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
// import Pagination from "../../_components/reuseable_components/PaginationForKyc";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CustomLoader from "../../_components/loader/index";

const rowData = NotFilledKYCData;
const NotFilledKYC = () => {
  const [data, setData] = useState([]);
  const [notFilledData, setNotFilledData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  
  const [onboardType, setOnboardType] = useState("")

  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.kyc.isLoading);

  console.log(loadingState,"my loading")

  const kycSearch = (e, fieldType) => {
    if(fieldType === "text"){
      setSearchByDropDown(false)
      setSearchText(e);
    }
    if(fieldType === "dropdown"){
      setSearchByDropDown(true)
      setOnboardType(e)
    }
    
  
  };

  const mappedData = data?.map((item) => {
    return {
      sno: item.sno,
      name: item.name,
      clientCode: item.clientCode,
      emailId: item.emailId,
      contactNumber: item.contactNumber,
      status: item.status,
      signUpDate: item.signUpDate,
      isDirect: item.isDirect,
    };
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchText, dispatch, onboardType]);

  const searchByText = () => {
    setData(
      notFilledData?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
  };

  const fetchData = () => {
    dispatch(
      kycForNotFilled({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Not-Filled",
        isDirect:onboardType
      })
    )
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        const data = resp?.payload?.results;
        const totalData = resp?.payload?.count;
        setDataCount(totalData);
        setNotFilledData(data);
        setData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };
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
        <div className="form-group col-lg-3 col-md-12 mt-2 ml-3">
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
            changePageSize={changePageSize}
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
        <div className="mt-1">
          <MerchnatListExportToxl
            URL={"?order_by=-id&search=Not-Filled"}
            filename={"Not-Filled-KYC"}
          />
        </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
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
        <CustomLoader loadingState={loadingState} />
        {data?.length == 0 && !loadingState && (
          <h2 className="text-center">No data Found</h2>
        )}
      </div>
    </div>
  );
};

export default NotFilledKYC;
