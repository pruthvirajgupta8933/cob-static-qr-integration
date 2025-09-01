import React from "react";
import DropDownCountPerPage from "../../reuseable_components/DropDownCountPerPage";
const CountPerPage = ({ pageSize, dataCount, changePageSize, currentPage, changeCurrentPage, enableLable }) => {

  const handlerChange = (pageSize) => {
    changeCurrentPage(1)
    changePageSize(pageSize)
  }

  return (
    <div>
      {enableLable !== false && <label>Count Per Page</label>}
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
