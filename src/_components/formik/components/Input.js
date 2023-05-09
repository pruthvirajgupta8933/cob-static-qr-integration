import React from "react";
import { Field, ErrorMessage } from "formik";

function Input(props) {
  const { name, label, lableClassName, ...rest } = props;
  // console.log("label",label);
  return (
    <React.Fragment>
      {typeof label !== "undefined" && (
        <label htmlFor={name} className={lableClassName}> {label}</label>
      )}

      <Field name={name} {...rest} />
      <p className="text-danger">
        <ErrorMessage name={name} />
      </p>
    </React.Fragment>
  );
}
export default Input;
