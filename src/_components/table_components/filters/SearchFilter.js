import React, { useEffect } from "react";
const SearchFilter = ({
  searchText,
  kycSearch,
  isSearchByDropDown,
  notFilledData,
  searchByText,
  setData,
  setSearchByDropDown,
}) => {
  useEffect(() => {
    if (searchText?.length > 0) {
      // search by dropdwon
      if (isSearchByDropDown && searchText !== "") {
        let filter = {
          isDirect: searchText,
        };

        let refData = notFilledData;

        refData = refData.filter(function(item) {
          for (let key in filter) {
            if (item[key] === undefined || item[key] !== filter[key]) {
              return false;
            }
          }
          return true;
        });
        setData(refData);
      } else {
        // search by text
        searchByText();
      }
    } else {
      setData(notFilledData);
    }

    setSearchByDropDown(false);
  }, [searchText]);
  return (
    <div className="d-flex ml-3">
      {" "}
      <div className="">
      <label>Search</label>
      <input
        className="form-control"
        onChange={(e) => kycSearch(e.target.value, "text")}
        type="text"
        placeholder="Search Here"
      />
      </div>
      <div className="ml-4">
      <label>Onboard Type</label>
      <select
        className="ant-input"
        onChange={(e) => kycSearch(e.target.value, "dropdown")}
      >
        <option value="">Select Onboard Type</option>
        <option value="">All</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
      </div>
    </div>
  );
};
export default SearchFilter;
