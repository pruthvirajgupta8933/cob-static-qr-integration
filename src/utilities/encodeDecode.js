export const  stringEnc = (string)=>{
    return window.btoa( string ); 
}


export const stringDec = (encString)=>{
    return window.atob( encString ); 
}

