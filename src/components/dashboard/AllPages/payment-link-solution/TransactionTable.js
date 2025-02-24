import React from "react";
import { Link } from 'react-router-dom'

const TransactionTable = ({ data }) => {


  return (
    <div className="card shadow-sm rounded-3">
      <div className="card-body">
        <h6 className="card-title ">Recent Transactions</h6>
        <div className="table-responsive shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Payer Name</th>
                <th>Transaction ID</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((txn, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{txn.payer_name}</td>
                  <td>{txn.sabpaisa_trans_id}</td>
                  <td>{txn.payer_email}</td>
                  <td>₹{txn.trans_amount}</td>
                  <td>{txn.trans_mode}</td>
                  <td>{txn.trans_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-3">
          <Link to="/dashboard/recent-transaction" className="text-decoration-none">
            See More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
