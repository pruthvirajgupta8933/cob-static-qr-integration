import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setSeletedGraphOption } from "../../../../../slices/date-filter-slice/DateFilterSlice";

const TransactionFilter = ({


  onApply
}) => {
  const dispatch = useDispatch();
  const [availableOptions, setAvailableOptions] = useState([]);

  const { graphSelectedOption, graphSelectedCurrentOption } = useSelector(
    (state) => state.dateFilterSliceReducer
  );




  const handleOptionChange = (event) => {
    dispatch(setSeletedGraphOption({ currentFilter: event.target.value }))
    onApply(event.target.value)


  };

  return (
    <div className="mb-2">
      {graphSelectedOption?.map((option) => (
        <div key={option} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="transactionFilter"
            value={option}
            checked={graphSelectedCurrentOption === option}
            onChange={handleOptionChange}
          />
          <label className="form-check-label text-capitalize">{option}</label>
        </div>
      ))}
    </div>
  );
};

export default TransactionFilter;
