import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik'
// import * as Yup from 'yup'
import axios from "axios";
import { toast, Zoom } from 'react-toastify';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API_URL from "../../../../config";
import { v4 as uuidv4 } from 'uuid';
import FormikController from "../../../../_components/formik/FormikController";
import moment from "moment";
import toastConfig from "../../../../utilities/toastTypes";
import Yup from "../../../../_components/formik/Yup";

function FormPaymentLink(props) {
  const { loaduser } = props;

  const [drop, setDrop] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const [passwordcheck, setPasswordCheck] = useState(false);
  const [disable, setDisable] = useState(false)

  let history = useHistory();

  const { user } = useSelector((state) => state.auth);



  let clientMerchantDetailsList = [];
  let clientCode = '';
  if (user && user.clientMerchantDetailsList === null) {
    // console.log("formpaymet link");
    history.push('/dashboard/profile');
  } else {
    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;
  }

  const validationSchema = Yup.object().shape({
    Amount: Yup.string().required("Required!"),
    Remarks: Yup.string().required("Required!"),
    Date: Yup.string().required("Required!"),
    Customer_id: Yup.string().required("Required!"),


  })



  const getDrop = async (e) => {
    const currentData = moment().format('YYYY-MM-DD');

    await axios
      .get(`${API_URL.GET_CUSTOMERS}${clientCode}/2015-01-01/${currentData}`)
      .then((res) => {
        setDrop(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };


  useEffect(() => {
    getDrop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheck = (e) => {                 //for checkbox
    setPasswordCheck(e.target.checked);
  };


  const submitHandler = async (e) => {
    setDisable(true)
    toast.info("In process", {
      position: "top-right",
      autoClose: 2000,
      transition: Zoom,
      limit: 2,
    })
    await axios
      .post(`${API_URL.ADD_LINK}?Customer_id=${e.Customer_id}&Remarks=${e.Remarks}&Amount=${e.Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(e.Date)}&isMerchantChargeBearer=true&isPasswordProtected=${passwordcheck}`)
      .then(resp => {
        if (resp.data?.response_code === '1') {
          toastConfig.successToast(resp.data?.message?.toUpperCase());
          loaduser();
        } else {
          toastConfig.errorToast(resp.data?.message?.toUpperCase());
        }
        setDisable(false)
      }).catch(err => {
        setDisable(false)
        toastConfig.errorToast("something went wrong")
      })
  };

  const dateFormat = (enteredDate) => {
    return (
      enteredDate + '%20' + hours + ':' + minutes
    );
  };


  const hoursArr = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];


  return (

    <div
      className="mymodals modal fade"
      id="exampleModal"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      ariaHidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <Formik initialValues={{
            Amount: "",
            Remarks: "",
            Date: "",
            Customer_id: "",
          }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              submitHandler(values)
              resetForm()
            }}>
            {({ resetForm }) => (
              <>
                <div className="modal-header">
                  <div className="modal-title" id="exampleModalLabel">
                    <h6 className="fw-bold">Create Payment Link</h6>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={resetForm}
                  >
                    <span ariaHidden="true">&times;</span>
                  </button>
                </div>
                <div className="container">
                  <Form>

                    <div className="form-row mb-2">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={handleCheck}
                          value={passwordcheck}
                          id="checkbox_pass"
                        />
                        <label className="form-check-label" htmlFor="exampleCheck1" >  Is Password Protected</label>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>Select Payer Details</label>
                        <Field className="form-control" component='select'
                          name='Customer_id'
                        >
                          <option value="">Select Payer</option>
                          {drop.map((payer, i) => (
                            <option value={payer.id} key={uuidv4()}>
                              {payer.name} - {payer.email}
                            </option>
                          ))}
                        </Field>
                        {<ErrorMessage name="Customer_id">
                          {msg => <p className="abhitest text-danger" >{msg}</p>}
                        </ErrorMessage>}
                      </div>
                      <div className="form-group col-md-6">
                        <label>
                          Payment to be Collected (INR)
                        </label>
                        <Field
                          type="number"
                          min="1"
                          step="1"
                          onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                          name="Amount"
                          autoComplete="off"
                          className="form-control"
                          placeholder="Enter Payment Amount"
                        />
                        {<ErrorMessage name="Amount">
                          {msg => <p className="abhitest text-danger">{msg}</p>}
                        </ErrorMessage>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label >
                          Purpose of Payment
                        </label>
                        <Field
                          type="text"
                          name="Remarks"
                          autoComplete="off"
                          className="form-control"
                          placeholder="Enter Purpose of Payment"
                        />
                        {<ErrorMessage name="Remarks">
                          {msg => <div className="abhitest text-danger" >{msg}</div>}
                        </ErrorMessage>}

                      </div>
                      <div className="form-group col-md-6">
                        <label>Select Date</label>
                        <Field
                          name="Date"
                          type="date"
                          className="form-control"
                          min={new Date().toLocaleDateString('en-ca')}
                          placeholder="From Date"
                        />
                        {<ErrorMessage name="Date">
                          {msg => <div className="abhitest text-danger" >{msg}</div>}
                        </ErrorMessage>}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>Hours</label>

                        <Field component='select' className="form-select" name='hours' value={hours} onChange={(e) => setHours(e.target.value)}>
                          <option value="" >Hours</option>
                          {hoursArr.map((val, i) => (
                            <option value={val} key={uuidv4()}>{val}</option>
                          ))}
                        </Field>


                      </div>
                      <div className="form-group col-md-6">
                        <label>Minutes</label>

                        <Field component='select' className="form-select" name='minutes' value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                          <option value="">Minutes</option>
                          {[...Array(60)].map((_, index) => (
                            <option key={index} value={index.toString().padStart(2, '0')}>
                              {index.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </Field>

                      </div>
                    </div>
                    <div className="form-row">
                      <button
                        type="submit"
                        className="btn btn-sm cob-btn-primary  mb-3 text-white"
                        disabled={disable}
                      >
                        {disable && (
                          <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                        )} {/* Show spinner if disabled */}
                        Submit
                      </button>
                      <button onClick={resetForm}
                        type="button"
                        className="btn btn-sm  cob-btn-secondary mb-3 text-white ml-3"
                        data-dismiss="modal"
                      >
                        CANCEL
                      </button>
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

export default FormPaymentLink