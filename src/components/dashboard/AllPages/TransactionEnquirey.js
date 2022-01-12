import React from 'react'

function TransactionEnquirey() {
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
                    <input type="text" className="ant-input" placeholder="Enter your transactions enquiry" />
                  </div>
                  <div className="col-lg-6 mrg-btm- bgcolor">
                    <div>&nbsp;</div>
                    <button className="view_history" style={{marginTop: '8px'}}>Search</button>
                  </div>
                  <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
                    <tbody><tr>
                        <td>Txn Id:</td>
                        <td className="bold">923472983742938</td>
                        <td>Payment Mode :</td>
                        <td className="bold">UPI</td>
                        <td>Payee Name :</td>
                        <td className="bold">Kushik Rana</td>
                      </tr>
                      <tr>
                        <td>Payee Mobile:</td>
                        <td className="bold">9983742938</td>
                        <td>Payee Email :</td>
                        <td className="bold">ksdf@gmail.com</td>
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