export default function validation(values) {
    let errors = {}
    
    if(!values.input) {
        errors.password = 'ID is required'
    } else if (values.input.length < 8) {
        errors.input = 'ID needs to be 6 characters or more'
    }
    else if (!/\S+@\S+\.\S+/.test(values.input)) {
        errors.input = 'Transaction Id is invalid';
    // }
    
    // if(!values.name) {
    //     errors.name = "Name Required "
    // }
    
    // //age
    // if(!values.age) {
    //     errors.age = 'Age is required'
    // }
    //  //address 
    //  if(!values.address) {
    //     errors.address = 'Address is required'
    // }
     

    // //email
    //  if(!values.email) {
    //     errors.email = "Username Required"
    // }   else if (!/\S+@\S+\.\S+/.test(values.email)) {
    //     errors.email = 'Email address is invalid';
    // }

    // if(!values.password2) {
    //     errors.password2 = 'Password is required'
    // } else if (values.password2 !== values.password) {
    //     errors.password2 = "Password do not match"
    // }

    }

    return errors;
}
