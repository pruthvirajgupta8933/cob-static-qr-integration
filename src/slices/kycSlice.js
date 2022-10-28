import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL, { AUTH_TOKEN } from "../config";
import axios from "axios";
import { axiosInstanceAuth, kycValidatorAuth } from "../utilities/axiosInstance";
import { ContactlessOutlined } from "@mui/icons-material";

const initialState = {
  documentByloginId: {},
  kycApproved: {
    count: null,
    next: null,
    previous: null,
    results: null,
  },
  kycUserList: {

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

  KycTabStatusStore: {},

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
  // UploadLoginId: [],
  enableKycTab: false,
  kycModalClose: true,

  allTabsValidate: {
    merchantContactInfo: {
      submitStatus: {
        status: false,
      },
      aadhaar: {
        status: false,
        valid: false
      },
    },
    BusiOverviewwStatus: {
      submitStatus: {
        status: false,
      
      },
    },
    BusinessDetailsStatus: {
      AuthPanValidation: {
        first_name:"",
        last_name:"",
        valid: false,
        status: false
      },
      PanValidation: {
        first_name:"",
        last_name:"",
        valid: false,
        status: false
      },
      GSTINValidation: {
        status: false,
        valid: false,
      },
      submitStatus: {
        status: false,
        message: "",
      },
    },
    BankDetails: {
      IfscValidation: {
        valid: false,
        status: false
      },
      accountValidation: {
        first_name:"",
        last_name:"",
        valid: false,
        status: false
      },

      submitStatus: {
        status: false,
        message: "",
      },
    },
    UploadDoc: {
      submitStatus: {
        status: false,
        message: "",
      },
    },
  },

  GetBankid: [],

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



const validatorUrl = "https://stage-kycvalidator.sabpaisa.in/validator"

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
  "kyc/saveBusinessInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .put(`${API_URL.save_Business_Info}`, requestParam, {
        headers: {
          // Authorization: ""
        },
      })

      .catch((error) => {
        return error.response;
      });
    // console.log(response,"==========RESPONSE ============>")
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
  "kyc/saveMerchantInfo",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .post(`${API_URL.SAVE_MERCHANT_INFO}`, requestParam, {
        headers: {
          // Authorization: ""
        },
      })
      .catch((error) => {
        return error.response;
      });
    // console.log(response,"==========RESPONSE ============>")
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
          : API_URL.upload_Single_Doc,
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
      .post(`${API_URL.DOCUMENT_BY_LOGINID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//----------------------------------------------------------------------------

//--------------------For KYC Verification For All Tabs -----------------------

export const GetKycTabsStatus = createAsyncThunk(
  "kyc/GetKycTabsStatus",
  async (requestParam) => {
    const response = await axiosInstanceAuth
      .get(`${API_URL.KYC_TAB_STATUS_URL}/${requestParam?.login_id}`)
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
// export const UploadLoginId = createAsyncThunk(
//   "kyc/UploadLoginId",
//   async (requestParam) => {
//     const response = await axiosInstanceAuth
//       .post(`${API_URL.DOCUMENT_BY_LOGINID}`, requestParam)
//       .catch((error) => {
//         return error.response;
//       });

//     return response.data;
//   }
// );

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
//----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//
export const panValidation = createAsyncThunk(
  "kyc/panValidation", async (requestParam) => {
    const response = await kycValidatorAuth.post(`${validatorUrl}` + '/validate-pan/', requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)

export const authPanValidation = createAsyncThunk(
  "kyc/authPanValidation", async (requestParam) => {
    const response = await kycValidatorAuth.post(`${validatorUrl}` + '/validate-pan/', requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)

export const gstValidation = createAsyncThunk(
  "kyc/gstValidation", async (requestParam) => {
    const response = await kycValidatorAuth.post(`${validatorUrl}` + '/validate-gst/', requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)

export const ifscValidation = createAsyncThunk(
  "kyc/ifscValidation", async (requestParam) => {
    const response = await kycValidatorAuth.post(`${validatorUrl}/validate-ifsc/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)

