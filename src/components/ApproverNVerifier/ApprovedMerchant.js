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
import MerchnatListExportToxl from "./MerchnatListExportToxl";
import CommentModal from "./Onboarderchant/CommentModal";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";


function ApprovedMerchant() {
  // const [approveMerchant, setApproveMerchant] = useState([]);
  const [data, setData] = useState([]);
  const [approvedMerchantData, setApprovedMerchantData] = useState([]);
  const [dataCount, setDataCount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  // const [docImageData, setDocImageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [spinner, setSpinner] = useState(true);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [isOpenModal, setIsModalOpen] = useState(false)
  const [isLoaded,setIsLoaded] = useState(false)


  let page_size = pageSize;
  let page = currentPage;
  const roles = roleBasedAccess();


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
         setIsLoaded(false)   
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
    setIsLoaded(true) 
    setData([])  
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    setIsLoaded(true)   
    setData([])
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
          // setDocImageData(data);
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
      <div className="form-group col-lg-3 col-md-12 mt-2">
        <label>Search</label>
        <input
          className="form-control"
          onChange={approvedSearch}
          type="text"
          placeholder="Search Here"
        />
      </div>
      <div>

      {openCommentModal === true ? <CommentModal commentData={commentId} isModalOpen={openCommentModal} setModalState={setOpenCommentModal} tabName={"Approved Tab"} /> : <></>}
          
          <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} />
        </div>
      <div className="form-group col-lg-3 col-md-12 mt-2">
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
      <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=approved'} filename={"Approved"} />
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
                <th>View Status</th>
                {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? ( <th>Action</th>) : <></>}
              </tr>
            </thead>
            <tbody>
              {data?.length === 0 ? (
                  <tr>
                  <td colSpan={"11"}>
                    <div className="nodatafound text-center">No data found </div>
                    <br/><br/><br/><br/>
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
                        className="btn approve text-white btn-xs"
                        data-toggle="modal"
                        onClick={() => viewDocument(user.loginMasterId)}
                        data-target="#exampleModal"
                      >
                        View Document
                      </button> */}
                      
                      <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          onClick={() =>  {setKycIdClick(user); setIsModalOpen(true) }}
                          data-toggle="modal"
                          data-target="#kycmodaldetail"
                        >
                          View Status
                        </button>
                        </td>
                        <td>
                    {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? (
                        <button
                        type="button"
                        className="btn approve text-white  btn-xs"
                        data-toggle="modal"
                        onClick={() => {
                          setCommentId(user)
                          setOpenCommentModal(true)
                
                        }}
                        data-target="#exampleModal"
                        disabled={user?.clientCode === null ? true : false}
                      >
                        Add/View Comments
                      </button>
                    ) : <></> }
                    </td>
                     

                      {/* <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content" style={{ width: 787 }}>
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">
                                Document Details
                              </h5>
                              <button
                                type="button"
                               className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              {docImageData?.map((merchantData) => {
                                return (
                                  <div>
                                    <table
                                      id="dtDynamicVerticalScrollExample"
                                     className="table table-striped table-bordered table-sm"
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
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn approve text-white btn-xs"
                                data-dismiss="modal"
                              >
                                Close
                              </button>

                            </div>
                          </div>
                        </div>
                      </div> */}
                  
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
          {isLoaded === true ? <Spinner /> : (
            <li className="page-item">
              <button 
              className="page-link" 
              onClick={prevPage}>
                Previous
              </button>
            </li>
          )}
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
          
          {isLoaded === true ? <Spinner /> : (
            <li className="page-item">
              <button
                className="page-link"
                onClick={nextPage}
                disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
              >
                Next
              </button>
            </li>
          )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default ApprovedMerchant;
