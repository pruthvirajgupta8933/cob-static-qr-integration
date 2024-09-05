import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API_URL, { APP_ENV } from "../config";
import { axiosInstanceJWT, kycValidatorAuth } from "../utilities/axiosInstance";

// import { APP_ENV } from "../config";
import { KYC_STATUS_APPROVED, KYC_STATUS_VERIFIED } from "../utilities/enums";
import approverDashboardService from "../services/approver-dashboard/approverDashboard.service";
import { merchantKycService } from "../services/kyc/merchant-kyc";
import { setMessage } from "./message";

const initialState = {
  isLoadingForpanDetails: false,
  isLoading: false,
  isLoadingForPending: false,
  isLoadingForPendingVerification: false,
  isLoadingForPendingApproval: false,
  isLoadingForApproved: false,
  isLoadingForRejected: false,

  kycUserList: {},
  notFilledUserList: {
    count: 0,
  },
  pendingVerificationKycList: {
    results: [],
    count: 0,
  },

  myMerchnatUserList: {
    results: [],
    count: 0,
  },

  panDetailsData: {
    loading: false,
    results: [],
    count: 0,
  },
  kycApprovedList: {
    results: [],
    count: 0,
  },
  pendingKycuserList: {
    results: [],
    count: 0,
  },
  rejectedKycList: {
    results: [],
    count: 0,
  },
  kycVerifiedList: {
    results: [],
    count: 0,
  },
  KycDocUpload: [],
  compareDocListArray: {
    finalArray: [],
    dropDownDocList: [],
    isRequireDataUploaded: false,
  },

  allKycData: {
    result: [],
    loading: false,
    error: false,
    message: "",
  },

  KycTabStatusStore: {},

  businessType: [],
  busiCategory: [],
  platformType: [],
  collectionFrequency: [],
  saveBusinessInfo: [],
  businessOverviewState: [],
  saveMerchantInfo: [],
  documentsUpload: [],
  merchantInfo: [],
  kycBankNames: [],
  saveMerchantBankDetais: [],
  kycForPendingMerchants: [],
  kycForPending: [],
  kycForRejectedMerchants: {
    count: 0,
  },
  kycForVerified: {
    count: 0,
  },
  kycForApproved: {
    count: 0,
  },

  kycModalClose: true,

  allTabsValidate: {
    merchantContactInfo: {
      submitStatus: {
        status: false,
      },
      aadhaar: {
        status: false,
        valid: false,
      },
    },
    BusiOverviewwStatus: {
      submitStatus: {
        status: false,
      },
    },
    BusinessDetailsStatus: {
      AuthPanValidation: {
        first_name: "",
        last_name: "",
        valid: false,
        status: false,
      },
      PanValidation: {
        first_name: "",
        last_name: "",
        valid: false,
        status: false,
      },
      submitStatus: {
        status: false,
        message: "",
      },
    },
    BankDetails: {
      IfscValidation: {
        valid: false,
        status: false,
      },
      accountValidation: {
        first_name: "",
        last_name: "",
        valid: false,
        status: false,
      },
    },
    UploadDoc: {
      submitStatus: {
        status: false,
        message: "",
      },
    },
  },

  OtpResponse: {
    status: "",
    verification_token: "",
    tempEmail: "",
    tempPhone: "",
  },

  OpenModalForKycSubmit: {
    isOpen: false,
  },
  approveKyc: {
    isApproved: false,
    isError: false,
    logs: {},
  },
  merchantKycData: {},
};

