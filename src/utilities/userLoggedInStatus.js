export function userLoggedInStatus() {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const localUserStatus = user && user.loginId !== null ? true : false;
        return localUserStatus;
    
}
