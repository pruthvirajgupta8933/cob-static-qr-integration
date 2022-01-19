import React, { useState, useEffect } from 'react'

import axios from 'axios';

function TransactionEnquirey() {
  
  const initialState = {
    txnId:'',
    paymentMode:'',
    payeeFirstName:'',
    payeeMob:'',
    payeeEmail:'',
    status: '',
    bankTxnId: '',
    clientName:'',
    clientId:'',
    payeeAmount:'',
    paidAmount:'',
    transDate:'',
    transCompleteDate:'',
    transactionCompositeKey:'',
    clientCode:'',
    clientTxnId:'',

  }
  
  
  const [input, setInput] = useState();
  const [show, setIsShow] = useState(false);
  const [data,setData]= useState(initialState)
  const[errMessage, setErrMessage]=useState('');

  const onValueChange = e => {
    setInput(e.target.value);
  };




  const onSubmit=async(input)=>{

    const response = await axios.get(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`)
    .then((response) => {
      console.warn(response);
      setData(response.data);
      setIsShow(true);
      setErrMessage('');
    })
    
    .catch((e) => {

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

  // const onSubmit=(input)=>{
      
  //       fetch(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`).then((result) => {
  //         result.json()
  //         .then((resp) => {
  //           console.warn("result", resp)
  //           setData(resp);
  //           setIsShow(true);
  //         }).catch((e)=> {

  //     console.log(e);
  //     setIsShow(false);
  //     setErrMessage('No Data Found');

  //   })
          
          
           
          
        
      
  // }

  const onClick=()=>{

    var tableContents = document.getElementById("joshi").innerHTML;
    var a = window.open('', '', 'height=900, width=900');
    a.document.write('<table>')
     a.document.write(tableContents);
    a.document.write('</table>');
    a.document.close();
            a.print();
  }

  //   window.print();
  
  // document.getElementById("btn").addEventListener("click",onClick)
  

  

  return (
    <section className="ant-layout">
      <div className="profileBarStatus">
        {/*
                    <div class="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span
                                class="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Transaction Enquiry</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
             
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Transactions Enquiry</label>
                  <input type="text" className="ant-input" placeholder="Enter your transactions enquiry" onChange={(e) => onValueChange(e)} />
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <div>&nbsp;</div>
                  <button className="view_history test" style={{ marginTop: '8px' }} onClick={() => onSubmit(input)}>Search</button>
                </div>
                {
                  show ? 
                
                
              <table cellspacing={0} cellPadding={10} border={0} width="100%" className="tables" id="joshi">
                  <tbody>
                    <tr>
                      <td>Txn Id:</td><hr></hr>
                      <td className="bold" ><b>{data.txnId}</b></td>npm
                      <td>Payment Mode :</td><hr></hr>
                      <td className="bold"><b>{data.paymentMode}</b></td>
                      <td>Payee First Name :</td><hr></hr>
                      <td className="bold"><b>{data.payeeFirstName}</b></td>
                    </tr>
                    <tr>
                      <td>Payee Mobile:</td><hr></hr>
                      <td className="bold"><b>{data.payeeMob}</b></td>
                      <td>Payee Email :</td><hr></hr>
                      <td className="bold"><b>{data.payeeEmail}</b></td>
                      <td>Status :</td><hr></hr>
                      <td className="bold"><b>{data.status}</b></td>
                    </tr>
                    <tr>
                    <td>Bank Txn Id :</td><hr></hr>
                    <td className="bold"><b>{data.bankTxnId}</b></td>
                    <td>Client Name :</td><hr></hr>
                    <td><b>{data.clientName}</b></td>
                    <td>Client Id : </td><hr></hr>
                    <td className="bold"><b>{data.clientId}</b></td>
                    </tr>
                    <tr>
                    <td>Payee Amount :</td><hr></hr>
                    <td className="bold"><b>{data.payeeAmount}</b></td>
                    <td>Paid Amount :</td><hr></hr>
                    <td className="bold"><b>{data.paidAmount}</b></td>
                    <td>Trans Date :</td><hr></hr>
                    <td className="bold"><b>{dateFormat(data.transDate)}</b></td>
                    </tr>
                    <tr>
                    <td>Trans Complete Date :</td><hr></hr>
                    <td className="bold"><b>{data.transCompleteDate}</b></td>
                    <td> Client Code :</td><hr></hr>
                    <td className="bold"><b>{data.transactionCompositeKey.clientCode}</b></td>
                    <td>Client Txn Id:</td><hr></hr>
                    <td className="bold"><b>{data.transactionCompositeKey.clientTxnId}</b></td>
                    </tr>

                    <tr>
                      <button Value='click' onClick={onClick} className="view_history">Print</button>
                    </tr>
                  </tbody></table> 
          //  {/* <ReactHTMLTableToExcel 
          //   className = 'view_history'
          //   table="table-to-xls"
          //   filename="tablexls"
          //   sheet='Enquiry Data'
          //  buttonText = 'Print'
          //  /> */}



                  
                  
                  : null }
                  {errMessage && ( <h3 style={{position: 'absolute', top: 300, left: 100, color: 'red'}}> {errMessage} </h3>)}

              </div>
            </div></section>
        </div>
        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">© 2021 Ippopay. All Rights Reserved. <span className="pull-right">Ippopay's GST Number : 33AADCF9175D1ZP</span></div>
        </footer>
      </main>
    </section>
  )
}

export default TransactionEnquirey