/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect,useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import ViewRateMapping from "./ViewRateMapping";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";

function RateMapping() {
  const dispatch = useDispatch();

  const approvedMerchantList = useSelector(
    (state) => state.kyc.kycApprovedList
  );

  const [data, setData] = useState([]);
  const [rateMappingList, setRateMappingList] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [openZoneModal, setOpenModal] = useState(false);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  useEffect(() => {
    const approvedList=approvedMerchantList?.results
    const dataCount=approvedMerchantList?.count

    if (approvedList) {
      setData(approvedList);
      setRateMappingList(approvedList);
    
      setDataCount(dataCount)
    }
  }, [approvedMerchantList]); //





  useEffect(() => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Approved",
      })
    )
     
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        rateMappingList.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(rateMappingList);
    }
  }, [searchText]);



  // const searchByText = (text) => {
  //   setData(
  //     rateMappingList?.filter((item) =>
  //       Object.values(item)
  //         .join(" ")
  //         .toLowerCase()
  //         .includes(searchText?.toLocaleLowerCase())
  //     )
  //   );
  // };

  const filteredData = useMemo(() => {
    return rateMappingList?.filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchText?.toLocaleLowerCase())
    );
  }, [rateMappingList, searchText]);

  

  const searchByText = () => {
    // Set data with the memoized filteredData
    setData(filteredData);
  };

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
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

  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }



  const AssignZoneData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "95px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      width: "130px",
    },
    {
      id: "3",
      name: "Merchant Name",
      selector: (row) => capitalizeFirstLetter(row?.name ? row?.name : "NA"),
      sortable: true,
      width: "200px",
    },
    {
      id: "4",
      name: "Email",
      selector: (row) => row.emailId,
      width: "220px",
    },
    {
      id: "5",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      width: "150px",
    },
    {
      id: "6",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "7",
      name: "Registered Date",
      selector: (row) => row.signUpDate,
      cell: (row) => DateFormatter(row.signUpDate),
      sortable: true,
      width: "150px",
    },
    {
      id: "8",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "9",
      name: "Action",
      cell: (row) => (
        <div >
          <button
            type="submit"
            onClick={() => {
              setModalDisplayData(row);
              setOpenModal(true);
            }}
            className="save-next-btn approve text-white"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Rate Map
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Rate Mapping</h5>
          </div>

          <div className="row mt-5">
            <div className="col-lg-3 mt-2">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
                searchTextByApiCall={true}
              />

            </div>
            <div className="col-lg-3 mt-2">
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
                notFilledData={rateMappingList}
                setData={setData}
                setSearchByDropDown={setSearchByDropDown}
                optionSearchData={optionSearchData}
              />
            </div>
          </div>

          <div className="">
            <div className="scroll overflow-auto">
            <h6>Total Count : {dataCount}</h6>

              {!loadingState && data?.length !== 0 && (
                <Table
                  row={AssignZoneData}
                  data={data}
                  dataCount={dataCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  changeCurrentPage={changeCurrentPage}
                />
              )}
            </div>
            <CustomLoader loadingState={loadingState} />
            {data?.length == 0 && !loadingState && (
              <h6 className="text-center font-weight-bold">No Data Found</h6>
            )}
          </div>
        </div>
        <div>
          {openZoneModal === true ? (
            <ViewRateMapping userData={modalDisplayData} />
          ) : (
            <></>
          )}
        </div>
      </main>
    </section>
  );
}

export default RateMapping;
