import React, { useState } from "react";
import axios from "axios";
import sabpaisalogo from "../../assets/images/sabpaisalogo.png";
import API_URL from "../../config";
import toastConfig from "../../utilities/toastTypes";

const ReceiptWalchand = () => {
  const [pnrId, setPnrId] = useState();
  const [show, setIsShow] = useState(false);
  const [btnDisable,setBtnDisable] = useState(false)
  const [data, setData] = useState([]);

  const onSubmit = async (e,pnrId) => {
    setBtnDisable(true)
    e.preventDefault();
    await axios
      .get(`${API_URL.FETCH_DATA_FOR_WACOE}?PRNNum=${pnrId}`)
      .then((response) => {
        // console.log(response.data)
        let resData = response.data;
        if(response?.data.length === 0 || null) {
          toastConfig.errorToast("No Data Found")
          setBtnDisable(false)
          setIsShow(false);
        }
        
        resData.map((dt, i) =>
          transactionStatus(dt.cid, dt.transId).then((response) => {
            if (response[0].client_txn_id === dt.transId) {
              resData[i].trans_date = response[0].trans_date;
              resData[i].paid_amount = response[0].paid_amount;
              resData[i].client_name = response[0].client_name;
            }
          })
        );
        setInterval(() => {
          setData(resData);
          setIsShow(true);
          setBtnDisable(false)
     
          // setErrMessage('');
        }, 2000);
      }).catch((e) => {

        setIsShow(false);
        setBtnDisable(false)

      });
  };

  const transactionStatus = (cid, transId, index = 0, dataLength = 1) => {
    return fetch(`${API_URL.RECEIPT_FOR_WALCHAND}${cid}/${transId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        return json;
        // console.log(json)
      });
  };

  const printHandler = (id) => {
    var tableContents = document.getElementById(id).innerHTML;
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

      <div className="container-fluid">
        <div className="row justify-content-center">
        <div className="col-lg-6">
            <div className="card">
              <div className="card-header text-center">
                <p>
                Dear payer, in case money is debited by a Bank and not confirmed
              to us in Real time Your Bank would probably Refund your money as
              per your policy.For any payment issues please mail us at
              support@sabpaisa.in
                </p>
                <p>
                  <strong>SABPAISA TRANSACTION RECEIPT</strong>
                </p>
              </div>
              <div className="card-body">

              <form action="#">
                    <div className="form-group">
                      <label for="txn_id_input">Enter PNR number :</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pnrId"
                        value={pnrId}
                        onChange={(e) => setPnrId(e.target.value)}
                        placeholder="Enter PNR number"
                      />
                    </div>

                    <div className="form-group">
                      <button
                        className="btn cob-btn-primary"
                        onClick={(e) => onSubmit(e,pnrId)}
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

        {/* card end */}

        <div className="row justify-content-center">
          <div className="col-lg-6">
            {show &&
              data.map((user, i) => (
                <>
                  {/* {console.log(user)} */}
                  <div className="card">
                    <div className="card-body table-responsive">
                      <h3>TRANSACTION RECEIPT</h3>
                      <table className="table" id={`table_${i}`}>
                        <thead className="">
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
                            <th scope="row"> Payer Name</th>
                            <td>{user.Student_Name}</td>
                          </tr>
                          <tr>
                            <th scope="row">Sabpaisa Transaction ID</th>
                            <td>{user.spTransId}</td>
                          </tr>
                          <tr>
                            <th scope="row">Client Transaction ID</th>
                            <td>{user.transId}</td>
                          </tr>
                          <tr>
                            <th scope="row">Client Name</th>
                            <td>{user.client_name}</td>
                          </tr>

                          <tr>
                            <th scope="row">Base Amount</th>
                            <td>{user.transAmount}</td>
                          </tr>
                          <tr>
                            <th scope="row">Payment Mode</th>
                            <td>{user.transPaymode}</td>
                          </tr>
                          <tr>
                            <th scope="row">Transaction Date</th>
                            <td>{user.trans_date}</td>
                          </tr>
                          <tr>
                            <th scope="row">Payment Status</th>
                            <td>{user.transStatus}</td>
                          </tr>
                          <tr>
                            <th scope="row">PNR No</th>
                            <td>{user.PRN_No}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="card-footer">
                    <button value='click' onClick={()=>{printHandler('table_'+i)}} className="btn cob-btn-primary">Print</button>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
  );
};

export default ReceiptWalchand;
