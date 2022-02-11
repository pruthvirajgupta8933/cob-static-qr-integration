import React, {useState} from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';
import {toast} from 'react-toastify';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const initialValues={
  Amount:"",
  Remarks:"",
  LinkValidToDate:""
}


const validationSchema = Yup.object().shape({
  Amount: Yup.string().required("Required"),
  Remarks: Yup.string().required("Required"),
  Date: Yup.string().required("Required")
})

 const Genratelink = (props) => {

  console.log(props);
  // var id=""
  var {customer_id} = props.generatedata;


  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredPurpose, setEnteredPurpose] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
 



  const { user } = useSelector((state) => state.auth);
   

  const [data, setData] = useState([])
  var clientSuperMasterList = user.clientSuperMasterList;
  const { clientCode } = clientSuperMasterList
  
  // console.log(customer_type_id);



    const generateHandler = async(e) => {

        e.preventDefault();

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
            .post(`https://paybylink.sabpaisa.in/paymentlink/addLink?Customer_id=${customer_id}&Remarks=${enteredPurpose}&Amount=${enteredAmount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(enteredDate)}&isMerchantChargeBearer=true&isPasswordProtected=false`, {
      
             })
            .then((resp) => {
              toast.success("Payment Link Created!")
              console.log(JSON.stringify(resp.data));
            })
            .catch((error) => {
              console.log(error);
              toast.error("Payment Link Creation Failed ")
            });



            setEnteredAmount("");
            setEnteredDate("");
            setEnteredPurpose("");
            setHours("");
            setMinutes("");

          }


    const dateFormat = (enteredDate) => {
        return (
          enteredDate+'%20'+hours+':'+minutes
        );
      };

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
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
           Genrate Link
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            >
                 {(props) => (
          <Form onSubmit={generateHandler}>
            

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
                  onKeyDown={(e) =>["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
                  name="Amount"
                  autoComplete="off"
                  value={enteredAmount}
                  onChange={(e) => setEnteredAmount(e.target.value)}
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
                  value={enteredPurpose}
                  onChange={(e) => setEnteredPurpose(e.target.value)}
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
                  value={enteredDate}                     
                  onChange={(e) => setEnteredDate(e.target.value)}
                  
                />
                 <ErrorMessage name="Date">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>
              </div>
              <div class="col">
                <label>Hours</label>
                <br />
                <select style={{ width: 80 }}  value= {hours} onChange={(e) => setHours(e.target.value)}>
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
                <select style={{ width: 100 }} value = {minutes} onChange={(e) => setMinutes(e.target.value)}>
                  <option selected>Minutes</option>
                  <option value='00'>0</option>
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
                >
                  CANCEL
                </button>
              </div>
            </div>
          </Form>
                 )}
          </Formik>
          </div>
          </div>
          </div>
          </div>
  )




  
}


export default Genratelink;
