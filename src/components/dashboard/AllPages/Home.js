import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { successTxnSummary } from '../../../slices/auth'

import '../css/Home.css'
function Home() {
const dispatch = useDispatch();

  useEffect(() => {
    var formData = '2022-01-06';
    var toData = '2022-01-06';
    var clientCode = '1';
    dispatch(successTxnSummary(formData,toData,clientCode))
  }, [])

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
            <h1 className="m-b-sm gx-float-left">Home</h1>
          </div>
          <section className="features8 cid-sg6XYTl25a" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
                {/* <p>The quick brown fox jumps over the lazy dog.The quick brown fox jumps over the
                  lazy dog.The quick brown fox jumps over the lazy dog.</p> */}
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Sucessful TRansaction Summary</label>
                  <select className="ant-input">
                    <option defaultValue='selected'>Today</option>
                    <option>Yesterday</option>
                    <option>Tomorrow</option>
                  </select>
                </div>
                <div className="col-lg-6 mrg-btm- bgcolor">
                  <label>Search</label>
                  <input type="text" className="ant-input" placeholder="Search from here" />
                </div>
                <table cellspaccing={0} cellPadding={10} border={0} width="100%" className="tables">
                  <tbody><tr>
                      <th>Sr. No.</th>
                      <th>Client's Name</th>
                      <th>Transactions</th>
                      <th>Amount</th>
                    </tr>
                    <tr>
                      <td>01</td>
                      <td>Client Name here</td>
                      <td>SPTRANS0932497</td>
                      <td>Rs - 10000.00/-</td>
                    </tr>
                    <tr>
                      <td>02</td>
                      <td>Client Name here</td>
                      <td>SPTRANS0932497</td>
                      <td>Rs - 10000.00/-</td>
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

export default Home
