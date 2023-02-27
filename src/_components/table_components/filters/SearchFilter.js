import React, { useEffect } from "react";
const SearchFilter = ({
  searchText,
  kycSearch,
  searchByText,
  setSearchByDropDown,
}) => {
  useEffect(() => {
    searchByText();
    setSearchByDropDown(false);
  }, [searchText]);
  return (
    <div>
      <label>Search</label>
      <input
        className="form-control"
        onChange={(e) => kycSearch(e.target.value, "text")}
        type="text"
        placeholder="Search Here"
      />
    </div>
  );
};
export default SearchFilter;
