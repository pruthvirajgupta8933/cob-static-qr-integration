import React from "react"
import { Field, ErrorMessage } from "formik"

function Checkboxes(props) {
  const { label, name, options, ...rest } = props
  return (
    <React.Fragment>
      <label>{label}</label>
      <Field name={name}>
        {formik => {
          const { field } = formik
          return options.map(option => {
            return (
              <div key={option.key}>
                <input
                  type="checkbox"
                  id={option.value}
                  {...field}
                  {...rest}
                  value={option.value}
                  checked={field.value.includes(option.value)}
                />
                <label>{option.key}</label>
              </div>
            )
          })
        }}
      </Field>
      <p className="text-danger"> <ErrorMessage name={name} /></p>
    </React.Fragment>
  )
}

export default Checkboxes