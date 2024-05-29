/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DateFormatter from "../../utilities/DateConvert";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form,Field} from "formik";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { fetchPaymentMode, fetchBankName, getMidClientCode } from "../../services/generate-mid/generate-mid.service";
import ReactSelect, { createFilter } from 'react-select';
import CustomModal from "../../_components/custom_modal";
import CustomSelect from "../../_components/formik/components/CustomReactSelect";

import toastConfig from "../../utilities/toastTypes";
import { createMidApi } from "../../slices/generateMidSlice";
function AssignZone() {
  function capitalizeFirstLetter(param) {
    return param?.charAt(0).toUpperCase() + param?.slice(1);
  }

  const [clientCodeList, setCliencodeList] = useState([])


  useEffect(() => {

    getMidClientCode().then((resp) => {
      // console.log(resp)
      setCliencodeList(resp?.data?.result)
    })
  }, [])

  const initialValuess = {
    name: "",
    email: ""
  };




  let initialValues = {
    transaction_from: "",
  };

  const dispatch = useDispatch();
  const [openZoneModal, setOpenModal] = useState(false);
  const [merchantData, setMerchantData] = useState([]);
  const [bankName, setBankName] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null);
 console.log("selectedClientId", selectedClientId)
  const [formValues, setFormValues] = useState("")
  const [createMidData, setCreateMidData] = useState("")
  const [show, Setshow] = useState(false)
  // console.log(selectedClientId)

  useEffect(() => {
    fetchPaymentMode()
      .then(response => {

        const data = convertToFormikSelectJson(
          "mode_name",
          "mid_mode_name",
          response?.data?.result
        )
        setMerchantData(data);
      })
      .catch(error => {
        console.error('Error fetching merchant data:', error);
      });
  }, []);

  useEffect(() => {
    fetchBankName()
      .then(response => {
        const data = convertToFormikSelectJson(
          "mid_bank_name",
          "bank_name",
          response?.data?.result
        )

        setBankName(data);
      })
      .catch(error => {
        console.error('Error fetching merchant data:', error);
      });
  }, []);

  const options = [
    { value: '', label: 'Select Client Code' },
    ...clientCodeList.map((data) => ({
      value: data.merchantId,
      label: `${data.clientCode} - ${data.clientName}`
    }))
  ]

  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption)
    setSelectedClientId(selectedOption ? selectedOption.value : null)
  }

  const modalBody = () => {
    return (
      <div className="container-fluid">
        <Formik
          initialValues={initialValuess}
          // validationSchema={validationSchema}

          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
        >
          {({ resetForm }) => (
            <>

              <div className="modal-body">
                {/* <p className="">
                    Client Name: {props?.userData?.clientName}
                  </p> */}
                <p className="">
                  Client Code: {selectedClientId}
                </p>
                <div className="container">
                  <Form>
                    <div className="row">
                      <div className="col-lg-6">
                        <label className="col-form-label mt-0 p-2">
                          Name<span style={{ color: "red" }}>*</span>
                        </label>
                        <FormikController
                          control="input"
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-lg-6">
                        <label className="col-form-label mt-0 p-2">
                          Email<span style={{ color: "red" }}>*</span>
                        </label>
                        <FormikController
                          control="input"
                          type="text"
                          name="email"
                          placeholder="Enter Email"
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="">
                      <button
                        type="subbmit"
                        className="submit-btn cob-btn-primary text-white mt-3"
                      >
                        Confirm
                      </button>
                    </div>


                  </Form>
                </div>
              </div>
            </>
          )}
        </Formik>
        {show &&

          <div className="d-flex justify-content-center">
            <div className="card bg-warning text-center">
              <div className="card-body">
                <div className="">
                  <h6>{createMidData?.description}</h6>
                  <h6>Status: {createMidData?.onboardStatus}</h6>
                </div>
              </div>
            </div>
          </div>
        }

      </div>

    )


  }
  const onSubmit = (values) => {
    // console.log("Values", values)
    setOpenModal(true);
    setFormValues(values)
  }
  const clientCodeOption = convertToFormikSelectJson("merchantId", "clientCode", clientCodeList, {}, false, false, true, "clientName")
  // console.log(clientCodeOption)

  const handleSubmit = (values) => {
    // setLoading(true);
    // setDisable(true)
    const midData = {
      "merchant_id": selectedClientId,
      "bank_name": formValues?.bank_name,
      "mode_name": formValues?.mode_name

    };
    dispatch(createMidApi(midData))
      .then((resp) => {
        Setshow(true)
        setCreateMidData(resp?.payload)
        console.log("resp", resp)
        // setData(resp.payload.ResponseData);
      })
      .catch((err) => {
        console.log("err", err)
        toastConfig.errorToast(err);
        Setshow(false)

      });
  };





  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5 className="ml-3">MID Generation</h5>
          </div>
          <div className="container-fluid mt-5">
            <Formik
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="">
                  <div className="row">
                    <div className="col-lg-3">

                      {/* <FormikController
                        control="select"
                        name="refer_by"
                        options={clientCodeOption}
                        className="form-select"
                        label="Client Code"
                        onChange={(e) => {
                          formik.setFieldValue("refer_by", e.target.value)
                          formik.setStatus(false);
                        }}
                      /> */}
                      <label className="form-label">Client Code</label>
                      <ReactSelect
                        className="zindexforDropdown"
                        onChange={handleSelectChange}
                        // value={selectedClientId ? { value: selectedClientId, label: selectedClientId, merchant_id } : null}
                        options={options}
                        placeholder="Select Client Code"
                        filterOption={createFilter({ ignoreAccents: false })}
                      /> 
                     

                    </div>

                    <div className="col-lg-3">

                      <FormikController
                        control="select"
                        name="mode_name"
                        options={merchantData}
                        className="form-select"
                        label="Payment Mode"
                      />
                    </div>
                    <div className="col-lg-3">

                      <FormikController
                        control="select"
                        name="bank_name"
                        options={bankName}
                        className="form-select"
                        label="Bank"
                      />

                    </div>
                    <div className="col-lg-3 mt-4">
                      <button
                        type="submit"

                        className="approve cob-btn-primary text-white"
                        data-toggle="modal"
                        data-target="#exampleModalCenter"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div>
        </div>
      </main>


      <CustomModal modalBody={modalBody} headerTitle={"MID Generation"} modalToggle={openZoneModal}
        fnSetModalToggle={setOpenModal} />


    </section>
  );
}

export default AssignZone;
