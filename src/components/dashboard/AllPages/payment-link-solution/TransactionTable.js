import React from "react";
import { Link } from 'react-router-dom'
import Table from "../../../../_components/table_components/table/Table";
import DateFormatter from "../../../../utilities/DateConvert";
import { transactionStatusColorArr } from "../../../../utilities/colourArr";

const TransactionTable = ({ data }) => {
  const rowData = [
    {
      id: "0",
      name: "S No.",
      selector: (row) => row.serial_number,
      sortable: true,
      width: "70px"
    },
    {
      id: "1",
      name: "Client Code",
      selector: (row) => row.client_code,
    },
    {
      id: "2",
      name: "Name of Payer",
      selector: (row) => row.payer_name,
      sortable: true,
      width: "200px"
    },
    {
      id: "3",
      name: "Mobile No.",
      selector: (row) => row.payer_mobile,
      width: "120px"
    },
    {
      id: "4",
      name: "Email ID",
      selector: (row) => row.payer_email,
      sortable: true,
      width: "180px"
    },
    {
      id: "5",
      name: "Trans Init Date",
      selector: (row) => DateFormatter(row.trans_init_date),
      sortable: true,
      width: "150px"
    },
    {
      id: "6",
      name: "Trans Complete Date",
      selector: (row) => DateFormatter(row.trans_complete_date),
      sortable: true,
      width: "150px"
    },
    {
      id: "7",
      name: "Status",
      selector: (row) => (
        <p className="border border-dark-subtle p-1 m-0 rounded-1 " style={{ backgroundColor: transactionStatusColorArr[row?.trans_status?.toString()?.toUpperCase()] }}>
          {row.trans_status}

        </p>
      ),
      sortable: true,
    },
    {
      id: "8",
      name: "Payment Mode",
      selector: (row) => row.trans_mode,

    },
  ];

  return (
    <div className="card shadow-sm rounded-3">
      <div className="card-body">
        <h6 className="card-title ">Recent Transactions</h6>
        <div className="table-responsive shadow-sm">
          <Table row={rowData}
            data={data} />
          {/* <table className="table">
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
          </table> */}
        </div>
        <div className="text-center mt-3">
          <Link to="/dashboard/recent-transaction" className="text-decoration-none">
            View More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
