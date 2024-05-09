import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast, Zoom } from "react-toastify";
import { useHistory } from "react-router-dom";
import API_URL from "../../../../config";
import FormikController from "../../../../_components/formik/FormikController";
import {
  Regex,
  RegexMsg,
} from "../../../../_components/formik/ValidationRegex";
import { axiosInstance } from "../../../../utilities/axiosInstance";
import CustomModal from "../../../../_components/custom_modal";

export const Edituser = (props) => {
  let history = useHistory();
  const { myname, email, phone, editCustomerTypeId, id } = props.items;
  const callBackFn = props.callBackFn;
  const [disable,setDisable]=useState(false)

  const initialValues = {
    name: myname,
    email: email,
    phone_number: Number(phone),
    customer_type_id: editCustomerTypeId,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(Regex.acceptAlphabet, RegexMsg.acceptAlphabet)
      .required("Required"),
    email: Yup.string()
      .email("Must be a valid email")
      .required("Required"),
    phone_number: Yup.string()
      .matches(Regex.acceptNumber, RegexMsg.acceptNumber)
      .required("Required"),
    customer_type_id: Yup.string().required("Required"),
  });

  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState([]);
  let clientMerchantDetailsList = [];
  let clientCode = "";
  if (user && user.clientMerchantDetailsList === null) {
    // console.log("edituser");
    history.push("/dashboard/profile");
  } else {
    clientMerchantDetailsList = user.clientMerchantDetailsList;
    clientCode = clientMerchantDetailsList[0].clientCode;
  }

  const editHandler = (values) => {
    setDisable(true)
    axiosInstance
      .put(API_URL.EDIT_CUSTOMER, {
        name: values.name,
        email: values.email,
        phone_number: values.phone_number,
        client_code: clientCode,
        customer_type_id: values.customer_type_id,
        id: id,
      })
      .then((res) => {
        // console.log(res)
        callBackFn();
        toast.success("User Updated Successfully", {
          position: "top-right",
          autoClose: 2000,
          transition: Zoom,
        });
        setDisable(false)
      })
      .catch((e) => {
        // console.log(e);
        toast.error("Data not Updated", {
          position: "top-right",
          autoClose: 2000,
          transition: Zoom,
        });
        setDisable(false)
      });
  };
  const getDrop = async (e) => {
    await axiosInstance
      .get(API_URL.GET_CUSTOMER_TYPE)
      .then((res) => {
        let res_data = res.data;
        let data_arr = [];
        res_data.map((d, i) => data_arr.push({ key: d.id, value: d.type }));
        setData(data_arr);
      })
      .catch((err) => {
        // console.log(err)
      });
  };
  useEffect(() => {
    getDrop();
  }, []);



  //modal body and modal footer need to send in custom modal as a props.
  const modalBody = () => {
    return (
      <>
        {" "}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={editHandler}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <div className="form-group">
                <FormikController
                  control="input"
                  type="text"
                  label="Name of Payer"
                  name="name"
                  className="form-control"
                />
                <FormikController
                  control="input"
                  type="text"
                  label="Mobile No"
                  name="phone_number"
                  className="form-control"
                />
                <FormikController
                  control="input"
                  type="text"
                  label="Email ID"
                  name="email"
                  className="form-control"
                />

                <FormikController
                  control="select"
                  label="Payer Category"
                  name="customer_type_id"
                  options={data}
                  className="form-control"
                />
                <button
                  type="submit"
                  className=" mt-3 btn cob-btn-primary text-white btn-sm"
                  disabled={disable}
                >
                   {disable && (
                            <span className="spinner-border spinner-border-sm mr-1" role="status" ariaHidden="true"></span>
                          )} {/* Show spinner if disabled */}
                          Update
                </button>
                <button
                  type="button"
                  className=" mt-3 btn cob-btn-secondary ml-2 text-white btn-sm"
                  onClick={()=>props.fnSetModalToggle(false)}
                  
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  };

  return (
    <>
      <CustomModal headerTitle={"Edit"} modalBody={modalBody} modalToggle={props.modalToggle} fnSetModalToggle={props.fnSetModalToggle} />
    </>
  );
};
