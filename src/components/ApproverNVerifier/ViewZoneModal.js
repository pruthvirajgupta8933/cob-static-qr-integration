import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik";
import API_URL from '../../config';
import { toast } from "react-toastify";
import * as Yup from "yup";
import { convertToFormikSelectJson } from "../../_components/reuseable_components/convertToFormikSelectJson";
import FormikController from "../../_components/formik/FormikController";
import { axiosInstanceAuth } from '../../utilities/axiosInstance';
import { useDispatch, useSelector } from "react-redux";
import { zoneDetail,zoneMaster,zoneEmployee,updateZoneData,getZoneInfo} from '../../slices/merchantZoneMappingSlice';

const initialValues = {
  zoneName: "",
  zoneHeadName: "",
  zoneEmployee: "",
  risk_category: "0"
}

const validationSchema = Yup.object({
  zoneName: Yup.string().required("Required").nullable(),
  zoneHeadName: Yup.string().required("Required").nullable(),
  zoneEmployee: Yup.string().required("Required").nullable(),
  // risk_category: Yup.string().required("Required").nullable()
})


const ViewZoneModal = (props) => {
  const [zone, setZone] = useState([])
  const [zoneHead, setZoneHead] = useState([])
  const [employee, setEmployee] = useState([])
  const [risk, setRisk] = useState([])
  const [show, setShow] = useState(true);
  const [zoneCode, setZoneCode] = useState("")
  const [empCode, setEmpcode] = useState("")
  const[zoneInfo,setZoneinfo]=useState([])
  const dispatch = useDispatch();


  // useEffect(() => {
  //   axiosInstanceAuth
  //     .get(API_URL.RISK_CATEGORY)
  //     .then((resp) => {
  //       const data =
  //         convertToFormikSelectJson("risk_category_code", "risk_category_name", resp?.data);

  //       setRisk(data);
        
  //     })
  //   // .catch((err) => console.log(err));
  // }, []);


  // useEffect(() => {
  //   axiosInstanceAuth
  //     .get(API_URL.ZONE_DETAILS)
  //     .then((resp) => {
  //       const data = convertToFormikSelectJson("zoneCode", "zoneName", resp?.data?.zones);
  //       setZone(data);
  //     })
  //   // .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    dispatch(zoneDetail()).then((resp) => {
            const data = convertToFormikSelectJson("zoneCode", "zoneName", resp?.payload?.zones);
             setZone(data)
            })
            .catch((err) => console.log(err));
  }, []);


  useEffect(() => {

    if (zoneCode !== "") {
      const postData = {
        zoneCode: zoneCode
      };
     dispatch(zoneMaster(postData)).then((resp) => {
          const data = convertToFormikSelectJson("empCode", "zoneHeadName", resp?.payload?.zone_master);
          setZoneHead(data)
        }).catch(() => {

        })
    }

  }, [zoneCode]);

  useEffect(() => {

    if (empCode !== "") {
      const postData = {
        ManagerId: empCode
      };
      dispatch(zoneEmployee(postData)).then((resp) => {
          const data = convertToFormikSelectJson("empCode", "empName", resp?.payload?.zone_master);

          setEmployee(data)
        }).catch((err) => {

        })
    }
  }, [empCode]);

  const handleSubmit = (values) => {
    //  console.log("vlaues",values);

    const postData = {
      "client_code": props?.userData?.clientCode,
      "risk_category_code": values?.risk_category,
      "zone_code": values?.zoneName,
      "zone_head_emp_code": values?.zoneHeadName,
      "emp_code": values?.zoneEmployee,

    };
    dispatch(updateZoneData(postData)).then((resp) => {
        toast.success(resp?.data?.message);
        getZoneInfobyClientCode(props?.userData?.clientCode)
        setShow(true)
      }).catch(() => {


      })
  }



  useEffect(()=>{
    if(props?.userData?.clientCode){
      getZoneInfobyClientCode(props?.userData?.clientCode);

    }
    
  
   },[props])



  const getZoneInfobyClientCode=(clientCode)=>{
    const postData = {
      client_code: clientCode
    };
    
      dispatch(getZoneInfo(postData)).then((resp) => {
       
        setZoneinfo(resp?.payload)

       
      }).catch(() => {

      })

  }



  // const totalPages = Math.ceil(dataCount / pageSize);
  // const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  
  // const nextPage = () => {
  //   if (currentPage < pageNumbers?.length) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const prevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };


  // useEffect(() => {
  //   let lastSevenPage = totalPages - 7;
  //   if (pageNumbers?.length>0) {
  //     let start = 0
  //     let end = (currentPage + 6)
  //     if (totalPages > 6) {
  //       start = (currentPage - 1)
  
  //       if (parseInt(lastSevenPage) <= parseInt(start)) {
  //         start = lastSevenPage
  //       }
  
  //     }
  //     const pageNumber = pageNumbers.slice(start, end)?.map((pgNumber, i) => {
  //       return pgNumber;
  //     })   
  //    setDisplayPageNumber(pageNumber) 
  //   }
  // }, [currentPage, totalPages])


  return (
    <div>

      <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              // onSubmit={(values)=>handleSubmit(values)}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values)
                resetForm()
              }}
              enableReinitialize={true}
            >
              {(formik, resetForm) => (

                <>

                  <div className="modal-header">
                    <h5 className="modal-title bolding text-black" id="exampleModalLongTitle">Zone</h5>

                    <button type="button" className="close" data-dismiss="modal" aria-label="Close"  >
                      <span aria-hidden="true">&times;
                      </span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h5 className="font-weight-bold">Name: {props?.userData?.clientName}</h5>
                    <h5 className="font-weight-bold">ClientCode: {props?.userData?.clientCode}</h5>
                    <div className="container">

                      <Form>

                        <div className="row">
                          <div className="col-lg-4">
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
                          <div className="col-lg-4">
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
                         
                          
                            <div className="col-lg-4">
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
                            {/* <div className="col-lg-6">
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
                            </div> */}
                          </div>

                        
                        <div className="modal-footer">
                          {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button> */}
                          <button type="subbmit" onClick={resetForm} className="btn btn-primary">Update Zone</button>
                        </div>
                      </Form>


                    </div>

                  </div>


                </>
              )}

            </Formik>
            {show === true ? (
            <table className="table">
            
  <thead>
    <tr>
      
      <th scope="col">Zone Name</th>
      <th scope="col">Zone Head Name</th>
      <th scope="col">Employee Name</th>
      {/* <th scope="col">Risk Category</th> */}
      </tr>
  </thead>
  <tbody>
    <tr>
      <td>{zoneInfo?.zone_name}</td>
      <td>{zoneInfo?.zone_head_name}</td>
      <td>{zoneInfo?.employee_name}</td>
      {/* <td>{zoneInfo?.risk_name}</td> */}
    </tr>
  </tbody>
</table>
  ) : (
    <></>
  )}


          </div>

        </div>
      </div>

    </div>
  )
}

export default ViewZoneModal
