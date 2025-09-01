export const convertToFormikSelectJson = (key, value, dataObject, extraDataObj = {}, isExtraDataRequired = false, forClientCode = false, clientCodeWithName=false, valueForShow="") => {
    const tempArr = [{ key: '', value: 'Select' }];
    if (isExtraDataRequired) { tempArr.push(extraDataObj) }

    dataObject?.map((item,i) => {
        if (forClientCode) {
            let valShow = item[key] + ` - ` + item[value]
            tempArr.push({ key: item[key], value: valShow, optional1:item?.is_required})
        }else if(clientCodeWithName){
            let valShow = item[value] + ` - ` + item[valueForShow]
            tempArr.push({ key: item[key], value: valShow, optional1:item?.is_required})
        }else {
            tempArr.push({ key: item[key], value: item[value], optional1:item?.is_required})
        }
    })
    return tempArr
}