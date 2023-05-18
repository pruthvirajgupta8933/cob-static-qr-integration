/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import moment from "moment";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import NavBar from "../../components/dashboard/NavBar/NavBar";
import ViewRateMapping from "./ViewRateMapping";
import SearchbyDropDown from "../../_components/table_components/filters/Searchbydropdown";
import CustomLoader from "../../_components/loader";

function RateMapping() {
  const dispatch = useDispatch();
const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
 
  const [openZoneModal, setOpenModal] = useState(false);
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

 

  useEffect(() => {
    dispatch(
      kycForApproved({
        page: currentPage,
        page_size: pageSize,
        searchquery: searchText,
        merchantStatus: "Approved",
      })
    )
      .then((resp) => {
        const data = resp?.payload?.results;
        //  resp?.payload?.results!==null ?  toastConfig.errorToast("No data Found") : <></>
        const dataCoun = resp?.payload?.count;
        setAssignzone(data);
        setDataCount(dataCoun);
        setData(data);
      })

      .catch((err) => {});
  }, [currentPage, pageSize]);

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        assignZone.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(assignZone);
    }
  }, [searchText]);

  //Map the table data
  // const colData = () => {
  //   return (
  //     <>
  //       {data == [] ? (
  //         <td colSpan={"11"}>
  //           {" "}
  //           <div className="nodatafound text-center">No data found </div>
  //         </td>
  //       ) : (
  //         data?.map((user, i) => (
  //           <tr key={i}>
  //             <td>{i + 1}</td>
  //             <td>{user.clientCode}</td>
  //             <td>{user.name}</td>
  //             <td>{user.emailId}</td>
  //             <td>{user.contactNumber}</td>
  //             <td>{user.status}</td>
  //             <td>{covertDate(user.signUpDate)}</td>
  //             <td>{user?.isDirect}</td>
  //             {/* <td>  <button type="button" className="btn btn-primary" onClick={onClick}>View Document</button></td> */}
  //             <td>
  //               <button
  //                 type="submit"
  //                 onClick={() => {
  //                   setModalDisplayData(user);
  //                   setOpenModal(true);
  //                 }}
  //                 className="btn btn-primary"
  //                 data-toggle="modal"
  //                 data-target="#exampleModalCenter"
  //               >
  //                 Rate Map
  //               </button>
  //             </td>
  //           </tr>
  //         ))
  //       )}
  //     </>
  //   );
  // };

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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
    return date;
  };

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
      cell: (row) => covertDate(row.signUpDate),
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
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Rate Mapping</h1>
          </div>
          <div className="container-fluid flleft">
            <div className="col-lg-3 mt-2">
              <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
                searchTextByApiCall={true}
              />
              <div>
                {openZoneModal === true ? (
                  <ViewRateMapping userData={modalDisplayData} />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="col-lg-3 mt-2">
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
                <h2 className="text-center font-weight-bold">No Data Found</h2>
              )}
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default RateMapping;
