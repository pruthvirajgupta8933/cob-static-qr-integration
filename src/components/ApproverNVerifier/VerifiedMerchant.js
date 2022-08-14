import React, { useState, useEffect } from 'react'
import {useDispatch } from 'react-redux';
import {kycForVerified} from "../../slices/kycSlice"


function VerifiedMerchant() {
  const[verfiedMerchant,setVerifiedMerchant]=useState([])
  const dispatch=useDispatch();
  const [searchText, setSearchText] = useState("");
  const[page,setPage]=useState(1)
  const kycSearch = (e) => {
    setSearchText(e.target.value);
};



  useEffect(() => {
    dispatch(kycForVerified({page})).then((resp) => {
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
      dispatch(kycForVerified()).then((resp) => {
        const data = resp.payload.results
      
        setVerifiedMerchant(data);
      })
   
       
    }
}, [searchText])

  


  return (
    <div className="row">  
    <div className="col-lg-4 mrg-btm- bgcolor">
    <label>Search</label>
        <input className='form-control' onChange={ kycSearch} type="text" placeholder="Search Here" />
    </div>
  
    <div className="col-lg-4 mrg-btm- bgcolor">
        {/* <label>Count Per Page</label>
        <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))}  className="ant-input" >
        <DropDownCountPerPage datalength={data.length} />
        </select> */}
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
                         {verfiedMerchant.map((user,i) => (
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
    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
  </ul>
</nav>
    
   </div>
   </div>
 
 
  

   
  )
}

export default VerifiedMerchant