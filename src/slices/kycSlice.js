import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL, { AUTH_TOKEN } from "../config";
import axios from "axios";
import { axiosInstanceAuth } from "../utilities/axiosInstance";

const initialState = {
  documentByloginId: {
    documentId: "",
    name: "",
    filePath: "",
    isApproved: false,
    approvedDate: null,
    approvedBy: null,
    isLatest: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    status: "",
    comment: null,
    merchant: "",
    type: "",
  },
  DataUpdateResponse: {
    status: "",
    message: "",
  },
  allTabValidate:{
    merchantContactInfo : {
      submitStatus: {
       status:"",
       message:""
      },
      aadhaar: {
        isValidate: false,
        response:{
          "name": "",
          valid: false,
          message: "",
          status: false
            
        }
      }
    }
  },
  
  kycApproved: {
    count: null,
    next: null,
    previous: null,
    results: null,
  },
  kycUserList: {
    merchantId: "",
    name: "",
    emailId: "",
    isEmailVerified: 0,
    isContactNumberVerified: 0,
    contactNumber: "",
    contactDesignation: "",
    aadharNumber: null,
    panCard: "",
    accountNumber: "",
    bankName: "",
    accountHolderName: "",
    ifscCode: "",
    companyName: "",
    companyLogoPath: "",
    companyImagePath: "",
    companyDescription: "",
    companyType: null,
    companyWebsite: "",
    clientName: "",
    clientCode: "",
    successUrl: "",
    failureUrl: "",
    loginMasterId: "",
    created_date: "",
    modifiedDate: "",
    modified_by: "",
    status: "",
    reason: null,
    businessType: "",
    yourRole: null,
    nameOnPanCard: "",
    registeredBusinessAdress: "",
    stateId: "",
    pinCode: "",
    registerdWithGST: null,
    gstNumber: "",
    monthlyRevenue: null,
    partnerBankId: "",
    mouAgreement: "",
    constitutionOfMerchant: null,
    addressProof: null,
    entityProof: null,
    utilityBill: null,
    panProof: null,
    kycOneProof: null,
    kycTwoProof: null,
    kycThreeProof: null,
    kycFourProof: null,
    kycFiveProof: null,
    bankLetter: null,
    onBoardFrom: "",
    requestId: "",
    clientType: "",
    parentClientId: "",
    businessCategory: "",
    businessModel: "",
    billingLabel: "",
    erpCheck: null,
    platformId: "",
    collectionTypeId: "",
    collectionFrequencyId: "",
    expectedTransactions: "",
    formBuild: "",
    ticketSize: "",
    signatoryPAN: "",
    cityId: "",
    operationalAddress: "",
    merchant_account_details: "",
  },
  KycDocUpload: {
    documentId: "",
    name: "",
    filePath: "",
    isApproved: false,
    approvedDate: null,
    approvedBy: null,
    isLatest: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    status: "",
    comment: null,
    merchant: "",
    type: "",
  },
  kycVerificationForAllTabs: {
    approved_date: null,
    is_approved: false,
    is_verified: false,
    general_info_status: "",
    merchant_info_status: "",
    business_info_status: "",
    settlement_info_status: "",
    general_info_verified_date: null,
    merchant_info_verified_date: null,
    business_info_verified_date: null,
    settlement_info_verified_date: null,
    status: "",
    login_id: "",
    approved_by: null,
    general_info_verified_by: null,
    merchant_info_verified_by: null,
    business_info_verified_by: null,
    settlement_info_verified_by: null,
  },
  businessType: [],
  busiCategory: [],
  platformType: [],
  collectionFrequency: [],
  collectionType: [],
  saveBusinessInfo: [],
  businessOverviewState: [],
  saveMerchantInfo: [],
  documentsUpload: [],
  merchantInfo: [],
  kycBankNames: [],
  saveMerchantBankDetais: [],
  kycForPending: [],
  kycForVerified: [],
  kycForApproved: [],
  kycForCompleted: [],
  UploadLoginId: [],
  enableKycTab: false,
  kycModalClose: true,

  OtpResponse: { status: "", verification_token: "" },
  OtpVerificationResponseForPhone: {
    status: false,
    message: "",
  },

  OtpVerificationResponseForEmail: {
    status: false,
    message: "",
  },
};

