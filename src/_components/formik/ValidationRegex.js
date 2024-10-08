export const Regex = {
  acceptAlphabet: /^[aA-zZ\s]+$/,
  acceptAlphaNumericDot: /^[a-zA-Z0-9. ]+$/,
  acceptAlphaWithComma: /^[a-zA-Z,.\s]+$/,
  acceptNumber:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  acceptAlphaNumeric: /^[a-zA-Z0-9\s]+$/,
  alphaBetwithhyphon: /[a-zA-Z._^%$#!~@,-]+/,
  digit: /^[0-9]+$/,
  address: /^[a-zA-Z0-9\s,.'-]{3,}$/,
  addressForSpecific: /^[#.0-9a-zA-Z\s,-/]+$/,
  phoneNumber:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  ifscRegex: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  accountNoRgex: /^[a-zA-Z0-9]{2,25}$/,
  multipleSpace: /^\S+(\s{1}\S+)*$/,
  emailRegexForSpace: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  urlFormate:
    /^(https:\/\/(?!www)[^\s/$.?#].[^\s]*\.[a-z]+(\/[^\s]*)?)|(https:\/\/www\.[^\s/$.?#].[^\s]*\.[a-z]+(\/[^\s]*)?)$/,
  userNameRegex: /^[a-zA-Z0-9_.@]+$/,
  aadhaarRegex:
    /(^[0-9]{4}[0-9]{4}[0-9]{4}$)|(^[0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|(^[0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
  panRegex: /^[A-Z]{5}\d{4}[A-Z]$/,
  phoneRegExp:
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,

  pinCodeRegExp: /^[1-9][0-9]{5}$/,
  latitudeRegex: /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)/,
  longitudeRegex: /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)/,
};

export const RegexMsg = {
  acceptAlphabet: "Only alphabets are allowed for this field ",
  acceptNumber: "Only Numbers are allowed for this field ",
  acceptAlphaNumeric: "Only alphanumeric are allowed for this field",
  digit: "Only Digit are allowed for this field",
  alphaBetwithhyphon: "Only alphabets and '-' are allowed for this field",
  addressForSpecific:
    "Address is not in valid format, Only '-', '/' , '.' special chracters are allowed",
  address:
    "Address is not in valid format, Special Characters are not allowed (#,$,@ etc)",
  phoneNumber: "Phone number is not valid",
  password:
    "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special Character",
  ifscRegex: "Your IFSC code is Invalid and must be in capital letters",
  accountNoRgex: "Account Number format is invalid",
  multipleSpace: "Invalid input : Extra space not allowed",
  urlFormate: "Please enter a valid HTTPS URL",
  acceptAlphaNumericDot: "AlphaNumeric & dot are allowed",
  userNameRegex:
    "Username accept only alphanumeric and (`.`_ @) special characters",
  aadhaarRegex: "Aadhaar Number is Invalid",
  panRegex: "PAN is Invalid",
  phoneRegExp: "Phone number is not valid",
  pinRegex: "Invalid PIN code",
  latitudeRegex: "Invalid Latitude",
  longitudeRegex: "Invalid Longitude",
  acceptAlphaWithComma: "Please enter valid characters",
};

// if word length more then 20 char. then throw error
export const wordValidation = function (str, validCharLength = 20) {
  if (str?.length > 0) {
    const wordArr = str.split(" ");
    let notValidWord = [];
    notValidWord = wordArr.filter((word) => {
      return word.length > 20;
    });
    return notValidWord.length >= 1 ? false : true;
  }
};

// validation warning
// "Only alphabets are allowed for this field "
// "Only Numbers are allowed for this field "
// "Only alphanumeric are allowed for this field"
