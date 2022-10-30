import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { kycForVerified } from "../../slices/kycSlice"
import API_URL from '../../config';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import { Link } from 'react-router-dom';
import toastConfig from '../../utilities/toastTypes';
import Spinner from './Spinner';
import { axiosInstanceAuth } from "../../utilities/axiosInstance";

function VerifiedMerchant() {

  const [verfiedMerchant, setVerifiedMerchant] = useState([])
  const [spinner, setSpinner] = useState(true);
  const [merchantData, setMerchantData] = useState([])
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  let page_size = pageSize;
  let page = currentPage;
  const roles = roleBasedAccess();

  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };

  const allVerifiedMerchants = async () => {
    await axiosInstanceAuth.get(`${API_URL.KYC_FOR_VERIFIED}`)
      .then(res => {
        const data = res.data.results;
        setMerchantData(data)

      })
  }

 

  useEffect(() => {
    // handleFetchData();
    allVerifiedMerchants();
    dispatch(kycForVerified({ page: currentPage, page_size: pageSize })).then((resp) => {
      toastConfig.successToast("Approved Data Loaded")
      setSpinner(false)
      const data = resp.payload.results

      setVerifiedMerchant(data);
    })

      .catch((err) => toastConfig.errorToast("Data not loaded"));
  }, [currentPage, pageSize]);


  useEffect(() => {
    if (searchText.length > 0) {
      setVerifiedMerchant(verfiedMerchant.filter((item) =>

        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      dispatch(kycForVerified({ page, page_size })).then((resp) => {
        const data = resp.payload.results
        setVerifiedMerchant(data.slice(indexOfFirstRecord, indexOfLastRecord));
      })
    }
  }, [searchText])
  const indexOfLastRecord = page * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const nPages = Math.ceil(merchantData.length / pageSize)
  const pageNumbers = [...Array(nPages + merchantData.length).keys()].slice(1)

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1)
    }
  }
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="container-fluid flleft">
      
      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Search</label>
        <input className='form-control' onChange={kycSearch} type="text" placeholder="Search Here" />
      </div>

      <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Count Per Page</label>
        <select value={pageSize} rel={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))} className="ant-input" >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
        </select>
      </div>
      <div className="container-fluid flleft p-3 my-3 col-md-12- col-md-offset-4">
        <div className='scroll overflow-auto'>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Merchant Id</th>
              <th>Contact Number</th>
              <th>Name</th>
              <th> Email</th>
              <th>Bank</th>
              <th>PAN No.</th>
              <th>Status</th>
              {roles.approver===true ? <th>Approve KYC</th> : <></>}

            </tr>
          </thead>
          <tbody>
          {spinner && (
       <Spinner/>
        )}
            {verfiedMerchant?.length === 0 ?<tr> <td colSpan={'9'}><h1 className="nodatafound" >No data found</h1></td></tr> :
            (verfiedMerchant?.map((user, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{user.merchantId}</td>
                <td>{user.contactNumber}</td>
                <td>{user.name}</td>
                <td>{user.emailId}</td>
                <td>{user.bankName}</td>
                <td>{user.panCard}</td>
                <td>{user.status}</td>
                {roles.approver===true ?
                  <td>
                    <Link to={`/dashboard/kyc/?kycid=${user.loginMasterId}`} className="btn approve text-white btn-xs" data-toggle="modal" data-target="#exampleModalCenter" >Approve KYC</Link>
                  </td> : <></>
                }
              </tr>
            )))}
          </tbody>
        </table>
        </div>
        <nav aria-label="Page navigation example" >

<ul class="pagination w-25">
  {pageNumbers?.length > 0 && <li class="page-item"><button class="page-link" onClick={handlePrevPage} >Previous</button></li>}
  {pageNumbers.slice(currentPage - 1, currentPage + 6).map((pgNumber, i) => (
    <li key={i}
      className={
        pgNumber === currentPage ? " page-item active" : "page-item"
      }>
      <a href={() => false} className={`page-link data_${i}`} >
        <span onClick={() => {
          setCurrentPage(pgNumber)
        }
        }
        >
          {pgNumber}
        </span>
      </a>
    </li>
  ))}
  {pageNumbers?.length > 0 && <li class="page-item"><button class="page-link" onClick={handleNextPage} >Next</button></li>}
</ul>
</nav>

      </div>
      
    </div>





  )
}

export default VerifiedMerchant