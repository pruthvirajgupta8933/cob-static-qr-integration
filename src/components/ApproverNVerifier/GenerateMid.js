/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormikController from "../../_components/formik/FormikController";
import { Formik, Form } from "formik";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import { fetchPaymentMode, fetchBankName, getMidClientCode, fetchMidPayload } from "../../services/generate-mid/generate-mid.service";
import { createFilter } from 'react-select';
import CustomModal from "../../_components/custom_modal";
import Yup from "../../_components/formik/Yup";
import CustomReactSelect from "../../_components/formik/components/CustomReactSelect";

import toastConfig from "../../utilities/toastTypes";
import { createMidApi, fetchMidPayloadSlice } from "../../slices/generateMidSlice";

function AssignZone() {

  const [clientCodeList, setCliencodeList] = useState([])
  const [disable, setDisable] = useState(false)
  const midState = useSelector(state => state.mid)

  const midPayloadData = midState?.midPayload
  const validationSchema = Yup.object().shape({
    mode_name: Yup.string()
      .required("Required")
      .allowOneSpace(),
    react_select: Yup.object().required("Required").nullable(),
    bank_name: Yup.string()
      .required("Required")
      .allowOneSpace(),
  });


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
    react_select: "",
    mode_name: "",
    bank_name: "",

  };

  const dispatch = useDispatch();
  const [openZoneModal, setOpenModal] = useState(false);
  const [merchantData, setMerchantData] = useState([]);
  const [bankName, setBankName] = useState([])
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [formValues, setFormValues] = useState("")
  const [loading, setLoading] = useState(false)

  const [createMidData, setCreateMidData] = useState("")
  const [show, Setshow] = useState(false)


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
    setSelectedClientId(selectedOption ? selectedOption.value : null)
  }


  const modalBody = () => {
    return (
      <div className="container-fluid p-0">
        <div className="modal-body p-0">
          <div className="container">
            <h6>MID request data :</h6>
            <p> Payment Mode: {formValues?.mode_name}</p>
            <p> Bank: {formValues?.bank_name}</p>

            {/* <div className="my-5">
           
              {Object.keys(midPayloadData?.data)?.map((item, index) => (
                <p key={index}>{item} : {midPayloadData?.data[item]}</p>
              ))}
            </div> */}


            <div className="">
              {createMidData.onboardStatus !== 'SUCCESS' && (
                <button
                  type="button"
                  className="submit-btn cob-btn-primary text-white mt-3"
                  disabled={disable}
                  onClick={() => handleSubmit()}
                >
                  {disable && (
                    <span
                      className="spinner-border spinner-border-sm mr-1"
                      role="status"
                      ariaHidden="true"
                    ></span>
                  )}
                  Confirm
                </button>
              )}
            </div>

          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (

          createMidData?.description && (
            <div className="d-flex justify-content-center">
              <div className="card bg-warning text-center">
                <div className="card-body">
                  <div>
                    <h6>{createMidData?.description}</h6>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {createMidData?.onboardStatus === "SUCCESS" &&
          <table class="table mt-3">
            <thead>
              <tr>
                <th scope="col">Client Code</th>
                <th>Client Name</th>
                <th scope="col">Bank Name</th>
                <th>MID</th>
                <th scope="col">Account Number</th>
                <th>Payment Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td >{createMidData?.clientCode}</td>
                <td>{createMidData?.clientName}</td>
                <td>{createMidData?.bankName}</td>
                <td>{createMidData?.subMerchantId}</td>
                <td>{createMidData?.clientAccountNumber}</td>
                {/* <td>{createMidData?.clientEmail}</td> */}
                <td>{createMidData?.paymentMode}</td>
                <td>{createMidData?.onboardStatus}</td>
              </tr>

            </tbody>
          </table>
        }


      </div>

    )


  }

  const onSubmit = (values) => {
    // console.log("Values", values)
    setOpenModal(true);
    setFormValues(values)
    setCreateMidData({})
  }


  const handleSubmit = async () => {
    setDisable(true)
    setLoading(true)
    // setCreateMidData({})
    const midData = {
      "merchant_id": selectedClientId,
      "bank_name": formValues?.bank_name,
      "mode_name": formValues?.mode_name
    };

    try {
      let reqPayload = await fetchMidPayload(midData);
      reqPayload = reqPayload?.data?.result
      let createMidResp = dispatch(createMidApi(reqPayload))
      createMidResp.then((resp) => {
        console.log(resp)
        if (resp?.meta?.requestStatus === "fulfilled") {
          Setshow(true)
          setCreateMidData(resp?.payload)
          setDisable(false)
          setLoading(false)
        } else {
          toastConfig.errorToast(resp?.payload ?? "Something went wrong");
          setDisable(false)
          setLoading(false)
        }
      })

    } catch (error) {
      console.log("err", error)
      toastConfig.errorToast(error);
      Setshow(false)
      setDisable(false)

    }

    // dispatch(fetchMidPayloadSlice(midData))


    // dispatch(createMidApi(midData))
    //   .then((resp) => {
    //     if (resp?.meta?.requestStatus === "fulfilled") {
    //       Setshow(true)
    //       setCreateMidData(resp?.payload)
    //       setDisable(false)
    //       setLoading(false)
    //     } else {
    //       toastConfig.errorToast(resp?.payload ?? "Something went wrong");
    //       setDisable(false)
    //       setLoading(false)
    //     }


    //     // setData(resp.payload.ResponseData);
    //   })
    //   .catch((err) => {
    //     console.log("err", err)
    //     toastConfig.errorToast(err);
    //     Setshow(false)
    //     setDisable(false)

    //   });
  };

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="">
            <h5>MID Generation</h5>
          </div>
          <div className="container-fluid p-0">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form className="mt-5">
                  <div className="row">
                    <div className="col-lg-3">
                      <CustomReactSelect
                        name="react_select"
                        options={options}
                        placeholder="Select Client Code"
                        filterOption={createFilter({ ignoreAccents: false })}
                        label="Client Code"
                        onChange={handleSelectChange}

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

                        className="approve cob-btn-primary "
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


      <CustomModal modalBody={modalBody} headerTitle={"MID Generation Request"} modalToggle={openZoneModal}
        fnSetModalToggle={setOpenModal} />


    </section>
  );
}

export default AssignZone;
