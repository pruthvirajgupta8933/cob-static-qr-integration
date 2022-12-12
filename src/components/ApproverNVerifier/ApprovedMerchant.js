import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import API_URL, { AUTH_TOKEN } from "../../config";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import { kycForApproved } from "../../slices/kycSlice";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";


function ApprovedMerchant() {
  const [approveMerchant, setApproveMerchant] = useState([]);
  const [data, setData] = useState([]);
  const [approvedMerchantData, setApprovedMerchantData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [docImageData, setDocImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [spinner, setSpinner] = useState(true);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  let page_size = pageSize;
  let page = currentPage;


  const approvedSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
   
    dispatch(kycForApproved({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
         setDataCount(dataCoun);
         setApprovedMerchantData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);

  /////////////////////////////////////Search filter

  useEffect(() => {
    if (searchText.length > 0) {
      setData(
        approvedMerchantData.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText?.toLocaleLowerCase())
        )
      );
    } else {
      setData(approvedMerchantData);
    }
  }, [searchText]);


  ////////////////////////////////////////////// pagination code start here
const totalPages = Math.ceil(dataCount / pageSize);
let pageNumbers = []
  if(!Number.isNaN(totalPages)){
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }
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
  ////////////////////////////////////////////// pagination code end here

  const viewDocument = async (loginMaidsterId) => {
    const res = await axiosInstanceAuth
      .post(API_URL.DOCUMENT_BY_LOGINID, {
        login_id: loginMaidsterId,
      })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          setDocImageData(data);
          const docId = data[0].documentId;
          const file = data[0].filePath;
        }
      })
      .catch((error) => {
        console.error("Please try again after sometimes.", error);
      });
  };

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
      return date
    }


 


  return (
    <div className="container-fluid flleft">
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Search</label>
        <input
          className="form-control"
          onChange={approvedSearch}
          type="text"
          placeholder="Search Here"
        />
      </div>
      <div>
          
          <KycDetailsModal kycId={kycIdClick} />
        </div>
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Count Per Page</label>
        <select
          value={pageSize}
          rel={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="ant-input"
        >
          <DropDownCountPerPage datalength={dataCount} />
        </select>
      </div>
      <div className="form-group col-lg-3 col-md-12 mt-2">
        <label>Onboard Type</label>
        <select
          className="ant-input"
          onChange={approvedSearch}
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
                <th>Company Name</th>
                <th>Merchant Name</th>
                <th> Email</th>
                <th>Contact Number</th>
                <th>KYC Status</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                <th>View document</th>
              </tr>
            </thead>
            <tbody>
              {data?.length === 0 ? (
                  <tr>
                  <td colSpan={"11"}>
                    <div className="nodatafound text-center">No data found </div>
                    <br/><br/>
                    <p className="text-center">{spinner && <Spinner />}</p>
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
                    <td>{covertDate(user.signUpDate)}</td>
                    <td>{user?.isDirect}</td>
                    <td>
                      {/* <button
                        type="button"
                        class="btn approve text-white btn-xs"
                        data-toggle="modal"
                        onClick={() => viewDocument(user.loginMasterId)}
                        data-target="#exampleModal"
                      >
                        View Document
                      </button> */}
                      
                      <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          onClick={() => setKycIdClick(user)}
                          data-toggle="modal"
                          data-target="#kycmodaldetail"
                        >
                          View Document
                        </button>

                      <div
                        class="modal fade"
                        id="exampleModal"
                        tabindex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog" role="document">
                          <div class="modal-content" style={{ width: 787 }}>
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">
                                Document Details
                              </h5>
                              <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                              {docImageData?.map((merchantData) => {
                                return (
                                  <div>
                                    <table
                                      id="dtDynamicVerticalScrollExample"
                                      class="table table-striped table-bordered table-sm"
                                    >
                                      <thead>
                                        <tr>
                                          <th>Image</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <td>
                                        <a
                                          href={merchantData?.filePath}
                                          rel="noreferrer"
                                          target="_blank"
                                          alt="Document"
                                          className="text-primary"
                                        >
                                          {merchantData?.name}
                                        </a>
                                      </td>
                                      <td>{merchantData?.status}</td>
                                    </table>
                                  </div>
                                );
                              })}
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn approve text-white btn-xs"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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
                onClick={() => setCurrentPage(pgNumber)}
              >
                <a href={() => false} className={`page-link data_${i}`}>
                  <span >
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

export default ApprovedMerchant;
