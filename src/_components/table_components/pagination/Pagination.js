import React, { useEffect, useState } from "react";
const Paginataion = ({
  dataCount,
  pageSize,
  currentPage,
  changeCurrentPage,
}) => {
  const [displayPageNumber, setDisplayPageNumber] = useState([]);

  const totalPages = Math.ceil(dataCount / pageSize);
  // console.log(totalPages,'totalPages')
  let pageNumbers = [];
  if (!Number.isNaN(totalPages)) {
    pageNumbers = [...Array(Math.max(0, totalPages + 1)).keys()].slice(1);
  }

  const nextPage = () => {
    if (currentPage < pageNumbers?.length) {
      changeCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      changeCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    let lastSevenPage = totalPages - 7;
    if (pageNumbers?.length > 0) {
      let start = 0;
      let end = currentPage + 6;
      if (totalPages > 6) {
        start = currentPage - 1;

        if (parseInt(lastSevenPage) <= parseInt(start)) {
          start = lastSevenPage;
        }
      }
      const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
        return pgNumber;
      });
      setDisplayPageNumber(pageNumber);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      {" "}
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button className="page-link" onClick={prevPage}>
            Previous
          </button>
        </li>

        {displayPageNumber?.map((pgNumber, i) => (
          <li
            key={i}
            className={
              pgNumber === currentPage ? " page-item active" : "page-item"
            }
            onClick={() => changeCurrentPage(pgNumber)}
          >
            <a href={() => false} className={`page-link data_${i}`}>
              <span>{pgNumber}</span>
            </a>
          </li>
        ))}

        <li className="page-item">
          <button
            className="page-link"
            onClick={nextPage}
            disabled={currentPage === pageNumbers[pageNumbers?.length - 1]}
          >
            Next
          </button>
        </li>
      </ul>
    </>
  );
};
export default Paginataion;
