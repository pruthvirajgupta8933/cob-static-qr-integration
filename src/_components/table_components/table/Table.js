import React, { useState, useEffect, useRef } from "react";
import Paginataion from "../pagination/Pagination";
import DataTable from "react-data-table-component";
import "./index.css";
// import 'datatables.net/css/jquery.dataTables.min.css';

const Table = (props) => {
  const rowData = () => {
    const data = props?.btnData;
    return (
      <>
        {data?.map((data, key) => (
          <>
            <th>
              <div>{data.row_name}</div>
            </th>
          </>
        ))}
      </>
    );
  };

  return (
    <>
    <div style={{ height: '500px', overflow: 'auto' }}>   
       <DataTable
          className="table table-bordered sticky-header  position-sticky"
          columns={props.row}
          data={props.data}
          sortIcon={<i  class="fa fa-arrow-up ml-1"></i>}
          // pagination
          // selectableRows
          />
          </div>
      {" "}
      {/* <table className="table table-bordered" >
        <thead>
          <tr>{rowData()}</tr>
        </thead>
        <tbody>{props?.col()}</tbody>
      </table> */}
      {props?.dataCount > 0 && (
        <Paginataion
          dataCount={props.dataCount}
          pageSize={props.pageSize}
          currentPage={props.currentPage}
          changeCurrentPage={props.changeCurrentPage}
        />
      )}
    </>
  );
};
export default Table;
