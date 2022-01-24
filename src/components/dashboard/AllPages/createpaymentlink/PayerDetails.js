
import React from 'react';
import axios from 'axios';


const PayerDetails = () => {
    const getFileName = async () => {  
        await axios("https://adminapi.sabpaisa.in/REST/settlementReport/getFileName/LPSD1")  //MPSE1
        .then(res => {  
            console.log(res.data)
         // setData(res.data);  
        })  
        .catch(err => {  
          console.log(err)
        });

    }

  React.useEffect(() => {
    getFileName();
}, []);



  return(
      <div>
          <h1 className='bholu'>Create Payment Link</h1>

          <h3 className='sample'>Payer Details</h3>
          <button type="button" className='btn' class="btn btn-primary">Add Single Payer</button>
          <p className='para'>Total Records: 8</p>
          <input type="text" placeholder="Search Here" style={{ position: 'absolute', top: 370, left: 300, width: 700 }}/> 
          <h3 style={{ position: 'absolute', top: 370, left: 1150 }}>Count per page</h3>
           <select style={{ position: 'absolute', top: 370, left: 1300, width: 100 }}>
           <option value="10">10</option>
           <option value="20">25</option>
           <option value="30">50</option>
           <option value="60">100</option>
           <option value="70">200</option>
           <option value="70">300</option>
           <option value="70">400</option>
           <option value="70">500</option>
       </select>
       
       <table  style={{ position: 'absolute', top: 450, left: 300, width:800}}  >
 
    <tr>
      <th>Pair Name</th>
      <th >Mobile No.</th>
      <th >Email ID</th>
      <th >Payer  Category</th>
   <th>Edit</th>
   <th>Delete</th>
   <th>Action</th>
    </tr>
    <tr>
        <td>Rahul Test</td>
        <td>89208555489</td>
        <td>rahul.singh@srslive.in</td>
        <td>customer</td>
    </tr>
    
  

       </table>
            
            
          </div>

  )
};

export default PayerDetails;
