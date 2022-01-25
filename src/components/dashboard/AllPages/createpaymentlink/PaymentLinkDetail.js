import React, { useEffect, useState } from 'react'
import axios from 'axios' ;
import { useSelector } from 'react-redux';

const PaymentLinkDetail = () => {



    const initialState = {
        
        customer_phoneNumber: "",
        amount:"",
        customer_type:"",
        customer_email:"",
        created_at:"",
        customer_id:"",
        customer_name:"",
        full_link:"",

    }

    const [data, setData] = useState([initialState]);
    const {user} = useSelector((state)=>state.auth);
    var clientMerchantDetailsList = user.clientMerchantDetailsList;
    const {clientCode} = clientMerchantDetailsList[0];
    console.log('clientCode',clientCode);



    const getDetails = async () => {  
         await axios.get(`https://paybylink.sabpaisa.in/paymentlink/getLinks/LPSD1`)  
        .then(res => {     
         console.log(res.data)
          setData(res.data);  
        })  
        .catch(err => {  
          console.log(err)
        });
        
    }

    useEffect(() => { 
        getDetails();
    },[])


 





    return (

        <div>
      <button type="button"  style={{postion:'absolute', top:230 , left:50}} class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@getbootstrap">Create Payment Link</button>

<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Payment Link New Details (New Payer)</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        {/* <form>
          <div class="form-group">
            <label for="recipient-name" class="col-form-label">Recipient:</label>
            <input type="text" class="form-control" id="recipient-name" />
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
          <div class="form-group">
            <label for="message-text" class="col-form-label">Message:</label>
            <textarea class="form-control" id="message-text"></textarea>
          </div>
        </form> */}
        <form>
        <select style={{width: 470}}>
        <option selected>Select Payer</option>
           <option value="10">10</option>
           <option value="20">25</option>
           <option value="30">50</option>
           <option value="60">100</option>
           <option value="70">200</option>
           <option value="70">300</option>
           <option value="70">400</option>
           <option value="70">500</option>
       </select>
       <br/>

  <div class="row">
    <div class="col">
    <label for="exampleInputEmail1">Payment to be Collected (INR)</label>
      <input type="text" class="form-control" placeholder="Enter Payment Amount in (INR)"/>
    </div>
    <div class="col">
    <label for="exampleInputEmail1">Purpose of Payemnt Collection</label>
      <input type="text" class="form-control" placeholder="Enter Purpose of Payement Collection"/>
    </div>
  </div>
  
  <div class="row">
    <div class="col">
    <label>Link Valid To Date</label>
                    <input type="date" className="ant-input" placeholder="From Date" />
    </div>
    <div class="col">
    <label>Hours</label>
    <br/>
    <select style={{width: 80}}>
        <option selected>Hours</option>
        <option value="01">01</option>
           <option value="02">02</option>
           <option value="03">03</option>
           <option value="04">04</option>
           <option value="05">04</option>
           <option value="06">05</option>
           <option value="06">06</option> 
           <option value="07">07</option>
           <option value="08">08</option>
           <option value="09">09</option>
           <option value="10">10</option>
           <option value="11">11</option>
           <option value="12">12</option>
           <option value="13">13</option>
           <option value="14">14</option>
           <option value="15">15</option>
           <option value="16">16</option>
           <option value="17">17</option>
           <option value="18">18</option>
           <option value="19">19</option>
           <option value="20">20</option>
           <option value="21">21</option>
           <option value="22">22</option>
           <option value="23">23</option>
       </select>
    </div>
    <div class="col">
    <label>Minutes</label>
    <br/>
    <select style={{width: 100}}>
        <option selected>Minutes</option>
           <option value="01">01</option>
           <option value="02">02</option>
           <option value="03">03</option>
           <option value="04">04</option>
           <option value="05">04</option>
           <option value="06">05</option>
           <option value="06">06</option>
           <option value="07">07</option>
           <option value="08">08</option>
           <option value="09">09</option>
           <option value="10">10</option>
           <option value="11">11</option>
           <option value="12">12</option>
           <option value="13">13</option>
           <option value="14">14</option>
           <option value="15">15</option>
           <option value="16">16</option>
           <option value="17">17</option>
           <option value="18">18</option>
           <option value="19">19</option>
           <option value="20">20</option>
           <option value="21">21</option>
           <option value="22">22</option>
           <option value="23">23</option>
       </select>
    </div>
  </div>
  
  
</form>

      </div>
      <div class="modal-footer">
          <br/>
         <button type="button" style={{postion:'absolute', top:265 , left:380 }} class="btn btn-danger" data-dismiss="modal">CANCEL</button> 
        <button type="button" style={{postion:'absolute', top:265 , left:280}} class="btn btn-primary ">SUBMIT</button>
      </div>
    </div>
  </div>
</div>
      

      <p style={{position: 'absolute', top: 270, left:50}}>Total Records: 8</p>
      <input type="text" placeholder="Search Here" style={{ position: 'absolute', top: 300, left: 30, width: 700 }}/> 
      <h4 style={{ position: 'absolute', top: 300, left: 835 }}>Count per page</h4>
      <select style={{ position: 'absolute', top: 300, left: 960, width: 100 }}>
           <option value="10">10</option>
           <option value="20">25</option>
           <option value="30">50</option>
           <option value="60">100</option>
           <option value="70">200</option>
           <option value="70">300</option>
           <option value="70">400</option>
           <option value="70">500</option>
       </select>
       <table  style={{ position: 'absolute', top: 340, left: 20, width:900}} class='table'  >
 
 <tr>
   <th>Phone No.</th>
   <th >Amount</th>
   <th >Customer Type</th>
   <th> Customer Email</th>
<th>Created At</th>
<th>Customer ID</th>
<th>Customer Name</th>
<th>Full Link</th>
 </tr>

 {
     data.map((user) => 

 
 <tr>
     <td>{user.customer_phoneNumber}</td>
     <td>{user.amount}</td>
     <td>{user.customer_type}</td>
     <td>{user.customer_email}</td>
     <td>{user.created_at}</td>
     <td>{user.customer_id}</td>
     <td>{user.customer_name}</td>
     <td>{user.full_link}</td>




 </tr>
     )}
 


    </table>
        </div>
    )
}


export default PaymentLinkDetail;