import React from "react";
// import { Field, ErrorMessage } from "formik";
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
function ReactDatePicker(props) {
  const { name, label, lableClassName,errorMsg, ...rest } = props;
  return (
    <React.Fragment>
      {typeof label !== "undefined" && (
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
