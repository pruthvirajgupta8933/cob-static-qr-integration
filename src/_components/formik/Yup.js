import * as Yup from "yup";
import { wordValidation } from "./ValidationRegex";
import { Regex,RegexMsg } from "./ValidationRegex";


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

Yup.addMethod(Yup.string, "allowOneSpace", function (errorMessage) {
   const response = this.matches(Regex.multipleSpace, RegexMsg.multipleSpace , errorMessage); 
   return response
});





export default Yup