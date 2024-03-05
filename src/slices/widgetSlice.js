import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import widgetService from "../services/widget.service";
import { WIDGET_URL } from "../config";
import axios from "axios"
import { axiosInstance, axiosInstanceAuth } from "../utilities/axiosInstance";
import { setMessage } from "./message";

const initialState = { 
  postdata: {
    message: '', 
    data: {
        client_key: sessionStorage.getItem('client_key') || ''
    }
},

    widgetDetail:{
      data:{
        client_name: "",
        client_code: "",
        client_type: "",
        client_url: "",
        return_url:"",
        image_URL: "",
        position: "",
        company_name: ""

      }
    }
   
};


// export const widgetClientKeys = createAsyncThunk(
//   "widget/widgetClientKey",
//   async (requestParams) => {
//     try {
//       const response = await widgetService.widgetKeyurl(requestParams);
//       return response.data;
//     } catch (error) {
//       return error;
//     }
//   }
// );

export const widgetClientKeys = createAsyncThunk(
  "widget/widgetClientKeys",
  async ( requestParam,thunkAPI) => {
    
    try {
      const response = await widgetService.createClientkey(requestParam);
      // thunkAPI.dispatch(setMessage(response.data.message));
      return response.data;
    } catch (error) {
      const message =
      ( error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString() || error.request.toString();
      thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message); 
      
      
    }
  }
);

// export const widgetClientKeys = createAsyncThunk(
//     "widget/widgetClientKey",
//     async (requestParam) => {
//       const response = await axiosInstance.post(`${WIDGET_URL.WIDGET_CLIENT_KEY}`, requestParam)
//         .catch((error) => {
//           console.log("hhh",error.response)
//           return error.response;
//         });
//         console.log("ddfd",response)
//       return response.data;

//     }
//   );

  export const widgetDetails = createAsyncThunk(
    "widget/widgetDetails",
    async (requestParam) => {
      const response = await axios.get(
        `${WIDGET_URL.WIDGET_DETAILS}?client_code=${requestParam}`,
        requestParam,
        {
          headers: {
           
          },
        })
        .catch((error) => {
          return error.response;
        });
      // console.log(response)
      return response.data;

    }
  );

export const widgetSlice = createSlice({
    name: "widget",
    initialState,
    reducers: {},
     
    extraReducers: {
      [widgetClientKeys.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [widgetClientKeys.fulfilled]: (state, action) => {
        state.postdata.data.client_key = action.payload.data.client_key
       
       

      },
      [widgetClientKeys.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      //////////////////////////////////////////

      [ widgetDetails.pending]: (state, action) => {
        state.status = "pending";
        
      },
      [ widgetDetails.fulfilled]: (state, action) => {
        state.widgetDetail=action?.payload
       

      },
      [ widgetDetails.rejected]: (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      },
      
    }
  });
  export const {} = widgetSlice.actions;
  export const widgetReducer = widgetSlice.reducer;
  