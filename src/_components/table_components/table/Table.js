import React from "react";
import Paginataion from "../pagination/Pagination";

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
      <table className="table table-bordered">
        <thead>
          <tr>{rowData()}</tr>
        </thead>
        <tbody>{props?.col()}</tbody>
      </table>
      <Paginataion dataCount={props.dataCount} pageSize={props.pageSize} currentPage={props.currentPage}  changeCurrentPage={props.changeCurrentPage} />
    </>
  );
};
export default Table;