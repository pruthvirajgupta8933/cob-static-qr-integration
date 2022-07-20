import React from "react"
import { Field, ErrorMessage } from "formik"

function File(props) {
  const { name, label, ...rest } = props
  return (
    <div>
      <label htmlFor={name}> {label}</label>
      <input name="name" {...rest} />
      <p className="text-danger"> <ErrorMessage  name={name}/> </p>
    </div>
  )
}
export default File