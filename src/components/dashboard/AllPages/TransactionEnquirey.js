import React, { useState, useEffect } from 'react'

function TransactionEnquirey() {
  
  const initialState = {
    ActAmount:'',
    paymentMode:'',
    payeeFirstName:'',
    payeeMobile:'',
    payeeEmail:'',



  }
  
  
  const [user, setUser] = useState()
  const [input, setInput] = useState()
  const [data,setData]= useState(initialState)

  const onValueChange = e => {
    setInput(e.target.value);
  };

  const onSubmit=(input)=>{
      console.log('submit');
      if(input) {
        fetch(`https://adminapi.sabpaisa.in/REST/transaction/searchByTransId/${input}`).then((result) => {
          result.json().
          then((resp) => {
            console.warn("result", resp)
            setData(resp)
          }).catch((e)=>console.log(e));
        })
      }
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
                <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Transactions Enquiry</label>
                  <input type="text" className="ant-input" placeholder="Enter your transactions enquiry" onChange={(e) => onValueChange(e)} />
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <div>&nbsp;</div>
                  <button className="view_history test" style={{ marginTop: '8px' }} onClick={() => onSubmit(input)}>Search</button>
                </div>
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
                  <tbody>
                    <tr>
                      <td>Txn Id:</td><hr></hr>
                      <td className="bold" >{data.ActAmount}</td>
                      <td>Payment Mode :</td><hr></hr>
                      <td className="bold">{data.paymentMode}</td>
                      <td>payee First Name :</td><hr></hr>
                      <td className="bold">{data.payeeFirstName}</td>
                    </tr>
                    <tr>
                      <td>Payee Mobile:</td><hr></hr>
                      <td className="bold">{data.payeeMobile}</td>
                      <td>Payee Email :</td><hr></hr>
                      <td className="bold">{data.payeeEmail}</td>
                      <td>Status :</td>
                      <td className="bold">Success</td>
                    </tr>
                    <tr>
                      <td colSpan={6}><button className="view_history">Print</button></td>
                    </tr>
                  </tbody></table>
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