export const updateContactInfo = createAsyncThunk(
  "kyc/updateContactInfo",
  async (requestParam, thunkAPI) => {
    try {
      const response = await merchantKycService.updateContactInfo(requestParam);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// KYC OTP function

//--------------For Sending the Contact Otp ---------------------
export const otpForContactInfo = createAsyncThunk(
  "OtpForContact/otpContactInfo",
  async (requestParam) => {
    const response = await merchantKycService
      .otpForContactInfo(requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);

//---------VERIFICATION OTP For Phone ------------------------
export const otpVerificationForContactForPhone = createAsyncThunk(
  "OtpVerificationForContactForPhone/otpVerificationForContactForPhone",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceJWT
      .post(`${API_URL.Verify_OTP}`, requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);

//---------VERIFICATION OTP For Email------------------------
export const otpVerificationForContactForEmail = createAsyncThunk(
  "OtpVerificationForContactForEmail/otpVerificationForContactForEmail",
  async (requestParam) => {
    // console.log("requestParam",requestParam)
    const response = await axiosInstanceJWT
      .post(`${API_URL.Verify_OTP}`, requestParam)
      .catch((error) => {
        return error.response;
      });
    return response.data;
  }
);

// END kyc otp function

//--------------Kyc BusinessType get api (BusinessOverview Tab)---------------------
export const businessType = createAsyncThunk(
  "kyc/businessType",
  async (requestParam) => {
    const response = await merchantKycService
      .businessType(requestParam)
      .catch((error) => {
        return error.response;
      });

    // hide other type
    return response.data?.filter((item) => item.businessTypeId !== 11);
    // return response.data;
  }
);
///////////////////////// For business category api
export const busiCategory = createAsyncThunk(
  "kyc/busiCategory",
  async (requestParam) => {
    const response = await merchantKycService
      .busiCategory(requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log(response.data)
    // hide orther category
    // category_id
    return response.data?.filter((item) => item.category_id !== 38);
  }
);

////////////////////////////////////////////////// For platform
export const platformType = createAsyncThunk(
  "kyc/platformType",
  async (requestParam) => {
    const response = await merchantKycService
      .platformType(requestParam)
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
    const response = await axiosInstanceJWT
      .get(`${API_URL.Collection_frequency}`, {
        headers: {},
      })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

////////////////////////////////////////////////Get all collection type
export const collectionType = createAsyncThunk(
  "kyc/collectionType",
  async (requestParam) => {
    const response = await axiosInstanceJWT
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
    const response = await merchantKycService
      .saveBusinessInfo(requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log(response,"==========RESPONSE ============>")
    return response.data;
  }
);

export const businessOverviewState = createAsyncThunk(
  "kyc/businessOverviewState",
  async () => {
    let response = {};
    try {
      response = await merchantKycService?.fetchBusinessOverviewState();
    } catch (error) {
      response = error.response;
    }
    return response?.data;
  }
);

///////////////////////////////////// Put APi for SAVE_MERCHANT_INFO (BusinessDetails Tab)

export const saveMerchantInfo = createAsyncThunk(
  "kyc/saveMerchantInfo",
  async (requestParam) => {
    const response = await merchantKycService
      .saveMerchantInfo(requestParam)

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
  async (data) => {
    const response = await merchantKycService
      .documentsUpload(data)
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
    const response = await merchantKycService
      .merchantInfo(requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

///////////////FOR KYC USER LIST (THATS COMING STRAIGHT FROM THIS API)/////////////////////)

export const kycUserList = createAsyncThunk(
  "kyc/kycUserList",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(`${API_URL.Kyc_User_List}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const kycDetailsByMerchantLoginId = createAsyncThunk(
  "kyc/kycDetailsByMerchantLoginId",
  async (requestParam) => {
    const response = await axiosInstanceJWT
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
    const response = await merchantKycService.kycDocumentUploadList(
      requestParam
    );
    return response.data;
  }
);
//----------------------------------------------------------------------------

//--------------------For KYC Verification For All Tabs -----------------------

export const GetKycTabsStatus = createAsyncThunk(
  "kyc/GetKycTabsStatus",
  async (requestParam) => {
    // console.log("alert", "check 1")
    const response = await merchantKycService
      .GetKycTabsStatus(requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log("alert ", response.data)
    return response.data;
  }
);
//--------------------------------------------------------------------------------

//--------------KYC BANK NAMES --------------------- //
export const kycBankNames = createAsyncThunk(
  "kyc/kycBankNames",
  async (requestParam) => {
    const response = await merchantKycService.kycBankNames().catch((error) => {
      return error.response;
    });
    // console.log(response)
    return response.data;
  }
);
/////////////////////////////////////// Payment Mode
export const kycpaymentModeType = createAsyncThunk(
  "kyc/kycpaymentModeType",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .get(`${API_URL.GET_PAYMENT_MODE}`, {
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
    const response = await merchantKycService
      .saveMerchantBankDetais(requestParam)
      .catch((error) => {
        return error.response;
      });
    // console.log(response)
    return response.data;
  }
);
/////////////////////////////////KYC APPROVED API
export const kycForNotFilled = createAsyncThunk(
  "kyc/kycForNotFilled",
  async (data) => {
    const requestParam = data?.page;
    const requestParam1 = data?.page_size;
    const isDirect = data?.isDirect;
    const searchQuery = data?.searchquery;
    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_NOT_FILLED}&search=${
          data.merchantStatus
        }&search_query=${searchQuery}&page=${
          searchQuery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const MyMerchantListData = createAsyncThunk(
  "kyc/MyMerchantListData",
  async (data) => {
    const requestParam = data?.page;
    const requestParam1 = data?.page_size;
    const searchQuery = data?.searchquery;
    let apiUrl = `${API_URL.MY_MERCHANT_LIST}?page=${
      searchQuery ? 1 : requestParam
    }&page_size=${requestParam1}&order_by=-login_id`;
    // Check if kyc_status is present and not equal to 'ALL'
    if (data?.kyc_status && data.kyc_status !== "All") {
      apiUrl += `&kyc_status=${data.kyc_status}`;
    }
    // Add the search_query parameter
    apiUrl += `&search_query=${searchQuery}`;
    const response = await axiosInstanceJWT
      .post(apiUrl, { created_by: data.created_by })
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const kycForPendingMerchants = createAsyncThunk(
  "kyc/kycForPendingMerchants",
  async (data) => {
    const requestParam = data?.page;
    const requestParam1 = data?.page_size;
    const isDirect = data?.isDirect;
    const searchQuery = data?.searchquery;

    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_PENDING_MERCHANTS}&search=${
          data.merchantStatus
        }&search_query=${searchQuery}&page=${
          searchQuery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const kycForRejectedMerchants = createAsyncThunk(
  "kyc/kycForRejectedMerchants",
  async (data) => {
    const requestParam = data?.page;
    const requestParam1 = data?.page_size;
    const isDirect = data?.isDirect;
    const searchQuery = data?.searchquery;
    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_REJECTED_MERCHANTS}&search=${
          data.merchantStatus
        }&search_query=${searchQuery}&page=${
          searchQuery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`,
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

export const kycForPending = createAsyncThunk(
  "kyc/kycForPending",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const isDirect = data?.isDirect;
    const searchQuery = data?.searchquery;

    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_PROCESSING}&search=${
          data.merchantStatus
        }&search_query=${searchQuery}&page=${
          searchQuery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const FetchAllByKycStatus = createAsyncThunk(
  "kyc/FetchAllByKycStatus",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const isDirect = data?.isDirect;
    const kycStatus = data?.kycStatus;
    // const order_by =
    const response = await axiosInstanceJWT
      .get(
        `${API_URL.GET_MERCHANT_DATA}?search=${kycStatus}&search_query=${data.searchquery}&page=${requestParam}&page_size=${requestParam1}&isDirect=${isDirect}&order_by=-id`
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
    const isDirect = data?.isDirect;
    const searchQuery = data?.searchquery;

    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_VERIFIED}&search=${
          data.merchantStatus
        }&search_query=${searchQuery}&page=${
          searchQuery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`
      )
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const onboardedReport = createAsyncThunk(
  "kyc/onboardedReport",
  async (data) => {
    const requestParam = data.page;
    const requestParam1 = data.page_size;
    const kyc_status = data?.kyc_status;

    let order_by = kyc_status.toLowerCase() + "_date";
    if (
      !kyc_status === KYC_STATUS_APPROVED ||
      !kyc_status === KYC_STATUS_VERIFIED
    ) {
      order_by = "id";
    }

    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_ONBOARDED}?search=${kyc_status}&order_by=-${order_by}&search_map=${order_by}&page=${requestParam}&page_size=${requestParam1}`
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

    const isDirect = data?.isDirect === undefined ? "" : data?.isDirect;
    const searchquery =
      data?.searchquery === undefined ? "" : data?.searchquery;

    // console.log("isDirect",isDirect)
    const response = await axiosInstanceJWT
      .get(
        `${API_URL.KYC_FOR_APPROVED}&search=${
          data.merchantStatus
        }&search_query=${searchquery}&page=${
          searchquery ? 1 : requestParam
        }&page_size=${requestParam1}&isDirect=${isDirect}`
      )
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
    const response = await axiosInstanceJWT
      .post(`${API_URL.VERIFY_EACH_TAB}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const getMerchantpanData = createAsyncThunk(
  "kyc/getMerchantpanData",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(`${API_URL.GET_MERCHANT_PAN}`, requestParam)
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

    const response = await axiosInstanceJWT
      .put(URL_FOR_DOCUMENT_VERIFY, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const checkedDocumentReject = createAsyncThunk(
  "kyc/checkedDocumentReject",
  async (requestParam) => {
    let URL_FOR_DOCUMENT_VERIFY = "";
    if (requestParam?.rejected_by) {
      URL_FOR_DOCUMENT_VERIFY = API_URL.CHECKED_DOCUMENT_REJECT;
    } else {
      URL_FOR_DOCUMENT_VERIFY = API_URL.CHECKED_DOCUMENT_REJECT;
    }

    const response = await axiosInstanceJWT
      .put(URL_FOR_DOCUMENT_VERIFY, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const removeDocument = createAsyncThunk(
  "kyc/removeDocument",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .put(API_URL.DOCUMENT_REMOVE, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const verifyComplete = createAsyncThunk(
  "kyc/verifyKycEachTab",
  async (requestParam) => {
    const response = await axiosInstanceJWT
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
    const response = await axiosInstanceJWT
      .put(`${API_URL.APPROVE_DOCUMENT}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

//----- GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//
export const panValidation = createAsyncThunk(
  "kyc/panValidation",
  async (requestParam) => {
    // console.log("check 1",requestParam)
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    // console.log("check 3")
    return response.data;
  }
);

export const authPanValidationrr = createAsyncThunk(
  "kyc/authPanValidationrr",
  async (requestParam) => {
    // console.log("check 4")
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const authPanValidation = createAsyncThunk(
  "kyc/authPanValidation",
  async (requestParam) => {
    // console.log("check 5")
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-pan/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const gstValidation = createAsyncThunk(
  "kyc/gstValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-gst/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const udyamRegistration = createAsyncThunk(
  "kyc/gstValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.UDYAM_REGISTRATION}/validate-udyam/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const ifscValidation = createAsyncThunk(
  "kyc/ifscValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-ifsc/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const bankAccountVerification = createAsyncThunk(
  "kyc/bankAccountVerification",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-account/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

export const credReportValidation = createAsyncThunk(
  "kyc/credReportValidation",
  async (requestParam) => {
    const response = await kycValidatorAuth
      .post(`${API_URL.VALIDATE_KYC}/validate-cred-report/`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);

//----- KYC ALL NUMBERS(GST,PAN,ACCOUNT NO, AADHAAR,IFSC) KYC VALIDATTE ------//

//--Get Bank Id ------------//
export const getBankId = createAsyncThunk(
  "kyc/getBankId",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(`${API_URL.GET_BANK_ID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//--Get Bank Id ------------//

//--get-business-type-by-id ------------//
export const businessTypeById = createAsyncThunk(
  "kyc/getBusinessTypeById",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(`${API_URL.GET_BUSINESS_TYPE_ID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//-- get-business-type-by-id  ------------//

//-- get-business-category-by-id ------------//
export const businessCategoryById = createAsyncThunk(
  "kyc/businessCategoryById",
  async (requestParam) => {
    const response = await axiosInstanceJWT
      .post(`${API_URL.GET_BUSINESS_CATEGORY_ID}`, requestParam)
      .catch((error) => {
        return error.response;
      });

    return response.data;
  }
);
//---- get-business-category-by-id ------------//

export const approvekyc = createAsyncThunk(
  "kyc/approvekyc",
  async (requestParam, thunkAPI) => {
    try {
      const response = await await approverDashboardService.approveKyc(
        requestParam
      );

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString() ||
        error.request.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//---------------- Registered Address TAP INTEGRATION --------------//

export const saveRegisteredAddress = createAsyncThunk(
  "kyc/saveRegisteredAddress",
  async (requestParam) => {
    const response = await axiosInstanceJWT
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
    const response = await axiosInstanceJWT
      .post(`${API_URL.Kyc_Consent}`, requestParam)
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
      state.kycUserList = {};
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
    clearKycState: (state) => {
      state.kycUserList = {};
    },
    clearKycDetailsByMerchantLoginId: (state) => {
      state.merchantKycData = {};
    },

        saveDropDownAndFinalArray: (state, action) => {

            // state.compareDocListArray.dropDownDocList = action?.payload?.dropDownDocList;
            // state.compareDocListArray.finalArray = action?.payload?.finalArray;
            state.compareDocListArray.isRequireDataUploaded = action?.payload;
        },
        UpdateModalStatus: (state, action) => {
            state.OpenModalForKycSubmit.isOpen = action?.payload
        },
        clearFetchAllByKycStatus: (state) => {
            state.allKycData.error = false
            state.allKycData.loading = false
            state.allKycData.result = []
            state.allKycData.message = ""
        },
        clearApproveKyc: (state) => {
            state.approveKyc.isApproved = false
            state.approveKyc.isError = false
            state.approveKyc.logs = {}
        }
    },
    extraReducers: (builder) => {
        
        builder
            .addCase(kycForNotFilled.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
                state.notFilledUserList.count = 0;
            })
            .addCase(kycForNotFilled.fulfilled, (state, action) => {
                state.notFilledUserList = action.payload;
                state.isLoading = false;
            })
            .addCase(kycForNotFilled.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoading = false;
            })
            .addCase(MyMerchantListData.pending, (state) => {
                state.status = "pending";
                state.isLoading = true;
            })
            .addCase(MyMerchantListData.fulfilled, (state, action) => {
                state.myMerchnatUserList = action.payload;
                state.isLoading = false;
            })
            .addCase(MyMerchantListData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoading = false;
            })
            .addCase(getMerchantpanData.pending, (state) => {
                state.isLoadingForpanDetails = true;
            })
            .addCase(getMerchantpanData.fulfilled, (state, action) => {
                state.panDetailsData = action.payload;
                state.isLoadingForpanDetails = false;
            })
            .addCase(getMerchantpanData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForpanDetails = false;
            })
            .addCase(kycForPendingMerchants.pending, (state) => {
                state.pendingKycuserList.count = 0;
                state.status = "pending";
                state.isLoadingForPending = true;
            })
            .addCase(kycForPendingMerchants.fulfilled, (state, action) => {
                state.pendingKycuserList = action.payload;
                state.isLoadingForPending = false;
            })
            .addCase(kycForPendingMerchants.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForPending = false;
                state.pendingKycuserList = 0;
            })
            .addCase(kycForPending.pending, (state) => {
                state.status = "pending";
                state.isLoadingForPendingVerification = true;
                state.pendingVerificationKycList.count = 0;
            })
            .addCase(kycForPending.fulfilled, (state, action) => {
                state.pendingVerificationKycList = action.payload;
                state.isLoadingForPendingVerification = false;
            })
            .addCase(kycForPending.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForPendingVerification = false;
                state.pendingVerificationKycList.count = 0;
            })
            .addCase(kycForVerified.pending, (state) => {
                state.status = "pending";
                state.isLoadingForPendingApproval = true;
                state.kycVerifiedList.count = 0;
            })
            .addCase(kycForVerified.fulfilled, (state, action) => {
                state.kycVerifiedList = action.payload;
                state.isLoadingForPendingApproval = false;
            })
            .addCase(kycForVerified.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForPendingApproval = false;
            })
            .addCase(onboardedReport.pending, (state) => {
                state.allKycData.loading = true;
                state.allKycData.error = false;
                state.allKycData.result = {};
            })
            .addCase(onboardedReport.fulfilled, (state, action) => {
                state.allKycData.loading = false;
                state.allKycData.result = action.payload.results;
                state.allKycData.count = action.payload.count;
                state.allKycData.next = action.payload.next;
                state.allKycData.previous = action.payload.previous;
            })
            .addCase(onboardedReport.rejected, (state, action) => {
                state.allKycData.loading = false;
                state.allKycData.error = true;
                state.allKycData.result = [];
                state.allKycData.message = action.error.message;
            })
            .addCase(FetchAllByKycStatus.pending, (state) => {
                state.allKycData.loading = true;
                state.allKycData.error = false;
                state.allKycData.result = {};
            })
            .addCase(FetchAllByKycStatus.fulfilled, (state, action) => {
                state.allKycData.loading = false;
                state.allKycData.result = action.payload.results;
                state.allKycData.count = action.payload.count;
                state.allKycData.next = action.payload.next;
                state.allKycData.previous = action.payload.previous;
            })
            .addCase(FetchAllByKycStatus.rejected, (state, action) => {
                state.allKycData.loading = false;
                state.allKycData.error = true;
                state.allKycData.result = [];
                state.allKycData.message = action.error.message;
            })
            .addCase(kycForRejectedMerchants.pending, (state) => {
                state.status = "pending";
                state.isLoadingForRejected = true;
                state.rejectedKycList.count = 0;
            })
            .addCase(kycForRejectedMerchants.fulfilled, (state, action) => {
                state.rejectedKycList = action.payload;
                state.isLoadingForRejected = false;
            })
            .addCase(kycForRejectedMerchants.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForRejected = false;
            })
            .addCase(kycUserList.pending, (state) => {
                state.status = "pending";
            })
            .addCase(kycUserList.fulfilled, (state, action) => {
                state.kycUserList = action.payload;
            })
            .addCase(kycUserList.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(kycForApproved.pending, (state) => {
                state.status = "pending";
                state.isLoadingForApproved = true;
                state.kycApprovedList.count = 0;
            })
            .addCase(kycForApproved.fulfilled, (state, action) => {
                state.kycApprovedList = action.payload;
                state.isLoadingForApproved = false;
            })
            .addCase(kycForApproved.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
                state.isLoadingForApproved = false;
            })
            .addCase(updateContactInfo.pending, (state) => {
                state.status = "pending";
            })
            .addCase(updateContactInfo.fulfilled, (state, action) => {
                state.allTabsValidate.merchantContactInfo.submitStatus = action.payload;
            })
            .addCase(updateContactInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(saveBusinessInfo.pending, (state) => {
                state.status = "pending";
            })
            .addCase(saveBusinessInfo.fulfilled, (state, action) => {
                state.allTabsValidate.BusiOverviewwStatus.submitStatus = action.payload;
            })
            .addCase(saveBusinessInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(saveMerchantInfo.pending, (state) => {
                state.status = "pending";
            })
            .addCase(saveMerchantInfo.fulfilled, (state, action) => {
                state.allTabsValidate.BusinessDetailsStatus.submitStatus = action.payload;
            })
            .addCase(saveMerchantInfo.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(saveMerchantBankDetais.pending, (state) => {
                state.status = "pending";
            })
            .addCase(saveMerchantBankDetais.fulfilled, (state, action) => {
                state.allTabsValidate.BankDetails.submitStatus = action.payload;
            })
            .addCase(saveMerchantBankDetais.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(merchantInfo.pending, (state) => {
                state.status = "pending";
            })
            .addCase(merchantInfo.fulfilled, (state, action) => {
                state.allTabsValidate.UploadDoc.submitStatus = action.payload;
            })
            .addCase(merchantInfo.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(kycDocumentUploadList.pending, (state) => {
                state.status = "pending";
            })
            .addCase(kycDocumentUploadList.fulfilled, (state, action) => {
                state.allTabsValidate.UploadDoc.submitStatus = action.payload;
            })
            .addCase(kycDocumentUploadList.rejected, (state) => {
                state.status = "failed";
            })

            .addCase(GetKycTabsStatus.pending, (state) => {
                state.status = "pending";
            })
            .addCase(GetKycTabsStatus.fulfilled, (state, action) => {
                state.KycTabStatusStore = action.payload;
            })
            .addCase(GetKycTabsStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    
            // saveKycConsent
            .addCase(saveKycConsent.pending, (state) => {
                state.status = "pending";
            })
            .addCase(saveKycConsent.fulfilled, (state, action) => {
                state.consentKyc = action.payload;
            })
            .addCase(saveKycConsent.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
    
            // otpForContactInfo
            .addCase(otpForContactInfo.fulfilled, (state, action) => {
                if (action?.payload?.status) {
                    state.OtpResponse = action.payload;
    
                    // Uncomment the following if you need to store temp email or phone
                    // if (action?.meta?.arg?.email) {
                    //     state.OtpResponse.tempEmail = action?.meta?.arg?.email;
                    // }
                    // if (action?.meta?.arg?.mobile_number) {
                    //     state.OtpResponse.tempPhone = action?.meta?.arg?.mobile_number;
                    // }
                }
            })
    
            // otpVerificationForContactForPhone
            .addCase(otpVerificationForContactForPhone.fulfilled, (state, action) => {
                if (action.payload?.status === true) {
                    // Uncomment the following if you need to update contact number verification
                    // state.kycUserList.isContactNumberVerified = 1;
                    // state.kycUserList.contactNumber = state.OtpResponse.tempPhone;
                    // state.OtpResponse.tempPhone = "";
                }
            })
    
            // otpVerificationForContactForEmail
            .addCase(otpVerificationForContactForEmail.fulfilled, (state, action) => {
                if (action.payload?.status === true) {
                    state.kycUserList.isEmailVerified = 1;
                    state.kycUserList.emailId = state.OtpResponse.tempEmail;
                    state.OtpResponse.tempEmail = "";
                }
            })
    
            // verifyKycEachTab
            .addCase(verifyKycEachTab.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyKycEachTab.fulfilled, (state, action) => {
                state.KycTabStatusStore = action.payload;
                state.isLoading = false;
            })
            .addCase(verifyKycEachTab.rejected, (state) => {
                state.isLoading = false;
            })
    
            // approvekyc
            .addCase(approvekyc.pending, (state) => {
                state.approveKyc.isApproved = false;
                state.approveKyc.isError = false;
                state.approveKyc.logs = {};
            })
            .addCase(approvekyc.fulfilled, (state, action) => {
                state.approveKyc.isApproved = true;
                state.approveKyc.logs = action.payload;
            })
            .addCase(approvekyc.rejected, (state, action) => {
                state.approveKyc.isApproved = false;
                state.approveKyc.isError = true;
                state.approveKyc.logs = action.payload;
            })
    
            // kycDetailsByMerchantLoginId
            .addCase(kycDetailsByMerchantLoginId.pending, (state) => {
                state.merchantKycData = {};
            })
            .addCase(kycDetailsByMerchantLoginId.fulfilled, (state, action) => {
                state.merchantKycData = action.payload;
            })
            .addCase(kycDetailsByMerchantLoginId.rejected, (state) => {
                state.merchantKycData = {};
            });
    }
    
});

export const {
  getBusinessType,
  getBusinessCategory,
  loadKycUserList,
  loadKycVericationForAllTabs,
  isPhoneVerified,
  clearKycState,
  UpdateModalStatus,
  saveDropDownAndFinalArray,
  clearFetchAllByKycStatus,
  clearApproveKyc,
  clearKycDetailsByMerchantLoginId,
} = kycSlice.actions;
export const kycReducer = kycSlice.reducer;
