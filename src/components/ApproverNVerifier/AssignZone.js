
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API_URL from "../../config";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import ViewZoneModal from "./ViewZoneModal";
import moment from "moment";

import NavBar from "../../components/dashboard/NavBar/NavBar"

function AssignZone() {
  const [approveMerchant, setApproveMerchant] = useState([]);
  const [data, setData] = useState([]);
  const [assignZone, setAssignzone] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [spinner, setSpinner] = useState(true);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
 
  const [modalDisplayData, setModalDisplayData] = useState({});
  const [openZoneModal, setOpenModal] = useState(false)
  let page_size = pageSize;
  let page = currentPage;

  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };


  useEffect(() => {
   
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Data Loaded");
        setSpinner(false);

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
  ////////////////////////////////////pagination start here

  // const allApprovedMerchants = async () => {
  //   await axiosInstanceAuth.get(`${API_URL.KYC_FOR_APPROVED}`).then((res) => {
  //     const data = res?.data?.results;
  //     // console.log(data)
  //     setApprovedMerchantData(data);
  //     const dataCoun = res?.data?.count;
  //     setDataCount(dataCoun);
  //   });
  // };

  // useEffect(() => {
  //   allApprovedMerchants();
  //   dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
  //     .then((resp) => {
  //       toastConfig.successToast("Approved Data Loaded");
  //       setSpinner(false);
  //       const data = resp?.payload?.results;
  //       setApproveMerchant(data);
  //     })
  //     .catch((err) => toastConfig.errorToast("Data not loaded"));
  // }, [currentPage, pageSize]);

  /////////////////////////////////////Search filter
  // useEffect(() => {
  //   if (searchText.length > 0) {
  //     setApproveMerchant(
  //       approveMerchant?.filter((item) =>
  //         Object.values(item)
  //           .join(" ")
  //           .toLowerCase()
  //           .includes(searchText.toLocaleLowerCase())
  //       )
  //     );
  //   } else {
  //     dispatch(kycForApproved({ page, page_size })).then((resp) => {
  //       const data = resp?.payload?.results;

  //       setApproveMerchant(data);
  //     });
  //   }
  // }, [searchText]);


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
            <h1 className="m-b-sm gx-float-left">Assign Zone</h1>


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
              <div> { openZoneModal === true ? <ViewZoneModal userData={modalDisplayData} /> : <></> }</div> 
            </div>
            <div className="col-lg-4 mrg-btm- bgcolor">
              <label>Count Per Page</label>
              <select
                value={pageSize}
                rel={pageSize}
                onChange={(e) => setPageSize(parseInt(e.target.value))}
                className="ant-input"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
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
                      <th>S. No.</th>
                      <th>Client Code</th>
                      <th>Merchant Name</th>
                      <th> Email</th>
                      <th>Contact Number</th>
                      <th>KYC Status</th>
                      <th>Registered Date</th>
                      <th>Onboard Type</th>
                      <th>View Zone</th>
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
                          <td> {covertDate(user.signUpDate)}</td>
                          <td>{user?.isDirect}</td>
                          {/* <td>  <button type="button" class="btn btn-primary" onClick={onClick}>View Document</button></td> */}
                          <td>
                            <button type="submit" onClick={()=>{setModalDisplayData(user)
                            setOpenModal((true))
                            }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                              Update Zone
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

            <li class="page-item">
              <button
                class="page-link"
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

export default AssignZone;