import moment from "moment";
const covertDate = (yourDate) => {
  let date = moment(yourDate).format("DD/MM/YYYY hh:mm a");
  return date;
};

function capitalizeFirstLetter(param) {
  return param?.charAt(0).toUpperCase() + param?.slice(1);
}

export const NotFilledKYCData = [
  {
    id: "1",
    name: "S.No",
    selector: (row) => row.sno,

    sortable: true,
    width: "90px",
    cell: (row) => <div className="removeWhiteSpace">{row?.sno}</div>,

  },
  {
    id: "2",
    name: "Client Code",
    selector: (row) => row.clientCode,
    cell: (row) => <div className="removeWhiteSpace">{row?.clientCode}</div>,
    width: "130px",
  },
  {
    key: "name",
    // id: "3",P
    name: "Merchant Name",
    selector: (row) => row?.name,
    sortable: true,
    cell: (row) => (
      <div className="removeWhiteSpace">
        {capitalizeFirstLetter(row?.name ? row?.name : "NA")}
      </div>
    ),
    width: "200px",
  },



  {
    id: "4",
    name: "Email",
    selector: (row) => row?.emailId,
    cell: (row) => <div className="removeWhiteSpace">{row?.emailId}</div>,
    width: "250px",
  },
  {
    id: "5",
    name: "Contact Number",
    selector: (row) => row.contactNumber,
    cell: (row) => <div className="removeWhiteSpace">{row?.contactNumber}</div>,
    width: "150px",
  },
  {
    id: "6",
    name: "KYC Status",
    selector: (row) => row.status,
  },
  {
    id: "7",
    name: "Registered Date",
    selector: (row) => row.signUpDate,
    sortable: true,
    cell: (row) => <div>{covertDate(row.signUpDate)}</div>,
    width: "150px",
  },
  {
    id: "8",
    name: "Onboard Type",
    selector: (row) => row.isDirect,
  },
];


export const AllMerchnatListData = [
  {
    id: "1",
    name: "S.No",
    selector: (row) => row.s_no,
    sortable: true,
    width: "95px",
  },


];

export const ChallanReportData = [
  {
    id: "1",
    name: "S.No",
    selector: (row) => row.sno,
    sortable: true,
    width: "95px",
  },
  {
    id: "2",
    name: "Client Code",
    selector: (row) => row.client_code,
    width: "130px",
  },

  // {
  //   id: "3",
  //   name: "Bank Name",
  //   selector: (row) => row.bank_code,
  //   cell: (row) => <div className="removeWhiteSpace">{row?.bank_code}</div>,
  //   sortable: true,
  //   width: "150px",
  // },
  {
    id: "3",
    name: "Amount",
    selector: (row) => row.amount,
    cell: (row) => (
      <div className="removeWhiteSpace">
        {new Intl.NumberFormat('en-IN').format(row?.amount)}
      </div>
    ),
  },



  {
    id: "4",
    name: "Bank Reference No.",
    selector: (row) => row.bank_reference_number,
    cell: (row) => (
      <div className="removeWhiteSpace">{row?.bank_reference_number}</div>
    ),
    width: "200px",
  },
  {
    id: "5",
    name: "Challan No.",
    selector: (row) => row.challan_number,
    cell: (row) => (
      <div className="removeWhiteSpace">{row?.challan_number}</div>
    ),
    width: "200px",
  },
  // {
  //   id: "7",
  //   name: "IFSC Code",
  //   selector: (row) => row.ifsc,
  // },
  {
    id: "6",
    name: "GL",
    selector: (row) => row.gl,
    cell: (row) => <div className="removeWhiteSpace">{row?.gl}</div>,
  },
  // {
  //   id: "9",
  //   name: "SplGLInd",
  //   selector: (row) => row.sp_igl_ind,
  //   cell: (row) => <div className="removeWhiteSpace">{row?.sp_igl_ind}</div>,
  // },
  // {
  //   id: "8",
  //   name: "Status",
  //   selector: (row) => row.type,
  // },
  {
    id: "7",
    name: "Created On",
    selector: (row) => row.created_on,
    cell: (row) => covertDate(row.created_on),
    sortable: true,
    width: "200px",
  },
];

