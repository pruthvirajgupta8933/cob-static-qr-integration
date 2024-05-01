import React, { useState } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom';
import API_URL from '../../../../config';


const validationSchema = Yup.object().shape({
  Amount: Yup.string().required("Required"),
  Remarks: Yup.string().required("Required"),
  Date: Yup.string().required("Required")
})

const Genratelink = (props) => {
  let history = useHistory();
  var { customer_id } = props.generatedata;
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [passwordcheck, setPasswordCheck] = useState(false);
  const [disable, setDisable] = useState(false)

  const { user } = useSelector((state) => state.auth);


  let clientMerchantDetailsList = [];
  let clientCode = '';
  if (user && user.clientMerchantDetailsList === null) {
    history.push('/dashboard/profile');

  } else {
    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;
  }




  const generateHandler = async (e) => {
    setDisable(true)
    toast.info("Please Wait...")
    await axios
      .post(`${API_URL.ADD_LINK}?Customer_id=${customer_id}&Remarks=${e.Remarks}&Amount=${e.Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(e.Date)}&isMerchantChargeBearer=true&isPasswordProtected=${passwordcheck}`, {
        Amount: e.Amount,
        Remarks: e.Remarks,
        Date: e.Date,
        client_code: clientCode,
        LinkValidToDate: e.LinkValidToDate

      })


      .then((response) => {
        toast.success(response.data.message)
        setDisable(false)

      })
      .catch((error) => {
        toast.error("Payment Link Creation Failed ")
        setDisable(false)
      });



    document.getElementById("checkbox_pass").checked = false;


  }


  const dateFormat = (enteredDate) => {
    return (
      enteredDate + '%20' + hours + ':' + minutes
    );
  };
  const handleCheck = (e) => {
    setPasswordCheck(e.target.checked);
  };
  return (
    <div
      className="mymodals modal fade"
      id="bhuvi"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <Formik initialValues={{
            Amount: "",
            Remarks: "",
            Date: ""
          }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              generateHandler(values)
              resetForm()
            }}
          >
            {({ resetForm }) => (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    <b> Generate Link</b>
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={resetForm}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>

                  <div className="form-check">


                  </div>
                </div>
                <div className="modal-body">
                  <label
                    className="form-check-label ml-3"
                    htmlFor="exampleCheck1"
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={handleCheck}
                      value={passwordcheck}
                      id="checkbox_pass"
                    />
                    Password Protected Link
                  </label>
                  <Form >
                    <br />
                    <div className="row mt-4">
                      <div className="col-lg-4">
                        <label htmlFor="exampleInputEmail1">
                          Amount
                        </label>
                        <Field
                          type="number"
                          min="1"
                          step="1"
                          onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                          name="Amount"
                          autoComplete="off"
                          className="form-control"
                        />
                        <ErrorMessage name="Amount">
                          {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                      <div className="col-lg-4">
                        <label htmlFor="exampleInputEmail1">
                          Purpose of Payment
                        </label>
                        <Field
                          type="text"
                          name="Remarks"
                          autoComplete="off"
                          className="form-control"
                          placeholder="Payment Purpose"
                        />
                        <ErrorMessage name="Remarks">
                          {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                        </ErrorMessage>

                      </div>
                      <div className="col-lg-4">
                        <label>Link Validity</label>
                        <Field
                          type="date"
                          name="Date"
                          autoComplete="off"


                          className="form-control"
                          min={new Date().toLocaleDateString('en-ca')}
                        />
                        <ErrorMessage name="Date">
                          {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="row mt-4">

                      <div className="col-lg-4">
                        <label>Hours</label>
                        <br />
                        <select value={hours} onChange={(e) => setHours(e.target.value)} className="form-select">
                          <option value="">Hours</option>
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i.toString().padStart(2, '0')}>
                              {i.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-lg-4">
                        <label>Minutes</label>
                        <br />
                        <select value={minutes} onChange={(e) => setMinutes(e.target.value)} className="form-select">
                          <option value=''>Minutes</option>
                          {[...Array(60).keys()].map((minute) => (
                            <option key={minute} value={minute.toString().padStart(2, '0')}>
                              {minute.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="modal-footer">
                        <button
                          type="submit"
                          className="btn cob-btn-primary btn-primary text-white btn-sm"
                          disabled={disable}
                        >
                          {disable && (
                            <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                          )} {/* Show spinner if disabled */}
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn cob-btn-secondary btn-danger text-white btn-sm"
                          data-dismiss="modal"
                          onClick={resetForm}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </Form>
                </div>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>

  )
}


export default Genratelink;
