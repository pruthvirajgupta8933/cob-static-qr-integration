import React, { useState } from 'react'
import classes from "./transaction.module.css"

function TransactionDetailModal() {

    const [udfToggle, setUdfToggle] = useState(false)

    const transactionData = {
        "srNo": 23,
        "txn_id": "127662305240883560",
        "client_txn_id": "TESTING230524084736727",
        "challan_no": null,
        "payee_amount": "21.00",
        "trans_date": "2024-05-23 20:47:50",
        "trans_complete_date": "2024-05-23 20:47:57",
        "status": "REFUND_INITIATED",
        "pag_response_code": "NA",
        "resp_msg": "Your Transaction is Complete",
        "payee_first_name": "laxmikantyadav",
        "payee_lst_name": "NA",
        "payee_mob": "NA",
        "payee_email": "techsupport@srslive.in",
        "client_code": "LPSD1",
        "payment_mode": "Credit Card",
        "payee_address": "NA",
        "udf1": "1",
        "udf2": "2",
        "udf3": "3",
        "udf4": "4",
        "udf5": "5",
        "udf6": "6",
        "udf7": "7",
        "udf8": "8",
        "udf9": 9,
        "udf10": 10,
        "udf11": 11,
        "udf12": 12,
        "udf13": 13,
        "udf14": 14,
        "udf15": 15,
        "udf16": 16,
        "udf17": 17,
        "udf18": 18,
        "udf19": 19,
        "udf20": 20,
        "client_name": "Canara Bank Demo",
        "gr_number": null,
        "paid_amount": "21.00",
        "pg_pay_mode": "SabpaisaBank",
        "act_amount": "21.00",
        "bank_message": "Transaction is successfully done !",
        "fee_forward": "no",
        "encrypted_pan": "NA",
        "ifsc_code": null,
        "payer_acount_number": null,
        "bank_txn_id": "sp5443325490463",
        "pg_return_amount": "21.0",
        "p_convcharges": "4.0",
        "p_ep_charges": "0.23",
        "p_gst": "0.0"
    }

    return (
        <div className="modal fade mymodals show d-flex justify-content-end">
            <div className={`modal-dialog modal-xl m-0 ${classes.z_index_99999}`} >
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sabpaisa Transaction ID : 123412341234</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="mb-5">
                            <h6>Transaction Details</h6>
                            <table className="table table-striped-columns table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Client Transaction ID</th>
                                        <td>{transactionData.client_txn_id}</td>
                                        <th>Amount</th>
                                        <td>{Number.parseFloat(transactionData.payee_amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>Transaction Date</th>
                                        <td>{transactionData.trans_date}</td>
                                        <th>Payment Status</th>
                                        <td>{transactionData.status}</td>
                                    </tr>
                                    <tr>
                                        <th>Bank Response</th>
                                        <td>{transactionData.bank_message}</td>
                                        <th>Bank Transaction Id</th>
                                        <td>{transactionData.bank_txn_id}</td>
                                    </tr>

                                    <tr>
                                        <th>Client Code</th>
                                        <td>{transactionData.client_code}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>


                        <div className="mb-5">
                            <h6>Payer Details</h6>
                            <table className="table table-striped-columns table-bordered">
                                <tbody>
                                    <tr>
                                        <th>First Name</th>
                                        <td>{transactionData.payee_first_name}</td>
                                        <th>Last Name</th>
                                        <td>{transactionData.payee_lst_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact number</th>
                                        <td>{transactionData.payee_mob}</td>
                                        <th>Email</th>
                                        <td>{transactionData.payee_email}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{transactionData.payee_address}</td>
                                        <th>Account Number</th>
                                        <td>{transactionData.payer_acount_number}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>


                        <div className="mb-5">
                            <h6>Merchant Specific Parameters</h6>
                            <table className="table table-striped-columns table-bordered">
                                <tbody>
                                    <tr>
                                        <th>UDF1</th>
                                        <td>{transactionData.udf1}</td>
                                    </tr>
                                    <tr>
                                        <th>UDF2</th>
                                        <td>{transactionData.udf2}</td>
                                    </tr>
                                    <tr>
                                        <th>UDF3</th>
                                        <td>{transactionData.udf3}</td>
                                    </tr>
                                    <tr>
                                        <th>UDF4</th>
                                        <td>{transactionData.udf4}</td>
                                    </tr>
                                    <tr>
                                        <th>UDF5</th>
                                        <td>{transactionData.udf5}</td>
                                    </tr>
                                    <tr>
                                        <th>UDF6</th>
                                        <td>{transactionData.udf6}</td>
                                    </tr>

                                    {udfToggle &&
                                        <React.Fragment>
                                            <tr>
                                                <th>UDF7</th>
                                                <td>{transactionData.udf7}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF8</th>
                                                <td>{transactionData.udf8}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF9</th>
                                                <td>{transactionData.udf9}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF10</th>
                                                <td>{transactionData.udf10}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF11</th>
                                                <td>{transactionData.udf11}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF12</th>
                                                <td>{transactionData.udf12}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF13</th>
                                                <td>{transactionData.udf13}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF14</th>
                                                <td>{transactionData.udf14}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF15</th>
                                                <td>{transactionData.udf15}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF16</th>
                                                <td>{transactionData.udf16}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF17</th>
                                                <td>{transactionData.udf17}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF18</th>
                                                <td>{transactionData.udf18}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF19</th>
                                                <td>{transactionData.udf19}</td>
                                            </tr>
                                            <tr>
                                                <th>UDF20</th>
                                                <td>{transactionData.udf20}</td>
                                            </tr>
                                        </React.Fragment>

                                    }


                                    <tr className="cursor_pointer" onClick={() => setUdfToggle(prev => !prev)}>
                                        <td colSpan={2}>
                                            <p className="m-0 text-center font-bold">{udfToggle ? 'Hide UDF Values' : 'Show UDF Values'}   </p></td></tr>

                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}


export default TransactionDetailModal