import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../config";
import toastConfig from "../../utilities/toastTypes";
import Header from "../mainComponent/header/Header";
import { uniqueId } from "lodash";

const StudentRecipets = () => {
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
  const [studentId, setStudentId] = useState(0);
  const [show, setIsShow] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errMessage, setErrMessage] = useState('');
  const [data, setData] = useState([initialState]);
  const [btnDisable, setBtnDisable] = useState(false)

  const onSubmit = async (e, transactionId, studentId) => {
    e.preventDefault();
    if (transactionId === null) {
      setTransactionId(0);
    } else {
      setStudentId(0);
    }
    //  setIsLoading(true);
    setIsShow(false);
    setBtnDisable(true)
    await axios
      .get(`${API_URL.RECEIPT_MB}${transactionId}/${studentId}`)
      .then((response) => {
        if (response?.data.length === 0 || null) {
          toastConfig.errorToast("No Data Found")
          setBtnDisable(false)
          setIsShow(false);
        }
        if (response?.data.length > 0) {
          setData(response.data);
          setIsShow(true);
          setBtnDisable(false)
          toastConfig.successToast("Data Found")
          // setIsLoading(true);
        } else {
          axios.get(API_URL.SP2_VIEW_TXN + `/${transactionId}`).then((r) => {
            if (r?.data.length > 0) {

              setIsShow(true);
              setData(r?.data);
              toastConfig.successToast("Data Found")
              // setIsLoading(false);
              // setErrMessage(false);
              setBtnDisable(false)
            } else {
              setIsShow(false);
              // setErrMessage(true);
            }
          });
        }
      })

      .catch((error) => {
        // console.log(error);
        alert("Kindly enter SabPaisa Transaction Id Or Student Id");
        // setIsLoading(false);
        // console.log(e);
        setIsShow(false);
        setBtnDisable(true)
        // setErrMessage('No Data Found');
      });
  };

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
    <>
      <Header display_bg_color={true} />
      <div className="container">
        {/* ============================== */}
        <div className="container-fluid">
          <div className="row justify-content-center mb-4">
            <div className="col-lg-6">
              <div className="card ">
                <div className="card-header text-center">
                  SABPAISA TRANSACTION RECEIPT
                </div>
                <div className="card-body">
                  <form
                    action="#"
                    onSubmit={() => {
                      // console.log();
                    }}
                  >
                    <div className="form-group">
                      <label for="txn_id_input">
                        Sabpaisa Transcation ID :
                      </label>
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
                        name="studdentid"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter Student Id"
                      />
                    </div>

                    <div className="form-group">
                      <button
                        className="btn cob-btn-primary btn-sm"
                        onClick={(e) => onSubmit(e, transactionId, studentId)}
                        disabled={btnDisable}
                      >
                        View
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ============================== */}

        <div className="row justify-content-center">
          <div className="col-lg-6">
            {show &&
              data.map((user) => (
                <div className="card" key={uniqueId()}>
                  <div className="card-body table-responsive">
                    <div className="d-flex justify-content-end">
                      <button onClick={onClick} className="btn btn-light btn-sm"><i className="fa fa-print font-size-16"></i> Print</button>
                    </div>
                    <table className="table" id="data-table">
                      <thead className="">
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
                          <th scope="row">Student id</th>
                          <td>{user.udf19}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRecipets;
