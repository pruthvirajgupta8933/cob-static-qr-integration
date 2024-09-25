import React from 'react'
import classes from "./transaction.module.css"

function TransactionDetailModal() {
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
        "udf1": "NA",
        "udf2": "NA",
        "udf3": "NA",
        "udf4": "NA",
        "udf5": "NA",
        "udf6": "NA",
        "udf7": "NA",
        "udf8": "NA",
        "udf9": null,
        "udf10": null,
        "udf11": null,
        "udf12": null,
        "udf13": null,
        "udf14": null,
        "udf15": null,
        "udf16": null,
        "udf17": null,
        "udf18": null,
        "udf19": null,
        "udf20": null,
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



    // <td>{item.txn_id}</td>
    //                                                 <td>{item.client_txn_id}</td>
    //                                                 <td>{item.challan_no}</td>
    //                                                 <td>
    //                                                     {Number.parseFloat(item.payee_amount).toFixed(2)}
    //                                                 </td>
    //                                                 <td>{convertDate(item.trans_date)}</td>
    //                                                 <td>{item.status}</td>
    //                                                 <td>{item.payee_first_name}</td>
    //                                                 <td>{item.payee_lst_name}</td>
    //                                                 <td>{item.payee_mob}</td>
    //                                                 <td>{item.payee_email}</td>
    //                                                 <td>{item.client_code}</td>
    //                                                 <td>{item.payment_mode}</td>
    //                                                 <td>{item.payee_address}</td>
    //                                                 <td>{item.encrypted_pan}</td>
    //                                                 <td>{item.udf1}</td>
    //                                                 <td>{item.udf2}</td>
    //                                                 <td>{item.udf3}</td>
    //                                                 <td>{item.udf4}</td>
    //                                                 <td>{item.udf5}</td>
    //                                                 <td>{item.udf6}</td>
    //                                                 <td>{item.udf7}</td>
    //                                                 <td>{item.udf8}</td>
    //                                                 <td>{item.udf9}</td>
    //                                                 <td>{item.udf10}</td>
    //                                                 <td>{item.udf11}</td>
    //                                                 <td>{item.udf12}</td>
    //                                                 <td>{item.udf13}</td>
    //                                                 <td>{item.udf14}</td>
    //                                                 <td>{item.udf15}</td>
    //                                                 <td>{item.udf16}</td>
    //                                                 <td>{item.udf17}</td>
    //                                                 <td>{item.udf18}</td>
    //                                                 <td>{item.udf19}</td>
    //                                                 <td>{item.udf20}</td>
    //                                                 <td>{item.gr_number}</td>
    //                                                 <td>{item.bank_message}</td>
    //                                                 <td>{item.ifsc_code}</td>
    //                                                 <td>{item.payer_acount_number}</td>
    //                                                 <td>{item.bank_txn_id}</td>
    return (
        <div className="modal fade mymodals show d-flex justify-content-end">
            <div className={`modal-dialog m-0 ${classes.z_index_99999}`} >
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Sabpaisa Transaction ID : 123412341234</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Client Transaction ID</th>
                                    <td>{transactionData.client_txn_id}</td>
                                    <th>Amount</th>
                                    <td>{Number.parseFloat(transactionData.payee_amount).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TransactionDetailModal