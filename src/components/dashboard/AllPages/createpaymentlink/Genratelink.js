import React, { useState } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom';

const initialValues = {
  Amount: "",
  Remarks: "",
  LinkValidToDate: ""
}


const validationSchema = Yup.object().shape({
  Amount: Yup.string().required("Required"),
  Remarks: Yup.string().required("Required"),
  Date: Yup.string().required("Required")
})

const Genratelink = (props) => {
let history = useHistory();
  console.log(props);
  // var id=""
  var { customer_id } = props.generatedata;


  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredPurpose, setEnteredPurpose] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [passwordcheck, setPasswordCheck] = useState(false);




  const { user } = useSelector((state) => state.auth);


  const [data, setData] = useState([])
  // var clientSuperMasterList = user.clientSuperMasterList;
  // const { clientCode } = clientSuperMasterList[0]

  let clientSuperMasterList=[];
    let clientCode ='';
    if(user && user.clientSuperMasterList===null){
        history.push('/dashboard/profile');
      }else{
        clientSuperMasterList = user.clientSuperMasterList;
        clientCode =  clientSuperMasterList[0].clientCode;
      }
  // console.log(customer_type_id);



  const generateHandler = async (e) => {
    const linkdata = {

      Customer_id: customer_id,
      Amount: enteredAmount,
      Remarks: enteredPurpose,
      valid_to: dateFormat(enteredDate),
      Client_Code: clientCode,
      name_visiblity: true,
      email_visibilty: true,
      phone_number_visibilty: true,
      isMerchantChargeBearer: true,
    };

    console.log(linkdata);

    const response = await axios
      .post(`https://paybylink.sabpaisa.in/paymentlink/addLink?Customer_id=${customer_id}&Remarks=${e.Remarks}&Amount=${e.Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(e.Date)}&isMerchantChargeBearer=true&isPasswordProtected=${passwordcheck}`, {
        Amount:e.Amount,
        Remarks:e.Remarks,
        Date:e.Date,
        client_code: clientCode,
        LinkValidToDate: e.LinkValidToDate

      })
      
      
      .then((response) => {
        toast.success("Payment Link Created!")
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
        toast.error("Payment Link Creation Failed ")
      });



   document.getElementById("checkbox_pass").checked = false;


  }


  const dateFormat = (enteredDate) => {
    return (
      enteredDate + '%20' + hours + ':' + minutes
    );
  };
  const handleCheck = (e) => {                 //for checkbox
    setPasswordCheck(e.target.checked);
  };
  const cancelClick = () => {

    setEnteredAmount("");
    setEnteredDate("");
    setEnteredPurpose("");
    setHours("");
    setMinutes("");

    document.getElementById("checkbox_pass").checked = false;
  }
  const closeClick = () => {

    

    document.getElementById("checkbox_pass").checked = false;

  }

  return (
    <div
      class="modal fade"
      id="bhuvi"

      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
        <Formik initialValues={{
              Amount: "",
              Remarks: "",
              Date:""

            }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                generateHandler(values)
                resetForm()
              }}
            >
              {({ resetForm }) => (
                <>


          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <b> Genrate Link</b>
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={resetForm}
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div class="form-check">
              <label
                class="form-check-label"
                for="exampleCheck1"
                style={{ marginLeft: 200, marginBottom: 20 }}
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  onChange={handleCheck}

                  value={passwordcheck}
                  id="checkbox_pass"
                />
                is Password Protected
              </label>

            </div>
          </div>
          <div class="modal-body">
           
                <Form >


                  <br />

                  <div class="row">
                    <div class="col">
                      <label for="exampleInputEmail1">
                        Amount
                      </label>
                      <Field
                        type="number"
                        min="1"
                        step="1"
                        onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                        name="Amount"
                        autoComplete="off"


                        class="form-control"

                      />
                      <ErrorMessage name="Amount">
                        {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div class="col">
                      <label for="exampleInputEmail1">
                        Remarks
                      </label>
                      <Field
                        type="text"
                        name="Remarks"
                        autoComplete="off"
                        class="form-control"
                            /> 
                            <ErrorMessage name="Remarks">
                        {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                      </ErrorMessage>

                    </div>
                  </div>

                  <div class="row">
                    <div class="col">
                      <label>Link Valid To Date</label>
                      <Field
                        type="date"
                        name="Date"
                        className="ant-input"
                        min={new Date().toLocaleDateString('en-ca')}
                       />
                      <ErrorMessage name="Date">
                        {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div class="col">
                      <label>Hours</label>
                      <br />
                      <select style={{ width: 80 }} value={hours} onChange={(e) => setHours(e.target.value)}>
                        <option selected>Hours</option>
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



                      </select>
                    </div>
                    <div class="col">
                      <label>Minutes</label>
                      <br />
                      <select style={{ width: 100 }} value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                        <option selected>Minutes</option>
                        <option value='00'>00</option>
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
                        <option value="2">26</option>
                        <option value="27">27</option>
                        <option value="28">28</option>
                        <option value="29">29</option>
                        <option value="30">30</option>
                        <option value="31">31</option>
                        <option value="32">32</option>
                        <option value="33">33</option>
                        <option value="34">34</option>
                        <option value="35">35</option>
                        <option value="35">36</option>
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
                        <option value="55">56</option>
                        <option value="57">57</option>
                        <option value="58">58</option>
                        <option value="59">59</option>
                        <option value="60">60</option>

                      </select>
                    </div>
                  </div>
                  <div>
                    <div class="modal-footer">
                      <button
                        type="submit"
                        style={{ postion: "relative", top: 200, left: 280 }}
                        class="btn btn-primary "
                      >
                        SUBMIT
                      </button>
                      <button
                        type="button"
                        style={{ postion: "absolute", top: 290, left: 380 }}
                        class="btn btn-danger"
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
