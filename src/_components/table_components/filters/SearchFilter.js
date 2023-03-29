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
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button">
          Button
        </button>
      </div>
    </div>
  );
};
export default SearchFilter;
