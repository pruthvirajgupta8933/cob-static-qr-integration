import React, { useEffect, useState } from "react";

import "./index.css";
const SearchFilter = ({
  searchText,
  kycSearch,
  searchByText,
  setSearchByDropDown,
  searchTextByApiCall,
  // clearFilter,
}) => {

  useEffect(() => {
    searchByText();
    setSearchByDropDown(false);
  }, [searchText]);

  const [searchQueryText, setsearchQueryText] = useState("");
  const [filterbtn, showfilterbtn] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    kycSearch(searchQueryText, "text");
    searchByText(searchQueryText);
  };
  const clearFilter = () => {
    kycSearch("", "text");
  };

  return (
    <React.Fragment>
      <label>Search</label>
      <form onSubmit={handleSearchSubmit}>
        <div className="input-group mb-3 ">
          {searchTextByApiCall && (
            <input
              className="form-control search-filter"
              onChange={(e) => setsearchQueryText(e.target.value, "text")}
              type="text"
              value={searchQueryText}
              placeholder="Type your search query"
            />
          )}
          {!searchTextByApiCall && (
            <input
              className="form-control"
              onChange={(e) => kycSearch(e.target.value, "text")}
              type="text"
              // value={searchQueryText}
              placeholder="Type your search query"
            />
          )}

          {searchTextByApiCall && (
            <div onClick={() => showfilterbtn(true)} className="input-group-append">
              <button className="search_butn" type="submit" title="search">
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>

        {filterbtn && searchText !== "" && (
          <div
            onClick={() => {
              clearFilter();
              setsearchQueryText("");
              showfilterbtn(false);
            }}
            className="border p-1 clearfilter"
          >
            <i className="fa fa-times" aria-hidden="true">
              {" Clear Filter"}
            </i>
          </div>
        )}
      </form>
    </React.Fragment>
  );
};
export default SearchFilter;
