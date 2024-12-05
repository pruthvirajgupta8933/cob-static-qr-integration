import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
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
  const [pageCount, setPageCount] = useState(
    Math.ceil(props.dataCount / props.pageSize)
  );
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1);

  useEffect(() => {
    setPageCount(Math.ceil(props.dataCount / props.pageSize));
  }, [props.dataCount, props.pageSize]);

  useEffect(() => {
    setCurrentPage(props.currentPage);
  }, [props.currentPage]);

  const handlePageClick = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    props.changeCurrentPage(newPage);
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
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={window.innerWidth < 500 ? 3 : 5}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          activeClassName={"active"}
          previousLinkClassName={"page-link"}
          nextLinkClassName={"page-link"}
          disabledClassName={"disabled"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          forcePage={currentPage - 1}
        />
      )}
    </>
  );
};
export default Table;
