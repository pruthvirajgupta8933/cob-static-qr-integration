export const convertToFormikSelectJson = (key, value, dataObject, extraDataObj = {}, isExtraDataRequired = false, forClientCode = false) => {
    const tempArr = [{ key: '', value: 'Select' }];
    if (isExtraDataRequired) { tempArr.push(extraDataObj) }

    dataObject?.map((item,i) => {
        if (forClientCode) {
            let valShow = item[key] + ` - ` + item[value]
            tempArr.push({ key: item[key], value: valShow.toUpperCase()})
        } else {
            tempArr.push({ key: item[key], value: item[value].toUpperCase()})
        }
    })
    return tempArr
}