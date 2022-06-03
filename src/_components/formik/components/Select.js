import React from "react"
import { Field, ErrorMessage } from "formik"

function Select(props) {
  const { label, name, options, ...rest } = props
  
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field as="select" id={name} name={name} {...rest}>
        {options.map((option,i) => {
          return (
            <option key={i} value={option.key}>
              {option.value}
            </option>
          )
        })}
      </Field>
      <p className="text-danger"><ErrorMessage name={name} /></p>
    </div>
  )
}

export default Select