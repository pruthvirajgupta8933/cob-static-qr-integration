import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL from "../config";
import axios from "axios";

const initialState = {

  documentByloginId:{
       documentId:"",
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


  kycApproved:{
    count: null, 
    next: null, 
    previous: null,
     results:null
  },
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
    operationalAddress: ""

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
    kycForPending:[],
    kycForVerified:[],
    kycForApproved:[],
    kycForCompleted:[],
    UploadLoginId:[]
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
      const response = await axios.post(
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
        `${API_URL.Business_overview_state}`,
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
/////////////////////////////////KYC APPROVED API

export const kycForPending= createAsyncThunk(
  "kyc/kycForPending",
  async (data) => {
    const requestParam =data.page
    const requestParam1 = data.page_size
    const response = await axios.get(
      `${API_URL.KYC_FOR_PENDING}&page=${requestParam}&page_size=${requestParam1}`,
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

//////////////////////////////////////////////////
export const kycForVerified= createAsyncThunk(
  "kyc/kycForVerified",
  async (data) => {
    const requestParam =data.page
    const requestParam1 = data.page_size
    const response = await axios.get(
      `${API_URL.KYC_FOR_VERIFIED}&page=${requestParam}&page_size=${requestParam1}`,
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
////////////////////////////////////////////////////
export const kycForApproved= createAsyncThunk(
  "kyc/kycForApproved",
  async (requestParam) => {
    const response = await axios.get(
      `${API_URL.KYC_FOR_APPROVED}`,
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
///////////////////////////////////////////
export const kycForCompleted= createAsyncThunk(
  "kyc/kycForCompleted",
  async (requestParam) => {
    const response = await axios.get(
      `${API_URL.KYC_FOR_COMPLETED}`,
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

/////////////////////////////////////////
export const UploadLoginId= createAsyncThunk(
  "kyc/UploadLoginId",
  async (requestParam) => {
    const response = await axios.post(
      `${API_URL.DOCUMENT_BY_LOGINID}`,
      requestParam
    )
    .catch((error) => {
      return error.response;
    });
   
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
      }
      
    },
    extraReducers:{
      [kycUserList.pending]: (state, action) => {
        state.status = "pending";
      },
      [kycUserList.fulfilled]: (state, action) => {
        // console.log("action-11 ====>",action.payload)
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



    }
})


export const {getBusinessType,getBusinessCategory,loadKycUserList} = kycSlice.actions
export const kycReducer = kycSlice.reducer