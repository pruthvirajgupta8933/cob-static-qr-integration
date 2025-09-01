import React from "react";
import { Link } from 'react-router-dom'
import Table from "../../../../_components/table_components/table/Table";
import { DateFormatAlphaNumeric } from "../../../../utilities/DateConvert";
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
      name: "Payer Name",
      selector: (row) => row.payer_name,
      sortable: true,
      width: "120px"
    },
    {
      id: "2",
      name: "Transaction ID",
      selector: (row) => row.sabpaisa_trans_id,
      sortable: true,
      width: "200px"
    },
    {
      id: "3",
      name: "Mobile No.",
      selector: (row) => row.payer_mobile,
      width: "100px"
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
      name: "Amount",
      sortable: true,
      selector: (row) => row.trans_amount,
    },

    {
      id: "6",
      name: "Transaction Date",
      selector: (row) => DateFormatAlphaNumeric(row.trans_complete_date),
      sortable: true,
      width: "150px"
    },
    {
      id: "7",
      name: "Payment Mode",
      selector: (row) => row.trans_mode,
      sortable: true,
      width: "120px"
    },
    {
      id: "8",
      name: "Status",
      selector: (row) => (
        <p className="p-1 m-0 rounded-1"
          style={{
            backgroundColor: transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.background,
            color: transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.color,
            border: `1px ${transactionStatusColorArr[row?.trans_status?.toUpperCase()]?.color} solid`
          }}>
          {row.trans_status}

        </p>
      ),
      sortable: true,
      width: "200px"
    }
  ];

  return (
    <div className="card shadow-sm rounded-3">
      <div className="card-body">
        <h6 className="card-title ">Recent Transactions</h6>
        <div className="table-responsive shadow-sm">
          <Table row={rowData}
            data={data} />

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
