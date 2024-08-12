import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory, useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import classes from "./editkycDetails.module.css"
import ContactInfoEdtkyc from "./ContactInfoEdtkyc";
import BusinessOverviewEditKyc from "./BusinessOverviewEditKyc";
import BusinessDetailEdtKyc from "./BusinessDetailEdtKyc";
import BankDetailEdtKyc from "./BankDetailEdtKyc";
import DocumentUploadNewEdtKyc from "./DocumentUploadNewEdtKyc";
import SubmitKycEdt from "./SubmitKycEdt";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from 'react-select';
import { Form, Formik } from 'formik';
import { kycUserList } from "../../../slices/kycSlice";



function EditKycDetail() {
  const dispatch = useDispatch();
  const [clientCodeList, setCliencodeList] = useState([])
  const [selectedId, setSelectedId] = useState(null);
  const[showForm,setShowForm]=useState(false)

  const initialValues = {
    react_select: ""
  }

  const search = useLocation().search;
  //   const kycid = new URLSearchParams(search).get("kycid");
  const [tab, SetTab] = useState(1);

  const [title, setTitle] = useState("CONTACT INFO");
  const [kycPopUp, setKycPopUp] = useState(true);


  useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setCliencodeList(resp?.payload?.result)
    })
  }, [])

  useEffect(() => {
    dispatch(kycUserList({ login_id: selectedId}));
  }, [selectedId]);

  const handleSelectChange = (selectedOption) => {
    setSelectedId(selectedOption ? selectedOption.value : null)
    setShowForm(true)
  }

  const clientCodeOption =  [
    { value: '', label: 'Select Client Code' },
    ...clientCodeList.map((data) => ({
      value: data.loginMasterId,
      label: `${data.clientCode} - ${data.name}`
    }))
  ];








  return (
    <section className="ant-layout NunitoSans-Regular">
      <div
        // style={{ overflow: "scroll" }}
      >
       
          
           <div className="ml-3">
                <h5 className="font-weight-bold ">Edit Kyc Form</h5>

              </div>
              <Formik initialValues={initialValues}>
                <Form className="mt-4">
                  <div className="col-md-4 g-3">
                    <CustomReactSelect
                      name="react_select"
                      options={clientCodeOption}
                      placeholder="Select Client Code"
                      filterOption={createFilter({ ignoreAccents: false })}
                      label="Select Client Code"
                      onChange={handleSelectChange}
                    />
                  </div>
                </Form>
              </Formik>
 
{showForm &&
            <div className="d-lg-flex align-items-start mt-5">
              <div className={`${classes.kyc_tab_nav} nav flex-column nav-pills`} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <a href={false} className={`nav-link text-font-ForStatusChange rounded-0  ${tab === 1 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" role="tab" onClick={() => {
                  SetTab(1);
                  setTitle("CONTACT INFO");
                }} >
                  {/* {kycStatusIcon(KycTabStatusStore?.general_info_status)} */}
                  Merchant Contact Info</a>

                <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${tab === 2 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
                  SetTab(2);
                  setTitle("BUSINESS OVERVIEW");
                }}>
                  {/* {kycStatusIcon(KycTabStatusStore?.business_info_status)} */}
                  Business Overview</a>

                <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${tab === 3 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
                  SetTab(3);
                  setTitle("BUSINESS DETAILS");
                }}>
                  {/* {kycStatusIcon(KycTabStatusStore?.merchant_info_status)} */}
                  Business Details</a>

                <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${tab === 4 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
                  SetTab(4);
                  setTitle("BANK DETAILS");
                }}>
                  {/* {kycStatusIcon(KycTabStatusStore?.settlement_info_status)} */}
                  Bank Details</a>

                <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${tab === 5 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
                  SetTab(5);
                  setTitle("DOCUMENTS UPLOAD");
                }} >
                  {/* {kycStatusIcon(KycTabStatusStore?.document_status)} */}
                  Upload Document</a>

                {/* <a href={false} className={`nav-link text-font-ForStatusChange rounded-0 ${tab === 6 ? 'active' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
                    SetTab(6);
                    setTitle("SUBMIT KYC");
                  }}>
                   
                    Submit KYC</a> */}

              </div>

              <div className="tab-content w-100 overflow-auto" id="v-pills-tabContent">
                <div className="card m-0 p-0">
                  <div className="card-body">
                    <h6 className="mb-3 font-weight-bold">{title}</h6>
                    {(tab === 1 && (
                      <ContactInfoEdtkyc
                        tab={SetTab}
                        title={setTitle}
                        selectedId={selectedId}
                      />
                    )) ||
                      (tab === 2 && (
                        <BusinessOverviewEditKyc

                          tab={SetTab}
                          title={setTitle}
                          selectedId={selectedId}
                        />
                      )) ||
                      (tab === 3 && (
                        <BusinessDetailEdtKyc
                          // role={roles}
                          // kycid={kycid}
                          // merchantloginMasterId={merchantloginMasterId}
                          tab={SetTab}
                          title={setTitle}
                          selectedId={selectedId}
                        />
                      )) ||
                      (tab === 4 && (
                        <BankDetailEdtKyc
                          // role={roles}
                          // kycid={kycid}
                          // merchantloginMasterId={merchantloginMasterId}
                          tab={SetTab}
                          title={setTitle}
                          selectedId={selectedId}
                        />
                      )) ||
                      (tab === 5 && (
                        <DocumentUploadNewEdtKyc
                          // role={roles}
                          // kycid={kycid}
                          // merchantloginMasterId={merchantloginMasterId}
                          tab={SetTab}
                          tabValue={tab}
                          title={setTitle}
                          selectedId={selectedId}
                        />
                      )) ||
                      (tab === 6 && (
                        <SubmitKycEdt
                        //  role={roles}
                        //   kycid={kycid} 
                        //   merchantloginMasterId={merchantloginMasterId} 
                        />
                      )) || <ContactInfoEdtkyc
                        // role={roles}
                        //   kycid={kycid}
                        //   merchantloginMasterId={merchantloginMasterId}
                        tab={SetTab}
                        title={setTitle} />}
                  </div>
                </div>
              </div>
            </div>}
          </div>
                    
      
      
    </section>
  );
}

export default EditKycDetail;
