import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import menulistService from "../../services/cob-dashboard/menulist.service";
import { setMessage } from "../message";

// Mock menu data for fallback
const mockMenuData = [
  {
    app_name: "Reports",
    app_code: "REPORTS",
    is_active: true,
    submenu: [
      {
        id: 1,
        submenu_name: "Transaction Summary",
        url: "transaction-summery",
        sub_menu_icon: "fa fa-bar-chart",
        is_active: true
      },
      {
        id: 2,
        submenu_name: "Transaction Enquiry",
        url: "transaction-enquiry",
        sub_menu_icon: "fa fa-search",
        is_active: true
      },
      {
        id: 3,
        submenu_name: "Transaction History",
        url: "transaction-history",
        sub_menu_icon: "fa fa-history",
        is_active: true
      },
      {
        id: 4,
        submenu_name: "Settlement Report",
        url: "settlement-report",
        sub_menu_icon: "fa fa-file-text",
        is_active: true
      }
    ]
  },
  {
    app_name: "Products",
    app_code: "PRODUCTS",
    is_active: true,
    submenu: [
      {
        id: 5,
        submenu_name: "Product Catalogue",
        url: "product-catalogue",
        sub_menu_icon: "fa fa-shopping-cart",
        is_active: true
      },
      {
        id: 6,
        submenu_name: "Payment Links",
        url: "paylinks",
        sub_menu_icon: "fa fa-link",
        is_active: true
      }
    ]
  },
  {
    app_name: "Settings",
    app_code: "SETTINGS",
    is_active: true,
    submenu: [
      {
        id: 7,
        submenu_name: "Profile",
        url: "profile",
        sub_menu_icon: "fa fa-user",
        is_active: true
      },
      {
        id: 8,
        submenu_name: "Change Password",
        url: "change-password",
        sub_menu_icon: "fa fa-key",
        is_active: true
      }
    ]
  }
];

const listOfMenus = {
  enableMenu: mockMenuData, // Initialize with mock data
  isLoading: false
}


export const fetchMenuList = createAsyncThunk(
  "menulist/fetchMenuList",
  async (dataObj, thunkAPI) => {
    try {
      const response = await menulistService.menulist(dataObj);
      thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      thunkAPI.dispatch(setMessage(message));
      
      // Return mock data if API fails
      console.log('Menu API failed, using mock data');
      return mockMenuData;
    }
  }
);


const menulistSlice = createSlice({
  name: "menulist",
  initialState: listOfMenus,
  extraReducers: {
    [fetchMenuList.pending]: (state, action) => {
      state.isLoading = true
      state.enableMenu = [];
    },
    [fetchMenuList.fulfilled]: (state, action) => {
      state.isLoading = false
      state.enableMenu = action.payload;
    },
    [fetchMenuList.rejected]: (state, action) => {
      state.isLoading = false
      state.enableMenu = [];
    },
  }

});

const { reducer } = menulistSlice;
export default reducer;