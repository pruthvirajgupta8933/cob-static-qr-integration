import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import classes from "./editkycDetails.module.css"
import ContactInfoEdtkyc from "./ContactInfoEdtkyc";
import BusinessOverviewEditKyc from "./BusinessOverviewEditKyc";
import BusinessDetailEdtKyc from "./BusinessDetailEdtKyc";
import BankDetailEdtKyc from "./BankDetailEdtKyc";
import DocumentUploadNewEdtKyc from "./DocumentUploadNewEdtKyc";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import CustomReactSelect from "../../../_components/formik/components/CustomReactSelect";
import { createFilter } from 'react-select';
import { Form, Formik } from 'formik';
import { kycUserList } from "../../../slices/kycSlice";
import ViewDocument from "./ViewDocument";
import SaveLocation from "../Onboarderchant/ViewKycDetails/SaveLocation";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";



function EditKycDetail() {
  const dispatch = useDispatch();
  const [clientCodeList, setCliencodeList] = useState([])
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false)
  const [tab, SetTab] = useState(1);
  const [title, setTitle] = useState("CONTACT INFO");

  const initialValues = {
    react_select: ""
  }

  useEffect(() => {
    dispatch(getAllCLientCodeSlice()).then((resp) => {
      setCliencodeList(resp?.payload?.result)
    })
  }, [])

  useEffect(() => {
    dispatch(kycUserList({ login_id: selectedId, masking: 1 }));
  }, [selectedId]);

  const handleSelectChange = (selectedOption) => {
    setSelectedId(selectedOption ? selectedOption.value : null)
    setShowForm(true)
    SetTab(1)
  }

  const clientCodeOption = [
    { value: '', label: 'Select Client Code' },
    ...clientCodeList?.map((data) => ({
      value: data.loginMasterId,
      label: `${data.clientCode} - ${data.name}`
    }))
  ];

  
    const roles = roleBasedAccess();

  return (
    <section className="ant-layout NunitoSans-Regular">
      <div className="ml-3">
        <h5 className="font-weight-bold ">Edit KYC</h5>
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
            <a href={false} className={`nav-link kyc-menu-font rounded-0  ${tab === 1 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" role="tab" onClick={() => {
              SetTab(1);
              setTitle("CONTACT INFO");
            }} >
              Merchant Contact Info</a>

            <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 2 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(2);
              setTitle("BUSINESS OVERVIEW");
            }}>

              Business Overview</a>

            <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 3 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(3);
              setTitle("BUSINESS DETAILS");
            }}>

              Business Details</a>

            <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 4 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(4);
              setTitle("BANK DETAILS");
            }}>

              Bank Details</a>

            <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 5 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(5);
              setTitle("DOCUMENTS UPLOAD");
            }} >

              Upload Document</a>

            <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 6 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(6);
              setTitle("VIEW DOCUMENT");
            }} >

              View Document</a>
             <a href={false} className={`nav-link kyc-menu-font rounded-0 ${tab === 7 ? 'btn btn-sm cob-btn-primary  text-white' : ''} ${classes.kyc_tab_link}`} type="button" onClick={() => {
              SetTab(7);
              setTitle("Update Location");
            }} >

              Update Location</a>
          </div>

          <div className="tab-content w-100 overflow-auto" id="v-pills-tabContent">
            <div className="card m-0 p-0 rounded-0">
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
                      tab={SetTab}
                      title={setTitle}
                      selectedId={selectedId}
                    />
                  )) ||
                  (tab === 4 && (
                    <BankDetailEdtKyc
                      tab={SetTab}
                      title={setTitle}
                      selectedId={selectedId}
                    />
                  )) ||
                  (tab === 5 && (
                    <DocumentUploadNewEdtKyc
                      tab={SetTab}
                      tabValue={tab}
                      title={setTitle}
                      selectedId={selectedId}
                    />
                  )) ||
                  (tab === 6 && (
                    <ViewDocument selectedId={selectedId} />
                  )) || (tab === 7 && (
                    <SaveLocation role={roles} propCurrentTab={3}  />
                  )) || <ContactInfoEdtkyc

                    tab={SetTab}
                    title={setTitle}
                    selectedId={selectedId} />}
              </div>
            </div>
          </div>
        </div>}




    </section>
  );
}

export default EditKycDetail;
