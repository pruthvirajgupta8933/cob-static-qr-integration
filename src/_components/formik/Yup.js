import * as Yup from "yup";
import { wordValidation } from "./ValidationRegex";


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




export default Yup