import moment from "moment";
const covertDate = (yourDate) => {
  let date = moment(yourDate).format("DD/MM/YYYY");
  return date;
};
export const NotFilledKYCData = [
  {
    id: "1",
    name: "S.No",
    selector: (row) => row.sno,
    sortable: true,
  },
  {
    id: "2",
    name: "Client Code",
    selector: (row) => row.clientCode,
  },
  {
    id: "3",
    name: "Merchant Name",
    selector: (row) => row?.name,
    sortable: true,
    cell: (row) => <div style={{ whiteSpace: "unset" }}>{row?.name}</div>,
  },
  {
    id: "4",
    name: "Email",
    selector: (row) => row?.emailId,
  },
  {
    id: "5",
    name: "Contact Number",
    selector: (row) => row.contactNumber,
  },
  {
    id: "6",
    name: "KYC Status",
    selector: (row) => row.status,
  },
  {
    id: "7",
    name: "Registered Date",
    selector: (row) => covertDate(row.signUpDate),
    sortable: true,
  },
  {
    id: "8",
    name: "Onboard Type",
    selector: (row) => covertDate(row.isDirect),
  },
];

export const AssignZoneData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Merchant Name" },
  {
    id: "4",
    row_name: "Email",
  },
  {
    id: "5",
    row_name: "Contact Number",
  },
  {
    id: "6",
    row_name: "KYC Status",
  },
  {
    id: "7",
    row_name: "Registered Date",
  },
  {
    id: "8",
    row_name: "Onboard Type",
  },
  {
    id: "9",
    row_name: "View Zone",
  },
];

export const ReferZoneData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Merchant Name" },
  {
    id: "4",
    row_name: "Email",
  },
  {
    id: "5",
    row_name: "Contact Number",
  },
  {
    id: "6",
    row_name: "Sourcing Point",
  },
  {
    id: "7",
    row_name: "Sourcing Code",
  },
  {
    id: "8",
    row_name: "KYC Status",
  },
  {
    id: "9",
    row_name: "Registered Date",
  },
  {
    id: "10",
    row_name: "Onboard Type",
  },
  {
    id: "11",
    row_name: "Action",
  },
];

export const TransactionRowData = [
  { id: "1", row_name: "Id" },
  { id: "2", row_name: "Client's Username" },
  { id: "3", row_name: "Amount" },
  {
    id: "4",
    row_name: "Status Type",
  },
  {
    id: "5",
    row_name: "Txn Status",
  },
  {
    id: "6",
    row_name: "Txn Type",
  },
  {
    id: "7",
    row_name: "Txn Amt Type",
  },
  {
    id: "8",
    row_name: "Customer Ref No/Order Id",
  },
  {
    id: "9",
    row_name: "Txn Completed time",
  },
  {
    id: "10",
    row_name: "Txn Initiated time",
  },
  {
    id: "11",
    row_name: "Charge",
  },
  {
    id: "12",
    row_name: "Payment Mode",
  },
  {
    id: "13",
    row_name: "Beneficiary Acc Name",
  },
  {
    id: "14",
    row_name: "Beneficiary Acc No",
  },
  {
    id: "15",
    row_name: "Beneficiary IFSC",
  },
  {
    id: "16",
    row_name: "Payout Txn Id",
  },
  {
    id: "17",
    row_name: "Opening Balance",
  },
  {
    id: "18",
    row_name: "Remarks",
  },
  {
    id: "19",
    row_name: "Created On",
  },
  {
    id: "20",
    row_name: "Updated On",
  },
  {
    id: "21",
    row_name: "Deleted On",
  },
];

export const RefundTransactionData = [
  { id: "1", row_name: "S. No" },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Client Name" },
  {
    id: "4",
    row_name: "SP Transaction ID",
  },
  {
    id: "5",
    row_name: "Client Transacrion ID",
  },
  {
    id: "6",
    row_name: "Amount",
  },
  {
    id: "7",
    row_name: "amount_adjust_on",
  },
  {
    id: "8",
    row_name: "amount_available_to_adjust",
  },
  {
    id: "9",
    row_name: "bank_name",
  },
  {
    id: "10",
    row_name: "money_asked_from_merchant",
  },
  {
    id: "11",
    row_name: "Payment Mode",
  },
  {
    id: "12",
    row_name: "refund_initiated_on",
  },
  {
    id: "13",
    row_name: "refund_process_on",
  },
  {
    id: "14",
    row_name: "refund_reason",
  },
  {
    id: "15",
    row_name: "refund_track_id",
  },
  {
    id: "16",
    row_name: "refunded_amount",
  },
  {
    id: "17",
    row_name: "trans_date",
  },
];

