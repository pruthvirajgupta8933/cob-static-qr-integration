import React, { useState, useEffect } from "react";
import { useDispatch , useSelector} from "react-redux";
import { kycForVerified } from "../../slices/kycSlice";
import API_URL from "../../config";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import { Link } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import Spinner from "./Spinner";
import moment from "moment";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import CommentModal from "./Onboarderchant/CommentModal";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import { Toast } from "react-toastify";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import MerchnatListExportToxl from "./MerchnatListExportToxl";

function VerifiedMerchant() {
  const [data, setData] = useState([]);
  const [verfiedMerchant, setVerifiedMerchant] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [commentId, setCommentId] = useState({});
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isOpenModal, setIsModalOpen] = useState(false)
  const [isLoaded,setIsLoaded] = useState(false)


  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)



  // console.log(currenTab," Current Tab")
  let page_size = pageSize;
  let page = currentPage;
  const roles = roleBasedAccess();

  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const verifyMerchant = () => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        // toastConfig.successToast("Data Loaded");
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
  };



  useEffect(() => {
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setData(data);
        setKycIdClick(data);
        setDataCount(dataCoun);
        setVerifiedMerchant(data);
        setIsLoaded(false)   
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
  let pageNumbers = []
  if(!Number.isNaN(totalPages)){
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }

  const indexOfFirstRecord = indexOfLastRecord - pageSize;

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

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("MM/DD/YYYY");
      return date
    }


    // const handleModalState = (val)=>{
    //   setOpenCommentModal(val)
    // }

  return (
    <div className="container-fluid flleft">
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
          <DropDownCountPerPage datalength={dataCount} />
        </select>
      </div>
      {/* <KycDetailsModal kycId={kycIdClick} /> */}
      <div className="form-group col-lg-3 col-md-12 mt-2">
        <label>Onboard Type</label>
        <select onChange={kycSearch} className="ant-input">
          <option value="Select Role Type">Select Onboard Type</option>
          <option value="">All</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=verified'} filename= {"Pending-Approval"}/>
      <div>
        
      {openCommentModal === true ?  
      <CommentModal commentData={commentId} isModalOpen={openCommentModal} setModalState={setOpenCommentModal} tabName={"Pending Approval"} /> 
      : <></>}
      {/* {console.log("KycDetailsModal isOpenModal",isOpenModal)} */}
      {isOpenModal ? <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} renderPendingApproval={verifyMerchant}   /> : <></>}
      {/* {isOpenModal ? <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} /> : <></>} */}
      </div>
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
                <th>View Status</th>
                {/* <th>Comments</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* {spinner && <Spinner />} */}
              {data === null || data === [] ? (
                <tr>
                  <td colSpan={"11"}>
                    <div className="nodatafound text-center">
                      No data found{" "}
                    </div>
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {data?.length === 0 ? (
                <tr>
                <td colSpan={"20"}>
                 
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
                    
                      <button
                        type="button"
                        className="btn approve text-white  btn-xs"
                        onClick={() => {setKycIdClick(user); setIsModalOpen(true) }}
                        data-toggle="modal"
                        data-target="#kycmodaldetail"
                      >
                       { roles?.approver === true && currenTab === 4 ?  "Approve KYC / View Status" : "View Status" } 
                      </button>
                    </td>
                    {/* <td>{user?.comments}</td> */}
                    <td>
                      {roles?.verifier === true || roles?.approver === true || roles?.viewer === true ? (
                        <button
                          type="button"
                          className="btn approve text-white  btn-xs"
                          data-toggle="modal"
                          onClick={() =>  {                           
                            setCommentId(user)
                            setOpenCommentModal(true)
                          }}
                          data-target="#exampleModal"
                        disabled={user?.clientCode === null ? true : false}
                        >
                          Add/View Comments
                        </button>
                      ) : (
                        <></>
                      )}
                      
                    </td>
                
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
            </li> )}
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
            </li> )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default VerifiedMerchant;
