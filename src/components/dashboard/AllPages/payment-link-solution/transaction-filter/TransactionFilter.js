import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { durationFilter } from "../durationFilter";
import { setSeletedGraphOption } from "../../../../../slices/date-filter-slice/DateFilterSlice";

const TransactionFilter = ({
  // fromDate,
  // toDate,
  selectedOption,
  setSelectedOption,
  onApply
}) => {
  const dispatch = useDispatch();
  const [availableOptions, setAvailableOptions] = useState([]);

  const { fromDate, toDate, graphSelectedOption, graphSelectedCurrentOption } = useSelector(
    (state) => state.dateFilterSliceReducer
  );

  // console.log(state)
  // console.log(fromDate, toDate, graphSelectedOption)

  // useEffect(() => {
  //   const start = moment(fromDate, "YYYY-MM-DD");
  //   const end = moment(toDate, "YYYY-MM-DD");
  //   const daysDiff = end.diff(start, "days");
  //   // console.log("daysDiff ", daysDiff);

  //   let options = [];
  //   if (daysDiff === 0) {
  //     options = ["hourly"];
  //   } else if (daysDiff > 0 && daysDiff < 7) {
  //     options = ["daily", "hourly"];
  //   } else if (daysDiff >= 7 && daysDiff <= 60) {
  //     options = ["weekly", "daily"];
  //   } else if (daysDiff > 60 && daysDiff <= 366) {
  //     options = ["monthly", "weekly"];
  //   } else options = ["annually", "monthly"];

  //   setAvailableOptions(options);
  //   setSelectedOption(options[0]);
  // }, [fromDate, toDate]);

  const handleOptionChange = (event) => {
    // const dateDuration = durationFilter({ fromDate, toDate })
    dispatch(setSeletedGraphOption({ currentFilter: event.target.value }))
    onApply(event.target.value)
    // console.log("sssssdsdsds", dateRange)
    // onApply({ fromDate, toDate, dateRange })

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
