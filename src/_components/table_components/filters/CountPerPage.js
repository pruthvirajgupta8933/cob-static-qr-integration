import React from "react";
import DropDownCountPerPage from "../../reuseable_components/DropDownCountPerPage";
const CountPerPage = ({ pageSize, dataCount,clientCode, changePageSize, currentPage, changeCurrentPage }) => {
  // console.log("pageSize",pageSize)
  // console.log("dataCount",dataCount)
  

  const handlerChange = (pageSize, currentPage,clientCode) => {
    // console.log("cc--pageSize",pageSize)
    // console.log("cc--currentPage",currentPage)
    if (currentPage > 1) {
      changeCurrentPage(1)
      
      changePageSize(pageSize)
    } else {
      changePageSize(pageSize)
    }
  }

  return (
    <div>
      <label>Count Per Page</label>
      <select
        value={pageSize}
        rel={pageSize}
        onChange={(e) => handlerChange(parseInt(e.target.value), currentPage)}
        className="form-select"
      >
        <DropDownCountPerPage datalength={dataCount} />
      </select>
    </div>
  );
};
export default CountPerPage;
