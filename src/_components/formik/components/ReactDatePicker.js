import React from "react";
// import DatePicker from 'react-datepicker';
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
// import "react-datepicker/dist/react-datepicker.css";

function ReactDatePicker(props) {
  const { name, label, lableClassName, errorMsg, ...rest } = props;
  return (
    <React.Fragment>
      {(typeof label !== "undefined") && (
        <label htmlFor={name} className={lableClassName}> {label}</label>
      )}
      <DatePicker name={name} {...rest} />
      <p className="text-danger">
        {errorMsg}
      </p>
    </React.Fragment>
  );
}
export default ReactDatePicker;
