import React from "react";
import { useSelector } from "react-redux";


const RateRadioMapping = (props) => {
  const { user } = useSelector((state) => state.auth);
  const username = user.clientContactPersonName;

  const onClick = (client_code) => {
    alert(
      `Chield ClientCode: ${props.chiledCode.clientCode} \n UserName: ${username}`
    );
  };
  return (

    <table className="table">
      <thead>
        <tr>
          <th scope="col">Check</th>
          <th scope="col">ClientCode</th>
          <th scope="col">Template Name</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(props?.riskTemplate)
          ? props?.riskTemplate?.map((riskTemplate, i) => (
            <tr key={i}>
              <td>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="isChecked" id="flexRadioDefault1" />

                </div>

              </td>

              <td>{riskTemplate?.client_code}</td>
              <td>{riskTemplate?.rate_template_name}</td>
            </tr>
          ))
          : []}

        <tr>
          <td colSpan={3}>
            <button type="button" onClick={() => onClick()} className="btn  cob-btn-primary" >Submit</button>
          </td>
        </tr>

      </tbody>
    </table>

  );
};

export default RateRadioMapping;
