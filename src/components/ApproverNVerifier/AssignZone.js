/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import ViewZoneModal from "./ViewZoneModal";
import moment from "moment";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import Table from "../../_components/table_components/table/Table";
import { AssignZoneData } from "../../utilities/tableData";
import Spinner from "./Spinner";
import NavBar from "../../components/dashboard/NavBar/NavBar";

function AssignZone() {
  const rowData = AssignZoneData;
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false);
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };

  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };

  useEffect(() => {
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
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

  //Map the table data
  const colData = () => {
    return (
      <>
        {data == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No Data Found </div>
          </td>
        ) : (
          data?.map((user, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{user.clientCode}</td>
              <td>{user.name}</td>
              <td>{user.emailId}</td>
              <td>{user.contactNumber}</td>
              <td>{user.status}</td>
              <td> {covertDate(user.signUpDate)}</td>
              <td>{user?.isDirect}</td>
              {/* <td>  <button type="button" className="btn btn-primary" onClick={onClick}>View Document</button></td> */}
              <td>
                <button
                  type="submit"
                  onClick={() => {
                    setModalDisplayData(user);
                    setOpenModal(true);
                  }}
                  className="btn btnbackground text-white"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                >
                  Update Zone
                </button>
              </td>
            </tr>
          ))
        )}
      </>
    );
  };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
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
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Assign Zone</h1>
          </div>
          <div className="container-fluid flleft">
            <div className="col-lg-4 mrg-btm- bgcolor">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
              />
              <div>
                {" "}
                {openZoneModal === true ? (
                  <ViewZoneModal userData={modalDisplayData} />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-lg-4 mrg-btm- bgcolor">
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
                notFilledData={assignZone}
                setData={setData}
                setSearchByDropDown={setSearchByDropDown}
                optionSearchData={optionSearchData}
              />
            </div>
            <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
              <div className="scroll overflow-auto">
                {loadingState ? (
                  <p className="text-center spinner-roll">{<Spinner />}</p>
                ) : (
                  <Table row={rowData} col={colData} />
                )}
              </div>
              <nav>
                <Paginataion
                  dataCount={dataCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  changeCurrentPage={changeCurrentPage}
                />
              </nav>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default AssignZone;
