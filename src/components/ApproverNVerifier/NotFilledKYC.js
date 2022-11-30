import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { kycForNotFilled } from "../../slices/kycSlice";
import API_URL from "../../config";
import { Link, useRouteMatch } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
// import Pagination from "../../_components/reuseable_components/PaginationForKyc";

const NotFilledKYC = () => {

  const [data, setData] = useState([]);
  // const [response, setResponse] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [notFilledData, setNotFilledData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  // let page_size = pageSize;
  // let page = currentPage;

  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  // const notFilledMerchants = async () => {
  //   await axiosInstanceAuth.get(`${API_URL.KYC_FOR_NOT_FILLED}`).then((res) => {
  //     const data = res?.data?.results;
  //     const dataCoun = res?.data?.count;
  //     setNotFilledData(data);
  //     setDataCount(dataCoun);
  //   });
  // };

  useEffect(() => {
    // notFilledMerchants();
    dispatch(kycForNotFilled({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Data Loaded");
        
        const data = resp?.payload?.results;
        const totalData = resp?.payload?.count;

        setSpinner(false);
        setDataCount(totalData);
        setNotFilledData(data);
        setData(data);
        // console.log("Paginataion Dta ===> ",notFilledData)
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);


  //------- KYC NOT FILLED SEARCH FILTER ------------//
  useEffect(() => {
    console.log("searchText",searchText)
    if (searchText?.length > 0) {
      setData(
        notFilledData?.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      // dispatch(kycForNotFilled({ page, page_size })).then((resp) => {
        // const data = resp?.payload?.results;
        setData(notFilledData);
      // });
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
  

  return (

    <div className="container-fluid flleft">
      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Search</label>
          <input
            className="form-control"
            onChange={kycSearch}
            type="text"
            placeholder="Search Here"
          />
        </div>


        <div className="form-group col-lg-3 col-md-12 mt-2">
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
            className="ant-input"
            onChange={(e)=>setSearchText(e.target.value)}
          >
            <option value="Select Role Type">Select Onboard Type</option>
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>

          </select>
        </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Client Code</th>
                <th>Merchant Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>KYC Status</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>

              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
              {data?.length === 0 ? (
                <tr>
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
                    <td>{user.signUpDate}</td>
                    <td>{user?.isDirect}</td>
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
  );
};

export default NotFilledKYC;
