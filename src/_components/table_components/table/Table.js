import React from "react";
import Paginataion from "../pagination/Pagination";
import DataTable from "react-data-table-component";
import "./index.css";
// import SkeletonTable from "./skeleton-table";

const Table = (props) => {
  const fixedHeaderFooter = {
    header: true,
    footer: true,
    footerOffset: 40,
    scrollX: true,
    scrollY: true,
  };

  return (
    <>
      <DataTable
        className="table table-bordered"
        columns={props.row}
        data={props.data}
        sortIcon={<i className="fa fa-arrow-up ml-1"></i>}
        fixedHeader={fixedHeaderFooter}
      // pagination
      // selectableRows
      />{" "}
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
