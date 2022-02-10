import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import _ from 'lodash';
import { toast } from 'react-toastify';
import { Zoom } from "react-toastify";
import DatePicker from 'react-date-picker';



const PaymentLinkDetail = () => {

  
  const [selectedPayer, setSelectedPayer] = useState("Select Payer");
  const [searchResults, setSearchResults] = useState([])
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredPurpose, setEnteredPurpose] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [pageSize, setPageSize] = useState(10);

  console.log(pageSize);
  console.log(typeof(pageSize));

  const [data, setData] = useState([]);
  const [paginatedata, setPaginatedData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [drop, setDrop] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [noofbuttons, setNoOfButtons ] = useState(Math.ceil(data.length/pageSize));
  const [folderArr, setFolderArr] = React.useState([]);

  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode} = clientMerchantDetailsList[0];
  console.log("clientCode", clientCode);

  

  

const validationSchema = Yup.object().shape({
    

  Amount: Yup.string().required("Required!"),
  Remarks: Yup.string().required("Required!"),
  payer: Yup.string().required("Required!"),
  date: Yup.string().required("Required!"),
  hours: Yup.string().required("Required!"),
  minutes: Yup.string().required("Required!"),
  
})



const pageCount = data ? Math.ceil(data.length/pageSize) : 0;
  // console.log('https://paybylink.sabpaisa.in/paymentlink/getLinks/'+ clientCode );

  const getDetails = async (e) => {
    await axios
      .get(`https://paybylink.sabpaisa.in/paymentlink/getLinks/${clientCode}`)
      .then((res) => {
        setData(res.data);
        setPaginatedData(_(res.data).slice(0).take(pageSize).value())
      })
      .catch((err) => {
        console.log(err);
      });
  };

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




  const getSearchTerm  = (e) => {
  setSearchText(e.target.value);
  }

  const dateFormat = (enteredDate) => {
    return (
      enteredDate+'%20'+hours+':'+minutes
    );
  };




  const submitHandler = async (e) => {
    e.preventDefault();

    console.log(selectedPayer)

    const createlink = {
      Customer_id: selectedPayer,
      Amount: enteredAmount,
      Remarks: enteredPurpose,
      valid_to: dateFormat(enteredDate),
      Client_Code: clientCode,
      name_visiblity: true,
      email_visibilty: true,
      phone_number_visibilty: true,
      isMerchantChargeBearer: true,
    };

    console.log(createlink);

    setSelectedPayer("");
    setEnteredAmount("");
    setEnteredDate("");
    setEnteredPurpose("");
    setHours("");
    setMinutes("");

    await axios
      .post(`https://paybylink.sabpaisa.in/paymentlink/addLink?Customer_id=${selectedPayer}&Remarks=${enteredPurpose}&Amount=${enteredAmount}&Client_Code=${clientCode}&name_visiblity=true&email_visibilty=true&phone_number_visibilty=true&valid_to=${dateFormat(enteredDate)}&isMerchantChargeBearer=true&isPasswordProtected=false`)
      .then((resp) => {
        toast.success("Payment Link Created!",
        {
          position: "top-right",
          autoClose: 2000,
          transition: Zoom,
          limit: 2,
        })
        console.log(JSON.stringify(resp.data));
      })
      .catch((error) => {
        console.log(error);
        toast.error('Payment Link Creation Failed',{
          position: "top-right",
          autoClose: 1000,
          transition: Zoom,
          limit: 2,
        })
      });
  };



const pagination = (pageNo) => {
  setCurrentPage(pageNo);

  const startIndex = (pageNo - 1) * pageSize;
  const paginatedPost = _(data).slice(startIndex).take(pageSize).value();
  setPaginatedData(paginatedPost);

}


useEffect(() => {
  getDetails();
  getDrop();
}, []);

useEffect(()=>{
  setPaginatedData(_(data).slice(0).take(pageSize).value())
},[pageSize]);


if ( pageCount === 1) return null;

const pages = _.range(1, pageCount + 1)



