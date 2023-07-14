
import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from "yup"
import { Formik, Form } from "formik"
import API_URL from '../../config';
import FormikController from '../../_components/formik/FormikController';
import Header from "../mainComponent/header/Header"
import toastConfig from '../../utilities/toastTypes';

 const Recipts = () => {


  const initialValues = {
    transaction_id: ""
  }
  const validationSchema = Yup.object({
    transaction_id: Yup.number().required("Required")
  })

  const [show, setIsShow] = useState(false);
  // const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState([])
  const [btnDisable, setBtnDisable] = useState(false)

  const onSubmit = (input) => {
    setData({});
    setBtnDisable(true)
    const transaction_id = input.transaction_id;
    axios
      .get(API_URL.VIEW_TXN + `/${transaction_id}/0`)
      .then((response) => {
        let res = response.data
        if (res?.length === 0 || null) {
          toastConfig.errorToast("No Data Found")
          setBtnDisable(false)
          setIsShow(false);
        }
        if (res?.length > 0) {
          setIsShow(true);
          setData(response?.data[0]);
          toastConfig.successToast("Data Found")
          setBtnDisable(false)
          //  setErrMessage(false);
        } else {
          axios.get(API_URL.SP2_VIEW_TXN + `/${transaction_id}`).then((r) => {
            if (r?.data.length > 0) {
              toastConfig.successToast("Data Found")
              setBtnDisable(false)
              setIsShow(true);
              setData(r?.data[0]);
              // setErrMessage(false);
            } else {
              // setErrMessage(true);
            }
          });
        }
      })
      .catch((e) => {
        setIsShow(false);
        // setErrMessage(true);
        setBtnDisable(false)
      });
  };

  const onClick = () => {

    let tableContents = document.getElementById("receipt_table").innerHTML;
    let a = window.open('', '', 'height=900, width=900');
    a.document.write('<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >')
    a.document.write(tableContents);
    a.document.write('</table>');

    a.document.close();
    a.print();
  }

  return (

    <div>
      {/* ============================== */}
      <Header />
      <div className="container-fluid toppad">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card ">
              <div className="card-header text-center"><h5>SABPAISA TRANSACTION RECEIPT</h5></div>
              <div className="card-body">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(onSubmit)}
                >
                  {formik => (
                    <Form>
                      <div className="form-row">
                        <div className="form-group col-md-12 col-sm-12 col-lg-12">
                          <FormikController
                            control="input"
                            type="text"
                            label="Transaction ID  *"
                            name="transaction_id"
                            placeholder="Enter Sabpaisa Transaction ID"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <button disabled={btnDisable} className="btn cob-btn-primary btn-sm" type="submit">View</button>
                    </Form>
                  )}
                </Formik>

              </div>
            </div>
          </div>
        </div>



        {show ?
          <div className="row justify-content-center mt-4">
            <div className="col-lg-6">
              <React.Fragment>
                <div className="card ">
                  <div className="card-body">
                    <div className="d-flex justify-content-end">
                      <button onClick={onClick} className="btn btn-light btn-sm"><i className="fa fa-print font-size-16"></i></button>
                    </div>
                    <table className="table table-striped" id="receipt_table" style={{ border: "1px solid #ccc", width: "100%", maxWidth: "100%", marginBottom: "1rem", backgroundColor: "initial", color: "#212529" }} >
                      <tbody>
                        <tr>
                          <th colspan="2">Sabpaisa Transaction Receipt</th>
                        </tr>
                        <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Payer Name</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.payee_name}</td>
                        </tr>

                        <tr >
                          <th style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }} scope="row">Sabpaisa Transaction ID</th>
                          <td style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }} className="text-wrap">{data.txn_id}</td>
                        </tr>


                        <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Client Transaction ID</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.client_txn_Id}</td>
                        </tr>


                        <tr>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Client Name</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.client_name}</td>
                        </tr>

                        <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Payee Amount</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.payee_amount}</td>
                        </tr>

                        <tr>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Payment Mode</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.payment_mode}</td>
                        </tr>

                        <tr style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Transaction Date</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.trans_date}</td>

                        </tr>
                        <tr>
                          <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>Payment Status</th>
                          <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)", padding: "0.75rem", verticalAlign: "top" }}>{data.status}</td>

                        </tr>
                      </tbody>

                    </table>
                  </div>
                </div>
              </React.Fragment>

            </div>
          </div>
          : <></>}
      </div>
    </div>

  )
};


export default Recipts 