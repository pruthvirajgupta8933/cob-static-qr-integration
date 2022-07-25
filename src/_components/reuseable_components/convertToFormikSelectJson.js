export const convertToFormikSelectJson = (key, value, dataObject) =>{
    const tempArr = [{key:'',value:'Select'}];
    dataObject.map(item=>{
        // console.log(item[key])
    tempArr.push({key:item[key],value:item[value].toUpperCase()})
    })
    return tempArr
}