export const bankAccountVerification = createAsyncThunk(
  "kyc/bankAccountVerification", async (requestParam) => {
    const response = await kycValidatorAuth.post(`${validatorUrl}` + '/validate-account/', requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)

//----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//


//--Get Bank Id ------------//
export const getBankId = createAsyncThunk(
  "kyc/getBankId", async (requestParam) => {
    console.log(requestParam)
    const response = await axiosInstanceAuth.post(`${API_URL.GET_BANK_ID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
)
//--Get Bank Id ------------//




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
      state.KycTabStatusStore = [];
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
    // [UploadLoginId.pending]: (state, action) => {
    //   state.status = "pending";
    // },
    // [UploadLoginId.fulfilled]: (state, action) => {
    //   // console.log("action-11 ====>",action.payload)
    //   state.documentByloginId = action.payload;
    // },
    // [UploadLoginId.rejected]: (state, action) => {
    //   state.status = "failed";
    //   state.error = action.error.message;
    // },

    //All Kyc Tabs status stored in redux as false
    //Contact Info Post Request

    [updateContactInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [updateContactInfo.fulfilled]: (state, action) => {
      state.allTabsValidate.merchantContactInfo.submitStatus = action.payload;
      // console.log(
      //   action.payload,
      //   "=============================================================>"
      // );
    },
    [updateContactInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [saveBusinessInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [saveBusinessInfo.fulfilled]: (state, action) => {
      state.allTabsValidate.BusiOverviewwStatus.submitStatus = action.payload;
    },
    [saveBusinessInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    [saveMerchantInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [saveMerchantInfo.fulfilled]: (state, action) => {
      state.allTabsValidate.BusinessDetailsStatus.submitStatus = action.payload;
    },
    [saveMerchantInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },

    [saveMerchantBankDetais.pending]: (state, action) => {
      state.status = "pending";
    },
    [saveMerchantBankDetais.fulfilled]: (state, action) => {
      state.allTabsValidate.BankDetails.submitStatus = action.payload;
    },
    [saveMerchantBankDetais.rejected]: (state, action) => {
      state.status = "failed";
    },

    [merchantInfo.pending]: (state, action) => {
      state.status = "pending";
    },
    [merchantInfo.fulfilled]: (state, action) => {
      state.allTabsValidate.UploadDoc.submitStatus = action.payload;
      // console.log(action.payload,"Action ===> 12")
    },
    [merchantInfo.rejected]: (state, action) => {
      state.status = "failed";
    },


    //----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//

    [panValidation.pending]: (state, action) => {
      state.status = "pending";
    },
    [panValidation.fulfilled]: (state, action) => {

      state.allTabsValidate.BusinessDetailsStatus.PanValidation = action.payload;
      if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.kycUserList.panCard = action?.meta?.arg?.pan_number
      }
    },
    [panValidation.rejected]: (state, action) => {
      state.status = "failed";
    },

    [authPanValidation.pending]: (state, action) => {
      state.status = "pending";
    },
    [authPanValidation.fulfilled]: (state, action) => {
      // if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.allTabsValidate.BusinessDetailsStatus.AuthPanValidation = action.payload;
        //  if(action?.payload?.status === true && action?.payload?.valid === false) {
        //   return  state.allTabsValidate.BusinessDetailsStatus.AuthPanValidation = action.payload
        // }
      // }
      state.allTabsValidate.BusinessDetailsStatus.AuthPanValidation = action.payload;
      if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.kycUserList.signatoryPAN = action?.meta?.arg?.pan_number
      }
      // console.log(action.payload,"Action ===> 12")
    },
    [authPanValidation.rejected]: (state, action) => {
      state.status = "failed";
    },

    [gstValidation.pending]: (state, action) => {
      state.status = "pending";
    },
    [gstValidation.fulfilled]: (state, action) => {
      state.allTabsValidate.BusinessDetailsStatus.GSTINValidation = action.payload;
      //  console.log(action.payload)
      if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.kycUserList.gstNumber = action?.meta?.arg?.gst_number
      }

      // console.log(action.payload,"Action ===> 12")
    },
    [gstValidation.rejected]: (state, action) => {
      state.status = "failed";
    },

    [ifscValidation.pending]: (state, action) => {
      state.status = "pending";
    },
    [ifscValidation.fulfilled]: (state, action) => {
      state.allTabsValidate.BankDetails.IfscValidation = action.payload;

      if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.kycUserList.ifscCode = action?.meta?.arg?.ifsc_number
      }
    },
    [ifscValidation.rejected]: (state, action) => {
      state.status = "failed";
    },

    [bankAccountVerification.pending]: (state, action) => {
      state.status = "pending";
    },
    [bankAccountVerification.fulfilled]: (state, action) => {
      state.allTabsValidate.BankDetails.accountValidation = action.payload;
      if (action?.payload?.status === true && action?.payload?.valid === true) {
        state.kycUserList.accountNumber = action?.meta?.arg?.account_number
      }
      console.log(action.payload,"Action Account Number ===> 1222222222")
    },
    [bankAccountVerification.rejected]: (state, action) => {
      state.status = "failed";
    },


    //----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//

    //-----------------Saving Bank Details by sending bank id -----------------//
    
    [getBankId.fulfilled]: (state, action) => {

      state.GetBankid = action.payload;
      //  console.log("Action Bank id ===>122",action.payload)

    },
        //-----------------Saving Bank Details by sending bank id -----------------//


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
    [GetKycTabsStatus.pending]: (state, action) => {
      state.status = "pending";
    },
    [GetKycTabsStatus.fulfilled]: (state, action) => {
      state.KycTabStatusStore = action.payload;
    },
    [GetKycTabsStatus.rejected]: (state, action) => {
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
      state.KycTabStatusStore = action.payload;
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