//--------------For Saving the Merchant Data Successfully (Contact Info) ---------------------
export const updateContactInfo = createAsyncThunk(
  "UpdateContactInfo/updateContactInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .put(`${API_URL.Save_General_Info}`, requestParam, {
        headers: {
          // Authorization: ""
        },
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

// KYC OTP function

//--------------For Sending the Contact Otp ---------------------
export const otpForContactInfo = createAsyncThunk(
  "OtpForContact/otpContactInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(
        `${API_URL.Send_OTP}`,
        requestParam,

        {
          headers: {
            // Authorization: ""
          },
        }
      )
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

//---------VERIFICATION OTP For Phone ------------------------
export const otpVerificationForContactForPhone = createAsyncThunk(
  "OtpVerificationForContactForPhone/otpVerificationForContactForPhone",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceAuth
      .post(`${API_URL.Verify_OTP}`, requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log("res",response);
    return response.data;
  }
);

//---------VERIFICATION OTP For Email------------------------
export const otpVerificationForContactForEmail = createAsyncThunk(
  "OtpVerificationForContactForEmail/otpVerificationForContactForEmail",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceAuth
      .post(`${API_URL.Verify_OTP}`, requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log("res",response);
    return response.data;
  }
);

// END kyc otp function

//--------------Kyc BusinessType get api (BusinessOverview Tab)---------------------
export const businessType = createAsyncThunk(
  "kyc/businessType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Business_type}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);
///////////////////////// For business category api
export const busiCategory = createAsyncThunk(
  "kyc/busiCategory",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Business_Category}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);
////////////////////////////////////////////////// For platform
export const platformType = createAsyncThunk(
  "kyc/platformType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Platform_type}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

/////////////////////////////////////////////// For collection frequency
export const collectionFrequency = createAsyncThunk(
  "kyc/platformType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Collection_frequency}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

////////////////////////////////////////////////Get all collection type
export const collectionType = createAsyncThunk(
  "kyc/collectionType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Get_ALL_Collection_Type}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//////////////////////////////////////////////////// Put api for save business info
export const saveBusinessInfo = createAsyncThunk(
  "kyc/collectionType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .put(`${API_URL.save_Business_Info}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

/////////////////////////////// Get APi for BusinessDetails Tab(For state)
export const businessOverviewState = createAsyncThunk(
  "kyc/businessOverviewState",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Business_overview_state_}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

///////////////////////////////////// Put APi for SAVE_MERCHANT_INFO (BusinessDetails Tab)

export const saveMerchantInfo = createAsyncThunk(
  "kyc/collectionType",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.SAVE_MERCHANT_INFO}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
/////////////////////////////// Get api for Documents Uploads Tab

export const documentsUpload = createAsyncThunk(
  "kyc/documentsUpload",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.DocumentsUpload}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

////////////////////////////////// .Upload_Merchant_document//////////

export const merchantInfo = createAsyncThunk(
  "kyc/merchantInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth({
      method: "post",
      url:
        requestParam.docType === "1"
          ? API_URL.UPLOAD_MERCHANT_AADHAAR
          : API_URL.Upload_Merchant_document,
      data: requestParam.bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    }).catch((error) => {
      return error.response;
    });

    // const response = await axios
    //   .post(`${API_URL.Upload_Merchant_document}`, requestParam, {
    //     headers: headers
    //   })
    //   .catch((error) => {
    //     return error.response;
    //   });

    return response.data;
  }
);

///////////////FOR KYC USER LIST (THATS COMING STRAIGHT FROM THIS API)/////////////////////)

export const kycUserList = createAsyncThunk(
  "kyc/kycUserList",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.Kyc_User_List}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

//------------------------------------------------------------------------------------------

//--------------------For KYC DOCUMENT UPLOAD DATA STRAIGHT FROM THIS API -------------------

export const kycDocumentUploadList = createAsyncThunk(
  "kyc/kycDocumentUploadList",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.Kyc_Doc_List}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//----------------------------------------------------------------------------

//--------------------For KYC Verification For All Tabs -----------------------

export const kycVerificationForTabs = createAsyncThunk(
  "kyc/kycVerificationForTabs",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.Kyc_Verification_For_All_Tabs}/${requestParam?.login_id}`)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//--------------------------------------------------------------------------------

//--------------KYC BANK NAMES --------------------- //
export const kycBankNames = createAsyncThunk(
  "kyc/kycBankNames",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.GET_ALL_BANK_NAMES}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

//--------------------------------------------------------------

//----For Saving Merchant Bank Details-----------------//
export const saveMerchantBankDetais = createAsyncThunk(
  "kyc/saveMerchantBankDetais",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .put(
        `${API_URL.Save_Settlement_Info}`,
        requestParam,

        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);
/////////////////////////////////KYC APPROVED API

export const kycForPending = createAsyncThunk(
  "kyc/kycForPending",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const response = await axiosInstanceAuth
      .get(
        `${API_URL.KYC_FOR_PENDING}&page=${requestParam}&page_size=${requestParam1}`,
        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

//////////////////////////////////////////////////
export const kycForVerified = createAsyncThunk(
  "kyc/kycForVerified",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const response = await axiosInstanceAuth
      .get(
        `${API_URL.KYC_FOR_VERIFIED}&page=${requestParam}&page_size=${requestParam1}`,
        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
////////////////////////////////////////////////////
export const kycForApproved = createAsyncThunk(
  "kyc/kycForApproved",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const response = await axiosInstanceAuth
      .get(
        `${API_URL.KYC_FOR_APPROVED}&page=${requestParam}&page_size=${requestParam1}`,
        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
///////////////////////////////////////////
export const kycForCompleted = createAsyncThunk(
  "kyc/kycForCompleted",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.KYC_FOR_COMPLETED}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

/////////////////////////////////////////
export const UploadLoginId = createAsyncThunk(
  "kyc/UploadLoginId",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.DOCUMENT_BY_LOGINID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

// ================== veify kyc

export const verifyKycEachTab = createAsyncThunk(
  "kyc/verifyKycEachTab",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.VERIFY_EACH_TAB}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const verifyKycDocumentTab = createAsyncThunk(
  "kyc/verifyKycDocumentTab",
  async (requestParam) => {
    let URL_FOR_DOCUMENT_VERIFY = "";
    if (requestParam?.rejected_by) {
      URL_FOR_DOCUMENT_VERIFY = API_URL.DOCUMENT_REJECT;
    } else {
      URL_FOR_DOCUMENT_VERIFY = API_URL.DOCUMENT_VERIFY;
    }

    const response = await axiosInstanceAuth
      .put(URL_FOR_DOCUMENT_VERIFY, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const verifyComplete = createAsyncThunk(
  "kyc/verifyKycEachTab",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.VERIFY_FINAL_ALL}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
export const approveDoc = createAsyncThunk(
  "kyc/approveDoc",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .put(`${API_URL.APPROVE_DOCUMENT}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const approvekyc = createAsyncThunk(
  "kyc/approvekyc",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.APPROVE_KYC}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

//---------------- Registered Address TAP INTEGRATION --------------//

export const saveRegisteredAddress = createAsyncThunk(
  "kyc/saveRegisteredAddress",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(
        `${API_URL.Registered_Address}`,
        requestParam,

        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);
//---------------- Registered Address TAP INTEGRATION --------------//

//---------------- KYC CONSENT TAP API INTEGRATION --------------//

export const saveKycConsent = createAsyncThunk(
  "kyc/saveKycConsent",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(
        `${API_URL.Kyc_Consent}`,
        requestParam,

        {
          headers: {},
        }
      )
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);

//---------------- KYC CONSENT TAP API INTEGRATION --------------//

export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    getBusinessType: (state) => {
      state.businessType = [];
    },
    getBusinessCategory: (state) => {
      state.busiCategory = [];
    },
    loadKycUserList: (state) => {
      state.kycUserList = [];
    },
    loadKycVericationForAllTabs: (state) => {
      state.kycVerificationForAllTabs = [];
    },
    enableKycTab: (state, action) => {
      state.enableKycTab = action.payload;
    },
    kycModalToggle: (state, action) => {
      state.kycModalClose = action.payload;
    },
    isPhoneVerified: (state, action) => {
      // console.log(action);
      // console.log(state.OtpVerificationResponseForPhone.status);
      // state.transactionHistory = []
    },

  },
  extraReducers: {
    [kycUserList.pending]: (state, action) => {
      state.status = "pending";
    },
    [kycUserList.fulfilled]: (state, action) => {
      state.kycUserList = action.payload;
    },
    [kycUserList.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    ///////////////////////////////////
    [kycForApproved.pending]: (state, action) => {
      state.status = "pending";
    },
    [kycForApproved.fulfilled]: (state, action) => {
      // console.log("action-11 ====>",action.payload)
      state.kycApproved = action.payload;
    },
    [kycForApproved.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    ////////////////////////////////////////
    [UploadLoginId.pending]: (state, action) => {
      state.status = "pending";
    },
    [UploadLoginId.fulfilled]: (state, action) => {
      // console.log("action-11 ====>",action.payload)
      state.documentByloginId = action.payload;
    },
    [UploadLoginId.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    //All Kyc Tabs status stored in redux as false
    //Contact Info Post Request

    [updateContactInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [updateContactInfo.fulfilled]: (state, action) => {
      state.DataUpdateResponse = action.payload;
    },
    [updateContactInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [saveBusinessInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [saveBusinessInfo.fulfilled]: (state, action) => {
      state.BusiOverviewwStatus = action.payload;
      // console.log(action.payload, "===>");
    },
    [saveBusinessInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    [saveMerchantInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [saveMerchantInfo.fulfilled]: (state, action) => {
      state.BusiOverviewwStatus = action.payload;
      // console.log(action.payload, "===>");
    },
    [saveMerchantInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    //All Kyc Tabs status stored in redux as false

    // DOC UPLOAD KYC //
    [kycDocumentUploadList.pending]: (state, action) => {
      state.status = "pending";
    },
    [kycDocumentUploadList.fulfilled]: (state, action) => {
      state.KycDocUpload = action.payload;
    },
    [kycDocumentUploadList.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    //Kyc Verification for All Tabs
    [kycVerificationForTabs.pending]: (state, action) => {
      state.status = "pending";
    },
    [kycVerificationForTabs.fulfilled]: (state, action) => {
      state.kycVerificationForAllTabs = action.payload;
    },
    [kycVerificationForTabs.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    ////////////////////////////////////////////////////
    [otpForContactInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpForContactInfo.fulfilled]: (state, action) => {
      // console.log("action-11 ====>",action.payload)
      state.OtpResponse = action.payload;
    },
    [otpForContactInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    ////////////////////////////////////////////////////////////
    // OTP state update

    [otpVerificationForContactForPhone.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpVerificationForContactForPhone.fulfilled]: (state, action) => {
      state.OtpVerificationResponseForPhone = action.payload;

      if (action.payload?.status === true) {
        state.kycUserList.isContactNumberVerified = 1;
      }
    },
    [otpVerificationForContactForPhone.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    /////////////////////////////////////////////////////////////////

    [otpVerificationForContactForEmail.pending]: (state, action) => {
      state.status = "pending";
    },
    [otpVerificationForContactForEmail.fulfilled]: (state, action) => {
      state.OtpVerificationResponseForEmail = action.payload;
      if (action.payload?.status === true) {
        state.kycUserList.isEmailVerified = 1;
      }

      // console.log(action.payload.status,"==> Verification")
    },
    [otpVerificationForContactForEmail.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [verifyKycEachTab.fulfilled]: (state, action) => {
      state.kycVerificationForAllTabs = action.payload;
    },
  },
});

export const {
  getBusinessType,
  getBusinessCategory,
  loadKycUserList,
  loadKycVericationForAllTabs,

  isPhoneVerified,
} = kycSlice.actions;
export const kycReducer = kycSlice.reducer;
