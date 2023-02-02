/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import moment from "moment";

import NavBar from "../../components/dashboard/NavBar/NavBar"
import ViewRateMapping from "./ViewRateMapping";

function RateMapping() {
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [openZoneModal, setOpenModal] = useState(false)
 
  const [modalDisplayData, setModalDisplayData] = useState({});

 
  let page_size = pageSize;
  let page = currentPage;

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };


  let setSpinner = true;

  useEffect(() => {
   
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
         const data = resp?.payload?.results;
       resp?.payload?.results ? toastConfig.successToast("data Loaded") : toastConfig.errorToast("No data Found")
        const dataCoun = resp?.payload?.count;
        setDataCount(dataCoun);
        setData(data);
        
        setSpinner(false);

        
         
         setAssignzone(data);
      })

      .catch((err) => {
        
      });
  }, [currentPage, pageSize]);

  ////////////////////////////////////////////////// Search filter start here

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
  

  const totalPages = Math.ceil(dataCount / pageSize);
  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);
  

  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  useEffect(() => {
    let lastSevenPage = totalPages - 7;
    if (pageNumbers?.length>0) {
      let start = 0
      let end = (currentPage + 6)
      if (totalPages > 6) {
        start = (currentPage - 1)
  
        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage
        }
  
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      })   
     setDisplayPageNumber(pageNumber) 
    }
  }, [currentPage, totalPages])
  

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
              <label>Search</label>
              <input
                className="form-control"
                onChange={approvedSearch}
                type="text"
                placeholder="Search Here"
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

                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Serial No.</th>
                      <th>Client Code</th>
                      <th>Merchant Name</th>
                      <th> Email</th>
                      <th>Contact Number</th>
                      <th>KYC Status</th>
                      <th>Registered Date</th>
                      <th>Onboard Type</th>
                      <th>Rate Mapping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.length === 0 ? (
                      <tr>
                        {" "}
                        <td colSpan={"8"}>
                          <h1 className="nodatafound">No data found</h1>
                        </td>
                      </tr>
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
                  </tbody>
                </table>
              </div>
              <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button 
              className="page-link" 
              onClick={prevPage}>
                Previous
              </button>
            </li>
            {displayPageNumber?.map((pgNumber, i) => (
              <li
                key={i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span onClick={() => setCurrentPage(pgNumber)}>
                    {pgNumber}
                  </span>
                </a>
              </li>
            ))}

            <li className="page-item">
              <button
                className="page-link"
                onClick={nextPage}
                disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
            </div>
          </div>
        </div>
      </main>
    </section>
  )
}

export default RateMapping;