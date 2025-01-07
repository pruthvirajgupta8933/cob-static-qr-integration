import React from "react";
import { Field, ErrorMessage } from "formik";

function Input(props) {
  const { name, label, lableClassName, displayMsgOutside, required, ...rest } =
    props;
  return (
    <React.Fragment>
      {/* {typeof label !== "undefined" && ( */}
      <label htmlFor={name} className={lableClassName}>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </label>
      {/* )} */}
      <Field name={name} {...rest} />
      {displayMsgOutside === true ? null : (
        <ErrorMessage name={name}>
          {(msg) => <p className="text-danger">{msg}</p>}
        </ErrorMessage>
      )}
    </React.Fragment>
  );
}
export default Input;
