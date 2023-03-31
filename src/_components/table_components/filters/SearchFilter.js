import React, { useEffect, useState } from "react";
import { SearchService } from "../../../services/search.service/search.service";
import "./index.css";
const SearchFilter = ({
  searchText,
  kycSearch,
  searchByText,
  setSearchByDropDown,
  searchTextByApiCall,
  clearFilter,
}) => {
  useEffect(() => {
    searchByText();
    setSearchByDropDown(false);
  }, [searchText]);

  const [searchQueryText, setsearchQueryText] = useState("");
  const [filterbtn, showfilterbtn] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    kycSearch(searchQueryText, 'text');
    searchByText(searchQueryText);
  };

  return (
    <div>
      <label>Search</label>
      <form onSubmit={handleSearchSubmit}>
        <div class="input-group mb-3">
          {searchTextByApiCall && (
            <input
              className="form-control"
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
            <div onClick={() => showfilterbtn(true)} class="input-group-append">
              <button class="search_butn" type="submit">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          )}
        </div>

        {(filterbtn && searchText!=="") && (
          <div
            onClick={() => {
              clearFilter(true);
              setsearchQueryText("");
              showfilterbtn(false);
            }}
            className="border p-1 clearfilter"
          >
            <i class="fa fa-times" aria-hidden="true">
              {" Clear Filter"}
            </i>
          </div>
        )}
      </form>
    </div>
  );
};
export default SearchFilter;
