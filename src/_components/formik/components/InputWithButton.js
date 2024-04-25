import React from "react";
import { Field, ErrorMessage } from "formik";

function InputWithButton(props) {
  const { type, className, onChange, name, label, lableClassName, inputValue, placeholder } = props;
  const { buttonComponent, buttonIcon, isVerified, inputVerification } = props;

  const verifyHandler = (val) => {
    inputVerification(val)
  }
  return (
    <React.Fragment>

      {typeof label !== "undefined" && (
        <label htmlFor={name} className={lableClassName}> {label}</label>
      )}
      <div className="input-group mb-3">
        <Field type={type} className={className} onChange={onChange} name={name} placeholder={placeholder} />
        {isVerified ? buttonIcon :
          <button className="btn cob-btn-primary btn-sm" type="button" id="button-addon2" onClick={() => verifyHandler(inputValue)}>verify</button>}
      </div>

      <ErrorMessage name={name}>{msg => <p className="text-danger">{msg}</p>}</ErrorMessage>

    </React.Fragment>
  );
}
export default InputWithButton;
