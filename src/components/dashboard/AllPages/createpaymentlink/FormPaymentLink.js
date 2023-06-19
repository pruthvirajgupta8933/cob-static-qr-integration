import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios";
import { toast } from 'react-toastify';
import { Zoom } from "react-toastify";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import API_URL from "../../../../config";

function FormPaymentLink(props) {
  const{loaduser}=props;

  const [drop, setDrop] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [passwordcheck, setPasswordCheck] = useState(false);

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
    await axios
      .get(`${API_URL.GET_CUSTOMERS}${clientCode}`)
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
    toast.info("In process", {
      position: "top-right",
      autoClose: 2000,
      transition: Zoom,
      limit: 2,
    })
    await axios
      .post(`${API_URL.ADD_LINK}?Customer_id=${e.Customer_id}&Remarks=${e.Remarks}&Amount=${e.Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(e.Date)}&isMerchantChargeBearer=true&isPasswordProtected=${passwordcheck}`)
      .then((response) => {
        toast.success(response.data.message,
          {
            position: "top-right",
            autoClose: 2000,
            transition: Zoom,
            limit: 2,
          })
          loaduser();
      })
      .catch((error) => {
        toast.error('Payment Link Creation Failed', {
          position: "top-right",
          autoClose: 1000,
          transition: Zoom,
          limit: 2,
        })
        
      });
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
      aria-hidden="true"
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
                    <h5>Payment Link New Details (New Payer)</h5>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={resetForm}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="container">
                  <Form>
                      <div className="form-group col-md-12 mt-3">
                        <label
                          className="form-check-label"
                          htmlFor="exampleCheck1"
                        >
                          <input
                            type="checkbox"
                            className="col-lg-6 padbottom"
                            onChange={handleCheck}
                            value={passwordcheck}
                            id="checkbox_pass"
                          />
                          &ensp; is Password Protected
                        </label>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Select Payer Details</label>
                          <Field className="form-control" component='select'
                            name='Customer_id'
                          >
                            <option value="">Select Payer</option>
                            {drop.map((payer, i) => (
                              <option value={payer.id} key={i}>
                                {payer.name} - {payer.email}
                              </option>
                            ))}
                          </Field>
                          {<ErrorMessage name="Customer_id">
                            {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
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
                            {msg => <p style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
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
                            {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
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
                            {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                          </ErrorMessage>}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Hours</label>

                          <Field component='select'  className="form-select" name='hours' value={hours} onChange={(e) => setHours(e.target.value)}>
                            <option value="" >Hours</option>
                            {hoursArr.map((val, i) => (
                              <option value={val} key={i}>{val}</option>
                            ))}
                          </Field>
                        </div>
                        <div className="form-group col-md-6">
                          <label>Minutes</label>

                          <Field component='select'  className="form-select " name='minutes' value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                            <option value="">Minutes</option>
                            <option value="00">00</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">04</option>
                            <option value="06">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                            <option value="32">32</option>
                            <option value="33">33</option>
                            <option value="34">34</option>
                            <option value="35">35</option>
                            <option value="26">36</option>
                            <option value="37">37</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                            <option value="46">46</option>
                            <option value="47">47</option>
                            <option value="48">48</option>
                            <option value="49">49</option>
                            <option value="50">50</option>
                            <option value="51">51</option>
                            <option value="52">52</option>
                            <option value="53">53</option>
                            <option value="54">54</option>
                            <option value="55">55</option>
                            <option value="56">56</option>
                            <option value="57">57</option>
                            <option value="58">58</option>
                            <option value="59">59</option>
                          </Field>
                        </div>
                      </div>
                      <div className="form-row">
                        <button
                          type="submit"
                          className="btn btn-sm cob-btn-primary  mb-3 text-white"
                        >
                          SUBMIT
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