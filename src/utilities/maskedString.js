export const maskedString = (string, lengthOfMasked = 0) => {

    const str = string?.toString();
    let maskedStr = []
    str?.split("").map((char, i) => {
        if (i > lengthOfMasked) {
            maskedStr.push(char)
        } else {
            maskedStr.push("*")
        }
        return char;
    })

    return maskedStr.join("").toString();

}