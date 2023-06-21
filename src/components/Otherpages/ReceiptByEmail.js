import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../config";
import toastConfig from "../../utilities/toastTypes";
import Header from "../mainComponent/header/Header";

const ReceiptByEmail = () => {
  const initialState = {
    payee_first_name: "",
    txn_id: "",
    client_txn_id: "",
    client_name: "",
    paid_amount: "",
    payment_mode: "",
    trans_date: "",
    status: "",
    udf19: "",
  };
  const [transactionId, setTransactionId] = useState();
  const [studentEmailId, setStudentEmailId] = useState(0);
  const [show, setIsShow] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);

  // const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState([initialState]);

  // const onSubmit = async (transactionId, studentEmailId) => {
  //   if (transactionId === null) {
  //     setTransactionId(0);
  //   } else {
  //     setStudentEmailId(0);
  //   }

  //   await axios
  //     .get(`${API_URL.RECEIPT_MB}${transactionId}/${studentEmailId}`)
  //     .then((response) => {
  //       console.warn(response);
  //       setData(response.data);
  //       setIsShow(true);
  //       // setErrMessage('');
  //     })

  //     .catch((e) => {
  //       console.log(e);
  //       setIsShow(false);
  //       // setErrMessage('No Data Found');
  //     });
  // };

  const onSubmit = async (e, transactionId, studentId) => {
    e.preventDefault();
    if (transactionId === null) {
      setTransactionId(0);
    } else {
      setStudentEmailId(0);
    }
    setIsShow(false);
    setBtnDisable(true);
    await axios
      .get(`${API_URL.RECEIPT_MB}${transactionId}/${studentEmailId}`)
      .then((response) => {
        // console.warn(response);
        if (response?.data.length === 0 || null) {
          toastConfig.errorToast("No Data Found");
          setBtnDisable(false);
          setIsShow(false);
        }
        if (response?.data.length > 0) {
          setData(response.data);
          setIsShow(true);
          setBtnDisable(false);
          toastConfig.successToast("Data Found");
          // setErrMessage('');
        } else {
          axios.get(API_URL.SP2_VIEW_TXN + `/${transactionId}`).then((r) => {
            if (r?.data.length > 0) {
              //  console.log("In else============")
              toastConfig.successToast("Data Found");

              setIsShow(true);
              setData(r?.data);
              setBtnDisable(false);

              // setErrMessage(false);
            } else {
              setIsShow(false);
              // setErrMessage(true);
            }
          });
        }
      })

      .catch((error) => {
        // console.log(error);
        alert("Kindly enter SabPaisa Transaction Id Or Student Email ID");
        // console.log(e);
        setIsShow(false);
        setBtnDisable(false);
        // setErrMessage('No Data Found');
      });
  };

  // const dateFormat = (timestamp) => {
  //   var date = new Date(timestamp);
  //   return (date.getDate() +
  //     "/" + (date.getMonth() + 1) +
  //     "/" + date.getFullYear() +
  //     " " + date.getHours() +
  //     ":" + date.getMinutes() +
  //     ":" + date.getSeconds());

  // }
  const onClick = () => {
    let tableContents = document.getElementById("data-table").innerHTML;
    let a = window.open("", "", "height=900, width=900");
    a.document.write(
      '<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >'
    );
    a.document.write(tableContents);
    a.document.write("</table>");
    a.document.close();
    a.print();
  };

  return (
    <React.Fragment>
      <Header />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card">
              <div className="card-header text-center">
                <p>
                  Dear payer, in case money is debited by a Bank and not confirmed
                  to us in Real time Your Bank would probably Refund your money as
                  per your policy.For any payment issues please mail us at
                  support@sabpaisa.in{" "}
                </p>
                <p>
                  <strong>SABPAISA TRANSACTION RECEIPT</strong>
                </p>
              </div>
              <div className="card-body">
                <form action="#" onSubmit={() => { }}>
                  <div className="form-group">
                    <label for="txn_id_input">Sabpaisa Transcation ID :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="transactionid"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter Sabpaisa Transactions Id"
                    />
                  </div>
                  <div className="form-group">
                    <h6 className="text-center">OR</h6>
                  </div>
                  <div className="form-group">
                    <label for="txn_id_input">Enter Student ID :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="studentEmailid"
                      value={studentEmailId}
                      onChange={(e) => setStudentEmailId(e.target.value)}
                      placeholder="Enter Student Id"
                    />
                  </div>

                  <div className="form-group">
                    <button
                      className="btn cob-btn-primary btn-sm"
                      disabled={btnDisable}
                      onClick={(e) => onSubmit(e, transactionId, studentEmailId)}
                    >
                      View
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-6">
            {show &&
              data.map((user) => (
                <div className="card" key={user.Id}>
                  <div className="card-body table-responsive">
                  <div className="d-flex justify-content-end">
                      <button onClick={onClick} className="btn btn-light btn-sm"><i className="fa fa-print font-size-16"></i></button>
                    </div>
                    <table className="table table-striped" id="data-table">
                      <thead>
                        <tr>
                          <th colspan="2">Sabpaisa Transaction Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Payer Name</th>
                          <td>{user.payee_first_name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Sabpaisa Transaction ID</th>
                          <td>{user.txn_id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Client Transaction ID</th>
                          <td>{user.client_txn_id}</td>
                        </tr>
                        <tr>
                          <th scope="row">Client Name</th>
                          <td>{user.client_name}</td>
                        </tr>
                        <tr>
                          <th scope="row">Paid Amount</th>
                          <td>{user.paid_amount}</td>
                        </tr>
                        <tr>
                          <th scope="row">Payment Mode</th>
                          <td>{user.payment_mode}</td>
                        </tr>
                        <tr>
                          <th scope="row">Transaction Date</th>
                          <td>{user.trans_date}</td>
                        </tr>
                        <tr>
                          <th scope="row">Payment Status</th>
                          <td>{user.status}</td>
                        </tr>
                        <tr>
                          <th scope="row">Student Email</th>
                          <td>{user.udf19}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="card-footer">
                    <button
                      value="click"
                      onClick={onClick}
                      className="btn  cob-btn-primary"
                    >
                      Print
                    </button>
                  </div> */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>

  );
};

export default ReceiptByEmail;
