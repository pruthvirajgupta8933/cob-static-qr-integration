import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import _ from 'lodash';
import FormPaymentLink from "./FormPaymentLink";
import API_URL from "../../../../config";


 

const PaymentLinkDetail = () => {

  const [passwordcheck, setPasswordCheck] = useState(false);
 
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [pageSize, setPageSize] = useState(10);


  const [data, setData] = useState([]);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [drop, setDrop] = useState([]);
  const [searchText, setSearchText] = useState("");

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode} = clientMerchantDetailsList[0];
 

  

  



const pageCount = data ? Math.ceil(data.length/pageSize) : 0;
  // console.log('https://paybylink.sabpaisa.in/paymentlink/getLinks/'+ clientCode );

  const getDetails = async (e) => {
    await axios
      .get(`${API_URL.GET_LINKS}${clientCode}`)
      .then((res) => {
        setData(res.data);
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        console.log(err);
      });
  };



  useEffect(() => {
  
    if(searchText !== ''){
      setPaginatedData(data.filter((item)=>
      Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))}else{setPaginatedData(data)}
  },[searchText])



  const getSearchTerm  = (e) => {
  setSearchText(e.target.value);
 
  }




const pagination = (pageNo) => {
  setCurrentPage(pageNo);
}



useEffect(() => {
  getDetails();
}, []);

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



// console.log("dataLength",paginatedata.length)



  return (
    <div className="col-lg-12">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        data-whatever="@getbootstrap"
        style={{marginTop: 5, marginLeft: 15}}
      >
        Create Payment Link
      </button>
     {/* add form of create payment link */}
     <FormPaymentLink />
      <div className="filterSection" style={{display:"flex"}}>
      
      <div className="col-lg-6">
      <label> &nbsp;</label>
       <input
       className="form-control"
        type="text"
        placeholder="Search Here"
        
        onChange={getSearchTerm}
      />
        {/* {
         paginatedata.filter 
        } */}

</div>
<div className="col-lg-6">
      <label>
        Count per page &nbsp; &nbsp;
      </label>
      <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))} className="form-control">
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
     
      </select>
       </div>

       
       
     
      
      </div>
      <p>
        Total Records: {data.length}
       </p>


      
         
      
       <div>
         {
         ! paginatedata ? ("No data Found"):(
      <table
        className="table" style={{marginLeft: 10}}
      >
        <tr>
        <th>Serial No.</th>
          <th>Phone No.</th>
          <th>Amount</th>
          <th>Customer Type</th>
          <th> Customer Email</th>
          <th>Created At</th>
          <th>Customer ID</th>
          <th>Customer Name</th>
          <th>Full Link</th>
        </tr>
       
        {paginatedata.map((user,i) => (
          <tr>
            <td>{i+1}</td>
            <td>{user.customer_phoneNumber}</td>
            <td>{user.amount}</td>
            <td>{user.customer_type}</td>
            <td>{user.customer_email}</td>
            <td>{user.created_at}</td>
            <td>{user.customer_id}</td>
            <td>{user.customer_name}</td>
            <td>{user.full_link}</td>
          </tr>
        ))}
      </table>
         )}
      </div>
      <div>
  <nav aria-label="Page navigation example"  >
  <ul className="pagination">
    <a className="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href={void(0)}>Previous</a>

   {

     pages.map((page,i) => (
      <li className={
        page === currentPage ? " page-item active" : "page-item"
      }> 
          <a className="page-link">  
            <p onClick={() => pagination(page)}>
            {page}
            </p>
          </a>
        </li>
     ))
   }
    <a className="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length ? nex : nex + 1)} href={void(0)}>Next</a>
  
   
  
  </ul>
</nav>
  </div>

    </div>
  );
};

export default PaymentLinkDetail;
