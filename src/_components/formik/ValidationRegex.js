
export const Regex = {
    acceptAlphabet : /^[aA-zZ\s]+$/ ,
    acceptNumber : /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    acceptAlphaNumeric : /^[a-zA-Z0-9\s]+$/, 
    alphaBetwithhyphon:/[a-zA-Z._^%$#!~@,-]+/,
    digit : /^[0-9]+$/, 
    address: /^[a-zA-Z0-9\s,.'-]{3,}$/,
    addressForSpecific: /^[#.0-9a-zA-Z\s,-/]+$/,
    phoneNumber : /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    password:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    ifscRegex : /^[A-Z]{4}0[A-Z0-9]{6}$/,
    accountNoRgex : /^[a-zA-Z0-9]{2,25}$/,
    multipleSpace:/^\S+(\s{1}\S+)*$/,
    urlFormate:  /^(https:\/\/(?!www)[^\s/$.?#].[^\s]*\.(com|in)(\/[^\s]*)?)|(https:\/\/www\.[^\s/$.?#].[^\s]*\.(com|in)(\/[^\s]*)?)$/,

}

export const RegexMsg = {
    acceptAlphabet : "Only alphabets are allowed for this field ",
    acceptNumber : "Only Numbers are allowed for this field " ,
    acceptAlphaNumeric : "Only alphanumeric are allowed for this field",
    digit : "Only Digit are allowed for this field",
    alphaBetwithhyphon:"Only alphabets and '-' are allowed for this field",
    addressForSpecific:"Address is not in valid format, Only '-', '/' , '.' special chracters are allowed",
    address : "Address is not in valid format, Special Characters are not allowed (#,$,@ etc)",
    phoneNumber : "Phone number is not valid",
    password: "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special Character",
    ifscRegex:"Your IFSC code is Invalid and must be in capital letters",
    accountNoRgex:"Account Number format is invalid",
    multipleSpace:"Invalid input",
    urlFormate:"Please enter a valid HTTPS URL"
}



// if word length more then 20 char. then throw error
export const wordValidation = function(str, validCharLength=20) {
    if(str?.length>0){
    const wordArr = str.split(" ")
    let notValidWord = []
    notValidWord =  wordArr.filter((word)=>{
      return word.length>20
    })    
    return notValidWord.length >= 1 ? false : true
  }
  
  };


// validation warning
// "Only alphabets are allowed for this field "
// "Only Numbers are allowed for this field " 
// "Only alphanumeric are allowed for this field"

