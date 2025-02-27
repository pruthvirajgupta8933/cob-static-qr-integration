import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable, { createTheme } from "react-data-table-component";
import "./index.css";
// import SkeletonTable from "./skeleton-table";

// createTheme creates a new theme named solarized that overrides the build in dark theme
createTheme('solarized', {
  text: {
    primary: '#000000',
    // secondary: '#2aa198',
  },

  background: {
    default: 'transparent',
  },
  context: {
    // background: '#cb4b16',
    // text: '#FFFFFF',
  },
  divider: {
    default: '#000000',
  },
  action: {
    button: 'rgba(0,0,0,.54)',
    hover: 'rgba(0,0,0,.08)',
    disabled: 'rgba(0,0,0,.12)',
  },
  button: {
    default: '#000000',
    // focus: 'rgba(255,255,255,.12)',
    // hover: 'rgba(255,255,255,.08)',
  },
  header: {
    default: '#000000',
    // focus: 'rgba(255, 255, 255, .12)',
    // hover: 'rgba(255, 255, 255, .08)',
  },
}, 'dark');


//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
  rows: {
    style: {
      // border: 'none',
      border: '1px solid rgb(255, 255, 255)',
      // minHeight: '72px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      backgroundColor: '#ffffff',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000000',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
    stripedStyle: {
      backgroundColor: 'blue',
    }
  },
};

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
        className=" bg-white border-0"
        columns={props?.row}
        data={props?.data}
        sortIcon={
          <span>
            <i className="fa fa-long-arrow-up p-0 my-1" style={{ width: "7px" }}></i>
            <i className="fa fa-long-arrow-down p-0 my-1" style={{ width: "7px" }}></i>
          </span>}
        fixedHeader={fixedHeaderFooter}
        onRowClicked={props.onRowClick}
        fixedHeaderScrollHeight={props?.fixedHeaderScrollHeight}
        theme="solarized"
        customStyles={customStyles}
      // fixedHeader={true}
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
