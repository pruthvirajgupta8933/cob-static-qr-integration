export default function validation(values) {
    let errors = {}
    var regex = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    // var otp = /^((\\+[1-9]{1,4}[ \\-])|(\\([0-9]{2,3}\\)[ \\-])|([0-9]{2,4})[ \\-])?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
    
    // if(!values.input) {
    //     errors.password = 'ID is required'
    // } else if (values.input.length < 8) {
    //     errors.input = 'ID needs to be 6 characters or more'
    // }
    // else if (/^[!@#$%^&*()_-]+$/.test(values.input)) {
    //     errors.input = 'Transaction Id is invalid';
    // // }


    // Transaction Enquiry validation
    errors.input = true;
    if(!values.input) {
        errors.input = 'ID is required'
    }
    else if(regex.test(values.input)) {
        errors.input = 'Invalid Input'
    }
   else{
        errors.input = false;
    }

    errors.transactionId = true;
    if(!values.transactionId) {
        errors.transactionId = 'ID is required'
    }
    else if(regex.test(values.transactionId)) {
        errors.transactionId = 'Invalid Input'
    }
   else{
        errors.transactionId = false;
    }
    
    //---------------------------------------


    //Recieps Validation
    errors.studentId = true;
    if(!values.studentId) {
        errors.studentId = 'ID is required'
    }
    else if(regex.test(values.studentId)) {
        errors.studentId = 'Invalid Input'
    }
   else{
        errors.studentId = false;
    }

    //---------------------------------------

    //Email OTP
    errors.emailotp = true;
    if(!values.emailotp) {
        errors.emailotp = 'OTP Required'
    }

 else if (values.emailotp.length > 6) {
         errors.emailotp = 'OTP needs to 6 characters only'
     }


    else if(regex.test(values.emailotp)) {
        errors.emailotp = 'Invalid Input'
    }

    else{
        errors.emailotp = false;
    }

  
    //-------------------------------
 

    //SMS OTP
     
    errors.smsotp = true;
     if(!values.smsotp) {
        errors.smsotp = 'OTP Required'
    }

 else if (values.smsotp.length > 6) {
         errors.smsotp = 'OTP needs to 6 only'
     }

     else if(regex.test(values.smsotp)) {
        errors.smsotp = 'Invalid Input'
    }

    else {
    errors.emailotp = false;
    }

// console.log(errors)
    return errors;
}
