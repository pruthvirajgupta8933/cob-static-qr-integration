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
import { documentsUpload,merchantInfo} from "../../slices/kycSlice"


function DocumentsUpload() {
  const [docTypeList, setDocTypeList] = useState([])
  const [fieldValue, setFieldValue] = useState(null);
  const [visibility, setVisibility] = useState(false)
  const [photos, setPhotos] = useState([]);
  const { user } = useSelector((state) => state.auth);
  var clientMerchantDetailsList = user.clientMerchantDetailsList;
  // const { clientCode } = clientMerchantDetailsList[0];
  const { loginId } = user;
  const dispatch = useDispatch();

  const KycDocList = useSelector(
    (state) =>
      state.kyc.KycDocUpload
  );

  const VerifyKycStatus = useSelector(
      (state) =>
        state.kyc.KycDocUpload[0]?.status
    )


 

  

  

  const initialValues = {
    docType:KycDocList[0]?.type,
    docFile:"",

  }


  const documentId = useSelector(
    (state) =>
      state.kyc.KycDocUpload[0]?.documentId
  );


   const ImgUrl = `${API_URL.Image_Preview}/?document_id=${documentId}`
    // console.log(ImgUrl,"<===========KYC DOC Id===========>")
    // console.log(KycDocList,"<===========KYC DOC List===========>")


    useEffect(() => {
      dispatch(documentsUpload()).then((resp) => {
        const data = convertToFormikSelectJson('id', 'name', resp.payload.results);
        setDocTypeList(data)
      }).catch(err => console.log(err))
    }, [])
  

  const validationSchema = Yup.object({
    docType: Yup.string().required("Required"),
    docFile: Yup.mixed()
      .nullable()
      .required('Required file format PNG/JPEG/JPG/PDF')
  })

  



  const displayImages = () => {
    return photos.map(photo => {
      return <img src = {photo} alt= "" />
    })
  }


  //----------------------------------------------------------------------






  //-------------------------------------------------------------------------
  const onSubmit = values => {
    const bodyFormData = new FormData();
    bodyFormData.append('files', fieldValue);
    // bodyFormData.append("client_code", [clientCode]);
    bodyFormData.append('login_id', loginId);
    bodyFormData.append('modified_by', loginId);
    bodyFormData.append('type', values.docType);
   dispatch(merchantInfo(bodyFormData))
   .then((res) => {
    if (res.meta.requestStatus === "fulfilled" && res.payload.status === true) {
      // console.log("This is the response", res);
      toast.success(res.payload.message);
    } else {
      toast.error("Something Went Wrong! Please try again.");

    }
  });
  }
  return (
    <div className="col-md-12 col-md-offset-4">
      <div className="">
        <p> Note : Please complete Business Overview Section to view the list of applicable documents!</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {formik => (
          <Form>
            <ul className="list-inline  align-items-center ">
              <li className="list-inline-item align-middle  w-25" >
                <div className="form-group col-md-12">
                  <FormikController
                    control="select"
                    label="Document Type"
                    name="docType"
                    className="form-control"
                    options={docTypeList}
                    disabled={ VerifyKycStatus === "Verified" ? true : false}

                  />
                </div>
              </li>
              <li className="list-inline-item align-middle   w-25" >
                <div className="form-group col-md-12">


                  <FormikController
                    control="file"
                    type="file"
                    label="Select Document"
                    name="docFile"
                    className="form-control-file"
                    onChange={(event) => {
                      setFieldValue(event.target.files[0])
                      formik.setFieldValue("docFile", event.target.files[0].name)
                    }}

                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                    disabled={VerifyKycStatus === "Verified" ? true : false}

                  // onChange={(event)=>{setFieldValue(event.target.files[0])}}
                  />
                </div>
              </li>
              <li className="list-inline-item align-middle w-25" >
                { VerifyKycStatus === "Verified" ? null :
                <button className="btn btn-primary mb-0" type="submit">Upload and Next</button>
                }
              </li>
              {/* <li className="list-inline-item align-middle   w-25" > Download</li> */}
            </ul>
          </Form>          
        )}
      </Formik>
      <div>
      </div>
      { user?.roleId === 3 && user?.roleId === 13 ? <></> : documentId === null ? "" :
      <div class= "mt-md-4">
      <h4 class="font-weight-bold mt-xl-4">ImagePreview</h4>
                            <a href= {ImgUrl} target="_blank">
                            <img src = {ImgUrl} alt="" width="50px" height="50px"/>
                            </a>
                        
      </div>
     }

    </div>
  )
}

export default DocumentsUpload