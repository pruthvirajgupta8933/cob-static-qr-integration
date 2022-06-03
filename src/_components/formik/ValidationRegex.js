
const Regex = {
    acceptAlphabet : /^[aA-zZ\s]+$/ ,
    acceptNumber : /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    acceptAlphaNumeric : /^[a-zA-Z0-9\s]+$/, 
}

export const RegexMsg = {
    acceptAlphabet : "Only alphabets are allowed for this field ",
    acceptNumber : "Only Numbers are allowed for this field " ,
    acceptAlphaNumeric : "Only alphanumeric are allowed for this field"
}

// validation warning
// "Only alphabets are allowed for this field "
// "Only Numbers are allowed for this field " 
// "Only alphanumeric are allowed for this field"

export default Regex;