export const LedgerRowData = [
  { id: "1", row_name: "Id" },
  { id: "2", row_name: "Client's Username" },
  { id: "3", row_name: "Amount" },
  {
    id: "4",
    row_name: "Status Type",
  },
  {
    id: "5",
    row_name: "Txn Status",
  },
  {
    id: "6",
    row_name: "Txn Type",
  },
  {
    id: "7",
    row_name: "Txn Amt Type",
  },
  {
    id: "8",
    row_name: "Customer Ref No/Order Id",
  },
  {
    id: "9",
    row_name: "Txn Completed time",
  },
  {
    id: "10",
    row_name: "Txn Initiated time",
  },
  {
    id: "11",
    row_name: "Charge",
  },
  {
    id: "12",
    row_name: "Payment Mode",
  },
  {
    id: "13",
    row_name: "Beneficiary Acc Name",
  },
  {
    id: "14",
    row_name: "Beneficiary Acc No",
  },
  {
    id: "15",
    row_name: "Beneficiary IFSC",
  },
  {
    id: "16",
    row_name: "Payout Txn Id",
  },
  {
    id: "17",
    row_name: "Opening Balance",
  },
  {
    id: "18",
    row_name: "Remarks",
  },
  {
    id: "19",
    row_name: "Created On",
  },
];
export const beneficiaryRowData = [
  { id: "1", row_name: "Full Name" },

  { id: "2", row_name: "A/C No" },

  { id: "3", row_name: "IFSC Code" },
  { id: "4", row_name: "UPI ID" },
];

export const PendindKycData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Company Name" },
  {
    id: "4",
    row_name: "Merchant Name",
  },
  {
    id: "5",
    row_name: "Email",
  },
  {
    id: "6",
    row_name: "Contact Number",
  },
  {
    id: "7",
    row_name: "KYC Status",
  },
  {
    id: "8",
    row_name: "Registered Date",
  },
  {
    id: "9",
    row_name: "Onboard Type",
  },
  {
    id: "10",
    row_name: "View Status",
  },
  {
    id: "11",
    row_name: "Action",
  },
];

export const PendingVerificationData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Company Name" },
  {
    id: "4",
    row_name: "Merchant Name",
  },
  {
    id: "5",
    row_name: "Email",
  },
  {
    id: "6",
    row_name: "Contact Number",
  },
  {
    id: "7",
    row_name: "KYC Status",
  },
  {
    id: "8",
    row_name: "Registered Date",
  },
  {
    id: "9",
    row_name: "Onboard Type",
  },
  {
    id: "10",
    row_name: "View Status",
  },
  {
    id: "11",
    row_name: "Action",
  },
];

export const PendingApprovalData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Company Name" },
  {
    id: "4",
    row_name: "Merchant Name",
  },
  {
    id: "5",
    row_name: "Email",
  },
  {
    id: "6",
    row_name: "Contact Number",
  },
  {
    id: "7",
    row_name: "KYC Status",
  },
  {
    id: "8",
    row_name: "Registered Date",
  },
  {
    id: "9",
    row_name: "Verified Date",
  },
  {
    id: "10",
    row_name: "Onboard Type",
  },
  {
    id: "11",
    row_name: "View Status",
  },
  {
    id: "12",
    row_name: "Action",
  },
];

export const ApprovedTableData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Company Name" },
  {
    id: "4",
    row_name: "Merchant Name",
  },
  {
    id: "5",
    row_name: "Email",
  },
  {
    id: "6",
    row_name: "Contact Number",
  },
  {
    id: "7",
    row_name: "KYC Status",
  },
  {
    id: "8",
    row_name: "Registered Date",
  },
  {
    id: "9",
    row_name: "Verified Date",
  },
  {
    id: "10",
    row_name: "Approved Date",
  },
  {
    id: "11",
    row_name: "Onboard Type",
  },
  {
    id: "12",
    row_name: "View Status",
  },
  {
    id: "13",
    row_name: "Action",
  },
];