export const AssignZoneData = [
  { id: "1", name: "S. No." },
  { id: "2", name: "Client Code" },
  { id: "3", name: "Merchant Name" },
  {
    id: "4",
    name: "Email",
  },
  {
    id: "5",
    name: "Contact Number",
  },
  {
    id: "6",
    name: "KYC Status",
  },
  {
    id: "7",
    name: "Registered Date",
  },
  {
    id: "8",
    name: "Onboard Type",
  },
  {
    id: "9",
    name: "View Zone",
  },
];

export const TransactionRowData = [
  {
    id: "1",
    name: "S.No",
    width: "86px",
    selector: (row) => row.sno,
    sortable: true,
  },
  {
    id: "2",
    name: "Client's Username",
    selector: (row) => row.client_username,
  },
  {
    id: "3",
    width: "80px",
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
  },
  {
    id: "4",
    name: "Status Type",
    selector: (row) => row.type_status,
    width: "100px",
  },
  {
    id: "5",
    name: "Txn Status",
    selector: (row) => row.trans_status,
    width: "100px",
  },
  {
    id: "6",
    name: "Txn Type",
    selector: (row) => row.trans_type.toUpperCase(),
    width: "100px",
  },
  {
    id: "7",
    name: "Txn Amt Type",
    selector: (row) => row.trans_amount_type,
    width: "100px",
  },
  {
    id: "8",
    name: "Customer Ref No/Order Id",
    selector: (row) => row.customer_ref_no,
    width: "300px",
  },
  {
    id: "9",
    name: "Txn Completed time",
    selector: (row) => row.trans_completed_time,
    cell: (row) => <div>{covertDate(row.trans_completed_time)}</div>,
    sortable: true,
    width: "120px",
  },
  {
    id: "10",
    name: "Txn Initiated time",
    selector: (row) => row.trans_init_time,
    cell: (row) => <div>{covertDate(row.trans_init_time)}</div>,
    sortable: true,
    width: "120px",
  },
  {
    id: "11",
    name: "Charge",
    selector: (row) => `₹${row.charge.toFixed(2)}`,
    sortable: true,
  },
  {
    id: "12",
    name: "Payment Mode",
    selector: (row) => row.payment_mode,
  },
  {
    id: "13",
    name: "Beneficiary Acc Name",
    selector: (row) => row.bene_account_name,
    width: "220px",
  },
  {
    id: "14",
    name: "Beneficiary Acc No",
    selector: (row) => row.bene_account_number,
    width: "150px",
  },
  {
    id: "15",
    name: "Beneficiary IFSC",
    selector: (row) => row.bene_ifsc,
    width: "120px",
  },
  {
    id: "16",
    name: "Payout Txn Id",
    selector: (row) => row.payout_trans_id,
    width: "220px",
  },
  {
    id: "17",
    name: "Opening Balance",
    selector: (row) => row.opening_balance,
    sortable: true,
    width: "100px",
  },
  {
    id: "18",
    name: "Remarks",
    selector: (row) => row.remarks,
    width: "200px",
    cell: (row) => <div className="removeWhiteSpace">{row.remarks}</div>,
  },
  {
    id: "19",
    name: "Created On",
    selector: (row) => row.created_at,
    cell: (row) => <div>{covertDate(row.created_at)}</div>,
    sortable: true,
    width: "120px",
  },
  {
    id: "20",
    name: "Updated On",
    cell: (row) => <div>{covertDate(row.updated_at)}</div>,
    sortable: true
  },
  {
    id: "21",
    name: "Deleted On",
    cell: (row) => <div>{covertDate(row.deleted_at)}</div>,
    sortable: true
  },
];

