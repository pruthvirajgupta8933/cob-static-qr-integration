import React, { useState } from "react";
import axios from "axios";
import sabpaisalogo from "../../assets/images/sabpaisalogo.png";
import API_URL from "../../config";

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
  const [isLoading, setIsLoading] = useState(false);

  // const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState(initialState);

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
    setIsLoading(true);
    setIsShow(false);
    await axios
      .get(`${API_URL.RECEIPT_MB}${transactionId}/${studentEmailId}`)
      .then((response) => {
        // console.warn(response);
        setData(response.data);
        setIsShow(true);
        // setErrMessage('');
        setIsLoading(false);
      })

      .catch((error) => {
        console.log(error);
        alert("Kindly enter SabPaisa Transaction Id Or Student Email ID");
        setIsLoading(false);
        // console.log(e);
        setIsShow(false);
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
    var tableContents = document.getElementById("joshi").innerHTML;
    var a = window.open("", "", "height=900, width=900");
    a.document.write(
      '<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >'
    );
    a.document.write(tableContents);
    a.document.write("</table>");
    a.document.close();
    a.print();
  };


  return (
    
      <div className="container">
        <div className="row">
          <div className="col-12 ">
            <div className="card">
              <div className="card-header text-center">
                <p>
                  Dear payer, in case money is debited by a Bank and not
                  confirmed to us in Real time Your Bank would probably Refund
                  your money as per your policy.For any payment issues please
                  mail us at support@sabpaisa.in{" "}
                </p>
                <p>
                  <strong>SABPAISA TRANSACTION RECEIPT</strong>
                </p>
              </div>
              <div className="card-body">

              <form
                    action="#"
                    onSubmit={() => {
                      console.log();
                    }}
                  >
                    <div className="form-group">
                      <label for="txn_id_input">
                        Sabpaisa Transcation ID :
                      </label>
                      <input
                        type="text"
                        className="ant-input"
                        name="transactionid"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter Sabpaisa Transactions Id"
                      />
                    </div>
                    <div className="form-group">
                      <h2 className="text-center">OR</h2>
                    </div>
                    <div className="form-group">
                      <label for="txn_id_input">Enter Student ID :</label>
                      <input
                        type="text"
                        className="ant-input"
                        name="studentEmailid"
                        value={studentEmailId}
                        onChange={(e) => setStudentEmailId(e.target.value)}
                        placeholder="Enter Student Id"
                      />
                    </div>

                    <div className="form-group">
                      <button
                        className="btn receipt-button"
                        onClick={(e) => onSubmit(e, transactionId, studentEmailId)}
                      >
                        {isLoading ? "Loading..." : "View"}
                      </button>
                      {isLoading ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {show &&
              data.map((user) => (
                <div className="card mt-0" key={user.Id}>
                  <div className="card-body table-responsive">
                    <h3>TRANSACTION RECEIPT</h3>
                    <table className="table" id="joshi">
                      <thead>
                        <tr>
                          <th>
                            <img
                              src={sabpaisalogo}
                              alt="logo"
                              width={"90px"}
                              height={"25px"}
                            />
                          </th>
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
                  <div className="card-footer">
                    <button
                      value="click"
                      onClick={onClick}
                      className="btn btn-primary"
                    >
                      Print
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    
  );
};

export default ReceiptByEmail;
