import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import API_URL from "../../../config";
import FormikController from "../../../_components/formik/FormikController";
import PrintDocument from "../../../_components/reuseable_components/PrintDocument";
import NavBar from "../NavBar/NavBar";

function TransactionEnquirey() {
  const initialValues = {
    transaction_id: "",
  };
  const validationSchema = Yup.object({
    transaction_id: Yup.number().required("Required"),
  });

  const [show, setIsShow] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [data, setData] = useState({});
  const [printData, setPrintData] = useState([]);
  const [disable,setIsDisable] = useState(false)
  const { auth } = useSelector((state) => state);
  const { user } = auth;

  let history = useHistory();

  const onSubmit = (input) => {
    setData({});
    setIsDisable(true)
    const transaction_id = input.transaction_id;
    axios
      .get(API_URL.VIEW_TXN + `/${transaction_id}`)
      .then((response) => {
        if (response?.data.length > 0) {
         
          setIsShow(true);
          setData(response?.data[0]);
          setErrMessage(false);
          setIsDisable(false)
        } else {
          axios.get(API_URL.SP2_VIEW_TXN + `/${transaction_id}`).then((r) => {
            if (r?.data.length > 0) {
             
              setIsShow(true);
              setIsDisable(false)
              setData(r?.data[0]);
              setErrMessage(false);
            } else {
              setIsShow(false);
              setErrMessage(true);
              setIsDisable(false)
              
            }
          });
        }
      })
      .catch((e) => {
        setIsShow(false);
        setErrMessage(true);
        setIsDisable(false)
      });
  };

  useEffect(() => {
    const tempArr = [
      { key: "Txn Id", value: data.txn_id },
      { key: "Payment Mode", value: data.payment_mode },
      { key: "Payee Name", value: data.payee_name },
      { key: "Payee Mobile", value: data.payee_mob },
      { key: "Payee Email", value: data.payee_email },
      { key: "Status ", value: data.status },
      { key: "Bank Txn Id", value: data.bank_txn_id },
      { key: "Client Name", value: data.client_name },
      { key: "Client Id", value: data.client_id },
      { key: "Payee Amount", value: data.payee_amount },
      { key: "Paid Amount", value: data.paid_amount },
      { key: "Transaction Date", value: data.trans_date },

      { key: "Client Code ", value: data.client_code },
      { key: "Client Txn Id", value: data.client_txn_Id },
    ];
    setPrintData(tempArr);
  }, [data]);

  const onClick = async () => {
    let tableContents = document.getElementById("print_docuement").innerHTML;
    let a = window.open("", "", "height=900, width=900");
    a.document.write(tableContents);
    a.document.close();
    await a.print();
  };

  if (
    user &&
    user.clientMerchantDetailsList === null &&
    user.roleId !== 3 &&
    user.roleId !== 13
  ) {
    history.push("/dashboard/profile");
  }

  return (
    <section className="ant-layout">
      <div>
        <NavBar />
        {/*
                    <div className="notification-bar"><span style="margin-right: 10px;">Please upload the documents<span
                                className="btn">Upload Here</span></span></div>*/}
      </div>
      <main className="gx-layout-content ant-layout-content NunitoSans-Regular">
        <div className="gx-main-content-wrapper">
          <div className="right_layout my_account_wrapper right_side_heading">
            <h1 className="m-b-sm gx-float-left">Transaction Enquiry</h1>
          </div>
          <section
            className="features8 cid-sg6XYTl25a flleft col-lg-12"
            id="features08-3-"
          >
            <div className="container-fluid">
              <div className="row">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => (
                    <Form className="col-lg-12 bgcolor">
                      <div className="form-row">
                        <div className="form-group col-md-6 col-sm-12 col-lg-6">
                          <FormikController
                            control="input"
                            type="text"
                            label="Transaction ID  *"
                            name="transaction_id"
                            placeholder="Enter Sabpaisa Transaction ID"
                            className="form-control"
                          />

                          <button
                          disabled={disable}
                            className="btn cob-btn-primary  text-white bttnbackgroundkyc mt-2"
                            type="submit"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>

                {show && data?.txn_id ? (
                  <div className="overflow-auto col-lg-12 ">
                    {/* Print Data  */}
                    <PrintDocument data={printData} />
                    <table
                      cellspacing={0}
                      cellPadding={10}
                      border={0}
                      width="100%"
                      className="tables"
                      id="enquiry"
                    >
                      <tbody>
                        <tr>
                          <td>Txn Id:</td>
                          <td className="bold">
                            <b>{data.txn_id}</b>
                          </td>
                          <td>Payment Mode :</td>
                          <td className="bold">
                            <b>{data.payment_mode}</b>
                          </td>
                          <td>Payee Name :</td>
                          <td className="bold">
                            <b>{data.payee_name}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Payee Mobile:</td>
                          <td className="bold">
                            <b>{data.payee_mob}</b>
                          </td>
                          <td>Payee Email :</td>
                          <td className="bold">
                            <b>{data.payee_email}</b>
                          </td>
                          <td>Status :</td>
                          <td className="bold">
                            <b>{data.status}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Bank Txn Id :</td>
                          <td className="bold">
                            <b>{data.bank_txn_id}</b>
                          </td>
                          <td>Client Name :</td>
                          <td>
                            <b>{data.client_name}</b>
                          </td>
                          <td>Client Id : </td>
                          <td className="bold">
                            <b>{data.client_id}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>Payee Amount :</td>
                          <td className="bold">
                            <b>{data.payee_amount}</b>
                          </td>
                          <td>Paid Amount :</td>
                          <td className="bold">
                            <b>{data.paid_amount}</b>
                          </td>
                          <td>Transaction Date :</td>
                          <td className="bold">
                            <b>{data.trans_date}</b>
                          </td>
                        </tr>
                        <tr>
                          <td> Client Code :</td>
                          <td className="bold">
                            <b>{data.client_code}</b>
                          </td>
                          <td>Client Txn Id:</td>
                          <td className="bold">
                            <b>{data.client_txn_Id}</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <> </>
                )}

                {errMessage && (
                  <h3
                    style={{
                      color: "red",
                    }}
                  >
                    Record Not Found!
                  </h3>
                )}

                {show && data.txn_id ? (
                  <button
                    Value="click"
                    onClick={onClick}
                    className="btn cob-btn-primary  bttn font-weight-bold bttnbackgroundkyc float-right"
                  >
                    Print
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default TransactionEnquirey;