export const RefundTransactionData = [
  { id: "1", name: "S. No" },
  { id: "2", name: "Client Code" },
  { id: "3", name: "Client Name" },
  {
    id: "4",
    name: "SP Transaction ID",
  },
  {
    id: "5",
    name: "Client Transacrion ID",
  },
  {
    id: "6",
    name: "Amount",
  },
  {
    id: "7",
    name: "amount_adjust_on",
  },
  {
    id: "8",
    name: "amount_available_to_adjust",
  },
  {
    id: "9",
    name: "bank_name",
  },
  {
    id: "10",
    name: "money_asked_from_merchant",
  },
  {
    id: "11",
    name: "Payment Mode",
  },
  {
    id: "12",
    name: "refund_initiated_on",
  },
  {
    id: "13",
    name: "refund_process_on",
  },
  {
    id: "14",
    name: "refund_reason",
  },
  {
    id: "15",
    name: "refund_track_id",
  },
  {
    id: "16",
    name: "refunded_amount",
  },
  {
    id: "17",
    name: "trans_date",
  },
];

export const LedgerRowData = [
  {
    id: "1",
    name: "S.No",
    width: "86px",
    selector: (row) => row.sno,
    sortable: true,
  },
  {
    id: "2",
    name: "Client's Username",
    selector: (row) => row.client_username,
  },
  {
    id: "3",
    width: "80px",
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
  },
  {
    id: "4",
    name: "Status Type",
    selector: (row) => row.type_status,
    width: "100px",
  },
  {
    id: "5",
    name: "Txn Status",
    selector: (row) => row.trans_status,
    width: "100px",
  },
  {
    id: "6",
    name: "Txn Type",
    selector: (row) => row.trans_type.toUpperCase(),
    width: "100px",
  },
  {
    id: "7",
    name: "Txn Amt Type",
    selector: (row) => row.trans_amount_type,
    width: "100px",
  },
  {
    id: "8",
    name: "Customer Ref No/Order Id",
    selector: (row) => row.customer_ref_no,
    width: "300px",
  },
  {
    id: "9",
    name: "Txn Completed time",
    selector: (row) => row.trans_completed_time,
    cell: (row) => <div>{covertDate(row.trans_completed_time)}</div>,
    sortable: true,
    width: "120px",
  },
  {
    id: "10",
    name: "Txn Initiated time",
    selector: (row) => row.trans_init_time,
    cell: (row) => <div>{covertDate(row.trans_init_time)}</div>,
    sortable: true,
    width: "120px",
  },
  {
    id: "11",
    name: "Charge",
    selector: (row) => `₹${row.charge.toFixed(2)}`,
    sortable: true,
  },
  {
    id: "12",
    name: "Payment Mode",
    selector: (row) => row.payment_mode,
  },
  {
    id: "13",
    name: "Beneficiary Acc Name",
    selector: (row) => row.bene_account_name,
    width: "220px",
  },
  {
    id: "14",
    name: "Beneficiary Acc No",
    selector: (row) => row.bene_account_number,
    width: "150px",
  },
  {
    id: "15",
    name: "Beneficiary IFSC",
    selector: (row) => row.bene_ifsc,
    width: "120px",
  },
  {
    id: "16",
    name: "Payout Txn Id",
    selector: (row) => row.payout_trans_id,
    width: "220px",
  },
  {
    id: "17",
    name: "Opening Balance",
    selector: (row) => row.opening_balance,
    sortable: true,
    width: "100px",
  },
  {
    id: "18",
    name: "Remarks",
    selector: (row) => row.remarks,
    width: "200px",
    cell: (row) => <div className="removeWhiteSpace">{row.remarks}</div>,
  },
  {
    id: "19",
    name: "Created On",
    selector: (row) => row.created_at,
    cell: (row) => <div>{covertDate(row.created_at)}</div>,
    sortable: true,
    width: "120px",
  },
];
export const beneficiaryRowData = [
  {
    id: "0",
    name: "S.No",
    selector: (row) => row.sno,
    sortable: true,
    width: "86px",
    sortable: true,
  },
  {
    id: "1",
    name: "Full Name",
    selector: (row) => row.full_name,
    width: "200px",
  },

  {
    id: "2",
    name: "A/C No",
    selector: (row) => row.account_number,
    width: "200px",
  },

  {
    id: "3",
    name: "IFSC Code",
    selector: (row) => row.ifsc_code,
    width: "150px",
  },
  {
    id: "4",
    name: "UPI ID",
    selector: (row) => row.upi_id,
    // width: "200px",
    // cell: (row) => <div>{row.upi_id}</div>,
  },
];

