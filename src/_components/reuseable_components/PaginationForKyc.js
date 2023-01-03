import React from "react";

const Pagination = ({ nPages, currentPage, setCurrentPage }) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <a className="page-link" onClick={prevPage} href="#">
            Previous
          </a>
        </li>
        {pageNumbers.map((pgNumber, i) => (
          <li
            key={i}
            className={
              pgNumber === currentPage ? " page-item active" : "page-item"
            }
          >
            <a href={() => false} className={`page-link data_${i}`}>
              <span onClick={() => setCurrentPage(pgNumber)}>{pgNumber}</span>
            </a>
          </li>
        ))}
        {pageNumbers !== 0 ? (
          <li className="page-item">
            <button className="page-link" onClick={nextPage}>
              Next
            </button>
          </li>
        ) : (
          <li className="page-item">
            <button className="page-link" disabled>
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
