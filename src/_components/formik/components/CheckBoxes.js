import React from "react"
import { Field, ErrorMessage } from "formik"

function Checkboxes(props) {
  const { label, name, options, ...rest } = props
  return (
    <React.Fragment>
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
                <label>{option?.isHyperLink && <a href={option?.hyperLink} target="_blank" rel="noreferrer">{option.key} </a> }   
                {option?.isHyperLink===false && option.key } </label>
              </div>
            )
          })
        }}
      </Field>
      <ErrorMessage name={name}>{msg => <p className="text-danger">{msg}</p>}</ErrorMessage>
    </React.Fragment>
  )
}

export default Checkboxes