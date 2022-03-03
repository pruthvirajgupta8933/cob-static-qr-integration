import axios from 'axios';
import React, { useState, useEffect } from 'react';
import sabpaisalogo from '../../assets/images/sabpaisalogo.png';
import validation from '../validation';


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
  const [errors, setErrors] =useState({input:true});
  const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState(initialState)
  
  const [isLoading, setIsLoading] = useState(false);


  const onValueChange = e => {
    setInput(e.target.value);
  };


  const onSubmit =  (e,input) => {
    e.preventDefault();
    // setErrors(validation({ input }))
    //console.log(errors, 'error')

    // let errors = {}
    var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    var isValidInput = true
    if(!input) {
        // errors.input = 'ID is required'
        // setErrors({input:'ID is required'})
        isValidInput = 'ID is required';
    }
    else if(regex.test(input)) {
      // setErrors({input:'Invalid Input'})
        // errors.input = 'Invalid Input'
        isValidInput = 'Invalid Input';
    }
   else{
        // errors.input = false;
      // setErrors({input:false})
      isValidInput = false;
        
    }

    if(isValidInput===false){
      setIsLoading(true);
      axios.get(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`)
      .then((response) => {
        // console.warn(response);
        setData(response.data);
        setIsShow(true);
        setErrMessage('');
        setIsLoading(false);
      })

      .catch((e) => {
        alert('Transaction Id required ')
        setIsLoading(false);
        console.log(e);
        setIsShow(false);
        setErrMessage('No Data Found');

      })

  }
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


    // =========abhishek========================//
    // var printWindow = window.open('', '', 'height=600,width=800');
    // printWindow.document.write('<html><head><title>Print Receipt</title>');

    // //Print the Table CSS.
    // var table_style = document.getElementById("joshi").innerHTML;
    // printWindow.document.write('<style type = "text/css">');
    // printWindow.document.write(table_style);
    // printWindow.document.write('</style>');
    // printWindow.document.write('</head>');

    //Print the DIV contents i.e. the HTML Table.
    // printWindow.document.write('<body>');
    // var divContents = document.getElementById("joshi").innerHTML;
    // printWindow.document.write(divContents);
    // printWindow.document.write('</body>');

    // printWindow.document.write('</html>');
    // printWindow.document.close();
    // printWindow.print();

  }

  return (

    <div>
        {/* ============================== */}
        <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center">SABPAISA TRANSACTION RECEIPT</div>
            <div className="card-body">
           <form action="#" onSubmit={()=>{console.log()}}>
                      <div className="form-group">
                          <input type="text" className="ant-input" onChange={(e) => onValueChange(e)} placeholder="Enter Sabpaisa Transactions Id"/>
                          {errors.input && <h4 >{errors.input}</h4>}
                      </div>

                      <div className="form-group">
                      
                      <button className="btn btn-success"  onClick={(e) => onSubmit(e,input)} >{isLoading ? "Loading...":"View"}</button>
                      
                      {isLoading?
                      <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div> : <></> }
                      </div>
                    </form>
            </div>
          
          </div>
        </div>
      </div>
    </div>
        {/* ============================== */}
     
      {
        show ?
        
        <div className="container-fluid">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
            <React.Fragment>
            <div className="card ">
            <div className="card-body">
              <table className="table table-striped" id="joshi" style={{border: "1px solid #ccc", width: "100%", maxWidth: "100%",marginBottom: "1rem",backgroundColor: "initial",color: "#212529"}} >
                <tbody>
                  <thead >
                    <tr >
                      <th><img src={sabpaisalogo} alt="logo" width={"90px"} height={"25px"} /></th>
                    </tr>
                  </thead>
                  <tr>
                    <th  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}} scope="row">TRANSACTION RECEIPT</th>
                  </tr>

                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payer Name</th>
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.payeeFirstName}</td>
                  </tr>

                  <tr >
                    <th style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}} scope="row">Sabpaisa Transaction ID</th>
                    <td style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}} className="text-wrap">{data.txnId}</td>
                  </tr>


                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Client Transaction ID</th>
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.transactionCompositeKey.clientTxnId}</td>
                  </tr>


                  <tr>
                    <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Client Name</th>
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.clientName}</td>
                  </tr>


                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Paid Amount</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.paidAmount}</td>
                  </tr>

                  <tr>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payment Mode</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.paymentMode}</td>
                  </tr>

                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Transaction Date</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{dateFormat(data.transDate)}</td>

                  </tr>
                  <tr>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payment Status</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.status}</td>

                  </tr>
                </tbody>

              </table>
            </div>
            <button value='click' onClick={onClick} className="btn btn-info" >Print</button>
            </div>
            </React.Fragment> 
           
          </div>
          </div>
          </div>

         
          : ''}
        </div>




  )
};
