import React from 'react';
import ReactPaginate from 'react-paginate';
import CountPerPage from '../../subscription_components/countPerPage/CountPerPage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// import CountPerPageFilter from "../../_components/table_components/filters/CountPerPage"

const TableWithPagination = ({
    headers,
    data,
    pageCount,
    currentPage,
    onPageChange,
    renderRow,
    dataCount,
    pageSize,
    changePageSize,
    searchQuery,
    onSearchChange,
    changeCurrentPage
}) => {
    const apiHasData = dataCount > 0; // Check if API has data
    const hasSearchResults = data?.length > 0; // Check if search results exist


    // useEffect(() => {
    //     changeCurrentPage(90)
    // }, [])


    return (
        <div className="card shadow-sm mt-4">
            <div className="card-body">
                {apiHasData && (
                    <div className="d-flex justify-content-between mb-3">
                        <p className="card-title mb-0">
                            <strong>Total Count:</strong> {dataCount || '0'}
                        </p>
                        <div className="d-flex justify-content-end">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Here"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                                {/* <span className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span> */}
                            </div>
                        </div>
                    </div>
                )}

                <div className="table-responsive scroll overflow-auto">
                    <table className="table ">
                        <thead className="">
                            {apiHasData && (
                                <tr>
                                    {headers?.map((header, index) => (
                                        <th key={index} className="text-nowrap" style={{ fontWeight: 'normal' }}>

                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {apiHasData ? (
                                hasSearchResults ? (
                                    data.map((row, index) => renderRow(row, index))
                                ) : (
                                    <tr>
                                        <td colSpan="14" className="text-center">
                                            No Matching Data Found
                                        </td>
                                    </tr>
                                )
                            ) : (
                                <tr>
                                    <td colSpan={headers.length} className="text-center">
                                        <div style={{ padding: '24px', color: '#999', fontSize: '16px', textAlign: 'center' }}>
                                            No data found
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {apiHasData && (
                    <div className="row d-flex justify-content-between align-items-center mt-4">
                        <div className="col-lg-6 d-flex justify-content-start">
                            <ReactPaginate
                                previousLabel={"Previous"}
                                nextLabel={"Next"}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={onPageChange}
                                containerClassName={'pagination justify-content-center mb-0'}
                                activeClassName={'active'}
                                previousLinkClassName={'page-link'}
                                nextLinkClassName={'page-link'}
                                disabledClassName={'disabled'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                forcePage={currentPage - 1}
                            />
                        </div>
                        <div className="col-lg-6 d-flex justify-content-end">


                            <CountPerPage
                                pageSize={pageSize}
                                dataCount={dataCount}
                                changePageSize={changePageSize}

                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TableWithPagination;
