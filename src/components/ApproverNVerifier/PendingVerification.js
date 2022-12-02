import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { kycForPending } from "../../slices/kycSlice";
import API_URL from "../../config";
// import axios from "axios";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import { Link, useRouteMatch } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";

function PendingVerification() {
  const { url } = useRouteMatch();
  const roles = roleBasedAccess();

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [newRegistrationData, setNewRegistrationData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [kycIdClick, setKycIdClick] = useState(null)
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [isCommentUpdate, setIsCommentUpdate] = useState(false);



  let page_size = pageSize;
  let page = currentPage;

  // console.log(setPageSize,"wewewewewewewewewewewew")
  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const pendingVerify = () => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Data Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setNewRegistrationData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  };

  // console.log("Viewer",roles)

  //---------------GET Api for KycPending-------------------

  useEffect(() => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Data Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setDataCount(dataCoun);
        setNewRegistrationData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  ///////////Kyc Search filter
  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        newRegistrationData.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(newRegistrationData);
    }
  }, [searchText]);

  const totalPages = Math.ceil(dataCount / pageSize);
  const pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);

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
    if (pageNumbers?.length > 0) {
      let start = 0;
      let end = currentPage + 6;
      if (totalPages > 6) {
        start = currentPage - 1;

        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage;
        }
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      });
      setDisplayPageNumber(pageNumber);
    }
  }, [currentPage, totalPages]);

  // updateFlag={setIsCommentUpdate}
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
        <div>
          <CommentModal commentData={commentId} handleApi={pendingVerify} />
          <KycDetailsModal  kycId={kycIdClick}/>
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
          <select onChange={kycSearch} className="ant-input">
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
                <th>Company Name</th>
                <th>Merchant Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>KYC Status</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                <th>Comments</th>
                <th>Action</th>
                {roles?.verifier === true ? <th>Verify KYC</th> : <></>}
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
                    <td>{user.companyName}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.status}</td>
                    <td>{user.signUpDate}</td>
                    <td>{user?.isDirect}</td>
                    <td>{user?.comments}</td>
                    <td>
                      {roles.verifier === true || roles.approver === true ? (
                        <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          data-toggle="modal"
                          onClick={() => setCommentId(user)}
                          data-target="#exampleModal"
                        >
                          Add Comments
                        </button>
                      ) : (
                        <></>
                      )}
                        {roles.viewer === true ? (
                        <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          onClick={() => setKycIdClick(user?.loginMasterId)}
                          data-toggle="modal"
                          data-target="#kycmodaldetail"
                        >
                          View
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>

                    {roles.verifier === true ? (
                      <td>
                        <Link
                          to={`/dashboard/kyc/?kycid=${user?.loginMasterId}`}
                          className="btn approve text-white  btn-xs"
                          data-toggle="modal"
                          data-target="#exampleModalCenter"
                        >
                          Verify KYC
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

export default PendingVerification;
