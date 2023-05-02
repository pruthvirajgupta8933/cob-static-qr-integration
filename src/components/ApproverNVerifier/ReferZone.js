/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import ViewReferZoneModal from "../ApproverNVerifier/ViewReferZoneModal";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import CustomLoader from "../../_components/loader";

const ReferZone = () => {
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }
  const ReferZoneData = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "86px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
      width: "130px",
    },
    {
      id: "3",
      name: "Merchant Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="removeWhiteSpace">
          {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
        </div>
      ),
      width: "150px",
    },
    {
      id: "4",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "5",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "6",
      name: "Sourcing Point",
      selector: (row) => row.sourcing_point,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.sourcing_point}</div>
      ),
    },
    {
      id: "7",
      name: "Sourcing Code",
      selector: (row) => row.sourcing_code,
      cell: (row) => (
        <div className="removeWhiteSpace">{row?.sourcing_code}</div>
      ),
      width: "150px",
    },
    {
      id: "8",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "9",
      name: "Registered Date",
      selector: (row) => row.signUpDate,
      sortable: true,
      cell: (row) => <div>{covertDate(row.signUpDate)}</div>,
      width: "150px",
    },
    {
      id: "10",
      name: "Onboard Type",
      selector: (row) => row.isDirect,
    },
    {
      id: "11",
      name: "Add Sourcing Partner",
      cell: (row) => (
        <button
          type="submit"
          onClick={() => {
            setModalDisplayData(row);
            setOpenModal(true);
          }}
          className="approve btnbackground text-white"
          data-toggle="modal"
          data-target="#exampleModalCenter"
        >
          Update
        </button>
      ),
    },
  ];
  const rowData = ReferZoneData;
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const dispatch = useDispatch();

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  const refreshAfterRefer = () => {
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

      .catch((err) => {});
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

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
    return date;
  };

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

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">
              Provision of Sourcing Partner
            </h1>
          </div>
          <div className="container-fluid flleft">
            <div className="col-lg-3 mrg-btm- bgcolor">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
              />
              <div>
                {" "}
                {openZoneModal === true ? (
                  <ViewReferZoneModal
                    userData={modalDisplayData}
                    setOpenModal={setOpenModal}
                    refreshAfterRefer={refreshAfterRefer}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-lg-3 mrg-btm- bgcolor">
              <CountPerPageFilter
                pageSize={pageSize}
                dataCount={dataCount}
                changePageSize={changePageSize}
              />
            </div>

            <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
              <div className="scroll overflow-auto">
                {!loadingState && data?.length !== 0 && (
                  <Table
                    row={ReferZoneData}
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
                <h2 className="text-center font-weight-bold">No Data Found</h2>
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
export default ReferZone;
