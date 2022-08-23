import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";

const initialState = {
  kycUserList:{
    merchantId: "",
    name: "",
    emailId: "",
    isEmailVerified: false,
    isContactNumberVerified: false,
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
    businessModel:"",
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
    merchant_account_details:"",

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
    type: ""
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
    settlement_info_verified_by: null
  },
    businessType:[],
    busiCategory:[],
    platformType:[],
    collectionFrequency:[],
    collectionType:[],
    saveBusinessInfo:[],
    businessOverviewState:[],
    saveMerchantInfo:[],
    documentsUpload:[],
    merchantInfo:[],
    kycBankNames :[],
    saveMerchantBankDetais:[],
 }

//--------------Kyc BusinessType get api (BusinessOverview Tab)---------------------
 export const businessType = createAsyncThunk(
    "kyc/businessType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_type}`,
        {
          headers: {
            
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );
  ///////////////////////// For business category api
  export const busiCategory= createAsyncThunk(
    "kyc/busiCategory",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_Category}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );
  ////////////////////////////////////////////////// For platform
  export const platformType= createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Platform_type}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );

  /////////////////////////////////////////////// For collection frequency
  export const collectionFrequency= createAsyncThunk(
    "kyc/platformType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Collection_frequency}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
      // console.log(response)
      return response.data;
    }
  );

////////////////////////////////////////////////Get all collection type
export const collectionType= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL. Get_ALL_Collection_Type}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );
  //////////////////////////////////////////////////// Put api for save business info
  export const saveBusinessInfo= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.put(
        `${API_URL.save_Business_Info}`,
        requestParam
     
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  /////////////////////////////// Get APi for BusinessDetails Tab(For state)
  export const businessOverviewState= createAsyncThunk(
    "kyc/businessOverviewState",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Business_overview_state_}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  ///////////////////////////////////// Put APi for SAVE_MERCHANT_INFO (BusinessDetails Tab)

  export const saveMerchantInfo= createAsyncThunk(
    "kyc/collectionType",
    async (requestParam) => {
      const response = await axios.post(
        `${API_URL.SAVE_MERCHANT_INFO}`,
        requestParam
     
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );
/////////////////////////////// Get api for Documents Uploads Tab

export const documentsUpload= createAsyncThunk(
    "kyc/documentsUpload",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.DocumentsUpload}`,
        {
          headers: {
           
          }
        }
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  ////////////////////////////////// .Upload_Merchant_document//////////

  export const merchantInfo= createAsyncThunk(
    "kyc/merchantInfo",
    async (requestParam) => {
      const response = await axios.post(
        `${API_URL.Upload_Merchant_document}`,
        requestParam
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );

  ///////////////FOR KYC USER LIST (THATS COMING STRAIGHT FROM THIS API)/////////////////////)


  export const kycUserList= createAsyncThunk(
    "kyc/kycUserList",
    async (requestParam) => {
      const response = await axios.post(
        `${API_URL.Kyc_User_List}`,
        requestParam
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );


  //------------------------------------------------------------------------------------------

  //--------------------For KYC DOCUMENT UPLOAD DATA STRAIGHT FROM THIS API -------------------

  export const kycDocumentUploadList= createAsyncThunk(
    "kyc/kycDocumentUploadList",
    async (requestParam) => {
      const response = await axios.post(
        `${API_URL.Kyc_Doc_List}`,
        requestParam,
      )
      .catch((error) => {
        return error.response;
      });
     
      return response.data;
    }
  );
  //----------------------------------------------------------------------------


   //--------------------For KYC Verification For All Tabs -----------------------

   export const kycVerificationForTabs= createAsyncThunk(
    "kyc/kycVerificationForTabs",
    async (requestParam) => {
      const response = await axios.get(
        `${API_URL.Kyc_Verification_For_All_Tabs}`, 
      )
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
    const response = await axios.get(
      `${API_URL.GET_ALL_BANK_NAMES}`,
      {
        headers: {
          
        }
      }
    )
    .catch((error) => {
      return error.response;
    });
    // console.log(response)
    return response.data;
  }
);


//--------------------------------------------------------------


//----For Saving Merchant Bank Details-----------------// 
export const saveMerchantBankDetais= createAsyncThunk(
  "kyc/saveMerchantBankDetais",
  async (requestParam) => {
    const response = await axios.put(
      `${API_URL.Save_Settlement_Info}`,
      requestParam,

      {
        headers: {
         
        }
      }
    )
    .catch((error) => {
      return error.response;
    });
    // console.log(response)
    return response.data;
  }
);

 export const kycSlice = createSlice({
    name: 'kyc',
    initialState,
    reducers:{
      getBusinessType : (state)=>{
        state.businessType= []
      },
      getBusinessCategory : (state)=>{
        state.busiCategory = []
      },
      loadKycUserList : (state)=>{
        state.kycUserList=[]
      },
      loadKycVericationForAllTabs : (state)=>{
        state.kycVerificationForAllTabs=[]
      },

      
    },
    extraReducers:{
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

    }
})


export const {getBusinessType,getBusinessCategory,loadKycUserList,loadKycVericationForAllTabs} = kycSlice.actions
export const kycReducer = kycSlice.reducer