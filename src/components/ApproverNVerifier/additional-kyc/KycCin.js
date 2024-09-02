import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { cinLookupApi } from '../../../slices/kycValidatorSlice';
import { useDispatch } from 'react-redux';
import toastConfig from '../../../utilities/toastTypes';
import classes from "./additionalkyc.module.css"

const KycCin = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();

  const initialValues = {
    cin_number: '',
  };


  const validationSchema = Yup.object({
    cin_number: Yup.string().required('required'),
  });

  const handleSubmit = (values) => {
    setData({})
    setShow(false)
    setIsLoading(true);
    const postData = {
      cin_number: values.cin_number,
    };

    dispatch(cinLookupApi(postData)).then((res) => {

      setIsLoading(false);

      if (res.meta.requestStatus === 'fulfilled') {
        setData(res?.payload);
        // toastConfig.successToast(res?.payload?.message);
        setShow(true)
      } else {
        toastConfig.errorToast(res?.payload);
        setShow(false)
      }
    }).catch(() => {
      setIsLoading(false);

      setShow(false)
      toastConfig.errorToast("Something went wrong try again");
    });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form-inline">
            <div className="form-group d-flex align-items-start">
              <div className="input-container d-flex flex-column">
                <Field
                  type="text"
                  name="cin_number"
                  className="form-control mr-4"
                  placeholder="Enter CIN Number"
                />
                <ErrorMessage
                  name="cin_number"
                  component="div"
                  className="text-danger"
                />
              </div>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn cob-btn-primary text-white btn-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {show && (
        <>
          <div className="row mt-5">
            <div className="col-lg-6">
              <h6 className="font-weight-bold">Company Information</h6>
              <div className={`${classes.scroll_bar}`}>
                <table className="table table-bordered  ">
                  <tbody>
                    <tr>
                      <th>Status</th>
                      <td>{data?.status ? 'True' : 'False'}</td>
                    </tr>
                    <tr>
                      <th>Valid</th>
                      <td>{data?.valid ? 'True' : 'False'}</td>
                    </tr>
                    <tr>
                      <th>CIN Number</th>
                      <td>{data?.cin_number || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Business Name</th>
                      <td>{data?.business_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>ROC Code</th>
                      <td>{data?.roc_code || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Registration Number</th>
                      <td>{data?.reg_number || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>CIN Category</th>
                      <td>{data?.cin_category || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Sub Category</th>
                      <td>{data?.sub_category || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Company Class</th>
                      <td>{data?.company_class || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Authorized Capital</th>
                      <td>{data?.authorized_capital || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Paid Capital</th>
                      <td>{data?.paid_capital || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Registered Address</th>
                      <td>{data?.registered_address || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{data?.email || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Total Company Partners</th>
                      <td>{data?.total_company_partners || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Business Category</th>
                      <td>{data?.business_category || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Industry Type</th>
                      <td>{data?.industry_type || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Company Status</th>
                      <td>{data?.company_status || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Registered Address Zipcode</th>
                      <td>{data?.registered_address_zipcode || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Listed</th>
                      <td>{data?.listed || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Director PAN Number</th>
                      <td>{data?.director_pan_no || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Compliant</th>
                      <td>{data?.compliant || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Company GSTR Filings</th>
                      <td>{data?.company_GSTR_filings || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Charges</th>
                      <td>{data?.charges || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>No. of Members</th>
                      <td>{data?.no_of_members || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Company Type</th>
                      <td>{data?.company_type || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Date of Incorporation</th>
                      <td>{data?.date_of_incorporation || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Suspended at Stock Exchange</th>
                      <td>{data?.suspended_at_stock_exchange || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Balance Sheet Date</th>
                      <td>{data?.balance_sheet_date || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Address Other Than Registered Office</th>
                      <td>{data?.address_other_than_registered_office || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-6">
              <h6 className="font-weight-bold">Registered Address</h6>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>Address Line</th>
                    <td>{data?.split_address?.addressLine || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>City</th>
                    <td>{data?.split_address?.city || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>District</th>
                    <td>{data?.split_address?.district || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>State</th>
                    <td>{data?.split_address?.state || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Pincode</th>
                    <td>{data?.split_address?.pincode || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Country</th>
                    <td>{data?.split_address?.country || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


          <h6 className="font-weight-bold mt-3">Directors List</h6>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>DIN</th>
                <th>Designation</th>
                <th>Date of Appointment</th>
                <th>Address</th>
                <th>PAN</th>
                <th>Date of Birth</th>

              </tr>
            </thead>
            <tbody>
              {data?.directors_list?.map((director, index) => (
                <tr key={index}>
                  <td>{director.name || 'N/A'}</td>
                  <td>{director.din || 'N/A'}</td>
                  <td>{director.designation || 'N/A'}</td>
                  <td>{director.dateOfAppointment || 'N/A'}</td>
                  <td>{director.address || 'N/A'}</td>
                  <td>{director.pan || 'N/A'}</td>
                  <td>{director.dob || 'N/A'}</td>
                  {/* Add more data as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default KycCin;
