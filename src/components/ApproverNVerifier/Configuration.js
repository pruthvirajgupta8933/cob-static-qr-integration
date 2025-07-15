/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import ViewZoneModal from "./ViewZoneModal";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";
import CardLayout from "../../utilities/CardLayout";

function AssignZone() {

  const approvedMerchantList = useSelector(
    (state) => state.kyc.kycApprovedList
  );
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  useEffect(() => {
    const approvedList = approvedMerchantList?.results
    const dataCount = approvedMerchantList?.count

    if (approvedList) {
      setData(approvedList);
      setAssignzone(approvedList);
      setDataCount(dataCount)
    }
  }, [approvedMerchantList]); //

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  useEffect(() => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: "",
        merchantStatus: "Approved",
      })
    )

  }, [currentPage, pageSize]);


  const filteredData = useMemo(() => {
    return assignZone?.filter((item) =>
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchText?.toLocaleLowerCase())
    );
  }, [assignZone, searchText]);



  const searchByText = () => {
    setData(filteredData);
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
      name: "Merchant Configuration",
      cell: (row) => (
        <div >
          <button
            type="button"
            className="approve text-white cob-btn-primary btn-sm "
            onClick={() => {
              setModalDisplayData(row);
              setOpenModal(true);
            }}
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            Configure
          </button>
        </div>
      ),
    },
  ];

  return (
    <CardLayout title="Configuration">

      <div className="row">

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchFilter
            kycSearch={kycSearch}
            searchText={searchText}
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
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <SearchbyDropDown
            kycSearch={kycSearch}
            searchText={searchText}
            isSearchByDropDown={isSearchByDropDown}
            notFilledData={assignZone}
            setData={setData}
            setSearchByDropDown={setSearchByDropDown}
            optionSearchData={optionSearchData}
          />
        </div>

      </div>
      <div className="">
        <div className="scroll overflow-auto">
          {Array.isArray(data) && data.length > 0 && <h6>Total Count: {dataCount}</h6>}

          {!loadingState && (
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
        {/* {data?.length === 0 && !loadingState && (
          <h6 className="text-center font-weight-bold">No Data Found</h6>
        )} */}
      </div>

      <div>
        {openZoneModal === true && (
          <ViewZoneModal userData={modalDisplayData} openZoneModal={openZoneModal}
            setOpenZoneModal={setOpenModal} />
        )}
      </div>

    </CardLayout>
  );
}

export default AssignZone;
