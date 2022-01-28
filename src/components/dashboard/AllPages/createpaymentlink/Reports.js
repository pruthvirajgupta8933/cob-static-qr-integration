import React, { useEffect, useState } from 'react'
import axios from 'axios' ;
import { useSelector } from 'react-redux';

const Reports = () => {

  const initialState = {

    client_transaction_id: null,
    created_at: null,
    customer_email: "",
    customer_name: "",
    customer_phone_number: "",
    link_id: "",
    link_valid_date: "",
    numeric_link_id: "",
    payment_collected: null,
    pg_response: null,
    pg_transaction_id: null,
    transaction_status: null,
    type: "",
  }

  const [data , setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const {user} = useSelector((state)=>state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const {clientCode} = clientMerchantDetailsList[0];
  console.log('clientCode',clientCode);


  
  const getData = async (e) => { 

       

    await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getReports/${clientCode}`)  
  .then(res => {     
    setData(res.data);  

  })  
  .catch(err => {  
    console.log(err)
  });
  
}


useEffect(() => { 
  getData();
},[])



const getSearchTerm  = (e) => {
  setSearchText(e.target.value)
  if(searchText !== ''){ setData(data.filter((item)=>item.customer_email.toLowerCase().includes(searchText.toLocaleLowerCase())))}
}



  return <div>
      
      <div>
        <div>
      <h3><b>Reports</b></h3>
      <p>Total Records : 8</p>
      </div>
       
       
      <input type="text" placeholder="Search Here" value={searchText} style={{ width: 500 }}  />
      </div>
      
      <div>
      <h4 style={{marginLeft:650 , position: 'relative', top: -25 }} >Count per page</h4>
       <select style={{marginLeft:800 , position: 'relative', top: -55 , width: 150}}>
           <option value="10">10</option>
           <option value="20">25</option>
           <option value="30">50</option>
           <option value="60">100</option>
           <option value="70">200</option>
           <option value="70">300</option>
           <option value="70">400</option>
           <option value="70">500</option>
       </select>
      </div>
       <table class='table'>
 
 <tr>
   <th>Name</th>
   <th>Email</th>
   <th >Mobile No.</th>
   <th> Action</th>
<th>Status</th>
<th>Client Txn Id</th>
<th>Link Id</th>
<th>Link Valid Date</th>
<th>Created At</th>
<th>Created At</th>
<th>Payment Collected</th>
<th>Numeric Link Id</th>


 </tr>

 

 {
    (data.map((user) => 
 <tr>
     <td>{user.customer_name}</td>
     <td>{user.customer_email}</td>
     <td>{user.customer_phone_number}</td>
     <td>{user.type}</td>
     <td>{user.transaction_status}</td>
     <td>{user.client_transaction_id}</td>
     <td>{user.link_id}</td>
     <td>{user.link_valid_date}</td>
     <td>{user.created_at}</td>
     <td>{user.payment_collected}</td>
     <td>{user.numeric_link_id}</td>

     <td></td>
 </tr>

     ))}
 


    </table>

  </div>;
};

export default Reports;
