import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import DataTable, { createTheme } from "react-data-table-component";
import CustomLoader from "../../../_components/loader"
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
    // default: '#ffffff',
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
      border: '1px solid rgb(107, 107, 107)',
      // minHeight: '72px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      backgroundColor: '#ffffff',
      fontSize: '14px',
      color: '#727272',
    },
  },
  cells: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: 'rgb(201, 201, 201)',
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',

    },
    stripedStyle: {
      backgroundColor: 'blue',
    }
  },
};

const Table = ({ dataCount, pageSize, changeCurrentPage, currentPage, row, data, loadingState, onRowClick, fixedHeaderScrollHeight, ...rest }) => {
  const fixedHeaderFooter = {
    header: true,
    footer: true,
    footerOffset: 40,
    scrollX: true,
    scrollY: true,
  };
  const [pageCount, setPageCount] = useState(
    Math.ceil(dataCount / pageSize)
  );
  const [currentPageTable, setCurrentPagetable] = useState(currentPage || 1);

  useEffect(() => {
    setPageCount(Math.ceil(dataCount / pageSize));
  }, [dataCount, pageSize]);

  useEffect(() => {
    setCurrentPagetable(currentPage);
  }, [currentPage]);

  const handlePageClick = (selectedItem) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPagetable(newPage);
    changeCurrentPage(newPage);
  };

  return (

    <>

      <DataTable
        className="bg-white border-0 "
        columns={row}
        data={data}
        sortIcon={
          <span>
            <i className="fa fa-long-arrow-up p-0 my-1" style={{ width: "7px" }}></i>
            <i className="fa fa-long-arrow-down p-0 my-1" style={{ width: "7px" }}></i>
          </span>}
        fixedHeader={fixedHeaderFooter}
        onRowClicked={onRowClick}
        fixedHeaderScrollHeight={fixedHeaderScrollHeight}
        theme="solarized"
        customStyles={customStyles}
        noDataComponent={
          loadingState ? (
            <CustomLoader loadingState={loadingState} />
          ) : (
            <div style={{ padding: '24px', color: '#999', fontSize: '16px', textAlign: 'center' }}>
              No data found
            </div>
          )
        }
        {...rest}

      // fixedHeader={true}
      // pagination
      // selectableRows
      />{" "}


      <div className="mt-3">
        {dataCount > 0 && (
          <ReactPaginate

            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={window.innerWidth < 500 ? 3 : 5}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center mb-0"}
            activeClassName={"active"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            forcePage={currentPage - 1}
          // className="mt-5"
          />
        )}
      </div>
    </>
  );
};
export default Table;
