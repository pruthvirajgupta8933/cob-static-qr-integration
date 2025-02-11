import React from "react";

const TransactionTable = () => {
    const transactions = [
        { id: 1, name: "Sukhdev Khatri", transactionId: "8765434567654", email: "example1@gmail.com", amount: 457, mode: "UPI", status: "Success" },
        { id: 2, name: "Joydeep Oosh", transactionId: "8765434567655", email: "example2@gmail.com", amount: 934, mode: "UPI QR", status: "Failed" },
    ];

    return (
        <div className="card shadow-sm rounded-3">
            <div className="card-body">
                <h6 className="card-title ">Recent Transactions</h6>
                <div className="table-responsive shadow-sm">

                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Payer Name</th>
                                <th>Transaction ID</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Mode</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{txn.name}</td>
                                    <td>{txn.transactionId}</td>
                                    <td>{txn.email}</td>
                                    <td>₹{txn.amount}</td>
                                    <td>{txn.mode}</td>
                                    <td>{txn.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></div>
        </div>
    );
};

export default TransactionTable;