export const ChallanReportData = [
  { id: "1", row_name: "S. No." },
  { id: "2", row_name: "Client Code" },
  { id: "3", row_name: "Bank Name" },
  {
    id: "4",
    row_name: "Amount",
  },
  {
    id: "5",
    row_name: "Bank Reference No.",
  },
  {
    id: "6",
    row_name: "Challan No.",
  },
  {
    id: "7",
    row_name: "IFSC Code",
  },
  {
    id: "8",
    row_name: "GL",
  },
  {
    id: "9",
    row_name: "SplGLInd",
  },
  {
    id: "10",
    row_name: "Status",
  },
  {
    id: "11",
    row_name: "Created On",
  },
];

// For subscription paisa
export const MandateReportData = [
  { id: "1", row_name: "S.No" },
  { id: "2", row_name: "Mandate Registration Id" },
  { id: "3", row_name: "Client Code" },
  { id: "4", row_name: "Client Registration Id" },
  { id: "5", row_name: "Consumer Reference Number" },
  { id: "6", row_name: "Mandate Purpose" },
  { id: "7", row_name: "Payer Utility Code" },
  { id: "8", row_name: "Payer Name" },
  { id: "9", row_name: "Mandate End Date" },
  { id: "10", row_name: "Mandate Max Amount" },
  { id: "11", row_name: "Mandate Registration Time" },
  { id: "12", row_name: "Mandate Type" },
  { id: "13", row_name: "Merchant Id" },
  { id: "14", row_name: "Mandate Start Date" },
  { id: "15", row_name: "Message Id" },
  { id: "16", row_name: "Mandate Collect Amount" },
  { id: "17", row_name: "Pan No" },
  { id: "18", row_name: "Mandate Category" },
  { id: "19", row_name: "Payment Bank Code" },
  { id: "20", row_name: "Payer Account Number Code" },
  { id: "21", row_name: "Payer Account Type" },
  { id: "22", row_name: "Payer Bank" },
  { id: "23", row_name: "Payer Email" },
  { id: "24", row_name: "Payer Mobile" },
  { id: "25", row_name: "Telephone Number" },
  { id: "26", row_name: "Payer IFSC" },
  { id: "27", row_name: "Authentication Mode" },
  { id: "28", row_name: "Frequency" },
  { id: "29", row_name: "Request Type" },
  { id: "30", row_name: "Scheme Reference No." },
  { id: "31", row_name: "Sponsor Bank" },
  { id: "32", row_name: "Registration Status" },
  { id: "33", row_name: "Total Amount" },
  { id: "34", row_name: "UMRN Number" },
  { id: "35", row_name: "Untill Cancelled" },
  { id: "36", row_name: "Mandate Creation Date" },
  { id: "37", row_name: "Mandate Update On" },
  { id: "38", row_name: "Mandate Update By" },
  { id: "39", row_name: "Regestration Error Code" },
  { id: "40", row_name: "Regestration Error Desc" },
  { id: "41", row_name: "Regestration Npci Ref Id" },
  { id: "42", row_name: "Accept Details Cre_Dt_Tm" },
  { id: "43", row_name: "Bank Name" },
  { id: "44", row_name: "Mandate Category" },
  { id: "45", row_name: "Mandate Physical Path" },
  { id: "46", row_name: "isphymndtupdate" },
  { id: "47", row_name: "isphymndtupdatedon" },
  { id: "48", row_name: "isphymndtupdatedby" },
  { id: "49", row_name: "isphymndtapprove" },
  { id: "50", row_name: "isphymndtapproveon" },
  { id: "51", row_name: "isphymndtapproveby" },
  { id: "52", row_name: "userType" },
  { id: "53", row_name: "mandateImage" },
  { id: "54", row_name: "EMI Amount" },
  { id: "55", row_name: "mandateCancelled" },
  { id: "56", row_name: "reqInitPty" },
  { id: "57", row_name: "accptd" },
  { id: "58", row_name: "reasonCode" },
  { id: "59", row_name: "reasonDesc" },
  { id: "60", row_name: "rejectBy" },
  { id: "61", row_name: "accptRefNo" },
  { id: "62", row_name: "tableData" },
];
