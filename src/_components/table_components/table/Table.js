import React from "react";

const Table = (props) => {

  const rowData = () => {
    const data = props?.row;
    return (
      <>
        {data.map((data, key) => (
          <th>{data.row_name}</th>
        ))}
      </>
    );
  };
  
  return (
    <>
      {" "}
      <table className="table table-bordered table-responsive">
        <thead>
          <tr>{rowData()}</tr>
        </thead>
        <tbody>{props?.col()}</tbody>
      </table>
    </>
  );
};
export default Table;
