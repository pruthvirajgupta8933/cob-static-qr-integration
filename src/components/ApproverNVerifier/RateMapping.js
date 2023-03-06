/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch ,useSelector} from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import moment from "moment";
import SearchFilter from "../../_components/table_components/filters/SearchFilter";
import Paginataion from "../../_components/table_components/pagination/Pagination";
import Table from "../../_components/table_components/table/Table";
import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage";
import NavBar from "../../components/dashboard/NavBar/NavBar"
import ViewRateMapping from "./ViewRateMapping";
import { AssignZoneData } from "../../utilities/tableData";
import Spinner from "./Spinner";

function RateMapping() {
  const rowData = AssignZoneData;
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [openZoneModal, setOpenModal] = useState(false)
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [isSearchByDropDown, setSearchByDropDown] = useState(false);

 
  const loadingState = useSelector((state) => state.kyc.isLoadingForApproved);

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };


  useEffect(() => {
   
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
         const data = resp?.payload?.results;
      //  resp?.payload?.results!==null ?  toastConfig.errorToast("No data Found") : <></>
        const dataCoun = resp?.payload?.count;
        setAssignzone(data);
        setDataCount(dataCoun);
        setData(data);
        
      })

      .catch((err) => {
        
      });
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
  const colData = () => {
    return (
      <>
        {data == [] ? (
          <td colSpan={"11"}>
            {" "}
            <div className="nodatafound text-center">No data found </div>
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
            <td>{covertDate(user.signUpDate)}</td>
            <td>{user?.isDirect}</td>
            {/* <td>  <button type="button" className="btn btn-primary" onClick={onClick}>View Document</button></td> */}
            <td>
              <button type="submit" onClick={()=>{setModalDisplayData(user)
               setOpenModal((true))}} className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                Rate Map
              </button>
            </td>
          </tr>
         
          ))
        )}
      </>
    );
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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
      return date
    }

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
            <div className="col-lg-4 mrg-btm- bgcolor">
            <SearchFilter
                kycSearch={kycSearch}
                searchText={searchText}
                searchByText={searchByText}
                setSearchByDropDown={setSearchByDropDown}
              />
              <div>{ openZoneModal === true ? <ViewRateMapping userData={modalDisplayData} /> : <></> }</div>
            </div>
            <div className="col-lg-4 mrg-btm- bgcolor">
              <label>Count Per Page</label>
              <select
                value={pageSize}
                rel={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="ant-input"
              >
              <DropDownCountPerPage datalength={data.length} />
              </select>
            </div>
            <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Onboard Type</label>
          <select
           onChange={approvedSearch}
            className="ant-input"
          >
             <option value="Select Role Type">Select Onboard Type</option>
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
           
          </select>
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
  )
}

export default RateMapping;