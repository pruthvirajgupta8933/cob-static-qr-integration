import React, { useState, useEffect } from 'react'
import {useDispatch } from 'react-redux';
import {kycForVerified} from "../../slices/kycSlice"
import API_URL from '../../config';
import axios from "axios";
import DropDownCountPerPage from '../../_components/reuseable_components/DropDownCountPerPage';


function VerifiedMerchant() {

  const[verfiedMerchant,setVerifiedMerchant]=useState([])
  const [merchantData,setMerchantData] = useState([])
  const dispatch=useDispatch();
  const [searchText, setSearchText] = useState("");
  const[currentPage,setCurrentPage]=useState(1)
  const [pageSize, setPageSize] = useState(10);
  let page_size = pageSize;
  let page = currentPage;
  const kycSearch = (e) => {
    setSearchText(e.target.value);
};

const allVerifiedMerchants = async () => {
 await axios.get(`${API_URL.KYC_FOR_VERIFIED}`)
  .then(res => {
    const data = res.data.results;
    console.log(data)
    setMerchantData(data)
   
  })
}



  useEffect(() => {

    allVerifiedMerchants();
    dispatch(kycForVerified({page,page_size})).then((resp) => {
     const data = resp.payload.results
   
     setVerifiedMerchant(data);
   })
     
       .catch((err) => console.log(err));
   }, []);


   useEffect(() => {
    if (searchText.length > 0) {
      setVerifiedMerchant(verfiedMerchant.filter((item) => 
        
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLocaleLowerCase())))
    } else {
      dispatch(kycForVerified({page,page_size})).then((resp) => {
        const data = resp.payload.results
      
        setVerifiedMerchant(data);
      })
   
       
    }
}, [searchText])


const indexOfLastRecord = page * pageSize;

const indexOfFirstRecord = indexOfLastRecord - pageSize;

const currentRecords = verfiedMerchant.slice(indexOfFirstRecord,indexOfLastRecord);



const nPages = Math.ceil(merchantData.length / pageSize)
console.log(merchantData.length ,"<===>")

const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
console.log(pageNumbers,"<===Page Number===>")


const nextPage = () => {
  if(page !== nPages) 
      setCurrentPage(page + 1)
}
const prevPage = () => {
  if(page !== 1) 
      setCurrentPage(page - 1)
}

const pagination = (pageNo) => {
  setCurrentPage(pageNo);
}




  return (
    <div className="row">  
    <div className="col-lg-4 mrg-btm- bgcolor">
    <label>Search</label>
        <input className='form-control' onChange={ kycSearch} type="text" placeholder="Search Here" />
    </div>
  
    <div className="col-lg-4 mrg-btm- bgcolor">
        <label>Count Per Page</label>
        <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))}  className="ant-input" >
        <DropDownCountPerPage datalength={verfiedMerchant.length} />
        </select>
  </div>
    <div className="col-md-12 col-md-offset-4">   
   
    <table className="table table-bordered">
                     <thead>
                     <tr>
                       
                       <th>Merchant Id</th>
                       <th>Contact Number</th>
                       <th>Name</th>
                       <th> Email</th>
                       <th>Bank</th>
                       <th>Adhar Number</th>
                       <th>Pan card</th>
                       <th>State</th>
                       <th>Pin code</th>
                       <th>Status</th>
                     </tr>
                     </thead>
                         <tbody>
                         {currentRecords.map((user,i) => (
                           <tr key={i}>
                            
                             <td>{user.merchantId}</td>
                             <td>{user.contactNumber}</td>
                             <td>{user.name}</td>
                             <td>{user.emailId}</td>
                             <td>{user.bankName}</td>
                             <td>{user.aadharNumber}</td>
                             <td>{user.panCard}</td>
                             <td>{user.stateId}</td>
                             <td>{user.pinCode}</td>
                             <td>{user.status}</td>
                           </tr>
                         ))}
                     </tbody>
                 </table>
                 <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link" href="#" onClick={prevPage}>Previous</a></li>

    {pageNumbers.map(pgNumber => (
      
     
                    <li key={pgNumber} 
                        className= {`page-item ${page == pgNumber ? 'active' : ''} `} >

                        <a onClick={() => setCurrentPage(pgNumber)}  
                            className='page-link' 
                            href='#'>
                            
                            {pgNumber}
                        </a>
                    </li>
                ))}
    <li class="page-item"><a class="page-link" href="#" onClick={nextPage}>Next</a></li>
  </ul>
</nav>
    
   </div>
   </div>
 
 
  

   
  )
}

export default VerifiedMerchant