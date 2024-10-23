import React, { useEffect, useState } from 'react'
import classes from "./transaction.module.css"
import moment from 'moment'

function TransactionDetailModal({ fnSetModalToggle, transactionData }) {

    const [udfToggle, setUdfToggle] = useState(false)
    useEffect(() => {

        return () => {
            setUdfToggle(false)
        }
    }, [])

    const convertDate = (dateVal) => {
        //convert only this format 2024-10-10T12:36:30Z 

        let date;
        if (dateVal === null && isNaN(date)) {
            date = "N/A"
        } else {
            // Extract date components
            const sdate = new Date(dateVal);
            const day = String(sdate?.getUTCDate()).padStart(2, '0');
            const month = String(sdate?.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = sdate?.getUTCFullYear();

            // Extract time components
            const hours = String(sdate?.getUTCHours()).padStart(2, '0');
            const minutes = String(sdate?.getUTCMinutes()).padStart(2, '0');
            const seconds = String(sdate?.getUTCSeconds()).padStart(2, '0');

            // Format the date and time
            date = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
        }

        return date;
    };

    return (
        <div className={`modal fade mymodals show d-flex justify-content-end ${classes.z_index_99999}`} data-bs-backdrop="true" data-bs-keyboard="true" tabIndex="-1" onClick={() => fnSetModalToggle(false)}>
            <div className={`modal-dialog modal-xl m-0 `} onClick={(e) => e.stopPropagation()} >
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5 border-start border-5 ps-2">Sabpaisa Transaction ID : <span className='text-primary'>{transactionData.txn_id}</span></h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => fnSetModalToggle(false)} />
                    </div>
                    <div className="modal-body">
                        <div className="mb-5">
                            <h6>Transaction Details</h6>
                            <table className={`table table-striped-columns table-bordered ${classes.table_layout_fixed}`}>
                                <tbody>
                                    <tr>
                                        <th>Client Transaction ID</th>
                                        <td>{transactionData.client_txn_id}</td>
                                        <th>Amount</th>
                                        <td>{Number.parseFloat(transactionData.payee_amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th>Transaction Date</th>
                                        <td>{convertDate(transactionData.trans_date)}</td>
                                        <th>Transaction Complete Date</th>
                                        <td>{convertDate(transactionData.trans_complete_date)}</td>
                                    </tr>
                                    <tr>
                                        <th>Bank Response</th>
                                        <td>{transactionData.bank_message}</td>
                                        <th>Bank Transaction Id</th>
                                        <td>{transactionData.bank_txn_id}</td>
                                    </tr>

                                    <tr>
                                        <th>Payment Status</th>
                                        <td>{transactionData.status}</td>
                                        <th>Client Code</th>
                                        <td>{transactionData.client_code}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>


                        <div className="mb-5">
                            <h6>Payer Details</h6>
                            <table className={`table table-striped-columns table-bordered ${classes.table_layout_fixed}`}>
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
                                    </tr>

                                </tbody>
                            </table>
                        </div>


                        <div className="mb-5">
                            <h6>Merchant Specific Parameters</h6>
                            <table className={`table table-striped-columns table-bordered ${classes.table_layout_fixed}`}>
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
                                            <p className="m-0 text-center font-bold">{udfToggle ? 'Hide UDF Values' : 'Show UDF Values ...'}</p>
                                        </td>
                                    </tr>
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