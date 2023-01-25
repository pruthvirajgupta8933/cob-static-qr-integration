export function userLoggedInStatus() {
        const user = JSON.parse(localStorage.getItem("user"));
        const localUserStatus = user && user.loginId !== null ? true : false;
        return localUserStatus;
    
}
