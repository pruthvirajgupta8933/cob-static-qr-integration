import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
import validation from '../../validation';



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
  const [flag, setFlag] =useState('');
  const [errMessage , setErrMessage] = useState('');
  const [data,setData]= useState(initialState)
  const {auth} = useSelector((state)=>state);
  const {user} = auth;
  let { path } = useRouteMatch();
  let history = useHistory();


  const onValueChange = e => {
    setInput(e.target.value);
  };


  const onSubmit=async(input)=>{
    // setErrors(validation({ input }))
    var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    
    var flagMsg = true;
    if(!input) {
      flagMsg = 'ID is required'
    }
    else if(regex.test(input)) {
      flagMsg = 'Invalid Input'
    }
   else{
    flagMsg = false;
    } 

    setFlag(flagMsg);   
    // console.log(errors.input);
   if(flagMsg===false){
    const response = await axios.get(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`)
    .then((response) => {
      console.warn(response);
      setData(response.data);
      setIsShow(true);
      setErrMessage('');
    })
    
    .catch((e) => {

      // console.log(e);
      setIsShow(false);
      setErrMessage("No Data Found")

    })} 
    
  }

  


   const dateFormat = (timestamp) => {


// var date = new Date(timestamp);
// console.log(date.getTime())
// return date.getTime();

if(timestamp==='' || timestamp===null) {
  return " "
  // alert(timestamp);
}else{

  var date = new Date(timestamp);
  return (date.getDate()+
            "/"+(date.getMonth()+1)+
            "/"+date.getFullYear()+
            " "+date.getHours()+
            ":"+date.getMinutes()+
            ":"+date.getSeconds());
  
}
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

  if(user && user.clientMerchantDetailsList===null && user.roleId!==3 && user.roleId!==13){
    // alert(`${path}/profile`);
    // return <Redirect to={`${path}/profile`} />
    history.push('/dashboard/profile');
  } 

  return (
    <section className="ant-layout">
      <div className="profileBarStatus">
        {/*
                    <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span
                                className="btn">Upload Here</span></span></div>*/}
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
                  {flag && <h4>{flag}</h4>}
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <div>&nbsp;</div>
                  <button
                    className="view_history test topmargt"
                    onClick={() => onSubmit(input)}
                  >
                    Search
                  </button>
                </div>

                {show ? (
                  <table
                    cellspacing={0}
                    cellPadding={10}
                    border={0}
                    width="100%"
                    className="tables"
                    id="joshi"
                  >
                    <tbody>
                      <tr>
                        <td>Txn Id:</td>
                        <td className="bold">
                          <b>{data.txnId}</b>
                        </td>
                        <td>Payment Mode :</td>
                        <td className="bold">
                          <b>{data.paymentMode}</b>
                        </td>
                        <td>Payee First Name :</td>
                        <td className="bold">
                          <b>{data.payeeFirstName}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payee Mobile:</td>
                        <td className="bold">
                          <b>{data.payeeMob}</b>
                        </td>
                        <td>Payee Email :</td>
                        <td className="bold">
                          <b>{data.payeeEmail}</b>
                        </td>
                        <td>Status :</td>
                        <td className="bold">
                          <b>{data.status}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Bank Txn Id :</td>
                        <td className="bold">
                          <b>{data.bankTxnId}</b>
                        </td>
                        <td>Client Name :</td>
                        <td>
                          <b>{data.clientName}</b>
                        </td>
                        <td>Client Id : </td>
                        <td className="bold">
                          <b>{data.clientId}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payee Amount :</td>
                        <td className="bold">
                          <b>{data.payeeAmount}</b>
                        </td>
                        <td>Paid Amount :</td>
                        <td className="bold">
                          <b>{data.paidAmount}</b>
                        </td>
                        <td>Trans Date :</td>
                        <td className="bold">
                          <b>{dateFormat(data.transDate)}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Trans Complete Date :</td>
                        <td className="bold">
                          <b>{dateFormat(data.transCompleteDate)}</b>
                        </td>
                        <td> Client Code :</td>
                        <td className="bold">
                          <b>{data.transactionCompositeKey.clientCode}</b>
                        </td>
                        <td>Client Txn Id:</td>
                        <td className="bold">
                          <b>{data.transactionCompositeKey.clientTxnId}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  ""
                )}

                {errMessage && (
                  <h3
                    style={{
                      position: "absolute",
                      top: 300,
                      left: 200,
                      color: "red",
                    }}
                  >
                    {" "}
                    {errMessage}{" "}
                  </h3>
                )}

                {show ? (
                  <button
                    Value="click"
                    onClick={onClick}
                    className="view_history float-right"
                  >
                    Print
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>
        </div>
        <footer className="ant-layout-footer">
          <div className="gx-layout-footer-content">
            © 2021 Ippopay. All Rights Reserved.{" "}
            <span className="pull-right">
              Ippopay's GST Number : 33AADCF9175D1ZP
            </span>
          </div>
        </footer>
      </main>
    </section>
  );
}

export default TransactionEnquirey