/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import {  useDispatch , useSelector} from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import moment from "moment";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import ViewReferZoneModal from "../ApproverNVerifier/ViewReferZoneModal"
import NavBar from "../../components/dashboard/NavBar/NavBar"
import Table from "../../_components/table_components/table/Table";
import SearchFilter from "../../_components/table_components/filters/SearchFilter"; 
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import { ReferZoneData } from "../../utilities/tableData";
import CustomLoader from "../../_components/loader";

const ReferZone = () => {
  const rowData = ReferZoneData;
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
 const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false)
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);
  

  const dispatch = useDispatch();

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };

  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);



  const refreshAfterRefer = () => {
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
       const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
         setDataCount(dataCoun);
         setAssignzone(data);
      })

      .catch((err) => {
      });
  

  }



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






  const kycSearch = (e, fieldType) => {
    fieldType === "text"
      ? setSearchByDropDown(false)
      : setSearchByDropDown(true);
    setSearchText(e);
  };



  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
      return date
    }

    
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
              <td>{user.sourcing_point}</td>
              <td>{user.sourcing_code}</td>
              <td>{user.status}</td>
              <td> {covertDate(user.signUpDate)}</td>
              <td>{user?.isDirect}</td>
              {/* <td>  <button type="button" className="btn btn-primary" onClick={onClick}>View Document</button></td> */}
              <td>
                <button type="submit" onClick={()=>{setModalDisplayData(user)
                setOpenModal((true))
                }} className="btn btnbackground text-white" data-toggle="modal" data-target="#exampleModalCenter">
                  Refer Merchant
                </button>
              </td>
            </tr>
            ))
          )}
        </>
      );
    };


    return (
    <section className="ant-layout">
      <div>
        <NavBar />
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Provision of Sourcing Partner</h1>


          </div>
          <div className="container-fluid flleft">
            <div className="col-lg-4 mrg-btm- bgcolor">
            <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
              />
              <div> { openZoneModal === true ? <ViewReferZoneModal userData={modalDisplayData} setOpenModal={setOpenModal}  refreshAfterRefer={refreshAfterRefer} /> : <></> }</div> 
            </div>
            <div className="col-lg-4 mrg-btm- bgcolor">
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
                    row={rowData}
                    col={colData}
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
  )
}
export default ReferZone;