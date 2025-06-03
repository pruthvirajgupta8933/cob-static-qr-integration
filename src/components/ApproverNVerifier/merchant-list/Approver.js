/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PendingVerification from "./PendingVerification";
import VerifiedMerchant from "./VerifiedMerchant";
import ApprovedMerchant from "./ApprovedMerchant";
import PendindKyc from "./PendindKyc";
import NotFilledKYC from "./NotFilledKYC";
import RejectedKYC from "./RejectedKYC";
import { roleBasedAccess } from "../../../_components/reuseable_components/roleBasedAccess";
import { logout } from "../../../slices/auth";
import { merchantTab } from "../../../slices/approverVerifierTabSlice";
import classes from "../approver.module.css";
import { getAllCLientCodeSlice } from "../../../slices/approver-dashboard/approverDashboardSlice";
import DateFormatter from "../../../utilities/DateConvert";
import CardLayout from "../../../utilities/CardLayout";

const Approver = () => {
  const verifierApproverTab = useSelector((state) => state.verifierApproverTab);
  const currenTab = parseInt(verifierApproverTab?.currenTab);

  const dispatch = useDispatch();


  const commonRows = [
    {
      id: "1",
      name: "S.No",
      selector: (row) => row.sno,
      sortable: true,
      width: "90px",
    },
    {
      id: "2",
      name: "Client Code",
      selector: (row) => row.clientCode,
      cell: (row) => <div className="text-nowrap text-truncate">{row?.clientCode}</div>, // Bootstrap text utility
      width: "130px",
    },
    {
      id: "3",
      name: "Company Name",
      selector: (row) => row.companyName,
      cell: (row) => <div className="text-nowrap text-truncate">{row?.companyName}</div>,
      width: "180px",
    },
    {
      id: "5",
      name: "Email",
      selector: (row) => row.emailId,
      cell: (row) => <div className="text-nowrap text-truncate">{row?.emailId}</div>,
      width: "220px",
    },
    {
      id: "6",
      name: "Contact Number",
      selector: (row) => row.contactNumber,
      cell: (row) => (
        <div className="text-nowrap text-truncate">{row?.contactNumber}</div>
      ),
      width: "150px",
    },
    {
      id: "7",
      name: "KYC Status",
      selector: (row) => row.status,
    },
    {
      id: "8",
      name: "Registered Date",
      selector: (row) => row.signUpDate,
      sortable: true,
      cell: (row) => <div className="text-nowrap">{DateFormatter(row.signUpDate)}</div>,
      width: "150px",
    },
    {
      id: "9",
      name: "Zone Name",
      selector: (row) => row.zoneName,
    },
    {
      id: "10",
      name: "Source",
      selector: (row) => row.isDirect,
    },
    {
      id: "11",
      name: "Onboard Type",
      width: "150px",
      selector: (row) => row.onboard_type,
    },
    {
      id: "12",
      name: "Submitted Date",
      selector: (row) => row.updated_on,
      sortable: true,
      cell: (row) => <div className="text-nowrap">{DateFormatter(row.updated_on)}</div>,
      width: "150px",
    },
    {
      id: "13",
      name: "Emp. Code",
      selector: (row) => row.emp_code,
    },
    {
      id: "14",
      name: "Risk Category",
      selector: (row) => row.risk_category_name,
      width: "150px",
    },
    {
      id: "15",
      name: "MCC",
      selector: (row) => row.mcc,
      width: "150px",
    },
  ];

  const loggedUser = roleBasedAccess();


  useEffect(() => {
    if (!loggedUser?.approver && !loggedUser?.verifier && !loggedUser?.viewer) {
      dispatch(logout());
    }
  }, [loggedUser, dispatch]);

  // Callback to fetch all client codes
  const fetchAllClientCode = useCallback(() => {
    dispatch(getAllCLientCodeSlice());
  }, [dispatch]);


  useEffect(() => {
    fetchAllClientCode();
  }, [fetchAllClientCode]);

  const handleTabClick = (newTab) => {
    dispatch(merchantTab(newTab));
  };

  return (
    <CardLayout title="Merchant List">
      <section>
        <div className="row mt-4">
          <div className="col-12 mb-4">

            <ul className="nav nav-tabs flex-nowrap overflow-auto pb-2">
              <li className="nav-item flex-shrink-0">
                <a
                  href="#not-filled-kyc"
                  className={`nav-link ${currenTab === 1 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(1); }}
                >
                  Not Filled KYC
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  href="#pending-kyc"
                  className={`nav-link ${currenTab === 2 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(2); }}
                >
                  Pending KYC
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  href="#pending-verification"
                  className={`nav-link ${currenTab === 3 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(3); }}
                >
                  Pending Verification
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  href="#pending-approval"
                  className={`nav-link ${currenTab === 4 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(4); }}
                >
                  Pending Approval
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  href="#approved"
                  className={`nav-link ${currenTab === 5 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(5); }}
                >
                  Approved
                </a>
              </li>
              <li className="nav-item flex-shrink-0">
                <a
                  href="#rejected"
                  className={`nav-link ${currenTab === 6 ? `${classes.active_tab} active` : "inactive"} ${classes.cursor_pointer}`}
                  onClick={(e) => { e.preventDefault(); handleTabClick(6); }}
                >
                  Rejected
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="row">
          <div className="col-12">

            {(currenTab === 1 && <NotFilledKYC />) ||
              (currenTab === 2 && <PendindKyc commonRows={commonRows} />) ||
              (currenTab === 3 && (
                <PendingVerification commonRows={commonRows} />
              )) ||
              (currenTab === 4 && (
                <VerifiedMerchant commonRows={commonRows} />
              )) ||
              (currenTab === 5 && (
                <ApprovedMerchant commonRows={commonRows} />
              )) ||
              (currenTab === 6 && (
                <RejectedKYC commonRows={commonRows} />
              )) || <NotFilledKYC />
            }
          </div>
        </div>
      </section>
    </CardLayout>
  );
};

export default Approver;