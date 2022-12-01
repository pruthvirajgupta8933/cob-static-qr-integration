import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
import API_URL from "../../config";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { Link } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import CommentModal from "./Onboarderchant/CommentModal";

function VerifiedMerchant() {
  const [data, setData] = useState([]);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [commentId, setCommentId] = useState({});

  let page_size = pageSize;
  let page = currentPage;
  const roles = roleBasedAccess();

  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };


  const verifyMerchant = () => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
    .then((resp) => {
      toastConfig.successToast("Data Loaded");
      setSpinner(false);

      const data = resp?.payload?.results;
      const dataCoun = resp?.payload?.count;
      setData(data);
       setDataCount(dataCoun);
       setVerifiedMerchant(data);
    })

    .catch((err) => {
      toastConfig.errorToast("Data not loaded");
    });

  }


  useEffect(() => {
   
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Data Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
         setDataCount(dataCoun);
         setVerifiedMerchant(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        verfiedMerchant.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(verfiedMerchant);
    }
  }, [searchText]);
  const indexOfLastRecord = currentPage * pageSize;


  const totalPages = Math.ceil(dataCount / pageSize);  
  const pageNumbers = [...Array(Math.max(0,totalPages + 1)).keys()].slice(1);

  const indexOfFirstRecord = indexOfLastRecord - pageSize;

  const nextPage = () => {
    if (currentPage < pageNumbers.length) {
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
    
      <div className="col-lg-4 mrg-btm- bgcolor">

        <label>Search</label>
        <input
          className="form-control"
          onChange={kycSearch}
          type="text"
          placeholder="Search Here"
        />
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
         onChange={kycSearch}
         
          className="ant-input"
        >
          <option value="Select Role Type">Select Onboard Type</option>
          <option value="">All</option>
          <option value="online">Online</option>
            <option value="offline">Offline</option>

        </select>
      </div>
      <div><CommentModal  commentData={commentId} handleForVerified={verifyMerchant}/></div>
      <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Client Code</th>
                <th>Company Name</th>
                <th>Merchant Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>KYC Status</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                <th>Comments</th>
                <th>Action</th>
                {roles.approver === true ? <th>Approve KYC</th> : <></>}
              
              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
              {data?.length === 0 ? (
                <tr>
                  {" "}
                  <td colSpan={"9"}>
                    <h1 className="nodatafound">No data found</h1>
                  </td>
                </tr>
              ) : (
                data?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.clientCode}</td>
                    <td>{user.companyName}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.status}</td>
                    <td>{user.signUpDate}</td>
                    <td>{user?.isDirect}</td>
                    <td>{user?.comments}</td>
                    <td>
                    {roles.verifier === true || roles.approver === true ? 
                  <button type="button" className ="btn approve text-white  btn-xs" data-toggle="modal" onClick = {() => setCommentId(user)} data-target="#exampleModal" >
                  Add Comments
                </button> : <></>
                    }
                    </td>
                    {roles.approver === true ? (
                      <td>
                        <Link
                          to={`/dashboard/kyc/?kycid=${user.loginMasterId}`}
                          className="btn approve text-white btn-xs"
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          Approve KYC
                        </Link>
                      </td>
                    ) : (
                      <></>
                    )}
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button className="page-link" onClick={prevPage}>
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
}

export default VerifiedMerchant;
