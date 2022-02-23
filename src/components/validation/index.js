export default function validation(values) {
    let errors = {}
    var regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    
    // if(!values.input) {
    //     errors.password = 'ID is required'
    // } else if (values.input.length < 8) {
    //     errors.input = 'ID needs to be 6 characters or more'
    // }
    // else if (/^[!@#$%^&*()_-]+$/.test(values.input)) {
    //     errors.input = 'Transaction Id is invalid';
    // // }

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

    
console.log(errors)
    return errors;
}
