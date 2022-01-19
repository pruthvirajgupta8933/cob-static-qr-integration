import React, { useState, useEffect } from 'react'

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

  const onValueChange = e => {
    setInput(e.target.value);
  };

  const onSubmit=(input)=>{
    
        fetch(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`).then((result) => {
          result.json()
          .then((resp) => {
            console.warn("result", resp)
            setData(resp);
            setIsShow(true);
            })
        }).catch((e)=>console.log(e));
       
        
      
  }


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
                
              <table cellspacing={0} cellPadding={10} border={0} width="100%" className="tables">
                  <tbody>
                    <tr>
                      <td>Txn Id:</td><hr></hr>
                      <td className="bold" ><b>{data.txnId}</b></td>
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
                    <td className="bold"><b>{data.transDate}</b></td>
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
                      <td colSpan={6}><button className="view_history">Print</button></td>
                    </tr>
                  </tbody></table> : null }
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