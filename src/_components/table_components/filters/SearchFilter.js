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
  const [errorMessage, setErrorMessage] = useState("");

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   kycSearch(searchQueryText, "text");
  //   searchByText(searchQueryText);
  // };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQueryText.length < 3) {
      setErrorMessage("Please enter at least 3 characters.");
    } else {
      kycSearch(searchQueryText, "text");
      searchByText(searchQueryText);
      setErrorMessage("");
    }
  };
  const clearFilter = () => {
    kycSearch("", "text");
  };

  return (
    <React.Fragment>
      <label>Search</label>
      <form onSubmit={handleSearchSubmit}>
        <div className="input-group mb-0 ">
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
                <i className="fa fa-search" ariaHidden="true"></i>
              </button>
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="error-message text-danger mt-1">
            {errorMessage}
          </div>
        )}

        {filterbtn && searchText !== "" && (
          <div
            onClick={() => {
              clearFilter();
              setsearchQueryText("");
              showfilterbtn(false);
            }}
            className="border p-1 clearfilter"
          >
            <i className="fa fa-times"ariaHidden="true">
              {" Clear Filter"}
            </i>
          </div>
        )}
      </form>
    </React.Fragment>
  );
};
export default SearchFilter;
