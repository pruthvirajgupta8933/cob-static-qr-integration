import React from "react";
import Table from "../../../../_components/table_components/table/Table";
import DateFormatter from "../../../../utilities/DateConvert";
// import { useSelector } from "react-redux";

function WalletDetail({ isLoading, walletDisplayData, walletCommission }) {
  let purchaseAmt = 0;
  if (walletDisplayData && Array.isArray(walletDisplayData)) {
    purchaseAmt = walletDisplayData
      .filter(
        (data) =>
          data &&
          data.mandateStatus &&
          data.mandateStatus.toLowerCase() === "success"
      )
      .reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.purchaseAmount || 0),
        0
      );
  }

  // const { manualSubscriptions } = useSelector((state) => state.subscription);

  const rowHeader = [
    {
      id: "2",
      name: "Application Name",
      selector: (row) => row.applicationName,
    },
    {
      id: "4",
      name: "Plan Name",
      selector: (row) => row.planName,
    },

    {
      id: "3",
      name: "Purchase Amount",
      selector: (row) => parseFloat(row.purchaseAmount).toFixed(2),
    },

    {
      id: "5",
      name: "Subscription Status",
      selector: (row) => row.subscription_status,
    },
    {
      id: "6",
      name: "Mandate Start Date",
      selector: (row) => DateFormatter(row.mandateStartTime, false),
    },
  ];

  return (
    <div className="row">
      <div className="col-lg-12 my-2">
        <span className="font-size-14">
          Total Purchase Amount: {purchaseAmt.toFixed(2)} | Commission:{" "}
          {parseFloat(walletCommission).toFixed(2)} | Wallet Balance:{" "}
          {(purchaseAmt - parseFloat(walletCommission)).toFixed(2)}
        </span>{" "}
      </div>
      <div className="scroll overflow-auto">
        <Table row={rowHeader} dataCount={0} data={walletDisplayData} />
      </div>
    </div>
  );
}

export default WalletDetail;
