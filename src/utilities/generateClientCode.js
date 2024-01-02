
function getChar(string, retry, position = 0, charLen = 2) {
    const start = (position + retry);
    const charLength = charLen;
    return string.toString().substr(start, charLength)
}


function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

export const generateWord = (name, mobile, retry = 7) => {
    let newSuggestedClientCode = []
    const fullName = name.replace(/[^a-zA-Z0-9]/g, '');
    const splitName = fullName.split(" ")
    let wordChar = ""

    for (let i = 0; i < retry; i++) {
        if (splitName[0]?.length >= 1) {
            wordChar += getChar(splitName[0], 0, 0, 2)
        }

        if (splitName[1]?.length >= 2) {
            wordChar += getChar(splitName[1], i, 0, 2)
        } else {
            wordChar += getChar(splitName[0], i, 2, 2)
        }

        if (mobile.toString()?.length > 2) {
            if (wordChar?.length <= 4) {
                let leftChar = (6 - wordChar?.length)
                wordChar += getChar(mobile, i, 0, leftChar)
            } else {
                wordChar += getChar(mobile, i, 0, 2)
            }
        }
        !hasWhiteSpace(wordChar) && newSuggestedClientCode.push(wordChar.toUpperCase())
        wordChar = ""
    }
    return newSuggestedClientCode
}
