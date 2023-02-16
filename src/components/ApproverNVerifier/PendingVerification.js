/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { kycForPending } from "../../slices/kycSlice";
import DropDownCountPerPage from "../../_components/reuseable_components/DropDownCountPerPage";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import CommentModal from "./Onboarderchant/CommentModal";
import moment from "moment";
import KycDetailsModal from "./Onboarderchant/ViewKycDetails/KycDetailsModal";
import MerchnatListExportToxl from "./MerchnatListExportToxl";

function PendingVerification() {
  const roles = roleBasedAccess();
  //  const { user } = useSelector((state) => state.auth);
   const roleBasePermissions = roleBasedAccess()

   const Allow_To_Do_Verify_Kyc_details = roleBasePermissions.permission.Allow_To_Do_Verify_Kyc_details

  //  const { loginId } = user;
  //  const id =loginId
   
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [newRegistrationData, setNewRegistrationData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [commentId, setCommentId] = useState({});
  const [pageSize, setPageSize] = useState(100);
  const [kycIdClick, setKycIdClick] = useState(null);
  const [isOpenModal, setIsModalOpen] = useState(false)
  const [displayPageNumber, setDisplayPageNumber] = useState([]);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [isLoaded,setIsLoaded] = useState(false)

  const verifierApproverTab = useSelector((state) => state.verifierApproverTab)
  const currenTab = parseInt(verifierApproverTab?.currenTab)

  


 
  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const pendingVerify = () => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
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

  //---------------GET Api for KycPending-------------------

  useEffect(() => {
    dispatch(kycForPending({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        resp?.payload?.status_code && toastConfig.errorToast("Data Not Loaded");
        setSpinner(false);
        setSpinner(false);

        const data = resp?.payload?.results;
        const dataCoun = resp?.payload?.count;
        setKycIdClick(data);
        setData(data);
        setDataCount(dataCoun);
        setNewRegistrationData(data);
        setIsLoaded(false)   
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const totalPages = Math.ceil(dataCount / pageSize);
  const pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);

  const nextPage = () => {
    setIsLoaded(true)
    setData([])
    if (currentPage < pageNumbers?.length) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const covertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY");
      return date
    }

  //   let btn = false;
  //   ALLOW_ROLE_AS_VERIFIER?.map((i) => {
  //   if (ALLOW_ROLE_AS_VERIFIER.includes(id)) {
  //     btn = true;
  //   } else {
       
  //     btn = false;
  //   } 
  // });
    
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
          {openCommentModal === true ? <CommentModal commentData={commentId} isModalOpen={openCommentModal} setModalState={setOpenCommentModal} tabName={"Pending Verification"}/> : <></>}
          
          {/* KYC Details Modal */}
          
         {isOpenModal === true ? <KycDetailsModal kycId={kycIdClick} handleModal={setIsModalOpen}  isOpenModal={isOpenModal} renderPendingVerification={pendingVerify} /> : <></>}
          
        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Count Per Page</label>
          <select
            value={pageSize}
            rel={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
            <DropDownCountPerPage datalength={data?.length} />
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
        <MerchnatListExportToxl URL = {'?order_by=-merchantId&search=processing'} filename={"Pending-Verification"}/>
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
                <th>View Status</th>
                {/* <th>Comments</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>


            {data === null || data === [] ? (
                <tr>
                  <td colSpan={"11"}>
                    <div className="nodatafound text-center">
                      No data found
                    </div>
                  </td>
                </tr>
              ) : (
                <></>
              )}
              
              {data?.length === 0 ? (
                 <tr>
                 <td colSpan={"11"}>
                   <p className="text-center spinner-roll">{spinner && <Spinner />}</p>
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
                    {/* <td>{user?.comments}</td> */}
                    <td>
                      <button
                        type="button"
                        className="btn approve text-white  btn-xs"
                        onClick={() => {setKycIdClick(user); setIsModalOpen(true) }}
                        data-toggle="modal"
                        data-target="#kycmodaldetail"
                      >
                        {(roles?.verifier === true && currenTab === 3 ) || Allow_To_Do_Verify_Kyc_details === true ? "Verify KYC " : "View Status" }
                      
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
                          Comments
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
            </li> )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default PendingVerification;
