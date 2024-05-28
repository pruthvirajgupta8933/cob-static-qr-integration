import React from 'react';
import ReactSelect from 'react-select';
import { useField, useFormikContext } from 'formik';

const CustomSelect = ({ name, options, ...props }) => {
    // console.log("options",...props)
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (option) => {
    setFieldValue(name, option);
  };

  return (
    <div>
      <ReactSelect
        {...field}
        {...props}
        options={options}
        value={field.value}
        onChange={handleChange}
      />
      {meta.touched && meta.error ? (
        <div style={{ color: 'red' }}>{meta.error}</div>
      ) : null}
    </div>
  );
};

export default CustomSelect;