export const PendingVerificationData = [
  { id: "1", name: "S. No." },
  { id: "2", name: "Client Code", selector: (row) => row.clientCode },
  { id: "3", name: "Company Name" },
  {
    id: "4",
    name: "Merchant Name",
  },
  {
    id: "5",
    name: "Email",
  },
  {
    id: "6",
    name: "Contact Number",
  },
  {
    id: "7",
    name: "KYC Status",
  },
  {
    id: "8",
    name: "Registered Date",
  },
  {
    id: "9",
    name: "Onboard Type",
  },
  {
    id: "10",
    name: "View Status",
    selector: (row) => row.viewStatus,
  },
  {
    id: "11",
    name: "Action",
  },
];

export const PendingApprovalData = [
  { id: "1", name: "S. No." },
  { id: "2", name: "Client Code" },
  { id: "3", name: "Company Name" },
  {
    id: "4",
    name: "Merchant Name",
  },
  {
    id: "5",
    name: "Email",
  },
  {
    id: "6",
    name: "Contact Number",
  },
  {
    id: "7",
    name: "KYC Status",
  },
  {
    id: "8",
    name: "Registered Date",
  },
  {
    id: "9",
    name: "Verified Date",
  },
  {
    id: "10",
    name: "Onboard Type",
  },
  {
    id: "11",
    name: "View Status",
  },
  {
    id: "12",
    name: "Action",
  },
];

export const ApprovedTableData = [
  { id: "1", name: "S. No." },
  { id: "2", name: "Client Code" },
  { id: "3", name: "Company Name" },
  {
    id: "4",
    name: "Merchant Name",
  },
  {
    id: "5",
    name: "Email",
  },
  {
    id: "6",
    name: "Contact Number",
  },
  {
    id: "7",
    name: "KYC Status",
  },
  {
    id: "8",
    name: "Registered Date",
  },
  {
    id: "9",
    name: "Verified Date",
  },
  {
    id: "10",
    name: "Approved Date",
  },
  {
    id: "11",
    name: "Onboard Type",
  },
  {
    id: "12",
    name: "View Status",
  },
  {
    id: "13",
    name: "Action",
  },
];

