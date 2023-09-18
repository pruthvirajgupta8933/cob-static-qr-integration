import React from "react";
import { Field, ErrorMessage } from "formik";

function InputWithButton(props) {
  const { name, label, lableClassName, button, inputValue, ...rest } = props;
  console.log("value",inputValue);
  return (
    <React.Fragment>

      {typeof label !== "undefined" && (
        <label htmlFor={name} className={lableClassName}> {label}</label>
      )}
      <div class="input-group mb-3">
        <Field name={name} {...rest} />

        {button?.isVerified ?  button.icon : button.component }
      </div>

      <ErrorMessage name={name}>{msg => <p className="text-danger">{msg}</p>}</ErrorMessage>

    </React.Fragment>
  );
}
export default InputWithButton;
