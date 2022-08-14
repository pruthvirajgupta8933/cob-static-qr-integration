import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {kycForApproved} from "../../slices/kycSlice"

function ApprovedMerchant() {
  const[approveMerchant,setApproveMerchant]=useState([])
  const dispatch=useDispatch();

  useEffect(() => {
    dispatch(kycForApproved()).then((resp) => {
     const data = resp.payload.results
   
     setApproveMerchant(data);


     
   })
     
       .catch((err) => console.log(err));
   }, []);

  return (
    <div className="col-md-12 col-md-offset-4">   
   
    <table className="table table-bordered">
                     <thead>
                     <tr>
                       <th>Serial No.</th>
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
                         {approveMerchant.map((user,i) => (
                           <tr key={i}>
                             <td>{i+1}</td>
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
    
   </div>
 
      
    
  );
}

export default ApprovedMerchant;
