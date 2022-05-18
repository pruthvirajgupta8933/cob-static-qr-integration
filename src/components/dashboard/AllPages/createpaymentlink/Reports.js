import React, { useEffect, useState } from 'react'
import axios from 'axios' ;
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { Zoom } from 'react-toastify';
import API_URL from '../../../../config';

const Reports = () => {


  const [pageSize, setPageSize] = useState(10);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
 

  // Parameters for Reports
  // const initialState = {

  //   client_transaction_id: null,
  //   created_at: null,
  //   customer_email: "",
  //   customer_name: "",
  //   customer_phone_number: "",
  //   link_id: "",
  //   link_valid_date: "",
  //   numeric_link_id: "",
  //   payment_collected: null,
  //   pg_response: null,
  //   pg_transaction_id: null,
  //   transaction_status: null,
  //   type: "",
  // }

  const [data , setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {user} = useSelector((state)=>state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const {clientCode} = clientMerchantDetailsList[0];


  const pageCount = data ? Math.ceil(data.length/pageSize) : 0;

  const getData = async (e) => { 
    await axios.get(`${API_URL.GET_REPORTS}${clientCode}`)  
  .then(res => {     
    setData(res.data);  
    setPaginatedData(_(res.data).slice(0).take(pageSize).value())
    console.log(res.data)

  })  
  .catch(err => {  
    // console.log(err)
  });
  
}

useEffect(() => {
  const loading = getData();
  toast.promise(
    loading,
    {
      pending: "In Process",
      success: "Data Loaded Successfully",
      error: "Error Occured in Data",
    },
    {
      position: "bottom-center",
      autoClose: 1000,
      limit: 2,
      transition: Zoom,
    }
  );
}, []);



const getSearchTerm  = (e) => {
  setSearchText(e.target.value);
}


useEffect(() => {
  if (searchText.length > 0) {
      setPaginatedData(data.filter((item) => 
      Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
  } else {
      setPaginatedData(data)
  }
}, [searchText])

const pagination = (pageNo) => {
  setCurrentPage(pageNo);
}

useEffect(()=>{
  setPaginatedData(_(data).slice(0).take(pageSize).value())
},[pageSize]);


useEffect(() => {
  // console.log("page chagne no")
  const startIndex = (currentPage - 1) * pageSize;
 const paginatedPost = _(data).slice(startIndex).take(pageSize).value();
 setPaginatedData(paginatedPost);

}, [currentPage])




// if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)





  return (
  
    <React.Fragment>
 {/* filter area */}
       <section className="features8 cid-sg6XYTl25a " id="features08-3-1">
                <div className="container-fluid">
                    <div className="row">  
                    <div className="col-lg-4 mrg-btm- bgcolor">
                    <label>Search</label>
                    <input className="form-control" type="text" placeholder="Search Here" value={searchText} onChange={getSearchTerm} />
                    </div>

                    <div className="col-lg-4 mrg-btm- bgcolor">
                        <label>Count Per Page</label>
                        <select  value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))} className="form-control">
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-lg-4 mrg-btm- bgcolor">
                            <p>Total Records: {data.length}</p>
                    </div>
                    </div>
                    
                </div>
            </section>

            <section className="">
        <div className="container-fluid  p-3 my-3 ">
        {! paginatedata ? (<h3> No Data Found</h3>) : ( <React.Fragment>  <div className="scroll" style={{overflow: "auto"}}>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                      <th>Serial No.</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th >Mobile No.</th>
                      <th> Action</th>
                      <th>Status</th>
                      <th>Client Txn Id</th>
                      <th>Link Id</th>
                      <th>Link Valid Date</th>
                      <th>Created At</th>
                      <th>Payment Collected</th>
                      <th>Numeric Link Id</th>
                    </tr>
                    </thead>
                        <tbody>
                        { paginatedata.map((report, i) => (
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td>{report.customer_name}</td>
                            <td>{report.customer_email}</td>
                            <td>{report.customer_phone_number}</td>
                            <td>{report.type}</td>
                            <td>{report.transaction_status}</td>
                            <td>{report.client_transaction_id}</td>
                            <td>{report.link_id}</td>
                            <td>{report.link_valid_date}</td>
                            <td>{report.created_at}</td>
                            <td>{report.payment_collected}</td>
                            <td>{report.numeric_link_id}</td>
                        </tr>
                            ))}
                    </tbody>
                </table>
          </div>
          <div>
              
                {paginatedata.length>0  ? 
                    <nav aria-label="Page navigation example"  >
                    <ul className="pagination">
      
                   <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={void(0)}>Previous</a>
                    { 
                      pages.slice(currentPage-1,currentPage+6).map((page,i) => (
                        <li key={i} className={
                          page === currentPage ? " page-item active" : "page-item"
                        }> 
                            <a className={`page-link data_${i}`} >  
                              <p onClick={() => pagination(page)}>
                              {page}
                              </p>
                            </a>
                        </li>
                      
                      ))
                    }
                { pages.length!==currentPage? <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length>9 ? nex : nex + 1)} href={void(0)}>
                      Next</a> : <></> }
                    </ul>
                  </nav>
                  : <></> }
                  </div>
          </React.Fragment>
          )}
    </div>
    </section>
    </React.Fragment>
  
  )

};

export default Reports;