console.log("dataLength",paginatedata.length)


  return (
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        data-whatever="@getbootstrap"
        style={{marginTop: 5, marginLeft: 15}}
      >
        Create Payment Link
      </button>

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
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Payment Link New Details (New Payer)
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
              <Formik initialValues={{
          payer: '',
          Remarks: '',
          Amount: '',
          date: '',
          hours: '',
          minutes: ''
      }}
       validationSchema={validationSchema} >
          
              
             
              <Form onSubmit={submitHandler} >
              
                <Field component='select' name='payer'
                  value={selectedPayer}
                  onChange={(e) => setSelectedPayer(e.target.value)}
                  style={{ width: 470 }}
                >
                  <option selected>Select Payer</option>
                  {drop.map((payer) => (
                    <option value={payer.id}>
                      {payer.name} - {payer.email}
                    </option>
                  ))}
                </Field>
                {<ErrorMessage name="payer">
                                                {msg => <p className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
            
                <br />

                <div class="row">
                  <div class="col">
                    <label for="exampleInputEmail1">
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
                      value={enteredAmount}
                      onChange={(e) => setEnteredAmount(e.target.value)}
                      class="form-control"
                      placeholder="Enter Payment Amount in (INR)"
                    />
                    {<ErrorMessage name="Amount">
                                                {msg => <p style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</p>}
                                            </ErrorMessage>}
                  </div>
                  <br/>
                  <div class="col">
                    <label for="exampleInputEmail1">
                      Purpose of Payement Collection
                    </label>
                    <Field
                      type="text"
                      name="Remarks"
                      autoComplete="off"
                      value={enteredPurpose}
                      onChange={(e) => setEnteredPurpose(e.target.value)}
                      class="form-control"
                      placeholder="Enter Purpose of Payement Collection"
                    />
                    {<ErrorMessage name="Remarks">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
                  </div>
                </div>
                <br/>

                <div class="row">
                  <div class="col">
                    <label>Link Valid To Date</label>
                    <Field
                    name ='date'
                      type="date"
                      className="ant-input"
                      value={enteredDate}                     
                      onChange={(e) => setEnteredDate(e.target.value)}
                      placeholder="From Date"
                    />
                     {<ErrorMessage name="date">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
                  </div>
                  <div class="col">
                    <label>Hours</label>
                    <br />
                    <Field component='select' style={{ width: 80 }}  name = 'hours' value= {hours} onChange={(e) => setHours(e.target.value)}>
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
                    {<ErrorMessage name="hours">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
                  </div>
                  <div class="col">
                    <label>Minutes</label>
                    <br />
                    <Field component = 'select' style={{ width: 100 }} name= 'minutes' value = {minutes} onChange={(e) => setMinutes(e.target.value)}>
                      <option selected>Minutes</option>
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
                    {<ErrorMessage name="minutes">
                                                {msg => <div className="abhitest" style={{ color: "red", position: "absolute", zIndex: " 999" }}>{msg}</div>}
                                            </ErrorMessage>}
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
              
               
              
              </Formik>

            </div>
          </div>
        </div>
      </div>

     
      <div className="filterSection" style={{display:"flex",margin:"10px"}}>
      
       <div style={{display:"contents"}}>

       <input
        type="text"
        placeholder="Search Here"
        value={searchText}
        style={{  width: 700 }}
        onChange={getSearchTerm}
      />

      <h4  style={{marginLeft:"10em"}}>
        Count per page &nbsp; &nbsp;
      </h4>
      <select value={pageSize} rel={pageSize} onChange={(e) =>setPageSize(parseInt(e.target.value))} style={{width: 100 }}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
     
      </select>
       </div>
      
      </div>
      <div style={{margin:"10px"}}>
         <p >
        Total Records: {data.length}
       </p>
       </div>
       <div>
         {
         ! paginatedata ? ("No data Found"):(
      <table
        class="table" style={{marginLeft: 10}}
      >
        <tr>
        <th>Serial No.</th>
          <th>Phone No.</th>
          <th>Amount</th>
          <th>Customer Type</th>
          <th> Customer Email</th>
          <th>Created At</th>
          <th>Customer ID</th>
          <th>Customer Name</th>
          <th>Full Link</th>
        </tr>

        {paginatedata.map((user,i) => (
          <tr>
            <td>{i+1}</td>
            <td>{user.customer_phoneNumber}</td>
            <td>{user.amount}</td>
            <td>{user.customer_type}</td>
            <td>{user.customer_email}</td>
            <td>{user.created_at}</td>
            <td>{user.customer_id}</td>
            <td>{user.customer_name}</td>
            <td>{user.full_link}</td>
          </tr>
        ))}
      </table>
         )}
      </div>
      <div>
  <nav aria-label="Page navigation example"  >
  <ul class="pagination">
    <a class="page-link" onClick={(prev) => setCurrentPage((prev) => prev === 1 ? prev : prev - 1) } href="#">Previous</a>

   {

     pages.map((page) => (
      <li class={
        page === currentPage ? " page-item active" : "page-item"
      }><a class="page-link">
        
        <p onClick={() => pagination(page)}>
        {page}
        </p>
        </a></li>
    
     ))
   }
    <a class="page-link"  onClick={(nex) => setCurrentPage((nex) => nex === pages.length ? nex : nex + 1)} href="#">Next</a>
   
   
  
  </ul>
</nav>
  </div>

    </div>
  );
};

export default PaymentLinkDetail;
