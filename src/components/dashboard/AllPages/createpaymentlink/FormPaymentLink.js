import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import axios from "axios";
import { toast } from 'react-toastify';
import { Zoom } from "react-toastify";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";



function FormPaymentLink() {


    
 const [drop, setDrop] = useState([]);  
 const [hours, setHours] = useState("");
 const [minutes, setMinutes] = useState("");
 const [passwordcheck, setPasswordCheck] = useState(false);

 let history = useHistory();

 const { user } = useSelector((state) => state.auth);

 
 
 let clientSuperMasterList=[];
 let clientCode ='';
 if(user && user.clientSuperMasterList===null){
     history.push('/dashboard/profile');
   }else{
     clientSuperMasterList = user.clientSuperMasterList;
     clientCode =  clientSuperMasterList[0].clientCode;
   }

 const validationSchema = Yup.object().shape({
    Amount: Yup.string().required("Required!"),
    Remarks: Yup.string().required("Required!"),
    Date: Yup.string().required("Required!"),
    Customer_id: Yup.string().required("Required!"),
    
  })

 
 const getDrop = async (e) => {
    await axios
      .get(
        `https://paybylink.sabpaisa.in/paymentlink/getCustomers/${clientCode}`
      )
      .then((res) => {
        setDrop(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
useEffect(() => {
    getDrop();
  }, []);

  const handleCheck = (e) => {                 //for checkbox
    setPasswordCheck(e.target.checked);
  };


  const submitHandler =  async (e) => {
    

     const response = await axios
      .post(`https://paybylink.sabpaisa.in/paymentlink/addLink?Customer_id=${e.Customer_id}&Remarks=${e.Remarks}&Amount=${e.Amount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(e.Date)}&isMerchantChargeBearer=true&isPasswordProtected=${passwordcheck}`)
      .then((response) => {
        toast.success("Payment Link Created!",
        {
          position: "top-right",
          autoClose: 2000,
          transition: Zoom,
          limit: 2,
        })
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        toast.error('Payment Link Creation Failed',{
            position: "top-right",
            autoClose: 1000,
            transition: Zoom,
            limit: 2,
          })
        console.log(error);
      });
  };

  const dateFormat = (enteredDate) => {
    return (
      enteredDate+'%20'+hours+':'+minutes
    );
  };

  return (
    
    <div
    class="modal fade"
    id="exampleModal"
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
              Date:"",
              Customer_id:"",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
        submitHandler(values)
        resetForm()
        }}>
             {({ resetForm }) => (
                <>

           <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <h5>Payment Link New Details (New Payer)</h5>
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
            </div>

                <div className="container">
    


                    <div className="row">
                    <Form>
              <div class="form-check">
              <label
                class="form-check-label"
                for="exampleCheck1"
               
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
                    

                        <div className="col-lg-6 padbottom">
                            <label>Select Payer Details</label>
                      
                        <Field className="form-control" component='select'
                  name = 'Customer_id'
                 
                >
                  <option selected>Select Payer</option>
                  {drop.map((payer) => (
                    <option value={payer.id}>
                      {payer.name} - {payer.email}
                    </option>
                  ))}
                </Field>
                {<ErrorMessage name="Customer_id">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                        </div>
                        <div className="col-lg-6 padbottom">
                        <label>
                      Payment to be Collected (INR)
                    </label>
                    <Field
                      type="number"
                      min="1" 
                      step="1"
                      onKeyDown={(e) =>["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                      name="Amount" 
                      autoComplete="off"
                      onkeydown="return event.keyCode !== 69" 
                      class="form-control"
                      placeholder="Enter Payment Amount in (INR)"
                    />
                     {<ErrorMessage name="Amount">
                                                {msg => <p style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                        </div>
                        <div className="col-lg-6 padbottom">
                            <label >
                            Purpose of Payement Collection
                            </label>
                   
                    <Field
                      type="text"
                      name="Remarks"
                      autoComplete="off"
                      class="form-control"
                      placeholder="Enter Purpose of Payement Collection"
                    />
                        {<ErrorMessage name="Remarks">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
                    
                        </div>
                        <div className="col-lg-6 padbottom">
                            <label>Select Date</label>
                        <Field
                    name ="Date"
                      type="date"
                      className="ant-input- form-control"
                      min= {new Date().toLocaleDateString('en-ca')}
                      placeholder="From Date"
                    />
                         {<ErrorMessage name="Date">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
                        </div>
                        <div className="col-lg-6 padbottom">
                        <label>Hours</label>

<Field component='select' className="form-control" name = 'hours' value= {hours} onChange={(e) => setHours(e.target.value)}>
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

</Field>
                        </div>
                        <div className="col-lg-6 padbottom">
                        <label>Minutes</label>
                    
                    <Field component = 'select' className="form-control" name= 'minutes' value = {minutes} onChange={(e) => setMinutes(e.target.value)}>
                      <option selected>Minutes</option>
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
                      <option value="23">24</option>
                      <option value="23">25</option>
                      <option value="23">26</option>
                      <option value="23">27</option>
                      <option value="23">28</option>
                      <option value="23">29</option>
                      <option value="23">30</option>
                      <option value="23">31</option>
                      <option value="23">32</option>
                      <option value="23">33</option>
                      <option value="23">34</option>
                      <option value="23">35</option>
                      <option value="23">36</option>
                      <option value="23">37</option>
                      <option value="23">38</option>
                      <option value="23">39</option>
                      <option value="23">40</option>
                      <option value="23">41</option>
                      <option value="23">42</option>
                      <option value="23">43</option>
                      <option value="23">44</option>
                      <option value="23">45</option>
                      <option value="23">46</option>
                      <option value="23">47</option>
                      <option value="23">48</option>
                      <option value="23">49</option>
                      <option value="23">50</option>
                      <option value="23">51</option>
                      <option value="23">52</option>
                      <option value="23">53</option>
                      <option value="23">54</option>
                      <option value="23">55</option>
                      <option value="23">56</option>
                      <option value="23">58</option>
                      <option value="23">59</option>
                      <option value="23">60</option>
                    </Field>
                        </div>

                        <div className="col-lg-12 toppad">
                        <button
                      type="submit"
                      
                      class="btn btn-primary"
                    >
                      SUBMIT
                    </button>
                    <button onClick={resetForm}
                      type="button"
                      
                      class="btn btn-danger"
                      data-dismiss="modal"
                    >
                      CANCEL
                    </button>
                        </div>
                        </Form>
                    </div>
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