import React from "react"
import { Field, ErrorMessage } from "formik"

function RadioButtons(props) {
  const { label, name, options, ...rest } = props
  return (
    <React.Fragment>
      {typeof(label)!=="undefined" && 
      <label htmlFor={name}> {label}</label>}
      <Field name={name}>
        {formik => {
          const { field } = formik
          return options.map(option => {
            return (
              <div key={option.key} className="form-check">
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
      <p className="text-danger"><ErrorMessage name={name} /></p>
    </React.Fragment>
  )
}

export default RadioButtons