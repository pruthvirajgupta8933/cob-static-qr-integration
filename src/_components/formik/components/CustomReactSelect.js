import React from "react";
import { useField, useFormikContext } from "formik";
import ReactSelect from "react-select";

const CustomReactSelect = ({ label, onChange, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  const handleChange = (option) => {
    setFieldValue(props.name, option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={props.name}>{label}</label>
      <ReactSelect
        {...props}
        id={props.name}
        value={field.value}
        onChange={handleChange}
      />
      {meta.touched && meta.error ? (
        <div className="text-danger">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CustomReactSelect;
