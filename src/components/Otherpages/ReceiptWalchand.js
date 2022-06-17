import React, { useState } from 'react';
import axios from 'axios';
import sabpaisalogo from '../../assets/images/sabpaisa-logo-white.png';
import API_URL from '../../config';


const ReceiptWalchand = () => {

    const [pnrId, setPnrId] = useState();
    const [show, setIsShow] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [data, setData] = useState([]);
    
    const onSubmit = async (pnrId) => {
        
        await axios.get(`${API_URL.FETCH_DATA_FOR_WACOE}?PRNNum=${pnrId}`)
            .then((response) => {
                var resData = response.data
                resData.map((dt,i)=>{
                    transactionStatus(dt.cid,dt.transId).then((response)=>{
                        if(response[0].client_txn_id===dt.transId){
                            resData[i].trans_date = response[0].trans_date;
                            resData[i].paid_amount = response[0].paid_amount;
                            resData[i].client_name = response[0].client_name;
                        }
                    })
                })
                setInterval(() => {
                    setData(resData);
                    setIsShow(true);
                    setErrMessage('');
                }, 2000);
            })

            .catch((e) => {
                console.log(e);
                 setIsShow(false);
                
              
            })

    }

    const transactionStatus = (cid, transId,index=0,dataLength=1) => {
            return fetch(`${API_URL.RECEIPT_FOR_WALCHAND}${cid}/${transId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json())
                .then((json)=>{
                    return json
                    // console.log(json)
                });

    }


    const onClick = () => {

        var tableContents = document.getElementById("joshi").innerHTML;
        var a = window.open('', '', 'height=900, width=900');
        a.document.write('<table cellspacing="0" cellPadding="10" border="0" width="100%" style="padding: 8px; font-size: 13px; border: 1px solid #f7f7f7;" >')
        a.document.write(tableContents);
        a.document.write('</table>');
        a.document.close();
        a.print();
    }


    return (
        <>
            <div className='container'>
        {/* card start */}
                <div className='row'>
                    <div className='col-sm-8 mx-auto'>

                        <b>Dear payer, in case money is debited by a Bank and not confirmed to us in Real time Your Bank would probably Refund your money as per your policy.For any payment issues please mail us at support@sabpaisa.in </b>
                        <div className="card">
                            <div className="card-header" style={{ textAlign: 'center' }}>
                                SABPAISA TRANSACTION RECEIPT
                            </div>
                            <div className="card-body" >
                                <div className="form-group">
                                    <input type="text" className="ant-input" name="pnrId" value={pnrId} onChange={(e) => setPnrId(e.target.value)} placeholder="Enter PNR number "  />
                                </div>
                                <button className="btn btn-success" onClick={() => onSubmit(pnrId)}>View</button>
                            </div>
                        </div>
                    </div>
                </div>

            {/* card end */}

                <div className='row'>
                    <div className='col-12'>
                        
                        {
                            show &&
                            data.map((user,i) => (
                                <>
                            {/* {console.log(user)} */}
                                    <div className='card'>
                                        <div className='card-body table-responsive'>
                                            <h3>TRANSACTION RECEIPT</h3>
                                            <table className='table' id="joshi">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th><img src={sabpaisalogo} alt="logo" width={"90px"} height={"25px"} /></th>
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
                                                        <td>{user.paid_amount}</td>

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
                                    </div>
                                </>
                            ))
                        }
                        <div className='col-md-12'>
                    {show ? <button Value='click' onClick={onClick} className="btn btn-success" style={{ position: 'absolute', width: 200, left: 500 }}>
                        Print
                    </button> : <></>}
                </div>
            </div>
                    </div>

                </div>
                

        </>
    )
}

export default ReceiptWalchand;
