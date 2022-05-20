import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from "yup"
import { Formik, Form } from "formik"
import { useHistory, useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';
// import validation from '../../validation';

import API_URL from '../../../config';
import FormikController from '../../../_components/formik/FormikController';



function TransactionEnquirey() {

  
  const initialValues = {
    transaction_id: ""
  }
  const validationSchema = Yup.object({
    transaction_id: Yup.number().required("Required")
  })

  

  const [show, setIsShow] = useState(false);
  const [errMessage , setErrMessage] = useState('');
  const [data,setData]= useState({})
  const {auth} = useSelector((state)=>state);
  const {user} = auth;

  let history = useHistory();


  const onSubmit = (input)=>{
    setData({});
    const transaction_id = input.transaction_id

    axios.get(API_URL.VIEW_TXN+`/${transaction_id}`)
    .then((response) => {
      if(response?.data.length>0){
        setIsShow(true);
        setData(response?.data[0]);
        setErrMessage(false)
      }else{
        setIsShow(false);
        setErrMessage(true)
      }
     
    })
    
    .catch((e) => {
      // console.log(e);
      setIsShow(false);
      setErrMessage(true)

    })
    
  }


  const onClick=()=>{

    var tableContents = document.getElementById("enquiry").innerHTML;
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

  // console.log("data",data);
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
          <section className="features8 cid-sg6XYTl25a flleft col-lg-12" id="features08-3-">
            <div className="container-fluid">
              <div className="row">
              <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(onSubmit)}
                      >
                  {formik => (
                    <Form className="col-lg-12 ">
                          <div className="form-row">
                            <div className="form-group col-md-6 col-sm-12 col-lg-6">
                              <FormikController
                                  control="input"
                                  type="text"
                                  label="Transaction ID  *"
                                  name="transaction_id"
                                  placeholder="Enter Sabpaisa Transaction ID"
                                  className="form-control"
                                />

                                 <button className="btn receipt-button mt-2" type="submit">View</button>
                            </div>
                          </div>
                         
                    </Form>
                    )}
                </Formik>

                {show && data?.txn_id ? (
                  <div className="overflow-auto col-lg-12 ">
                  <table
                    cellspacing={0}
                    cellPadding={10}
                    border={0}
                    width="100%"
                    className="tables"
                    id="enquiry"
                  >
                    <tbody>
                      <tr>
                        <td>Txn Id:</td>
                        <td className="bold">
                          <b>{data.txn_id}</b>
                        </td>
                        <td>Payment Mode :</td>
                        <td className="bold">
                          <b>{data.payment_mode}</b>
                        </td>
                        <td>Payee Name :</td>
                        <td className="bold">
                          <b>{data.payee_name}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payee Mobile:</td>
                        <td className="bold">
                          <b>{data.payee_mob}</b>
                        </td>
                        <td>Payee Email :</td>
                        <td className="bold">
                          <b>{data.payee_email}</b>
                        </td>
                        <td>Status :</td>
                        <td className="bold">
                          <b>{data.status}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Bank Txn Id :</td>
                        <td className="bold">
                          <b>{data.bank_txn_id}</b>
                        </td>
                        <td>Client Name :</td>
                        <td>
                          <b>{data.client_name}</b>
                        </td>
                        <td>Client Id : </td>
                        <td className="bold">
                          <b>{data.client_id}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Payee Amount :</td>
                        <td className="bold">
                          <b>{data.payee_amount}</b>
                        </td>
                        <td>Paid Amount :</td>
                        <td className="bold">
                          <b>{data.paid_amount}</b>
                        </td>
                        <td>Trans Date :</td>
                        <td className="bold">
                          <b>{data.trans_date}</b>
                        </td>
                      </tr>
                      <tr>
                        <td>Trans Complete Date :</td>
                        <td className="bold">
                          <b>{data.trans_complete_date}</b>
                        </td>
                        <td> Client Code :</td>
                        <td className="bold">
                          <b>{data.client_code}</b>
                        </td>
                        <td>Client Txn Id:</td>
                        <td className="bold">
                          <b>{data.client_txn_Id}</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <>  </>
                )}

                {errMessage && (
                  <h3
                    style={{
                      color: "red",
                    }}
                  >
                    Record Not Found!
                  </h3>
                )}

                {show && data.txn_id? (
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