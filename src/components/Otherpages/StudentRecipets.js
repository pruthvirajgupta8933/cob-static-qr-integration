import React,{useState} from 'react';
import axios from 'axios';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';


const StudentRecipets=()=> {
    const initialState = {
        payee_first_name: "",
        txn_id: "",
        client_txn_id: "",
        client_name: "",
        paid_amount: "",
        payment_mode: "",
        trans_date: "",
        status: "",
        udf19: "",
       
      }
      const [input, setInput] = useState();
      const [show, setIsShow] = useState(false);
      const [errMessage , setErrMessage] = useState('');
      const [data,setData]= useState(initialState)
    
      const onValueChange = e => {
        setInput(e.target.value);
      };
    
    
      const onSubmit=async(input)=>{
    
        const response = await axios.get(`https://adminapi.sabpaisa.in/Receipt/ReceiptMB/${input}/0`)
        .then((response) => {
          console.warn(response);
          setData(response.data);
          setIsShow(true);
          setErrMessage('');
        })
        
        .catch((e) => {
            //alert('Transaction Id required ')
    
          console.log(e);
          setIsShow(false);
          setErrMessage('No Data Found');
    
        })
        
      }
      const dateFormat = (timestamp) => {


        // var date = new Date(timestamp);
        // console.log(date.getTime())
        // return date.getTime();
        
        var date = new Date(timestamp);
        return (date.getDate()+
                  "/"+(date.getMonth()+1)+
                  "/"+date.getFullYear()+
                  " "+date.getHours()+
                  ":"+date.getMinutes()+
                  ":"+date.getSeconds());
        
          }
          const onClick=()=>{

            var tableContents = document.getElementById("joshi").innerHTML;
            var a = window.open('', '', 'height=900, width=900');
            a.document.write('<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >')
             a.document.write(tableContents);
            a.document.write('</table>');
            a.document.close();
                    a.print();
          }


  return (
    <div>
    <div class="card" style={{position:'absolute',width:600, height:270,left:400}}>
      <div class="card-header" style={{textAlign:'center'}}>
      SABPAISA TRANSACTION RECEIPT
      </div>
      <div class="card-body" >
      <div className="col-lg-6 mrg-btm- bgcolor">
                      
                      <input type="text" className="ant-input" onChange={(e) => onValueChange(e)} placeholder="Enter Sabpaisa Transactions Id" style={{ position:'absolute',width:430 }}  />
                    </div>
                    <br/><br/><br/>
                   <h3 style={{position:'absolute',left:260}}>OR</h3> 
                   <br/><br/>
                   <div className="col-lg-6 mrg-btm- bgcolor">
                      
                      <input type="text" className="ant-input" onChange={(e) => onValueChange(e)} placeholder="Enter Student Id" style={{ position:'absolute',width:430 }}  />
                    </div>

                    <br/><br/>

                    <div className="col-lg-6 mrg-btm- bgcolor">
                    </div>
        
                    <button class="btn btn-success" onClick={() => onSubmit(input)} style={{ marginTop: '70px',marginLeft:200 }} >View</button>
      </div>
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    {
                      show ? 
    <div class="card" style={{position:'absolute', top:220 ,width:1200, height:480,left:100}}>
     
      <div class="card-body">
      <table class="table table-striped" id="joshi" style={{position:'absolute', top:40}} >
      
     
      <tbody>
          <thead class="thead-dark">
          <tr>
    
              <th><img  src={sabpaisalogo} alt="logo" width={"90px"} height={"25px"}/></th>
          </tr>
          </thead>
      <tr>
          <th scope="row">TRANSACTION RECEIPT</th>
          
          </tr>
    
    
    
    { data.map((user)=>{
      return(  
     <> 
      <tr>
        <th scope="row">Payer Name</th>
        <td>{user.payee_first_name}</td>
        </tr>
      <tr>
        <th scope="row">Sabpaisa Transaction ID</th>
        <td>{user.txn_id}</td>
        
      </tr>
      <tr>
        <th scope="row">Client Transaction ID</th>
        <td>{user.client_txn_id}</td>
       
      </tr>
      <tr>
        <th scope="row">Client Name</th>
        <td>{user.client_name}</td>
      
      </tr>
      <tr>
        <th scope="row">Paid Amount</th>
        <td>{user.paid_amount}</td>
        
      </tr>
      <tr>
        <th scope="row">Payment Mode</th>
        <td>{user.payment_mode}</td>
       
      </tr>
      <tr>
        <th scope="row">Transaction Date</th>
        <td>{dateFormat(user. trans_date)}</td>
        
      </tr>
      <tr>
        <th scope="row">Payment Status</th>
        <td>{user.status}</td>
        
      </tr>
      <tr>
        <th scope="row">Student id</th>
        <td>{user.udf19}</td>
        
      </tr> </>)
    })

      
}
      </tbody>
      
    </table>
    
        
      </div>
    </div>
     : '' }
      { show ? <button Value='click' onClick={onClick} class="btn btn-success" style={{position:'absolute', top:760 ,width:200,left:590}}>Print</button>:<></> }
    
    
    
    </div>
    
    
    
    
     
  )
    }

export default StudentRecipets;
