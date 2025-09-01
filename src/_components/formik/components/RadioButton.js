import React from "react"
import { Field, ErrorMessage } from "formik"
import { v4 as uuidv4 } from 'uuid';

function RadioButtons(props) {
  const { label, name, options, ...rest } = props
  return (
    <React.Fragment>
      {typeof (label) !== "undefined" &&
        <label htmlFor={name}> {label}</label>}
      <Field name={name}>
        {formik => {
          const { field } = formik
          return options.map(option => {
            return (
              <div key={uuidv4()} className="form-check">
                <input
                  type="radio"
                  id={option.value}
                  {...field}
                  {...rest}
                  value={option.value}
                  checked={field?.value?.toString() === option?.value?.toString()}
                />
                <label htmlFor={option.value} className="form-check-label">{option.key}</label>
              </div>
            )
          })
        }}
      </Field>
      <ErrorMessage name={name}>{msg => <p className="text-danger">{msg}</p>}</ErrorMessage>
    </React.Fragment>
  )
}

export default RadioButtons