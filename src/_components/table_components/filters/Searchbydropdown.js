import React, { useEffect } from "react";
const SearchFilter = ({
  searchText,
  kycSearch,
  isSearchByDropDown,
  notFilledData,
  setData,
  setSearchByDropDown,
  optionSearchData,
}) => {
  useEffect(() => {
    if (searchText?.length > 0) {
      // search by dropdown
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
      }
    } else {
      setData(notFilledData);
    }
    setSearchByDropDown(false);
  }, [searchText]);
  return (
    <div>
      {" "}
      <div>
        <label>Onboard Type</label>
        <select
          className="ant-input"
          onChange={(e) => kycSearch(e.target.value, "dropdown")}
        >
          {optionSearchData &&
            optionSearchData.map((data) => {
              return <option value={data.value}>{data.name}</option>;
            })}
        </select>
      </div>
    </div>
  );
};
export default SearchFilter;
