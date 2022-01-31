import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const PaymentLinkDetail = () => {
  const [selectedPayer, setSelectedPayer] = useState("Select Payer");
  const [enteredAmount, setEnteredAmount] = useState("");
  const [enteredPurpose, setEnteredPurpose] = useState("");
  const [enteredDate, setEnteredDate] = useState("");
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');


  const initialState = {
    customer_phoneNumber: "",
    amount: "",
    customer_type: "",
    customer_email: "",
    created_at: "",
    customer_id: "",
    customer_name: "",
    full_link: "",
  };

  // const [item, setItem] = useState({
  //   Customer_id: "",
  //   Remarks: "",
  //   Amount: "",
  //   Client_Code: "LPSD1",
  //   name_visiblity: true,
  //   email_visibilty: true,
  //   phone_number_visibilty: true,
  //   valid_to: "",
  //   isMerchantChargeBearer: true,
  // });

  const [data, setData] = useState([]);
  const [drop, setDrop] = useState([]);
  const [searchText, SetSearchText] = useState("");
  const [folderArr, setFolderArr] = React.useState([]);
  var [showFilterData, SetShowFilterData] = useState([]);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  const { clientCode, clientId } = clientMerchantDetailsList[0];
  console.log("clientCode", clientCode);

  // console.log('https://paybylink.sabpaisa.in/paymentlink/getLinks/'+ clientCode );

  const getDetails = async (e) => {
    await axios
      .get(`https://paybylink.sabpaisa.in/paymentlink/getLinks/${clientCode}`)
      .then((res) => {
        setData(res.data);
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

  useEffect(() => {
    getDetails();
    getDrop();
  }, []);

  const getSearchTerm = (e) => {
    SetSearchText(e.target.value);
    if (searchText !== "") {
      setData(
        data.filter((item) =>
          item.customer_email
            .toLowerCase()
            .includes(searchText.toLocaleLowerCase())
        )
      );
    }
  };

  const dateFormat = (timestamp) => {
    var date = new Date(timestamp);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const addlink = {
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

    console.log("AddLink", addlink);

    setSelectedPayer("");
    setEnteredAmount("");
    setEnteredDate("");
    setEnteredPurpose("");

    await axios
      .post(`https://paybylink.sabpaisa.in/paymentlink/addLink`, {
        Customer_id: selectedPayer,
        Remarks: enteredPurpose,
        Amount: enteredAmount,
        Client_Code: clientCode,
        name_visiblity: true,
        email_visibilty: true,
        phone_number_visibilty: true,
        valid_to: enteredDate,
        isMerchantChargeBearer: true,
      })
      .then((resp) => {
        console.log(JSON.stringify(resp.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        data-whatever="@getbootstrap"
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
              <form onSubmit={submitHandler}>
                <select
                  value={selectedPayer}
                  onChange={(e) => setSelectedPayer(e.target.value)}
                  style={{ width: 470 }}
                >
                  <option selected>Select Payer</option>
                  {drop.map((payer) => (
                    <option>
                      {payer.name} - {payer.email}
                    </option>
                  ))}
                </select>

                <br />

                <div class="row">
                  <div class="col">
                    <label for="exampleInputEmail1">
                      Payment to be Collected (INR)
                    </label>
                    <input
                      type="text"
                      name="Amount"
                      autoComplete="off"
                      value={enteredAmount}
                      onChange={(e) => setEnteredAmount(e.target.value)}
                      class="form-control"
                      placeholder="Enter Payment Amount in (INR)"
                    />
                  </div>
                  <div class="col">
                    <label for="exampleInputEmail1">
                      Purpose of Payement Collection
                    </label>
                    <input
                      type="text"
                      name="Remarks"
                      autoComplete="off"
                      value={enteredPurpose}
                      onChange={(e) => setEnteredPurpose(e.target.value)}
                      class="form-control"
                      placeholder="Enter Purpose of Payement Collection"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <label>Link Valid To Date</label>
                    <input
                      type="date"
                      className="ant-input"
                      value={enteredDate}
                      min="2021-01-01"
                      max="2022-12-31"
                      onChange={(e) => setEnteredDate(e.target.value)}
                      placeholder="From Date"
                    />
                  </div>
                  <div class="col">
                    <label>Hours</label>
                    <br />
                    <select style={{ width: 80 }}  onChange={(e) => setHours(e.target.value)}>
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
                    <select style={{ width: 100 }} onChange={(e) => setMinutes(e.target.value)}>
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
              </form>
            </div>
          </div>
        </div>
      </div>

      <p style={{ position: "absolute", top: 270, left: 50 }}>
        Total Records: 8
      </p>
      <input
        type="text"
        placeholder="Search Here"
        value={searchText}
        style={{ position: "absolute", top: 300, left: 30, width: 700 }}
        onChange={getSearchTerm}
      />

      <h4 style={{ position: "absolute", top: 300, left: 835 }}>
        Count per page
      </h4>
      <select style={{ position: "absolute", top: 300, left: 960, width: 100 }}>
        <option value="10">10</option>
        <option value="20">25</option>
        <option value="30">50</option>
        <option value="60">100</option>
        <option value="70">200</option>
        <option value="70">300</option>
        <option value="70">400</option>
        <option value="70">500</option>
      </select>
      <table
        style={{ position: "absolute", top: 340, left: 20, width: 900 }}
        class="table"
      >
        <tr>
          <th>Phone No.</th>
          <th>Amount</th>
          <th>Customer Type</th>
          <th> Customer Email</th>
          <th>Created At</th>
          <th>Customer ID</th>
          <th>Customer Name</th>
          <th>Full Link</th>
        </tr>

        {data.map((user) => (
          <tr>
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
    </div>
  );
};

export default PaymentLinkDetail;
