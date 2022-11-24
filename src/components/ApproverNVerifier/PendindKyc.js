import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { kycForPendingMerchants,GetKycTabsStatus } from "../../slices/kycSlice";
import API_URL from "../../config";
import { Link, useRouteMatch } from "react-router-dom";
import toastConfig from "../../utilities/toastTypes";
import { roleBasedAccess } from "../../_components/reuseable_components/roleBasedAccess";
import Spinner from "./Spinner";
import { axiosInstanceAuth } from "../../utilities/axiosInstance";
import ViewStatusModal from "./ViewStatusModal";
import { useSelector } from "react-redux";

// import PaginationForKyc from "../../_components/reuseable_components/PaginationForKyc";

const PendindKyc = () => {
  const { url } = useRouteMatch();
  const roles = roleBasedAccess();
 

  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [dataCount, setDataCount] = useState("");
  const [pendingKycData, setPendingKycData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusData, setStatusData] = useState([])
  let page_size = pageSize;
  let page = currentPage;
  const { auth ,kyc } = useSelector((state) => state);
  const { user } = auth;

  const { loginId } = user;
  


  let merchantloginMasterId = loginId;
 

  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const pendingMerchants = async () => {
    await axiosInstanceAuth
      .get(`${API_URL.KYC_FOR_PENDING_MERCHANTS}`)
      .then((res) => {
        const data = res?.data?.results;
       
      // const myapp=  data[0].isDirect===true 
      // console.log( myapp,"0000000000000000")
        // console.log("<======== Pending Merchants =======>", data)
        const dataCoun = res?.data?.count;
        setDataCount(dataCoun);
        setPendingKycData(data);
      });
  };


  const handleClick=(loginMasterId)=>{
    dispatch(
      GetKycTabsStatus({
        login_id: loginMasterId,
      })
    ).then((res) => {
     setStatusData(res.payload)
    
    });
    
  }
//--------------PENDING Merchants API -----------------//

  useEffect(() => {
    pendingMerchants();
    dispatch(kycForPendingMerchants({ page: currentPage, page_size: pageSize }))
      .then((resp) => {
        toastConfig.successToast("Pending Merchant List Loaded");
        setSpinner(false);

        const data = resp?.payload?.results;

        setData(data);
      })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded");
      });
  }, [currentPage, pageSize]);
  const dataArray = ["online", "offline"];



  useEffect(() => {
   
    if (searchText?.length > 0) {
      

      setData(
        data?.filter((item)  => 
        
        
          Object.values(item)
            .join(" ")
            .toLowerCase()
           .includes(searchText?.toLocaleLowerCase())
           
        )
        
      );
     
    } else {
      dispatch(kycForPendingMerchants({ page, page_size })).then((resp) => {
        const data = resp?.payload?.results;

        setData(data);
      });
    }
  }, [searchText]);


  const indexOfLastRecord = currentPage * pageSize;
  const nPages = Math.ceil(pendingKycData?.length / pageSize);
  const totalPages = Math.ceil(dataCount / pageSize);

  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  // console.log(pageNumbers, "pageNumbers ===>");
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  // const currentRecords = pendingKycData.slice(
  //   indexOfFirstRecord,
  //   indexOfLastRecord
  // );

  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      // console.log("hello", currentPage)
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
<div> <ViewStatusModal tabData={statusData}/></div>

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
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
        </div>
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Onboard Type</label>
          <select
            // value={pageSize}
            // rel={pageSize}
            // onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="ant-input"
          >
             <option value="Select Role Type">Select Onboard Type</option>
            <option value="all">All</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
           
          </select>
        </div>
      </div>

      <div className="col-md-12 col-md-offset-4">
        <div className="scroll overflow-auto">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Serial.No</th>
                <th>Merchant Id</th>
                <th>Contact Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Bank</th>
                <th>PAN No.</th>
                <th>Registered Date</th>
                <th>Onboard Type</th>
                <th>View Status</th>
                {/* <th>View</th> */}
              </tr>
            </thead>
            <tbody>
              {spinner && <Spinner />}
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
                    <td>{user.merchantId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.bankName}</td>
                    <td>{user.panCard}</td>
                    <td>{user.signUpDate}</td>
                    <td>{user?.isDirect}</td>
                    {/* <td>{user.status}</td> */}
                   
                    <td> <button type="button" onClick={()=>handleClick(user.loginMasterId)} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
  View Status
</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link" onClick={prevPage}>
                Previous
              </a>
            </li>
            
            {pageNumbers && pageNumbers?.slice(currentPage - 1, currentPage + 6)?.map((pgNumber, i) => (
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

export default PendindKyc;
