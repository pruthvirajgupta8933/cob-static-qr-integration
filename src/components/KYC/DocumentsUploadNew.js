import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import FormikController from '../../_components/formik/FormikController'
import { convertToFormikSelectJson } from '../../_components/reuseable_components/convertToFormikSelectJson'
import "../KYC/kyc-style.css"
import API_URL from '../../config';
import { documentsUpload, merchantInfo } from "../../slices/kycSlice"
import plus from "../../assets/images/plus.png"
import { set } from 'lodash';
import $ from "jquery"

function DocumentsUpload() {
  const [docTypeList, setDocTypeList] = useState([])
  const [docTypeIdDropdown, setDocTypeIdDropdown] = useState("");
  const [fieldValue, setFieldValue] = useState(null);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const initialValues = {
    docType: "",
    docFile: ""

  }
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    docType: Yup.string().required("Required"),
    docFile: Yup.mixed()
      .nullable()
      .required('Required file format PNG/JPEG/JPG/PDF')
  })

  useEffect(() => {
    dispatch(documentsUpload()).then((resp) => {
      const data = convertToFormikSelectJson('id', 'name', resp.payload.results);
      setDocTypeList(data)
    }).catch(err => console.log(err))


  }, [])
  const onSubmit = values => {



    const bodyFormData = new FormData();
    bodyFormData.append('files', fieldValue);
    // bodyFormData.append("client_code", [clientCode]);
    bodyFormData.append('login_id', loginId);
    bodyFormData.append('modified_by', 270);
    bodyFormData.append('type', values.docType);
    dispatch(merchantInfo(bodyFormData))
      .then(function (response) {
        toast.success("Merchant document saved successfully")
        console.log(response);
      })
      .catch(function (error) {
        console.error("Error:", error);
        toast.error('Merchant document saved Unsuccessfull')
      });
  }


  console.log(docTypeIdDropdown, "<=== Id ===>")

  const imageClickHandler = (e) => {
    document.getElementById('my_file').click();

  }


  return (
    <div className="col-md-12 col-md-offset-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form>
            {/* {console.log(formik,"<==== Formik ====>")} */}
            <div className="form-row align-items-centre">
              <div className="form-group col-lg-5">
                <FormikController
                  control="select"
                  label="Document Type"
                  name="docType"
                  className="form-control"
                  options={docTypeList}
                />
                {formik.handleChange("docType", setDocTypeIdDropdown(formik.values.docType))}

              </div>




              {docTypeIdDropdown === "1" ?
                <div class="row">


                  <div class="col-sm-6">
                    <div class="card border-dotted" style={{ height: "13rem", width: "17rem" }}>
                      <div class="card-body text-center">
                        <h3 class="card-title">Add Front Aadhaar Card</h3>
                        <input type="image" src={plus} style={{ width: 100 }} />
                        <p class="card-text">Upto 2 MB file size</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <div class="card border-dotted" style={{ height: "13rem", width: "18rem" }}>
                      <div class="card-body text-center">
                        <h3 class="card-title">Add Back Aadhaar Card</h3>
                        <input type="image" src={plus} style={{ width: 100 }} />
                        <p class="card-text">Upto 2 MB file size </p>

                      </div>
                    </div>
                  </div>
                </div>

                : docTypeIdDropdown === "2" ?



                  <div class="col-xs-10 mt-5 mr-5">
                    <div class="card border-dotted justify-content-center" style={{ height: "13rem", width: "20rem" }}>
                      <div class="card-body text-center">
                        <h3 class="card-title">Add Front PAN Card</h3>
                        <input type="image" src={plus} alt="PAN" style={{ width: 100 }} onClick={(e) => imageClickHandler(e)} />
                        <input type="file" id="my_file" style={{ display: "none" }} />

                        <p class="card-text">Upto 2 MB file size</p>
                      </div>
                    </div>


                  </div>

                  : <></>
              }


              <div class="row-xs-10 mt-3 mr-2 p-3">
                {/* <div class="card-footer"> */}
                <div class="mt-xl-10">
                  <button className="btn float-lg-right" type="submit" style={{ backgroundColor: "#0156B3" }}>
                    <h4 className="text-white font-weight-bold"> &nbsp; &nbsp; Save & Next &nbsp; &nbsp;</h4>
                  </button>

                </div>
                {/* </div> */}
              </div>


            </div>
          </Form>

        )}
      </Formik>

    </div>
  )
}

export default DocumentsUpload