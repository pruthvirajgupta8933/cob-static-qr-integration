/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import ViewZoneModal from "./ViewZoneModal";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import Table from "../../_components/table_components/table/Table";
import CustomLoader from "../../_components/loader";
import DateFormatter from "../../utilities/DateConvert";

function AssignZone() {
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

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
      .then((resp) => {
        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setAssignzone(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  const searchByText = (text) => {
    setData(
      assignZone?.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(searchText?.toLocaleLowerCase())
      )
    );
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
      cell: (row) =>DateFormatter(row.signUpDate),
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
            className="save-next-btn approve text-white   cob-btn-primary btn-sm "
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
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="">Configuration</h5>
          </div>

          <div className="row mt-5">

            <div className="col-lg-3">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
                searchTextByApiCall={true}
              />
            </div>
            <div className="col-lg-3">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={dataCount}
                changePageSize={changePageSize}
              />
            </div>
            <div className="col-lg-3">
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
            {data?.length === 0 && !loadingState && (
              <h2 className="text-center font-weight-bold">No Data Found</h2>
            )}
          </div>
        </div>
        <div>
          {openZoneModal === true && (
            <ViewZoneModal userData={modalDisplayData} />
          )}
        </div>
      </main>
    </section>
  );
}

export default AssignZone;
