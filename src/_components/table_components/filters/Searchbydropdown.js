import React, { useState,useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

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
        refData = refData.filter(function (item) {
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
  const[selectedValue,setSelectedValue]=useState()


// // handler (e, text){
//   kycSearch(e, text)
//   setSelectedValue(e)

// }

const changeHandler = (e,text) => {
  kycSearch(e, text)
  setSelectedValue(e)
};


  return (
    <div>
      <div>
        <label>Onboard Type</label>
        <select
          className="form-select"
          onChange={(e) =>changeHandler (e.target.value, "dropdown")}
        >
          {optionSearchData &&
            optionSearchData.map((data) => (
              <option key={uuidv4()} value={data.value} selected={selectedValue === data.value} >
                {data.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
