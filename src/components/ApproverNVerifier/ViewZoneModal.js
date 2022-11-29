import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import { toast } from "react-toastify";
import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';

const initialValues = {
  zoneName: "",
  zoneHeadName: "",
  zoneEmployee: "",
  risk_category: ""
}

const validationSchema = Yup.object({
  zoneName: Yup.string().required("Required").nullable(),
  zoneHeadName: Yup.string().required("Required").nullable(),
  zoneEmployee: Yup.string().required("Required").nullable(),
  risk_category: Yup.string().required("Required").nullable()
})


const ViewZoneModal = (props) => {
  const [zone, setZone] = useState([])
  const [zoneHead, setZoneHead] = useState([])
  const [employee, setEmployee] = useState([])
  const [risk, setRisk] = useState([])
  const [selectedZoneId, setSelectedZoneId] = useState('')
  const [selectedZoneHHead, setSelectedZoneHead] = useState('')
  const [zoneCode, setZoneCode] = useState("")
  const[empCode,setEmpcode] = useState("")


  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.RISK_CATEGORY)
      .then((resp) => {
        const data =
          convertToFormikSelectJson("risk_category_code", "risk_category_name", resp?.data);

        setRisk(data);
      })
      // .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
    axiosInstanceAuth
      .get(API_URL.ZONE_DETAILS)
      .then((resp) => {
        const data = convertToFormikSelectJson("zoneCode", "zoneName", resp?.data?.zones);
        // console.log("====================>zones", data)
        setZone(data);
      })
      // .catch((err) => console.log(err));
  }, []);


  useEffect(() => {
 
    if(zoneCode!==""){
      const postData = {
        zoneCode: zoneCode
      };
      axiosInstanceAuth
        .post(API_URL.ZONE_MASTER, postData).then((resp) => {
          const data = convertToFormikSelectJson("empCode", "zoneHeadName", resp?.data?.zone_master);
          setZoneHead(data)
        }).catch((resp) => {
          toast.error(resp.data.message)
        })
    }

},[zoneCode]);

useEffect(() => {
 
  if(empCode!==""){
    const postData = {
      ManagerId: empCode
    };
    axiosInstanceAuth
      .post(API_URL.ZONE_EMPLOYEE, postData).then((resp) => {
        const data = convertToFormikSelectJson("empCode", "empName", resp?.data?.zone_master);

        setEmployee(data)
      }).catch((err) => {
      
      })
  }
  },[empCode]);

  const handleSubmit = (values) => {

    // console.log("Form submitted")

  }



  return (
    <div>

      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title bolding text-black" id="exampleModalLongTitle">Zone</h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close" >
                <span aria-hidden="true">&times;
                </span>
              </button>
            </div>
            <div class="modal-body">
              <h5 className="font-weight-bold">Name: {props?.userData?.clientName}</h5>
              <h5 className="font-weight-bold">ClientCode: {props?.userData?.clientCode}</h5>
              <div class="container">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={(v) => handleSubmit(v)}
                  enableReinitialize={true}
                >
                  {(formik) => (
                      <Form>
                       
                        <div class="row">
                          <div class="col-lg-3">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="zoneName"
                              >
                                Zone
                              </label>
                              <FormikController
                                control="select"
                                name="zoneName"
                                options={zone}
                                className="form-control"
                              />
                              {formik.handleChange(
                                "zoneName",
                                setZoneCode(formik?.values?.zoneName)
                              )}
                            </div>

                          </div>
                          <div class="col-lg-3">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="zoneHeadName"
                              >
                                Zone Head
                              </label>
                              <FormikController
                                control="select"
                                name="zoneHeadName"
                                options={zoneHead}
                                className="form-control"

                              />
                               {formik.handleChange(
                                "zoneHeadName",
                                setEmpcode(formik?.values?.zoneHeadName)
                              )}

                            </div>
                          </div>
                          <div class="col-lg-3">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="zoneEmployee"
                              >
                                Zone Employee
                              </label>
                              <FormikController
                                control="select"
                                name="zoneEmployee"
                                options={employee}
                                className="form-control"

                              />

                            </div>
                          </div>
                          <div class="col-lg-3">
                            <div className="input full- optional">
                              <label
                                className="string optional"
                                htmlFor="risk_category"
                              >
                                Risk category
                              </label>
                              <FormikController
                                control="select"
                                name="risk_category"
                                options={risk}
                                className="form-control"

                              />



                            </div>
                          </div>
                          
                        </div>
                        <div class="modal-footer">
                              {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                              <button type="button" class="btn btn-primary">Update Zone</button>
                            </div>
                      </Form>
                  )}
                </Formik>
              </div>


            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default ViewZoneModal
