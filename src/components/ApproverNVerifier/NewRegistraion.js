import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { kycForPending } from "../../slices/kycSlice"
import API_URL from '../../config';
import axios from "axios";
import DropDownCountPerPage from '../../_components/reuseable_components/DropDownCountPerPage';
import { Link, useRouteMatch } from 'react-router-dom';
import toastConfig from '../../utilities/toastTypes';
import { roleBasedAccess } from '../../_components/reuseable_components/roleBasedAccess';
import Spinner from './Spinner';


function NewRegistraion() {

  const { url } = useRouteMatch();
  const roles = roleBasedAccess();
  console.log(roles)


  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [newRegistrationData, setNewRegistrationData] = useState([])
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  let page_size = pageSize;
  let page = currentPage;

  // console.log(setPageSize,"wewewewewewewewewewewew")
  const dispatch = useDispatch();
  const kycSearch = (e) => {
    setSearchText(e.target.value);
  };


  const newAllRegistration = async () => {
    await axios.get(`${API_URL.KYC_FOR_PENDING}`)
      .then(res => {
        const data = res.data.results;
        // console.log(data)
        setNewRegistrationData(data)

      })
  }



  //---------------GET Api for KycPending-------------------

  useEffect(() => {
    newAllRegistration();
    dispatch(kycForPending({ page: currentPage, page_size: pageSize })).then((resp) => {
      toastConfig.successToast("Pending Data Loaded")
      setSpinner(false)

      const data = resp?.payload.results

      setData(data);
    })

      .catch((err) => {
        toastConfig.errorToast("Data not loaded")
      });
  }, [currentPage, pageSize]);

  ///////////Kyc Search filter
  useEffect(() => {
    if (searchText.length > 0) {
      setData(data.filter((item) =>

        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      dispatch(kycForPending({ page, page_size })).then((resp) => {
        const data = resp?.payload.results

        setData(data);
      })

    }
  }, [searchText])


  const indexOfLastRecord = page * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const nPages = Math.ceil(newRegistrationData.length / pageSize)
  // console.log(newRegistrationData.length, "<===>")
  const pageNumbers = [...Array(nPages + newRegistrationData.length).keys()].slice(1)
  // const pageNumbers = []
  // console.log(pageNumbers, "<===Page Number===>")
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

      <div className="form-row">
        <div className="form-group col-lg-3 col-md-12 mt-2">
          <label>Search</label>
          <input className='form-control'
            onChange={kycSearch}
            type="text"
            placeholder="Search Here" />
        </div>

        <div className="form-group col-lg-3 col-md-12 mt-2">
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
      </div>


      <div className="col-md-12 col-md-offset-4">
        <div className='scroll overflow-auto'>
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
                <th>Status</th>
                {roles.verifier === true ? <th>Verify KYC</th> : <></>}


              </tr>
            </thead>
            <tbody>
              {spinner && (
                <Spinner />
              )}
              {data.length == 0 ? <tr> <td colSpan={'8'}><h1 className="nodatafound" >No data found</h1></td></tr> :
                (data.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.merchantId}</td>
                    <td>{user.contactNumber}</td>
                    <td>{user.name}</td>
                    <td>{user.emailId}</td>
                    <td>{user.bankName}</td>
                    <td>{user.panCard}</td>
                    <td>{user.status}</td>
                    {roles.verifier === true ?
                      <td>
                        <Link to={`/dashboard/kyc/?kycid=${user.loginMasterId}`} className="btn approve text-white  btn-xs" >Verify KYC</Link>
                      </td> : <></>
                    }

                  </tr>
                )))
              }
            </tbody>
          </table>
        </div>
        <nav aria-label="Page navigation example" >

          <ul class="pagination w-25">
            {pageNumbers.length > 0 && <li class="page-item"><button class="page-link" onClick={handlePrevPage} >Previous</button></li>}
            {pageNumbers.slice(currentPage - 1, currentPage + 6).map((pgNumber, i) => (
              <li key={pgNumber, i}
                className={
                  pgNumber === currentPage ? " page-item active" : "page-item"
                }>
                {console.log(pageNumbers)}
                <a href={() => false} className={`page-link data_${i}`} >
                  <p onClick={() => {
                    setCurrentPage(pgNumber)
                  }
                  }
                  >
                    {pgNumber}
                  </p>
                </a>
              </li>
            ))}
            {pageNumbers.length > 0 && <li class="page-item"><button class="page-link" onClick={handleNextPage} >Next</button></li>}
          </ul>
        </nav>


      </div>
    </div>
  )
}

export default NewRegistraion
