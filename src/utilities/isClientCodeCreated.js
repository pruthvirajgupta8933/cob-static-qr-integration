
const client_code = null;
export const isClientCodeCreated = () =>{
    let flag = false;
    if(client_code!==null){
        flag = true;
    }
    return flag;
}