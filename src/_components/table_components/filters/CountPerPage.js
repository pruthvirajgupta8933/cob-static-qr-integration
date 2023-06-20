import React from "react";
import DropDownCountPerPage from "../../reuseable_components/DropDownCountPerPage";
const CountPerPage = ({ pageSize, dataCount, changePageSize }) => {
  return (
    <div>
      {" "}
      <label>Count Per Page</label>
      <select
        value={pageSize}
        rel={pageSize}
        onChange={(e) => changePageSize(parseInt(e.target.value))}
        className="form-select"
      >
        <DropDownCountPerPage datalength={dataCount} />
      </select>
    </div>
  );
};
export default CountPerPage;
