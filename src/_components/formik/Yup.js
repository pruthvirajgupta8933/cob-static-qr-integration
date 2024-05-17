import * as Yup from "yup";
import { wordValidation } from "./ValidationRegex";
// import { Regex, RegexMsg } from "./ValidationRegex";


// Custom method to restrict unwanted spaces
function noExtraSpaces(errorMessage = 'Extra space not allowed') {
    return this.test(
        'no-extra-spaces', // Test name
        errorMessage, // Error message
        function (value) { // Validation function
            const { path, createError } = this;
            // Regex to ensure only single spaces between words and no leading/trailing spaces
            const isValid = /^(?! )(?!.* {2})(?!.* $).*$/.test(value);
            return isValid || createError({ path, message: errorMessage });
        }
    );
}

// Adding the custom method to Yup.string
// Yup.addMethod(Yup.string, 'noExtraSpaces', noExtraSpaces);

// validation for wrod characters length
Yup.addMethod(Yup.string, "wordLength", function (errorMessage) {
    return this.test(`test-word-length`, errorMessage, function (value) {
        const { path, createError } = this;
        return (
            (wordValidation(value) === true) ||
            createError({ path, message: errorMessage })
        );
    });
});


Yup.addMethod(Yup.string, "allowOneSpace", noExtraSpaces);





export default Yup