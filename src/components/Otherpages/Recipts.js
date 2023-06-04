import axios from 'axios';
import React, { useState } from 'react';
import * as Yup from "yup"
import { Formik, Form } from "formik"
import sabpaisalogo from '../../assets/images/sabpaisalogo.png';
import API_URL from '../../config';
import FormikController from '../../_components/formik/FormikController';
import { axiosInstance } from '../../utilities/axiosInstance';
import toastConfig from '../../utilities/toastTypes';

export const Recipts = () => {


  const initialValues = {
    transaction_id: ""
  }
  const validationSchema = Yup.object({
    transaction_id: Yup.number().required("Required")
  })

  const [show, setIsShow] = useState(false);
  // const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState([])
  const [btnDisable,setBtnDisable] = useState(false)


 


//   const onSubmit =  (value) => {

//     const transaction_id = value.transaction_id;
//       setIsLoading(true);
//       axiosInstance.get(`${API_URL.VIEW_TXN}/${transaction_id}`)
//       .then((response) => {
        
//         if(response.data?.length> 0){
//           setData(response.data[0]);
//           setIsShow(true);
//           // setErrMessage('');
//           setIsLoading(false);
//         }else{
//           setIsShow(false)
//           setIsLoading(false);
//           alert('No Data Found')
//         }
       
//       })
//       .catch((e) => {
//         alert('No Data Found')
//         setIsLoading(false);
//         // console.log(e);
//         setIsShow(false);
//         // setErrMessage('No Data Found');

//       })

  
// }
const onSubmit = (input) => {
  setData({});
  setBtnDisable(true)
  const transaction_id = input.transaction_id;
  axios
    .get(API_URL.VIEW_TXN + `/${transaction_id}`)
    .then((response) => {
      let res = response.data
      if(res?.length === 0 || null) {
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

    var tableContents = document.getElementById("receipt_table").innerHTML;
    var a = window.open('', '', 'height=900, width=900');
    a.document.write('<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >')
    a.document.write(tableContents);
    a.document.write('</table>');

    a.document.close();
    a.print();
  }

  return (

    <div>
        {/* ============================== */}
        <div className="container-fluid toppad">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
          <div className="card ">
            <div className="card-header text-center receipt-header">SABPAISA TRANSACTION RECEIPT</div>
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
                          <button disabled={btnDisable} className="btn receipt-button" type="submit">View</button>
                    </Form>
                    )}
                </Formik>

              </div>
              </div>
        </div>
      </div>
    </div>

      {show ?
        
      <div className="container-fluid">
      <div className="row ">
        <div className="col-sm-6 mx-auto">
            <React.Fragment>
            <div className="card ">
            <div className="card-body">
              <table className="table table-striped" id="receipt_table" style={{border: "1px solid #ccc", width: "100%", maxWidth: "100%",marginBottom: "1rem",backgroundColor: "initial",color: "#212529"}} >
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
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.payee_name}</td>
                  </tr>

                  <tr >
                    <th style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}} scope="row">Sabpaisa Transaction ID</th>
                    <td style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}} className="text-wrap">{data.txn_id}</td>
                  </tr>


                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Client Transaction ID</th>
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.client_txn_Id}</td>
                  </tr>


                  <tr>
                    <th scope="row" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Client Name</th>
                    <td className="text-wrap" style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.client_name}</td>
                  </tr>

                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payee Amount</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.payee_amount}</td>
                  </tr>

                  <tr>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payment Mode</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.payment_mode}</td>
                  </tr>

                  <tr style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Transaction Date</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.trans_date}</td>

                  </tr>
                  <tr>
                    <th scope="row"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>Payment Status</th>
                    <td className="text-wrap"  style={{ borderTop: "1px solid rgba(0, 0, 0, 0.05)",padding: "0.75rem", verticalAlign: "top"}}>{data.status}</td>

                  </tr>
                </tbody>

              </table>
            </div>
            <button value='click' onClick={onClick} className="btn  cob-btn-primary" >Print</button>
            </div>
            </React.Fragment> 
           
          </div>
          </div>
          </div>
          : <></>}
        </div>




  )
};