// For subscription paisa
export const MandateReportData = [
  { id: "1", name: "S.No", selector: (row) => row.sno },
  {
    id: "2", name: "Mandate Registration Id", selector: (row) => row.mandateRegistrationId, sortable: true,
    width: "160px",
  },
  { id: "3", name: "Client Code", selector: (row) => row.clientCode },
  { id: "4", name: "Client Registration Id", selector: (row) => row.clientRegistrationId },
  { id: "5", name: "Consumer Reference Number", selector: (row) => row.consumerReferenceNumber },
  {
    id: "6", name: "Mandate Purpose", selector: (row) => row.mandatePurpose, sortable: true,
    width: "180px",
  },
  {
    id: "7", name: "Payer Utility Code", selector: (row) => row.payerUtilitityCode, sortable: true,
    width: "180px",
  },
  { id: "8", name: "Payer Name", selector: (row) => row.payerName },
  {
    id: "9", name: "Mandate End Date", selector: (row) => row.mandateEndDate ? row.mandateEndDate : "NA", sortable: true,
    width: "160px",
  },
  { id: "10", name: "Mandate Max Amount", selector: (row) => row.mandateMaxAmount },
  {
    id: "11", name: "Mandate Registration Time", selector: (row) => row.mandateRegTime, sortable: true,
    width: "160px",
  },
  { id: "12", name: "Mandate Type", selector: (row) => row.mandateType },
  {
    id: "13", name: "Merchant Id", selector: (row) => row.merchantId, sortable: true,
    width: "170px",
  },
  {
    id: "14", name: "Mandate Start Date", selector: (row) => row.mandateStartDate, sortable: true,
    width: "170px",
  },
  // { id: "15", name: "Message Id",selector:(row)=>row.messageId },
  // { id: "16", name: "Mandate Collect Amount",selector:(row)=>row.mandateCollectAmount },
  // { id: "17", name: "Pan No",selector:(row)=>row.panNo },
  // { id: "18", name: "Mandate Category",selector:(row)=>row.mandateCategoryCode },
  // { id: "19", name: "Payment Bank Code",selector:(row)=>row.npciPaymentBankCode },
  // { id: "20", name: "Payer Account Number Code",selector:(row)=>row.payerAccountNumber },
  // { id: "21", name: "Payer Account Type",selector:(row)=>row.payerAccountType },
  // { id: "22", name: "Payer Bank",selector:(row)=>row.payerBank},
  // { id: "23", name: "Payer Email",selector:(row)=>row.payerEmail },
  // { id: "24", name: "Payer Mobile",selector:(row)=>row.payerMobile},
  // { id: "25", name: "Telephone Number",selector:(row)=>row.telePhone },
  // { id: "26", name: "Payer IFSC",selector:(row)=>row.payerBankIfscCode},
  // { id: "27", name: "Authentication Mode",selector:(row)=>row.authenticationMode },
  // { id: "28", name: "Frequency",selector:(row)=>row.frequency},
  // { id: "29", name: "Request Type",selector:(row)=>row.requestType },
  // { id: "30", name: "Scheme Reference No.",selector:(row)=>row.schemeReferenceNumber },
  // { id: "31", name: "Sponsor Bank",selector:(row)=>row.sponserBank },
  // { id: "32", name: "Registration Status",selector:(row)=>row.regestrationStatus },
  // { id: "33", name: "Total Amount",selector:(row)=>row.totalAmount },
  // { id: "34", name: "UMRN Number",selector:(row)=>row.umrnNumber },
  // { id: "35", name: "Untill Cancelled",selector:(row)=>row.untilCancelled },
  // { id: "36", name: "Mandate Creation Date",selector:(row)=>row.mandateCreditTime },
  // { id: "37", name: "Mandate Update On",selector:(row)=>row.mandateupdatedon },
  // { id: "38", name: "Mandate Update By",selector:(row)=>row.mandateupdatedby },
  // { id: "39", name: "Regestration Error Code",selector:(row)=>row.regestrationErrorCode},
  // { id: "40", name: "Regestration Error Desc",selector:(row)=>row.regestrationErrorDesc },
  // { id: "41", name: "Regestration Npci Ref Id",selector:(row)=>row.regestrationNpciRefId },
  // { id: "42", name: "Accept Details Cre_Dt_Tm",selector:(row)=>row.accptDetails_CreDtTm },
  // { id: "43", name: "Bank Name",selector:(row)=>row.bankName },
  // { id: "44", name: "Mandate Category",selector:(row)=>row.mandatecategory },
  // { id: "45", name: "Mandate Physical Path",selector:(row)=>row.mandatPhysicalPath },
  // { id: "46", name: "isphymndtupdate",selector:(row)=>row.isphymndtupdate },
  // { id: "47", name: "isphymndtupdatedon",selector:(row)=>row.isphymndtupdatedon },
  // { id: "48", name: "isphymndtupdatedby",selector:(row)=>row.isphymndtupdatedby },
  // { id: "49", name: "isphymndtapprove",selector:(row)=>row.isphymndtapprove },
  // { id: "50", name: "isphymndtapproveon",selector:(row)=>row.isphymndtapproveon },
  // { id: "51", name: "isphymndtapproveby",selector:(row)=>row.isphymndtapproveby},
  // { id: "52", name: "userType",selector:(row)=>row.userType },
  // { id: "53", name: "mandateImage",selector:(row)=>row.mandateImage },
  // { id: "54", name: "EMI Amount",selector:(row)=>row.emiamount },
  // { id: "55", name: "mandateCancelled",selector:(row)=>row.mandateCancelled },
  // { id: "56", name: "reqInitPty",selector:(row)=>row.reqInitPty },
  // { id: "57", name: "accptd",selector:(row)=>row.accptd },
  // { id: "58", name: "reasonCode",selector:(row)=>row.reasonCode },
  // { id: "59", name: "reasonDesc",selector:(row)=>row.reasonDesc },
  // { id: "60", name: "rejectBy",selector:(row)=>row.rejectBy },
  // { id: "61", name: "accptRefNo",selector:(row)=>row.accptRefNo },
  // { id: "62", name: "tableData",selector:(row)=>row.tableData },
];
// Debit Reports
// export const DebitReportData = [
//   { id: "1", name: "S.No" },
//   { id: "2", name: "Transaction ID" },
//   { id: "3", name: "UMRN Number" },
//   { id: "4", name: "Payment Status" },
//   { id: "5", name: "Reason" },
//   { id: "6", name: "Settelment Amount" },
//   { id: "7", name: "Settlement Status" },
//   { id: "8", name: "Merchant Name" },
//   { id: "9", name: "Bank Message" },
//   { id: "10", name: "Bank Reference Number" },
//   { id: "11", name: "Batch Reference Number" },
//   { id: "12", name: "Transaction Initialization Date" },
//   { id: "13", name: "Transaction Complete Date" },
//   { id: "14", name: "Next Due Date" },
//   { id: "15", name: "Statue Reason Code" },
//   { id: "16", name: "Division Code" },
//   { id: "17", name: "Customer Reference Number" },
//   { id: "18", name: "Remarks" },
//   { id: "19", name: "Remarks 1" },
//   { id: "20", name: "Remarks 2" },
//   { id: "21", name: "Remarks 3" },
//   { id: "22", name: "Remarks 4" },
//   { id: "23", name: "Remarks 5" },
//   { id: "24", name: "Customer Transaction Reference Number" },
//   { id: "25", name: "Bank Id" },
//   { id: "26", name: "Bank ResponseCode" },
//   { id: "27", name: "Bank Name" },
//   { id: "28", name: "issettled" },
//   { id: "29", name: "issettledsponcer" },
//   { id: "30", name: "pAmount" },
//   { id: "31", name: "settlementamountsponcer" },
//   { id: "32", name: "settlementbankref" },
//   { id: "33", name: "settlementbankrefsponcer" },
//   { id: "34", name: "settlementby" },
//   { id: "35", name: "settlementbysponcer" },
//   { id: "36", name: "settlementdate" },
//   { id: "37", name: "settlementdatesponcer" },
//   { id: "38", name: "settlementremarks" },
//   { id: "39", name: "settlementremarkssponcer" },
//   { id: "40", name: "settlementstatussponcer" },
//   { id: "41", name: "settlementutr" },
//   { id: "42", name: "settlementutrsponcer" },
//   { id: "43", name: "transactionAmount" },
// ];
export const DebitReportData = [
  { id: "1", name: "S.No", selector: (row) => row.id },
  { id: "2", name: "Transaction ID", selector: (row) => row.transactionId },
  { id: "3", name: "UMRN Number", selector: (row) => row.UMRNNumber },
  { id: "4", name: "Payment Status", selector: (row) => row.paymentStatus },
  { id: "5", name: "Reason", selector: (row) => row.reason },
  { id: "6", name: "Settelment Amount", selector: (row) => row.settelmentAmount },
  { id: "7", name: "Settlement Status", selector: (row) => row.settlementStatus },
  // { id: "8", name: "Merchant Name", selector: (row) => row.merchantName },
  // { id: "9", name: "Bank Message", selector: (row) => row.bankMessage },
  // { id: "10", name: "Bank Reference Number", selector: (row) => row.bankReferenceNumber },
  // { id: "11", name: "Batch Reference Number", selector: (row) => row.batchReferenceNumber },
  // { id: "12", name: "Transaction Initialization Date", selector: (row) => row.transactionInitializationDate },
  // { id: "13", name: "Transaction Complete Date", selector: (row) => row.transactionCompleteDate },
  // { id: "14", name: "Next Due Date", selector: (row) => row.nextDueDate },
  // { id: "15", name: "Statue Reason Code", selector: (row) => row.statueReasonCode },
  // { id: "16", name: "Division Code", selector: (row) => row.divisionCode },
  // { id: "17", name: "Customer Reference Number", selector: (row) => row.customerReferenceNumber },
  // { id: "18", name: "Remarks", selector: (row) => row.remarks },
  // { id: "19", name: "Remarks 1", selector: (row) => row.remarks1 },
  // { id: "20", name: "Remarks 2", selector: (row) => row.remarks2 },
  // { id: "21", name: "Remarks 3", selector: (row) => row.remarks3 },
  // { id: "22", name: "Remarks 4", selector: (row) => row.remarks4 },
  // { id: "23", name: "Remarks 5", selector: (row) => row.remarks5 },
  // { id: "24", name: "Customer Transaction Reference Number", selector: (row) => row.customerTransactionReferenceNumber },
  // { id: "25", name: "Bank Id", selector: (row) => row.bankId },
  // { id: "26", name: "Bank ResponseCode", selector: (row) => row.bankResponseCode },
  // { id: "27", name: "Bank Name", selector: (row) => row.bankName },
  // { id: "28", name: "issettled", selector: (row) => row.issettled },
  // { id: "29", name: "issettledsponcer", selector: (row) => row.issettledsponcer },
  // { id: "30", name: "pAmount", selector: (row) => row.pAmount },
  // { id: "31", name: "settlementamountsponcer", selector: (row) => row.settlementamountsponcer },
  // { id: "32", name: "settlementbankref", selector: (row) => row.settlementbankref },
  // { id: "33", name: "settlementbankrefsponcer", selector: (row) => row.settlementbankrefsponcer },
  // { id: "34", name: "settlementby", selector: (row) => row.settlementby },
  // { id: "35", name: "settlementbysponcer", selector: (row) => row.settlementbysponcer },
  // { id: "36", name: "settlementdate", selector: (row) => row.settlementdate },
  // { id: "37", name: "settlementdatesponcer", selector: (row) => row.settlementdatesponcer },
  // { id: "38", name: "settlementremarks", selector: (row) => row.settlementremarks },
  // { id: "39", name: "settlementremarkssponcer", selector: (row) => row.settlementremarkssponcer },
  // { id: "40", name: "settlementstatussponcer", selector: (row) => row.settlementstatussponcer },
  // { id: "41", name: "settlementutr", selector: (row) => row.settlementutr },
  // { id: "42", name: "settlementutrsponcer", selector: (row) => row.settlementutrsponcer },
  // { id: "43", name: "transactionAmount", selector: (row) => row.transactionAmount },
];



// subscript wallet row column

export const subscriptionWalletTableCol = [
  { id: "1", name: "S. no.", cell: (row) => <div className="removeWhiteSpace">{row?.sno}</div> },
  { id: "1", name: "Subscription Id", cell: (row) => <div className="removeWhiteSpace">{row?.clientSubscribedPlanDetailsId}</div> },
  { id: "2", name: "Application name", cell: (row) => <div className="removeWhiteSpace">{row?.applicationName}</div> },
  { id: "3", name: "Plan name", cell: (row) => <div className="removeWhiteSpace">{row?.planName}</div> },
  { id: "4", name: "Subscription status", cell: (row) => <div className="removeWhiteSpace">{row?.subscription_status}</div> },
  { id: "4", name: "Mandate status", cell: (row) => <div className="removeWhiteSpace">{row?.mandateStatus}</div> },
  { id: "4", name: "Purchase amount", cell: (row) => <div className="removeWhiteSpace">{row?.purchaseAmount}</div> }
]
