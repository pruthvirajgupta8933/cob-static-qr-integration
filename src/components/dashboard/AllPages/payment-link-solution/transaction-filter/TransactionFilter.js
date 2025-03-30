import React, { useState, useEffect } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";

const TransactionFilter = ({
  fromDate,
  toDate,
  selectedOption,
  setSelectedOption,
}) => {
  const dispatch = useDispatch();
  const [availableOptions, setAvailableOptions] = useState([]);



  useEffect(() => {
    const start = moment(fromDate, "YYYY-MM-DD");
    const end = moment(toDate, "YYYY-MM-DD");
    const daysDiff = end.diff(start, "days");
    // console.log("daysDiff ", daysDiff);

    let options = [];
    if (daysDiff === 0) {
      options = ["hourly"];
    } else if (daysDiff > 0 && daysDiff < 7) {
      options = ["daily", "hourly"];
    } else if (daysDiff >= 7 && daysDiff <= 60) {
      options = ["weekly", "daily"];
    } else if (daysDiff > 60 && daysDiff <= 366) {
      options = ["weekly", "monthly"];
    } else options = ["annually", "monthly"];

    setAvailableOptions(options);
    setSelectedOption(options[0]);
  }, [fromDate, toDate]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="mb-2">
      {availableOptions.map((option) => (
        <div key={option} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="transactionFilter"
            value={option}
            checked={selectedOption === option}
            onChange={handleOptionChange}
          />
          <label className="form-check-label text-capitalize">{option}</label>
        </div>
      ))}
    </div>
  );
};

export default TransactionFilter;
