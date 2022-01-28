import React, {useState} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const BulkPayer = () => {

const {user} = useSelector((state)=>state.auth);
var clientMerchantDetailsList = user.clientMerchantDetailsList;
const {clientCode} = clientMerchantDetailsList[0];
const [file , setFile] = useState()
console.log('clientCode',clientCode);


  const submitHandler = async(e) => {

    e.preventDefault();

   const response =  await axios.post(`https://https://paybylink.sabpaisa.in/paymentlink/smartupload`, 
  {

    clientCode: {clientCode},
    file : 'binary',
  }
   
   )  
    .then(res => {     
      setFile(res.data);  

    })  
    .catch(err => {  
      console.log('Error',err)
    });

  }
  
  return (
  <div> 
    
   <form onSubmit={submitHandler}>
    <label class="form-label" for="customFile"><b>Import Bulk Payer</b></label>
    <input type="file" value= {file} setValue={setFile} class="  form-control" id="customFile" id='jjj' />
              
                
                  {/* <button className="view_history test" style={{ marginTop: '8px' }}></button> */}
                  <button type="submit" style={{ marginTop: '17px' }} class="btn btn-primary" style={{position: 'absolute', top: 220, left: 820}} >Submit</button>
                  </form>
                    <Link value="Download">Download Import Format Excel</Link>
  
  </div>
  )}


export default BulkPayer;
