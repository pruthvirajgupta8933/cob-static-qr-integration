export function getQueryStr(url, postData) {
    let qryStr = "?"
    let i = 0
    for (let key in postData) {
        if (i === 0) {
            qryStr += `${key}=${postData[key]}`
        } else {
            qryStr += `&${key}=${postData[key]}`
        }
        i++
    }
    const apiUrl = url + "" + qryStr
    return apiUrl
}