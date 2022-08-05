export const convertToFormikSelectJson = (key, value, dataObject, extraDataObj = {}, isExtraDataRequired=false) =>{
    const tempArr = [{key:'',value:'Select'}];
    if(isExtraDataRequired){tempArr.push(extraDataObj)} 

    dataObject.map(item=>{
        // console.log(item[key])
    tempArr.push({key:item[key],value:item[value].toUpperCase()})
    })
    return tempArr
}