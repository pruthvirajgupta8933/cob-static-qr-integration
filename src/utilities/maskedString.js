export  const maskedString = (string="", lengthOfMasked) => {

    const str = string?.toString();
    let maskedStr = []
    str?.split("").map((char, i) => {
        if (i > lengthOfMasked) {
            maskedStr.push(char)
        } else {
            maskedStr.push("*")
        }
    })

    return maskedStr.join("").toString();

}