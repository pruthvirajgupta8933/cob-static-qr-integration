import { APP_ENV } from "./config";
//prod || stage
const keyConfig = {
    LOGIN_AUTH_KEY: APP_ENV ? process.env.REACT_APP_PROD_LOGIN_AUTH_KEY : process.env.REACT_APP_STAGE_LOGIN_AUTH_KEY,
    LOGIN_AUTH_IV: APP_ENV ? process.env.REACT_APP_PROD_LOGIN_AUTH_IV : process.env.REACT_APP_STAGE_LOGIN_AUTH_IV,
}

export default keyConfig