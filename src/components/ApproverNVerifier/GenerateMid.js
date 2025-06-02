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
import { Link } from "react-router-dom"
import toastConfig from "../../utilities/toastTypes";
import { createMidApi, fetchMidPayloadSlice } from "../../slices/generateMidSlice";
import moment from "moment";



function AssignZone() {

  const [clientCodeList, setCliencodeList] = useState([])
  const [disable, setDisable] = useState(false)
  const midState = useSelector(state => state.mid)
  const [requestPayload, setRequestPayload] = useState(null);


  const MidPayloadUpdate = (payload) => {

    // clientOwnershipType
    let clientOwnershipType = ""
    if (payload?.clientOwnershipType?.toLowerCase() === "proprietorship") {
      clientOwnershipType = "PROPRIETARY"
    } else if (payload?.clientOwnershipType?.toLowerCase() === "private ltd") {
      clientOwnershipType = "PRIVATE"
    } else if (payload?.clientOwnershipType?.toLowerCase() === "public limited") {
      clientOwnershipType = "PUBLIC"
    } else if (payload?.clientOwnershipType?.toLowerCase() === "ngo") {
      clientOwnershipType = "TRUST"
    } else {
      clientOwnershipType = payload?.clientOwnershipType?.toUpperCase()
    }

    let reqPayload = {
      ...payload,
      clientOwnershipType: clientOwnershipType,
      clientVirtualAdd: payload.clientVirtualAdd?.replaceAll(/\s/g, ''),
      collectionModes: "UPI",
      fatherNameOnPan: payload?.fatherNameOnPan || payload?.clientName,
      clientDob: moment(payload.clientDob, "YYYY-MM-DD").format("DD/MM/YYYY"),
      clientDoi: moment(payload.clientDoi, "YYYY-MM-DD").format("DD/MM/YYYY")
    }
    return reqPayload
  }

  useEffect(() => {

    getMidClientCode().then((resp) => {
      // console.log(resp)
      setCliencodeList(resp?.data?.result)
    })
  }, [])


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

  const [createMidData, setCreateMidData] = useState({})
  const [show, Setshow] = useState(false)
  const [showFullJson, setShowFullJson] = useState(false);







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
        <div className="modal-body px-4 py-3">
          <div className="container">


            <div className="mb-4">
              <h6> Payment Mode: {formValues?.mode_name}</h6>
              <h6> Bank: {formValues?.bank_name}</h6>
              <h6> Client Code: {formValues?.react_select?.label}</h6>


            </div>


            {createMidData.onboardStatus !== 'SUCCESS' && (
              <div className="text-center">
                <button
                  type="button"
                  // className="btn btn-primary px-4 py-2"
                  className="submit-btn cob-btn-primary text-white mt-3"
                  disabled={disable}
                  onClick={handleSubmit}
                >
                  {disable && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Confirm
                </button>

              </div>
            )}


            {requestPayload && (

              <div>
                <h6>Request payload</h6>
                <pre className={`bg-light p-3 rounded ${showFullJson ? '' : 'overflow-auto'} mb-2`} style={{ maxHeight: showFullJson ? 'none' : '200px' }}>
                  {JSON.stringify(requestPayload, null, 2)}
                </pre>

                <a
                  className="text-primary text-decoration-underline"
                  role="button"
                  onClick={() => setShowFullJson(!showFullJson)}
                >
                  {showFullJson ? "Show Less" : "Show More"}
                </a>
              </div>
            )}




          </div>
        </div>



        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          createMidData?.onboardStatus && (
            <div className="d-flex justify-content-center">
              <div className="card shadow-sm w-100 my-4 mx-2">
                <div className="card-body">
                  <div className="mb-4">
                    <h6 >Onboard Status: {createMidData?.onboardStatus}</h6>
                    <h6 >Disbursement Registration Status: {createMidData?.disbursementRegistrationStatus}</h6>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead className="table-light">
                        <tr>
                          <th>Name</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(createMidData)?.map(([key, value], index) => (
                          <tr key={index}>
                            <td className="fw-medium">{key}</td>
                            <td>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    );
  };


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


      reqPayload = MidPayloadUpdate(reqPayload?.data?.result)


      setRequestPayload(reqPayload);
      let createMidResp = dispatch(createMidApi(reqPayload))
      createMidResp.then((resp) => {

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
      // console.log("err", error?.response?.data?.detail || error?.response?.data?.message)
      toastConfig.errorToast(error?.response?.data?.detail || error?.response?.data?.message);
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

  const validationSchema = Yup.object().shape({
    mode_name: Yup.string()
      .required("Required")
      .allowOneSpace(),
    react_select: Yup.object().required("Required").nullable(),
    bank_name: Yup.string()
      .required("Required")
      .allowOneSpace(),
  });

  return (
    <section className="">
      <main className="">
        <div className="">
          <div className="d-flex justify-content-between">
            <h5 className="ml-3">MID Generation</h5>
            <Link
              to="/dashboard/mid-management"
              className="text-decoration-none"

            >
              <button type="button" className="btn cob-btn-primary btn-sm">
                View MID
              </button>
            </Link>
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
        fnSetModalToggle={setOpenModal} setRequestPayload={setRequestPayload} resetPayload={true} Setshow={Setshow} />


    </section>
  );
}

export default AssignZone;
