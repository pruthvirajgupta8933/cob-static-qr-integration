
export const Regex = {
    acceptAlphabet : /^[aA-zZ\s]+$/ ,
    acceptNumber : /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    acceptAlphaNumeric : /^[a-zA-Z0-9\s]+$/, 
    alphaBetwithhyphon:/[a-zA-Z._^%$#!~@,-]+/,
    digit : /^[0-9]+$/, 
    address: /^[a-zA-Z0-9\s,.'-]{3,}$/,
    addressForSpecific: /^[#.0-9a-zA-Z\s,-/]+$/
}

export const RegexMsg = {
    acceptAlphabet : "Only alphabets are allowed for this field ",
    acceptNumber : "Only Numbers are allowed for this field " ,
    acceptAlphaNumeric : "Only alphanumeric are allowed for this field",
    digit : "Only Digit are allowed for this field",
    alphaBetwithhyphon:"Only alphabets and '-' are allowed for this field",
    addressForSpecific:"Address is not in valid format, Only '-','/','.' special chracters are allowed",
    address : "Address is not in valid format, Special Characters are not allowed (#,$,@ etc)"
}

// validation warning
// "Only alphabets are allowed for this field "
// "Only Numbers are allowed for this field " 
// "Only alphanumeric are allowed for this field"

