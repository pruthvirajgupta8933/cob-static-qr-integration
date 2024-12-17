import { APP_ENV } from "./config";
//prod || stage
const keyConfig = {
    LOGIN_AUTH_KEY: APP_ENV ? 'TqFzP4hdyNN1Vhhq' : 'wreH3dEDVHzyplBe',
    LOGIN_AUTH_IV: APP_ENV ? 'NmgWasKxEChLR9Fo' : 'JFlEcCGe98VQ4gMC',
}

export default keyConfig