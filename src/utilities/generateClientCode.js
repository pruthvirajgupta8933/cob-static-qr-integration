
function getChar(string, retry, position = 0, charLen = 2) {
    const start = (position + retry);
    const charLength = charLen;
    return string.toString().substr(start, charLength)
}


function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function getPermutations(str) {
    if (str.length === 1) return [str];

    const permutations = [];
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const remaining = str.slice(0, i) + str.slice(i + 1);
        if (permutations?.length < 50) {
            const subPermutations = getPermutations(remaining);
            for (const perm of subPermutations) {
                permutations.push(char + perm);
            }
        }

    }
    return permutations;
}

export const generateWord = (name, mobile, retry = 1) => {
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
        // console.log("!hasWhiteSpace(wordChar)", !hasWhiteSpace(wordChar))
        if (!hasWhiteSpace(wordChar)) {
            newSuggestedClientCode = getPermutations(wordChar.toUpperCase())
        }
        wordChar = ""
    }
    return newSuggestedClientCode
}
