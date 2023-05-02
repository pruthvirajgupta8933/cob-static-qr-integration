/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import _ from 'lodash';
import FormPaymentLink from "./FormPaymentLink";
import API_URL from "../../../../config";
import toastConfig from '../../../../utilities/toastTypes';
import DropDownCountPerPage from "../../../../_components/reuseable_components/DropDownCountPerPage";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import CustomLoader from "../../../../_components/loader";
import Spinner from "../../../ApproverNVerifier/Spinner";
const PaymentLinkDetail = () => {

  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [displayList, setDisplayList] = useState([])
  const [loadingState, setLoadingState] = useState(true)
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode } = clientMerchantDetailsList[0];
  const [pageCount, setPageCount] = useState(data ? Math.ceil(data.length / pageSize) : 0);



  const loaduser = () => {
    // toastConfig.infoToast("Loading")
    axiosInstance.get(`${API_URL.GET_LINKS}${clientCode}`)
      .then((res) => {
        //  toastConfig.successToast("Payment Link Data Loaded")
        setData(res.data);
        setLoadingState(false)
        setDisplayList(res.data);
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        //  toastConfig.errorToast("Data not loaded")
      });

  }
  useEffect(() => {
    loaduser()
  }, []);




  useEffect(() => {

    if (searchText !== '') {
      setDisplayList(data.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    }
    else {
      setDisplayList(data)
    }
  }, [searchText])



  const getSearchTerm = (e) => {
    setSearchText(e.target.value);

  }

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



  // if ( pageCount === 1) return null;

  const pages = _.range(1, pageCount + 1)
  return (

    <React.Fragment>
      {/* filter area */}
      <FormPaymentLink loaduser={loaduser} />
      <section className="features8 cid-sg6XYTl25a " id="features08-3-1">
        <div className="container-fluid flleft">
          <div className="row">
            <div className="col-lg-4 pl-4">
              <button
                type="button"
                className="btn cob-btn-primary btn-primary text-white"
                data-toggle="modal"
                data-target="#exampleModal"
                data-whatever="@getbootstrap">
                Create Payment Link
              </button>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-4 mrg-btm- bgcolor">
              <label>Search</label>
              <input
                className="form-control"
                type="text"
                placeholder="Search Here"
                onChange={getSearchTerm}
              />
            </div>

            <div className="col-lg-4 mrg-btm- bgcolor">
              <label>Count Per Page</label>
              <select value={pageSize} rel={pageSize} className="ant-input" onChange={(e) => setPageSize(parseInt(e.target.value))} >
                <DropDownCountPerPage datalength={data.length} />
              </select>
            </div>

          </div>
          <div className="mt-5" >
            <CustomLoader loadingState={loadingState} />
                  </div>
          <div className="row">
            <div className="col-lg-4 mrg-btm- bgcolor">
              <p>Total Records: {data.length}</p>
            </div>
          </div>

        </div>
      </section>


      <section className="">
        <div className="container-fluid flleft  p-3 my-3 ">
          {!paginatedata ? (<h3> No Data Found</h3>) : (<React.Fragment>  <div className="scroll" style={{ overflow: "auto" }}>
            <table className="table table-bordered nowrap">
              <thead>
                <tr>
                  <th>Serial No.</th>
                  <th>Phone No.</th>
                  <th>Amount</th>
                  <th>Customer Type</th>
                  <th> Customer Email</th>
                  <th>Created At</th>
                  <th>Remarks</th>
                  <th>Customer Name</th>
                  <th>Full Link</th>
                </tr>
              </thead>
              {!loadingState && paginatedata?.length !== 0 &&

                <tbody>

                  {paginatedata.map((user, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{user?.customer_phoneNumber}</td>
                      <td>{user?.amount}</td>
                      <td>{user?.customer_type}</td>
                      <td>{user?.customer_email}</td>
                      <td>{user?.created_at}</td>
                      <td>{user?.remarks}</td>
                      {/* <td>{user.customer_id}</td> */}
                      <td>{user?.customer_name}</td>
                      <td>{user?.full_link}</td>
                    </tr>
                  ))}

                </tbody>
              }

            </table>

             {data?.length == 0 && !loadingState && (
              <h2 className="text-center">No data Found</h2>
            )}
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
                          <a className={`page-link data_${i}`} href={() => false}>
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



    //     <div className="col-lg-12">
    //       <button
    //         type="button"
    //         className="btn btn-primary"
    //         data-toggle="modal"
    //         data-target="#exampleModal"
    //         data-whatever="@getbootstrap"
    //       
    //       >
    //         Create Payment Link
    //       </button>

    //      <FormPaymentLink />
    //       <div className="filterSection" style={{display:"flex"}}>

    //       <div className="col-lg-6">
    //       <label> &nbsp;</label>
    //        <input
    //        className="form-control"
    //         type="text"
    //         placeholder="Search Here"
    //         onChange={getSearchTerm}
    //       />


    // </div>
    // <div className="col-lg-6">
    //       <label>
    //         Count per page &nbsp; &nbsp;
    //       </label>
    //       <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))} className="form-control">
    //         <option value="10">10</option>
    //         <option value="20">20</option>
    //         <option value="50">50</option>
    //         <option value="100">100</option>

    //       </select>
    //        </div>





    //       </div>
    //       <p>
    //         Total Records: {data.length}
    //        </p>





    //        <div>
    //          {
    //          ! paginatedata ? ("No data Found"):(
    //       <table className="table" style={{marginLeft: 10}} >
    //         <tr>
    //         <th>Serial No.</th>
    //           <th>Phone No.</th>
    //           <th>Amount</th>
    //           <th>Customer Type</th>
    //           <th> Customer Email</th>
    //           <th>Created At</th>
    //           <th>Customer ID</th>
    //           <th>Customer Name</th>
    //           <th>Full Link</th>
    //         </tr>

    //         {paginatedata.map((user,i) => (
    //           <tr>
    //             <td>{i+1}</td>
    //             <td>{user.customer_phoneNumber}</td>
    //             <td>{user.amount}</td>
    //             <td>{user.customer_type}</td>
    //             <td>{user.customer_email}</td>
    //             <td>{user.created_at}</td>
    //             <td>{user.customer_id}</td>
    //             <td>{user.customer_name}</td>
    //             <td>{user.full_link}</td>
    //           </tr>
    //         ))}
    //       </table>
    //          )}
    //       </div>
    //       <div>
    //   <nav aria-label="Page navigation example"  >
    //   <ul className="pagination">
    //     <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={void(0)}>Previous</a>

    //    {

    //      pages.map((page,i) => (
    //       <li className={
    //         page === currentPage ? " page-item active" : "page-item"
    //       }> 
    //           <a className="page-link">  
    //             <p onClick={() => pagination(page)}>
    //             {page}
    //             </p>
    //           </a>
    //         </li>
    //      ))
    //    }
    //     <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length ? nex : nex + 1)} href={void(0)}>Next</a>



    //   </ul>
    // </nav>
    //   </div>

    //     </div>
  );
};

export default PaymentLinkDetail;
