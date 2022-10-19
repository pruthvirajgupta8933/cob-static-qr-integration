export const roleBasedAccess = (pageNo) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const roleId = user?.roleId;
    // console.log(user);

    const roleBasedTab = {
        approver: false,
        verifier: false,
        bank: false,
        merchant: false,
    };

    let roleAccessObj = roleBasedTab;

    console.log('role base tab is ', roleAccessObj)
    if (roleId === 14 ) {
        roleAccessObj = { ...roleAccessObj, verifier: true };
    } else if (roleId === 15){
        roleAccessObj = { ...roleAccessObj, approver: true };
    }else if (roleId === 3 || roleId === 13) {
        roleAccessObj = { ...roleAccessObj, bank: true };
    } else if (roleId !== 3 || roleId !== 13) {
        roleAccessObj = { ...roleAccessObj, merchant: true };
    } else {
        console.log("Permission not match with these roles");
    }
    console.log(roleAccessObj,'asdfghjkl', roleId)

    return roleAccessObj;
};
