import React from "react";
import { Field, ErrorMessage } from "formik";
import "./index.css";

function Select(props) {
  const { label, name, options, ...rest } = props;

  return (
    <React.Fragment>
      {typeof label !== "undefined" ? (
        <label htmlFor={name}> {label}</label>
      ) : (
        <></>
      )}
      <Field
        as="select"
        className="form-control form-select"
        id={name}
        name={name}
        {...rest}
      >
        {options.map((option, i) => {
          return (
            <option
              key={i}
              value={props.valueFlag ? option.value : option.key}
              datakey={i}
              disabled={option?.disabled}
            >
              {option?.value}
            </option>
          );
        })}
      </Field>
      <p className="text-danger">
        <ErrorMessage name={name} />
      </p>
    </React.Fragment>
  );
}

export default Select;
