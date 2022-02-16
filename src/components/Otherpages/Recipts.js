import axios from 'axios';
import React, { useState, useEffect } from 'react';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';


export const Recipts = () => {
  const initialState = {
    txnId: '',
    paymentMode: '',
    payeeFirstName: '',
    payeeMob: '',
    payeeEmail: '',
    status: '',
    bankTxnId: '',
    clientName: '',
    clientId: '',
    payeeAmount: '',
    paidAmount: '',
    transDate: '',
    transCompleteDate: '',
    transactionCompositeKey: '',
    clientCode: '',
    clientTxnId: '',

  }
  const [input, setInput] = useState("");
  const [show, setIsShow] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState(initialState)

  const onValueChange = e => {
    setInput(e.target.value);
  };


  const onSubmit = async (input) => {

    const response = await axios.get(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`)
      .then((response) => {
        console.warn(response);
        setData(response.data);
        setIsShow(true);
        setErrMessage('');
      })

      .catch((e) => {
        alert('Transaction Id required ')

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
    return (date.getDate() +
      "/" + (date.getMonth() + 1) +
      "/" + date.getFullYear() +
      " " + date.getHours() +
      ":" + date.getMinutes() +
      ":" + date.getSeconds());

  }
  const onClick = () => {

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
      <div className="card" style={{ position: 'absolute', width: 600, height: 200, left: 400 }}>
        <div className="card-header" style={{ textAlign: 'center' }}>
          SABPAISA TRANSACTION RECEIPT
        </div>
        <div className="card-body" >
          <div className="col-lg-6 mrg-btm- bgcolor">

            <input type="text" className="ant-input" onChange={(e) => onValueChange(e)} placeholder="Enter Sabpaisa Transactions Id" style={{ position: 'absolute', width: 430 }} />
          </div>
          <div className="col-lg-6 mrg-btm- bgcolor">
          </div>

          <button className="btn btn-success" onClick={() => onSubmit(input)} style={{ marginTop: '40px', marginLeft: 200 }} >View</button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      {
        show ?
        <React.Fragment>
          <div className="card" style={{ position: 'absolute', top: 220, width: 1200, height: 480, left: 100 }}>

            <div className="card-body">
              <table className="table table-striped" id="joshi" style={{ position: 'absolute', top: 40 }} >


                <tbody>
                  <thead className="thead-dark">
                    <tr>

                      <th><img src={sabpaisalogo} alt="logo" width={"90px"} height={"25px"} /></th>
                    </tr>
                  </thead>
                  <tr>
                    <th scope="row">TRANSACTION RECEIPT</th>

                  </tr>

                  <tr>
                    <th scope="row">Payer Name</th>
                    <td>{data.payeeFirstName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Sabpaisa Transaction ID</th>
                    <td>{data.txnId}</td>

                  </tr>
                  <tr>
                    <th scope="row">Client Transaction ID</th>
                    <td>{data.transactionCompositeKey.clientTxnId}</td>

                  </tr>
                  <tr>
                    <th scope="row">Client Name</th>
                    <td>{data.clientName}</td>

                  </tr>
                  <tr>
                    <th scope="row">Paid Amount</th>
                    <td>{data.paidAmount}</td>

                  </tr>
                  <tr>
                    <th scope="row">Payment Mode</th>
                    <td>{data.paymentMode}</td>

                  </tr>
                  <tr>
                    <th scope="row">Transaction Date</th>
                    <td>{dateFormat(data.transDate)}</td>

                  </tr>
                  <tr>
                    <th scope="row">Payment Status</th>
                    <td>{data.status}</td>

                  </tr>
                </tbody>

              </table>


            </div>
          </div>
          </React.Fragment>
          : ''}
      {show ? <button value='click' onClick={onClick} className="btn btn-success" style={{ position: 'absolute', top: 760, width: 200, left: 590 }}>Print</button> : <></>}



    </div>




  )
};
