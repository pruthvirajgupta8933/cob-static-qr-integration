/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import _ from 'lodash';
import API_URL from '../../../../config';
import toastConfig from '../../../../utilities/toastTypes';
import DropDownCountPerPage from '../../../../_components/reuseable_components/DropDownCountPerPage';
import { axiosInstance } from '../../../../utilities/axiosInstance';
import CustomLoader from '../../../../_components/loader';
import moment from 'moment';

const Reports = () => {
  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingState, setLoadingState] = useState(true)
  const [data, setData] = useState([]);
  const [displayList, setDisplayList] = useState([])
  const [searchText, setSearchText] = useState('');
  const { user } = useSelector((state) => state.auth);
  const clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const [pageCount, setPageCount] = useState(data ? Math.ceil(data.length / pageSize) : 0);

  let now = moment().format("YYYY-M-D");
  let splitDate = now.split("-");
  if (splitDate[1].length === 1) {
    splitDate[1] = "0" + splitDate[1];
  }
  if (splitDate[2].length === 1) {
    splitDate[2] = "0" + splitDate[2];
  }
  splitDate = splitDate.join("-");

  const convertDate = (yourDate) => {
    let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
    return date;
  };

  useEffect(() => {
    // toastConfig.infoToast("Report Loading")
    axiosInstance.get(`${API_URL.GET_REPORTS}${clientCode}`)
      .then(res => {
        // toastConfig.successToast("Report Data loaded")
        setData(res.data);
        setDisplayList(res.data)
        setLoadingState(false)
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        // toastConfig.errorToast("Report Data not loaded !")  
      });

  }, []);



  const getSearchTerm = (e) => {
    setSearchText(e.target.value);
  }


  useEffect(() => {
    if (searchText.length > 0) {
      // setPaginatedData(data.filter((item) => 
      // Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
      setDisplayList(data.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      setDisplayList(data)
      // setPaginatedData(data)
    }
  }, [searchText])

  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
  }

  useEffect(() => {
    setPaginatedData(_(displayList).slice(0).take(pageSize).value())
    setPageCount(displayList.length > 0 ? Math.ceil(displayList.length / pageSize) : 0)
  }, [pageSize, displayList]);


  useEffect(() => {
    // console.log("page chagne no")
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedPost = _(displayList).slice(startIndex).take(pageSize).value();
    setPaginatedData(paginatedPost);

  }, [currentPage])

  const pages = _.range(1, pageCount + 1)

  // console.log("==========================")
  // console.log("pages",pages)
  // console.log("pageSize",pageSize)
  // console.log("data.length",data.length)
  // console.log("paginatedata",paginatedata)
  // console.log("paginatedata.length",paginatedata.length)
  // console.log("displayList",displayList)



  return (

    <React.Fragment>
      {/* filter area */}
      <section className="" id="">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <label>Search</label>
              <input className="form-control" type="text" placeholder="Search Here" value={searchText} onChange={getSearchTerm} />
            </div>

            <div className="col-lg-3">
              <label>Count Per Page</label>
              <select value={pageSize} rel={pageSize} className="form-select" onChange={(e) => setPageSize(parseInt(e.target.value))} >
                <DropDownCountPerPage datalength={data.length} />
              </select>
            </div>
          </div>
          {/* <div className="mt-5" >
            <CustomLoader loadingState={loadingState} />
                  </div> */}
        </div>
      </section>

      <section className="">
        <div className="container-fluid p-3 my-3">
        <h6>Total Records: {data.length}</h6>

          {!paginatedata ? (<h3> No Data Found</h3>) : (<React.Fragment>  <div className="scroll" style={{ overflow: "auto" }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th >Mobile No.</th>
                  <th> Action</th>
                  <th>Status</th>
                  <th>Client Txn Id</th>
                  <th>Link Id</th>
                  <th colSpan={1}>Link Valid Date </th>
                  <th>Created At</th>
                  <th>Payment Collected</th>
                  <th>Numeric Link Id</th>
                </tr>
              </thead>
              <tbody>
                {paginatedata.map((report, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{report.customer_name}</td>
                    <td>{report.customer_email}</td>
                    <td>{report.customer_phone_number}</td>
                    <td>{report.type}</td>
                    <td>{report.transaction_status}</td>
                    <td>{report.client_transaction_id}</td>
                    <td>{report.link_id}</td>
                    <td>{convertDate(report?.link_valid_date?.replace("T", " "))}</td>
                    <td>{report.created_at}</td>
                    <td>{report.payment_collected}</td>
                    <td>{report.numeric_link_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="d-flex justify-content-center align-items-center loader-container">
              <CustomLoader loadingState={loadingState} />
            </div>
          </div>
            <div>

              {pages.length > 1 ?
                <nav aria-label="Page navigation example"  >
                  <ul className="pagination">

                    <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1)} href={() => false}>Previous</a>
                    {
                      pages.slice(currentPage - 1, currentPage + 6).map((page, i) => (
                        <li key={i} className={
                          page === currentPage ? " page-item active" : "page-item"
                        }>
                          <a href={() => false} className={`page-link data_${i}`} >
                            <p onClick={() => pagination(page)}>
                              {page}
                            </p>
                          </a>
                        </li>

                      ))
                    }
                    {pages.length !== currentPage ? <a className="page-link" onClick={(nex) => setCurrentPage((nex) => nex === (pages.length > 9) ? nex : nex + 1)} href={() => false}>
                      Next</a> : <></>}
                  </ul>
                </nav>
                : <></>}
            </div>
          </React.Fragment>
          )}
        </div>
      </section>
    </React.Fragment>

  )

};

export default Reports;
